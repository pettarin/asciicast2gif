/*

                _ _               _   ____       _  __ 
  __ _ ___  ___(_|_) ___ __ _ ___| |_|___ \ __ _(_)/ _|
 / _` / __|/ __| | |/ __/ _` / __| __| __) / _` | | |_ 
| (_| \__ \ (__| | | (_| (_| \__ \ |_ / __/ (_| | |  _|
 \__,_|___/\___|_|_|\___\__,_|___/\__|_____\__, |_|_|  
                                           |___/       

Version 0.0.2

The MIT License (MIT)

Copyright (c) 2016 Alberto Pettarin (alberto@albertopettarin.it)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var system = require("system");
var webpage = require("webpage");

var argv;                   // the command line arguments
var ac_url;                 // the URL of the asciicast
var ac_width_px;               // the width of the asciicast, in pixels
var ac_height_px;              // the eight of the asciicast, in pixels
var tmp_dir;                // the temporary directory where screenshots are saved
var frame_rate;             // frame rate of the capture
var screenshot_interval;    // interval between screenshots, in seconds
var page;                   // phantomjs page object

function log_info(msg) {
    console.log("[INFO] " + msg);
}

function log_erro(msg) {
    console.log("[ERRO] " + msg);
}

function create_page() {
    var page = webpage.create();
    page.onResourceError = function(error) {
        log_erro(error.errorString);
    };
    page.onConsoleMessage = function(message) {
        log_info(message);
    };
    return page;
}

argv = system.args;

// check that all arguments has been passed
if (argv.length < 6) {
    log_info("Usage: screenshot.js URL WIDTH HEIGHT TEMP_DIR FRAME_RATE");
    phantom.exit(0);
} else {
    ac_url = argv[1];
    ac_width_px = argv[2];
    ac_height_px = argv[3];
    tmp_dir = argv[4];
    frame_rate = argv[5];
    screenshot_interval = 1000.0 / frame_rate;
}

// create page
page = create_page();

// set viewport size
page.viewportSize = {
    width: ac_width_px,
    height: ac_height_px
};

// open page
// the callback is invoked when the page has loaded
page.open(ac_url, function(stat) {

    // ensure the status is success
    // otherwise, print error and exit
    if (stat !== "success") {
        log_erro("Unable to open " + argv[1]);
        phantom.exit(1);
    }

    // set flags and shared variables
    var asciicast_end = false;
    var frame_index = 1;
    var last_progress = "";

    // this callback is executed when callPhantom() is called
    page.onCallback = function(capture, progress) {
        if (progress !== undefined) {
            // capture was started
            // and a progress string was reported
            var current_progress = parseInt(progress);
            if ((!isNaN(current_progress)) && (current_progress != last_progress)) {
                // store and print progress
                last_progress = current_progress;
                log_info("  Progress: " +  last_progress + "%");
            }
            return;
        }
        if (capture) {
            // start capture
            setInterval(function() {
                // if the asciicast is over, quit
                if (asciicast_end) {
                    // capture completed: quit
                    log_info("Capture completed");
                    phantom.exit(0);
                    return;
                }
                // otherwise capture next frame
                //log_info("  Capturing screenshot " + frame_index);
                var file_path = tmp_dir + "/" + (("00000000" + frame_index).substr(-8, 8)) + ".png";
                //log_info("  Saving as " + file_path);
                page.render(file_path, {format: "png"});
                frame_index++;

            }, screenshot_interval);
        } else {
            // capture completed: set asciicast_end flag
            log_info("  Progress: 100%");
            asciicast_end = true;
        }
    }; // end of page.onCallback

    // the actual "execution" starts here
    page.evaluate(function() {
        // TODO let the user control this
        // hide the control bar
        // NOTE this depends on asciinema-player CSS/JS
        document.getElementsByClassName("control-bar")[0].style.display = "none";

        // start capture
        callPhantom(true);

        // check if the player has finished once per second
        setInterval(function() {
            // NOTE this depends on asciinema-player CSS/JS
            var width = document.getElementsByClassName("gutter")[0].children[0].style.width;
            if (parseInt(width) >= 100) {
                // completed
                callPhantom(false);
                return;
            } else {
                // still playing
                callPhantom(true, width);
            }
        }, 1000);

        // send click to start playing the asciicast
        // NOTE this depends on asciinema-player CSS/JS
        var ev = document.createEvent("Events");
        ev.initEvent("click", true, false);
        document.getElementsByClassName("start-prompt")[0].dispatchEvent(ev);

    }); // end of page.evaluate

}); // end of page.open()




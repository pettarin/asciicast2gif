# asciicast2gif

**asciicast2gif** converts [asciicast](https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v1.md) files to animated GIF files

* Version: 0.0.2
* Date: 2016-02-07
* Developer: [Alberto Pettarin](http://www.albertopettarin.it/)
* License: the MIT License (MIT)
* Contact: [click here](http://www.albertopettarin.it/contact.html)

## Usage

![Usage asciicast GIF](gifs/usage.gif)

(Generating the output GIF file might take several seconds,
depending on the size/duration of the asciicast.)

## Synopsis

Run without arguments to get the following help message:

```bash
$ ./asciicast2gif

NAME
    asciicast2gif - convert an asciicast (asciinema JSON file) to an animated GIF file

SYNOPSIS
    ./asciicast2gif ASCIICAST.json [GIF_FILE_NAME] [OPTIONS]

OPTIONS
    --fps=NUM : generate gif with NUM frames per second (default: 10)
    --head=NUM : discard first NUM screenshots (default: 0)
    --keep : do not delete the temporary directory (default: delete)
    --nogif : do not generate GIF file (default: generate)
    --port=NUM : use port NUM for the local HTTP server (default: 8000)
    --size=[small|medium|big] : set player size (default: small)
    --speed=VAL : set player speed to VAL (default: 1)
    --tail=NUM : discard last NUM screenshots (default: 0)
    --theme=[asciinema|monokai|tango|solarized-dark|solarized-light] : use player theme (default: asciinema)
    --server=[py2|py3|py3.5|ruby|none] : use the given local HTTP server (default: py2)

EXAMPLES
    $ ./asciicast2gif your.json               => generate your.json.gif
    $ ./asciicast2gif your.json foo.gif       => generate foo.gif
    $ ./asciicast2gif your.json --fps=20      => generate your.json.gif at 20 frames/s
    $ ./asciicast2gif your.json --speed=1.5   => play asciicast at 1.5x speed
    $ ./asciicast2gif your.json --head=3      => discard first 3 screenshots
    $ ./asciicast2gif your.json --tail=5      => discard last 5 screenshots
    $ ./asciicast2gif your.json --server=ruby => use Ruby to start local HTTP server
    $ ./asciicast2gif your.json --server=none => local HTTP server is already running on port 8000
    $ ./asciicast2gif your.json --size=big    => set the player size to big
    $ ./asciicast2gif your.json --port=5000   => use local HTTP server port 5000
    $ ./asciicast2gif your.json --theme=tango => set the player theme to tango
```

## Requirements

1. [``bash``](https://www.gnu.org/software/bash/) shell
2. [``phantomjs``](http://phantomjs.org/) (>=2.0.0)
3. ``convert``, i.e. [``imagemagick``](http://www.imagemagick.org)
4. [``gifsicle``](https://github.com/kohler/gifsicle)
5. [``python``](https://www.python.org/) or [``ruby``](https://www.ruby-lang.org/)
   or a local HTTP server of your choice running on port ``8000``

## How It Works

``asciicast2gif`` is a Bash script that reads an asciicast JSON file
created by [asciinema](https://asciinema.org/),
patches a template HTML page generating a ``page.patched.html`` file,
and runs a local HTTP server to serve it in background.

(If you have ``python`` or ``ruby``,
``asciicast2gif`` starts and terminates the HTTP server for you;
otherwise, you can manually run any other HTTP server of your choice.)

The ``screenshot.js`` script, run inside ``phantomjs``,
periodically takes screenshots of the ``asciinema-player``
while it reproduces the asciicast,
saving them as PNG files.

Finally, ``convert`` and ``gifsicle`` generate the output GIF file.

NOTE: currently you need a local HTTP server because it seems that
``phantomjs`` and/or ``asciinema-player.js`` do not work
when fed a static local HTML file with the asciicast JSON file embedded.
Removing this limitation would help many users.
Please contribute if you figure it out.

## License

**asciicast2gif** is released under the terms of the [MIT License](LICENSE).

The ``page.template.html`` file in this repository contains an inlined version of
[``asciinema-player`` v2.0.0](https://github.com/asciinema/asciinema-player) (GPLv3 License).

## Changelog

* 2016-02-07 0.0.2 Removed dependency on jQuery; added optional arguments
* 2016-02-06 0.0.1 Initial release

## Limitations and Missing Features

* The input asciicast JSON file must be in the CWD
* Tested only on Debian, but it should be OK on other Linux distributions and OS X too
* Removing dependency from a running local HTTP server
* Removing bashisms
* There is no check that ``phantomjs``, ``convert``, and ``gifsicle`` are installed
* ``convert`` and ``gifsicle`` are quite slow

## Contribution Policy

Contributions are welcome!

Please follow the usual GitHub
[fork/new branch/pull-request flow](https://guides.github.com/activities/contributing-to-open-source/).

## Acknowledgments

* [Marcin Kulik "sickill"](https://asciinema.org/~sickill) and all the [``asciinema``](https://asciinema.org/) contributors
* ``asciicast2gif`` has been inspired by [``asciinema2gif``](https://github.com/tav/asciinema2gif) by ``tav``




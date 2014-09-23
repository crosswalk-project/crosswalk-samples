# space dodge game

A simple side-scrolling HTML5 game where you fly a spaceship and
dodge stuff. The game is used as a basis for demonstrating various
techniques for scaling a game to a device screen using Crosswalk.

The tutorial which uses this code is available at:
http://crosswalk-project.org/#documentation/screens

## Acknowledgements

Spaceship sprite by J.M. Atencia (http://opengameart.org/users/jmatencia)
from http://opengameart.org/content/rocket
CC BY 3.0

Asteroid sprite by phaelax (http://opengameart.org/users/phaelax)
from http://opengameart.org/content/asteroids
CC BY-SA 3.0

## Code organisation

There are 5 versions of the code.

The master version includes the base code before any optimisations are
applied.

The four Crosswalk* versions have different code, depending
on the version of Crosswalk used and the approach used to
fit the application into the device screen:

*   Crosswalk-6-scale

    *   landscape orientation set with `screen.lockOrientation()`
    *   fullscreen set with `--fullscreen` option to make_apk.py
    *   whole game scaled in CSS to fit screen

*   Crosswalk-6-resize

    *   landscape orientation set with `screen.lockOrientation()`
    *   fullscreen set with `--fullscreen` option to make_apk.py
    *   game elements resized to fit screen

*   Crosswalk-8-scale

    *   landscape orientation and fullscreen set in manifest
    *   `xwalk_launch_screen` enabled in manifest
    *   whole game scaled in CSS to fit screen

*   Crosswalk-8-resize

    *   landscape orientation and fullscreen set in manifest
    *   `xwalk_launch_screen` enabled in manifest
    *   game elements resized to fit screen

The Crosswalk-6* versions should also work with Crosswalk 5 and 7 (6
is the version they were tested with); the Crosswalk-8* versions should
work with Crosswalk version 8 or above.

## Android packages

To create an Android package for the game, follow the instructions at:
https://crosswalk-project.org/#documentation/getting_started/run_on_android

You will need the correct version of Crosswalk for the version of
the code you intend to package (see above).

When building the Crosswalk 6 versions, you will need to pass the
`--fullscreen` option for the game to run in fullscreen, e.g.

    python make_apk.py --fullscreen --manifest=Crosswalk-6-scale/manifest.json \
      --package=org.crosswalkproject.sample

    python make_apk.py --fullscreen --manifest=Crosswalk-6-resize/manifest.json \
      --package=org.crosswalkproject.sample

`--fullscreen` is not required for the Crosswalk 8 versions, e.g.

    python make_apk.py --manifest=Crosswalk-8-scale/manifest.json \
      --package=org.crosswalkproject.sample

    python make_apk.py --manifest=Crosswalk-8-resize/manifest.json \
      --package=org.crosswalkproject.sample

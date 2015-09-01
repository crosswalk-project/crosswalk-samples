# Space Dodge Game

A simple side-scrolling HTML5 game where you fly a spaceship and
dodge stuff. The game is used as a basis for demonstrating various
techniques for scaling a game to a device screen using Crosswalk
Project.

The tutorial which uses this code is available at:
https://crosswalk-project.org/documentation/screens.html

## Acknowledgements

Spaceship sprite by [J.M. Atencia](http://opengameart.org/users/jmatencia)
from http://opengameart.org/content/rocket
CC BY 3.0

Asteroid sprite by [phaelax](http://opengameart.org/users/phaelax)
from http://opengameart.org/content/asteroids
CC BY-SA 3.0

## Code organisation

There are 5 versions of the code.

The base version includes the base code before any optimisations are
applied.

The other four versions have different code, depending on
the approach used to fit the application into the device screen:

*   screen-orientation-scale

    *   landscape orientation set with `screen.orientation.lock()`
    *   fullscreen set with `document.documentElement.webkitRequestFullScreen()`
    *   whole game scaled in CSS to fit screen

*   screen-orientation-resize

    *   landscape orientation set with `screen.orientation.lock()`
    *   fullscreen set with `document.documentElement.webkitRequestFullScreen()`
    *   game elements resized to fit screen

*   manifest-orientation-scale

    *   landscape orientation and fullscreen set in manifest
    *   `xwalk_launch_screen` enabled in manifest
    *   whole game scaled in CSS to fit screen

*   manifest-orientation-resize

    *   landscape orientation and fullscreen set in manifest
    *   `xwalk_launch_screen` enabled in manifest
    *   game elements resized to fit screen

All the 5 versions should work with latest Crosswalk Project.

## Android packages

To create an Android package for the game, follow the instructions at:
https://crosswalk-project.org/#documentation/getting_started/run_on_android

    python make_apk.py --package=org.crosswalkproject.spacedodge \
      --manifest=screen-orientation-scale/manifest.json

    python make_apk.py --package=org.crosswalkproject.spacedodge \
      --manifest=screen-orientation-resize/manifest.json

    python make_apk.py --package=org.crosswalkproject.spacedodge \
      --manifest=manifest-orientation-scale/manifest.json

    python make_apk.py --package=org.crosswalkproject.spacedodge \
      --manifest=manifest-orientation-resize/manifest.json


# Introduction

Source code to accompany the Crosswalk Android extensions tutorial:

*   `xwalk-echo-extension-src/`

    Source for the xwalk-echo-extension Crosswalk extension for Android.

*   `xwalk-echo-app/`

    Simple HTML5 app which uses xwalk-echo-extension.

# Pre-requisites

What you need first:

*   You'll need to set up your host for Crosswalk Android development
*   You'll need an Android device (real or emulated) to deploy to

See https://crosswalk-project.org/#documentation/getting_started
for details, particularly the host and target setup instructions.

# Building

The build is in three steps:

*   Download Ivy (NB this is done manually so that Ivy doesn't have to
be included in the distribution).
*   Build the extension. This step includes downloading Crosswalk for
Android.
*   Package the application with the extension.

The `build.sh` file will perform these steps for you. It needs to be
executable, e.g. on Linux:

    chmod +x build.sh

Then run it with:

    ./build.sh

The locations of the output apk files are displayed when the script
finishes.

Once done, deploy an apk to the Android target with:

    adb install /path/to/apk/file

Make sure you use the right apk file for your architecture (x86 or ARM).

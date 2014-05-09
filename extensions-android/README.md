# Introduction

Source code to accompany the Crosswalk Android extensions tutorial

*   xwalk-audiofs-extension-src/
   
    source for the xwalk-audiofs-extension Crosswalk extension for Android

*   xwalk-player/

    simple HTML5 audio player which uses xwalk-audiofs-extension

# Licences

Note that the following third party software will be downloaded to
assist in building the extension:

*   android.jar: Apache v2 licence
*   Apache Ivy: Apache v2 licence
*   Google Gson: Apache v2 licence

None of the source or binaries from these projects is distributed as
part of the crosswalk-samples source code, only referred to from build
scripts. However, if you plan to use this sample as a basis for
your own work, be aware that the built apk files *will* contain Google
Gson binary files.

# Pre-requisites

What you need first:

*   You'll need to set up your host for Crosswalk Android development.
*   You'll need an Android device (real or emulated) to deploy to.

See https://crosswalk-project.org/#documentation/getting_started
for details, particularly the host and target setup instructions.

# Building

The build is in three steps:

*   Download Ivy (NB this is done manually so that Ivy doesn't have to
be included in the distribution).
*   Build the extension with Ant. This step includes downloading
Crosswalk for Android.
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

# AAR sample

A simple of using Crosswalk runtime library with Android Studio.

The tutorial which uses this code is available at:
https://crosswalk-project.org/documentation/embedding_crosswalk/crosswalk_aar.html

## Code organisation

The project is based on the auto-generated project skeleton code from Android Studio.

Support different CPU architectures with each APK (such as for ARM, x86).
A product flavor defines a customized version of the application build by the project.
We can have different flavors which generate apk for each architecture.

## Embedding the Crosswalk Project

The Crosswalk Project embedding API enables you to embed the Crosswalk Project runtime
in an Android application. You can then load a web page (or whole web application) into
the embedded runtime, similar to how you might with an Android WebView.

https://crosswalk-project.org/documentation/embedding_crosswalk.html

## Crosswalk AAR

The Crosswalk AAR bundle is the binary distribution of the xwalk_core_library and
includes both x86 and armv7 architectures. A developer no longer needs to download the
crosswalk-webview bundle manually but can specify a version code using either the Gradle
or Maven projects.

https://crosswalk-project.org/documentation/embedding_crosswalk/crosswalk_aar.html


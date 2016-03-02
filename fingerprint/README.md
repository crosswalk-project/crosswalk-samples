## Run example on Android platform
1. Install Crosswalk App Tools, see https://github.com/crosswalk-project/crosswalk-app-tools for details.
2. Download the extension zip file from https://github.com/crosswalk-project/crosswalk-android-extensions/releases and unpack it, change ```"xwalk_extensions"``` to the path of the extensions in manifest.json.
3. Run ```crosswalk-pkg```:
    ```
    crosswalk-pkg --targets="arm" --platform="android" --release \
    --crosswalk=/path/to/xwalk_app_template www/
    ```
4. Sign the apk manually, see https://developer.android.com/tools/publishing/app-signing.html#signing-manually for details.

## Run example on iOS platform.
1. Install the pods for the example.

   ```bash
   cd iOS
   pod install
   ```
2. Open the ```FingerprintDemo.xcworkspace```, run the example.

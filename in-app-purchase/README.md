## Package for Google Play&XiaoMi Store on Android
1. Install Crosswalk App Tools, see https://github.com/crosswalk-project/crosswalk-app-tools for details.
2. Change ```"xwalk_package_id"``` in manifest.json to the value below:
   * ```"com.crosswalk.iapsample"``` for Google Play.
   * ```"com.sdk.migame.payment"``` for XiaoMi Store.
3. Download the extension zip file from https://github.com/crosswalk-project/crosswalk-android-extensions/releases and unpack it, change ```"xwalk_extensions"``` to the path of the extensions in manifest.json.
4. Add the following additional permissions in the default AndroidManifest.xml:

   ```
   <uses-permission android:name="com.android.vending.BILLING" />
   <uses-permission android:name="android.permission.GET_TASKS"/>
   <uses-permission android:name="android.permission.GET_ACCOUNTS"/>
   <uses-permission android:name="com.xiaomi.sdk.permission.PAYMENT"/>
   ```
5. If you want to use XiaoMi Store, you have to embed the ```MiGameCenterSDKService.apk``` and put it under
the ```assets``` folder of your project, please download it from http://file.market.xiaomi.com/download/Wali/03e214556fc45326e72bf816ff501eb8f3d428294/MISDKservice4.4.33.rar
6. Run ```crosswalk-pkg```:
    ```
    crosswalk-pkg --targets="arm" --platform="android" --release \
    --crosswalk=/path/to/xwalk_app_template www/
    ```
7. Sign the apk manually, see https://developer.android.com/tools/publishing/app-signing.html#signing-manually for details.

## Run example on iOS platform.
1. Install the pods for the example.

   ```bash
   cd iOS
   pod install
   ```
2. Open the ```InAppPurchaseDemo.xcworkspace```, run the example.

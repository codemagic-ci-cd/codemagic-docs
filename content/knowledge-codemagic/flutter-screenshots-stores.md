---
description: Generate screenshots for a Flutter app with golden testing and upload them to the stores
title: Screenshots
weight: 5
aliases:
  - /flutter/generate-upload-screenshots-stores
  - /flutter-configuration/generate-upload-screenshots-stores
---

If you are going to publish your Flutter app to **App Store Connect** or the **Google Play Store**, you can automate the process of taking screenshots and uploading them to the stores so your users can discover your app.

In order to strictly follow the steps below, you'll need to use [Riverpod](https://pub.dev/packages/flutter_riverpod) (for dependendy injection) and [intl](https://pub.dev/packages/intl) (for internationalization) in your Flutter project. While it might not be necessary for your project, it’s important to keep in mind that, if you want this approach to work, you’ll have to properly separate the UI from the logic in your code, using Riverpod or something else, so you can easily mock anything you want.

## Automate screenshots generation

The screenshots will be generated thans to golden testing, using the [Golden Toolkit](https://pub.dev/packages/golden_toolkit) package. In the steps below, the screenshots will be illustrated as they are commonly seen in the stores. For each illustrated screenshot, here are the main steps to follow:
- You first take a screenshot of the screen you want
- You load the generated image using  `MemoryImage`
- You generate a new Flutter widget with all the needed decorations, texts, backgrounds… to decorate the screenshot
- You take a final screenshot of that widget

Create a wrapper for the screen, so you'll be able to screenshot it later:

{{< highlight bash "style=paraiso-dark">}}
Widget getScreenWrapper({
  required Widget child,
  required Locale locale,
  required bool isAndroid,
  List<Override> overrides = const [],
})
{
  return ProviderScope(
    overrides: overrides,
    child: MaterialApp(
      debugShowCheckedModeBanner: false,
      supportedLocales: L10n.all,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ],
      locale: locale,
      theme: ThemeData(
        platform: (isAndroid ? TargetPlatform.android : TargetPlatform.iOS),
      ),
      home: Column(
        children: [
          Container(color: Colors.black, height: 24), // fake, black and empty status bar
          Expanded(child: child),
        ],
      ),
    ),
  );
}
{{< /highlight >}}

The `getScreenWrapper()` function above returns the final screen to screenshot and here are its arguments:
- The `child` argument is the screen you want to take a screenshot of.
- The `locale` argument is the language you want to use for your screenshot.
- The `isAndroid` argument is important here to get a rendering specific to each OS.
- The `overrides` argument is useful to mock the logic of your app (database or webservices calls for example).
- In that example, we use black for the status bar color, which is actually a basic rectangle. But you can change it to whatever you want.

In order to get your fonts working, you’ll need to add the following `flutter_test_config.dart` file in your `test/` directory, with the following content:

{{< highlight bash "style=paraiso-dark">}}
import 'dart:async';
import 'package:flutter_test/flutter_test.dart';
import 'package:golden_toolkit/golden_toolkit.dart';

Future<void> testExecutable(FutureOr<void> Function() testMain) async
{
  TestWidgetsFlutterBinding.ensureInitialized();
  await loadAppFonts();
  return testMain();
}
{{< /highlight >}}

There are specific requirements for the screenshots sizes. Here are the size and densities that you can use for both the Google Play Store and the App Store Connect:

| **Device**                        | **Screen size**                          | **Screen density** |
| --------------------------------- | ---------------------------------------- | ------------------ |
| Android smartphone                | `1107 x 1968`                            | `3`                |
| 7 inches Android tablet           | `1206 x 2144`                            | `2`                |
| 10 inches Android tablet          | `1449 x 2576`                            | `2`                |
| iPad pro 2nd gen                  | `2048 x 2732`                            | `2`                |
| iPad pro 6th gen                  | `2048 x 2732`                            | `2`                |
| iPhone 8 Plus                     | `1242 x 2208`                            | `3`                |
| iPhone Xs Max                     | `1242 x 2688`                            | `3`                |

Note that while the sizes for the App Store Connect have to be specifically those sizes, the Google Play Store is more permissive. Also, if you want to display what your app looks like on a tablet, prefer the portrait mode (if it still makes sense for your app, of course), so your users can see more screens on the store without any swipe.

When it comes to naming the screenshots files to be uploaded to the stores, you can name them anything you want. But keep in mind that:

- They will display in the stores in alphabetical order.
- For the App Store Connect, since the two iPads have exactly the same size, we need to differentiate them by naming the iPad pro 6th gen files with a name that should contain `IPAD_PRO_3GEN_129` (other values are possible as you can see in the [deliver documentation](https://docs.fastlane.tools/actions/deliver/)).

Now you can take a screenshot of your screen (wrapped with the `getScreenWrapper()` function above), using the [Golden Toolkit](https://pub.dev/packages/golden_toolkit) package:

{{< highlight bash "style=paraiso-dark">}}
Future<void> takeScreenshot({
   required WidgetTester tester,
   required Widget widget,
   required String pageName,
   required bool isFinal,
   required Size sizeDp,
   required double density,
   CustomPump? customPump,
 }) async
 {
   await tester.pumpWidgetBuilder(widget);
   await multiScreenGolden(
     tester,
     pageName,
     customPump: customPump,
     devices: [
       Device(
         name: isFinal ? "final" : "screen",
         size: sizeDp,
         textScale: 1,
         devicePixelRatio: density,
       ),
     ],
   );
 }
{{< /highlight >}}


Here are some important notes about the arguments:
- The `widget` argument is the widget you want to screenshot.
- The `pageName` argument is the name of the image file containing your screenshot.
- Since you'll take 2 screenshots per screen (one for the screen itself, another one for the final illustration), you’ll pass `false` for the `isFinal` argument here for the moment.
- The `density` argument is the density of the device screen as specified above.
- The `sizeDp` argument is the size of the device screen, where its width and height **_have to be divided by the density_**. For example, for the iPhone Xs Max, you’ll pass: `Size(1242 / 3, 2688 / 3)`.
- The `customPump` argument, although not mandatory, can be useful in some cases. By default, the [Golden Toolkit](https://pub.dev/packages/golden_toolkit) package uses `pumpAndSettle()`, which can sometimes block the rendering if, for example, there is an infinite animation. In that case, you can pass the following argument (only for the first screenshot): `(tester) async => await tester.pump(const Duration(milliseconds: 200))`.

Calling the `takeScreenshot()` function above generates an image file. You can load it into an image widget as follows:

{{< highlight bash "style=paraiso-dark">}}
final screenFile = File("test/screenshots/goldens/$pageName.screen.png");  
final memoryImage = MemoryImage(screenFile.readAsBytesSync());  
final image = Image(image: memoryImage);
{{< /highlight >}}

Now you can decorate your screenshot, using a function like the following that returns a new widget. Note that you might need to pass multiple arguments, including the screen information, depending on what you want to draw:

{{< highlight bash "style=paraiso-dark">}}
Widget getDecoratedScreen(Widget image, ...)
{
  return Container(
    child: ... // draw anything you want
  );
}
{{< /highlight >}}

You can now take a screenshot of the widget returned by the `getDecoratedScreen()` function above, again with the `takeScreenshot()` function. Note that this time, you shouldn't need to pass anything to the `customPump` argument.

Finally, you can delete the first screenshot (the one in `screenFile` above): `screenFile.deleteSync()`.

In order to keep your screenshots tests class separated from your other golden tests and unit tests, you may want to do as follow:

- Add a tag at the very top of the test class that generates the screenshots, for example  `[@Tags]([“screenshots”])`, then generate your illustrations with:  `flutter test --update-goldens --tags=screenshots`
- In order to launch your other tests without interfering with the screenshots test class, add the following argument to exclude the screenshots tests class: `-x screenshots`

One last thing: some screens display a back button in the app bar, but with that method above, that button won’t display. Here is what you can do:

- Create a provider:  
    `final platformScreenshotProvider = Provider<bool?>((ref) => null);`
- Even though that provider value is `null` by default, it will be overridden in the golden tests like this: `platformScreenshotProvider.overrideWithValue(isAndroid)`, where `isAndroid` can be `true` or `false` whether you’re on Android or iOS, and which returns an `Override` that you can pass in the `overrides` array argument of the `getScreenWrapper()` function above, like any other override.
- Create a fake app bar back icon:

{{< highlight bash "style=paraiso-dark">}}
class AppBarBackIcon extends ConsumerWidget
{
  @override
  Widget build(BuildContext context, WidgetRef ref)
  {
    return (ref.read(platformScreenshotProvider) == true
        ? Icon(Icons.arrow_back_sharp)
        : Icon(Icons.arrow_back_ios_sharp));
  }
}
{{< /highlight >}}

- Use that icon for the `leading` argument of the app bar in your app:

{{< highlight bash "style=paraiso-dark">}}
leading: (ref.read(platformScreenshotProvider) != null
        ? const AppBarBackIcon()
        : null)
{{< /highlight >}}

Note that this provider can be use anywhere in your app, to fake entered text in a `TextFormField` for example.

## Automatically upload screenshots to the stores

To upload the screenshots to the stores, we will use the same strategy for both the Google Play Store and the App Store Connect: upload the screenshots while we deploy the app.

To achieve that, we will use Fastlane. Fastlane is a set of open-source tools and scripts that automates building, testing, and deploying mobile apps for both iOS and Android.

You can easily install Fastlane on your local machine with the following command: `sudo gem install fastlane`.

Once installed, we need to set it up. Open a terminal and go to the root of your Flutter project.

### Android

- Go to the `android` directory: `cd android`.
- Run the following command: `sudo fastlane init`.
- Follow the instructions with the minimum requirements.
- At that point, you might need to change the owners of the generated files, since we used `sudo`:

{{< highlight bash "style=paraiso-dark">}}
sudo chown your_id fastlane/
sudo chown -R your_id fastlane/*
sudo chown your_id Gemfile
sudo chown your_id Gemfile.lock
{{< /highlight >}}

- Now, we need an API Key, which is a JSON. Just follow this [short video](https://youtu.be/qrtk6e0BYjM?t=18) to learn how to get that key. Let's name that file `google-play-store.json`.
- For testing purposes, we can locally save that file in the `android` directory. But don’t forget to add it in your `.gitignore` file.
- Now you can test that Fastlane can communicate with your store with the following command:`fastlane run validate_play_store_json_key json_key:google-play-store.json`
- Edit your `Appfile` file so you can update it like the following:

{{< highlight bash "style=paraiso-dark">}}
# Path to the json secret file, relative to the "android" directory:
json_key_file("google-play-store.json")

# Package name (actually your application ID):
package_name("com.example.app")
{{< /highlight >}}

- Finally, in order to locally get all the current screenshots and metadata with the right files and folders, run: `sudo fastlane supply init`. Here again, you might need to change the owners of the generated files as explained above.

### iOS

- Go to the `ios` directory: `cd ios`.
- Run the following command: `sudo fastlane init`.
- Follow the instructions with the minimum requirements: choose `Manual setup`, and continue. **Be careful not to create an app on App Store Connect at this point**.
- Again, you might need to change the owners of the generated files, since we used `sudo`:

{{< highlight bash "style=paraiso-dark">}}
sudo chown your_id fastlane/ 
sudo chown -R your_id fastlane/* 
sudo chown your_id Gemfile 
sudo chown your_id Gemfile.lock
{{< /highlight >}}

- Now, we need an API Key, which is a JSON. Let's name that file `app_store_connect.json`, which will look like the following:

{{< highlight bash "style=paraiso-dark">}}
{
    "key_id": "D123SF789",
    "issuer_id": "1234a5cd-12a3-4acb-56dd-123bb1234567",
    "key": "-----BEGIN PRIVATE KEY-----\n[...]\n-----END PRIVATE KEY-----"
}
{{< /highlight >}}

To get the different values, login to the App Store Connect, then go to _My Apps > Users and access > Keys_. Here you can generate a new API Key, which content will go into `key` in the JSON above. On that same page, you can also find the key ID that you’ve just created, and the Issuer ID that you can find on the top of the list.

- For testing purposes, we can locally save that file in the `ios` directory. But don’t forget to add it in your `.gitignore` file.
- Edit your `Appfile` file so you can update it like the following:

{{< highlight bash "style=paraiso-dark">}}
app_identifier("com.example.app") # The bundle identifier of your app 
apple_id("yourlogin@icloud.com") # Your Apple Developer Portal username 
itc_team_id("123456789") # App Store Connect Team ID 
team_id("123A4P567S") # Developer Portal Team ID
{{< /highlight >}}

- In order to locally get all the current screenshots and metadata with the right files and folders , run:
   `sudo fastlane deliver init --use_live_version true`.
   Here again, you might need to change the owners of the generated files as explained above.
- Finally, if your app does not use encryption, in your `Info.plist` file, add the `ITSAppUsesNonExemptEncryption` key with `false` for its value.

### Flutter

Now you can add the following in your `.gitignore` file, at the root of your Flutter project:

{{< highlight bash "style=paraiso-dark">}}
/android/fastlane/metadata/android/fr-FR/images/
/android/fastlane/metadata/android/en-US/images/
/android/google-play-store.json

/ios/fastlane/screenshots
/ios/app_store_connect.json
{{< /highlight >}}

Since the `google-play-store.json` and the `app_store_connect.json` files are not meant to be added to your repository, we need to provide them in the CI in a safe way.

With Codemagic, you can for example store the content of the `google-play-store.json` file in a encrypted environment variable named `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`, and run a script in your CI that will generate the `google-play-store.json` in the right location, with the right content, by doing as follow:

{{< highlight bash "style=paraiso-dark">}}
echo $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS > android/google-play-store.json
{{< /highlight >}}

Then in your CI, you can write a script that copies the generated illustrations in the right directories. For example, here is how you can copy your illustrations for the French Android version of your app:

{{< highlight bash "style=paraiso-dark">}}
mkdir -p android/fastlane/metadata/android/fr-FR/images/phoneScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/sevenInchScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/tenInchScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/tvScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/wearScreenshots
cp test/screenshots/goldens/fr.android_smartphone.* android/fastlane/metadata/android/fr-FR/images/phoneScreenshots/
cp test/screenshots/goldens/fr.android_tablet_7.* android/fastlane/metadata/android/fr-FR/images/sevenInchScreenshots/
cp test/screenshots/goldens/fr.android_tablet_10.* android/fastlane/metadata/android/fr-FR/images/tenInchScreenshots/
{{< /highlight >}}

### Fastfile

One last step: the `Fastfile` files, one for Android, one for iOS, that will each contain the detailed command to deploy everything to each store.

Here is what the `Fastfile` file looks like for the Google Play Store (go to the  [supply](https://docs.fastlane.tools/actions/supply/)  documentation for more information):

{{< highlight bash "style=paraiso-dark">}}
default_platform(:android)

platform :android do
  desc "Deploy app with screenshots to the Google Play Store"
  lane :deployapp do |options|
    supply(
      package_name: "com.example.app", # put your own package name instead
      aab: "../build/app/outputs/bundle/release/app-release.aab", # check if it's the right path for you
      skip_upload_apk: "true",
      skip_upload_aab: "false",
      skip_upload_metadata: "false",
      skip_upload_changelogs: "false",
      skip_upload_images: "false",
      skip_upload_screenshots: "false",
      json_key: "google-play-store.json",
      track: "production",
      metadata_path: "./fastlane/metadata/android",
      version_code: options[:versionCode].to_i
    )
  end
end
{{< /highlight >}}

And here is what the `Fastfile` file looks like for the App Store Connect (go to the [deliver](http://docs.fastlane.tools/actions/deliver) documentation for more information):

{{< highlight bash "style=paraiso-dark">}}
default_platform(:ios)

platform :ios do
  desc "Deploy app with screenshots to App Store Connect"
  lane :deployapp do |options|
    deliver(
      api_key_path: "./app_store_connect.json",
      app_version: options[:versionName],
      ipa: "../build/ios/ipa/mistikee.ipa",
      submit_for_review: true,
      skip_binary_upload: false,
      skip_metadata: false,
      skip_app_version_update: false,
      skip_screenshots: false,
      overwrite_screenshots: true,
      metadata_path: "./fastlane/metadata",
      screenshots_path: "./fastlane/screenshots",
      languages: ['en-US','fr-FR'], # or any other languages according to your needs
      precheck_include_in_app_purchases: false,
      force: true,
      submission_information: {
        add_id_info_limits_tracking: true,
        add_id_info_serves_ads: true, # or false, depending on your app having ads or not
        add_id_info_tracks_action: true,
        add_id_info_tracks_install: true,
        add_id_info_uses_idfa: true,
        content_rights_has_rights: true,
        content_rights_contains_third_party_content: true,
        export_compliance_platform: "ios",
        export_compliance_compliance_required: false,
        export_compliance_encryption_updated: false,
        export_compliance_app_type: nil,
        export_compliance_uses_encryption: false,
        export_compliance_is_exempt: false,
        export_compliance_contains_third_party_cryptography: false,
        export_compliance_contains_proprietary_cryptography: false,
        export_compliance_available_on_french_store: true
      }
    )
  end
end
{{< /highlight >}}

Now, in your CI, in order to run the `deployapp` command above for the Google Play Store, you just need to run the following script:

{{< highlight bash "style=paraiso-dark">}}
cd android/
fastlane deployapp versionCode:1 # put your own version code here
{{< /highlight >}}


And for the `deployapp` command above for the App Store Connect, here is the script:

{{< highlight bash "style=paraiso-dark">}}
cd ios/
fastlane deployapp versionName:"1.0.0" # put your own version name here
{{< /highlight >}}

Note that the App Store Connect might sometimes be buggy when it comes to deleting the previous screenshots. If that operation takes too much time (it should be done in a matter of seconds), don’t hesitate to interrupt the script and run your CI all over again.


---
description: Generate screenshots for a Flutter app with golden testing and upload them to the stores
title: Screenshots
weight: 5
aliases:
  - /flutter/generate-upload-screenshots-stores
  - /flutter-configuration/generate-upload-screenshots-stores
---

If you are going to publish your Flutter app to **App Store Connect** or the **Google Play Store**, you'll need to prepare screenshots to upload to the stores so your users can discover your app. This can quickly become time consuming, so maybe you want to automate screenshot generation. Or at least you should consider it.

Let's consider an example here:
- You want to show 3 screens so your users understand the basics of your app
- Those screens will be illustrated with a shape of a device and a text on top
- You want to add a 4th illustration before your illustrated screenshots that will be your slogan
- You need to generate screenshots for 3 devices on the Google Play Store (one smartphone, 2 tablets)
- You need to generate screenshots for 4 devices on the App Store Connect (2 iPhones, 2 iPads)
- Your app comes in 2 flavors (a free version and a full version, for example)
- Your app is available in 2 languages

That makes a total of… **_112 illustrations_** to generate!!!

_On a side note, creating two flavors for a free and a full version might not be the best idea here. It adds a bit of complexity and it’s not always very easy to understand for your users. You may want to use in-app purchase instead. But again, it's just for example's sake._

## Common approach to screenshots generation

One common approach to the  _taking screenshots_  problem is to call a library that will take screenshots for you during integration tests. One of the most popular is  [screenshots](https://pub.dev/packages/screenshots)  (don’t forget the “s” in the end!). It’s a great tool and you definitely should try it, since it will work on pretty much every use case.

But there may be some drawbacks to that approach:
- You need to run multiple emulators, which can lead to a long process and be quite tricky to implement in a CI
- Even though you can  _frame_  (or  _decorate_) your screenshots, you still need to make the final illustrations by yourself

## Generate screenshots using golden testing

First, let's take a look at an example of what we want to achieve. Here are the decorated screenshots of _Mistikee_, a password manager. Everything you see here is fully generated only using Flutter:

![Fully generated illustrations for the app stores](https://miro.medium.com/v2/resize:fit:700/1*isDHSQyiRNRUc6Ou1ydXzg.png)

Here is basically what you will do, for each  _illustrated screenshot_. In one golden test:
- You first take a screenshot of the screen you want
- You load the generated image using  `MemoryImage`
- You generate a new Flutter widget with all the needed decorations, texts, backgrounds… to decorate the screenshot
- You take a final screenshot of that widget

The advantages here:
- You can draw anything you want to illustrate your screenshots only using Flutter
- You can easily mock your logic and choose to display the fake data you want in your screens
- You will generate all the 112 illustrations in about 30 seconds locally, using one command line, without any emulator

One important thing to mention here: in that example, I make a heavy use of Riverpod in my app, not only for state management, but also for dependency injection. While it might not be necessary for your project, it’s important to keep in mind that, if you want this approach to work, you’ll have to properly separate the UI from the logic in your code, using Riverpod or something else, so you can easily mock anything you want. That would also make your unit tests and golden tests easier to implement.

Also I cannot guarantee that it will work everywhere, especially in big project. That being said, I’m pretty confident that it should be doable if your application is well-structured (with Clean Architecture, for example).

### Tutorial

Starting from now, for the sake of simplicity, I won’t speak about the flavors. Also, as a reminder, I use [Riverpod](https://pub.dev/packages/flutter_riverpod) in my examples, and I also use  [intl](https://pub.dev/packages/intl)  for internationalization.

Now here are the steps to follow:

**STEP 1:** Create a _wrapper_ for the screen:

```Dart
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
```

A few things to mention here:

- The `child` argument is the screen you want to take a screenshot of.
- The `locale` argument is the language you want to use for your screenshot.
- The `isAndroid` argument is important here to get a rendering specific to each OS.
- The `overrides` argument is useful to mock the logic of your app (database or webservices calls for example).
- To make it easier to understand, I use black for the status bar color, which is actually a basic rectangle. But you can change it to whatever you want.

The `getScreenWrapper()` function above returns the final screen we want to screenshot. But we first need to prepare the screenshot process.

**STEP 2 (_Optional_):** Some screens display a back button in the app bar, but with that method above, that button won’t display. So the little trick I use here is to:

- Create a provider:  
    `final platformScreenshotProvider = Provider<bool?>((ref) => null);`
- Even though that provider value is `null` by default, it will be overridden in the golden tests like this: `platformScreenshotProvider.overrideWithValue(isAndroid)`, where `isAndroid` can be `true` or `false` whether you’re on Android or iOS, and which returns an `Override` that you can pass in the `overrides` array argument of the `getScreenWrapper()` function above, like any other override.
- Create a fake app bar back icon:

```Dart
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
```

- Use that icon for the `leading` argument of the app bar in your app:

```Dart
leading: (ref.read(platformScreenshotProvider) != null
        ? const AppBarBackIcon()
        : null)
```

Note that this provider can be use anywhere in your app, to fake entered text in a `TextFormField` for example.

**STEP 3:** There are specific requirements for the screenshots sizes. Here are the size and densities (we’ll need that info for later) that I use for both the Google Play Store and the App Store Connect:

- Android smartphone: 1107 x 1968 (density: 3)
- 7 inches Android tablet: 1206 x 2144 (density: 2)
- 10 inches Android tablet: 1449 x 2576 (density: 2)
- iPad pro 2nd gen: 2048 x 2732 (density: 2)
- iPad pro 6th gen: 2048 x 2732 (density: 2)
- iPhone 8 Plus: 1242 x 2208 (density: 3)
- iPhone Xs Max: 1242 x 2688 (density: 3)

Note that while the sizes for the App Store Connect have to be specifically what I mentioned, the Google Play Store is more permissive. Also, if you want to display what your app looks like on a tablet, prefer the portrait mode (if it still makes sense for your app, of course), so your users can see more screens on the store without any swipe.

**STEP 4:** When it comes to naming the screenshots files to be uploaded to the stores, you can name them anything you want. But keep in mind that:

- They will display in the stores in alphabetical order.
- For the App Store Connect, since the two iPads have exactly the same size, we need to differentiate them by naming the iPad pro 6th gen files with a name that should contain `IPAD_PRO_3GEN_129` (other values are possible as you can see in the [deliver documentation](https://docs.fastlane.tools/actions/deliver/)).

**STEP 5:** Now it’s time to screenshot! Here is how I do, using the [Golden Toolkit](https://pub.dev/packages/golden_toolkit) package:

```Dart
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
```

A few important things to mention here:

- The `widget` argument is the widget you want to screenshot.
- The `pageName` argument is the name of the image file containing your screenshot.
- Since we take 2 screenshots per screen (one for the screen itself, another one for the final illustration), as you might guess, we’ll pass `false` for the `isFinal` argument here for the moment.
- The `density` argument is the density of the device screen as specified above.
- The `sizeDp` argument is the size of the device screen, where its width and height **_have to be divided by the density!_** For example, for the iPhone Xs Max, you’ll pass: `Size(1242 / 3, 2688 / 3)`.
- The `customPump` argument, although not mandatory, can be useful in some cases. By default, the [Golden Toolkit](https://pub.dev/packages/golden_toolkit) package uses `pumpAndSettle()`, which can sometimes block the rendering if, for example, there is an infinite animation. In my case, I pass the following argument (only for the first screenshot) and it works very well: `(tester) async => await tester.pump(const Duration(milliseconds: 200))`.
- The reason why I use `multiScreenGolden()` here is because not only can I use the `Device` object, which is very handy when it comes to specify the screen size and density, but it also generates only what I need without any extra stuff around the screenshot.

**STEP 6:** Calling the `takeScreenshot()` function above generates an image file. Let’s load it in an image widget:

```Dart
final screenFile = File("test/screenshots/goldens/$pageName.screen.png");  
final memoryImage = MemoryImage(screenFile.readAsBytesSync());  
final image = Image(image: memoryImage);
```

**STEP 7:** Now it’s time to decorate the screenshot! I won’t go into details here since it depends on what you want to achieve, but basically, it will look like the following:

```Dart
Widget getDecoratedScreen(Widget image, ...)
{
  return Container(
    child: ... // draw anything you want
  );
}
```

**STEP 8:** And finally, we can take a screenshot of the widget returned by the `getDecoratedScreen()` function mentioned above, again with the `takeScreenshot()` function! Note that this time, you shouldn’t need to pass anything to the `customPump` argument.

**STEP 9:** Now you can delete the first screenshot (the one in `screenFile` above):  `screenFile.deleteSync()`.

And for the first illustration which contains the slogan, I used the same technique (but without taking an actual screenshot obviously).

One last thing: in order to keep your screenshots tests class separated from your other golden tests and unit tests, you may want to do as follow:

- Add a tag at the very top of the test class that generates the screenshots, for example  `[@Tags]([“screenshots”])`, then generate your illustrations with:  `flutter test --update-goldens --tags=screenshots`
- In order to launch your other tests without interfering with the screenshots test class, add the following argument to exclude the screenshots tests class: `-x screenshots`

---

## Automatically upload screenshots to the stores

To upload the screenshots to the stores, we will use the same strategy for both the Google Play Store and the App Store Connect: upload the screenshots while we deploy the app.

To achieve that, we will use Fastlane. Fastlane is a set of open-source tools and scripts that automates building, testing, and deploying mobile apps for both iOS and Android.

You can easily install Fastlane on your local machine with the following command: `sudo gem install fastlane`.

Once installed, we need to set it up (fortunately only once for the project). Open a terminal and go to the root of your Flutter project.

### Android

- Go to the `android` directory: `cd android`.
- Run the following command: `sudo fastlane init`.
- Follow the instructions with the minimum requirements.
- At that point, you might need to change the owners of the generated files, since we used `sudo`:

```Shell
sudo chown your_id fastlane/
sudo chown -R your_id fastlane/*
sudo chown your_id Gemfile
sudo chown your_id Gemfile.lock
```

- Now, we need an API Key, which is a JSON. Just follow this [short video](https://youtu.be/qrtk6e0BYjM?t=18) to learn how to get that key. Let's name that file `google-play-store.json`.
- For testing purposes, we can locally save that file in the `android` directory. But don’t forget to add it in your `.gitignore` file!
- (_Optional_) Now you can test that Fastlane can communicate with your store with the following command:`fastlane run validate_play_store_json_key json_key:google-play-store.json`
- Edit your `Appfile` file so you can update it like the following:

```Shell
# Path to the json secret file, relative to the "android" directory:
json_key_file("google-play-store.json")

# Package name (actually your application ID):
package_name("com.mistikee.mistikee")
```

- Finally, in order to locally get all the current screenshots and metadata with the right files and folders, run: `sudo fastlane supply init`. Here again, you might need to change the owners of the generated files as explained above.

### iOS

- Go to the `ios` directory: `cd ios`.
- Run the following command: `sudo fastlane init`.
- Follow the instructions with the minimum requirements: choose `Manual setup`, and continue. **_Be careful not to create an app on App Store Connect at this point!_**
- Again, you might need to change the owners of the generated files, since we used `sudo`:

```Shell
sudo chown your_id fastlane/ 
sudo chown -R your_id fastlane/* 
sudo chown your_id Gemfile 
sudo chown your_id Gemfile.lock
```

- Now, we need an API Key, which is a JSON. Let's name that file `app_store_connect.json`, which will look like the following:

```JSON
{
    "key_id": "D123SF789",
    "issuer_id": "1234a5cd-12a3-4acb-56dd-123bb1234567",
    "key": "-----BEGIN PRIVATE KEY-----\n[...]\n-----END PRIVATE KEY-----"
}
```

To get the different values, login to the App Store Connect, then go to _My Apps > Users and access > Keys_. Here you can generate a new API Key, which content will go into `key` in the JSON above. On that same page, you can also find the key ID that you’ve just created, and the Issuer ID that you can find on the top of the list.

- For testing purposes, we can locally save that file in the `ios` directory. But don’t forget to add it in your `.gitignore` file!
- Edit your `Appfile` file so you can update it like the following:

```
app_identifier("com.mistikee.mistikee") # The bundle identifier of your app 
apple_id("yourlogin@icloud.com") # Your Apple Developer Portal username 
itc_team_id("123456789") # App Store Connect Team ID 
team_id("123A4P567S") # Developer Portal Team ID
```

- In order to locally get all the current screenshots and metadata with the right files and folders , run:
   `sudo fastlane deliver init --use_live_version true`.
   Here again, you might need to change the owners of the generated files as explained above.
- Finally, if your app does not use encryption, in your `Info.plist` file, add the `ITSAppUsesNonExemptEncryption` key with `false` for its value.

### Back to root

At this point, you can add the following in your `.gitignore` file, at the root of your project:

```
/android/fastlane/metadata/android/fr-FR/images/
/android/fastlane/metadata/android/en-US/images/
/android/google-play-store.json

/ios/fastlane/screenshots
/ios/app_store_connect.json
```

Since the `google-play-store.json` and the `app_store_connect.json` files are not meant to be added to your repository, we need to provide them in the CI in a safe way.

With Codemagic, you can store the content of the `google-play-store.json` file in a encrypted environment variable named `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`, and run a script in your CI that will generate the `google-play-store.json` in the right location, with the right content, by doing as follow:

```
echo $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS > android/google-play-store.json
```

Then in your CI, you can write a script that copies the generated illustrations in the right directories. For example, here is how you can copy your illustrations for the French Android version of your app:

```
mkdir -p android/fastlane/metadata/android/fr-FR/images/phoneScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/sevenInchScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/tenInchScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/tvScreenshots
mkdir -p android/fastlane/metadata/android/fr-FR/images/wearScreenshots
cp test/screenshots/goldens/fr.android_smartphone.* android/fastlane/metadata/android/fr-FR/images/phoneScreenshots/
cp test/screenshots/goldens/fr.android_tablet_7.* android/fastlane/metadata/android/fr-FR/images/sevenInchScreenshots/
cp test/screenshots/goldens/fr.android_tablet_10.* android/fastlane/metadata/android/fr-FR/images/tenInchScreenshots/
```

### Fastfile

One last step: the `Fastfile` files, one for Android, one for iOS, that will each contain the detailed command to deploy everything to each store.

Here is what the `Fastfile` file looks like for the Google Play Store (go to the  [supply](https://docs.fastlane.tools/actions/supply/)  documentation for more info):

```Ruby
default_platform(:android)

platform :android do
  desc "Deploy app with screenshots to the Google Play Store"
  lane :deployapp do |options|
    supply(
      package_name: "com.mistikee.mistikee", # put your own package name instead
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
```

And here is what the `Fastfile` file looks like for the App Store Connect (go to the [deliver](http://docs.fastlane.tools/actions/deliver) documentation for more info):

```Ruby
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
```

Now, in your CI, in order to run the `deployapp` command above for the Google Play Store, you just need to run the following script:

```Shell
cd android/
fastlane deployapp versionCode:25 # put your own version code here
```

And for the `deployapp` command above for the App Store Connect, here is the script:

```Shell
cd ios/
fastlane deployapp versionName:"2.0.1" # put your own version name here
```

Note that the App Store Connect might sometimes be buggy when it comes to deleting the previous screenshots. If that operation takes too much time (it should be done in a matter of seconds), don’t hesitate to interrupt the script and run your CI all over again.

---

Now you're ready to automatically generate and decorate your own screenshots and upload them to the stores!

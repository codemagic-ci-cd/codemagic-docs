---
description: Upload Flutter app screenshots to the stores
title: Screenshots
weight: 6
aliases:
  - /flutter/upload-screenshots-stores
  - /flutter-configuration/upload-screenshots-stores
---

_This article is a follow up of the previous article, that you can find_ [_here_](/flutter-screenshots-stores.md).

In the first part, we managed to generate beautiful decorated screenshots to be uploaded to the **Google Play Store** and the **App Store Connect**, for a mobile Flutter app.

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

Now you're ready to automatically upload your screenshots to the stores!

---
title: Building Android App Bundles
weight: 6
---

You can build your app in [Android App Bundle](https://developer.android.com/guide/app-bundle) (`.aab`) format for publishing to Google Play. When you upload your app in `.aab` format, app APKs will be dynamically created and optimized for user's device configuration when the app is installed from Google Play Store.

{{<notebox>}}

Android App Bundles are supported starting from Flutter v1.1.5.

{{</notebox>}}

Building an Android App Bundle requires additional configuration as described in the sections below.

## Enable building app bundles in Codemagic

In the Build section of app settings, check **Build Android App Bundles** under Build for platforms.

## Prepare the app bundle for uploading to Google Play

In order to upload your Android App Bundle to Google Play, you will need to:

1. Build the app in **Release** mode.
2. Set up [Android code signing](https://docs.codemagic.io/code-signing/android-code-signing/) in Codemagic to sign the app bundle.
3. Set up [publishing to Google Play](https://docs.codemagic.io/publishing/publishing-to-google-play/) in Codemagic to upload your app bundle to one of Google Play tracks.
4. [Enroll your app into app signing by Google Play](https://support.google.com/googleplay/android-developer/answer/7384423) to have Google sign the APKs that are generated from the app bundle during installation.

When you enroll an app into app signing by Google Play, Google will manage your app's signing key for you and use it to sign the APKs for distribution. Note that the app must be signed with the same key throughout its lifecycle, so if the app has already been uploaded to Google Play, make sure to export and upload your original key to Google Play for app signing. It is then recommended to create a new key ("upload key") for signing your app updates and uploading them to Google Play.

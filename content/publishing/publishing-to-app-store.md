---
description: Deploy the Flutter app to App Store and TestFlight
title: App Store Connect
weight: 1
---

Codemagic enables you to automatically publish your app to App Store Connect for beta testing with TestFlight or distributing the app to users via App Store. To do so, you must first set up [iOS code signing](https://docs.codemagic.io/code-signing/ios-code-signing/) and then configure publishing to App Store Connect.

## Requirements

Codemagic needs your **Apple ID** and [**app-specific password**](https://support.apple.com/en-us/HT204397) to perform publishing to App Store Connect on your behalf. Publishing to App Store Connect requires that the app be signed with App Store **distribution certificate**.

In addition, the application must be **App Store ready** for build distribution, meaning that it must have all the correct icons and icon sizes, otherwise App Store Connect will tag the binary as invalid, and you will not be able to distribute it at all.

It is also worth pointing out the necessity for each uploaded binary to have a **different version**, otherwise it will be refused by App Store Connect. See the [Build versioning](https://docs.codemagic.io/building/build-versioning/) article for instructions on incrementing app version with Codemagic.

{{<notebox>}}Please note that you will need to create an **app record** in App Store Connect before you can automate publishing with Codemagic. It is recommended to upload the very first version of the app manually. {{</notebox>}}

## Setting up publishing to App Store Connect on Codemagic

1. Navigate to the Publish section in app settings.
2. Click **App Store Connect**.
3. Enter your **Apple ID** (the email address used for login) and your **app-specific password**.
4. Select **Enable App Store Connect publishing** at the top of the section to enable publishing.
5. Click **Save** to finish the setup.

Once you have successfully set up publishing to App Store Connect, Codemagic will automatically distribute the app to App Store Connect every time you build the workflow. Note that you must manually submit the app to App Store in App Store Connect.

## Submitting an app to App Store

To make your iOS app available to the public, it must be submitted for review in App Store Connect.

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/).
2. Navigate to **My Apps** and identify the app you would like to publish to App Store.
3. To start the submission process, click **Prepare for Submission**.
4. Check that you app metadata is up to date, and once everything is ready, click the **Submit for Review** button.

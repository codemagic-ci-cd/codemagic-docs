---
description: Deploy the Flutter app to Google Play
title: Google Play
weight: 2
---

Codemagic enables you to automatically publish your app to the **internal**, **alpha**, **beta** and **production** tracks on Google Play. To do so, you must first [set up Android code signing](../code-signing/android-code-signing/ 'Android code signing') and then configure publishing to Google Play.

## Requirements

You will need a **service account in Google Play Console** to obtain the **JSON credentials file**. See how to do that [here](../knowledge-base/google-play-api/). In addition, you must build the app in **release mode** and set up **Android code signing**.

Before releasing the app to Google Play, make sure that it meets the [Google Play's best practices guidelines](https://developer.android.com/distribute/best-practices/launch/).

{{<notebox>}} Note that if you haven't published your app to Google Play yet, you must create an entry for your app in Google Play Console and manually upload the very first version of the app before you can automate publishing using Codemagic. In addition, each uploaded binary must have a different version, see how to automatically [increment build version](../building/build-versioning/ 'Build versioning') on Codemagic. {{</notebox>}}

## Setting up publishing to Google Play on Codemagic

Once you configure publishing to Google Play, Codemagic will automatically distribute the app to Google Play every time you build the workflow.

{{<notebox>}}
The very first version of the app must be added to Google Play manually. You can download the **app_release.apk** from the build artifacts.
{{</notebox>}}

1. Navigate to the Publish section in app settings.
2. Click **Google Play** to expand the options.
3. Upload your credentials JSON file.
4. Select a **track** for publishing.
   - Internal --- publish for internal testing and QA
   - Alpha --- publish for testing with a small group of trusted users
   - Beta --- publish for testing to a wider set of users
   - Production --- release the app to production
5. If you want to publish the .apk even when one or more tests fail, mark the **Publish even if tests fail** checkbox.
6. Select **Enable Google Play publishing** at the top of the section to enable publishing.

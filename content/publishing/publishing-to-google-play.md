---
description: Deploy the Flutter app to Google Play
title: Publishing to Google Play
weight: 2
---

Codemagic enables you to automatically publish your app to the **internal**, **alpha**, **beta** and **production** tracks on Google Play. To do so, you must first [set up Android code signing](https://docs.codemagic.io/code-signing/android-code-signing/ 'Android code signing') and then configure publishing to Google Play.

## Requirements

You will need a **service account in Google Play Console** to obtain the **JSON credentials file**. See how to do that [here.](#setting-up-a-service-account-in-google-play-console) In addition, you must build the app in **release mode** and set up **Android code signing**.

Before releasing the app to Google Play, make sure that it meets the [Google Play’s best practices guidelines](https://developer.android.com/distribute/best-practices/launch/).

{{% notebox %}} Note that if you haven’t published your app to Google Play yet, you must create an entry for your app in Google Play Console and manually upload the very first version of the app before you can automate publishing using Codemagic. In addition, each uploaded binary must have a different version, see how to automatically [increment build version](https://docs.codemagic.io/building/build-versioning/ 'Build versioning') on Codemagic. {{% /notebox %}}

## Setting up a service account in Google Play Console

1. In Google Play Console, navigate to Settings > API access.
2. Click on the **Create Service Account** button and follow the link to Google API Console.
3. In Google API Console, click on the **Create Service Account** button.
4. Fill in **Service account name** and choose Service Accounts > Service Account User from the Role dropdown. Make sure to check **Furnish a new private key** and select **JSON** as key type.
   ![](../uploads/2019/03/create service account 2018_marked.png)
5. Click **Create** and download the created JSON credentials file. You will need this file to set up publishing to Google Play on Codemagic.
6. Back in Google Play Console, click **Done** to close the dialog.
7. Find the new service account and click **Grant Access**.
8. Select **Release manager** from the Role dropdown and click **Add user**.

## Setting up publishing to Google Play on Codemagic

Once you configure publishing to Google Play, Codemagic will automatically distribute the app to Google Play every time you build the workflow.

{{% notebox %}}
The very first version of the app must be added to Google Play manually. You can download the **app_release.apk** from the build artifacts.
{{% /notebox %}}

1. Navigate to the Publish section in app settings.
2. Click **Google Play** to expand the options.
3. Upload your credentials JSON file.
4. Select a **track** for publishing.
   - Internal — publish for internal testing and QA
   - Alpha — publish for testing with a small group of trusted users
   - Beta — publish for testing to a wider set of users
   - Production — release the app to production
5. If you want to publish the APK even when one or more tests fail, mark the **Publish even if tests fail** checkbox.
6. Click **Save** to finish the setup.

{{< figure size="medium" src="../uploads/2019/03/google play.png" caption="" >}}

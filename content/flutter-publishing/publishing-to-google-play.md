---
description: Deploy a Flutter app to Google Play using the Flutter workflow editor
title: Google Play
weight: 2
aliases: /publishing/publishing-to-google-play
---

Codemagic enables you to automatically publish your app to the **internal**, **alpha**, **beta** and **production** tracks on Google Play. To do so, you must first [set up Android code signing](../code-signing/android-code-signing/ 'Android code signing') and then configure publishing to Google Play.

{{<notebox>}}
This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml** please go to [Publishing to Google Play using codemagic.yaml](../publishing-yaml/distribution/#google-play).
{{</notebox>}}

## Requirements

1. Setting up access using [Google Play API](../knowledge-base/google-play-api/).
2. A [**service account in Google Play Console**](../knowledge-base/google-services-authentication/#creating-a-service-account) to obtain the **JSON credentials file**
3. Granting the necessary App permissions and access permissions to the service account.
4. You must build the app in **release mode** and set up [**Android code signing**](../code-signing/android-code-signing).

Before releasing the app to Google Play, ensure that it meets [Google Play's best practices guidelines](https://developer.android.com/distribute/best-practices/launch/).

## Setting up publishing to Google Play on Codemagic

Once you make all the preparations as described [above](../publishing/publishing-to-google-play/#requirements) and configure publishing to Google Play, Codemagic will automatically distribute the app to Google Play every time you build the workflow.

{{<notebox>}}
The very first version of the app must be added to Google Play manually. You can download the **app_release.apk** from the build artifacts. In addition, each uploaded binary must have a different version; see how to automatically [increment build version](../building/build-versioning/ 'Build versioning') on Codemagic.
{{</notebox>}}

1. Navigate to the Distribution section in app settings.
2. Click **Google Play** to expand the option.
3. Upload your credentials JSON file.
4. Select a **track** for publishing.
   - Internal --- publish for internal testing and QA
   - Alpha --- publish for testing with a small group of trusted users
   - Beta --- publish for testing to a wider set of users
   - Production --- release the app to production
   - Custom --- release the app to a custom closed testing track
5. If you want to publish to a custom track, enter the custom track name.
6. If your application supports [in-app updates](https://developer.android.com/guide/playcore/in-app-updates), set the desired priority. If not, select **Default**.
7. In case you want to release a [staged version](https://support.google.com/googleplay/android-developer/answer/6346149?hl=en) of your application, which reaches only a fraction of users, set **Rollout fraction** to a value between 0 and 1. To release to everyone, leave the value empty.
8. If you are getting the next error: `Changes cannot be sent for review automatically. Please set the query parameter changesNotSentForReview to true`, mark the checkbox **Do not send changes for review**.

    But if the checkbox is marked and the app is sent for review automatically, you will get the error `Changes are sent for review automatically. The query parameter changesNotSentForReview must not be set.`

9. If you want to publish the .apk even when one or more tests fail, mark the **Publish even if tests fail** checkbox.
10. Select **Enable Google Play publishing** at the top of the section to enable publishing.

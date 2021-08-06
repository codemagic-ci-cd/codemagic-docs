---
description: Deploy a Flutter app to Firebase App Distribution using the Flutter workflow editor
title: Firebase App Distribution
weight: 3
aliases: /publishing/firebase-app-distribution
---

Set up publishing to [Firebase App Distribution](https://firebase.google.com/docs/app-distribution) to distribute your Android and iOS apps to testers.

{{<notebox>}}
This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml**, please go to [Publishing an app to Firebase App Distribution](../publishing-yaml/distribution/#publishing-an-app-to-firebase-app-distribution).
{{</notebox>}}

## Requirements

* [Add Firebase to your Flutter project](https://firebase.google.com/docs/flutter/setup)
* Generate a [Firebase token](https://firebase.google.com/docs/cli#cli-ci-systems) locally
* Set up [iOS code signing](../code-signing/ios-code-signing). Note that an Ad Hoc or Enterprise distribution profile is required to distribute the app outside your development team.
* Set up [Android code signing](../code-signing/android-code-signing). If you do not set up code signing, the artifact will be signed with a debug keystore from Codemagic build machine.

## Enabling publishing to Firebase App Distribution

1. Navigate to **App settings > Distribution > Firebase App Distribution**.
2. Enter your **Firebase token**.
3. Provide the **Firebase app ID** for Android and/or iOS. Note that the fields for Android or iOS configuration are displayed conditionally based on the selected build platforms at the top of the page.
4. Enter the alias(es) of the **tester groups** to whom you want to distribute your Android or iOS app. To enter multiple groups, separate them with a comma or a space, or press Enter after each value.
5. Select **Publish even if tests fail** to upload the artifacts even when one or more tests have failed.
6. Finally, select **Enable publishing to Firebase App Distribution** at the top of the section to enable publishing.

{{<notebox>}}
Note that:

* if your app uses Firebase services, you need to upload the Firebase configuration files to Codemagic, see the instructions [here](../knowledge-base/load-firebase-configuration/); 
* if no suitable artifacts are found, publishing to Firebase App Distribution is skipped;
* each uploaded binary must have a different version to appear in the Firebase console, see how to [increment build version](../building/build-versioning/);
* release notes can be published with the build if you have added them to your repository, read more [here](./publish-release-notes).

{{</notebox>}}

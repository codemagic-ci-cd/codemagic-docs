---
description: Deploy a Flutter app to Firebase App Distribution using the Flutter workflow editor
title: Firebase App Distribution with Flutter workflow editor
linkTitle: Firebase App Distribution
weight: 4
aliases: /publishing/firebase-app-distribution
---

Set up publishing to [Firebase App Distribution](https://firebase.google.com/docs/app-distribution) to distribute your Android and iOS apps to testers.

{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml**, please go to [Publishing an app to Firebase App Distribution](../yaml-publishing/firebase-app-distribution).
{{</notebox>}}

## Requirements

- [Add Firebase to your Flutter project](https://firebase.google.com/docs/flutter/setup)
- Generate a [Firebase token](https://firebase.google.com/docs/cli#cli-ci-systems) locally or set up a [service account](https://docs.codemagic.io/yaml-publishing/firebase-app-distribution/#requirements) with **Firebase App Distribution Admin** role to authenticate with Firebase App Distribution.
- If your app uses Firebase services, you need to upload the Firebase configuration files to Codemagic, see the instructions [here](/knowledge-base/load-firebase-configuration/).
- Set up [iOS code signing](../code-signing/ios-code-signing). Note that an Ad Hoc or Enterprise distribution profile is required to distribute the app outside your development team.
- Set up [Android code signing](../code-signing/android-code-signing). If you do not set up code signing, the artifact will be signed with a debug keystore from Codemagic build machine.
- To authenticate with Firebase, Codemagic requires either a **Firebase token** or a service account with **Firebase App Distribution Admin** role, as shown below:

#### 1. Authenticating via service account

Using a service account is a more secure option due to granular permission settings. It can also be used to authenticate with various Firebase services, such as Firebase Test Lab and Firebase App Distribution.

1. On the Firebase project page, navigate to **Project settings** by clicking on the cog button. Select the **Service accounts** tab. Click on the **X service accounts** button as shown on the screenshot. <br><br>
![Firebase service accounts](../uploads/firebase_service_accounts_button.png)

2. This will lead you to the Google Cloud Platform. In step 1, fill in the **Service account details** and click **Create**. The name of the service account will allow you to identify it among other service accounts you may have created.

3. In step 2, click the **Select a role** dropdown menu and choose the role. Note that **Editor** role is required for Firebase Test Lab and **Firebase App Distribution Admin** for Firebase App Distribution.

4. In step 3, you can leave the fields blank and click **Done**.

5. In the list of created service accounts, identify the account you have just created and click on the menu in the **Actions** column, then click **Manage keys**.<br><br>
![Google cloud key](../uploads/google_cloud_three.png)

6. In the Keys section, click **Add Key > Create new key**. Make sure that the key type is set to `JSON` and click **Create**. Save the key file in a secure location to have it available.<br><br>
![Google cloud json](../uploads/google_cloud_four.png)

#### 2. Authenticating via token

{{<notebox>}}**Warning:** Firebase has marked authentication via token as deprecated and might disable it in future versions of `firebase tool`. Please authenticate using a service account, as described below.
{{</notebox>}}

To retrieve your Firebase token, follow the instructions in [Firebase documentation](https://firebase.google.com/docs/cli#cli-ci-systems).
## Enabling publishing to Firebase App Distribution

1. Navigate to **App settings > Distribution > Firebase App Distribution**.
2. Choose either **Firebase token** or **Firebase service account** as the authentication method.
3. Enter the Firebase token or upload the service account JSON key respectively.
4. Provide the **Firebase app ID** for Android and/or iOS. Note that the fields for Android or iOS configuration are displayed conditionally based on the selected build platforms at the top of the page.
5. Enter the alias(es) of the **tester groups** to whom you want to distribute your Android or iOS app. To enter multiple groups, separate them with a comma or a space, or press Enter after each value.
6. For Android, select whether you wish to publish the Android app bundle, the Android APK artifact, or select **Automatic** to publish either the Android app bundle (preferred) or the APK artifact (when no AAB is available).
7. Select **Publish even if tests fail** to upload the artifacts even when one or more tests have failed.
8. Finally, select **Enable publishing to Firebase App Distribution** at the top of the section to enable publishing.

{{<notebox>}}
**Note:**
- If no suitable artifacts are found, publishing to Firebase App Distribution is skipped.
- Each uploaded binary must have a different version to appear in the Firebase console, see how to [increment build version](../building/build-versioning/).
- Release notes can be published with the build if you have added them to your repository, read more [here](./publish-release-notes).
{{</notebox>}}

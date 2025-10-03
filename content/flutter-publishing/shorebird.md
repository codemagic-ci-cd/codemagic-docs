---
description: Deploy app updates to users' devices using Shorebird in Flutter workflow editor
title: Code Push with Shorebird
linkTitle: Code Push with Shorebird
weight: 4
aliases: 
---

Code push for Flutter is a cloud service by [Shorebird](https://shorebird.dev/) that allows developers to push over-the-air (OTA) app updates directly to users' devices without publishing each update on app stores. With Codemagic, you can use Shorebird to build and publish a release or a patch for Android and iOS.

{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured using **codemagic.yaml**, you can follow the guide [here](https://docs.shorebird.dev/ci/codemagic/).
{{</notebox>}}

## Prerequisites

In order to configure a Shorebird workflow in Codemagic, the following is needed:

- Shorebird needs to be [initialized](https://docs.shorebird.dev/code-push/initialize/) for your Flutter project;
- A token for authentication with Shorebird;
- Code signing files.

## Generating a Shorebird token

In your terminal, run the following command:

{{< highlight Groovy "style=paraiso-dark">}}
shorebird login:ci
{{< /highlight >}}

You will be then asked to log in to your Shorebird account. After successful authentication, the token is printed to your terminal window. Have the token ready for use in Codemagic.

Note that the Shorebird token is a secret and should not be shared publicly or checked in to source control.

## Building a release

Release builds can be published to app stores and patched once they've been distributed. Read more about Shorebird [releases](https://docs.shorebird.dev/code-push/release/).

1. In workflow editor, select the platforms for which you want to build. Only **Android** and **iOS** are supported with Shorebird for now.
2. Under **Publish updates to user devices using Shorebird**, select **Release**.
3. Scroll to the **Shorebird** section and specify the Flutter version and the Xcode version (if you selected **iOS**) to be used for building the app. 
4. Copy-paste your token generated with Shorebird CLI in the **Shorebird token** field. Once you save it, the token can no longer be viewed, only modified or deleted.
5. If your Flutter project is not in the root of the repository, update the **Project path** to point to the right directory.
6. You can add additional **build arguments** to the `shorebird release` build command, e.g. to specify the flavor or target for your app. See more info [here](https://docs.shorebird.dev/code-push/release/).
7. Scroll down to the **Distribution** section to set up code signing. You can follow the guides for [iOS code signing](../flutter-code-signing/ios-code-signing) and [Android code signing](../flutter-code-signing/android-code-signing) respectively. 
8. Save the settings and start a new build. On successful build, the release artifact will be uploaded to your Shorebird console.

{{<notebox>}}

**Please note:**

* If you also wish to distribute the same artifact to the stores, you can configure publishing to [App Store](../flutter-publishing/publishing-to-app-store) or [Google Play](../flutter-publishing/publishing-to-google-play) as part of the workflow.

* Every release must have a unique version. Read how to set up [automatic build versioning](../knowledge-codemagic/build-versioning) with Codemagic.
{{</notebox>}}

## Building a patch

Once you have published a release of your app, you can patch it by pushing an app update directly to users' devices. Read more about Shorebird [patches](https://docs.shorebird.dev/code-push/patch/).

1. In workflow editor, select the platforms for which you want to build. Only **Android** and **iOS** are supported with Shorebird for now.
2. Under **Publish updates to user devices using Shorebird**, select **Patch**.
3. Scroll to the **Shorebird** section and specify the Xcode version (if you selected **iOS**) to be used for building the app. Note that it is recommended to use the same Xcode version that was used to build the app version you are going to patch so as to avoid warnings about the app containing native changes.  
4. Specify the **Android release version** and/or the **iOS release version** to patch. To patch the latest release, set the value to `latest`.
5. Copy-paste your token generated with Shorebird CLI in the **Shorebird token** field. Once you save it, the token can no longer be viewed, only modified or deleted.
6. If your Flutter project is not in the root of the repository, update the **Project path** to point to the right directory.
7. You can add additional **build arguments** to the `shorebird patch` build command, e.g. to specify the flavor or target for your app. See more info [here](https://docs.shorebird.dev/code-push/patch/).
8. Scroll down to the **Distribution** section to set up code signing. You can follow the guides for [iOS code signing](../flutter-code-signing/ios-code-signing) and [Android code signing](../flutter-code-signing/android-code-signing) respectively.
9. Save the settings and start a new build. On successful build, the patch artifact will be uploaded to your Shorebird console.


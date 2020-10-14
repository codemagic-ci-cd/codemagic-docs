---
title: Building Flutter projects
description: Configuring Flutter projects in the UI.
weight: 1
aliases:
    - '../building/building-android-app-bundles'
    - '../building/building-for-the-web'
    - '../building/building-for-desktop'
---

With Codemagic, you can build and test Flutter apps for Android, iOS, web, macOS and Linux as well as [test widgets](../testing/testing-widgets). It is also possible to set up a [workflow](../flutter/creating-workflows) that runs tests only.

{{<notebox>}}
If you're interested in building Flutter/Dart packages and publishing them to [pub.dev](https://pub.dev/), you can do so with [`codemagic.yaml`](../getting-started/yaml), see an example [here](../publishing-yaml/distribution/#publishing-a-flutter-package-to-pubdev).
{{</notebox>}}

## Selecting build platforms and versions

You can select the platforms to build for and specify the **Flutter version**, **Xcode version** and **CocoaPods version** to be used for building in **App settings > Build**.

When you're building for **Android**, make sure to also specify the **Android build format** to determine which build artifacts to generate.

This is also where you can selet the build **Mode** (**Debug**, **Release** or **Profile**) and specify additional build arguments, e.g. for [build versioning](../building/build-versioning) or verbose logging.

### Building Android app bundles

You can build your app in [Android App Bundle](https://developer.android.com/guide/app-bundle) (`.aab`) format for publishing to Google Play. When you upload your app in `.aab` format, app  .apk(s) will be dynamically created and optimized for user's device configuration when the app is installed from Google Play Store.

In **App settings > Build > Build for platforms**, select **Android** and then choose **Android app bundle (AAB)** as the **Android build format**.

#### Prepare the app bundle for uploading to Google Play

In order to upload your Android App Bundle to Google Play, you will need to:

1. Build the app in **Release** mode.
2. Set up [Android code signing](../code-signing/android-code-signing/) in Codemagic to sign the app bundle.
3. Set up [publishing to Google Play](../publishing/publishing-to-google-play/) in Codemagic to upload your app bundle to one of Google Play tracks.
4. [Enroll your app into app signing by Google Play](https://support.google.com/googleplay/android-developer/answer/7384423) to have Google sign the .apk(s) that are generated from the app bundle during installation.

When you enroll an app into app signing by Google Play, Google will manage your app's signing key for you and use it to sign the .apk for distribution. Note that the app must be signed with the same key throughout its lifecycle, so if the app has already been uploaded to Google Play, make sure to export and upload your original key to Google Play for app signing. It is then recommended to create a new key ("upload key") for signing your app updates and uploading them to Google Play.

### Building for the web

Codemagic can detect your Flutter web project if it contains a `web` folder. To build for the web, select **Web** as the build platform in **App settings > Build > Build for platforms**.

{{<notebox>}}
Flutter for web is currently in beta. Make sure to select channel Beta or a later Flutter version to build for web.
{{</notebox>}}

At the end of a successful build, Codemagic generates a `.zip` file of the contents of `$FCI_BUILD_DIR/build` and exports this as an artifact. You can either download it or set up publishing to [Codemagic Static Pages](../publishing/publishing-to-codemagic-static-pages/). You can also use custom scripts to publish to third-party hosting sites.

### Building for desktop

You can use Codemagic to build Flutter desktop apps for macOS and Linux. Building Windows apps is not yet supported. 

{{<notebox>}}
Read more about Flutter's desktop support and the required settings for enabling it in Flutter's wiki about [desktop shells](https://github.com/flutter/flutter/wiki/Desktop-shells).
{{</notebox>}}

Codemagic can detect your Flutter desktop project if it meets the following conditions:

- The project contains a `macos` folder for the macOS application
- The project contains a `linux` folder for the Linux application

To build for the **macOS** or **Linux**, select the respective option in **App settings > Build > Build for platforms**. Make sure to also select a Flutter version that has desktop support available.

At the end of a successful build, Codemagic generates a downloadable `.zip` file for each desktop platform. The application can be installed on your machine, but since it is built without code signing, you may have to allow installating applications from unidentified developers.

### Running tests only

In some cases you may want to run only tests and not build the entire project, e.g. when you're triggering a build on pull request update. To do so, [enable testing](../testing/running-automated-tests), and then in **App settings > Build > Build for platforms**, select **Run tests only**. Codemagic will then build the workflow until the testing step and skip building the app.

If tests fail, the status of the build will be “failed” and you'll receive an email about failing tests. If you have publishing to Slack configured, you'll receive notifications on build status updates.

## Starting builds

Builds can be started manually from Codemagic or automatically in response to events in the repository, see more about [automatic build triggering](./automatic-build-triggering) here. 

You can start builds manually by clicking **Start new build** in app settings or build overview. On clicking the button, the **Specify build configuration** popup is displayed where you can select the branch and the [workflow](./creating-workflows) to build. If you also have the `codemagic.yaml` file available in the repository, you can click **Select workflow from codemagic.yaml** in the popup to select a YAML workflow to build.

For information about using API calls to trigger builds, look [here](../rest-api/overview/).

## Multiple Flutter projects in one repository

Codemagic supports monorepos and is able to detect multiple Flutter projects in a repository or projects not in the repository root provided that each project has its `pubspec.yaml` file with `flutter` dependency.

Initially, the only project path for every application is `.` — the root of the repository. The repository is scanned for Flutter projects during the first build, and if multiple projects are found, the first build is run for the project with the highest number of platforms available (presence of `android`, `ios` etc. directories). 

After the first build, you can select the project for building in **App settings > Build > Project path** dropdown. 

If you have changed the location of the project in the repository, renamed its parent directory or added new projects, you may have to rescan project paths by clicking the icon next to the **Project path** dropdown field. Then select the branch you want to search for projects and click **Rescan**, which will update the project paths for the chosen branch.

{{<notebox>}}
Rescanning is not available for repositories added from a custom source. Instead, project paths are scanned on each new build and are updated on change.
{{</notebox>}}
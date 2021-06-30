---
title: Building Flutter projects
description: How to configure Flutter app builds using the Flutter workflow editor
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

## Selecting build platforms and build machines

At the beginning of the workflow, first select the platforms to build and then specify a build machine type to run the build on. While Android, iOS and web builds can be run in the same workflow, macOS and Linux platforms are each built in a separate workflow and on different build instances. Note that the availability of build machine instances depends on the selected build platforms and whether you have billing enabled or not.

* iOS and macOS builds can be run on macOS build machines
* Android and Web builds can be run on macOS or Linux build machines
* Linux builds can be run on Linux build machines
* a Run tests only workflow can be run on macOS or Linux build machines

## Building Android apps

In your app settings, select **Android** under **Build for platforms** and an available build machine type.

Then scroll down to the **Build** section to specify the **Flutter** version, select the build **Mode** (**Debug**, **Release** or **Profile**) or add additional build arguments, e.g. for [build versioning](../building/build-versioning) or verbose logging.

Make sure to also select the **Android build format** to determine which build artifacts to generate.

When you're building for release, you will need to build the app in Release mode and set up [code signing](../code-signing/android-code-signing/).

### Building Android app bundles

You can build your app in [Android App Bundle](https://developer.android.com/guide/app-bundle) (`.aab`) format for publishing to Google Play. When you upload your app in `.aab` format, app  .apk(s) will be dynamically created and optimized for the user's device configuration when the app is installed from Google Play Store.

In order to upload your Android App Bundle to Google Play, you will need to:

1. Build the app in **Release** mode.
2. Set up [Android code signing](../code-signing/android-code-signing/) in Codemagic to sign the app bundle.
3. Set up [publishing to Google Play](../publishing/publishing-to-google-play/) in Codemagic to upload your app bundle to one of Google Play tracks.
4. [Enroll your app into app signing by Google Play](https://support.google.com/googleplay/android-developer/answer/7384423) to have Google sign the .apk(s) that are generated from the app bundle during installation.

When you enroll an app into app signing by Google Play, Google will manage your app's signing key for you and use it to sign the .apk for distribution. Note that the app must be signed with the same key throughout its lifecycle, so if the app has already been uploaded to Google Play, make sure to export and upload your original key to Google Play for app signing. It is then recommended to create a new key ("upload key") for signing your app updates and uploading them to Google Play.

## Building iOS apps

In your app settings, select **iOS** under **Build for platforms** and an available build machine type.

Then scroll down to the **Build** section to specify the **Flutter**, **Xcode** and **Cocoapods** versions, select the build **Mode** (**Debug**, **Release** or **Profile**) or add additional build arguments, e.g. for [build versioning](../building/build-versioning) or verbose logging. 

When you're building for release, you will need to build the app in Release mode and set up [code signing](../code-signing/ios-code-signing/).

{{<notebox>}}
**Using `flutter build ipa`**

The `flutter build ipa` command is available as of Flutter version 1.24.0-6.0 and is the recommended option to build an .ipa archive. To use this build command, 
enable code signing and select the **Use flutter build ipa** checkbox in build settings.
{{</notebox>}}

## Building web apps

Codemagic can detect your Flutter web project if it contains a `web` folder. 

Then scroll down to the **Build** section to specify the **Flutter** version, select the build **Mode** (**Debug**, **Release** or **Profile**) or add additional build arguments, e.g. for [build versioning](../building/build-versioning) or verbose logging. 

At the end of a successful build, Codemagic outputs a `.zip` file of the contents of `$FCI_BUILD_DIR/build` and exports this as an artifact. You can either download it or set up publishing to [Codemagic Static Pages](../publishing/publishing-to-codemagic-static-pages/). You can also use custom scripts to publish to third-party hosting sites.

## Building macOS apps

Codemagic can detect your Flutter macOS project if it contains a `macos` folder for the macOS application.

In your app settings, select **macOS** under **Build for platforms** and an available build machine type.

Then scroll down to the **Build** section to specify the **Flutter**, **Xcode** and **CocoaPods** version, select the build **Mode** (**Debug**, **Release** or **Profile**) or add additional build arguments, e.g. for [build versioning](../building/build-versioning) or verbose logging. 

At the end of a successful build, Codemagic outputs a downloadable `.zip` file containing an `.app` archive. If you build for release to the App Store, you need to also set up [code signing](../code-signing/macos-code-signing/) to receive a `.pkg` file.

## Building Linux apps

Codemagic can detect your Flutter Linux project if it contains a `linux` folder for the Linux application.

In your app settings, select **Linux** under **Build for platforms** and an available build machine type.

Then scroll down to the **Build** section to specify the **Flutter** version, select the build **Mode** (**Debug**, **Release** or **Profile**) or add additional build arguments, e.g. for [build versioning](../building/build-versioning) or verbose logging. 

At the end of a successful build, Codemagic outputs a downloadable `.zip` file. 

### Building snap packages

Snaps are packaged apps that can be published to and installed from the [Spancraft Snap Store](https://snapcraft.io/store). Building a snap package requires having a `snapcraft.yaml` configuration file in the root of the repository, read more about how to [create a `snapcraft.yaml` file for a Flutter app](https://snapcraft.io/docs/flutter-applications). 

To build a snap package, select the **Build Snap package** checkbox in the **Build** section of your Linux workflow. When building a snap, the build configuration comes from the `snapcraft.yaml` file and the Flutter version, build mode and build arguments selected in Codemagic have no effect. To publish the snap to the Snap Store, set up [publishing to the Snap Store](../publishing/snap-store).

Additionally, you may want to install the generated `.snap` package onto your machine. The package will not be code signed unless you publish it to Snapcraft. You would need to use the `--dangerous` flag to install the package without code signing:

    snap install your-package.snap --dangerous

## Running tests only

In some cases, you may want to run only tests and not build the entire project, e.g. when you're triggering a build on pull request update. To do so, [enable testing](../testing/running-automated-tests), and then in **App settings > Build > Build for platforms**, select **Run tests only**. Codemagic will then build the workflow until the testing step and skip building the app.

If tests fail, the status of the build will be “failed” and you'll receive an email about failing tests. If you have publishing to Slack configured, you'll receive notifications on build status updates.

## Starting builds

Builds can be started manually from Codemagic or automatically in response to events in the repository, see more about [automatic build triggering](./automatic-build-triggering) here. 

You can start builds manually by clicking **Start new build** in app settings or build overview. On clicking the button, the **Specify build configuration** popup is displayed where you can select the branch and the [workflow](./creating-workflows) to build.

For information about using API calls to trigger builds, look [here](../rest-api/overview/).

## Multiple Flutter projects in one repository

Codemagic supports monorepos and can detect multiple Flutter projects in a repository or projects not in the repository root provided that each project has its `pubspec.yaml` file with `flutter` dependency.

Initially, the only project path for every application is `.` — the root of the repository. The repository is scanned for Flutter projects during the first build, and if multiple projects are found, the first build is run for the project with the highest number of platforms available (presence of `android`, `ios` etc. directories). 

After the first build, you can select the project for building in **App settings > Build > Project path** dropdown. 

If you have changed the location of the project in the repository, renamed its parent directory or added new projects, you may have to rescan project paths by clicking the icon next to the **Project path** dropdown field. Then select the branch you want to search for projects and click **Rescan**, which will update the project paths for the chosen branch.

{{<notebox>}}
Rescanning is not available for repositories added from a custom source. Instead, project paths are scanned on each new build and are updated on change.
{{</notebox>}}

---
description: How to set up your projects to build, test and publish them with Codemagic
title: Setting up projects
weight: 2
---

Codemagic allows you to build, test and publish Flutter apps (Android, iOS, web, macOS, Linux), native Android and iOS apps, native apps containing Flutter modules, Flutter widgets and Flutter packages. Projects can be configured via GUI (Flutter projects only) or using [`codemagic.yaml`](../building/yaml) (all projects).

Upon login, Codemagic will automatically display the list of apps in the [connected repositories](./signup#connecting-several-repository-accounts). If you want to build an app that is not available through the account you signed up with, you can [add the app from custom source](./adding-apps-from-custom-sources).

{{< figure size="" src="../uploads/2019/07/app_dashboard.PNG" caption="Codemagic Applications page" >}}

{{% notebox %}}
* If you can't see your app listed, it may be because you don't have sufficient permissions or Codemagic has no access to your team or organization. Codemagic requires read/write permission to build your app. Contact your repository admin to review the settings.
* If your app requires accessing private Git submodules or dependencies, you need to give Codemagic access to them in order to build successfully. See how to do that [here](../building/access-private-git-submodules). 

{{% /notebox %}}

## Running the first build

* If it's a **Flutter project**, you can start the very first build with preconfigured defaults by clicking **Start your first build** on the Applications page. This will run a debug build of your master branch for the available platforms using the latest stable version of Flutter. [Tests](../testing/running-automated-tests) are disabled by default. Alternatively, you can click the **gear icon** to configure app settings, e.g. change the Flutter or Xcode version, prior to building. 

    Note that if the repository contains multiple projects, you can select the right project after the first build, read more about it [below](#multiple-projects-in-one-repository).

* If it's a **non-Flutter project**, e.g. a native Android or iOS app or an app containing Flutter modules, you must first create a [codemagic.yaml](../building/yaml) file for build configuration and commit it to your repository. Then, click the **gear icon** > **Start your first build** in app settings to select a branch and YAML configuration to build.

As the build starts, you can monitor the build progress right in your browser and expand each build step for more details.

After the build has finished successfully, you will immediately have **artifacts** available for download which you will also receive on the email that was configured for the app repository.

### Multiple projects in one repository

Codemagic supports monorepos and is able to detect multiple Flutter projects in a repository provided that each project has its `pubspec.yaml` file.

The first build is run for the project whose `pubspec.yaml` file was found first. After the first build, you can select the project for building from the **Project file path** dropdown in the Build section of app settings.

{{< figure size="medium" src="../uploads/flutter-multiproject.png" caption="Select which project to build" >}}

## Next steps

You can then continue to customize how you want Codemagic to build, test and publish your project using either the GUI or `codemagic.yaml`. Note that you can also add custom build steps in the GUI by expanding sections before or after the default build steps visible in App settings.

* Enable [automatic builds](../building/automatic-build-triggering)
* Enable [automated tests](../testing/running-automated-tests)
* Set up [workflows](./creating-workflows) for your project
* Set up code signing for [Android](../code-signing/android-code-signing) and [iOS](../code-signing/ios-code-signing)
* Set up [publishing to Google Play](../publishing/publishing-to-google-play)
* Set up [publishing to App Store Connect](../publishing/publishing-to-app-store)
* [Increment build version](../building/build-versioning)
* Browse the list of [Codemagic read-only environment variables](../building/environment-variables)
* See the list of [preinstalled software and versions](../releases-and-versions/versions)

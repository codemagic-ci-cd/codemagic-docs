---
description: How to set up your projects to build, test and publish them with Codemagic
title: Setting up projects
weight: 2
---

Codemagic allows you to build, test and publish Flutter apps (Android, iOS, web, macOS, Linux), native Android and iOS apps, native apps containing Flutter modules, Flutter widgets and Flutter packages. 

Upon login, Codemagic will automatically display the list of apps in the [connected repositories](./signup#connecting-several-repository-accounts). If you want to build an app that is not available through the account you signed up with, you can [add the app from custom source](./adding-apps-from-custom-sources).


{{< figure size="" src="../uploads/2019/07/app_dashboard.PNG" caption="Codemagic Applications page" >}}

{{% notebox %}}
* If you can't see your app listed, it may be because you don't have sufficient permissions or Codemagic has no access to your team or organization. Codemagic requires read/write permission to build your app. Contact your repository admin to review the settings.
* If your app requires accessing private Git submodules or dependencies, you need to give Codemagic access to them in order to build successfully. See how to do that [here](../building/access-private-git-submodules). 

{{% /notebox %}}

## Before you start building

Building on a CI server requires reviewing your project structure and 

- files that cannot be in gitignore
- are there any files we overwrite or change
- how to avoid version inconsistency with local vs CI
- using relative paths instead of absolute ones
- don't store sensitive information in repo if it's publicly accessible

## Running the first build

Your app is not fully set up before you run the first build. During the build, Codemagic will fetch your app sources, list the branches in it, look for tests and create **webhooks** for automatic building (for OAuth apps). If your repository contains multiple projects, you can select the right project after the first build, read more about it [below](#multiple-projects-in-one-repository).

* If it's a **Flutter project**, you can start the very first build with preconfigured defaults by clicking **Start your first build**. This will run a debug build of your master branch for the available platforms using the latest stable version of Flutter. Note that tests are disabled by default. Alternatively, you can click the **gear icon** to configure app settings prior to building.

* If it's a **non-Flutter project**, e.g. a native Android or iOS app or an app containing Flutter modules, you must first create a [codemagic.yaml](../building/yaml) file for build configuration. You can then start builds via UI, but cannot currently use the UI for configuring build settings.

You can monitor the build progress right in your browser and expand each build step for more details.

After the build has finished successfully, you will immediately have **artifacts** available for download which you will also receive on the email that was configured for the app repository.

### Multiple projects in one repository

Codemagic is able to detect multiple Flutter projects in a repository provided that each project has its `pubspec.yaml` file.

The first build is run for the project whose `pubspec.yaml` file was found first. After the first build, you can select the project for building from the **Project file path** dropdown in the Build section of app settings.

{{< figure size="medium" src="../uploads/2019/03/multiple_projects_dark.png" caption="Select which project to build" >}}

## Next steps

You can then continue to customize how you want Codemagic to build, test and publish your app in **App settings**. Note that there are 

* Enable [automatic builds](../building/automatic-build-triggering)
* Enable [automated tests](../testing/running-automated-tests)
* Set up [workflows](./creating-workflows) for your project
* Set up code signing for [Android](../code-signing/android-code-signing) and [iOS](../code-signing/ios-code-signing)
* Set up [publishing to Google Play](../publishing/publishing-to-google-play)
* Set up [publishing to App Store Connect](../publishing/publishing-to-app-store)


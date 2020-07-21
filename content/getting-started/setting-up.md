---
description: How to set up your projects to build, test and publish them with Codemagic
title: Setting up projects
weight: 2
aliases:
 - /getting-started/getting-started
---

Codemagic allows you to build, test and publish a host of different applications that can be configured via GUI (Flutter projects only) or using [`codemagic.yaml`](../building/yaml) (all projects). The list of available projects is as follows: 
* Flutter apps (Android, iOS, web, macOS, Linux)
* Flutter widgets
* Flutter packages/plugins
* native Android and iOS apps
* native apps containing Flutter modules
* React Native apps

Upon login, Codemagic will automatically display the list of apps in the [connected repositories](./signup#connecting-several-repository-accounts). If you want to build an app that is not available through the account you signed up with, you can [add the app from custom source](./adding-apps-from-custom-sources).

{{<notebox>}}
* If you can't see your app listed, it may be because you don't have sufficient permissions or Codemagic has no access to your team or organization. Codemagic OAuth app requires read/write permission to build your app. Contact your repository admin to review the setting for GitHub organisations see this [link](./github-organization-accounts).
* You can add your project with read only access via [GitHub app](./codemagic-github-app) or [SSH connection](./adding-apps-from-custom-sources).
* If your app requires accessing private Git submodules or dependencies, you need to give Codemagic access to them in order to build successfully. See how to do that [here](../building/access-private-git-submodules). 

{{</notebox>}}

## Running the first build

### Flutter project

If it's a **Flutter project**, you can configure your project by clicking **Set up build**. Then you have to select your app type (**Flutter app**) and on the application settings page you can click **Start new build**. This will run a debug build of your master branch for the available platforms using the latest stable version of Flutter. [Tests](../testing/running-automated-tests) are disabled by default. If you want to change the preconfigured settings, e.g. the Flutter or Xcode version, you can configure everything prior to building. 

> Note that if the repository contains multiple projects, you can select the right project after the first build, read more about it [below](#multiple-projects-in-one-repository).

### Non-Flutter project

If it's a **non-Flutter project**, e.g. a native Android or iOS app or an app containing Flutter modules, follow these steps: 
1. Start your project by clicking **Set up build**. 
2. Choose a suitable project type. 
3. Download or copy the configuration file example.
4. Use this file example to create a [`codemagic.yaml`](../building/yaml) file for the build configuration. Make all the necessary changes in your `codemagic.yaml` file to match your project. For example, if you have private dependencies, give Codemagic the necessary access rights and include these dependencies in the configuration file (read more about it [here](https://docs.codemagic.io/building/access-private-git-submodules/)). 
5. When you are done, commit the configuration file to your repository. The name of the file must be `codemagic.yaml` and it must be located in the `root` directory of the repository.
6. Choose the branch you pushed it into and click **Check for configuration file**. 
7. When the system finds the configuration file, click **Start new build**.

{{<notebox>}}
There will also be an automatic **Getting started guide** that guides you through this process step-by-step.
{{</notebox>}}

### Monitoring the build

As the build starts, you can monitor the build progress right in your browser and expand each build step for more details.

After the build has finished successfully, you will immediately have **artifacts** available for download. You will also receive the artifacts on the email that was used for the app repository.

## Multiple projects in one repository

Codemagic supports monorepos and is able to detect multiple Flutter projects in a repository provided that each project has its `pubspec.yaml` file.

The first build is run for the project whose `pubspec.yaml` file was found first. After the first build, you can select the project for building from the **Project file path** dropdown in the Build section of app settings.

{{<notebox>}}
If your projects don't show up, try **rescanning the application**. This updates the repository settings in Codemagic, which is useful when you have moved or renamed your repository, moved the Flutter project inside the repository or renamed the folder containing the project. The **Rescan application** option is available in **App settings > Repository settings**.
{{</notebox>}}

## Next steps

After the initial setup, you can continue to customize how you want Codemagic to build, test and publish your project using either the GUI or `codemagic.yaml`. Note that you can also add custom build steps in the GUI by expanding sections before or after the default build steps visible in App settings. 

Here is a short overview about how to:

* enable [automatic builds](../building/automatic-build-triggering)
* enable [automated tests](../testing/running-automated-tests)
* set up [workflows](./creating-workflows) for your project
* set up code signing for [Android](../code-signing/android-code-signing) and [iOS](../code-signing/ios-code-signing)
* set up [publishing to Google Play](../publishing/publishing-to-google-play)
* set up [publishing to App Store Connect](../publishing/publishing-to-app-store)
* [increment build version](../building/build-versioning)

Before getting started, you might also want to check out the [read-only environment variables](../building/environment-variables) and the list of our [preinstalled software and versions](../releases-and-versions/versions).

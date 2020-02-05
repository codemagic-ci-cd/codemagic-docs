---
description: Build a Flutter app for desktop with Codemagic.
title: Building for desktop
weight: 9
---

You can use Codemagic to build Flutter desktop apps for macOS and Linux. Building Windows apps is not yet supported. 

{{<notebox>}}
Read more about Flutter's desktop support and the required settings for enabling it in Flutter's wiki about [desktop shells](https://github.com/flutter/flutter/wiki/Desktop-shells).
{{</notebox>}}

## Project structure requirements

Codemagic can detect your Flutter desktop project if it meets the following conditions:

- The project contains a `macos` folder for the macOS application
- The project contains a `linux` folder for the Linux application

## Build configuration

1. Navigate to **App settings > Build**.
2. Select which Flutter version to use in the **Flutter version** dropdown. Flutter for desktop is available in **channel Master**. 
3. Under **Build for platforms**, select the platforms for which to build. You can select both **macOS** and **Linux** or only one of them.
4. Select the build mode.
5. Click **Save** to finish build configuration. You are now ready to run the build.

{{<notebox>}}
* Note that if your project has any tests, you can enable them in **App settings > Test**.
* Code signing for desktop apps is not yet supported.
{{</notebox>}}

## Build artifacts

At the end of a successful build, Codemagic generates a downloadable `.zip` file for each desktop platform. The application can be installed on your machine, but since it is built without code signing, you may have to allow installating applications from unidentified developers.

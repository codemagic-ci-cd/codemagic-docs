---
description: Build a Flutter web app with Codemagic.
title: Building for the web
weight: 6
---

You can build, test and publish Flutter web apps with Codemagic.

## Project structure requirements

Codemagic can detect your Flutter web project if it meets the following conditions:

- The project has a `web` folder

## Build configuration

1. Navigate to **App settings > Build**.
2. In the **Flutter version** dropdown, select which Flutter version to use. Flutter for web is supported starting from Flutter v1.5.4.
3. Under **Build for platforms**, select **Web**.
4. Select the build mode.
5. Under **Build arguments**, you will see the default build command Codemagic runs to build the app, but you can enter a different command.
6. Click **Save** to finish build configuration. You are now ready to run the build.

## Build artifacts

At the end of a successful build, Codemagic generates a `.zip` file of the contents of `$FCI_BUILD_DIR/build` and exports this as an artifact. You can either download it or set up publishing to [Codemagic Static Pages](https://docs.codemagic.io/publishing/publishing-to-codemagic-static-pages/). You can also use custom script to publish to third-party hosting sites.
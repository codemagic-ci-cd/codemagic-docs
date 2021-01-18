---
title: Build versioning
weight: 5
---

If you are going to publish your app to App Store Connect or Google Play, each uploaded binary must have a new version. There are several approaches you can use for build versioning on Codemagic. One of the easiest ways to increment app version with every build is by using the environment variables that Codemagic exports during the build. There are two environment variables that count the number of builds:

* `BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a specific **workflow** in Codemagic. In other words, if you have triggered 10 builds for some workflow in Codemagic, the next time you build it, `BUILD_NUMBER` will be exported as `11`.

* `PROJECT_BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a **project** in Codemagic. In contrast with `BUILD_NUMBER`, `PROJECT_BUILD_NUMBER` will increase every time you build any of the workflows of the app.

## Incrementing app version using environment variables

Here are some examples how you can increment the app version using Codemagic's read-only environment variables in build arguments:

```bash
--build-name=2.0.$BUILD_NUMBER --build-number=$(($BUILD_NUMBER + 100))

--build-name=1.0.0 --build-number=$BUILD_NUMBER
```

## Fetching build number from pubsec.yaml

Add a pre-build script that installs [yq](https://github.com/mikefarah/yq), a lightweight and portable command-line YAML processor: 

```bash
#!/usr/bin/env sh
HOMEBREW_NO_AUTO_UPDATE=1 brew install yq
```

Then add the following build arguments:

```bash
--build-number=$(yq e .version pubspec.yaml)
```

## Set Xcode project build number via command line

Calling agvtool is another way of forcing Xcode to set the build version for your next build. 

```bash
#!/bin/sh
set -e
set -x

cd $FCI_BUILD_DIR/ios
agvtool new-version -all $(($BUILD_NUMBER + 1))
```

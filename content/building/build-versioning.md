---
title: Build versioning
weight: 10
---

If you are going to publish your app to App Store Connect or Google Play, each uploaded binary must have a new version. There are several approaches you can use for build versioning on Codemagic. One of the easiest ways to increment app version with every build is by using the `BUILD_NUMBER` read-only environment variable in **build arguments**.

The `BUILD_NUMBER` read-only environment variable holds the total count of builds (including the ongoing build) for this project in Codemagic. In other words, if you have triggered 10 builds for some project in Codemagic, the next time you build it, `BUILD_NUMBER` will be exported as `11`.

{{<notebox>}} Please note that the number of builds in `BUILD_NUMBER` is counted separately for each workflow. {{</notebox>}}

## Incrementing app version

Here are some examples of the build arguments you can use to increment the app version. You can enter the build arguments in **App settings > Build > Build arguments**.

`--build-name=2.0.$BUILD_NUMBER --build-number=$(($BUILD_NUMBER + 100))`

`--build-name=1.0.0 --build-number=$BUILD_NUMBER`


## When build number should be fetched from pubsec.yaml

- add a prebuild script that install [yq](https://github.com/mikefarah/yq), a lightweight and portable command-line YAML processor, add the
following command to the pre build script so yq can be installed. 

```
#!/usr/bin/env sh
HOMEBREW_NO_AUTO_UPDATE=1 brew install yq
```

The head to App settings > Build > and in the *Build arguments* field:

`--build-number=$(cat ./pubspec.yaml | yq r - version)`  


## Set Xcode project build number via command line

Calling agvtool is another way of forcing Xcode to set the 
build version for your next build. 

```
#!/bin/sh
set -e
set -x

cd $FCI_BUILD_DIR/ios
agvtool new-version -all $(($BUILD_NUMBER + 1))
```




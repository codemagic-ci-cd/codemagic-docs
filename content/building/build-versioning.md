---
title: Build versioning
weight: 11
---

If you are going to publish your app to App Store Connect or Google Play, each uploaded binary must have a new version. There are several approaches you can use for build versioning on Codemagic. One of the easiest ways to increment app version with every build is by using the `BUILD_NUMBER` read-only environment variable in **build arguments**.

The `BUILD_NUMBER` read-only environment variable holds the total count of builds (including the ongoing build) for this project in Codemagic. In other words, if you have triggered 10 builds for some project in Codemagic, the next time you build it, `BUILD_NUMBER` will be exported as `11`.

{{<notebox>}} Please note that the number of builds in `BUILD_NUMBER` is counted separately for each workflow. {{</notebox>}}

## Incrementing app version

Here are some examples of the build arguments you can use to increment the app version. You can enter the build arguments in **App settings > Build > Build arguments**.

`--build-name=2.0.$BUILD_NUMBER --build-number=$(($BUILD_NUMBER + 100))`

`--build-name=1.0.0 --build-number=$BUILD_NUMBER`
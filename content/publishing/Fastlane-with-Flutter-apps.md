---
description: Fastlane for Flutter apps in Codemagic UI
title: How to use Fastlane with Codemagic
weight: 7
---

If your app has an existing *fastlane* setup, you can easily run *fastlane* scripts as part of the Codemagic build process and publish to Play Store, App Store or Crashlytics for example. Note that our builder machines have *fastlane* pre-installed. If you are building a Flutter app, you can add custom scripts in the UI in the pre-publish script or in the scripts section when using .yaml file.

One example to execute `fastlane beta` for successful Android builds for Flutter apps. This example is using conifguration that is done from UI.

1. Before running the script, navigate to **App settings > Environment variables** and add the API keys / secrets required for authorizing with the third-party service as secure [environment variables](../building/environment-variables). 
2. Click on the + sign between **Build** and **Publish** and paste your script to the pre-publish script field.

```
#!/usr/bin/env sh

set -e # exit on first failed command
set -x # print all executed commands to the log

if [ "$FCI_BUILD_STEP_STATUS" == "success" ]
then
        gem install bundler
        cd android
        bundle install
        bundle exec fastlane beta
fi
```
Now, whenever your build step is successful, fastlane *beta* lane is executed.

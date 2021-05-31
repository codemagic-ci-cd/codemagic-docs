---
description: How to deploy to fastlane beta in the Flutter workflow editor pre-publish script
title: Run fastlane for beta deployment
weight: 7
---

If your Flutter app has an existing *fastlane* setup for beta deployment, you can easily run *fastlane* scripts as part of the Codemagic build process and publish to Crashlytics, for example. Note that our builder machines have *fastlane* pre-installed. You can use the pre-publish script example below to execute `fastlane beta` for successful Android builds.

1. Before running the script, navigate to **App settings > Environment variables** and add the API keys / secrets required for authorizing with the third-party service as secure [environment variables](../building/environment-variables). 
2. Click on the + sign between **Build** and **Publish** and paste your script to the pre-publish script field.

```bash
#!/usr/bin/env bash

set -e # exit on first failed command
set -x # print all executed commands to the log

if [ "$FCI_BUILD_STEP_STATUS" = "success" ]
then
        gem install bundler
        cd android
        bundle install
        bundle exec fastlane beta
fi
```
Now, whenever your workflow is built successfully, your app is published to the beta testing services specified in your *beta* lane.
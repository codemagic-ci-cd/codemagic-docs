---
description: How to upload an apk or ipa file to App Center in a Flutter workflow editor post-build script
title: Publish app artifacts to App Center
weight: 6
aliases: [/publishing/publish-app-artifacts-to-app-center, /flutter-publishing/publish-app-artifacts-to-app-center]
---

As a custom build step, Codemagic can publish your app artifact to App Center using the [App Center Command Line Interface](https://github.com/microsoft/appcenter-cli). An **App Center API token** is required for publishing. It is advisable to create a new token for use on Codemagic, see the commands related to API tokens [here](https://github.com/microsoft/appcenter-cli#commands) or manage your tokens in [App Center settings](https://appcenter.ms/settings/apitokens). A token is generated under user settings, not app settings. 

1. Add your App Center API token to Codemagic as a secure [environment variable](../building/environment-variables) with the name `APP_CENTER_TOKEN`.
2. In your app settings, expand the step between Build and Publish and add the respective **post-build** script. In your script, **username** or **organization name** and **application identifier** need to be provided. **Username** or **organization name** are your App Center username when signing up or organization name in case of creating one in the App Center UI. **Application identifier** is your app's Bundle identifier / Package name. 

When creating an app in App Center, its name must match your app's bundle identifier or package name, otherwise an incorrect Correlation ID error is thrown by App Center.

**Example script for publishing apk**

```bash
#!/usr/bin/env zsh

echo 'Installing App Center CLI tools'
npm install -g appcenter-cli
echo "Publishing $ipaPath to App Center"
appcenter distribute release \
    --group Collaborators \
    --file YOUR_APK_PATH \
    --release-notes 'App submission via Codemagic' \
    --app APP_CENTER_USERNAME OR ORGANIZATION_NAME/YOUR_PACKAGE_NAME \
    --token $APP_CENTER_TOKEN \
    --quiet
```


**Example script for publishing ipa**

```bash
#!/usr/bin/env zsh

echo 'Installing App Center CLI tools'
npm install -g appcenter-cli
echo "Publishing $ipaPath to App Center"
appcenter distribute release \
    --group Collaborators \
    --file YOUR_IPA_PATH \
    --release-notes 'App submission via Codemagic' \
    --app APP_CENTER_USERNAME OR ORGANIZATION_NAME/YOUR_BUNDLE_IDENTIFER \
    --token $APP_CENTER_TOKEN \
    --quiet
```


This way, you can use Codemagic to automate the publishing of your Android or iOS app to App Center.

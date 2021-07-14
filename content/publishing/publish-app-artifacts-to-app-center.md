---
description: How to upload an apk or ipa file to App Center in a Flutter workflow editor post-build script
title: Publish app artifacts to App Center
weight: 7
---

As a custom build step, Codemagic can publish your app artifact to App Center using the [App Center Command Line Interface](https://github.com/microsoft/appcenter-cli). An **App Center API token** is required for publishing. It is advisable to create a new token for use on Codemagic, see the commands related to API tokens [here](https://github.com/microsoft/appcenter-cli#commands) or manage your tokens in [App Center settings](https://appcenter.ms/settings/apitokens).

1. Add your App Center API token to Codemagic as a secure [environment variable](../building/environment-variables) with the name `APP_CENTER_TOKEN`.
2. In your app settings, expand the step between Build and Publish and add the respective **post-build** script.

**Example script for publishing apk**

```bash
#!/usr/bin/env zsh

echo 'Installing App Center CLI tools'
npm install -g appcenter-cli

echo "Find build artifacts"
apkPath=$(find build -name "*.apk" | head -1)
echo "Found apk at $apkPath"

if [[ -z ${apkPath} ]]
then
    echo "No apks were found, skip publishing to App Center"
else
    echo "Publishing $apkPath to App Center"
    appcenter distribute release \
        --group Collaborators \
        --file "${apkPath}" \
        --release-notes 'App submission via Codemagic' \
        --app <username_or_organization>/<application_identifier> \
        --token "${APP_CENTER_TOKEN}" \
        --quiet
fi
```

**Example script for publishing ipa**

```bash
#!/usr/bin/env zsh

echo 'Installing App Center CLI tools'
npm install -g appcenter-cli

echo "Find build artifacts"
ipaPath=$(find ~/ipas -name "*.ipa" | head -1)
echo "Found ipa at $ipaPath"

if [[ -z ${ipaPath} ]]
then
    echo "No ipas were found, skip publishing to App Center"
else
    echo "Publishing $ipaPath to App Center"
    appcenter distribute release \
        --group Collaborators \
        --file "${ipaPath}" \
        --release-notes 'App submission via Codemagic' \
        --app <username_or_organization>/<application_identifier> \
        --token "${APP_CENTER_TOKEN}" \
        --quiet
fi
```

This way, you can use Codemagic to automate publishing of your Android or iOS app to App Center.

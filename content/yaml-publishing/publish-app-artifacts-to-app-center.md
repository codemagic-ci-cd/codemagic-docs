---
description: How to upload an apk or ipa file to App Center in a Flutter workflow editor post-build script
title: Microsoft App Center
weight: 4
aliases: 
  - /publishing/publish-app-artifacts-to-app-center
  - /flutter-publishing/publish-app-artifacts-to-app-center
  - /knowledge-base/publish-app-artifacts-to-app-center
---

As a custom build step, Codemagic can publish your app artifact to App Center using the [App Center Command Line Interface](https://github.com/microsoft/appcenter-cli). An **App Center API token** is required for publishing. It is advisable to create a new token for use on Codemagic, see the commands related to API tokens [here](https://github.com/microsoft/appcenter-cli#commands) or manage your tokens in [App Center settings](https://appcenter.ms/settings/apitokens). A token is generated under user settings, not app settings. 

## Configure environment variables

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `APP_CENTER_TOKEN`.
3. Enter your App Center API token as **_Variable value_**.
4. Enter the variable group name, e.g. **_app_center_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to also add `APP_CENTER_USERNAME` or `ORGANIZATION_NAME` and `APP_CENTER_APP_NAME` variables.
**Username** is your App Center username when signing up. Alternatively, you can use a combination of **organization name** (in case of creating one in the App Center UI) and **Application identifier** (your app's Bundle identifier / Package name). 

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - app_center_credentials
{{< /highlight >}}

## Publish to App Center

Add the following script to your `codemagic.yaml` file. If you are using **Flutter workflow editor**,
go to your app settings, expand the step between **Build** and **Publish** steps and add the respective **post-build** script.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Publish to App Center
      script: | 
        #!/usr/bin/env zsh

        echo 'Installing App Center CLI tools'
        npm install -g appcenter-cli

        echo "Publishing $ipaPath to App Center"
        appcenter distribute release \
            --group Collaborators \
            --file $ARTIFACT_PATH \
            --release-notes 'App submission via Codemagic' \
            --app $APP_CENTER_USERNAME \
            --token $APP_CENTER_TOKEN \
            --quiet
        # Alternatively: replace '$APP_CENTER_USERNAME' with '$ORGANIZATION_NAME/$APP_CENTER_APP_NAME'
{{< /highlight >}}


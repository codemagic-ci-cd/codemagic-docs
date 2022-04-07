---
description: How to upload dsym artifacts to Sentry
title: Uploading dSYM to Sentry
weight: 12
---

**Sentry** is a crash reporting platform that provides you with real-time insight into production deployments with info to reproduce and fix crashes.

**dSYM** is used to symbolicate your crash reports. The purpose of **dSYM** is to replace symbols in the crash logs with the specific methods so it will be readable and helpful for debugging the crash. To generate debug symbols with **Sentry**, **sentry/react-native** dependency needs to be installed. **Sentry** provide different ways of installation processes depending on what platform your app is built with. More information can be found in the **Sentry** environment [here](https://sentry.io/welcome/)

For example, the following command installs the dependency for for React Native apps:

```
npm install --save @sentry/react-native
```
It needs be added to a **codemagic.yaml** script:

```
scripts:
    - name: Install Sentry dependency
      script: |
         npm install --save @sentry/react-native
```
More information about **codemagic.yaml** can be found [here](https://docs.codemagic.io/yaml/yaml-getting-started/). 

As soon as your build finishes successfully, debug symbols are generated. However, if you want them to be displayed in the Codemagic UI on the build page, then the following path needs to be configured in **codemagic.yaml** under the artifacts section:

```
 - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
 ```

In order to upload the dSYM files to Sentry, add the following script to your **codemagic.yaml** configuration file or to your post-publish script in the Flutter workflow editor: 

```bash
echo "Find build artifacts"
dsymPath=$(find $CM_BUILD_DIR/build/ios/xcarchive/*.xcarchive -name "*.dSYM" | head -1)
if [[ -z ${dsymPath} ]]
then
echo "No debug symbols were found, skip publishing to Sentry"
else
echo "Publishing debug symbols from $dsymPath to Sentry"
sentry-cli --auth-token $SENTRY_ACCESS_TOKEN upload-dif --org $SENTRY_ORGANIZATION_NAME --project $SENTRY_PROJECT_NAME $dsymPath
fi
```
In order to configure them correctly, a Sentry access token is required which can be found in your Sentry account after signing up. After getting the necessary token along with your organization name and project name, it can be assigned to an environment variable. Environment variables can be added in the Codemagic web app using the ‘Environment variables’ tab. You can then and import your variable groups into your codemagic.yaml. For example, if you named your variable group ‘sentry_credentials’, you would import it as follows:

```
workflows:
  workflow-name:
    environment:
      groups:
        - codecov_token # <-- Holds $SENTRY_ACCESS_TOKEN, $SENTRY_ORGANIZATION_NAME and $SENTRY_PROJECT_NAME
```
 
The above-mentioned **dsymPath** is React Native and Native iOS specific and it could change depending on what platform the app is built. 

With Flutter applications:

```
dsymPath=$(find $CM_BUILD_DIR/build/ios/archive/Runner.xcarchive -name "*.dSYM" | head -1)
```

In general, remote access to the build machine is a better practice to find a correct path. More information can be found [here](https://docs.codemagic.io/troubleshooting/accessing-builder-machine-via-ssh/)

## Sample Project

A sample project for uploading **dSYM** files to Sentry can be found [here]()

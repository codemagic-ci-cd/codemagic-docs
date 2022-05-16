---
title: pCloudy integration
description: How to integrate your workflows with pCloudy using codemagic.yaml
weight: 9
---

**pCloudy** is a cloud-based mobile testing platform that provides the ability to test your apps on a wide-ranging list of real iOS and Android mobile devices and tablets.


## Create a pCloudy account

Signing up with pCloudy is required in order to be able to get the username and access token. You can sign up for free [here](https://www.pcloudy.com/).

## Configuring pCloudy testing envrionemnt upload with Codemagic

You can submit your applications to the pCloudy testing environments via Codemagic using a cURL request. In order to configure it correctly, you will need two environment variables: **username** and **access token**. They can be found in the pCloudy UI with your account. Environment variables can be added in the Codemagic web app using the ‘Environment variables’ tab. You can then and import your variable groups into your codemagic.yaml. For example, if you named your variable group ‘pcloudy_credentials’, you would import it as follows:

```
workflows:
  workflow-name:
    environment:
      groups:
        - pcloudy_credentials

```

For further information about using variable groups please click [here](https://docs.codemagic.io/variables/environment-variable-groups/).

## Uploading artefacts to pCloudy

You can test your **.ipa**, **.apk** or **.aab** directly on real devices rather than simulators. For that, after building your artefacts, the below cURL request needs to be in your yaml file:

```
 - name: pCloudy upload
   script: |      
    APP_TOKEN=$(curl -u "$PCLOUDY_USERNAME:$PCLOUDY_API_TOKEN" https://device.pcloudy.com/api/access | jq -r '.[].token')             
    curl -X POST -F "file=@android/app/build/outputs/apk/release/app-release.apk" -F "source_type=raw" -F "token=$APP_TOKEN" -F "filter=all" https://device.pcloudy.com/api/upload_file
```

Make sure that you add this cURL request after building the **.ipa**, **.apk** and **.aab**, otherwise you cannot attach their paths to the cURL request.
 

 **PCLOUDY_USERNAME** and **PCLOUDY_API_TOKEN** are generated for you automatically after signing up with **pCloudy**. Adding these as environment variables in the Codemagic UI will allow them to be used during a build.

In order to upload test suites for android apps, you need to run ./gradlew assembleAndroidTest and attach the generated artefact path to the cURL request:

```
 - name: pCloudy upload
   script: |      
    APP_TOKEN=$(curl -u "$PCLOUDY_USERNAME:$PCLOUDY_API_TOKEN" https://device.pcloudy.com/api/access | jq -r '.[].token')             
    curl -X POST -F "file=@android/app/build/outputs/apk/release/app-release.apk" -F "source_type=raw" -F "token=$APP_TOKEN" -F "filter=all" https://device.pcloudy.com/api/upload_file
    curl -X POST -F "file=@android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk" -F "source_type=raw" -F "token=$APP_TOKEN" -F "filter=all" https://device.pcloudy.com/api/upload_file
```

## Sample projects

A sample project that shows how to configure pCloudy integration is available [here]()

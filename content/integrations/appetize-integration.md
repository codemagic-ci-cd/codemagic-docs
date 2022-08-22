---
title: Appetize integration
description: How to integrate your workflows with Appetize using codemagic.yaml
weight: 11
---

[**Appetize**](https://appetize.io/) enables you to run native iOS and Android mobile apps directly in your browser. No downloads, plugins, or extra permissions needed. 

## Getting started
Before getting started you will need to generate an Appetize API token and a public key for your app.

### Get Appetize token
All users with admin or developer roles may request an API token after logging in to your [account](https://appetize.io/account) page.
After getting your **API_TOKEN** you need to add it to your [environment variables](/variables/environment-variable-groups/#storing-sensitive-valuesfiles) in a group named **appetize** for example.

### Get the public key for your app 
You have at least to upload your app once to [Appetize](https://appetize.io/upload) manually and then you can get the app *publicKey*.
in your *codemagic.yaml* file add the app key as a variable.

{{< highlight yaml "style=paraiso-dark">}}
    environment:
      groups:
        - appetize # <-- (Includes API_TOKEN)
      vars:
        APP_PUBLIC_KEY: "YOUR_APP_PUBLIC_KEY"
{{< /highlight >}}

## Uploading an Android app
The following script will help you achieving the deployment process:

{{< highlight yaml "style=paraiso-dark">}}
- name: Publish APK to Appetize
  script: | 
    apkPath="/build/app/outputs/flutter-apk/app-release.apk"
    echo $(curl --location --request POST 'https://'$API_TOKEN'@api.appetize.io/v1/apps/'$APP_PUBLIC_KEY'' --form 'file=@"'$apkPath'"')
{{< /highlight >}}
Change the value of the `apkPath` to your actual apk path.

## Uploading an iOS app
For iOS, you need to upload a `.zip` or `.tar.gz` file containing your compressed `.app` bundle.

### Xcode build
You can run one of these commands to get your `.app`:
{{< highlight yaml "style=paraiso-dark">}}
- name: Build unsigned .app
  script: | 
    xcodebuild -workspace "ios/Runner.xcworkspace" -scheme "$XCODE_SCHEME" -configuration "Debug" -sdk iphonesimulator -derivedDataPath ios/output
    # xcodebuild -project   "ios/Runner.xcodeproj" -scheme "$XCODE_SCHEME" -configuration "Debug" -sdk iphonesimulator -derivedDataPath ios/output
{{< /highlight >}}

Then you need to zip the generated `.app` folder:

{{< highlight yaml "style=paraiso-dark">}}
- name: zip App.app
  script: | 
    cd ios/output/Build/Products/Debug-iphonesimulator
    zip -r ios_app.zip $XCODE_SCHEME.app
{{< /highlight >}}
Don't forget to set the value of your `XCODE_SCHEME` variable.

### Upload the zip file
The following script will help you achieving the deployment process:

{{< highlight yaml "style=paraiso-dark">}}
- name: Publish App to Appetize
  script: | 
    zipPath="ios/output/Build/Products/Debug-iphonesimulator/ios_app.zip"
    echo $(curl --location --request POST 'https://'$API_TOKEN'@api.appetize.io/v1/apps/'$APP_PUBLIC_KEY'' --form 'file=@'"$zipPath"'')
{{< /highlight >}}
Change the value of the `zipPath` to your actual apk path.

## Sample project

A sample project that shows how to configure Appetize integration is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/appetize_integration_demo_project).

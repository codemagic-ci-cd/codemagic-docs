---
title: Build versioning
description: How to set a new build number to push to app stores
weight: 3
aliases: /building/build-versioning
---

If you are going to publish your app to App Store Connect or Google Play, each uploaded artifact must have a new version satisfying each app store's requirements. You'll need to devise a build versioning strategy that satisfies the App Store and/or Google Play Store versioning requirements and works for your team's development processes. On this page, we will explain the App Store and Google Play build versioning requirements, how the Flutter framework generalizes build versioning, and various strategies to set your build versions using Codemagic. See the [build versioning codemagic blog article](https://blog.codemagic.io/build-versioning-with-codemagic/) for a detailed overview.

## Overview of Build Versioning Requirements

### App Store Connect Requirements

The main values for iOS & macOS versioning are `CFBundleShortVersionString` (Release Version Number) and `CFBundleVersion` (Build Version Number). The best explanation of these two values, despite being outdated, is Apple's technical note on [Version Numbers and Build Numbers](https://developer.apple.com/library/archive/technotes/tn2420/_index.html).

[CFBundleShortVersionString](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring), Release Version Number, is the external user facing release version of your app displayed in the App Store. It must follow the `{major}.{minor}.{patch}` version format of three period separated integers. This must be incremented every time you release a version to the App Store. It's advisable to commit this value to version control and update it for every new release of your app to the App Store.

[CFBundleVersion](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion), Build Version Number, is the internal build version number of your application used for testing and development. It appears in `{major}.{minor}.{patch}` format of one to three period separated integers. If {minor}.{patch} are not provided, then they will default to zero. Build version number must be incremented with every release candidate submitted to TestFlight for a particular release version number. For iOS, build version number can be reused across different release version numbers while for macOS, build version number must be unique across all release version numbers. This value is best incremented and set by your CI/CD pipeline for every build you're submitting to TestFlight.

### Google Play Requirements

You can find the Google Play build versioning requirements in the [Android documentation](https://developer.android.com/studio/publish/versioning#appversioning). The important values defined in the build.gradle file are `versionName` and `versionCode`.

`versionName` is a text based, external, version of your app that is displayed to users and visible in Google Play. There are no restrictions for `versionName`, so you should choose something that makes sense for you and your users, such as `{major}.{minor}.{patch}` versioning. It's advisable to commit this value to version control and update it for every new release of your app to the Play Store.

`versionCode` is an internal version of your app that must be an integer value between `1` and `2100000000`. This must be incremented for every build you upload to Google Play. This value is best incremented and set by your CI/CD pipeline for every build.

### Flutter Build Versioning

Flutter generalizes iOS and Android build versioning with the [pubspec.yaml **version** property](https://github.com/flutter/flutter/blob/master/packages/flutter_tools/templates/app/pubspec.yaml.tmpl#L9-L19). This is a value in the form `{major}.{minor}.{patch}+{build_number}` (e.g. `1.2.3+45`). In Flutter builds, the value for build name, `{major}.{minor}.{patch}`, sets  `CFBundleShortVersionString` for iOS and `versionName` for Android. While the optional build number, `{build_number}`, sets `CFBundleVersion` for iOS and `versionCode` for Android. With `flutter build` commands these values can be overridden with the command line arguments `--build-name` and `--build-number` or by setting the environment variables `FLUTTER_BUILD_NAME` and `FLUTTER_BUILD_NUMBER`.

It is advisable to set your build version (e.g. `1.2.3`) in the `pubspec.yaml` `version` property and commit this to version control, as this will only change on every app release. On the other hand, you should consider having your CI/CD pipeline increment and set build number automatically, as this should be updated for every build.

## Build versioning from Codemagic environment variables 

There are several approaches you can use for build versioning on Codemagic. One of the easiest ways to increment the application version with every build is by using the [environment variables](/variables/environment-variables) that Codemagic exports during the build. There are two environment variables that count the number of builds:

* `BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a specific **workflow** in Codemagic. In other words, if you have triggered 10 builds for some workflow in Codemagic, the next time you build it, `BUILD_NUMBER` will be exported as `11`.

* `PROJECT_BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a **project** (application) in Codemagic. In contrast with `BUILD_NUMBER`, `PROJECT_BUILD_NUMBER` will increase every time you build any of the workflows of the app.

### Increment app version using environment variables

For Flutter, you can easily increment your build number and build name using the `PROJECT_BUILD_NUMBER` by passing the following to the build arguments:

```bash
--build-name=1.0.$PROJECT_BUILD_NUMBER --build-number=$PROJECT_BUILD_NUMBER
```

Note I've added `--build-name` as an example, if you've committed this to version control in `pubspec.yaml` version field, then don't pass in this argument to builds.

If you've added an existing project to Codemagic and need to offset the build number by the current build number, i.e. 200, then you can pass the following argument to correctly increment your build number.

```
--build-number=$(($PROJECT_BUILD_NUMBER + 200))
```

### Set Xcode project build number via command line

You can use the [Xcode command line agvtool](https://developer.apple.com/library/archive/qa/qa1827/_index.html) to set the next build version name for your build.

```bash
#!/bin/sh
set -e
set -x

cd $CM_BUILD_DIR/ios
agvtool new-version -all $(($BUILD_NUMBER + 1))
```

## Get App Store or TestFlight latest build number using Codemagic CLI Tools

Use [get-latest-app-store-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-app-store-build-number.md#get-latest-app-store-build-number) or [get-latest-testflight-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-testflight-build-number.md#get-latest-testflight-build-number) actions from [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/app-store-connect#app-store-connect) Codemagic CLI Tool to get the latest build numbers.

In order to do that, you need to provide API access to App Store Connect API by providing `ISSUER_ID`, `KEY_IDENTIFIER` and `PRIVATE_KEY` as arguments to the action, as defined below.

Additionally, you will need to provide the Application Apple ID (an automatically generated ID assigned to your app, e.g. `1234567890`).
It can be found under **General > App Information > Apple ID** under your application in App Store Connect.

{{<notebox>}}
If you use `codemagic.yaml` config and you have [Automatic code signing](/yaml-code-signing/signing-ios/#automatic-code-signing) setup, you are good to go directly to [Set the build number with `agvtool`](#set-the-build-number-with-agvtool)
{{</notebox>}}

### Creating the App Store Connect API key

{{< include "/partials/app-store-connect-api-key.md">}}

### Saving the API access arguments to environment variables

- `APP_STORE_CONNECT_KEY_IDENTIFIER`

  In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

- `APP_STORE_CONNECT_ISSUER_ID`

  In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

- `APP_STORE_CONNECT_PRIVATE_KEY`

  This is the private API key downloaded from App Store Connect. Select **secure** to encrypt the **contents** of the file and save it in the **Environment variables** section of the Codemagic UI.

#### Saving to `codemagic.yaml` config

Save the API key and the related information in the **Environment variables** section of the Codemagic UI and select **Secure**. Note that binary files have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to **Environment variables** and decoded during the build. 

Below are the environment variables you need to set:

```yaml
environment:
  groups:
    - app_store_credentials
  # Add the above mentioned group environment variables in Codemagic UI (either in Application/Team variables):
    # APP_STORE_CONNECT_ISSUER_ID
    # APP_STORE_CONNECT_KEY_IDENTIFIER
    # APP_STORE_CONNECT_PRIVATE_KEY
```

{{<notebox>}}
Alternatively, each property can be specified in the `scripts` section of the YAML file as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}

#### Saving to environment variables in the Flutter workflow editor

Add the following environment variables to your Flutter project in **App settings > Environment variables** (See the details [here](/flutter-configuration/env-variables)):

- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_IDENTIFIER`
- `APP_STORE_CONNECT_PRIVATE_KEY`

### Set the build number with `agvtool`

Once you have the App Store Connect API access set with mentioned above environment variables, you can get the build number using the tool and set your incremented project version.

Add the following script under your `scripts` field for `codemagic.yaml`, or as a custom [Pre-build script](/flutter-configuration/custom-scripts) in the Flutter workflow editor:

```bash
LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number '1234567890') # The argument is your application's Apple ID
```

To use the latest build number from Testflight use a similar script:

```bash
cd ./ios # Set working directory to iOS project directory as agvtool should run in directory with .xcodeproj file
agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
```

{{<notebox>}}
Helpful optional arguments:

* `--app-store-version=APP_STORE_VERSION` to get the latest build number for a particular version of your application (`CFBundleShortVersionString`)
* `--platform=IOS | MAC_OS | TV_OS` to specify which platform to get the latest build number

Check the details for [get-latest-app-store-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-app-store-build-number.md#optional-arguments-for-action-get-latest-app-store-build-number) or for [get-latest-testflight-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-testflight-build-number.md#optional-arguments-for-action-get-latest-testflight-build-number).
{{</notebox>}}

Alternatively, if you use `YAML` configuration, you may just export the value to an environment variable and use it under your `CFBundleVersion` in `Info.plist`.

## Get Google Play latest build number using Codemagic CLI Tools 

Use [`google-play get-latest-build-number`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#get-latest-build-number) action from Codemagic CLI tools to get the latest build number from Google Play Console.

In order to do that, you need to provide Google Play API access credentials by providing `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` as arguments to the action, as defined below.

Additionally, you will need to provide the package name of the app in Google Play Console (Ex. `com.example.app`).

{{<notebox>}}
If you use `codemagic.yaml` config and you have [Google Play publishing](/yaml-publishing/distribution/#google-play) setup, you can reuse the existing service account credentials and go directly to [Get the build number](#get-the-build-number). Only make sure they are specified under the`GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` environment variable.
{{</notebox>}}

### Creating Google service account credentials

You will need to set up a service account in Google Play Console and create a JSON key with credentials. See how to [set up a service account and create a key](../knowledge-base/google-play-api/#setting-up-the-service-account-on-google-play-and-google-cloud-platform).

### Saving the API access argument to environment variables in `codemagic.yaml` config

Save the API key as an [environment](/yaml/yaml-getting-started/#environment) variable group. Make sure to select **secure** the values of the variable before adding it to the configuration file.

```yaml
environment:
  groups:
    - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS)
```

{{<notebox>}}
Alternatively, credentials can be specified as a command argument with the dedicated flag, see the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#--credentialsgcloud_service_account_credentials). In any case, it is advisable to save the service account credentials file to an environment variable so that it can be accessed during a build without committing it to version control. The environment variable will be a fallback for the missing value in the script.
{{</notebox>}}

### Saving the API access argument to environment variables in the Flutter workflow editor

Add the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` environment variable to your Flutter project in **App settings > Environment variables** (See the details [here](/flutter-configuration/env-variables)).

### Get the build number

Once you have the Google Play Developer API access set with the mentioned above environment variable, you can get the build number using the tool:

```bash
LATEST_BUILD_NUMBER=$(google-play get-latest-build-number --package-name 'com.example.app') # use your own package name
```

{{<notebox>}}
By default, the action will try to get the latest build number as the maximum build number across all tracks (`internal`, `alpha`, `beta`, `production`, and custom tracks, if available). If you want to limit the search, you can specify particular tracks with the optional argument `--tracks` described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#--tracksinternal--alpha--beta--production).
{{</notebox>}}

There are a number of ways how you can pass the obtained build number to an Android project (through environment variables, `gradlew` argument properties, file, or a call from `build.gradle`). Check the [android-versioning-example repository](https://github.com/codemagic-ci-cd/android-versioning-example/tree/master) for more details.

#### Get the build number in the Flutter workflow editor

Provided you have exported your Google Play Console service account credentials as an environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`, you can call it immediately as a build argument to your Android build command to increment the build number:

```bash
--build-number=$(($(google-play get-latest-build-number --package-name 'com.example.app') + 1))  # use your own package name
```

Alternatively, you can add a custom [Pre-build script](/flutter-configuration/custom-scripts) and write the build number to a file, which will be read from your `android/app/build.gradle` during the build (See details [here](https://github.com/codemagic-ci-cd/android-versioning-example/tree/autoversioning_through_file)).

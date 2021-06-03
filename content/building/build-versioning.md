---
title: Build versioning
description: How to set a new build number to push to app stores
weight: 5
---

If you are going to publish your app to App Store Connect or Google Play, each uploaded binary must have a new version. There are several approaches you can use for build versioning on Codemagic. One of the easiest ways to increment app version with every build is by using the environment variables that Codemagic exports during the build. There are two environment variables that count the number of builds:

* `BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a specific **workflow** in Codemagic. In other words, if you have triggered 10 builds for some workflow in Codemagic, the next time you build it, `BUILD_NUMBER` will be exported as `11`.

* `PROJECT_BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a **project** in Codemagic. In contrast with `BUILD_NUMBER`, `PROJECT_BUILD_NUMBER` will increase every time you build any of the workflows of the app.

## Incrementing app version using environment variables

Here are some examples how you can increment the app version using Codemagic's read-only environment variables in build arguments:

```bash
--build-name=2.0.$BUILD_NUMBER --build-number=$(($BUILD_NUMBER + 100))

--build-name=1.0.0 --build-number=$BUILD_NUMBER
```

## Set Xcode project build number via command line

Calling agvtool is another way of forcing Xcode to set the build version for your next build.

```bash
#!/bin/sh
set -e
set -x

cd $FCI_BUILD_DIR/ios
agvtool new-version -all $(($BUILD_NUMBER + 1))
```

## App Store or TestFlight latest build number using Codemagic CLI Tools

Use [get-latest-app-store-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-app-store-build-number.md#get-latest-app-store-build-number) or [get-latest-testflight-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-testflight-build-number.md#get-latest-testflight-build-number) actions from [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/app-store-connect#app-store-connect) Codemagic CLI Tool to get the latest build numbers.

In order to do that, you need to provide API access to App Store Connect API by providing `ISSUER_ID`, `KEY_IDENTIFIER` and `PRIVATE_KEY` as arguments to the action, as defined below.

Additionally, you will need to provide the Application Apple ID (an automatically generated ID assigned to your app, e.g. `1234567890`).
It can be found under **General > App Information > Apple ID** under your application in App Store Connect.

{{<notebox>}}
If you use `codemagic.yaml` config and you have [Automatic code signing](https://docs.codemagic.io/code-signing-yaml/signing-ios/#automatic-code-signing) setup, you are good to go directly to [Set the build number with `agvtool`](#set-the-build-number-with-agvtool)
{{</notebox>}}

### Creating the App Store Connect API key

It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api). To do so:

1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
2. Click on the + sign to generate a new API key.
3. Enter the name for the key and select an access level. We recommend choosing either `Developer` or `App Manager`, read more about Apple Developer Program role permissions [here](https://help.apple.com/app-store-connect/#/deve5f9a89d7).
4. Click **Generate**.
5. As soon as the key is generated, you can see it added in the list of active keys. Click **Download API Key** to save the private key for later. Note that the key can only be downloaded once.

### Saving the API access arguments to environment variables

- `APP_STORE_CONNECT_KEY_IDENTIFIER`

  In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

- `APP_STORE_CONNECT_ISSUER_ID`

  In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

- `APP_STORE_CONNECT_PRIVATE_KEY`

  This is the private API key downloaded from App Store Connect. Note that when encrypting files via UI, they will be base64 encoded and would have to be decoded during the build. Alternatively, you can encrypt the **contents** of the file and save the encrypted value to the environment variable.

#### Saving to `codemagic.yaml` config

Save the API key and the related information as [environment](../getting-started/yaml#environment) variables. Make sure to [encrypt](./encrypting/#encrypting-sensitive-data) the values of the variables before adding them to the configuration file.

```yaml
environment:
  vars:
    APP_STORE_CONNECT_ISSUER_ID: Encrypted(...)
    APP_STORE_CONNECT_KEY_IDENTIFIER: Encrypted(...)
    APP_STORE_CONNECT_PRIVATE_KEY: Encrypted(...)
```

{{<notebox>}}
Alternatively, each property can be specified in the `scripts` section of the YAML file as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}

#### Saving to environment variables in the Flutter workflow editor

Add the following environment variables to your Flutter project in **App settings > Environment variables** (See the details [here](https://docs.codemagic.io/flutter/env-variables/)):

- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_IDENTIFIER`
- `APP_STORE_CONNECT_PRIVATE_KEY`

### Set the build number with `agvtool`

Once you have the App Store Connect API access set with mentioned above environment variables, you can get the build number using the tool and set your incremented project version.

Add the following script under your `scripts` field for `codemagic.yaml`, or as a custom [Pre-build script](https://docs.codemagic.io/flutter/custom-scripts/) in the Flutter workflow editor:

```bash
export APP_STORE_CONNECT_PRIVATE_KEY=$(echo $APP_STORE_CONNECT_PRIVATE_KEY | base64 --decode) # if you encrypted the file itself, not its content
LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number '1234567890') # The argument is your application's Apple ID
agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
```

To use the latest build number from Testflight use a similar script:

```bash
export APP_STORE_CONNECT_PRIVATE_KEY=$(echo $APP_STORE_CONNECT_PRIVATE_KEY | base64 --decode) # if you encrypted the file itself, not its content
LATEST_BUILD_NUMBER=$(app-store-connect get-latest-testflight-build-number '1234567890') # The argument is your application's Apple ID
agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
```

{{<notebox>}}
Helpful optional arguments:

* `--app-store-version=APP_STORE_VERSION` to get the latest build number for a particular version of your application (`CFBundleShortVersionString`)
* `--platform=IOS | MAC_OS | TV_OS` to specify which platform to get the latest build number

Check the details for [get-latest-app-store-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-app-store-build-number.md#optional-arguments-for-action-get-latest-app-store-build-number) or for [get-latest-testflight-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-testflight-build-number.md#optional-arguments-for-action-get-latest-testflight-build-number).
{{</notebox>}}

Alternatively, if you use `YAML` configuration, you may just export the value to an environment variable and use it under your `CFBundleVersion` in `Info.plist`.

## Google Play latest build number using Codemagic CLI Tools 

Use [get-latest-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#get-latest-build-number) action from [google-play](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/google-play#google-play) Codemagic CLI Tool to get the latest build number from Google Play.

In order to do that, you need to provide API access to Google Play Developer API by providing `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` as arguments to the action, as defined below.

Additionally, you will need to provide the package name of the app in Google Play Console (Ex. `com.google.example`).

{{<notebox>}}
If you use `codemagic.yaml` config and you have [Google Play publishing](https://docs.codemagic.io/publishing-yaml/distribution/#google-play) setup, you can reuse the existing service account credentials and go directly to [Get the build number](#get-the-build-number). Only make sure they are specified under the`GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` environment variable.
{{</notebox>}}

### Creating Google service account credentials

You will need to set up a service account in Google Play Console and create a JSON key with credentials. See how to [set up a service account and create a key](../knowledge-base/google-play-api/#setting-up-the-service-account-on-google-play-and-google-cloud-platform).

### Saving the API access argument to environment variables in `codemagic.yaml` config

Save the API key as an [environment](../getting-started/yaml#environment) variable. Make sure to [encrypt](./encrypting/#encrypting-sensitive-data) the values of the variable before adding it to the configuration file.

```yaml
environment:
  vars:
    GCLOUD_SERVICE_ACCOUNT_CREDENTIALS: Encrypted(...)
```

{{<notebox>}}
Alternatively, credentials can be specified as a command argument with the dedicated flag, see the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#--credentialsgcloud_service_account_credentials). But anyway you should have them in environment variables so that they can be decrypted. In that case, the environment variable will be fallback for missing value in the script.
{{</notebox>}}

### Saving the API access argument to environment variables in the Flutter workflow editor

Add the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` environment variable to your Flutter project in **App settings > Environment variables** (See the details [here](https://docs.codemagic.io/flutter/env-variables/)).

### Get the build number

Once you have the Google Play Developer API access set with the mentioned above environment variable, you can get the build number using the tool:

```bash
export GCLOUD_SERVICE_ACCOUNT_CREDENTIALS=$(echo $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS | base64 --decode) # if you encrypted the file itself, not its content
LATEST_BUILD_NUMBER=$(google-play get-latest-build-number --package-name 'com.google.example') # use your own package name
```

{{<notebox>}}
By default, the action will try to get the latest build number as the maximum build number across all tracks (`internal`, `alpha`, `beta`, `production`). If you want to limit the search, you can specify a particular track(s) with the optional argument `--tracks` described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#--tracksinternal--alpha--beta--production).
{{</notebox>}}

There are number of ways how you can pass the obtained build number to an Android project (through environment variables, `gradlew` argument properties, file, or a call from `build.gradle`). Check the [android-versioning-example repository](https://github.com/codemagic-ci-cd/android-versioning-example/tree/master) for more details.

#### Get the build number in the Flutter workflow editor

If you encrypted the content (not the file) of your gcloud service account credentials and added it as the environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`, you can call it immediately as a build argument to your android build command to increment the build number:

```bash
--build-number=$(($(google-play get-latest-build-number --package-name 'com.google.example') + 1))  # use your own package name
```

Alternatively you can add a custom [Pre-build script](https://docs.codemagic.io/flutter/custom-scripts/) and write the build number to a file, which will be read from your `android/app/build.gradle` during the build (See details [here](https://github.com/codemagic-ci-cd/android-versioning-example/tree/autoversioning_through_file)).

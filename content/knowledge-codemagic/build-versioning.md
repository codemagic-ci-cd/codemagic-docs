---
title: Automatic build versioning
description: How to set a new build number to push to app stores
weight: 2
aliases: 
  - /building/build-versioning
  - /configuration/build-versioning
---

If you are going to publish your app to **App Store Connect** or **Google Play**, each uploaded artifact must have a new version satisfying each app store's requirements. You'll need to devise a build versioning strategy that satisfies the App Store and/or Google Play Store versioning requirements and works for your team's development processes. On this page, we will explain the App Store and Google Play build versioning requirements, how the Flutter framework generalizes build versioning, and various strategies to set your build versions using Codemagic. See the [build versioning codemagic blog article](https://blog.codemagic.io/build-versioning-with-codemagic/) for a detailed overview.

{{< youtube UezlgmCZLcU >}}

## Overview of Build Versioning Requirements

#### App Store Connect Requirements

The main values for iOS & macOS versioning are `CFBundleShortVersionString` (Release Version Number) and `CFBundleVersion` (Build Version Number). The best explanation of these two values, despite being outdated, is Apple's technical note on [Version Numbers and Build Numbers](https://developer.apple.com/library/archive/technotes/tn2420/_index.html).

[CFBundleShortVersionString](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring), Release Version Number, is the external user facing release version of your app displayed in the App Store. It must follow the `{major}.{minor}.{patch}` version format of three period separated integers. This must be incremented every time you release a version to the App Store. It's advisable to commit this value to version control and update it for every new release of your app to the App Store.

[CFBundleVersion](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion), Build Version Number, is the internal build version number of your application used for testing and development. It appears in `{major}.{minor}.{patch}` format of one to three period separated integers. If {minor}.{patch} are not provided, then they will default to zero. Build version number must be incremented with every release candidate submitted to TestFlight for a particular release version number. For iOS, build version number can be reused across different release version numbers while for macOS, build version number must be unique across all release version numbers. This value is best incremented and set by your CI/CD pipeline for every build you're submitting to TestFlight.


#### Google Play Requirements

You can find the Google Play build versioning requirements in the [Android documentation](https://developer.android.com/studio/publish/versioning#appversioning). The important values defined in the build.gradle file are `versionName` and `versionCode`.

`versionName` is a text based, external, version of your app that is displayed to users and visible in Google Play. There are no restrictions for `versionName`, so you should choose something that makes sense for you and your users, such as `{major}.{minor}.{patch}` versioning. It's advisable to commit this value to version control and update it for every new release of your app to the Play Store.

`versionCode` is an internal version of your app that must be an integer value between `1` and `2100000000`. This must be incremented for every build you upload to Google Play. This value is best incremented and set by your CI/CD pipeline for every build.


#### Flutter Build Versioning

Flutter generalizes iOS and Android build versioning with the [pubspec.yaml **version** property](https://github.com/flutter/flutter/blob/master/packages/flutter_tools/templates/app/pubspec.yaml.tmpl#L9-L19). This is a value in the form `{major}.{minor}.{patch}+{build_number}` (e.g. `1.2.3+45`). In Flutter builds, the value for build name, `{major}.{minor}.{patch}`, sets  `CFBundleShortVersionString` for iOS and `versionName` for Android. While the optional build number, `{build_number}`, sets `CFBundleVersion` for iOS and `versionCode` for Android. With `flutter build` commands these values can be overridden with the command line arguments `--build-name` and `--build-number` or by setting the environment variables `FLUTTER_BUILD_NAME` and `FLUTTER_BUILD_NUMBER`.

In order to complete an automatic build versioning process for Flutter iOS apps, make sure the following keys along with their string values are set in `ios/Runner/info.plist`:

{{< highlight bash "style=paraiso-dark">}}
<key>CFBundleShortVersionString</key>
<string>$(FLUTTER_BUILD_NAME)</string>
<key>CFBundleVersion</key>
<string>$(FLUTTER_BUILD_NUMBER)</string>
{{< /highlight >}}

It is advisable to set your build version (e.g. `1.2.3`) in the `pubspec.yaml` `version` property and commit this to version control, as this will only change on every app release. On the other hand, you should consider having your CI/CD pipeline increment and set build number automatically, as this should be updated for every build.


<br>

---


## Build versioning in Codemagic

### Environment variables

There are several approaches you can use for build versioning on Codemagic. One of the easiest ways to increment the application version on every build is by using the [environment variables](/variables/environment-variables) that Codemagic exports during the build. There are two environment variables that count the number of builds:

* `BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a specific **workflow** in Codemagic. In other words, if you have triggered 10 builds for some workflow in Codemagic, the next time you build it, `BUILD_NUMBER` will be exported as `11`.

* `PROJECT_BUILD_NUMBER`. Holds the total count of builds (including the ongoing build) for a **project** (application) in Codemagic. In contrast with `BUILD_NUMBER`, `PROJECT_BUILD_NUMBER` will increase every time you build any of the workflows of the app.


{{< tabpane >}}
{{< tab header="Flutter" >}}
{{<markdown>}}
For Flutter, you can easily increment your build number and build name using the `PROJECT_BUILD_NUMBER` by passing the following to the build arguments:

{{< highlight bash "style=paraiso-dark">}}
--build-name=1.0.$PROJECT_BUILD_NUMBER --build-number=$PROJECT_BUILD_NUMBER
{{< /highlight >}}


Note that if the build version is manually incremented in `pubspec.yaml`, these arguments do not need to be passed to the build command.

If you've added an existing project to Codemagic and need to offset the build number by the current build number, i.e. 200, then you can pass the following argument to correctly increment your build number.

{{< highlight bash "style=paraiso-dark">}}
--build-number=$(($PROJECT_BUILD_NUMBER + 200))
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}


{{< tab header="Xcode" >}}
{{<markdown>}}
You can use the [Xcode command line agvtool](https://developer.apple.com/library/archive/qa/qa1827/_index.html) to set the next build version name for your build.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set the build version
      script: | 
        #!/bin/sh
        set -e
        set -x
        cd $CM_BUILD_DIR
        agvtool new-version -all $(($BUILD_NUMBER + 1))
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}



## App Store or TestFlight latest build number

Using Codemagic [CLI tools](../knowledge-codemagic/codemagic-cli-tools) it is possible to get the latest build number from **App Store** or from **TestFlight** so you can automatically increment the build version in your workflow. For more details, check the [get-latest-app-store-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-app-store-build-number.md#get-latest-app-store-build-number) or [get-latest-testflight-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-testflight-build-number.md#get-latest-testflight-build-number) actions from [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/app-store-connect#app-store-connect) Codemagic CLI Tool.


In order to allow Codemagic to connect to your App Store Connect account, you need to provide API access to App Store Connect API. It is possible that some of these environment variables are already configured as part of the iOS code signing configuration.

#### Creating the App Store Connect API key

{{< include "/partials/app-store-connect-api-key.md">}}

#### Configuring the API access variables

{{<notebox>}}
If you have already set up [App Store Connect publishing](../yaml-publishing/app-store-connect/) integration using a **codemagic.yaml** configuration you do **not** need to add separate environment variables as shown below.
{{</notebox>}}

Configure the following environment variables if they are missing from your Codemagic UI:

- `APP_STORE_CONNECT_KEY_IDENTIFIER`

  In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

- `APP_STORE_CONNECT_ISSUER_ID`

  In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

- `APP_STORE_CONNECT_PRIVATE_KEY`

  This is the private API key downloaded from App Store Connect.

- `APP_APPLE_ID`

  Automatically generated ID assigned to your app, e.g. `1234567890`.
  It can be found under **General > App Information > Apple ID** under your application in App Store Connect.

Follow these steps to configure the above variables for your Codemagic app:

{{< tabpane >}}
{{< tab header="codemagic.yaml" >}}
{{<markdown>}}
1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `APP_STORE_CONNECT_KEY_IDENTIFIER`.
3. Enter the variable value as **_Variable value_**.
4. Enter the variable group name, e.g. **_app_store_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to also add all of the above variables.

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - app_store_credentials
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}


{{< tab header="Flutter workflow editor" >}}
{{<markdown>}}
Add the following environment variables to your Flutter project in **App settings > Environment variables** (See the details [here](/flutter-configuration/env-variables)):

- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_IDENTIFIER`
- `APP_STORE_CONNECT_PRIVATE_KEY`
- `APP_APPLE_ID`
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}

<br>

{{<notebox>}}
**Tip:** Alternatively, each property can be specified in the `scripts` section of the YAML file as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}


#### Set the build number with `agvtool`

Once you have the App Store Connect API access configured, you can get the build number using the CLI tool and set your incremented project version.

Add the following script under your `scripts` field for `codemagic.yaml`, or as a custom [Pre-build script](/flutter-configuration/custom-scripts) in the Flutter workflow editor:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Get the latest build number
      script: | 
        LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number $APP_APPLE_ID)
        cd ./ios # avgtool must run in the folder where xcodeproj file is located
        agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
{{< /highlight >}}


{{<notebox>}}
**Tip:** Helpful optional arguments:

* `--app-store-version=APP_STORE_VERSION` to get the latest build number for a particular version of your application (`CFBundleShortVersionString`)
* `--platform=IOS | MAC_OS | TV_OS` to specify which platform to get the latest build number

Check the details for [get-latest-app-store-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-app-store-build-number.md#optional-arguments-for-action-get-latest-app-store-build-number) or for [get-latest-testflight-build-number](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/get-latest-testflight-build-number.md#optional-arguments-for-action-get-latest-testflight-build-number).
{{</notebox>}}

Alternatively, if you use `YAML` configuration, you may just export the value to an environment variable and use it under your `CFBundleVersion` in `Info.plist`.




## Google Play latest build number 

Use [`google-play get-latest-build-number`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#get-latest-build-number) action from Codemagic CLI tools to get the latest build number from Google Play Console.

In order to do that, you need to provide Google Play API access credentials by providing `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` as arguments to the action, as defined below.

Additionally, you will need to provide the package name of the app in Google Play Console (Ex. `com.example.app`).


#### Creating Google service account credentials

You will need to set up a service account in Google Play Console and create a JSON key with credentials. See how to [set up a service account and create a key](https://docs.codemagic.io/yaml-publishing/google-play/#configure-google-play-api-access).


#### Configuring the API access environment variables

{{< tabpane >}}
{{< tab header="codemagic.yaml" >}}
{{<markdown>}}
1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` as **_Variable name_**.
3. Copy and paste the credentials content as **_Variable value_**.
4. Enter the variable group name, e.g. **_google_play_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - google_play_credentials
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}


{{% tab header="Flutter workflow editor"%}}

Add the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` environment variable to your Flutter project in **App settings > Environment variables** (See the details [here](../flutter-configuration/env-variables)).
{{% /tab %}}
{{< /tabpane >}}


<br>
{{<notebox>}}
**Tip:** Alternatively, credentials can be specified as a command argument with the dedicated flag, see the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#--credentialsgcloud_service_account_credentials). In any case, it is advisable to save the service account credentials file to an environment variable so that it can be accessed during a build without committing it to version control. The environment variable will be a fallback for the missing value in the script.
{{</notebox>}}


#### Set the build number

Once you have the Google Play Developer API access set, you can get the build number using the CLI tool:

{{< highlight bash "style=paraiso-dark">}}
LATEST_BUILD_NUMBER=$(google-play get-latest-build-number --package-name 'com.example.app')
{{< /highlight >}}


{{<notebox>}}
**Note:** By default, the action will try to get the latest build number as the maximum build number across all tracks (`internal`, `alpha`, `beta`, `production`, and custom tracks, if available). If you want to limit the search, you can specify particular tracks with the optional argument `--tracks` described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/google-play/get-latest-build-number.md#--tracksinternal--alpha--beta--production).
{{</notebox>}}

There are a number of ways how you can pass the obtained build number to an Android project (through environment variables, `gradlew` argument properties, file, or a call from `build.gradle`). Check the [android-versioning-example repository](https://github.com/codemagic-ci-cd/android-versioning-example/tree/master) for more details. Here is an example using `gradlew` arguments:

1. Edit your `build.gradle` file by adding the functions to read version name and code number from argument properties

{{< highlight Groovy "style=paraiso-dark">}}
// get version code from the specified property argument `-PversionCode` during the build call
def getMyVersionCode = { ->
    return project.hasProperty('versionCode') ? versionCode.toInteger() : -1
}
// get version name from the specified property argument `-PversionName` during the build call
def getMyVersionName = { ->
    return project.hasProperty('versionName') ? versionName : "1.0"
}

....
android {
    ....
    defaultConfig {
        ...
        versionCode getMyVersionCode()
        versionName getMyVersionName()
{{< /highlight >}}

2. Add a script to your `codemagic.yaml` file to set the build number and pass it to `gradlew` command

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Build Android release
    script: | 
      LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
      if [ -z $LATEST_GOOGLE_PLAY_BUILD_NUMBER ]
        then
          # fallback in case no build number was found from Google Play.
          # Alternatively, you can `exit 1` to fail the build
          # BUILD_NUMBER is a Codemagic built-in variable tracking the number of
          # times this workflow has been built
          UPDATED_BUILD_NUMBER=$BUILD_NUMBER
        else
          UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
      fi
      cd android # change folder if needed 
      ./gradlew bundleRelease -PversionCode=$UPDATED_BUILD_NUMBER -PversionName=1.0.$UPDATED_BUILD_NUMBER
{{< /highlight >}}

#### Get the build number in the Flutter workflow editor

Provided you have exported your Google Play Console service account credentials as an environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`, you can call it immediately as a build argument to your Android build command to increment the build number:

{{< highlight bash "style=paraiso-dark">}}
--build-number=$(($(google-play get-latest-build-number --package-name 'com.example.app') + 1))
{{< /highlight >}}


Alternatively, you can add a custom [Pre-build script](/flutter-configuration/custom-scripts) and write the build number to a file, which will be read from your `android/app/build.gradle` during the build (See details [here](https://github.com/codemagic-ci-cd/android-versioning-example/tree/autoversioning_through_file)).



## Firebase App Distribution latest build version

Use [`firebase-app-distribution get-latest-build-version`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/firebase-app-distribution/get-latest-build-version.md#get-latest-build-version) action from Codemagic CLI tools to get the latest build version from Firebase App Distribution.

In order to do that, you need to provide Firebase access credentials by providing `FIREBASE_SERVICE_ACCOUNT_CREDENTIALS` as arguments to the action, as defined below.

Additionally, you will need to provide project ID (e.g. `228333310124`) and application ID (e.g. `1:228333310124:ios:5e439e0d0231a788ac8f09`).


#### Creating Firebase service account credentials

You will need to set up a [Firebase service account](https://docs.codemagic.io/yaml-publishing/firebase-app-distribution/).

#### Configuring the API access environment variables

{{< tabpane >}}
{{< tab header="codemagic.yaml" >}}
{{<markdown>}}
1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the `FIREBASE_SERVICE_ACCOUNT_CREDENTIALS` as **_Variable name_**.
3. Copy and paste the credentials content as **_Variable value_**.
4. Enter the variable group name, e.g. `firebase_credentials`. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - firebase_credentials
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}


{{% tab header="Flutter workflow editor"%}}

Add the `FIREBASE_SERVICE_ACCOUNT_CREDENTIALS` environment variable to your Flutter project in **App settings > Environment variables** (See the details [here](../flutter-configuration/env-variables)).
{{% /tab %}}
{{< /tabpane >}}


<br>
{{<notebox>}}
**Tip:** Alternatively, credentials can be specified as a command argument with the dedicated flag, see the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/firebase-app-distribution/get-latest-build-version.md#--credentials--cfirebase_service_account_credentials). In any case, it is advisable to save the service account credentials file to an environment variable so that it can be accessed during a build without committing it to version control. The environment variable will be a fallback for the missing value in the script.
{{</notebox>}}


#### Set the build version for iOS projects using `agvtool`

Add the following script under your `scripts` field for `codemagic.yaml`, or as a custom [Pre-build script](/flutter-configuration/custom-scripts) in the Flutter workflow editor:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Get the latest build number
      script: |
        LATEST_BUILD_VERSION=$(firebase-app-distribution get-latest-build-version -p 228333310124 -a 1:228333310124:ios:5e439e0d0231a788ac8f09)
        cd ./ios # avgtool must run in the folder where xcodeproj file is located
        agvtool new-version -all $(($LATEST_BUILD_VERSION + 1))
{{< /highlight >}}


Alternatively, if you use `YAML` configuration, you may just export the value to an environment variable and use it under your `CFBundleVersion` in `Info.plist`.


#### Set the build version for Android projects

Once you have the Firebase access set, you can get the build version using the CLI tool:

{{< highlight bash "style=paraiso-dark">}}
LATEST_BUILD_VERSION=$(firebase-app-distribution get-latest-build-version -p 228333310124 -a 1:228333310124:ios:5e439e0d0231a788ac8f09)
{{< /highlight >}}

There are a number of ways how you can pass the obtained build version to an Android project (through environment variables, `gradlew` argument properties, file, or a call from `build.gradle`). Here is an example using `gradlew` arguments:

1. Edit your `build.gradle` file by adding the functions to read version name and code number from argument properties

{{< highlight Groovy "style=paraiso-dark">}}
// get version code from the specified property argument `-PversionCode` during the build call
def getMyVersionCode = { ->
    return project.hasProperty('versionCode') ? versionCode.toInteger() : -1
}
// get version name from the specified property argument `-PversionName` during the build call
def getMyVersionName = { ->
    return project.hasProperty('versionName') ? versionName : "1.0"
}

....
android {
    ....
    defaultConfig {
        ...
        versionCode getMyVersionCode()
        versionName getMyVersionName()
{{< /highlight >}}

2. Add a script to your `codemagic.yaml` file to set the build version and pass it to `gradlew` command

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Build Android release
    script: |
      LATEST_FIREBASE_BUILD_VERSION=$(firebase-app-distribution get-latest-build-version -p "$PACKAGE_ID" -a "$APPLICATION_ID")
      if [ -z $LATEST_FIREBASE_BUILD_VERSION ]
        then
          # Fallback in case no build version was found at Firebase.
          # Alternatively, you can `exit 1` to fail the build.
          # BUILD_NUMBER is a Codemagic built-in variable tracking the number of
          # times this workflow has been built
          UPDATED_BUILD_VERSION=$BUILD_NUMBER
        else
          UPDATED_BUILD_VERSION=$(($LATEST_FIREBASE_BUILD_VERSION + 1))
      fi
      cd android # change folder if needed
      ./gradlew bundleRelease -PversionCode=$UPDATED_BUILD_VERSION -PversionName=1.0.$UPDATED_BUILD_VERSION
{{< /highlight >}}

#### Get the build version in the Flutter workflow editor

Provided you have exported your Firebase service account credentials as an environment variable `FIREBASE_SERVICE_ACCOUNT_CREDENTIALS`, you can call it immediately as a build argument to your Android build command to increment the build version:

{{< highlight bash "style=paraiso-dark">}}
--build-number=$(($(firebase-app-distribution get-latest-build-version -p 228333310124 -a 1:228333310124:ios:5e439e0d0231a788ac8f09) + 1))
{{< /highlight >}}


Alternatively, you can add a custom [Pre-build script](/flutter-configuration/custom-scripts) and write the build version to a file, which will be read from your `android/app/build.gradle` during the build (see details [here](https://github.com/codemagic-ci-cd/android-versioning-example/tree/autoversioning_through_file)).

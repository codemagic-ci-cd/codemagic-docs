---
title: Building a React Native app
description: How to build a React Native app with codemagic.yaml
weight: 8
aliases: 
  - '../yaml/building-a-react-native-app'
---

React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. When working with YAML, the basics are still the same, the build scripts are added to the `scripts` section in the [overall architecture](../getting-started/yaml#template).

## Setting up a React Native project

The apps you have available on Codemagic are listed on the Applications page. See how to add additional apps [here](./adding-apps-from-custom-sources).

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. On the popup, select **React Native App** as the project type and click **Continue**.
3. Create a [`codemagic.yaml`](./yaml) file and add in it the commands to build, test and publish your project. See the full Android and iOS workflow examples below.
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Tip**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).
{{</notebox>}}

## Android

Set up local properties

```yaml
- echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
```

Building an Android application:

```yaml
- cd android && ./gradlew build
```

## iOS

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

Script for building an iOS application:

```yaml
- xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"
```

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}} 

## Testing, code signing and publishing

To test and publish a React Native app:

* The code for testing a React Native app also goes under `scripts`, before build commands. An example for testing a React Naive app can be found [here](../testing-yaml/testing/#react-native-unit-test).
* All iOS and Android applications need to be signed before release. See how to set up [iOS code signing](../code-signing-yaml/signing-ios) and [Android code signing](../code-signing-yaml/signing-android).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../publishing-yaml/distribution/#publishing).

## iOS and Android workflow examples

Please refer to the React Native demo project on GitHub:

[https://github.com/codemagic-ci-cd/react-native-demo-project](https://github.com/codemagic-ci-cd/react-native-demo-project)

This shows how to configure the **codemagic.yaml** so you can build and publish your **iOS** app to **App Store Connect**.

It also contains a workflow that shows how to build and publish your **Android** app to a **Google Play** internal track.

## Build versioning your React Native app

### Android versioning

{{<notebox>}}When using automatic build versioning in **codemagic.yaml** please note that configuration changes still need to be made in `android/app/build.gradle` {{</notebox>}}

In the [build.gradle](https://github.com/codemagic-ci-cd/react-native-demo-project/blob/master/android/app/build.gradle) note how the versionCode is set in the `defaultConfig{}`.

Additionally, pay attention to how `signingConfigs{}` and `buildTypes{}` are configured for debug and release.

### iOS versioning

{{<notebox>}}Build versioning for iOS projects is performed as a script step in the codemagic.yaml{{</notebox>}}
 
See the **Increment build number** script in the [codemagic.yaml](https://github.com/codemagic-ci-cd/react-native-demo-project/blob/master/codemagic.yaml) in the React Native demo project on GitHub.
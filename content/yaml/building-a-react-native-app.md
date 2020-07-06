---
title: Building a React Native app
description: Building a React Native app with YAML.
weight: 5
---

React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. When working with YAML, the basics are still the same, the build scripts are added to the `scripts` section in the [overall architecture](../yaml/yaml/#template).

## Android

Set up local properties

    - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"

Building an Android application:

    - cd android && ./gradlew build

## iOS

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

Script for building an iOS application:

    - xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}} 

## Testing, code signing and publishing

To test and publish a React Native app:

* The code for testing a React Native app also goes under `scripts`, before build commands. An example for testing a React Naive app can be found [here](../yaml/testing/#react-native-unit-test).
* All iOS and Android applications need to be signed before release. Different script examples are available [here](../yaml/distribution/).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../yaml/distribution/#publishing).

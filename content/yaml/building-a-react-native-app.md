---
title: Building a React Native app
description: Building a React Native app with YAML.
weight: 5
---

React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. When working with YAML, the basics are still the same, the build scripts are added to the `scripts` section in the [overall architecture](../yaml/yaml/#template).

## Android

Script for building an Android application:

    - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
    - cd android && ./gradlew build

## iOS

Script for building an iOS application:

    - xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"


## Publishing

All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play and App Store Connect. Script examples for all of them are available [here](../yaml/distribution/#publishing).

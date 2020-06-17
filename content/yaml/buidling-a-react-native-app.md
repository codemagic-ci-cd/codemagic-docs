---
title: Building a React Native app
description: Building an iOS app with YAML
weight: 3
---

### Android:

    - npm install
    - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
    - cd android && ./gradlew bundleRelease

### iOS:

    - xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"
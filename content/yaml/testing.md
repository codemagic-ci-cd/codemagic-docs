---
title: Testing
description: Testing with YAML.
weight: 7
---

Test scripts are added under `scripts` in the [overall architecture](../yaml/yaml/#template), before the build commands.

### React Native unit test

This is a basic example with jest, given that jest tests are defined in the package.json file.

    npm test

### Native Android

For non-UI tests or unit testing:

    ./gradlew test

Ui test's also known as instrumental tests:

    ./gradlew connectedAndroidTest

### Native iOS

    xcodebuild \
    -workspace MyAwesomeApp.xcworkspace \
    -scheme MyAwesomeApp \
    -sdk iphonesimulator \
    -destination 'platform=iOS Simulator,name=iPhone 6,OS=8.1' \
    test | xcpretty (edited) 

### Flutter drive test
    flutter test

### Flutter drive test

    flutter emulators --launch apple_ios_simulator                  # for android use: flutter emulators --launch emulator
    flutter drive --target=test_driver/my_drive_target.dart

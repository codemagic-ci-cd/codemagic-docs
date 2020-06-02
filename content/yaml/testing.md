---
title: Testing
description: Testing with YAML.
weight: 3
---

There are two types of tests that users can run when developing mobile apps, unit tests (for testing code) and instrumentation tests (for testing the UI and the application in general). 

These tests take place in a simulator (iOS) or emulator (android), depending on the platform.

### React Native unit test

This is a basic example with jest, given that jest tests are defined in the package.json file.

    npm test

### Native Android

For non UI tests or unit testing:

    ./gradlew test

Ui test's also known as Instrumental tests:

    ./gradlew connectedAndroidTest

### Native iOS

    xcodebuild \
    -workspace MyAwesomeApp.xcworkspace \
    -scheme MyAwesomeApp \
    -sdk iphonesimulator \
    -destination 'platform=iOS Simulator,name=iPhone 6,OS=8.1' \
    test | xcpretty (edited) 

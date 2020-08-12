---
title: Testing
description: Testing with YAML.
weight: 7
---

Test scripts are added under `scripts` in the [overall architecture](../yaml/yaml/#template), before the build commands.

## React Native unit test

This is a basic example with jest, given that jest tests are defined in the `package.json` file.

    npm test

## Native Android

For non-UI tests or unit testing:

    ./gradlew test

UI tests (also known as instrumented tests):

    ./gradlew connectedAndroidTest

## Native iOS

    xcodebuild \
        -workspace MyAwesomeApp.xcworkspace \
        -scheme MyAwesomeApp \
        -sdk iphonesimulator \
        -destination 'platform=iOS Simulator,name=iPhone 6,OS=8.1' \
        test | xcpretty

## Flutter test

    flutter test

**Tip:** you can display Flutter test results visually in the build view if you use expanded form of the script in codemagic.yaml.
Just include the `test_report` field with a glob pattern matching the test result file location:

```yaml
scripts:
  - echo 'previous step'
  - name: Unit tests
    script: |
      mkdir -p test-results
      flutter test --machine > test-results/flutter.json
    test_report: test-results/flutter.json
```

## Flutter integration test

`flutter_driver` dependency allows you to run integration tests on a real device or emulator. Thus, Android application tests can be run on a Android emulator, iOS application tests can be run on an iOS simulator, and web application tests can be run on a web browser driver.

### Running an iOS/Android application tests on a mobile simulator/emulator

        flutter emulators --launch apple_ios_simulator             # for android use: flutter emulators --launch emulator
        flutter drive --target=test_driver/my_drive_target.dart

### Running a web application tests on a web browser driver

Chrome

      scripts:
        - echo 'previous step'
        - name: 'Flutter drive web test'
          script: |
            chromedriver --port=4444 &
            flutter config --enable-web
            flutter drive --target=test_driver/button_pressing.dart -d chrome --browser-name chrome --release


Safari

      scripts:
        - echo 'previous step'
        - name: 'Flutter drive web test'
          script: |
            sudo safaridriver --enable
            safaridriver --port 4444 &
            flutter config --enable-web
            flutter drive --target=test_driver/button_pressing.dart --browser-name safari --release


{{<notebox>}}
Make sure you use Flutter channel **Beta** or higher since Flutter for web is not yet available on **Stable**.
{{</notebox>}}
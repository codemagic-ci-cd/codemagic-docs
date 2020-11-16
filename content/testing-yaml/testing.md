---
title: Testing
description: Testing with YAML.
weight: 1
aliases:
  - '../yaml/testing'
---

Test scripts are added under `scripts` in the [overall architecture](../getting-started/yaml#template), before the build commands.
You can display test results visually in the build overview if you use expanded form of the script in codemagic.yaml.
Just include the `test_report` field with a glob pattern matching the test result file location. Supported test report formats are [Junit XML](https://llg.cubic.org/docs/junit/) and Flutter `--machine` report in `.json` format.

## React Native unit test

This is a basic example with jest, given that jest tests are defined in the `package.json` file.

```bash
npm test
```

## Native Android

For non-UI tests or unit testing:

```bash
- name: Test
  script: ./gradlew test
  test_report: app/build/test-results/**/*.xml
```

UI tests (also known as instrumented tests):

```bash
- name: Launch emulator
  script: |
    cd $ANDROID_HOME/tools
    emulator -avd emulator &
    adb wait-for-device
- name: Test
  script: |
    set -e
    ./gradlew connectedAndroidTest
    adb logcat -d > emulator.log
  test_report: app/build/outputs/androidTest-results/connected/*.xml
```

**Tip:**: you can save the emulator log with `adb logcat -d > emulator.log` command.

Instrumentation test with Firbase test lab

```bash
    environment:
      vars:
        ...
        GCLOUD_SERVICE_CREDENTIALS: # encrypted key of your google service account with role Editor
        GCLOUD_PROJECT: # name of your gcloud project
    scripts:
      ...
      - name: Authorize gcloud service account
        script: |
          GCLOUD_SERVICE_CREDENTIALS_PATH=$FCI_BUILD_DIR/google-services-credentials.json
          echo $GCLOUD_SERVICE_CREDENTIALS | base64 --decode > $GCLOUD_SERVICE_CREDENTIALS_PATH
          gcloud auth activate-service-account --key-file=$GCLOUD_SERVICE_CREDENTIALS_PATH
          gcloud config set project $GCLOUD_PROJECT
      - name: Firebase connected test
        script: |
          ./gradlew assembleDevDebugAndroidTest                                            # assemble a test to run it on firebase
          gcloud firebase test android run \
            --app "app/dev/release/app.aab" \                                              # path to your actual application
            --test "$(find app/build/outputs/apk/androidTest -name "*.apk" | head -1)" \   # path to the assembled test
            --device "model=Nexus5X,version=23" \                                          # a device available from gcloud firebase test android models list
            --timeout "45m" \
            --type "instrumentation" \
            --quiet
```

## Native iOS

```bash
- name: iOS test
    script: |
    xcode-project run-tests \
        --workspace MyAwesomeApp.xcworkspace \
        --scheme MyAwesomeApp \
        --device "iPhone 11"
    test_report: build/ios/test/*.xml
```

Please check [Codemagic CLI tools documentation](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/run-tests.md#run-tests) to learn about more optional arguments to `xcode-project run-tests`.

## Flutter test

    flutter test

**Tip:** you can display Flutter test results visually in the build overview if you use expanded form of the script in codemagic.yaml.
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

## Flutter integration tests

The `flutter_driver` dependency allows you to run integration tests on a real device or emulator. Android application tests can be run on an Android emulator, iOS application tests can be run on an iOS simulator, and web application tests can be run on a web browser driver.

### Running iOS/Android application tests on a mobile simulator/emulator

```bash
flutter emulators --launch apple_ios_simulator             # for android use: flutter emulators --launch emulator
flutter drive --target=test_driver/my_drive_target.dart
```

### Running web application tests on a web browser driver

Chrome

```yaml
scripts:
  - echo 'previous step'
  - name: 'Flutter drive web test'
    script: |
      chromedriver --port=4444 &
      flutter config --enable-web
      flutter drive --target=test_driver/button_pressing.dart -d chrome --browser-name chrome --release
```

Safari

```yaml
scripts:
  - echo 'previous step'
  - name: 'Flutter drive web test'
    script: |
      sudo safaridriver --enable
      safaridriver --port 4444 &
      flutter config --enable-web
      flutter drive --target=test_driver/button_pressing.dart --browser-name safari --release
```

{{<notebox>}}
Make sure to use Flutter channel **Beta** or higher since Flutter for web is not yet available on **Stable**.
{{</notebox>}}
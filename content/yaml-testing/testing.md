---
title: Running tests
description: How to run tests with codemagic.yaml
weight: 1
aliases:
  - '../yaml/testing'
  - /testing-yaml/testing/
---

Test scripts are added under `scripts` in the [overall architecture](../getting-started/yaml#template), before the build commands.

You can display test results visually in the build overview if you use an expanded form of the script in `codemagic.yaml`. Just include the `test_report` field with a glob pattern matching the test result file location. We support every test runner, including GoTest, RSpec, PHPUnit, Karma, PyTest, ESLint, Cucumber, ExUnit, Mocha, CargoTest, and JUnit. If your test runner can export [Junit XML](https://llg.cubic.org/docs/junit/) and `.JSON` for Flutter's `--machine` report test results, Codemagic can use it.

For instructions on testing your app on real devices in Firebase Test Lab, refer [here](./firebase-test-lab).

## Flutter unit tests

    flutter test

**Tip:** you can display Flutter test results visually in the build overview if you use the expanded form of the script in codemagic.yaml.
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

The `integration_test` dependency allows you to run integration tests on a real device or emulator. Android application tests can be run on an Android emulator, iOS application tests can be run on an iOS simulator, and web application tests can be run on a web browser driver.

**Tip:** It is possible to generate machine readable output for integration tests using the `--machine` flag; hence the results can be displayed in the UI. Just include the `test_report` field with a glob pattern matching the test result file location:

```yaml
scripts:
  - echo 'previous step'
  - name: Integration tests
    script: |
      mkdir -p test-results
      flutter -d emulator-5554 test --machine > test-results/flutter.json integration_test # for iOS use: -d iPhone
    test_report: test-results/flutter.json
```

To run integration tests for web, it is possible to use `chromedriver`. Take note that for running tests on web, it is necessary to provide the `--driver` and `--target` arguments, and machine-readable output is unavailable.

```yaml
scripts:
  - echo 'previous step'
  - name: Integration tests
    script: |
      flutter config --enable-web
      chromedriver --port=4444 &
      flutter -d chrome drive --driver=test_driver/integration_driver.dart --target=integration_test/app_test.dart
```

### Running iOS/Android application tests on a mobile simulator/emulator

You can launch the iOS simulator and run tests on the simulator as follows:

```yaml
flutter emulators --launch apple_ios_simulator
flutter -d iPhone test integration_test
```

You can launch a specific iOS simulator and run tests on the simulator using ‘simctl’ which is a binary to interact with iOS simulators from the command line, as follows:

```yaml
xcrun simctl list # This command will give list available simulators on the machine along with UDIDs, you can find list of Devices depending upon type of machine you are running, here https://docs.codemagic.io/specs/versions-macos-xcode-12-5/#devices
xcrun simctl boot 99B14BF4-7966-4427-ACD1-34BFE4D26A01 # Specify the UDID to boot the simulator
flutter -d 99B14BF4-7966-4427-ACD1-34BFE4D26A01 test integration_test # Specify the UDID to the integration tests command
```

For the Android emulator you can launch and run your tests as follows:

```yaml 
flutter emulators --launch emulator &                       # The ampersand is used to run the emulator in the background without blocking the next command
adb wait-for-device                                         # adb wait-for-device is used to wait for the emulator to finish loading
flutter -d emulator-5554 test integration_test 
```

### Running web application tests on a web browser driver

Chrome

```yaml
scripts:
  - echo 'previous step'
  - name: 'Flutter integration test for web'
    script: |
      chromedriver --port=4444 &
      flutter config --enable-web
      flutter drive --driver=test_driver/integration_driver.dart --target=integration_test/app_test.dart -d web-server --release --browser-name chrome
```

Safari

```yaml
scripts:
  - echo 'previous step'
  - name: 'Flutter integration test for web'
    script: |
      sudo safaridriver --enable
      safaridriver --port 4444 &
      flutter config --enable-web
      flutter drive --driver=test_driver/integration_driver.dart --target=integration_test/app_test.dart -d web-server --release --browser-name safari
```

## React Native Unit Tests using Jest

This is a basic example with Jest, given that Jest tests are defined in the `package.json` file as below.

```json
// package.json
"scripts": {
  "test": "jest"
},
"jest": {
  "preset": "jest-expo",
  "setupFiles": ["<rootDir>/testing/jest-setup.js"]
}
```

In the root directory of the project, add a new file and name it `jest.config.js`. Within `jest.config.js`, add the below code:

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
}
```

`preset` is a preset that is used as a base for Jest’s configuration. A preset should point to an npm module that has a `jest-preset.json` or `jest-preset.js` file at the root.

`setUpFilesAfterEnv` specifies a list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed.

To execute the tests, the command is:

```bash
npm test

# OR

yarn test
```

In React Native, 3rd party modules are oftentimes published as **untranspiled**. Since all files inside `node_modules` are not transformed by default, Jest will not understand the code in these modules, resulting in syntax errors. To overcome this, you need to use `transformIgnorePatterns` to allow transpiling such modules.

Below is a configuration for the same which needs to be specified in `package.json`:

```json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)"
  ]
}
```

Once the project setup is done on Codemagic, you need to add the testing configuration in the `codemagic.yaml` file as shown below for the tests to be executed:

```yaml
workflows:

  my-workflow:
    name: <your workflow name>
      instance_type: linux                # specify linux or linux_2 for Linux instances; mac_mini or mac_pro for macOS instances
      max_build_duration: 60
  ...

    scripts:
      - name: Install npm dependencies
        script: npm install

        ...

      - name: Tests                       # Insert before the build command
        script: npm test

        ...

      - name: Build ipa for distribution
        script: xcode-project build-ipa --workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" --scheme $XCODE_SCHEME

      - name: Build Android app
        script: cd android && ./gradlew assembleRelease

  ...
```

## React Native Integration Tests using Appium and Emulator

[Appium](https://appium.io/) is an open-source testing automation framework for testing cross-platform applications and mobile applications. You can use Appium and WebDriverIO with React Native thanks to its out-of-the-box support.

You need to install and setup WebDriverIO in your project root directory before running CI or tests on Codemagic. On your local machine, run the below command and provide input to a series of questions:

```bash
npx wdio config
```

Once it's done, `wdio.conf` file will be generated inside the `tests` directory.

Perform the following changes to configure WebDriverIO to work with Appium and run tests on Android Emulator:

```javascript
exports.config = {
  services: ['appium'],
  port: 4723,
  runner: 'local',
  specs: [
    './tests/specs/**/*.js'
  ],
  capabilities: [{
     maxInstances: 1,
     browserName: '',
     appiumVersion: '1.13.0',
     platformName: 'Android',
     platformVersion: '<emulator platform version>',    // Specify your emualator details
     deviceName: '<emulator name>',
     app: '<path to APK>',
     automationName: 'UiAutomator2'
  }],

  logLevel: 'trace',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd'
    timeout: 60000
  }
}
```

Once the project setup is done on Codemagic, you need to add the testing configuration in the `codemagic.yaml` file as shown below for the tests to be executed:

```yaml
workflows:

  my-workflow:
    name: <your workflow name>
      instance_type: linux                # specify linux or linux_2 for Linux instances; mac_mini or mac_pro for macOS instances
      max_build_duration: 60
  ...

    scripts:
      - name: Install npm dependencies    # Add Appium and WebDriverIO dependencies
        script: npm install && npm install -g appium && npm install --save webdriverio @wdio/cli

        ...

      - name: Launch emulator             # Insert before the build command
        script: |
          react-native run-android  &
          adb wait-for-device
      - name: Launch Appium
        script: appium
      - name: Run WebDriver test suite
        script: npx wdio ./wdio.conf.js

        ...

      - name: Build ipa for distribution
        script: xcode-project build-ipa --workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" --scheme $XCODE_SCHEME
      - name: Build Android app
        script: cd android && ./gradlew assembleRelease

  ...
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

Please check [Codemagic CLI tools documentation](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/run-tests.md#run-tests) to learn more about more optional arguments to `xcode-project run-tests`.

## Native macOS 

{{<notebox>}}
macOS UI Testing is only supported on Xcode 13 images and above as it requires System Integrity Protection (SIP) to be disabled for accessing the accessibility permissions. Older images with Xcode 12 and below do not have SIP disabled and are unsuitable for UI testing macOS apps.
{{</notebox>}}

```bash
- name: macOS test
  script: |
    xcode-project run-tests \
        --project MyAwesomeApp.xcodeproj \
        --scheme MyAwesomeApp \
        --sdk macosx \
        --test-xcargs "CODE_SIGNING_ALLOWED='no'" \
        --output-dir build/macos/test
  test_report: build/macos/test/*.xml
```

For macOS tests, no destination is specified. Please check [Codemagic CLI tools documentation](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/run-tests.md#run-tests) to learn more about optional arguments to `xcode-project run-tests`.

## Native Android

For non-UI tests or unit tests:

```bash
- name: Test
  script: ./gradlew test
  test_report: app/build/test-results/**/*.xml
```

For UI tests (also known as instrumented tests):

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

**Tip**: you can save the emulator log with the `adb logcat -d > emulator.log` command

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

To run Flutter unit tests, simply add the `flutter test` command to your scripts section.


{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Unit tests
    script: | 
      mkdir -p test-results
      flutter test --machine > test-results/flutter.json
    test_report: test-results/flutter.json
{{< /highlight >}}

**Tip:** you can display Flutter test results visually in the build overview if you use the expanded form of the script in codemagic.yaml.
Just include the `test_report` field with a glob pattern matching the test result file location:


## Flutter integration tests

The `integration_test` dependency allows you to run integration tests on a real device or emulator. Android application tests can be run on an Android emulator, iOS application tests can be run on an iOS simulator, and web application tests can be run on a web browser driver.

**Tip:** It is possible to generate machine readable output for integration tests using the `--machine` flag; hence the results can be displayed in the UI. Just include the `test_report` field with a glob pattern matching the test result file location:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Integration tests
    script: | 
      mkdir -p test-results 
      flutter -d emulator-5554 test --machine > test-results/flutter.json integration_test 
      # for iOS use: -d iPhone
    test_report: test-results/flutter.json
{{< /highlight >}}


To run integration tests for web, it is possible to use `chromedriver`. Take note that for running tests on web, it is necessary to provide the `--driver` and `--target` arguments, and machine-readable output is unavailable.

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Integration tests
    script: | 
      flutter config --enable-web
      chromedriver --port=4444 &
      flutter -d chrome drive --driver=test_driver/integration_driver.dart --target=integration_test/app_test.dart
{{< /highlight >}}


### Running application tests on a mobile simulator/emulator

{{< tabpane >}}

{{< tab header="Android" >}}
{{<markdown>}}

For the Android emulator you can launch and run your tests as follows:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Emulator tests
    script: | 
      flutter config --enable-web
      # The ampersand is used to run the emulator in the background without blocking the next command:
      flutter emulators --launch emulator &
      # adb wait-for-device is used to wait for the emulator to finish loading:
      adb wait-for-device
      flutter -d emulator-5554 test integration_test 
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}

You can launch the iOS simulator and run tests as follows:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Emulator tests
    script: | 
      flutter emulators --launch apple_ios_simulator
      flutter -d iPhone test integration_test
{{< /highlight >}}


You can launch a specific iOS simulator and run tests on the simulator using ‘simctl’ which is a binary to interact with iOS simulators from the command line, as follows:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Emulator tests
    script: | 
      # This command will give list available simulators on the machine along with UDIDs,
      # you can find list of Devices depending upon type of machine you are running here:
      # https://docs.codemagic.io/specs/versions-macos-xcode-12-5/#devices
      xcrun simctl list 
      # Specify the UDID to boot the simulator:
      xcrun simctl boot 99B14BF4-7966-4427-ACD1-34BFE4D26A01
      # Specify the UDID to the integration tests command:
      flutter -d 99B14BF4-7966-4427-ACD1-34BFE4D26A01 test integration_test
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}




### Running web application tests on a web browser driver

{{< tabpane >}}

{{< tab header="Chrome" >}}
{{<markdown>}}

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: 'Flutter integration test for web'
    script: | 
      chromedriver --port=4444 &
      flutter config --enable-web
      flutter drive --driver=test_driver/integration_driver.dart --target=integration_test/app_test.dart -d web-server --release --browser-name chrome
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="Safari" >}}
{{<markdown>}}

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: 'Flutter integration test for web'
    script: | 
      sudo safaridriver --enable
      safaridriver --port 4444 &
      flutter config --enable-web
      flutter drive --driver=test_driver/integration_driver.dart --target=integration_test/app_test.dart -d web-server --release --browser-name safari
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


## React Native Unit Tests using Jest

This basic example illustrates how to use Jest tests defined in the `package.json` file as follows:

{{< highlight json "style=paraiso-dark">}}
// package.json
"scripts": {
  "test": "jest"
},
"jest": {
  "preset": "jest-expo",
  "setupFiles": ["<rootDir>/testing/jest-setup.js"]
}
{{< /highlight >}}


In the root directory of the project, create a new file named `jest.config.js` with the following content:

{{< highlight javascript "style=paraiso-dark">}}
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
}
{{< /highlight >}}


The `preset` is used as a base for Jest’s configuration and should point to an npm module that has a `jest-preset.json` or `jest-preset.js` file at the root.

The `setUpFilesAfterEnv` specifies a list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed.

To execute the tests, use the following script in your `codemagic.yaml` file:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: 'Flutter integration test for web'
    script: | 
      npm test
      # or: yarn test
{{< /highlight >}}


In React Native, 3rd party modules are oftentimes published as **untranspiled**. Since all files inside `node_modules` are not transformed by default, Jest will not understand the code in these modules, resulting in syntax errors. To overcome this, you need to use `transformIgnorePatterns` to allow transpiling such modules.

In such cases, modify your `package.json` as follows:

{{< highlight json "style=paraiso-dark">}}
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)"
  ]
}
{{< /highlight >}}


## React Native Integration Tests using Appium and Emulator

[Appium](https://appium.io/) is an open-source testing automation framework for testing cross-platform and mobile applications. You can use **Appium** and **WebDriverIO** with React Native thanks to its out-of-the-box support.

Before running tests in Codemagic, you need to install and setup **WebDriverIO** in your project root directory. Run the following command **on your local machine**: provide input to a series of questions:

{{< highlight bash "style=paraiso-dark">}}
npx wdio config
{{< /highlight >}}

After answering a series of questions, a file named `wdio.conf` will be generated inside the `tests` directory. Edit the content of that file as follows to enable WebDriverIO to work with Appium and run tests on Android Emulator:

{{< highlight javascript "style=paraiso-dark">}}
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
{{< /highlight >}}

To execute the tests, use the following scripts in your `codemagic.yaml` file:


{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Install npm dependencies    # Add Appium and WebDriverIO dependencies
        script: npm install && npm install -g appium && npm install --save webdriverio @wdio/cli

      - name: Launch emulator             # Insert before the build command
        script: | 
          react-native run-android  &
          adb wait-for-device
      - name: Launch Appium
        script: appium
      - name: Run WebDriver test suite
        script: npx wdio ./wdio.conf.js


  ...
{{< /highlight >}}


## Native iOS

To execute the tests, use the following scripts in your `codemagic.yaml` file:
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: iOS test
      script: | 
        xcode-project run-tests \
          --workspace MyAwesomeApp.xcworkspace \
          --scheme MyAwesomeApp \
          --device "iPhone 11"
    test_report: build/ios/test/*.xml
{{< /highlight >}}


Please check [Codemagic CLI tools documentation](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/run-tests.md#run-tests) to learn more about more optional arguments to `xcode-project run-tests`.

## Native macOS 

{{<notebox>}}
**Note:** macOS UI Testing is only supported on Xcode 13 images and above as it requires System Integrity Protection (SIP) to be disabled in order to access the accessibility permissions. Older images with Xcode 12 and below do not have SIP disabled and are unsuitable for UI testing macOS apps.
{{</notebox>}}

To execute the tests, use the following scripts in your `codemagic.yaml` file:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: macOS test
      script: | 
        xcode-project run-tests \
          --project MyAwesomeApp.xcodeproj \
          --scheme MyAwesomeApp \
          --sdk macosx \
          --test-xcargs "CODE_SIGNING_ALLOWED='no'" \
          --output-dir build/macos/test
      test_report: build/macos/test/*.xml
{{< /highlight >}}


For macOS tests, no destination is specified. Please check [Codemagic CLI tools documentation](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/run-tests.md#run-tests) to learn more about optional arguments to `xcode-project run-tests`.

## Native Android

For non-UI tests or unit tests:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Test
      script: ./gradlew test
    test_report: app/build/test-results/**/*.xml
{{< /highlight >}}


For UI tests (also known as instrumented tests):

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
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
{{< /highlight >}}


**Tip**: you can save the emulator log with the `adb logcat -d > emulator.log` command

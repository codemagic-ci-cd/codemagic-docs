---
description: How to run automated tests in builds configured with the Flutter workflow editor
title: Running automated tests
weight: 1
aliases: /testing/running-automated-tests
---

Codemagic supports running **unit**, **integration** and **widget** tests as well as static code analysis with [**flutter analyze**](./static-code-analysis) and [**Dart Code Metrics**](./static-code-analysis). When testing is enabled, tests are run automatically every time your project is built. You can configure the test settings in **App settings > Tests**.

### Detecting tests

During the first build of your app, Codemagic will scan the repository's content and automatically detect the tests according to the project structure. The expected locations of the tests are as follows:

Unit and widget tests: `project_root/test`

Integration tests (Flutter Driver tests): `project_root/test_driver`

{{<notebox>}}

If your Flutter project is in a subdirectory of the repository, Codemagic cannot detect your tests automatically unless you add at least one test file in the `project_root/test` or `project_root/test_driver` folder.

{{</notebox>}}

### Running Flutter Driver tests

There are several options for running integration tests during the build. You can select one option per workflow:

- iOS simulator (selected by default)
- Android emulator
- Chrome

Devices available on the machine are:

```
emulator            • emulator      • Google         • android
apple_ios_simulator • iOS Simulator • Apple          • ios
Chrome (web)        • chrome        • web-javascript • Google Chrome
```

For iOS and Android, it's recommended to launch the desired emulator before the tests start:

```sh
flutter emulators --launch ios
```

or

```bash
flutter emulators --launch emulator
```

{{<notebox>}}

**Tip**: You can set up separate [workflows](../flutter/creating-workflows/) to run tests both on iOS and Android.

{{</notebox>}}

#### Mobile

The recommended approach to running integration tests is to use `flutter test` and the `integration_test` dependency. To do so, navigate to the **App settings > Tests > Integration and unit tests** and under **Flutter drive arguments** define the following:

```bash
test integration_test
```

To run only a specific test, the path has to be specified:

```bash
test integration_test/app_test.dart
```

#### Web

However, the above approach is not suitable for integration tests for web using `chromedriver`, and the following arguments are recommended instead:

```bash
drive --driver=test_driver/integration_test.dart --target=integration_test/app_test.dart
```

{{<notebox>}}

Note that for this approach, creating the `test_driver` folder with the `integration_test.dart` file beforehand is required, as per [Flutter documentation](https://docs.flutter.dev/cookbook/testing/integration/introduction#5b-web).

{{</notebox>}}

### Stop build if tests or analysis fail

If you check **Stop build if tests or analysis fail**, the build will stop after finishing all the enabled tests or analysis runs when any of them fail. Such builds will have the status "failed".

### Running tests in Firebase Test Lab

Integration tests can also be run on real devices in Firebase Test Lab when using the [integration_test](https://github.com/flutter/flutter/tree/master/packages/integration_test) package and custom scripts in Codemagic. See a detailed guide on how to set up testing in Firebase Test Lab [here](https://blog.codemagic.io/codemagic-flutter-integration-tests-firebase-test-lab/).

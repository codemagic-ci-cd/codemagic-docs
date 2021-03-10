---
description: How to run automated tests in builds configured with the Flutter UI
title: Running automated tests
weight: 1
---

Codemagic supports running **unit**, **integration** and **widget** tests as well as static code analysis with [**flutter analyze**](./static-code-analysis). When testing is enabled, tests are run automatically every time your project is built. You can configure the test settings in **App settings > Test**.

### Detecting tests

During the first build of your app, Codemagic will scan the content of the repository and automatically detect the tests according to the project structure. The expected locations of the tests are as follows:

Unit and widget tests: `project_root/test`

Integration tests (Flutter Driver tests): `project_root/test_driver`

{{<notebox>}}

If your Flutter project is in a subdirectory of the repository, Codemagic cannot detect your tests automatically unless you add at least one test file in the `project_root/test` or `project_root/test_driver` folder.

{{</notebox>}}

### Specifying the test target

In **App settings > Test**, you will see the **Flutter test target** and **Flutter drive target** fields displayed if the respective tests are detected. You can specify the exact target to run a specific test.

### Running Flutter Driver tests

There are several options for running integration tests during the build. You can select one option per workflow:

* iOS simulator (selected by default)
* Android emulator
* [AWS Device Farm](./aws) --- enables to run tests on physical Android and iOS devices. Requires an AWS account and additional setup.

Devices available on the machine are:

```
emulator            • emulator      • Google • android
apple_ios_simulator • iOS Simulator • Apple  • ios
```

It's recommended to launch the desired emulator before the tests start:

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

### Stop build if tests fail

Selecting the **Stop build if tests fail** option will stop the build immediately when any of the tests fail. Such builds will have the status "failed".

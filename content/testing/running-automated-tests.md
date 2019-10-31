---
description:
  Automatically run unit, widget and integration tests every time you build
  your Flutter app.
title: Running automated tests
weight: 1
---

Codemagic supports running **unit**, **integration** and **widget** tests. When testing is enabled, tests are run automatically every time your project is built. You can configure the test settings in **App settings > Test**.

### Detecting tests

During the first build of your app, Codemagic will scan the content of the repository and automatically detect the tests according to the project structure. The expected locations of the tests are as follows:

Unit and widget tests: `project_root/test`

Integration tests (Flutter Driver tests): `project_root/test_driver`

{{% notebox %}}

If your Flutter project is in a subdirectory of the repository, Codemagic cannot detect your tests automatically unless you add at least one test file in the `project_root/test` or `project_root/test_driver` folder.

{{% /notebox %}}

### Specifying the test target

In App settings > Test, you will see the **Flutter test target** and **Flutter drive target** fields displayed if the respective tests are detected. You can specify an exact target to run a specific test.

### Running Flutter Driver tests

There are several options for running integration tests during the build. You can select one option per workflow:
* iOS simulator (selected by default)
* Android emulator
* [AWS Device Farm](./aws) --- enables to run tests on physical Android and iOS devices. Requires an AWS account and additional setup.

{{% notebox %}}

**Tip**: You can set up separate [workflows](../getting-started/creating-workflows/) to run tests both on iOS and Android.

{{% /notebox %}}

### Stop build if tests fail

Selecting the **Stop build if tests fail** option will stop the build immediately when any of the tests fail. As the tests are run before building the app for selected platforms, you can get the result of the build faster. Such builds will have the status "failed".

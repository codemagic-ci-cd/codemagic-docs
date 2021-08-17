---
description: How to configure running only widget tests
title: Testing widgets
weight: 3
aliases: /testing/testing-widgets
---

Instead of building the entire app, you can separately run tests on your widgets.

To test widgets, the following is required:

- A Flutter project without `ios` and `android` folders.
- A `test` folder containing at least one test.

Your widget repository is detected automatically like any other repository, but there are differences in the build process. Technically, Codemagic will only fetch the sources, install the dependencies and run the tests. If there are failing tests, you will receive the test report in your email.

After the first build, you can change the Flutter version (by default, it's `channel Stable`) and configure email publishing and Slack for receiving status reports.

---
description: How to run Flutter analyze in Flutter workflow editor configured builds
title: Static code analysis
weight: 2
---

Test your code with `flutter analyze` to find possible mistakes. You can read more about this feature in [Dart documentation](https://dart.dev/guides/language/analysis-options). By default, static code analysis is disabled and has to be enabled in **App settings > Test** by checking the **Enable Flutter analyzer** option.

To run `flutter analyze`, Codemagic specifies the `analyze` command in the **Flutter analyze arguments** field. You can pass additional arguments to customize static code analysis. For example, adding `--write=analyzer-output.txt` prints the results of static code analysis into a text file.

If you check **Stop build if tests fail**, the build will stop after finishing all the enabled tests when any of the tests fail. Such builds will have the status "failed".

When enabled, `flutter analyze` will be run with each build. You can see the results and the logs of the analysis under the **Running tests** step in build overview.

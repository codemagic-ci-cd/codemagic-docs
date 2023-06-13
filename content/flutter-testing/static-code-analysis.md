---
description: How to run Static Code Analysis in Flutter workflow editor configured builds
title: Static code analysis
weight: 2
aliases: /testing/static-code-analysis
---

### Flutter Analyze

Test your code with `flutter analyze` to find possible mistakes. You can read more about this feature in [Dart documentation](https://dart.dev/guides/language/analysis-options). By default, Flutter Analyze is disabled and has to be enabled in **App settings > Tests > Static code analysis** by checking the **Enable Flutter analyzer** option.

To run `flutter analyze`, Codemagic specifies the `analyze` command in the **Flutter analyze arguments** field. You can pass additional arguments to customize static code analysis. For example, adding `--write=analyzer-output.txt` prints the results of static code analysis into a text file.

When enabled, `flutter analyze` will be run with each build. You can see the results and the logs of the analysis under the **Running tests** step in build overview.

### Dart Code Metrics

{{<notebox>}}
**Important!** The Dart Code Metrics integration in Flutter workflow editor will be unavailable from July 16, 2023 onwards as the [dart_code_metrics](https://pub.dev/packages/dart_code_metrics) plugin will be deprecated. Please read the plugin maintainers' [official announcement](https://metabase.flutterci.com/public/dashboard/31550fb9-97a7-400e-87c7-361a38cfe0d8) for more information.
{{</notebox>}}

Codemagic is integrated with [Dart Code Metrics](https://pub.dev/packages/dart_code_metrics), helping to improve code quality. With Dart Code Metrics it is possible to report code metrics, define additional rules for your dart analyzer and check for anti-patterns.

By default, Dart Code Metrics is disabled and has to be enabled in **App settings > Tests > Static code analysis** by checking the **Enable Dart Code Metrics** option.

When enabled, `flutter pub run dart_code_metrics:metrics analyze lib` will be run with each build. You can see the results and the logs of the analysis under the **Running tests** step in build overview.

{{<notebox>}}
**Note:** Codemagic will attempt to use the `dart_code_metrics` version defined in your `pubspec.yaml`; if it is not defined, Codemagic will temporarily add the most recent compatible version of `dart_code_metrics` to your dependencies during build time. The minimum compatible version of `dart_code_metrics` is `3.0.0`.
{{</notebox>}}

### Stop build if tests or analysis fail

If you check **Stop build if tests or analysis fail**, the build will stop after finishing all the enabled tests or analysis runs when any of them fail. Such builds will have the status "failed".

For Dart Code Metrics, if selected, Codemagic will fail the build if any issues, anti-pattern cases or metrics return the statuses "alarm" or "error".

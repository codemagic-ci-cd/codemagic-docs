---
title: Dart Code Metrics
description: How to run static code analysis with Dart Code Metrics
weight: 3
---

{{<notebox>}}
For the following instructions to work with Codemagic, Dart version 2.12.0 (Flutter 1.27.0-1.0.pre) or higher is required.
{{</notebox>}}

Static code analysis scripts are added under `scripts` in the [overall architecture](../getting-started/yaml#template), before the build commands.

Codemagic is integrated with [Dart Code Metrics](https://pub.dev/packages/dart_code_metrics), helping to improve code quality for projects utilizing dart files. With Dart Code Metrics, it is possible to report code metrics, define additional rules for your dart analyzer, and check for anti-patterns.

You can display Dart Code Metrics results visually in the build overview if you use an expanded form of the script in `codemagic.yaml`. Just include the `test_report` field with a glob pattern matching the test result file location. Make sure to write the results into a file called `dart_code_metrics.json`.

If you have Dart Code Metrics added as an dependency to your project, you can run the following script in your `codemagic.yaml`:

```yaml
scripts:
  - echo 'previous step'
  - name: Dart Code Metrics
    script: |
      mkdir -p metrics-results
      dart pub run dart_code_metrics:metrics lib --reporter=json > metrics-results/dart_code_metrics.json
    test_report: metrics-results/dart_code_metrics.json
```

In case you do not have Dart Code Metrics as a dependency, you can enable it globally first, by running the following script:

```yaml
scripts:
  - echo 'previous step'
  - name: Dart Code Metrics
    script: |
      dart pub global activate dart_code_metrics
      mkdir -p metrics-results
      dart pub global run dart_code_metrics:metrics lib --reporter=json > metrics-results/dart_code_metrics.json
    test_report: metrics-results/dart_code_metrics.json
```

For Flutter projects it is recommended to replace the dart commands with flutter commands.

If you wish to configure Dart Code Metrics, add an `analysis_options.yaml` file to your project as per the [official documentation](https://dartcodemetrics.dev/docs/getting-started/configuration).

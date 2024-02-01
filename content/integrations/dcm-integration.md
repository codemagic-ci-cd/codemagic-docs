---
title: Dart Code Metrics integration
description: How to integrate your workflows with Dart Code Metrics using codemagic.yaml
weight: 18
---

**Dart Code Metrics** is a powerful static analysis tool that helps improve code quality, ensure code consistency, and identify potential issues early in the development process. 

## Configuring Access to Dart Code Metrics

To get started with [Dart Code Metrics](https://dcm.dev/), you need an API key and save it as an environment variable in Codemagic.

1. To effectively integrate Dart Code Metrics (DCM) into your Codemagic CI/CD pipeline, it's essential to obtain a [Team Plan API key](https://dcm.dev/pricing/). This key is a crucial component as it authorizes the use of DCM on CI/CD platforms, allowing you to run code analysis as part of your automated workflows.
2. Open your Codemagic app settings, and go to the **Environment variables** tab.
3. Enter the desired **_Variable name_**, e.g. `DCM_KEY`.
4. Copy and paste the API key string as **_Variable value_**.
5. Enter the variable group name, e.g. **_dcm_credntials_**. Click the button to create the group.
6. Make sure the **Secure** option is selected.
7. Click the **Add** button to add the variable.
8. Repeat the above process for `DCM_EMAIL_ID`.

9. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - dcm_credntials
{{< /highlight >}}

## Configuring DCM Rules with `analysis_options.yaml`
Dart Code Metrics (DCM) provides a flexible way to define and enforce coding standards through its rules. These rules are specified in a file named `analysis_options.yaml`, which should be located at the root of your project. By configuring this file, you can tailor DCM to analyze your code according to specific guidelines that align with your project's requirements and coding standards.

Here is a sample Rule set.

{{< highlight yaml "style=paraiso-dark">}}
  dart_code_metrics:
    metrics:
        cyclomatic-complexity: 20
        number-of-parameters: 4
        maximum-nesting-level: 5
    metrics-exclude:
        - test/**
    rules:
        - avoid-dynamic
        - avoid-passing-async-when-sync-expected
        - avoid-redundant-async
        - avoid-unnecessary-type-assertions
        - avoid-unnecessary-type-casts
        - avoid-unrelated-type-assertions
        - avoid-unused-parameters
        - avoid-nested-conditional-expressions
{{< /highlight >}}

You can further customise the Rule set as per your requirements by visiting the Dart Code Metrics documentation at [DCM Rules Documentation](https://dcm.dev/docs/rules/). This page provides a comprehensive list of all available rules along with their descriptions and configuration options.


## Configuring `codemagic.yaml`

After setting up your `analysis_options.yaml` file with the desired Dart Code Metrics (DCM) rules, let's configure our `codemagic.yaml` file.

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: install DCM on Codemagic
    script: | 
      brew tap CQLabs/dcm
      export HOMEBREW_NO_AUTO_UPDATE=1
      brew install dcm
  - name: Install flutter packages
    script: flutter pub get
  - name: Run DCM Analysis with License key
    script: dcm analyze --ci-key=$DCM_KEY --email=$DCM_EMAIL_ID lib --reporter=console
{{< /highlight >}}

By the end of this configuration process, you will have a fully automated system in place for running Dart Code Metrics analysis within your CI/CD pipeline, enhancing the quality and reliability of your Flutter application.
---
title: Testing with emulator.wtf
description: How to run tests using emulators from emulator.wtf
weight: 2
---

## Configuring emulator.wtf API token

In order to use [emulator.wtf](https://emulator.wtf) service for app testing, you need to obtain an emulator.wtf API token and save it as an environment variable in Codemagic.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `EW_API_TOKEN`.
3. Copy and paste the content of the token as **_Variable value_**.
4. Enter the variable group name, e.g. **_emulatorwtf_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

You can then import the token in your workflow:

{{< highlight yaml "style=paraiso-dark">}}
  workflows:
    android-build:
      environment:
        groups:
          - emulatorwtf # adds EW_API_TOKEN to the workflow
{{< /highlight >}}


## Running tests

Add the following snippet under your workflow _after_ the Gradle build step. Update the `--app` and `--test` paths according to your build if necessary.

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Test
    script: | 
      ew-cli \
        --app app/build/outputs/apk/debug/app-debug.apk \
        --test app/build/outputs/apk/androidTest/app-debug-androidTest.apk \
        --outputs-dir results
    test_report: results/**/*.xml
{{< /highlight >}}

## Capturing logcat

Add the following to your workflow to capture logcat output from the emulator during the test run:

{{< highlight yaml "style=paraiso-dark">}}

  artifacts:
    - results/**/logcat.txt
{{< /highlight >}}


## Running tests with coverage

Add `--with-coverage` to the `ew-cli` script to capture coverage during the test run:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Test
    script: | 
      ew-cli \
        --app app/build/outputs/apk/debug/app-debug.apk \
        --test app/build/outputs/apk/androidTest/app-debug-androidTest.apk \
        --with-coverage \
        --outputs-dir results
    test_report: results/**/*.xml
{{< /highlight >}}


## Running tests in parallel

Add `--num-shards <NUMBER>` to run tests in parallel shards, here's an example to shard tests to 4:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Test
    script: | 
      ew-cli \
        --app app/build/outputs/apk/debug/app-debug.apk \
        --test app/build/outputs/apk/androidTest/app-debug-androidTest.apk \
        --num-shards 4 \
        --outputs-dir results
    test_report: results/**/*.xml
{{< /highlight >}}


## Running tests with orchestrator

Add `--use-orchestrator` to run tests with Android Test Orchestrator 
(more infos [here](https://docs.emulator.wtf/integrations/cli/#run-tests-with-orchestrator-while-clearing-package-data)):

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Test
    script: | 
      ew-cli \
        --app app/build/outputs/apk/debug/app-debug.apk \
        --test app/build/outputs/apk/androidTest/app-debug-androidTest.apk \
        --use-orchestrator \
        --outputs-dir results
    test_report: results/**/*.xml
{{< /highlight >}}


## Further information

There are more options available like pulling directories from the emulator after tests have finished, running on various device models, etc. Check the [emulator.wtf docs](https://emulator.wtf) for more `ew-cli` options to customize your test run.

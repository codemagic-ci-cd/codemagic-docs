---
title: Building a native Android app
description: Building an Android app with YAML.
weight: 3
---
## Building an Android app

The necessary command for building native Android application goes under `scripts` in the [overall architecture](../yaml/yaml/#template) in the `codemagic.yaml` file. For Android (built with gradle), the script looks like this:

    - cd $FCI_BUILD_DIR && ./gradlew build

## Testing, code signing and publishing an Android app

To test, code sign and publish an Android app:

* The code for testing an Android app also goes under `scripts`. A few examples of testing can be found [here](../yaml/testing).
* All Android applications need to be signed before release. For Gradle code signing configuration refer to the [documentation](https://docs.codemagic.io/code-signing/android-code-signing/#preparing-your-flutter-project-for-code-signing). More information about code signing with YAML in general is [here](../yaml/distribution).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../yaml/distribution/#publishing).
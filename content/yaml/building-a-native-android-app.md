---
title: Building a native Android app
description: Building an Android app with YAML.
weight: 3
---
## Building an Android app

Native Android app is written in Java. The necessary command for building the application goes under `scripts` in the [overall architecture](../yaml/yaml/#template) in the `codemagic.yaml` file. For Android (built with gradle), the script looks like this:

    - ./gradlew bundleRelease

## Testing an Android app

The code for testing an Android app also goes under `scripts`. A few examples of testing can be found [HERE](../yaml/testing).

## Code signing

For gradle code signing configuration refer to the [documentation](https://docs.codemagic.io/code-signing/android-code-signing/#preparing-your-flutter-project-for-code-signing). More information about code singing with YAML in general is [HERE](../yaml/distribution).

## Publishing

All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play, App Store Connect and Codemagic Static Pages. Script examples for all of them are available [HERE](../yaml/distribution/#publishing).
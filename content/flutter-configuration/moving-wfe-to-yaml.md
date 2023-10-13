---
title: Moving From Workflow Editor to yaml
description: How to move from Codemagic workflow editor to yaml configuration.
weight: 7
---

Please follow the steps we have included below for moving from workflow editor to yaml configuration.

1. Prepare your `codemagic.yaml` file. You can use our sample templates for [iOS](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/flutter/flutter-android-and-ios-yaml-demo-project/codemagic.yaml#L51) and [Android](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/flutter/flutter-android-and-ios-yaml-demo-project/codemagic.yaml#L2) workflows for Flutter. You should be able to use it with minimal modifications.

2. If you have added any custom scripts to your workflow editor, please make sure to include them as a separate build step in your `codemagic.yaml` file.

3. You need to manually move your secrets and add them to the `Environment variables` section of your YAML configuration. Ensure that this section is ready before you start the process.

4. For all the code-signing related credentials like distribution certificates, provisioning profiles for iOS, and keystores for Android, you will have to add them to the `Code signing identities` section under `Teams > Settings > Code signing identities`.

`codemagic.yaml` allows for even greater customization and better control over your builds, read more about it [here](../getting-started/yaml).

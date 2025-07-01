---
title: Patrol integration
description: How to integrate your workflows with Patrol using codemagic.yaml
weight: 17
---

[**Patrol**](https://patrol.leancode.co?utm_source=codemagic&utm_medium=referral) is a powerful, open-source UI testing framework designed specifically for Flutter apps, developed and maintained by [LeanCode](https://leancode.co?utm_source=codemagic&utm_medium=referral), one of the world's leading Flutter development consultancies. Patrol can be seamlessly integrated with Codemagic CI/CD to enable comprehensive automated testing workflows. Patrol allows you to:

- Interact with permission dialogs, notifications, and WebViews
- Modify device settings, toggle Wi-Fi, and more
- All achieved effortlessly using plain Dart code

A sample project that shows how to configure Patrol integration is available in Codemagic's [patrol-demo-project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/patrol-demo-project).

This sample project includes:

- Complete `codemagic.yaml` configuration with multiple integrations
- Example Patrol tests
- How to sign in iOS before running Patrol on physical device
- Integration with device farms (Firebase Test Lab)
- Best practices for CI/CD testing workflows

Refer to the sample project's README and configuration files for detailed setup instructions and integration examples.

## How to start using Patrol in your workflows

### Prerequisites

Before integrating Patrol with Codemagic, ensure you have:

- A Flutter project with Patrol tests already set up, if you need help check [Patrol documentation](https://patrol.leancode.co?utm_source=codemagic&utm_medium=referral) to get started.
- Codemagic account and project configured
- Access to device farms (optional, for cloud testing)

### Configure codemagic.yaml

Add the following configuration to your `codemagic.yaml` file to build Patrol tests and send them to Firebase Test Lab:

{{< highlight yaml "style=paraiso-dark">}}
definitions:
  environment: &environment
    flutter: 3.27.3 # Replace with your Flutter version
    java: 17 # Replace with your Java version

workflows:
  patrol_android_build:
    name: Patrol Android Build and send to Firebase Test Lab
    instance_type: mac_mini_m2
    max_build_duration: 30

    environment:
      <<: *environment

    steps:
      - name: Install Patrol CLI
        script: dart pub global activate patrol_cli 3.6.0 # Replace with your Patrol CLI version for compatibility you can see https://patrol.leancode.co/documentation/compatibility-table
      - name: Install dependencies
        script: flutter pub get
      - name: Authorize Google Cloud SDK
        env_vars:
          - google_credentials # <-- (You need to add firebase service account key (json file) to your codemagic secrets)
        script: |
          echo "$TEST_LAB_SERVICE_ACCOUNT_KEY" > /tmp/gcloud.json
          gcloud auth activate-service-account --quiet --key-file /tmp/gcloud.json
          gcloud --quiet config set project $GCLOUD_PROJECT_ID
      - name: Build apk for testing
        script: |
          patrol build android --verbose
          echo "APK_PATH=build/app/outputs/apk/dev/debug/app-dev-debug.apk" >> $CM_ENV
          echo "TEST_APK_PATH=build/app/outputs/apk/androidTest/dev/debug/app-dev-debug-androidTest.apk" >> $CM_ENV
      - name: Send tests to Firebase test lab
        script: |
          gcloud firebase test android run \
             --type instrumentation \
             --use-orchestrator \
             --app $APK_PATH \
             --test $TEST_APK_PATH \
             --num-flaky-test-attempts 1 \
             --timeout 25m \
             --device model=MediumPhone.arm,version=35,locale=en,orientation=portrait \
             --environment-variables clearPackageData=true
    artifacts:
      - build/app/outputs/apk/dev/debug/app-dev-debug.apk
      - build/app/outputs/apk/androidTest/dev/debug/app-dev-debug-androidTest.apk
{{< /highlight >}}

For more detailed configuration, look at [patrol-demo-project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/patrol-demo-project).

### Device Farm Integration

Patrol can be integrated with popular device farms through Codemagic:

- **Firebase Test Lab**: Run Patrol tests on Google's device farm
- **BrowserStack**: Execute tests on BrowserStack's real device cloud
- **emulator.wtf**: Run tests on emulator.wtf's cloud emulators

It can be also run on your Codemagic itself. There is a [Blog post](https://blog.codemagic.io/how-to-test-native-features-in-flutter-apps-with-patrol-and-codemagic/).

### Getting Help

- Visit the [Patrol documentation](https://patrol.leancode.co?utm_source=codemagic&utm_medium=referral)
- Join the [Patrol Discord channel](https://discord.com/invite/ukBK5t4EZg)
- Check out the [Patrol GitHub repository](https://github.com/leancodepl/patrol)

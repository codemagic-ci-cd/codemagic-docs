---
title: Building a Flutter app
description: How to build a Flutter app with codemagic.yaml
weight: 6
aliases:	
  - '../yaml/building-a-flutter-app'
startLineBreak: true
---

{{<notebox>}}
For documentation on building Flutter projects using the settings in Codemagic UI, please refer to [**Building Flutter apps via UI**](../flutter/flutter-projects).
{{</notebox>}}

With `codemagic.yaml`, you can use Codemagic to build, test and publish Flutter apps, widgets, Flutter or Dart packages. The necessary build commands go under `scripts` in the [overall architecture](../getting-started/yaml#template) of the `codemagic.yaml` file. You can find some examples for building the most common types of Flutter projects below.

## Exporting configuration from UI

You can get started with YAML easily if you have an existing project set up in Codemagic UI. 

1. Navigate to your app settings.
2. In the **Configuration as code** section on the right sidebar, click **Download configuration**.

{{<notebox>}}

The YAML feature currently has the following **limitations**:

* Exporting configuration from UI is supported for Flutter-based Android, iOS and web apps.
* The exported configuration is not identical to the settings in the UI and lacks the configuration for some features, such as **Stop build if tests fail** and publishing to Codemagic Static Pages.

{{</notebox>}}

## Building with YAML

In order to use `codemagic.yaml` for build configuration in Codemagic, it has to be committed to your repository. The file must be located in the root directory of the repository. When detected in the repository, `codemagic.yaml` is automatically used for configuring builds that are triggered in response to the events defined in the file. Any configuration in the UI is ignored.

In order to use `codemagic.yaml` for manual builds, you must select the workflow to build from `codemagic.yaml`:

1. Navigate to your app settings and click **Start new build**. 
3. In the **specify build configuration** popup, select the branch where your `codemagic.yaml` file is located.
4. If a `codemagic.yaml` file is found in that branch, you can click **Select workflow from codemagic.yaml**.
5. Then select the workflow to build from the **Select workflow from codemagic.yaml** dropdown.
6. Finally, click **Start new build** to start the build.

## Android builds

Set up local properties

```yaml
- echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
```
### Building .apk

```yaml
- flutter build apk --release
```

### Building universal .apk(s) from existing app bundle(s) with user-specified keys

If your app settings in Codemagic have building Android App Bundles enabled, we will automatically include a script for generating a signed `app-universal.apk` during the YAML export. If you are creating a YAML file from a scratch, add the following script to receive the .apk file(s):

```yaml
- android-app-bundle build-universal-apk \
  --bundle 'project_directory/build/**/outputs/**/*.aab' \
  --ks /tmp/keystore.keystore \
  --ks-pass $FCI_KEYSTORE_PASSWORD \
  --ks-key-alias $FCI_KEY_ALIAS \
  --key-pass $FCI_KEY_PASSWORD
```

Please make sure to wrap the `--bundle` pattern in single quotes. If `--bundle` option is not specified, default glob pattern `**/*.aab` will be used.

More information about Android code signing can be found [here](../code-signing-yaml/signing-android).

{{<notebox>}}
Codemagic uses the [android-app-bundle](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/android-app-bundle#android-app-bundle) utility to build universal .apk files from Android App Bundles.
{{</notebox>}}

## iOS builds

### Building an unsigned application .app

```yaml
- flutter build ios --debug --no-codesign
```

### Building a signed iOS application archive .ipa

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

```yaml
- xcode-project use-profiles
- xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner
```

Read more about the different schemes in [Apple's documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).

**Note:** If you are using Flutter version 1.24.0-6.0 or higher, the recommended command for building an .ipa archive is `flutter build ipa` as shown below. Read more about it in [Flutter's documentation](https://flutter.dev/docs/deployment/ios#create-a-build-archive).

```yaml
- xcode-project use-profiles
- flutter build ipa --export-options-plist=/Users/builder/export_options.plist
```

## Web builds

```yaml
- name: Build web
  script: |
    flutter config --enable-web
    flutter build web --release
    cd build/web
    7z a -r ../web.zip ./*
```

## Testing, code signing and publishing a Flutter app

To test, code sign and publish a Flutter app:

* Testing examples for a flutter app can be found [here](../testing-yaml/testing/#flutter-test).
* All iOS and Android applications need to be signed before release. Different script examples are available [here](../publishing-yaml/distribution/).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play and App Store Connect. It is also possible to publish elsewhere with [custom scripts](../getting-started/yaml#scripts). Script examples for different options are available [here](../publishing-yaml/distribution/#publishing-a-flutter-package-to-pubdev).

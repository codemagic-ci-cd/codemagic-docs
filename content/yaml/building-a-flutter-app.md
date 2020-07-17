---
title: Building a Flutter app
description: Building a Flutter app with YAML.
weight: 2
---

With `codemagic.yaml`, you can use Codemagic to build, test and publish Flutter apps. You can read more about how to use `codemagic.yaml` and see the structure of the file [here](../yaml/yaml). The necessary command for building an application goes under `scripts` in the [overall architecture](../yaml/yaml/#template) in the `codemagic.yaml` file. Here are some examples for the most common Flutter builds.

## Android builds

Set up local properties

    - echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"

### Building .apk

    - flutter build apk --release

### Building universal .apk(s) from existing app bundle(s) with user-specified keys

If your app settings in Codemagic have building Android App Bundles enabled, we will automatically include a script for generating a signed `app-universal.apk` during the YAML export. If you are creating a YAML file from a scratch, add the following script to receive those file(s):

    - android-app-bundle build-universal-apk \
        --bundle 'project_directory/build/**/outputs/**/*.aab' \
        --ks /tmp/keystore.keystore \
        --ks-pass $CM_KEYSTORE_PASSWORD \
        --ks-key-alias $CM_KEY_ALIAS_USERNAME \
        --key-pass $CM_KEY_ALIAS_PASSWORD

Please make sure to wrap the `--bundle` pattern in single quotes. If `--bundle` option is not specified, default glob pattern `**/*.aab` will be used.

More information about Android code signing can be found [here](../yaml/distribution/#setting-up-code-signing-for-android).

{{<notebox>}}
Codemagic uses the [android-app-bundle](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/android-app-bundle#android-app-bundle) utility to build universal .apk files from Android App Bundles.
{{</notebox>}}

## iOS builds

### Building an unsigned application .app

      - flutter build ios --debug --no-codesign

### Building a signed iOS application archive .ipa

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

      - xcode-project use-profiles
      - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}}

## Web builds

    - |
      flutter config --enable-web
      flutter build web --release
      cd build/web
      7z a -r ../web.zip ./*

## Testing, code signing and publishing a Flutter app

To test, code sign and publish a Flutter app:

* Testing examples for a flutter app can be found [here](../yaml/testing/#flutter-test).
* All iOS and Android applications need to be signed before release. Different script examples are available [here](../yaml/distribution/).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play and App Store Connect. It is also possible to publish elsewhere with [custom scripts](../yaml/running-a-custom-script/). Script examples for different options are available [here](../yaml/distribution/#publishing-a-flutter-package-to-pubdev).

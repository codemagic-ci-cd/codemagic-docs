---
title: Building a Flutter app
description: Building a Flutter app with YAML.
weight: 2
---

With `codemagic.yaml`, you can use Codemagic to build, test and publish Flutter apps. You can read more about how to use `codemagic.yaml` and see the structure of the file [here](../yaml/yaml). The necessary command for building an application goes under `scripts` in the [overall architecture](../yaml/yaml/#template) in the `codemagic.yaml` file. Here are some examples for the most common Flutter builds.

## Android builds

The following templates show code signing using `key.properties`.

### Building .apk with default debug code signing

    - |
      # set up debug key.properties
      keytool -genkeypair \
        -alias androiddebugkey \
        -keypass android \
        -keystore ~/.android/debug.keystore \
        -storepass android \
        -dname 'CN=Android Debug,O=Android,C=US' \
        -keyalg 'RSA' \
        -keysize 2048 \
        -validity 10000
    - |
      # set up local properties
      echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
    - flutter build apk --debug

### Building .apk code signed with release keys

    - |
      # set up key.properties
      echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
      cat >> "$FCI_BUILD_DIR/project_directory/android/key.properties" <<EOF
      storePassword=$CM_KEYSTORE_PASSWORD
      keyPassword=$CM_KEY_ALIAS_PASSWORD
      keyAlias=$CM_KEY_ALIAS_USERNAME
      storeFile=/tmp/keystore.keystore
      EOF
    - |
      # set up local properties
      echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
    - flutter build apk --release

### Building .apk with release keys from an existing app bundle

If your app settings in Codemagic have building Android App Bundles enabled, we will automatically include a script for generating a signed `app-universal.apk` during the YAML export. If you are creating a YAML file from a scratch, add the following script to receive that file:

    - |
      # generate signed universal apk with user specified keys
      android-app-bundle build-universal-apk \
        --pattern 'project_directory/build/**/outputs/**/*.aab' \
        --ks /tmp/keystore.keystore \
        --ks-pass $CM_KEYSTORE_PASSWORD \
        --ks-key-alias $CM_KEY_ALIAS_USERNAME \
        --key-pass $CM_KEY_ALIAS_PASSWORD

{{<notebox>}}
Codemagic uses the [Android-App-Bundle](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/android-app-bundle#android-app-bundle) utility to build universal .apk files from Android App Bundles.
{{</notebox>}}

## iOS builds

{{<notebox>}}
Codemagic uses the [keychain](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/keychain/README.md#keychain) utility to manage macOS keychains and certificates.
{{</notebox>}}

### Building an unsigned application .app

      - flutter build ios --debug --no-codesign

### Building a signed iOS application archive .ipa

Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.

      - xcode-project use-profiles
      - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}}

## Web builds

    - flutter config --enable-web
    - |
      flutter build web --release
      cd build/web
      7z a -r ../web.zip ./*

## Testing and publishing

To test and publish a Flutter app:

* Testing examples for a flutter app can be found [here](../yaml/testing/#flutter-test).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play and App Store. It is also possible to publish elsewhere with custom scripts. Script examples for different options are available [here](../yaml/distribution/#publishing-a-flutter-package-to-pubdev).

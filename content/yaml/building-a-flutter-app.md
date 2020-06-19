---
title: Building a Flutter app
description: Building a Flutter app with YAML.
weight: 2
---

With `codemagic.yaml`, you can use Codemagic to build, test and publish Flutter apps. You can read more about how to use codemagic.yaml and see the structure of the file [HERE](../yaml/yaml).

## Android builds

The following templates show code signing using `key.properties`.

### Build the APK with default debug code signing:

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

### Build APK code signed with user-specified keys

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

### Build an APK with user-specified keys from app bundle

If your app settings in Codemagic have building Android app bundles enabled, we will automatically include a script for generating a signed `app-universal.apk` during the YAML export. If you are creating a YAML file from a scratch, add the script below to receive this file:

    - |
      # generate signed universal apk with user specified keys
      android-app-bundle build-universal-apk \
        --pattern 'project_directory/build/**/outputs/**/*.aab' \
        --ks /tmp/keystore.keystore \
        --ks-pass $CM_KEYSTORE_PASSWORD \
        --ks-key-alias $CM_KEY_ALIAS_USERNAME \
        --key-pass $CM_KEY_ALIAS_PASSWORD

{{<notebox>}}
Codemagic uses the [android-app-bundle](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/android-app-bundle#android-app-bundle) utility to build universal APK files from Android App Bundles.
{{</notebox>}}

## iOS builds

{{<notebox>}}
Codemagic uses the [keychain](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/keychain/README.md#keychain) utility to manage macOS keychains and certificates.
{{</notebox>}}

### Set up manual code signing

    - find . -name "Podfile" -execdir pod install \;
    - keychain initialize
    - |
      # set up provisioning profiles
      PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
      mkdir -p "$PROFILES_HOME"
      PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
      echo ${CM_PROVISIONING_PROFILE} | base64 --decode > $PROFILE_PATH
      echo "Saved provisioning profile $PROFILE_PATH"
    - |
      # set up signing certificate
      echo $CM_CERTIFICATE | base64 --decode > /tmp/certificate.p12

      # when using a password-protected certificate
      keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
      # when using a certificate that is not password-protected
      keychain add-certificates --certificate /tmp/certificate.p12

### Set up automatic code signing

{{<notebox>}}
Codemagic uses the [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md#app-store-connect) utility for generating and managing certificates and provisioning profiles and performing code signing.
{{</notebox>}}

    - find . -name "Podfile" -execdir pod install \;
    - keychain initialize
    - app-store-connect fetch-signing-files "io.codemagic.app" \  # Fetch signing files for specified bundle ID (use "$(xcode-project detect-bundle-id)" if not specified)
      --type IOS_APP_DEVELOPMENT \  # Specify provisioning profile type*
      --create  # Allow creating resources if existing are not found.
    - keychain add-certificates

{{<notebox>}}
The available provisioning profile types are described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store).
{{</notebox>}}

### Build an unsigned application .app

      - flutter build ios --debug --flavor dev --no-codesign

### Build a signed iOS application archive .ipa

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

      - xcode-project use-profiles
      - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner

## Web builds

    - flutter config --enable-web
    - |
      flutter build web --release
      cd build/web
      7z a -r ../web.zip ./*

## Testing a Flutter application

Testing Flutter applications with YAML is very simple, just use the relevant test scripts (for the regular or drive test) under `scripts`.

### Flutter test
    flutter test

## Flutter drive test

    flutter emulators --launch apple_ios_simulator                  # for android use: flutter emulators --launch emulator
    flutter drive --target=test_driver/my_drive_target.dart

Ifyou want to read more about testing with YAML in general, there are several examples [HERE](../yaml/testing).

## Publishing a Flutter package

### Publishing a Flutter package to pub.dev

In order to get publishing permissions, first you will need to login to pub.dev locally. It can be done with running `pub publish --dry-run`.
After that `credentials.json` will be generated which you can use to login without the need of Google confirmation through browser.

`credentials.json` can be found in the pub cache directory (`~/.pub-cache/credentials.json` on MacOS and Linux, `%APPDATA%\Pub\Cache\credentials.json` on Windows)

    - echo $CREDENTIALS | base64 --decode > "$FLUTTER_ROOT/.pub-cache/credentials.json"
    - flutter pub publish --dry-run
    - flutter pub publish -f

### Flutter add-to-app

Please refer to [the guidlines](https://flutter.dev/docs/development/add-to-app).
The templates were inspired by add-to-app [flutter samples](https://github.com/flutter/samples/tree/master/add_to_app).

### Using a flutter package (with dependencies) as a library

Android:

    - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/<your_android_app>/local.properties"
    - cd my_flutter_module && flutter pub get
    - cd my_android_app && ./gradlew assembleRelease

iOS:

    - |
      cd my_flutter_module
      flutter pub get
      flutter build ios --release --no-codesign
      cd .ios && pod install
    - cd my_ios_app && pod install
    - xcode-project use-profiles
    - xcode-project build-ipa --workspace "my_ios_app/MyXcWorkspace.xcworkspace" --scheme "MyScheme"

## Using a prebuilt flutter module:

Android:

    - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/<your_android_app>/local.properties"
    - |
      cd my_flutter_module
      flutter pub get
      flutter build aar
    - cd my_android_app && ./gradlew assembleRelease

iOS:

    - |
      cd my_flutter_module
      flutter packages get
      flutter build ios-framework --output=$FCI_BUILD_DIR/my_ios_app/Flutter
    - xcode-project use-profiles
    - xcode-project build-ipa --project "my_ios_app/MyXcWorkspace.xcodeproj" --scheme "MyScheme"

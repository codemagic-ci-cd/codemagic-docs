---
title: Templates
description: Templates with YAML.
weight: 4
---

`scripts:` Contains the scripts and commands to be run during the build. This is where you can specify the commands to test, build and code sign your project.

## Flutter app with all the YAML settings

All settings:

    workflows:
      do-all-workflow:
        name: do-all-workflow
        max_build_duration: 60
        environment:
          vars:
            your_env_var: some_value
            CM_KEYSTORE: <your_encyrpted_android_keystore>
            CM_KEYSTORE_PASSWORD: <your_encrypted_keystore_password>
            CM_KEY_ALIAS_PASSWORD: <your_encrypted_key_alias_password>
            CM_KEY_ALIAS_USERNAME: <your_encrypted_key_alias>
            CM_CERTIFICATE: <your_encrypted_developer_certificate>
            CM_CERTIFICATE_PASSWORD: <your_encrypted_certificate_password>
            CM_PROVISIONING_PROFILE: <your_encrypted_provisioning_profile>
          flutter: stable
          xcode: edge
          cocoapods: default
        cache:
          cache_paths:
            - $HOME/.pub-cache
        triggering:
          events:
            - push
          branch_patterns:
            - pattern: <your_branch_to_trigger_on_push>
              include: true
              source: true
        scripts:
          - flutter emulators --launch apple_ios_simulator
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
          - cd project_directory && flutter packages pub get
          - cd project_directory && flutter config --enable-web
          - cd project_directory && flutter analyze
          - cd project_directory && flutter drive --target=test_driver/<your_drive_target>.dart
          - cd project_directory && flutter test test/<your_unit_test>.dart
          - cd project_directory && flutter build appbundle --release
          - |
            # generate signed universal apk with user specified keys
            universal-apk generate \
              --ks /tmp/keystore.keystore \
              --ks-pass $CM_KEYSTORE_PASSWORD \
              --ks-key-alias $CM_KEY_ALIAS_USERNAME \
              --key-pass $CM_KEY_ALIAS_PASSWORD \
              --pattern 'project_directory/build/**/outputs/**/*.aab'
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
            keychain add-certificates --certificate /tmp/certificate.p12
          - cd project_directory && flutter build ios --release --no-codesign
          - xcode-project use-profiles
          - cd project_directory && xcode-project build-ipa --workspace "ios/<your_workspace>.xcworkspace" --scheme "<your_scheme>"
          - |
            # build web
            cd project_directory
            flutter build web --release
            cd build/web
            7z a -r ../web.zip ./*
        artifacts:
          - build/**/outputs/**/*.apk
          - build/**/outputs/**/*.aab
          - build/**/outputs/**/mapping.txt
          - build/ios/ipa/*.ipa
          - /tmp/xcodebuild_logs/*.log
          - build/web.zip
          - flutter_drive.log
        publishing:
          email:
            recipients:
              - <your_email>
          google_play:
            credentials: <your_encrypted_google_play_credentials_json>
            track: internal
          app_store_connect:
            app_id: <your_app_id>
            apple_id: <your_apple_id>
            password: <your_app_specific_password>

### Building a Flutter app for Android

    workflows:
      default-workflow:
        name: Default Workflow
        max_build_duration: 60
        environment:
          flutter: stable
        scripts:
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
          - flutter packages pub get
          - flutter test
          - flutter build apk --release
        artifacts:
          - build/**/outputs/**/*.apk

**Note on building Android app bundles**

If your app settings in Codemagic have building Android app bundles enabled, we will automatically include a script for generating a signed `app-universal.apk` during the YAML export. If you're creating a YAML file from a scratch, add the script below to receive this file:

    # generate signed universal apk with user specified keys
    universal-apk generate \
          --ks /tmp/keystore.keystore \
          --ks-pass $CM_KEYSTORE_PASSWORD \
          --ks-key-alias $CM_KEY_ALIAS_USERNAME \
          --key-pass $CM_KEY_ALIAS_PASSWORD \
          --pattern 'build/**/outputs/**/*.aab'

### Building a flutter app for iOS

{{<notebox>}}
Codemagic uses the [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md) utility for generating and managing certificates and provisioning profiles and performing code signing.
{{</notebox>}}

Below is an example of building a Flutter app for iOS with automatic code signing.

    workflows:
      ios-automatic-signing:
        name: ios_automatic_signing
        environment:
          vars:
            CERTIFICATE_PRIVATE_KEY: <your_encrypted_certificate_private_key>
            APP_STORE_CONNECT_KEY_IDENTIFIER: <your_encrypted_app_store_connect_key_identifier>
            APP_STORE_CONNECT_PRIVATE_KEY: <your_encrypted_app_store_connect_private_key>
            APP_STORE_CONNECT_ISSUER_ID: <your_encrypted_app_store_connect_issue_id>
          flutter: stable
          xcode: latest
          cocoapods: default
        scripts:
          - flutter packages pub get
          - flutter analyze
          - flutter test
          - find . -name "Podfile" -execdir pod install \;
          - keychain initialize
          - app-store-connect fetch-signing-files "io.codemagic.app" \  # Fetch signing files for specified bundle ID (use "$(xcode-project detect-bundle-id)" if not specified)
            --type IOS_APP_DEVELOPMENT \  # Specify provisioning profile type*
            --create  # Allow creating resources if existing are not found.
          - keychain add-certificates
          - flutter build ios --debug --flavor dev --no-codesign
          - xcode-project use-profiles
          - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner
        artifacts:
          - build/ios/ipa/*.ipa
          - /tmp/xcodebuild_logs/*.log

{{<notebox>}}
The available provisioning profile types are described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch%E2%80%91signing%E2%80%91files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store).
{{</notebox>}}

Below is an example of building a Flutter app for iOS with manual code signing.

    workflows:
      ios-manual-signing:
        name: ios_manual_signing
        environment:
          vars:
            CM_CERTIFICATE: <your_encrypted_developer_certificate>
            CM_CERTIFICATE_PASSWORD: <your_encrypted_developer_certificate_password>
            CM_PROVISIONING_PROFILE: <your_encrypted_provisioning_profile>
          xcode: latest
          cocoapods: default
          flutter: stable
        scripts:
          - flutter packages pub get
          - flutter analyze
          - flutter test
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

          - flutter build ios --debug --flavor dev --no-codesign
          - xcode-project use-profiles
          - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner
        artifacts:
          - build/ios/ipa/*.ipa
          - /tmp/xcodebuild_logs/*.log

## Building a native Android/iOS app

An example of using YAML to build an Android app with Gradle:

    workflows:
      android-app:
        name: android_app
        scripts:
          - |
            # set up debug keystore
            rm -f ~/.android/debug.keystore
            keytool -genkeypair \
              -alias androiddebugkey \
              -keypass android \
              -keystore ~/.android/debug.keystore \
              -storepass android \
              -dname 'CN=Android Debug,O=Android,C=US' \
              -keyalg 'RSA' \
              -keysize 2048 \
              -validity 10000
          # - ./gradlew test
          - ./gradlew build
          - ./gradlew bundleRelease
        artifacts:
          - build/outputs/**/**/*.apk
          - build/outputs/**/**/*.aab

An example of using YAML to build an iOS (Swift) project:

    workflows:
      ios-project:
        name: ios_project
        environment:
          vars:
            CM_CERTIFICATE: <your_encrypted_developer_certificate>
            CM_CERTIFICATE_PASSWORD: <your_encrypted_developer_certificate_password>
            CM_PROVISIONING_PROFILE: <your_encrypted_provisioning_profile>
          xcode: latest
          cocoapods: default
        scripts:
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
            keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
          - xcode-project use-profiles
          - xcode-project build-ipa --project "<your_xcode_project>.xcodeproj" --scheme "<your_scheme>"
        artifacts:
          - build/ios/ipa/*.ipa
          - /tmp/xcodebuild_logs/*.log


## Building a React Native app

With code signing:

    workflows:
     react-native:
        name: react native
        environment:
          vars:
            CM_KEYSTORE: <your_encrypted_keystore>
            CM_KEYSTORE_PASSWORD: <your_encrypted_keystore_password>
            CM_KEY_ALIAS_PASSWORD: <your_encrypted_key_password>
            CM_KEY_ALIAS_USERNAME: <your_encrypted_key_name>
            CM_CERTIFICATE: <your_encrypted_developer_certificate>
            CM_CERTIFICATE_PASSWORD: <your_encrypted_developer_certificate_password>
            CM_PROVISIONING_PROFILE: <your_encrypted_provisioning_profile>
          xcode: latest
          cocoapods: default
        scripts:
         - npm install
          - |
            # set up key.properties
            echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
            cat >> "$FCI_BUILD_DIR/android/key.properties" <<EOF
            storePassword=$CM_KEYSTORE_PASSWORD
            keyPassword=$CM_KEY_ALIAS_PASSWORD
            keyAlias=$CM_KEY_ALIAS_USERNAME
            storeFile=/tmp/keystore.keystore
            EOF
         - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
          - cd android && ./gradlew bundleRelease
          - |
            # generate signed universal apk with user specified keys
            universal-apk generate \
            --ks /tmp/keystore.keystore \
            --ks-pass $CM_KEYSTORE_PASSWORD \
            --ks-key-alias $CM_KEY_ALIAS_USERNAME \
            --key-pass $CM_KEY_ALIAS_PASSWORD \
            --pattern 'android/app/build/outputs/**/**/*.aab'
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
            keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
          - xcode-project use-profiles
          - xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"
        artifacts:
          - android/app/build/outputs/**/**/*.apk
          - android/app/build/outputs/**/**/*.aab
          - build/ios/ipa/*.ipa
          - /tmp/xcodebuild_logs/*.log
        publishing:
          email:
            recipients:
              - <your_email>

Without code signing:

    workflows:
      react-native:
        name: react native
        scripts:
          - npm install
          - |
            # set up debug keystore
            rm -f ~/.android/debug.keystore
            keytool -genkeypair \
              -alias androiddebugkey \
              -keypass android \
              -keystore ~/.android/debug.keystore \
              -storepass android \
              -dname 'CN=Android Debug,O=Android,C=US' \
              -keyalg 'RSA' \
              -keysize 2048 \
              -validity 10000
          - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
          - cd android && ./gradlew bundleRelease
          - |
            # generate universal apk signed with debug key
            universal-apk generate \
              --ks ~/.android/debug.keystore \
              --ks-pass android \
              --ks-key-alias androiddebugkey \
              --key-pass android \
              --pattern 'android/app/build/outputs/**/**/*.aab'
        artifacts:
          - android/app/build/outputs/**/**/*.apk
          - android/app/build/outputs/**/**/*.aab
          - /tmp/xcodebuild_logs/*.log

## Publishing a flutter package to pub.dev

In order to get publishing permissions, first you will need to login to pub.dev locally. It can be done with running `pub publish --dry-run`.
After that `credentials.json` will be generated which you can use to login without the need of Google confirmation through browser.

`credentials.json` can be found in the pub cache directory (`~/.pub-cache/credentials.json` on MacOS and Linux, `%APPDATA%\Pub\Cache\credentials.json` on Windows)

    workflows:
    package-workflow:
      name: package-workflow
      environment:
        vars:
          CREDENTIALS: <your encrypted credentials.json>
        flutter: stable
      scripts:
        - flutter packages pub get
        - echo $CREDENTIALS | base64 --decode > "$FLUTTER_ROOT/.pub-cache/credentials.json"
        - flutter test
        - flutter pub publish --dry-run
        - flutter pub publish -f

## Running custom scripts

You can run scripts in languages other than shell (`sh`) by defining the languge with a shebang line or by launching a script file present in your repository.

For example, you can write a build script with Dart like this:

    scripts:
      - |
        #!/usr/local/bin/dart

        void main() {
          print('Hello, World!');
        }

## Flutter add-to-app

Please refer to [the guidlines](https://flutter.dev/docs/development/add-to-app).
The templates were inspired with add-to-app [flutter samples](https://github.com/flutter/samples/tree/master/add_to_app).

### Using a flutter package (with dependencies) as a library

Android:

    workflows:
      android-add-to-app-as-library:
        name: android_add_to_app_as_library
        environment:
          vars:
            CM_KEYSTORE: <your_encrypted_keystore>
            CM_KEYSTORE_PASSWORD: <your_encrypted_keystore_password>
            CM_KEY_ALIAS_PASSWORD: <your_encrypted_key_password>
            CM_KEY_ALIAS_USERNAME: <your_encrypted_key_name>
          flutter: stable
        scripts:
          - |
            # set up key.properties
            echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
            cat >> "$FCI_BUILD_DIR/your_android_app/key.properties" <<EOF
            storePassword=$CM_KEYSTORE_PASSWORD
            keyPassword=$CM_KEY_ALIAS_PASSWORD
            keyAlias=$CM_KEY_ALIAS_USERNAME
            storeFile=/tmp/keystore.keystore
            EOF
          - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/<your_android_app>/local.properties"
          - cd <flutter_module> && flutter pub get
          - cd <your_android_app> && ./gradlew assembleRelease
        artifacts:
          - <your_android_app>/app/build/outputs/**/**/*.apk

iOS:

    workflows:
      ios-add-to-app-as-library:
        name: ios_add_to_app_as_library
        environment:
          vars:
            CM_CERTIFICATE: <your_encrypted_developer_certificate>
            CM_CERTIFICATE_PASSWORD: <your_encrypted_developer_certificate_password>
            CM_PROVISIONING_PROFILE: <your_encrypted_provisioning_profile>
          xcode: latest
          cocoapods: default
          flutter: stable
        scripts:
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
            keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
          - |
            cd <flutter_module>
            flutter pub get
            flutter build ios --release --no-codesign
            cd .ios && pod install
          - cd <your_ios_app> && pod install
          - xcode-project use-profiles
          - xcode-project build-ipa --workspace "<your_ios_application>/<your_workspace>.xcworkspace" --scheme "<your_scheme>"
        artifacts:
          - build/ios/ipa/*.ipa
          - /tmp/xcodebuild_logs/*.log

### Using a prebuilt flutter module:

Android:

    workflows:
      android-add-to-app-as-prebuilt-module:
        name: android_add_to_app_as_prebuilt_module
        environment:
          vars:
            CM_KEYSTORE: <your_encrypted_keystore>
            CM_KEYSTORE_PASSWORD: <your_encrypted_keystore_password>
            CM_KEY_ALIAS_PASSWORD: <your_encrypted_key_password>
            CM_KEY_ALIAS_USERNAME: <your_encrypted_key_name>
          flutter: stable
        scripts:
          - |
            # set up key.properties
            echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
            cat >> "$FCI_BUILD_DIR/<your_android_app>/key.properties" <<EOF
            storePassword=$CM_KEYSTORE_PASSWORD
            keyPassword=$CM_KEY_ALIAS_PASSWORD
            keyAlias=$CM_KEY_ALIAS_USERNAME
            storeFile=/tmp/keystore.keystore
            EOF
          - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/<your_android_app>/local.properties"
          - |
            cd <flutter_module>
            flutter pub get
            flutter build aar
          - cd <your_android_app> && ./gradlew assembleRelease
        artifacts:
          - <your_android_app>/app/build/outputs/**/**/*.apk

iOS:

    workflows:
      ios-add-to-app-as-prebuilt-module:
        name: ios_add_to_app_as_prebuilt_module
        environment:
          vars:
            CM_CERTIFICATE: <your_encrypted_developer_certificate>
            CM_CERTIFICATE_PASSWORD: <your_encrypted_developer_certificate_password>
            CM_PROVISIONING_PROFILE: <your_encrypted_provisioning_profile>
          xcode: latest
          cocoapods: default
          flutter: stable
        scripts:
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
            keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
          - |
            cd <flutter_module>
            flutter packages get
            flutter build ios-framework --output=$FCI_BUILD_DIR/<your_ios_app>/Flutter
          - xcode-project use-profiles
          - xcode-project build-ipa --project "<your_ios_app>/<your_xcode_project>.xcodeproj" --scheme "<your_scheme>"
        artifacts:
          - build/ios/ipa/*.ipa
          - /tmp/xcodebuild_logs/*.log

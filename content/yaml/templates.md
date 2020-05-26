---
title: Templates
description: Templates with YAML.
weight: 4
---

`scripts:` Contains the scripts and commands to be run during the build. This is where you can specify the commands to test, build and code sign your project. 

### Building for Android

Below is an example of building a Flutter app for Android.

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

Flutter plugin:

    workflows:
    package-workflow:
      name: package-workflow
      environment:
        vars:
          CREDENTIALS: <your encrypted ~/.pub-cache/credentials.json>
        flutter: stable
      scripts:
        - flutter packages pub get
        - echo $CREDENTIALS | base64 --decode > "$FLUTTER_ROOT/.pub-cache/credentials.json"
        - flutter test
        - flutter pub publish --dry-run
        - flutter pub publish -f

## Flutter app with all the YAML settings

All settings:

    workflows:
    do-all-workflow:
      name: do-all-workflow
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
          - pattern: your_branch_to_trigger_on_push
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
        - cd project_directory && flutter drive --target=test_driver/button_pressing.dart
        - cd project_directory && flutter test test/unit_test.dart
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
        - cd project_directory && xcode-project build-ipa --workspace "ios/Your_workspace.xcworkspace" --scheme "Your_scheme"
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
            - your_email
        google_play:
          credentials: <your_encrypted_google_play_credentials_json>
          track: internal
        app_store_connect:
          app_id: <your_app_id>
          apple_id: <your_apple_id>
          password: <your_app_specific_password>

It is also possible to build an android app using a prebuilt module:

    workflows:
     android-using-plugin:
        name: android_using_plugin
        environment:
          vars:
            CM_KEYSTORE: <your_encrypted_keystore>
            CM_KEYSTORE_PASSWORD: <your_encrypted_keystore_password>
            CM_KEY_ALIAS_PASSWORD: <your_encrypted_key_password>
            CM_KEY_ALIAS_USERNAME: <your_encrypted_key_name>
          flutter: stable
        triggering:
          events:
            - push
          branch_patterns:
            - pattern: 'branch_to_trigger'
              include: true
              source: true
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
          - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/your_android_app/local.properties"
          - |
            cd flutter_module 
            flutter pub get
            flutter build aar
          - cd android_using_prebuilt_module && ./gradlew assembleRelease
        artifacts:
          - your_android_app/app/build/outputs/**/**/*.apk

When the module uses plugins, the script looks like this:

    workflows:
    android-using-plugin:
      name: android_using_plugin
      environment:
        vars:
          CM_KEYSTORE: <your_encrypted_keystore>
          CM_KEYSTORE_PASSWORD: <your_encrypted_keystore_password>
          CM_KEY_ALIAS_PASSWORD: <your_encrypted_key_password>
          CM_KEY_ALIAS_USERNAME: <your_encrypted_key_name>
        flutter: stable
      triggering:
        events:
          - push
        branch_patterns:
          - pattern: 'branch_to_trigger'
            include: true
            source: true
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
        - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/your_android_app/local.properties"
        - cd flutter_module && flutter pub get
        - cd your_android_app && ./gradlew assembleRelease
      artifacts:
        - your_android_app/app/build/outputs/**/**/*.apk

## Building an Android app with Gradle

An example of using YAML to build an Android app with Gradle:

    workflows:
    default-workflow:
      name: Default Workflow
      triggering:
        events:
          - push
        branch_patterns:
          - pattern: '*'
            include: true
            source: true
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

**Note on building Android app bundles**

If your app settings in Codemagic have building Android app bundles enabled, we will automatically include a script for generating a signed `app-universal.apk` during the YAML export. If you're creating a YAML file from a scratch, add the script below to receive this file:

    # generate signed universal apk with user specified keys
    universal-apk generate \
          --ks /tmp/keystore.keystore \
          --ks-pass $CM_KEYSTORE_PASSWORD \
          --ks-key-alias $CM_KEY_ALIAS_USERNAME \
          --key-pass $CM_KEY_ALIAS_PASSWORD \
          --pattern 'build/**/outputs/**/*.aab'
  
### Building for iOS

{{<notebox>}}
Codemagic uses the [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md) utility for generating and managing certificates and provisioning profiles and performing code signing.
{{</notebox>}}

Below is an example of building a Flutter app for iOS with automatic code signing. 

    scripts:
          - flutter packages pub get
          - flutter analyze
          - flutter test
          - find . -name "Podfile" -execdir pod install \;
          - keychain initialize
          - app-store-connect fetch-signing-files "io.codemagic.app" \  # Fetch signing files for specified bundle ID
                --type IOS_APP_DEVELOPMENT \  # Specify provisioning profile type*
                --create  # Allow creating resources if existing are not found.
          - keychain add-certificates
          - flutter build ios --debug --flavor dev --no-codesign
          - xcode-project use-profiles
          - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner

* The available provisioning profile types are described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch%E2%80%91signing%E2%80%91files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store).

Below is an example of building a Flutter app for iOS with manual code signing.

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

With dependency with signing:

    workflows:
    ios-flutter-module:
      name: ios_flutter_module
      environment:
        vars:          
          CM_CERTIFICATE: <your_encrypted_developer_certificate>
          CM_CERTIFICATE_PASSWORD: <your_encrypted_developer_certificate_password>
          CM_PROVISIONING_PROFILE: <your_encrypted_provisioning_profile>
        xcode: latest
        cocoapods: default
        flutter: stable
      triggering:
        events:
          - push
        branch_patterns:
          - pattern: 'target_branch'
            include: true
            source: true
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
        - cd <your_ios_application> && pod install
        - xcode-project use-profiles
        - xcode-project build-ipa --workspace "<your_ios_application>/<your_ios_application>.xcworkspace" --scheme "<your_scheme>"
      artifacts:
        - build/ios/ipa/*.ipa
        - /tmp/xcodebuild_logs/*.log  

### Building for Native

Below is an example of building a React Native app with code signing.

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
        triggering:
          events:
            - push
          branch_patterns:
            - pattern: '*'
              include: true
              source: true
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

And also an example for Native without code signing:

    workflows:
      react-native-simple:
        name: react native simple
        triggering:
          events:
            - push
          branch_patterns:
            - pattern: 'simple_android'
              include: true
              source: true
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

### Running custom scripts

You can run scripts in languages other than shell (`sh`) by defining the languge with a shebang line or by launching a script file present in your repository.

For example, you can write a build script with Dart like this:

    scripts:
        - |
          #!/usr/local/bin/dart

          void main() {
            print('Hello, World!');
          }
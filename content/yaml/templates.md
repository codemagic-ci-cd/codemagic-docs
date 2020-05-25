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

### Running custom scripts

You can run scripts in languages other than shell (`sh`) by defining the languge with a shebang line or by launching a script file present in your repository.

For example, you can write a build script with Dart like this:

    scripts:
        - |
          #!/usr/local/bin/dart

          void main() {
            print('Hello, World!');
          }
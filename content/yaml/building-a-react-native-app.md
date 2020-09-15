---
title: Building a React Native app
description: Building a React Native app with YAML.
weight: 5
---

React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. When working with YAML, the basics are still the same, the build scripts are added to the `scripts` section in the [overall architecture](../yaml/yaml/#template).

## Android

Set up local properties

    - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"

Building an Android application:

    - cd android && ./gradlew build

## iOS

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

Script for building an iOS application:

    - xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}} 

## Testing, code signing and publishing

To test and publish a React Native app:

* The code for testing a React Native app also goes under `scripts`, before build commands. An example for testing a React Naive app can be found [here](../yaml/testing/#react-native-unit-test).
* All iOS and Android applications need to be signed before release. Different script examples are available [here](../yaml/distribution/).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../yaml/distribution/#publishing).

## iOS workflow example

The following example shows a workflow that can be used to publish your iOS app to App Store Connect.

    workflows:
        ios-workflow:
            name: iOS Workflow
            max_build_duration: 60
            instance_type: mac_pro
            environment:
                vars:
                    XCODE_WORKSPACE: "YOUR_WORKSPACE_NAME.xcworkspace"  # YOUR WORKSPACE NAME HERE
                    XCODE_SCHEME: "YOUR_SCHEME_NAME" # THE NAME OF YOUR SCHEME HERE
                    CM_CERTIFICATE: Encrypted(...) # PUT THE ENCRYPTED DISTRIBUTION CERTIFICATE HERE
                    CM_CERTIFICATE_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED CERTIFICATE PASSWORD HERE
                    CM_PROVISIONING_PROFILE: Encrypted(...) # PUT THE ENCRYPTED PROVISIONING PROFILE HERE
                node: latest
                xcode: latest
                cocoapods: default
            triggering:
                events:
                    - push
                    - tag
                    - pull_request
                branch_patterns:
                    - pattern: develop
                    include: true
                    source: true
            scripts:
                - name: Install npm dependencies
                  script: |
                    npm install
                - name: Install CocoaPods dependencies
                  script: |
                    cd ios && pod install
                - name: Set up keychain to be used for codesigning using Codemagic CLI 'keychain' command
                  script: |
                    keychain initialize
                - name: Set up Provisioning profiles from environment variables
                  script: |
                    PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
                    mkdir -p "$PROFILES_HOME"
                    PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
                    echo ${CM_PROVISIONING_PROFILE} | base64 --decode > $PROFILE_PATH
                    echo "Saved provisioning profile $PROFILE_PATH"
                - name: Set up signing certificate
                  script: |
                    echo $CM_CERTIFICATE | base64 --decode > /tmp/certificate.p12
                    keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
                - name: Increment build number
                  script: |
                    #!/bin/sh
                    set -e
                    set -x
                    cd $FCI_BUILD_DIR/ios
                    agvtool new-version -all $(($BUILD_NUMBER +1))
                - name: Set up code signing settings on Xcode project
                  script: |
                    xcode-project use-profiles --project ios/*.xcodeproj
                - name: Build ipa for distribution
                  script: |
                    xcode-project build-ipa --workspace "$FCI_BUILD_DIR/ios/$XCODE_WORKSPACE" --scheme $XCODE_SCHEME
            artifacts:
                - build/ios/ipa/*.ipa
                - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM            
            publishing:
            app_store_connect:                 
                apple_id: your_apple_id@example.com  # PUT YOUR APPLE ID HERE
                password: Encrypted(...) # THE ENCRYPTED APP-SPECIFIC PASSWORD GOES HERE


## Android workflow example

The following example shows how to set up a workflow that builds your app and publishes to a Google Play internal track.

    workflows:
        android-workflow:
            name: Android Workflow
            max_build_duration: 60
            instance_type: mac_pro
            environment:
                vars:
                    CM_KEYSTORE: Encrypted(...) # PUT THE ENCRYPTED KEYSTORE FILE HERE
                    CM_KEYSTORE_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED PASSWORD FOR THE KEYSTORE FILE HERE
                    CM_KEY_ALIAS_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED KEYSTORE ALIAS PASSWORD HERE
                    CM_KEY_ALIAS_USERNAME: Encrypted(...) #PUT THE ENCRYPTED KEYSTORE USERNAME HERE
                node: latest
            triggering:
                events:
                    - push
                    - tag
                    - pull_request
                branch_patterns:
                    - pattern: release
                    include: true
                    source: true
            scripts:
                - name: Install npm dependencies
                  script: |
                    npm install
                - name: Set up local properties
                  script: |
                    echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
                - name: Set up keystore
                  script: |
                    echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
                    cat >> "$FCI_BUILD_DIR/android/key.properties" <<EOF
                    storePassword=$CM_KEYSTORE_PASSWORD
                    keyPassword=$CM_KEY_ALIAS_PASSWORD
                    keyAlias=$CM_KEY_ALIAS_USERNAME
                    storeFile=/tmp/keystore.keystore
                    EOF
                - name: Build Android app
                  script: |
                    cd android && ./gradlew assembleRelease
            artifacts:
                - android/app/build/outputs/**/**/*.apk
            publishing:
                google_play:
                    credentials: Encrypted(...) # PUT YOUR ENCRYPTED GOOGLE PLAY JSON CREDENTIALS FILE HERE
                    track: internal

    
{{<notebox>}}Note that you should incremenet the versionCode in `android/app/build.gradle` {{</notebox>}}

Incrementing the version code can be done as follows:

```
    android {
        ...
        
        def appVersionCode = Integer.valueOf(System.env.BUILD_NUMBER ?: 0)
        defaultConfig {
            ...
            versionCode appVersionCode
            ...
        }
    }
```

---
title: Building a React Native app
description: How to build a React Native app with codemagic.yaml
weight: 8
aliases: 
  - '../yaml/building-a-react-native-app'
---

React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. When working with YAML, the basics are still the same, the build scripts are added to the `scripts` section in the [overall architecture](../getting-started/yaml#template).

## Setting up a React Native project

The apps you have available on Codemagic are listed on the Applications page. See how to add additional apps [here](./adding-apps-from-custom-sources).

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. On the popup, select **React Native App** as the project type and click **Continue**.
3. Download the example configuration for React Native or copy it to clipboard.
4. Then edit the configuration file to adjust it to your project needs and commit it to the root of your repository.
    * For an overview about using `codemagic.yaml`, please refer [here](./yaml). 
    * Read more about adding configuration for [testing](../testing-yaml/testing), [iOS code signing](../code-signing-yaml/signing-ios), [Android code signing](../code-signing-yaml/signing-android) and [publishing](../publishing-yaml/distribution).
    * See the full workflow examples below.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Tip**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).
{{</notebox>}}

## Android

Set up local properties

```yaml
- echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
```

Building an Android application:

```yaml
- cd android && ./gradlew build
```

## iOS

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

Script for building an iOS application:

```yaml
- xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"
```

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}} 

## Testing, code signing and publishing

To test and publish a React Native app:

* The code for testing a React Native app also goes under `scripts`, before build commands. An example for testing a React Naive app can be found [here](../testing-yaml/testing/#react-native-unit-test).
* All iOS and Android applications need to be signed before release. See how to set up [iOS code signing](../code-signing-yaml/signing-ios) and [Android code signing](../code-signing-yaml/signing-android).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../publishing-yaml/distribution/#publishing).

## iOS workflow example

The following example shows a workflow that can be used to publish your iOS app to App Store Connect.

```yaml
workflows:
  ios-workflow:
    name: iOS Workflow
    max_build_duration: 60
    instance_type: mac_pro
    environment:
      vars:
        XCODE_WORKSPACE: "YOUR_WORKSPACE_NAME.xcworkspace"  # YOUR WORKSPACE NAME HERE
        XCODE_SCHEME: "YOUR_SCHEME_NAME" # THE NAME OF YOUR SCHEME HERE
        FCI_CERTIFICATE: Encrypted(...) # PUT THE ENCRYPTED DISTRIBUTION CERTIFICATE HERE
        FCI_CERTIFICATE_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED CERTIFICATE PASSWORD HERE
        FCI_PROVISIONING_PROFILE: Encrypted(...) # PUT THE ENCRYPTED PROVISIONING PROFILE HERE
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
        script: npm install
      - name: Install CocoaPods dependencies
        script: |
            cd ios 
            pod repo update
            pod install
      - name: Set up keychain to be used for codesigning using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Set up Provisioning profiles from environment variables
        script: |
          PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
          mkdir -p "$PROFILES_HOME"
          PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
          echo ${FCI_PROVISIONING_PROFILE} | base64 --decode > "$PROFILE_PATH"
          echo "Saved provisioning profile $PROFILE_PATH"
      - name: Set up signing certificate
        script: |
          echo $FCI_CERTIFICATE | base64 --decode > /tmp/certificate.p12
          keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $FCI_CERTIFICATE_PASSWORD
      - name: Increment build number
        script: cd ios && agvtool new-version -all $(($BUILD_NUMBER +1))
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
      - name: Build ipa for distribution
        script: xcode-project build-ipa --workspace "$FCI_BUILD_DIR/ios/$XCODE_WORKSPACE" --scheme $XCODE_SCHEME
    artifacts:
      - build/ios/ipa/*.ipa
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      app_store_connect:
        apple_id: your_apple_id@example.com  # PUT YOUR APPLE ID HERE
        password: Encrypted(...) # THE ENCRYPTED APP-SPECIFIC PASSWORD GOES HERE
```

## Android workflow example

The following example shows how to set up a workflow that builds your app and publishes to a Google Play internal track.

```yaml
workflows:
  android-workflow:
    name: Android Workflow
    max_build_duration: 60
    instance_type: mac_pro
    environment:
      vars:
        FCI_KEYSTORE_PATH: /tmp/keystore.keystore
        FCI_KEYSTORE: Encrypted(...) # PUT THE ENCRYPTED KEYSTORE FILE HERE
        FCI_KEYSTORE_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED PASSWORD FOR THE KEYSTORE FILE HERE
        FCI_KEY_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED KEYSTORE ALIAS PASSWORD HERE
        FCI_KEY_ALIAS: Encrypted(...) #PUT THE ENCRYPTED KEYSTORE ALIAS HERE
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
        script: npm install
      - name: Set up local properties
        script: echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
      - name: Set up key.properties file for code signing
        script: |
          echo $FCI_KEYSTORE | base64 --decode > $FCI_KEYSTORE_PATH
          cat >> "$FCI_BUILD_DIR/android/key.properties" <<EOF
          storePassword=$FCI_KEYSTORE_PASSWORD
          keyPassword=$FCI_KEY_PASSWORD
          keyAlias=$FCI_KEY_ALIAS
          storeFile=$FCI_KEYSTORE_PATH
          EOF
      - name: Build Android app
        script: cd android && ./gradlew assembleRelease
    artifacts:
      - android/app/build/outputs/**/**/*.apk
    publishing:
      google_play:
        credentials: Encrypted(...) # PUT YOUR ENCRYPTED GOOGLE PLAY JSON CREDENTIALS FILE HERE
        track: internal
```

{{<notebox>}}Note that you should incremenet the versionCode in `android/app/build.gradle` {{</notebox>}}

Incrementing the version code can be done as follows:

```gradle
    android {
        ...
        
        def appVersionCode = Integer.valueOf(System.env.BUILD_NUMBER ?: 1)
        defaultConfig {
            ...
            versionCode appVersionCode
            ...
        }
    }
```

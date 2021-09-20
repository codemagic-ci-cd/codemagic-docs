---
title: Building a React Native app
description: How to build a React Native app with codemagic.yaml
weight: 5
aliases: 
  - '../yaml/building-a-react-native-app'
  - /getting-started/building-a-react-native-app
---

React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. When working with YAML, the basics are still the same, the build scripts are added to the `scripts` section in the [overall architecture](../getting-started/yaml#template).

## Setting up a React Native project

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. On the popup, select **React Native App** as the project type and click **Continue**.
3. Create a [`codemagic.yaml`](./yaml) file and add in it the commands to build, test and publish your project. See the full Android and iOS workflow examples below.
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Tip**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).
{{</notebox>}}

## Android

{{<notebox>}}
You can find an up-to-date codemagic.yaml React Native Android workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/react-native/react-native-demo-project/codemagic.yaml#L5).
{{</notebox>}}

Set up local properties

```yaml
- echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/android/local.properties"
```

Building an Android application:

```yaml
- cd android && ./gradlew build
```

Here is a sample codemagic.yaml workflow for building Android and publishing to the Google Play alpha track:

```yaml
workflows:
    react-native-android:
        name: React Native Android
        max_build_duration: 120
        instance_type: mac_mini
        environment:
            groups:
                - keystore_credentials # <-- (Includes: CM_KEYSTORE, CM_KEYSTORE_PASSWORD, CM_KEY_ALIAS_PASSWORD, CM_KEY_ALIAS_USERNAME)
                - google_play # <-- (Includes: GCLOUD_SERVICE_ACCOUNT_CREDENTIALS)
                - other
            # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
            vars:
                PACKAGE_NAME: "YOUR_PACKAGE_NAME" # <-- Put your package name here e.g. com.domain.myapp
            node: latest
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
            - name: Set Android SDK location
              script: |
                echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/android/local.properties"
            - name: Set up keystore
              script: |
                    echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
                    cat >> "$FCI_BUILD_DIR/android/key.properties" <<EOF
                    storePassword=$CM_KEYSTORE_PASSWORD
                    keyPassword=$CM_KEY_ALIAS_PASSWORD
                    keyAlias=$CM_KEY_ALIAS_USERNAME
                    storeFile=/tmp/keystore.keystore
                    EOF               
            - name: Build Android release
              script: |
                # Set environment variable so it can be used to increment build number in android/app/build.gradle
                # Note that tracks can be specified when retrieving latest build number from Google Play, for example:
                # export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks=alpha) + 1))
                export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME") + 1))
                cd android && ./gradlew assembleRelease
        artifacts:
            - android/app/build/outputs/**/*.apk
        publishing:
            # See the following link for details about email publishing - https://docs.codemagic.io/publishing-yaml/distribution/#email
            email:
                recipients:
                    - user_1@example.com
                    - user_2@example.com
                notify:
                  success: true     # To not receive a notification when a build succeeds
                  failure: false    # To not receive a notification when a build fails
            slack: 
              # See the following link about how to connect your Slack account - https://docs.codemagic.io/publishing-yaml/distribution/#slack
              channel: '#channel-name'
              notify_on_build_start: true   # To receive a notification when a build starts
              notify:
                success: true               # To receive a notification when a build succeeds
                failure: false              # To not receive a notification when a build fails
            google_play:
              # See the following link for information regarding publishing to Google Play - https://docs.codemagic.io/publishing-yaml/distribution/#google-play
              credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
              track: alpha # <-- Any default or custom track that is not in ‘draft’ status
```

## iOS

{{<notebox>}}
You can find an up-to-date codemagic.yaml React Native iOS workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/react-native/react-native-demo-project/codemagic.yaml#L72).
{{</notebox>}}

Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for the build.

Script for building an iOS application:

```yaml
- xcode-project build-ipa --workspace "ios/MyReact.xcworkspace" --scheme "MyReact"
```

Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46). 

Here is a sample codemagic.yaml workflow for building iOS and publishing to App Store Connect:

```yaml
workflows:
  react-native-ios:
    name: React Native iOS
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      groups:
        - appstore_credentials # <-- (Includes: APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY) - https://docs.codemagic.io/code-signing-yaml/signing-ios/
        - certificate_credentials # <-- (Includes: CERTIFICATE_PRIVATE_KEY)
        - other # <-- (Includes: APP_STORE_APP_ID - Put the app id number here. This is found in App Store Connect > App > General > App Information)
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      vars:
        XCODE_WORKSPACE: "YOUR_WORKSPACE_NAME.xcworkspace" # <-- Put the name of your Xcode workspace here
        XCODE_SCHEME: "YOUR_SCHEME_NAME" # <-- Put the name of your Xcode scheme here        
        BUNDLE_ID: "YOUR_BUNDLE_ID_HERE" # <-- Put your Bundle Id here e.g com.domain.myapp
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
      - name:
        script: |
          # For information about Codemagic CLI commands visit: https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md
          # For details about the --type paramater below - https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store
          app-store-connect fetch-signing-files "$BUNDLE_ID" --type IOS_APP_STORE --create
      - name: Use system default keychain
        script: |
          keychain add-certificates
      - name: Increment build number
        script: |
          #!/bin/sh
          set -e
          set -x
          cd $FCI_BUILD_DIR/ios
          # agvtool new-version -all $(($BUILD_NUMBER + 1))
          agvtool new-version -all $(($(app-store-connect get-latest-testflight-build-number "$APP_STORE_APP_ID") + 1))
      - name: Set up code signing settings on Xcode project
        script: |
          xcode-project use-profiles --warn-only
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa --workspace "$FCI_BUILD_DIR/ios/$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME" 
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      # See the following link for details about email publishing - https://docs.codemagic.io/publishing-yaml/distribution/#email
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true     # To not receive a notification when a build succeeds
          failure: false    # To not receive a notification when a build fails
      slack:
        # See the following link about how to connect your Slack account - https://docs.codemagic.io/publishing-yaml/distribution/#slack
        channel: '#channel-name'
        notify_on_build_start: true   # To receive a notification when a build starts
        notify:
          success: true               # To receive a notification when a build succeeds
          failure: false              # To not receive a notification when a build fails
      app_store_connect:
          api_key: $APP_STORE_CONNECT_PRIVATE_KEY      # Contents of the API key, can also reference environment variable such as $APP_STORE_CONNECT_PRIVATE_KEY
          key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER    # Alphanumeric value that identifies the API key, can also reference environment variable such as $APP_STORE_CONNECT_KEY_IDENTIFIER
          issuer_id:$APP_STORE_CONNECT_ISSUER_ID       # Alphanumeric value that identifies who created the API key, can also reference environment variable such as $APP_STORE_CONNECT_ISSUER_ID
          submit_to_testflight: true        # Optional boolean, defaults to false. Whether or not to submit the uploaded build to TestFlight to automatically enroll your build to beta testers.  
```

## Testing, code signing and publishing

To test and publish a React Native app:

* The code for testing a React Native app also goes under `scripts`, before build commands. An example for testing a React Native app can be found [here](../testing-yaml/testing/#react-native-unit-test).
* All iOS and Android applications need to be signed before release. See how to set up [iOS code signing](../code-signing-yaml/signing-ios) and [Android code signing](../code-signing-yaml/signing-android).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../publishing-yaml/distribution/#publishing).

## Build versioning your React Native app

### Android versioning

{{<notebox>}}When using automatic build versioning in **codemagic.yaml** please note that configuration changes still need to be made in `android/app/build.gradle` {{</notebox>}}

In the [build.gradle](https://github.com/codemagic-ci-cd/react-native-demo-project/blob/master/android/app/build.gradle) note how the versionCode is set in the `defaultConfig{}`.

Additionally, pay attention to how `signingConfigs{}` and `buildTypes{}` are configured for debug and release.

### iOS versioning

{{<notebox>}}Build versioning for iOS projects is performed as a script step in the codemagic.yaml{{</notebox>}}
 
See the **Increment build number** script in the [codemagic.yaml](https://github.com/codemagic-ci-cd/react-native-demo-project/blob/master/codemagic.yaml) in the React Native demo project on GitHub.

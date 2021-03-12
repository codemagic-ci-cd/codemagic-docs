---
title: Building an Ionic app 
description: How to build an Ionic app with codemagic.yaml
weight: 7
aliases:
  - '../yaml/building-an-ionic-app'
---

## Setting up an Ionic Capacitor/Cordova project

The apps you have available on Codemagic are listed on the Applications page. See how to add additional apps [here](./adding-apps-from-custom-sources).

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. Select **Ionic App** as the starter workflow.
3. Download the example configuration for Ionic App or copy it to clipboard.
4. Then edit the configuration file to adjust it to your project needs and commit it to the root of your repository.
    * For an overview about using `codemagic.yaml`, please refer [here](./yaml). 
    * Read more about adding configuration for [testing](../testing-yaml/testing), [code signing](../code-signing-yaml/signing) and [publishing](../publishing-yaml/distribution).
    * See the full workflow examples below.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Select workflow from codemagic.yaml** and select the **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Tip**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).

{{</notebox>}}

## Testing, code signing and publishing Ionic Android and iOS apps

To test, code sign and publish Ionic Android and iOS apps:

* The code for testing an Ionic Android app also goes under `scripts`. A few examples of testing can be found [here](../testing-yaml/testing).
* All Android applications need to be signed before release. For Gradle code signing configuration for **Ionic Capacitor** apps refer to the [documentation](../code-signing/android-code-signing/). More information about code signing with YAML in general is [here](../code-signing-yaml/signing). If you are building **Ionic Cordova** Android apps see the workflow sample below.
* All iOS applications need to be signed before release. For iOS code signing configuration refer to the iOS code signing documentation [here](../code-signing/ios-code-signing/)
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../publishing-yaml/distribution/).

## Android Ionic Capacitor workflow example

The following example shows how to set up a workflow that builds your **Ionic Capacitor** Android app and publishes to a Google Play internal track.

```yaml
workflows:
  ionic-capacitor-android-workflow:
    name: Ionic Capacitor Android Workflow
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      vars:
        # Android Keystore environment variables
        FCI_KEYSTORE: Encrypted(...) # <-- Put your encrypted keystore file here
        FCI_KEYSTORE_PASSWORD: Encrypted(...) # <-- Put your encrypted keystore password here
        FCI_KEY_PASSWORD: Encrypted(...) # <-- Put your encrypted keystore alias password here
        FCI_KEY_ALIAS: Encrypted(...) # <-- Put your encrypted keystore alias username here
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
      - name: Install npm dependencies for Ionic Capacitor project
        script: |
          npm install
      - name: Set Android SDK location
        script: |
          echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
      - name: Set up keystore
        script: |
          echo $FCI_KEYSTORE | base64 --decode > /tmp/keystore.keystore
          cat >> "$FCI_BUILD_DIR/android/key.properties" <<EOF
          storePassword=$FCI_KEYSTORE_PASSWORD
          keyPassword=$FCI_KEY_PASSWORD
          keyAlias=$FCI_KEY_ALIAS
          storeFile=/tmp/keystore.keystore
          EOF
      - name: Update dependencies and copy web assets to native project
        script: |
          # npx cap copy # <- use this is you don't need to update native dependencies
          npx cap sync # <- update native dependencies and copy web assets to native project
      - name: Build Android release
        script: |
          cd android
          ./gradlew assembleRelease
    artifacts:
      - android/app/build/outputs/**/*.apk
    publishing:
      google_play:
        credentials: Encrypted(...) # <- Put your encrypted JSON key file for Google Play service account
        track: internal
      email:
        recipients:
          - user_one@example.com
          - user_two@example.com
        notify:
          success: true     # To not receive a notification when a build succeeds
          failure: false     # To not receive a notification when a build fails
```

{{<notebox>}}Note that you should incremenet the versionCode in `android/app/build.gradle`. {{</notebox>}}

Incrementing the version code can be done as follows:

```gradle
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
## Android Ionic Cordova workflow example

The following example shows how to set up a workflow that builds your **Ionic Cordova** Android app and publishes to a Google Play internal track.

```yaml
workflows:
  ionic-cordova-android-workflow:
    name: Ionic Cordova Android Workflow
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      vars:
        # Android Keystore environment variables
        FCI_KEYSTORE: Encrypted(...) # <-- Put your encrypted keystore file here
        FCI_KEYSTORE_PASSWORD: Encrypted(...) # <-- Put your encrypted keystore password here
        FCI_KEY_PASSWORD: Encrypted(...) # <-- Put your encrypted keystore alias password here
        FCI_KEY_ALIAS: Encrypted(...) # <-- Put your encrypted keystore alias username here
        FCI_KEYSTORE_PATH: /tmp/keystore.keystore
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
      - name: Install npm dependencies for Ionic Cordova project and update to Cordova version 9
        script: |
          npm ci # equivalent of npm install for CI systems. Requires package-lock.json or npm-shrinkwrap.json to be present
          cvm install 9.0.0
          cvm use 9.0.0
      - name: Setup Cordova Android platform
        script: |
          ionic cordova platform remove android --nosave
          ionic cordova platform add android --confirm --no-interactive --noresources
      - name: Build Android Cordova App
        script: ionic cordova build android --release --no-interactive --prod --device
      - name: Sign APK
        script: |
          echo $FCI_KEYSTORE | base64 --decode > $FCI_KEYSTORE_PATH
          APK_PATH=$(find platforms/android/app/build/outputs/apk/release -name "*.apk" | head -1)
          jarsigner \
            -sigalg SHA1withRSA \
            -digestalg SHA1 \
            -keystore $FCI_KEYSTORE_PATH \
            -storepass $FCI_KEYSTORE_PASSWORD \
            -keypass $FCI_KEY_PASSWORD \
            $APK_PATH $FCI_KEY_ALIAS
    artifacts:
      - platforms/android/app/build/outputs/**/*.apk
    publishing:
      google_play:
        credentials: Encrypted(...) # <- Put your encrypted JSON key file for Google Play service account
        track: internal
      email:
        recipients:
          - user_one@example.com
          - user_two@example.com
        notify:
          success: true     # To not receive a notification when a build succeeds
          failure: false     # To not receive a notification when a build fails
```

## iOS Ionic Capacitor workflow example

The following example shows a workflow that can be used to publish your **Ionic Capacitor** iOS app to App Store Connect.

```yaml
workflows:
  ionic-capacitor-ios-workflow:
    name: Ionic Capacitor iOS Workflow
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      vars:
        # Ionic Capacitor Xcode worskspace and scheme
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
        # Manual Code Signing
        # FCI_CERTIFICATE: Encrypted(...) # <-- Put your encrypted certificate file here
        # FCI_CERTIFICATE_PASSWORD: Encrypted(...) # <-- Put your encrypted certificate password here
        # FCI_PROVISIONING_PROFILE: Encrypted(...) # <-- Put your encrypted provisioning profile here
        #
        # Automatic Code Signing 
        # https://docs.codemagic.io/yaml/distribution/
        # https://appstoreconnect.apple.com/access/api
        APP_STORE_CONNECT_ISSUER_ID: 5a451239-51eb-10b6-bfcc-60e61ddab13c # <-- Put your App Store Connect Issuer Id here
        APP_STORE_CONNECT_KEY_IDENTIFIER: LY55E1G322 # <-- Put your App Store Connect Key Identifier here
        APP_STORE_CONNECT_PRIVATE_KEY: Encrypted(...) # <-- Put your App Store Connect Private Key here
        CERTIFICATE_PRIVATE_KEY: Encrypted(...) # <-- Put your Certificate Private key here
      node: latest
      xcode: latest
      cocoapods: default
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: develop
          include: true
          source: true
    scripts:
      - name: Install npm dependencies for Ionic project
        script: |
          npm install
      - name: Cocoapods installation
        script: |
          cd ios/App && pod install
      - name: Update dependencies and copy web assets to native project
        script: |
          # npx cap copy # <- use this is you don't need to update native dependencies
          npx cap sync # <- update native dependencies and copy web assets to native project
      - name: Set up keychain to be used for codesigning using Codemagic CLI 'keychain' command
        script: |
          keychain initialize
      # - name: Set up Provisioning profiles from environment variables (Use with manual code signing)
      #   script: |
      #     PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
      #     mkdir -p "$PROFILES_HOME"
      #     PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
      #     echo ${FCI_PROVISIONING_PROFILE} | base64 --decode > "$PROFILE_PATH"
      #     echo "Saved provisioning profile $PROFILE_PATH"
      - name: Fetch signing files
        script: |
          # app-store-connect fetch-signing-files "com.nevercode.ncionicapp" --type IOS_APP_STORE --create
          app-store-connect fetch-signing-files $(xcode-project detect-bundle-id) --type IOS_APP_STORE --create
      - name: Add certificates to keychain
        script: |
          keychain add-certificates
      - name: Increment build number
        script: |
          #!/bin/sh
          set -e
          set -x
          cd $FCI_BUILD_DIR/ios/App
          agvtool new-version -all $(($BUILD_NUMBER +1))
      - name: Set up code signing settings on Xcode project
        script: |
          xcode-project use-profiles
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa --workspace "$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME"
    artifacts:
        - build/ios/ipa/*.ipa
        - /tmp/xcodebuild_logs/*.log
        - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
        - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      app_store_connect:
        apple_id: yourAppleId@example.com # <- put your Apple Id here
        password: Encrypted(...) # <-- Put your App Specific Password. For more information visit: https://support.apple.com/en-us/HT204397
      email:
        recipients:
          - user_one@example.com
          - user_two@example.com
        notify:
          success: false     # To not receive a notification when a build succeeds
          failure: false     # To not receive a notification when a build fails
```

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) CLI command to prepare iOS application code signing properties for build.
{{</notebox>}}

## iOS Ionic Cordova workflow example

The following example shows a workflow that can be used to publish your **Ionic Cordova** iOS app to App Store Connect.

```yaml
workflows:
  ionic-cordova-ios-workflow:
    name: Ionic Cordova iOS Workflow
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      vars:
        # Ionic Xcode worskspace and scheme
        XCODE_WORKSPACE: "platforms/ios/YOUR_APP.xcworkspace" # <- Update with your workspace name
        XCODE_SCHEME: "YOUR_SCHEME" # <- Update with your workspace scheme
        # Manual Code Signing
        # FCI_CERTIFICATE: Encrypted(...) # <-- Put your encrypted certificate file here
        # FCI_CERTIFICATE_PASSWORD: Encrypted(...) # <-- Put your encrypted certificate password here
        # FCI_PROVISIONING_PROFILE: Encrypted(...) # <-- Put your encrypted provisioning profile here
        #
        # Automatic Code Signing 
        # https://docs.codemagic.io/yaml/distribution/
        # https://appstoreconnect.apple.com/access/api
        APP_STORE_CONNECT_ISSUER_ID: 5a451239-51eb-10b6-bfcc-60e61ddab13c # <-- Put your App Store Connect Issuer Id here
        APP_STORE_CONNECT_KEY_IDENTIFIER: LY55E1G322 # <-- Put your App Store Connect Key Identifier here
        APP_STORE_CONNECT_PRIVATE_KEY: Encrypted(...) # <-- Put your App Store Connect Private Key here
        CERTIFICATE_PRIVATE_KEY: Encrypted(...) # <-- Put your Certificate Private key here
      node: latest
      xcode: latest
      cocoapods: default
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: develop
          include: true
          source: true
    scripts:
      - name: Install npm dependencies for Ionic Cordova project and update to Cordova version 9
        script: |
          npm ci # equivalent of npm install for CI systems. Requires package-lock.json or npm-shrinkwrap.json to be present
          cvm install 9.0.0
          cvm use 9.0.0
      - name: Setup Cordova iOS platform
          script: |
            ionic cordova platform remove ios --nosave
            ionic cordova platform add ios --confirm --no-interactive --noresources
      - name: Cocoapods installation
        script: |
          cd platforms/ios && pod install
      - name: Set up keychain to be used for codesigning using Codemagic CLI 'keychain' command
        script: |
          keychain initialize
      # - name: Set up Provisioning profiles from environment variables (Use with manual code signing)
      #   script: |
      #     PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
      #     mkdir -p "$PROFILES_HOME"
      #     PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
      #     echo ${FCI_PROVISIONING_PROFILE} | base64 --decode > "$PROFILE_PATH"
      #     echo "Saved provisioning profile $PROFILE_PATH"
      - name: Fetch signing files
        script: |
          # app-store-connect fetch-signing-files "com.nevercode.ncionicapp" --type IOS_APP_STORE --create
          app-store-connect fetch-signing-files $(xcode-project detect-bundle-id) --type IOS_APP_STORE --create
      - name: Add certificates to keychain
        script: |
          keychain add-certificates
      - name: Increment build number
        script: |
          #!/bin/sh
          set -e
          set -x
          cd $FCI_BUILD_DIR/platforms/ios
          agvtool new-version -all $(($BUILD_NUMBER +1))
      - name: Set up code signing settings on Xcode project
        script: |
          xcode-project use-profiles
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa --workspace "$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      app_store_connect:
        apple_id: yourAppleId@example.com # <- put your Apple Id here
        password: Encrypted(...) # <-- Put your App Specific Password. For more information visit: https://support.apple.com/en-us/HT204397
      email:
        recipients:
          - user_one@example.com
          - user_two@example.com
        notify:
          success: false     # To not receive a notification when a build succeeds
          failure: false     # To not receive a notification when a build fails
```

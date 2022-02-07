---
title: Building an Ionic app 
description: How to build an Ionic Capacitor or Ionic Cordova app with codemagic.yaml
weight: 8
aliases:
  - '../yaml/building-an-ionic-app'
  - /getting-started/building-an-ionic-app
---

## Setting up an Ionic project

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. On the [Applications page](https://codemagic.io/apps), click **Set up build** next to the app you want to start building. 
2. On the popup, select **Ionic App** as the project type and click **Continue**.
3. Create a [`codemagic.yaml`](./yaml) file and add in it the commands to build, test and publish your project. See the full workflow examples below.
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Automatic build triggers**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).
{{</notebox>}}

## Testing, code signing, and publishing Ionic Android and iOS apps

To test, code sign, and publish Ionic Android and iOS apps:

* The code for testing an Ionic Android app also goes under `scripts`. A few examples of testing can be found [here](../testing-yaml/testing).
* All Android apps need to be signed before release. See the [Android code signing docs](../code-signing/android-code-signing/) or the sample workflow below for more details.
* All iOS apps need to be signed before release. See the [iOS code signing docs](../code-signing/ios-code-signing/) or the sample workflow below for more details.
* All generated artifacts can be published to external services. Script examples are available under the [Publishing section](../publishing-yaml/distribution/).

## Android Ionic Capacitor workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml Ionic Android workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/ionic/ionic-capacitor-demo-project/codemagic.yaml#L95).
{{</notebox>}}

The following example shows how to set up a workflow that builds your **Ionic Capacitor** Android app and publishes it to a Google Play internal track.

```yaml
workflows:
  ionic-capacitor-android-workflow:
    name: Ionic Capacitor Android Workflow
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      groups:
        - keystore_credentials # <-- (Includes FCI_KEYSTORE, FCI_KEYSTORE_PASSWORD, FCI_KEY_PASSWORD, FCI_KEY_ALIAS)
        - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS)
        - other
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
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
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/android/local.properties"
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
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal # <-- Any default or custom track that is not in ‘draft’ status
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

The following example shows how to set up a workflow that builds your **Ionic Cordova** Android app and publishes it to a Google Play internal track.

```yaml
workflows:
  ionic-cordova-android-workflow:
    name: Ionic Cordova Android Workflow
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      groups:
        - keystore_credentials # <-- (Includes FCI_KEYSTORE, FCI_KEYSTORE_PASSWORD, FCI_KEY_PASSWORD, FCI_KEY_ALIAS)
        - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS)
        - other
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      vars:
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
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal # <-- Any default or custom track that is not in ‘draft’ status
      email:
        recipients:
          - user_one@example.com
          - user_two@example.com
        notify:
          success: true     # To not receive a notification when a build succeeds
          failure: false     # To not receive a notification when a build fails
```

## iOS Ionic Capacitor workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml Ionic iOS workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/ionic/ionic-capacitor-demo-project/codemagic.yaml#L2).
{{</notebox>}}

The following example shows a workflow that can be used to publish your **Ionic Capacitor** iOS app to App Store Connect.

```yaml
workflows:
  ionic-capacitor-ios-workflow:
    name: Ionic Capacitor iOS Workflow
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      groups:
        # - manual_code_signing # <-- (Includes FCI_CERTIFICATE, FCI_CERTIFICATE_PASSWORD, FCI_PROVISIONING_PROFILE)
        # Automatic Code Signing
        # https://appstoreconnect.apple.com/access/api
        - app_store_credentials # <-- (Includes APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY, CERTIFICATE_PRIVATE_KEY)
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      vars:
        # Ionic Capacitor Xcode worskspace and scheme
        XCODE_WORKSPACE: "platforms/ios/YOUR_APP.xcworkspace" # <- Update with your workspace name
        XCODE_SCHEME: "YOUR_SCHEME" # <- Update with your workspace scheme
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
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
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
          api_key: $APP_STORE_CONNECT_PRIVATE_KEY      # Contents of the API key
          key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER    # Alphanumeric value that identifies the API key
          issuer_id: $APP_STORE_CONNECT_ISSUER_ID      # Alphanumeric value that identifies who created the API key
          submit_to_testflight: true        # Optional boolean, defaults to false. Whether or not to submit the uploaded build to TestFlight to automatically enroll your build to beta testers.  
      email:
        recipients:
          - user_one@example.com
          - user_two@example.com
        notify:
          success: false     # To not receive a notification when a build succeeds
          failure: false     # To not receive a notification when a build fails
```

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) CLI command to prepare iOS application code signing properties for the build.
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
      groups:
        # - manual_code_signing # <-- (Includes FCI_CERTIFICATE, FCI_CERTIFICATE_PASSWORD, FCI_PROVISIONING_PROFILE)
        # Automatic Code Signing
        # https://appstoreconnect.apple.com/access/api
        - app_store_credentials # <-- (Includes APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY, CERTIFICATE_PRIVATE_KEY)
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      vars:
        XCODE_WORKSPACE: "YOUR_WORKSPACE_NAME.xcworkspace" # <-- Put the name of your Xcode workspace here
        XCODE_SCHEME: "YOUR_SCHEME_NAME" # <-- Put the name of your Xcode scheme here        
        BUNDLE_ID: "YOUR_BUNDLE_ID_HERE" # <-- Put your Bundle Id here
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
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
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
          api_key: $APP_STORE_CONNECT_PRIVATE_KEY      # Contents of the API key
          key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER    # Alphanumeric value that identifies the API key
          issuer_id: $APP_STORE_CONNECT_ISSUER_ID      # Alphanumeric value that identifies who created the API key
          submit_to_testflight: true        # Optional boolean, defaults to false. Whether or not to submit the uploaded build to TestFlight to automatically enroll your build to beta testers. 
      email:
        recipients:
          - user_one@example.com
          - user_two@example.com
        notify:
          success: false     # To not receive a notification when a build succeeds
          failure: false     # To not receive a notification when a build fails
```

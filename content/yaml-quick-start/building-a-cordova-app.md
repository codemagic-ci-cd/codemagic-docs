---
title: Cordova apps
description: How to build a Cordova app with codemagic.yaml
weight: 9
aliases: /getting-started/building-a-cordova-app
---

## Setting up a Cordova project

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. On the [Applications page](https://codemagic.io/apps), click **Set up build** next to the app you want to start building. 
2. On the popup, select **Cordova** as the project type and click **Continue**.
3. Create a [`codemagic.yaml`](./yaml) file and add in it the commands to build, test and publish your project. See the full workflow examples below.
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Automatic build triggers**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggers. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).

{{</notebox>}}

## Code signing and publishing Cordova Android and iOS apps

To build, code sign, and publish Cordova Android and iOS apps:

* All Android apps need to be signed before release. See the [Android code signing docs](../code-signing/android-code-signing/) or the sample workflow below for more details.
* All iOS apps need to be signed before release. See the [iOS code signing docs](../code-signing/ios-code-signing/) or the sample workflow below for more details.
* All generated artifacts can be published to external services, such as email, Slack, and Google Play. The list of available integrations and script examples can be found under the [Publishing section](../publishing-yaml/distribution/).


## Cordova iOS workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml Cordova iOS workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/cordova/cordova-demo-project/codemagic.yaml#L2).
{{</notebox>}}

The following example workflow shows how to build your **Cordova** iOS app and publish it to App Store Connect.

```yaml
workflows:
  ios-workflow:
    name: iOS workflow
    environment:
      groups:
        - app_store_credentials # <-- Includes APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY, CERTIFICATE_PRIVATE_KEY
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      vars:
        XCODE_WORKSPACE: "YOUR_WORKSPACE_NAME.xcworkspace" # <-- Put the name of your Xcode workspace here e.g. "platforms/ios/HelloCordova.xcworkspace"
        XCODE_SCHEME: "YOUR_SCHEME_NAME" # <-- Put the name of your Xcode scheme here e.g. "HelloCordova"       
        BUNDLE_ID: "YOUR_BUNDLE_ID_HERE" # <-- Put your Bundle Id here e.g. "io.codemagic.cordova"
      xcode: 12.4
      node: 12
      npm: 6
    cache:
      cache_paths:
        - $CM_BUILD_DIR/node_modules
    scripts:
      - name: Install dependencies
        script: |
          npm install
          npm ci
          cvm install 9.0.0
          cvm use 9.0.0
      - name: Setup iOS
        script: |
          cordova platform remove ios --nosave
          cordova platform add ios --confirm --no-interactive --noresources --save  
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: |
          keychain initialize
      - name: Fetch signing files
        script: |
          app-store-connect fetch-signing-files $BUNDLE_ID --type IOS_APP_STORE --create
      - name: Add certificates to keychain
        script: |
          keychain add-certificates         
      - name: Set up code signing settings on Xcode project
        script: |
          xcode-project use-profiles
      - name: Build iOS
        script: |
          package_type=$(defaults read ~/export_options.plist method)
          identity=$(defaults read ~/export_options.plist signingCertificate)
          team=$(defaults read ~/export_options.plist teamID)
          profile=$(find '/Users/builder/Library/MobileDevice/Provisioning Profiles' -name "*.mobileprovision")
          profile_uuid=$(grep UUID -A1 -a "$profile" | grep -io "[-A-F0-9]\{36\}")

          cat <<EOF > build.json
              {
                "ios": {
                  "release": {
                    "codeSignIdentity": "$identity",
                    "developmentTeam": "$team",
                    "packageType": "$package_type",
                    "provisioningProfile": "$profile_uuid"
                  }
                }
              }
          EOF
          cordova build ios --release --device --buildConfig='build.json' 
    artifacts:
      - /Users/builder/clone/platforms/ios/build/device/*.ipa
      - /tmp/xcodebuild_logs/*.log
    publishing:
      # See the following link for details about email publishing - https://docs.codemagic.io/yaml-publishing/email
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true     # To receive a notification when a build succeeds
          failure: false    # To not receive a notification when a build fails
      slack:
        # See the following link about how to connect your Slack account - https://docs.codemagic.io/yaml-publishing/slack
        channel: '#channel-name'
        notify_on_build_start: true   # To receive a notification when a build starts
        notify:
          success: true               # To receive a notification when a build succeeds
          failure: false              # To not receive a notification when a build fails
      app_store_connect:
          api_key: $APP_STORE_CONNECT_PRIVATE_KEY      # Contents of the API key
          key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER    # Alphanumeric value that identifies the API key
          issuer_id: $APP_STORE_CONNECT_ISSUER_ID      # Alphanumeric value that identifies who created the API key
          submit_to_testflight: true        # Optional boolean, defaults to false. Whether or not to submit the uploaded build to TestFlight to automatically enroll your build to beta testers.   
```

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) CLI command to prepare iOS application code signing properties for the build.
{{</notebox>}}

## Android Cordova workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml Cordova Android workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/cordova/cordova-demo-project/codemagic.yaml#L87).
{{</notebox>}}

The following example workflow shows how to build your **Cordova** Android app and publish it to a Google Play alpha track.

```yaml
workflows:
  android-workflow:
    name: Android Cordova workflow
    environment:
      groups:
        - keystore_credentials # <-- Includes KEYSTORE, KEYSTORE_PASSWORD, KEY_ALIAS_PASSWORD, KEY_ALIAS
        - google_play # <-- Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS - Store your google-services.json
        - other
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      vars:
        KEYSTORE_PATH: '/tmp/keystore.keystore'
      xcode: 12.4
      node: 12
      npm: 6
    cache:
      cache_paths:
        - $CM_BUILD_DIR/node_modules
    scripts:
      - name: Install dependencies
        script: |
          npm install
          npm ci
          cvm install 9.0.0
          cvm use 9.0.0        
      - name: Add Android platform
        script: |
          set -x
          cordova platform remove android --nosave
          cordova platform add android --confirm --no-interactive --noresources
      - name: Build Android
        script: |
          set -x
          set -e
          cordova build android --release --no-interactive --prod --device
          echo $KEYSTORE | base64 --decode > $KEYSTORE_PATH
          UNSIGNED_APK_PATH=$(find platforms/android/app/build/outputs -name "*.apk" | head -1)
          jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore "${KEYSTORE_PATH}" -storepass "${KEYSTORE_PASSWORD}" -keypass "${KEY_ALIAS_PASSWORD}" "${UNSIGNED_APK_PATH}" "${KEY_ALIAS}"
          mv $UNSIGNED_APK_PATH $(echo $UNSIGNED_APK_PATH | sed 's/-unsigned//')
    artifacts:
      - platforms/android/app/build/outputs/**/*.apk
      - platforms/android/app/build/outputs/**/mapping.txt
    publishing:
      # See the following link for details about email publishing - https://docs.codemagic.io/yaml-publishing/email
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true     # To receive a notification when a build succeeds
          failure: false    # To not receive a notification when a build fails
      slack:
        # See the following link about how to connect your Slack account - https://docs.codemagic.io/yaml-publishing/slack
        channel: '#channel-name'
        notify_on_build_start: true   # To receive a notification when a build starts
        notify:
          success: true               # To receive a notification when a build succeeds
          failure: false              # To not receive a notification when a build fails
      google_play:
        # See the following link for information regarding publishing to Google Play - https://docs.codemagic.io/yaml-publishing/google-play
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: alpha # <-- Any default or custom track that is not in ‘draft’ status
```


---
title: Building a KMM app 
description: How to build a Kotlin Multiplatform Mobile app with codemagic.yaml
weight: 8
---

## Setting up a KMM project

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. On the [Applications page](https://codemagic.io/apps), click **Set up build** next to the app you want to start building. 
2. On the popup, select **Other** as the project type and click **Continue**.
3. Create a [`codemagic.yaml`](./yaml) file and add in it the commands to build, test and publish your project. See the full workflow examples below.
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Automatic build triggers**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).
{{</notebox>}}

## Code signing, building, and publishing KMM Android and iOS apps

To code sign, build, and publish KMM Android and iOS apps:

* All Android apps need to be signed before release. See the [Android code signing docs](../code-signing/android-code-signing/) or the sample workflow below for more details.
* All iOS apps need to be signed before release. See the [iOS code signing docs](../code-signing/ios-code-signing/) or the sample workflow below for more details.
* All generated artifacts can be published to external services. Script examples are available under the [Publishing section](../publishing-yaml/distribution/).

## Android KMM workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml KMM Android workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/kotlin-multiplatform-mobile/codemagic.yaml#L2).
{{</notebox>}}

The following example shows how to set up a workflow that builds your **KMM** Android app and publishes it to a Google Play internal track.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-kmm-workflow:
    name: Android KMM Workflow
    max_build_duration: 120
    instance_type: mac_pro
    environment:
      groups:
        # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
        - codemagic_kmm # <-- Includes - CM_KEYSTORE, CM_KEYSTORE_PASSWORD, CM_KEY_PASSWORD, CM_KEY_ALIAS
        - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS - Put your google-services.json here)
      # android_signing:
      #   - codemagic_kmm
      vars:
        PACKAGE_NAME: "com.codemagickmm.android" # <-- Use your package name
    scripts:
      - name: Set up key.properties file for code signing
        script: |  
          # You need to comment the following line if you're using the Code Signing Identities to sign your android app
          echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
          # The following script creates key.properties file and stores the credentials in it. As we configure code signing in androidApp/build.gradle.kts file, the following part is unnecessary unless code signing is configured differently as explained in the documentation: https://docs.codemagic.io/flutter-code-signing/android-code-signing/
          # cat >> "$CM_BUILD_DIR/key.properties" <<EOF
          # storePassword=$CM_KEYSTORE_PASSWORD
          # keyPassword=$CM_KEY_PASSWORD
          # keyAlias=$CM_KEY_ALIAS
          # storeFile=$CM_KEYSTORE_PATH
          # EOF
      - name: Build aab Android app
        script: |  
          chmod +x gradlew
          export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks=internal) + 1))
          ./gradlew bundleRelease # To generate an .apk use--> ./gradlew assembleRelease
    artifacts:
      - androidApp/build/outputs/**/**/*.aab
      - androidApp/build/outputs/**/**/*.apk
    publishing:
      google_play: # For Android app
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS # Contents of the JSON key file for Google Play service account saved as a secure environment variable
        track: internal # Name of the track internal, alpha, beta, production, internal app sharing, or your custom track name
        # in_app_update_priority: 3 # Optional Priority of the release (only set if in-app updates are supported): integer in range [0, 5]
        # rollout_fraction: 0.25 # Optional. Rollout fraction (set only if releasing to a fraction of users): value between (0, 1)
        changes_not_sent_for_review: false # Optional boolean To be used ONLY if your app cannot be sent for review automatically *
        submit_as_draft: true # Optional boolean. Publish artifacts under a draft release. Can not be used together with rollout_fraction. Defaults to false
{{< /highlight >}}

{{<notebox>}}Note that you should increment the versionCode in `androidApp/build.gradle.kts`. {{</notebox>}}

Incrementing the version code can be done as follows:

{{< highlight groovy "style=paraiso-dark">}}

android {
    ...
    val appVersionCode = (System.getenv()["NEW_BUILD_NUMBER"] ?: "1")?.toInt()
    defaultConfig {
        ...
        versionCode = appVersionCode
        ...
    }
}
{{< /highlight >}}

## iOS KMM workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml KMM iOS workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/kotlin-multiplatform-mobile/codemagic.yaml#L50).
{{</notebox>}}

{{<notebox>}}
Follow the [docs](https://kotlinlang.org/docs/multiplatform-mobile-integrate-in-existing-app.html#make-your-code-cross-platform) to make your IOS app use the cross-platform code.
{{</notebox>}}

The following example shows a workflow that can be used to publish your **KMM** iOS app to App Store Connect.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-kmm-workflow:
    name: iOS Workflow
    instance_type: mac_pro
    max_build_duration: 120
    environment:
      groups:
        # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
        - app_store_credentials # <-- (Includes APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY)
        - certificate_credentials # <-- (Includes CERTIFICATE_PRIVATE_KEY - Put your Certificate Private Key here)
      vars:
        XCODE_PROJECT: "iosApp.xcodeproj" # <-- Put your xcode project name here
        XCODE_SCHEME: "iosApp" # <-- Put your bundle xcode scheme here
        BUNDLE_ID: "com.codemagickmm.iosapp" # <-- Put your bundle id here
        APP_STORE_ID: 1630136022 # <-- Use the TestFlight Apple id number (An automatically generated ID assigned to your app) found under General > App Information > Apple ID.
      xcode: latest
    scripts:
      - name: Set up keychain to be used for codesigning using Codemagic CLI 'keychain' command
        script: | 
          keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files $BUNDLE_ID --type IOS_APP_STORE --create
      - name: Use system default keychain
        script: | 
          keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: | 
          cd $CM_BUILD_DIR/iosApp
          xcode-project use-profiles
      - name: Increment build number
        script: | 
          cd $CM_BUILD_DIR/iosApp
          agvtool new-version -all $(($(app-store-connect get-latest-testflight-build-number "$APP_STORE_ID") + 1))
      - name: Build ipa for distribution
        script: | 
          cd $CM_BUILD_DIR/iosApp
          xcode-project build-ipa --project $XCODE_PROJECT --scheme $XCODE_SCHEME
    artifacts:
      - iosApp/build/ios/ipa/*.ipa
    publishing:
      app_store_connect: # https://docs.codemagic.io/publishing-yaml/distribution
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY # Contents of the API key, can also reference environment variable such as $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER # Alphanumeric value that identifies the API key, can also reference environment variable such as $APP_STORE_CONNECT_KEY_IDENTIFIER
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID # Alphanumeric value that identifies who created the API key, can also reference environment variable such as $APP_STORE_CONNECT_ISSUER_ID
        submit_to_testflight: false # Optional boolean, defaults to false. Whether or not to submit the uploaded build to TestFlight beta review. Required for distributing to beta groups. Note: This action is performed during post-processing.
{{< /highlight >}}

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) CLI command to prepare iOS application code signing properties for the build.
{{</notebox>}}

---
title: Ionic Cordova apps
description: How to build a Ionic Cordova app with codemagic.yaml
weight: 8
aliases: /getting-started/building-a-cordova-app
---

This guide will illustrate all of the necessary steps to successfully build and publish a Ionic Cordova app with Codemagic. It will cover the basic steps such as code signing and publishing.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/ionic/ionic-cordova-demo-project).

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

{{<notebox>}}
**Note**: This guide is written specifically for users who wish to use the **Code Signing Identities** feature. If you want to use use alternative Code signing methods, please check the [Code signing without identities](../yaml-code-signing/code-signing-without-identities) guide.
{{</notebox>}}

{{< tabpane >}}
{{< tab header="Android" >}}
{{< include "/partials/quickstart/code-signing-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/quickstart/code-signing-ios.md" >}}
{{< /tab >}}
{{< /tabpane >}}


## Configure scripts to build the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).

{{< tabpane >}}
{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install npm dependencies and update Cordova version
      script: | 
        npm install
        npm ci # equivalent of npm install for CI systems.
               # Requires package-lock.json or npm-shrinkwrap.json to be present
        cvm install 9.0.0
        cvm use 9.0.0 
    - name: Setup Cordova Android platform
      script: | 
        ionic cordova platform remove android --nosave
        ionic cordova platform add android \
          --confirm \
          --no-interactive \
          --noresources 
    - name: Build Android Cordova App
      script: | 
        ionic cordova build android \
          --release \
          --no-interactive \
          --prod \
          --device
    - name: Sign APK
      script: | 
        APK_PATH=$(find platforms/android/app/build/outputs/apk/release -name "*.apk" | head -1)
        jarsigner \
          -sigalg SHA1withRSA \
          -digestalg SHA1 \
          -keystore $CM_KEYSTORE_PATH \
          -storepass $CM_KEYSTORE_PASSWORD \
          -keypass $CM_KEY_PASSWORD \
          $APK_PATH $CM_KEY_ALIAS         
  artifacts:
    - platforms/android/app/build/outputs/**/*.apk
{{< /highlight >}}
{{< /tab >}}


{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  environments:
    vars:
      XCODE_WORKSPACE: "platforms/ios/YOUR_APP.xcworkspace"
      XCODE_SCHEME: "YOUR_SCHEME"
  scripts:
    - name: Install npm dependencies and update Cordova version
      script: | 
        npm install
        npm ci # equivalent of npm install for CI systems.
               # Requires package-lock.json or npm-shrinkwrap.json to be present
        cvm install 9.0.0
        cvm use 9.0.0
    -  name: Setup Cordova iOS platform
       script: | 
         ionic cordova platform remove ios --nosave
         ionic cordova platform add ios \
           --confirm \
           --no-interactive \
           --noresources
    - name: Cocoapods installation
        script: | 
          cd platforms/ios && pod install
    - name: Update dependencies and copy web assets to native project
      script: | 
        # if you don't need to update native dependencies, use this:
        # npx cap copy
        #
        # to update native dependencies, use this command:
        npx cap sync
    - name: Set up code signing settings on Xcode project
      script: | 
        xcode-project use-profiles
    - name: Build ipa for distribution
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
          }EOF
        cordova build ios --release --device --buildConfig='build.json'
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}

## Publishing

{{< include "/partials/publishing-android-ios.md" >}}


## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the app in the Codemagic UI and start the build to see it in action.

Your final `codemagic.yaml` file should look something like this:

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    name: Ionic Cordova Android Workflow
    max_build_duration: 120
    environment:
      android_signing:
        - keystore_reference
      groups:
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.ionicsample"
        GOOGLE_PLAY_TRACK: alpha
      node: latest
    scripts:
      - name: Install npm dependencies and update Cordova version
        script: | 
          npm install
          npm ci # equivalent of npm install for CI systems.
            # Requires package-lock.json or npm-shrinkwrap.json to be present
          cvm install 9.0.0
          cvm use 9.0.0 
      - name: Setup Cordova Android platform
        script: | 
          ionic cordova platform remove android --nosave
          ionic cordova platform add android \
            --confirm \
            --no-interactive \
            --noresources 
      - name: Build Android Cordova App
        script: | 
          ionic cordova build android \
            --release \
            --no-interactive \
            --prod \
            --device
    - name: Sign APK
      script: | 
        APK_PATH=$(find platforms/android/app/build/outputs/apk/release -name "*.apk" | head -1)
        jarsigner \
          -sigalg SHA1withRSA \
          -digestalg SHA1 \
          -keystore $CM_KEYSTORE_PATH \
          -storepass $CM_KEYSTORE_PASSWORD \
          -keypass $CM_KEY_PASSWORD \
          $APK_PATH $CM_KEY_ALIAS         
    artifacts:
      - platforms/android/app/build/outputs/**/*.apk
    publishing:
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    max_build_duration: 120
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.ionicsample
      vars:
        APP_ID: 1555555551
        XCODE_WORKSPACE: "platforms/ios/YOUR_APP.xcworkspace"
        XCODE_SCHEME: "YOUR_SCHEME"
    scripts:
      - name: Install npm dependencies and update Cordova version
        script: | 
          npm install
          npm ci # equivalent of npm install for CI systems.
            # Requires package-lock.json or npm-shrinkwrap.json to be present
          cvm install 9.0.0
          cvm use 9.0.0
      -  name: Setup Cordova iOS platform
         script: | 
           ionic cordova platform remove ios --nosave
           ionic cordova platform add ios \
             --confirm \
             --no-interactive \
             --noresources
      - name: Cocoapods installation
        script: | 
          cd platforms/ios && pod install
      - name: Update dependencies and copy web assets to native project
        script: | 
          # if you don't need to update native dependencies, use this:
          # npx cap copy
          #
          # to update native dependencies, use this command:
          npx cap sync
      - name: Set up code signing settings on Xcode project
        script: | 
          xcode-project use-profiles
      - name: Build ipa for distribution
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
          }EOF
          cordova build ios --release --device --buildConfig='build.json'
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      app_store_connect:
        auth: integration

        # Configuration related to TestFlight (optional)
        # Note: This action is performed during post-processing.
        submit_to_testflight: true
        beta_groups: # Specify the names of beta tester groups that will get access to the build once it has passed beta review.
          - group name 1
          - group name 2

        # Configuration related to App Store (optional)
        # Note: This action is performed during post-processing.
        submit_to_app_store: false
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}


## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}
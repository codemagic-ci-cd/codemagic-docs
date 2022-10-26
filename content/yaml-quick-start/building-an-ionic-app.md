---
title: Ionic Capacitor apps 
description: How to build a Ionic Capacitor app with codemagic.yaml
weight: 8
aliases:
  - '../yaml/building-an-ionic-app'
  - /getting-started/building-an-ionic-app
---

This guide will illustrate all of the necessary steps to successfully build and publish a Ionic Capacitor app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/ionic/ionic-capacitor-demo-project).

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

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
    - name: Install npm dependencies for Ionic Capacitor project
      script: | 
        npm install
    - name: Set up local.properties
      script: | 
        echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
    - name: Update dependencies and copy web assets to native project
      script: | 
        # if you don't need to update native dependencies, use this:
        # npx cap copy
        #
        # to update native dependencies, use this command:
        npx cap sync
    - name: Build Android release
      script: | 
        cd android
        ./gradlew assembleRelease
  artifacts:
    - android/app/build/outputs/**/*.apk
{{< /highlight >}}
{{< /tab >}}


{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  environments:
    vars:
      XCODE_WORKSPACE: "platforms/ios/YOUR_APP.xcworkspace"
      XCODE_SCHEME: "YOUR_SCHEME"
  scripts:
    - name: Install npm dependencies for Ionic Capacitor project
      script: | 
        npm install
    - name: Cocoapods installation
        script: | 
          cd ios/App && pod install
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
          cd ios/App
          xcode-project build-ipa --workspace "$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}


## Build versioning

If you are going to publish your app to App Store Connect or Google Play, each uploaded artifact must have a new version satisfying each app store’s requirements. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).


{{< tabpane >}}
{{< tab header="Android" >}}
{{< include "/partials/quickstart/build-versioning-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/quickstart/build-versioning-ios.md" >}}
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
    name: Ionic Capacitor Android Workflow
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
      - name: Install npm dependencies for Ionic Capacitor project
        script: | 
          npm install
      - name: Set up local.properties
        script: | 
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      - name: Update dependencies and copy web assets to native project
        script: | 
          # if you don't need to update native dependencies, use this:
          # npx cap copy
          #
          # to update native dependencies, use this command:
          npx cap sync
      - name: Build Android release
        script: | 
          LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
          if [ -z LATEST_BUILD_NUMBER ]; then
            # fallback in case no build number was found from Google Play.
            # Alternatively, you can `exit 1` to fail the build
            # BUILD_NUMBER is a Codemagic built-in variable tracking the number
            # of times this workflow has been built
            UPDATED_BUILD_NUMBER=$BUILD_NUMBER
          else
            UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
          fi
          cd android
          ./gradlew bundleRelease \
            -PversionCode=$UPDATED_BUILD_NUMBER \
            -PversionName=1.0.$UPDATED_BUILD_NUMBER
    artifacts:
      - android/app/build/outputs/**/*.apk
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
      - name: Install npm dependencies for Ionic Capacitor project
        script: | 
          npm install
      - name: Cocoapods installation
        script: | 
          cd ios/App && pod install
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
      - name: Increment build number
        script: | 
          cd $CM_BUILD_DIR
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "$APP_ID")
          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
      - name: Build ipa for distribution
        script: | 
          cd ios/App
          xcode-project build-ipa --workspace "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
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

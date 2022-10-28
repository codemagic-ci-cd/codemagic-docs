---
title: KMM apps
description: How to build a Kotlin Multiplatform Mobile app with codemagic.yaml
weight: 9
---

This guide will illustrate all of the necessary steps to successfully build and publish a Kotlin Multiplatform Mobile app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/kotlin-multiplatform-mobile).


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

# Configure scripts to build the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).

{{< tabpane >}}
{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build Android release
      script: | 
        ./gradlew assembleRelease
  artifacts:
    - androidApp/build/outputs/**/**/*.aab
{{< /highlight >}}
{{< /tab >}}


{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  environments:
    vars:
      XCODE_WORKSPACE: "YOUR_APP.xcworkspace"
      XCODE_SCHEME: "YOUR_SCHEME"
  scripts:
    - name: Cocoapods installation
        script: | 
          cd $CM_BUILD_DIR/iosApp
          pod install
    - name: Set up code signing settings on Xcode project
      script: | 
        xcode-project use-profiles
    - name: Build ipa for distribution
      script: | 
          cd $CM_BUILD_DIR/iosApp
          xcode-project build-ipa \
            --workspace "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - iosApp/build/ios/ipa/*.ipa
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
    name: KMM Android Workflow
    max_build_duration: 120
    environment:
      android_signing:
        - keystore_reference
      groups:
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.kmmsample"
        GOOGLE_PLAY_TRACK: alpha
    scripts:
      - name: Build Android release
        script: | 
          LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
          if [ -z LATEST_GOOGLE_PLAY_BUILD_NUMBER ]; then
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
      - androidApp/build/outputs/**/**/*.aab
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
    name: KMM iOS Workflow
    max_build_duration: 120
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.kmmsample
      vars:
        APP_ID: 1555555551
        XCODE_WORKSPACE: "platforms/ios/YOUR_APP.xcworkspace"
        XCODE_SCHEME: "YOUR_SCHEME"
    scripts:
      - name: Cocoapods installation
        script: | 
          cd $CM_BUILD_DIR/iosApp
          pod install
      - name: Set up code signing settings on Xcode project
        script: | 
          xcode-project use-profiles
      - name: Increment build number
        script: | 
          cd $CM_BUILD_DIR/iosApp
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "$APP_ID")
          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
      - name: Build ipa for distribution
        script: | 
          cd $CM_BUILD_DIR/iosApp
          xcode-project build-ipa \
            --workspace "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - iosApp/build/ios/ipa/*.ipa
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

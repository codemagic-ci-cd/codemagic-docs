---
title: iOS native apps
description: How to build an iOS app with codemagic.yaml
weight: 3
aliases:
  - '/yaml/building-a-native-ios-app'
  - /getting-started/building-a-native-ios-app
  - /yaml-basic-configuration/building-a-native-ios-app
---

This guide will illustrate all of the necessary steps to successfully build and publish a native iOS app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/ios/ios-automatic-code-signing-demo-project).


## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

{{<notebox>}}
**Note**: This guide is written specifically for users with `Team accounts`. If you are a `Personal account` user, please check the [Code signing for Personal accounts](../yaml-code-signing/code-signing-personal) guide.
{{</notebox>}}

{{< include "/partials/quickstart/code-signing-ios.md" >}}

## Configure scripts to build the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).


{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  environment:
    groups:
      # ...
    vars:
      BUNDLE_ID: "io.codemagic.sample.iosnative"
      XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Name of your Xcode workspace
      XCODE_SCHEME: "CodemagicSample" # <-- Name of your Xcode scheme
scripts:
  # ...
  - name: Build ipa for distribution
    script: | 
      xcode-project build-ipa \
        --workspace "$CM_BUILD_DIR/$XCODE_WORKSPACE" \
        --scheme "$XCODE_SCHEME"
artifacts:
  - build/ios/ipa/*.ipa
  - /tmp/xcodebuild_logs/*.log
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}

{{<notebox>}}
**Note**: If you don't have a workspace, use `--project "MyXcodeProject.xcodeproj"` instead of the `--workspace "MyXcodeWorkspace.xcworkspace"` option.
{{</notebox>}}


## Build versioning

If you are going to publish your app to App Store, each uploaded artifact must have a new version. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).

### Configure environment variables

{{< include "/partials/quickstart/publish-ios-environment-variables.md">}}

{{< include "/partials/quickstart/build-versioning-ios.md" >}}

## Publishing

Codemagic offers a wide array of options for app publishing and the list of partners and integrations is continuously growing. For the most up-to-date information, check the guides in the **Configuration > Publishing** section of these docs.
To get more details on the publishing options presented in this guide, please check the [Email publishing](../yaml-publishing/email) and the [App Store Connect](../yaml-publishing/app-store-connect) publishing docs.

#### Email publishing
{{< include "/partials/quickstart/publishing-email.md" >}}

#### Publishing to App Store
{{< include "/partials/quickstart/publishing-app-store.md" >}}


## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the App in Codemagic UI and start the build to see it in action.


Your final `codemagic.yaml` file should look something like this:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-native-workflow:
    name: iOS Native
    max_build_duration: 120
    instance_type: mac_mini_m1
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.sample.iosnative
      groups:
        - appstore_credentials
      vars:
        BUNDLE_ID: "io.codemagic.sample.iosnative"
        XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Put the name of your Xcode workspace here
        XCODE_SCHEME: "CodemagicSample" # <-- Put the name of your Xcode scheme here
        APP_ID: 1555555551
      xcode: latest
      cocoapods: default
    scripts:
      - name: Install CocoaPods dependencies
        script: | 
          pod install
      - name: Set up provisioning profiles settings on Xcode project
        script: xcode-project use-profiles
      - name: Increment build number
        script: | 
          cd $CM_BUILD_DIR
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "$APP_ID")
          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
      - name: Build ipa for distribution
        script: | 
          xcode-project build-ipa \
            --workspace "$CM_BUILD_DIR/$XCODE_WORKSPACE" \
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
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID

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

## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}

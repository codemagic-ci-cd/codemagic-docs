---
title: iOS native apps
description: How to build an iOS app with codemagic.yaml
weight: 3
aliases:
  - '../yaml/building-a-native-ios-app'
  - /getting-started/building-a-native-ios-app
---

## Setting up an iOS project

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. On the popup, select **iOS App** as the project type and click **Continue**.
3. Create a [`codemagic.yaml`](./yaml) file and add in it the commands to build, test and publish your project. See the full iOS workflow example [below](#ios-workflow-example).
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Tip**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).

{{</notebox>}}

## Building an unsigned native iOS app (.app)

For building an unsigned iOS app (.app), you need to run the following command in the scripts section:

```yaml
- xcodebuild build -workspace "MyXcodeWorkspace.xcworkspace" -scheme "MyScheme" CODE_SIGN_INDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO
```

If you don't have a workspace, use `-project "MyXcodeProject.xcodeproj"` instead of the `-workspace "MyXcodeWorkspace.xcworkspace"` option.

Your artifact will be generated at the default Xcode path. You can access it by adding the following pattern in the `artifacts` section of `codemagic.yaml`:

```yaml
$HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
```
If you have Xcode Debugging Symbols enabled, the dSYM file will be generated in the same directory as the app and can be accessed with the following artifact pattern:

```yaml
$HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
```
Configuring the yaml file like the following creates a zip file and **.app** inside it:

```yaml
workflows:
    simulator-native-ios:
        name: iOS simulator build
        max_build_duration: 120
        instance_type: mac_mini
        environment:
            vars:
               XCODE_WORKSPACE: "your_workspace_name.xcworkspace" # <-- Put the name of your Xcode workspace here
               XCODE_SCHEME: "your_workspace_name" # <-- Put the name of your Xcode scheme here
            xcode: 13.0
            cocoapods: default
        scripts:
            - name: Install CocoaPods dependencies
              script: |
                pod install
            - name: Build ipa for distribution
              script: |
                xcodebuild build -workspace "$XCODE_WORKSPACE" -scheme "$XCODE_SCHEME" -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 12 Pro,OS=15.4' -configuration Debug CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO 
        artifacts:
            - /tmp/xcodebuild_logs/*.log
            - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
            - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM

```

## Building a native iOS app archive (.ipa)

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

For building an archived iOS app (.ipa) from your Xcode project, you need to run the following command in the scripts section:

```yaml
- xcode-project build-ipa --project "MyXcodeProject.xcodeproj" --scheme "MyScheme"
```

You can also build an archive from your Xcode workspace:

```yaml
- xcode-project build-ipa --workspace "MyXcodeWorkspace.xcworkspace" --scheme "MyScheme"
```

Please check [Codemagic CLI tools documentation](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/build-ipa.md#build-ipa) to learn about more optional arguments to `xcode-project build-ipa`.

By default, your artifacts will be generated into `build/ios/ipa` but you can specify a different location using the [`--ipa-directory`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/build-ipa.md#--ipa-directoryipa_directory) option. The Xcode build log can be made available with the `/tmp/xcodebuild_logs/*.log` pattern and the dSYM file will be still available at the default Xcode path.

```yaml
artifacts:
  - build/ios/ipa/*.ipa
  - /tmp/xcodebuild_logs/*.log
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
```

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}} 

## Testing, code signing and publishing an iOS app

To test, code sign and publish an iOS app:

* The code for testing an iOS app also goes under `scripts`, before build commands. An example for testing an iOS app can be found [here](../yaml-testing/testing/#native-ios).
* All iOS applications need to be signed before release. A full example of iOS code singing with YAML is available [here](../code-signing-yaml/signing-ios).
* All generated artifacts can be published to external services. Script examples are available under the [Publishing section](../publishing-yaml/distribution/).

## iOS workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml iOS workflow in Codemagic Sample Projects for [automatic code signing](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/ios/ios-automatic-code-signing-demo-project/codemagic.yaml) and [manual code signing](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/ios/ios-manual-code-signing-demo-project/codemagic.yaml).
{{</notebox>}}

The following example shows a workflow that can be used to publish your iOS app to App Store Connect.

```yaml
workflows:
  ios-workflow:
    name: ios_workflow
    environment:
      groups:
        - app_store_credentials # <-- (Includes APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY, CERTIFICATE_PRIVATE_KEY)
        - ios_config # <-- (Includes APP_STORE_APP_ID)
       # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      vars:
        XCODE_WORKSPACE: "YOUR_WORKSPACE_NAME.xcworkspace"  # PUT YOUR WORKSPACE NAME HERE
        XCODE_SCHEME: "YOUR_SCHEME_NAME" # PUT THE NAME OF YOUR SCHEME HERE
      xcode: latest
      cocoapods: default
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: master
          include: true
          source: true
    scripts:
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: |
          keychain initialize
      - name: Fetch signing files
        script: |
          app-store-connect fetch-signing-files $(xcode-project detect-bundle-id) --type IOS_APP_STORE --create
      - name: Add certificates to keychain
        script: |
          keychain add-certificates 
      - name: Increment build number
        script: agvtool new-version -all $(($BUILD_NUMBER +1))
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
      - name: Build ipa for distribution
        script: xcode-project build-ipa --workspace "$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      app_store_connect:
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY      # Contents of the API key
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER    # Alphanumeric value that identifies the API key
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID      # Alphanumeric value that identifies who created the API key
        submit_to_testflight: false        # Optional boolean, defaults to false. Whether or not to submit the uploaded build to TestFlight to automatically enroll your build to beta testers.
      # beta_groups:                                  # Specify the names of beta tester groups that will get access to the build once it has passed beta review. 
      #     - group name 1
      #     - group name 2
 
```

---
title: Building a native iOS app
description: How to build an iOS app with codemagic.yaml
weight: 5
aliases:
  - '../yaml/building-a-native-ios-app'
---

## Setting up an iOS project

The apps you have available on Codemagic are listed on the Applications page. See how to add additional apps [here](./adding-apps-from-custom-sources).

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. On the popup, select **iOS App** as the project type and click **Continue**.
3. Download the example configuration for iOS App or copy it to clipboard.
4. Then edit the configuration file to adjust it to your project needs and commit it to the root of your repository.
    * For an overview about using `codemagic.yaml`, please refer [here](./yaml). 
    * Read more about adding configuration for [testing](../testing-yaml/testing), [code signing](../code-signing-yaml/signing-ios) and [publishing](../publishing-yaml/distribution).
    * See the full iOS workflow example [below](#ios-workflow-example).
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

* The code for testing an iOS app also goes under `scripts`, before build commands. An example for testing an iOS app can be found [here](../testing-yaml/testing/#native-ios).
* All iOS applications need to be signed before release. A full example of iOS code singing with YAML is available [here](../code-signing-yaml/signing-ios).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and App Store Connect. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../publishing-yaml/distribution/#publishing).

## iOS workflow example

The following example shows a workflow that can be used to publish your iOS app to App Store Connect.

```yaml
workflows:
  ios-workflow:
    name: ios_workflow
    environment:
      vars:
        XCODE_WORKSPACE: "YOUR_WORKSPACE_NAME.xcworkspace"  # PUT YOUR WORKSPACE NAME HERE
        XCODE_SCHEME: "YOUR_SCHEME_NAME" # PUT THE NAME OF YOUR SCHEME HERE
        FCI_CERTIFICATE: Encrypted(...) # PUT THE ENCRYPTED DISTRIBUTION CERTIFICATE HERE
        FCI_CERTIFICATE_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED CERTIFICATE PASSWORD HERE
        FCI_PROVISIONING_PROFILE: Encrypted(...) # PUT THE ENCRYPTED PROVISIONING PROFILE HERE
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
      - name: Set up keychain to be used for codesigning using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Set up Provisioning profiles from environment variables
        script: |
          PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
          mkdir -p "$PROFILES_HOME"
          PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
          echo ${FCI_PROVISIONING_PROFILE} | base64 --decode > "$PROFILE_PATH"
          echo "Saved provisioning profile $PROFILE_PATH"
      - name: Set up signing certificate
        script: |
          echo $FCI_CERTIFICATE | base64 --decode > /tmp/certificate.p12
          keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $FCI_CERTIFICATE_PASSWORD
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
        apple_id: your_apple_id@example.com  # PUT YOUR APPLE ID HERE
        password: Encrypted(...) # PUT YOUR APP-SPECIFIC-PASSWORD HERE https://support.apple.com/en-us/HT204397
```

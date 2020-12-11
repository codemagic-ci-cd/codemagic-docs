---
title: Building a native iOS app
description: Building an iOS app with YAML.
weight: 5
aliases:
  - '../yaml/building-a-native-ios-app'
---

With `codemagic.yaml`, you can use Codemagic to build, test and publish native iOS apps. You can read more about how to use `codemagic.yaml` and see the structure of the file [here](../getting-started/yaml).

{{<notebox>}}
Codemagic uses the [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) to prepare iOS application code signing properties for build.
{{</notebox>}}

## Building an unsigned native iOS app (.app)

For building an unsigned iOS app (.app), you need to run the following command in the scripts section:

```yaml
scripts:
  - |
    xcodebuild build -workspace "MyXcodeWorkspace.xcworkspace" \
    -scheme "MyScheme" \
    CODE_SIGN_INDENTITY="" \
    CODE_SIGNING_REQUIRED=NO \
    CODE_SIGNING_ALLOWED=NO
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
          echo ${FCI_PROVISIONING_PROFILE} | base64 --decode > $PROFILE_PATH
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
---
title: iOS simulator builds
description: How to build an iOS app without code signing to use in simulator
weight: 5
---

To test your app on simulators, Apple requires you to create an unsigned iOS app (with the `.app` extension).

## Building an unsigned native iOS app (.app)

For building an unsigned iOS app, please follow the steps outlined in the [Native iOS guide](/yaml-quick-start/building-a-native-ios-app), stopping short of the code signing step.

Adjust your build script to use this commands instead:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build the .app
      script: | 
        # build using workspace
        xcodebuild build \
          -workspace "MyXcodeWorkspace.xcworkspace" \
          -scheme "MyScheme" \
          CODE_SIGN_INDENTITY="" \
          CODE_SIGNING_REQUIRED=NO \
          CODE_SIGNING_ALLOWED=NO
        #
        # build using project
        # xcodebuild build \
        #    -project ""MyXcodeProject.xcodeproj" \
        #    -scheme "MyScheme" \
        #    CODE_SIGN_INDENTITY="" \
        #    CODE_SIGNING_REQUIRED=NO \
        #    CODE_SIGNING_ALLOWED=NO
{{< /highlight >}}

Your artifact will be generated at the default Xcode path. You can access them by adding the following pattern in the `artifacts` section of `codemagic.yaml`:

{{< highlight yaml "style=paraiso-dark">}}
  artifacts:
    - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
{{< /highlight >}}

If you have Xcode Debugging Symbols enabled, the dSYM file will be generated in the same directory as the app and can be accessed with the following artifact pattern:

{{< highlight yaml "style=paraiso-dark">}}
  artifacts:
    - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}

## Example
The following `codemagic.yaml` file shows a sample workflow that builds a `.zip` archive containing the `.app` file inside.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  simulator-native-ios:
    name: iOS simulator build
    max_build_duration: 120
    instance_type: mac_mini_m1
    environment:
      vars:
        XCODE_WORKSPACE: "your_workspace_name.xcworkspace"
        XCODE_SCHEME: "your_workspace_name"
      xcode: 13.0
      cocoapods: default
    scripts:
      - name: Install CocoaPods dependencies
        script: | 
          pod install
      - name: Build the .app
        script: | 
          xcodebuild build \
            -workspace "$XCODE_WORKSPACE" \
            -scheme "$XCODE_SCHEME" \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=iPhone 12 Pro,OS=15.4' \
            -configuration Debug \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO \
            CODE_SIGNING_ALLOWED=NO 
    artifacts:
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}

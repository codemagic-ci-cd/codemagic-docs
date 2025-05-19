---
title: Previewing apps in the browser
description: Test your iOS or Android app in the browser with Stellar App Preview
weight: 4
aliases:
---

Stellar is our iOS simulator and Android emulator running in your browser. Launch and interact with your iOS or Android app right in the browser, regardless of the operating system you are using. Test your app against different device and OS configurations, emulate GPS location or demo the latest app version without needing access to a physical device. 

**Tip:** The following sections describe creating previewable artifacts using codemagic.yaml. If you're using the Flutter Workflow Editor, follow the instructions [here](../flutter-testing/app-preview).

## Enabling App Preview

{{<notebox>}}
This feature is available for **teams** only. 
{{</notebox>}}

Teams on the Pay as you go plan can enable the feature via the **App Preview** page in left sidebar.

Teams on annual plans can request access to App Preview by [contacting us](https://codemagic.io/contact/).


## Creating iOS .app binaries for previewing on the simulator

To create a `.app` to run on the iOS simulator, consult the **codemagic.yaml** samples below.

You should make sure that the following values in the `-destination` string correspond with the macOS instance you are using:

- `name` corresponds with one of the devices available on the macOS instance being used.
- `OS` matches the iOS runtime available on the macOS instance being used.

You can find the macOS specifications that list the available iOS devices and runtimes [here](../specs/versions-macos).

{{< tabpane >}}
{{< tab header="Flutter" >}}
{{<markdown>}}
Sample **codemagic.yaml** for building an iOS `.app` binary for Flutter projects.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  flutter-ios-simulator:
    name: Flutter iOS Simulator
    environment:
      flutter: 3.27.3
      xcode: 16.2
    scripts:
      - name: install dependencies
        script: flutter pub get
      - name: Build unsigned .app
        script: |  
          xcodebuild -workspace "ios/Runner.xcworkspace" \
            -scheme "Runner" \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=iPhone 16,OS=18.2' \
            -configuration Debug \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO \
            CODE_SIGNING_ALLOWED=NO \
            -derivedDataPath ios/output
    artifacts:
      - ios/output/Build/Products/Debug-iphonesimulator/Runner.app
{{< /highlight >}}

Alternatively, you can target any available simulator on the build machine by using the Flutter build command with the `--simulator` flag.

{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Run Flutter pub get
        script: flutter pub get
      - name: Build unsigned .app for simulator
        script: flutter build ios --simulator
    artifacts:
      - build/ios/iphonesimulator/Runner.app
{{< /highlight >}}


{{</markdown>}}
{{< /tab >}}


{{< tab header="Flutter (Flavors)" >}}
{{<markdown>}}

If you are using Flutter flavors and want to preview a specific flavor, make sure that you set the correct value for your flavor's `-scheme` and set the entry point for your flavor using `FLUTTER_TARGET`. 

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  flutter-flavor-ios-simulator:
    name: Flutter Flavor iOS Simulator
    environment:
      flutter: 3.27.3
      xcode: 16.2
      cocoapods: default
    scripts:
      - name: install dependencies
        script: flutter pub get
      - name: Build unsigned .app
        script: |  
          xcodebuild -workspace "ios/Runner.xcworkspace" \
            -scheme "Runner-dev" \ 
            -sdk iphonesimulator \
            -destination "platform=iOS Simulator,name=iPhone 16,OS=18.2" \
            -configuration Debug \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO \
            CODE_SIGNING_ALLOWED=NO \
            FLUTTER_TARGET=lib/main_dev.dart \
            FLUTTER_BUILD_MODE=debug \
            -derivedDataPath ios/output
    artifacts:
      - ios/output/Build/Products/Debug-iphonesimulator/Runner.app
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}

On a successful build, you will see the **Quick Launch** button next to the `.app` artifact in build overview.

## Creating Android .apk binaries for previewing on the emulator

You can preview any `.apk` artifact built in Codemagic. 

In your codemagic.yaml, ensure that the `artifacts` section contains the path to the `.apk` artifact so that it is picked up and displayed among the build artifacts in Codemagic, as in the following example.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android:
    name: Android debug workflow
    scripts:
      - name: Set Android SDK location
        script: |
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/local.properties"
      - name: Build Android
        script: |
          ./gradlew assembleDebug
    artifacts:
      - app/build/outputs/apk/debug/app-debug.apk
{{< /highlight >}}

On a successful build, you will see the **Quick Launch** button next to the `.apk` artifact in build overview.


## Previewing apps 

Clicking **Quick Launch** next to a suitable artifact launches an iOS simulator or an Android emulator respectively with your app installed on it, right in your browser. 

To use a different device and OS combination, click the three dots on the controls menu and select **Change device**.

The preview session remains active for a maximum of **20 minutes** and is limited to one concurrent session by default. To end the ongoing session, select **Stop session** from the menu.

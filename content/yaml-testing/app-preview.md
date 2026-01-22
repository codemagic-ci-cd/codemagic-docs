---
title: Previewing apps in the browser
description: Test your iOS or Android app in the browser with App Preview
weight: 4
aliases:
---

App Preview is our iOS simulator and Android emulator running in your browser. Launch and interact with your iOS or Android app right in the browser, regardless of the operating system you are using. Test your app against different device and OS configurations, emulate GPS location or demo the latest app version without needing access to a physical device. 

<div style="position: relative; padding-bottom: 55.987558320373246%; height: 0;"><iframe src="https://www.loom.com/embed/2467ee53d6f34f5fae29b01caa075e48" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

**Tip:** The following sections describe creating previewable artifacts using codemagic.yaml. If you're using the Flutter Workflow Editor, follow the instructions [here](../flutter-testing/app-preview).

## Enabling App Preview and Free Trial

{{<notebox>}}
This feature is available for **teams** only. 
{{</notebox>}}

Teams on the **Pay as you go** plan can enable the feature via the **App Preview** page on the left sidebar and will get 100 free trial minutes. Once used up, further app preview minutes will be billed at the rate of $0.095/min and included in your monthly invoice.

Teams on annual plans can try out App Preview by [contacting us](https://codemagic.io/contact/).

## Creating iOS .app binaries for previewing on the simulator

To create a `.app` to run on the iOS simulator, consult the **codemagic.yaml** samples below.

{{< tabpane >}}

{{< tab header="iOS" >}}
{{<markdown>}}
Sample **codemagic.yaml** for building an iOS `.app` binary using Xcode build commands.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  simulator-workflow:
    name: Build for simulator
    environment:
      xcode: latest
    scripts:
      - name: Build with Generic Destination
        script: |
          xcodebuild build \
            -project "yourproject.xcodeproj" \
            -scheme "yourscheme" \
            -sdk iphonesimulator \
            -configuration Debug
    artifacts:
      - /Users/builder/Library/Developer/Xcode/DerivedData/**/*.app
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

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
      - flutter build ios --simulator --flavor staging  # --flavor is optional
    artifacts:
      - build/ios/iphonesimulator/Runner.app
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

---
---

Codemagic allows you to preview your `.app` artifact on an iOS simulator and interact with the simulator via a web browser. You can easily test the functionalities of your app as well as system notifications and flows that require location data on different simulator devices without requiring a physical device.

{{<notebox>}}
Note that this feature is available for **teams** on request. Please [contact us](https://codemagic.io/contact/) for more information.
{{</notebox>}}

## Using Workflow Editor to create iOS .app binaries for testing

In the 'Build' section of the Workflow Editor, set the 'Mode' to debug. In the 'Build arguments' field, add `--simulator` next to the iOS '--debug' section.

## Creating iOS .app binaries for testing with codemagic.yaml

To create a `.app` to run on the iOS simulator, consult the **codemagic.yaml** samples below.

You should make sure that the following values in the `-destination` string correspond with the macOS instance you are using:

- `name` corresponds with one of the devices available on the macOS instance being used.
- `OS` matches the iOS runtime available on the macOS instance being used.

You can find the macOS specifications that list the available iOS devices and runtimes [here](https://docs.codemagic.io/specs-macos/xcode-16-2/#:~:text=Software%20and%20hardware-,macOS%20machines,-Xcode%2016.2.x).

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

## Running preview builds

You can preview any `.app` artifact built in Codemagic that targets the `iPhoneSimulator`. For such artifacts, there is a **Quick Launch** button available next to the artifact name on the build overview page.

Clicking **Quick Launch** displays a configuration popup for selecting the simulator device and runtime. Once you click **Start**, Codemagic opens a simulator in a new tab and installs your application. The simulator session remains active for a maximum of **20 minutes**.

Once the session ends, you can start a new one if needed.

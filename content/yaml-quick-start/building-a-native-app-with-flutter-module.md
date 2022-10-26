---
title: Native apps with a Flutter module
description: How to build a native iOS or Android app with a Flutter module using codemagic.yaml
weight: 4
aliases:
  - '../yaml/building_a_native_app_with_flutter_module'
  - '../yaml-quick-start/building_a_native_app_with_flutter_module'
---

Flutter can be integrated into your existing application as a library to render a part of your app’s UI in Flutter. To add a Flutter module to an existing app, please refer to [the official Flutter documentation](https://flutter.dev/docs/development/add-to-app).

Please follow the guides on [native Android](../yaml-quick-start/building-a-native-android-app) and on [native iOS](../yaml-quick-start/building-a-native-ios-app) to get you started with the project and then modify the workflow as described below to add Flutter modules.

The examples below show how to build apps containing Flutter modules using `codemagic.yaml`. The examples provided here are inspired by [Flutter add-to-app samples](https://github.com/flutter/samples/tree/master/add_to_app) where the Flutter module directory (referred to as `my_flutter_module` in templates) is on the same level as the host app directory (referred to as `my_host_app`). 


## Using a Flutter module (with dependencies) as a library

Using a Flutter module as a library means that it will be built from the source each time the host app builds. 

Here are the sample build steps you can add to your `codemagic.yaml`:

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Add Flutter and build
      script: | 
        echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/my_host_app/local.properties"
        cd my_flutter_module && flutter pub get
        cd my_host_app && ./gradlew assembleDebug
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build Flutter module from the source
      script: | 
        cd my_flutter_module
        flutter pub get
        flutter build ios --release --no-codesign
        cd .ios
        pod install
    - name: Build host application
      script: | 
        cd my_host_app
        pod install
        xcodebuild build -workspace "MyXcodeProject.xcworkspace" \
          -scheme "MyXcodeScheme" \
          CODE_SIGN_IDENTITY="" \
          CODE_SIGNING_REQUIRED=NO \
          CODE_SIGNING_ALLOWED=NO
{{< /highlight >}}
{{<notebox>}}
**Note:** If you don't have a workspace, use 
`-project "MyXcodeProject.xcodeproj"` instead of the 
`-workspace "MyXcodeWorkspace.xcworkspace"` option.
{{</notebox>}}
{{< /tab >}}
{{< /tabpane >}}



### Using a prebuilt Flutter module

Using a prebuilt module means that you don't need to build it every time the host app is built if there are no changes to the module. You may speed up your overall building time by precompiling your Flutter module once, committing it to the repository and reusing it afterwards without the need to build it from the source.


{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Configure local properties
      script: | 
        echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/my_host_app/local.properties"
    - name: Precompile the Flutter module
    script: | 
      cd my_flutter_module
      flutter pub get
      flutter build aar
    - name: Build host application
      script: | 
        cd my_host_app
        ./gradlew assembleDebug
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Precompile the Flutter module
      script: | 
        cd my_flutter_module
        flutter packages get
        flutter build ios-framework \
          --output=$CM_BUILD_DIR/my_host_app/Flutter
    - name: Build host application
      script: | 
        cd my_host_app
        pod install
        xcodebuild build -project "MyXcodeProject.xcodeproj" \
          -scheme "MyXcodeScheme" \
          CODE_SIGN_IDENTITY="" \
          CODE_SIGNING_REQUIRED=NO \
          CODE_SIGNING_ALLOWED=NO
{{< /highlight >}}
{{<notebox>}}
**Note:** If you don't have a workspace, use 
`-project "MyXcodeProject.xcodeproj"` instead of the 
`-workspace "MyXcodeWorkspace.xcworkspace"` option.
{{</notebox>}}
{{< /tab >}}
{{< /tabpane >}}

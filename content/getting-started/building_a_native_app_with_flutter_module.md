---
title: Building a native app with a Flutter module
description: How to build a native iOS or Android app with a Flutter module using codemagic.yaml
weight: 10
aliases:
  - '../yaml/building_a_native_app_with_flutter_module'
---

## Add-to-app

Flutter can be integrated into your existing application as a library to render a part of your app’s UI in Flutter. To add a Flutter module to an existing app, please refer to [the official Flutter documentation](https://flutter.dev/docs/development/add-to-app).

The examples below show how to build apps containing Flutter modules using `codemagic.yaml`. The examples provided here are inspired by [Flutter add-to-app samples](https://github.com/flutter/samples/tree/master/add_to_app) where the Flutter module directory (reffered to as `my_flutter_module` in templates) is on the same level as the host app directory (reffered to as `my_host_app`). 

### Using a Flutter module (with dependencies) as a library

Using a Flutter module as a library means that it will be built from the source each time the host app builds. 

* In an Android app:

```yaml
scripts:
  - echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/my_host_app/local.properties"
  - cd my_flutter_module && flutter pub get
  - cd my_host_app && ./gradlew assembleDebug
```

* In an iOS app:

```yaml
scripts:
  - echo 'previous step'
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
      xcodebuild build -workspace "MyXcodeProject.xcworkspace" -scheme "MyXcodeScheme" CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO
```

{{<notebox>}}
If you don't have a workspace, use 

`-project "MyXcodeProject.xcodeproj"` instead of the 

`-workspace "MyXcodeWorkspace.xcworkspace"` option.
{{</notebox>}}

### Using a prebuilt Flutter module

Using a prebuilt module means that you don't need to build it every time the host app is built if there are no changes to the module. You may speed up your overall building time by precompiling your Flutter module once, committing it to the repository and reusing it afterwards without the need to build it from source.

* In an Android app:

```yaml
scripts:
  - echo 'previous step'
  - echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/my_host_app/local.properties"
  - name: Precompile the Flutter module
    script: |
      cd my_flutter_module
      flutter pub get
      flutter build aar
  - name: Build host application
    script: |
      cd my_host_app
      ./gradlew assembleDebug
```

* In an iOS app:

```yaml
scripts:
  - echo 'previous step'
  - name: Precompile the Flutter module
    script: |
      cd my_flutter_module
      flutter packages get
      flutter build ios-framework --output=$FCI_BUILD_DIR/my_host_app/Flutter
  - name: Build host application
    script: |
      cd my_host_app
      pod install
      xcodebuild build -project "MyXcodeProject.xcodeproj" -scheme "MyXcodeScheme" CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO
```
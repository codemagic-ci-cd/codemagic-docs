---
title: Building a native app with a Flutter module
description: Building a native iOS or Android app with a Flutter module
weight: 5
---

## Add-to-app

It’s sometimes not practical to rewrite your entire application in Flutter all at once. For those situations, Flutter can be integrated into your existing application piecemeal, as a library or module. That module can then be imported into your Android or iOS (currently supported platforms) app to render a part of your app’s UI in Flutter. Or, just to run shared Dart logic. Please refer to [the guidlines](https://flutter.dev/docs/development/add-to-app) for more information.

The templates were inspired with add-to-app [flutter samples](https://github.com/flutter/samples/tree/master/add_to_app). It implies that Flutter module directory (reffered in templates as `my_flutter_module`) is on the same level as the host app directory (reffered as `my_host_app`). 

#### Using Flutter module (with dependencies) as a library

Using Flutter module as a library means that it will be built from the source each time the host app builds. 

* Android:

```yaml
scripts:
  - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/my_host_app/local.properties"
  - cd my_flutter_module && flutter pub get
  - cd my_host_app && ./gradlew assembleDebug
```

* iOS:

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

#### Using a prebuilt Flutter module:

Using Flutter module as a prebuilt module means that you don't need to build it every time host app builds if the module doesn't change. If you don't do changes in the Flutter module, you may speed up your overall building time by precompiling your Flutter module once, committing it to the repository and reusing it afterwards without the need to build it from source.

* Android:

```yaml
scripts:
  - echo 'previous step'
  - echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/my_host_app/local.properties"
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

* iOS:

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
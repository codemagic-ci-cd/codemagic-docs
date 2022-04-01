---
description: How to upload dsym artifacts to Firebase Crashlytics
title: Firebase Crashlytics dsym uploading
weight: 4
aliases:
  - '../custom-scripts/firebase-crashlytics-dsym-uploading'
---

**dSYM** files store the debug symbols for your app. It contains mapping information to decode a stack-trace into readable format. The purpose of **dSYM** is to replace symbols in the crash logs with the specific methods so it will be readable and helpful for debugging the crash. In order to generate debug symbols, Firebase Crashlytics must be installed using the following command line:

```
flutter pub add firebase_crashlytics
```

Alternatively, **firebase_crashlytics: ^2.5.2** could be added in **pubspec.yaml** file under **dependencies**:

```
dependencies:
  flutter:
    sdk: flutter
  firebase_crashlytics: ^2.5.2
```

Installing is successfully will generate debug symbols as a zip file but they will not be displayed unless the following path is configured in **codemagic.yaml** under the artifacts section:

```
 - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
 ```

Afterwards, the following script either to your configuration file or in your post-publish script in the Flutter workflow editor will upload dSYM files to Firebase Crashlytics:

  ```bash
  echo "Find build artifacts"
  dsymPath=$(find $CM_BUILD_DIR/build/ios/archive/Runner.xcarchive -name "*.dSYM" | head -1)
  if [[ -z ${dsymPath} ]]
  then
    echo "No debug symbols were found, skip publishing to Firebase Crashlytics"
  else
    echo "Publishing debug symbols from $dsymPath to Firebase Crashlytics"
    ls -d -- ios/Pods/*
    $CM_BUILD_DIR/ios/Pods/FirebaseCrashlytics/upload-symbols -gsp ios/Runner/GoogleService-Info.plist -p ios $dsymPath
  fi
  ```

For Native iOS apps, in the case of using SwiftPackageManager (SPM) instead of CocoaPods, the following script needs to be added in a post-publishing script:

```bash
echo "Find build artifacts"
dsymPath=$(find build/ios/xcarchive/* | head -1)
echo "dsyms expected in:"
ls -d -- $dsymPath/dSYMs/*
dsymFile=$(find $dsymPath/dSYMs -name "*.dSYM" | head -1) 
if [[ -z ${dsymFile} ]]
then
  echo "No debug symbols were found, skip publishing to Firebase Crashlytics"
else
  echo "Publishing debug symbols in $dsymFile to Firebase Crashlytics"
  echo $dsymFile
  ls -d -- $CM_BUILD_DIR/*
  $HOME/Library/Developer/Xcode/DerivedData/**/SourcePackages/checkouts/firebase-ios-sdk/Crashlytics/upload-symbols -gsp $CM_BUILD_DIR/<PATH_TO_YOUR_GoogleService-Info.plist> -p ios $dsymFile
fi
```

## Sample Project

A sample project for uploading **dSYM** to Firebase Crashlytics can be found [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/firebase_crashlytics_demo_project)

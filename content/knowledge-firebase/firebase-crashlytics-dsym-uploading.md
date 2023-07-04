---
title: Firebase Crashlytics dSYM uploading
description: Enhancing Crash Log Debugging with dSYM files
weight: 13
aliases:
  - /custom-scripts/firebase-crashlytics-dsym-uploading
  - knowledge-base/firebase-crashlytics-dsym-uploading
---
**dSYM** files store the debug symbols for your app. They contain mapping information to decode a stack-trace into a readable format. 
The purpose of **dSYM** is to replace symbols in the crash logs with the specific methods so it will be readable and helpful for debugging the crash. 

A sample project for uploading **dSYM** files to Firebase Crashlytics can be found in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/firebase_crashlytics_demo_project).

### How to upload dSYM artifacts to Firebase Crashlytics using codemagic.yaml

In order to generate debug symbols, Firebase Crashlytics must be installed using the following script in your `codemagic.yaml`:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install Firebase Crashlytics
      script: | 
        flutter pub add firebase_crashlytics
{{< /highlight >}}


Alternatively, **firebase_crashlytics: ^2.5.2** could be added in the **pubspec.yaml** file under **dependencies**:

{{< highlight yaml "style=paraiso-dark">}}
dependencies:
  flutter:
    sdk: flutter
  firebase_crashlytics: ^2.5.2
{{< /highlight >}}


As soon as your build finishes successfully, debug symbols are generated. However, if you want them to be displayed in the Codemagic UI on the build page, then the following path needs to be configured in `codemagic.yaml` under the artifacts section:

{{< highlight yaml "style=paraiso-dark">}}
  artifacts:
    - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}

In order to upload the dSYM files to Firebase Crashlytics, add the following script to your `codemagic.yaml` configuration file:

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  scripts:
    - name: Upload debug symbols to Firebase Crashlytics
      script: | 
        echo "Find build artifacts"
        dsymPath=$(find $CM_BUILD_DIR/build/ios/archive/Runner.xcarchive -name "*.dSYM" | head -1)
        if [[ -z ${dsymPath} ]]
        then
          echo "No debug symbols were found, skip publishing to Firebase Crashlytics"
        else
          echo "Publishing debug symbols from $dsymPath to Firebase Crashlytics"
          ls -d -- ios/Pods/*
          $CM_BUILD_DIR/ios/Pods/FirebaseCrashlytics/upload-symbols \
            -gsp ios/Runner/GoogleService-Info.plist -p ios $dsymPath
        fi
{{< /highlight >}}
 
The above-mentioned **dsymPath** is Flutter specific and it could change depending on what platform the app is built on. For example, in React Native or Native iOS applications you might use the dsymPath as:

{{< highlight yaml "style=paraiso-dark">}}
dsymPath=$(find $CM_BUILD_DIR/build/ios/xcarchive/*.xcarchive -name "*.dSYM" | head -1)
{{< /highlight >}}

Besides, as **Pods** is not located inside the **ios** directory for native iOS apps, the following path needs to be changed as well:

{{< highlight yaml "style=paraiso-dark">}}
ls -d -- ios/Pods/*
{{< /highlight >}}

to

{{< highlight yaml "style=paraiso-dark">}}
ls -d -- $CM_BUILD_DIR/*
{{< /highlight >}}

If necessary, you can use remote access to the build machine to find the correct path. More information can be found [here](https://docs.codemagic.io/troubleshooting/accessing-builder-machine-via-ssh).

For Native iOS apps, in the case of using SwiftPackageManager (SPM) instead of CocoaPods, the following script needs to be added in a post-publishing script:

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  scripts:
    - name: Upload debug symbols to Firebase Crashlytics
      script: | 
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
            $HOME/Library/Developer/Xcode/DerivedData/**/SourcePackages/checkouts/firebase-ios-sdk/Crashlytics/upload-symbols \
              -gsp $CM_BUILD_DIR/<PATH_TO_YOUR_GoogleService-Info.plist> -p ios $dsymFile
        fi
{{< /highlight >}}

### How to upload dSYM artifacts to Firebase Crashlytics using Workflow Editor

In order to upload the dSYM files to Firebase Crashlytics, add the following script to  your **post-publish** script in the Flutter workflow editor:

{{< highlight yaml "style=paraiso-dark">}}
  echo "Find build artifacts"
  dsymPath=$(find $CM_BUILD_DIR/build/ios/archive/Runner.xcarchive -name "*.dSYM" | head -1)
  if [[ -z ${dsymPath} ]]
  then
    echo "No debug symbols were found, skip publishing to Firebase Crashlytics"
  else
    echo "Publishing debug symbols from $dsymPath to Firebase Crashlytics"
    ls -d -- ios/Pods/*
    $CM_BUILD_DIR/ios/Pods/FirebaseCrashlytics/upload-symbols \
      -gsp ios/Runner/GoogleService-Info.plist -p ios $dsymPath
  fi
{{< /highlight >}}
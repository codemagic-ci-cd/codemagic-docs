---
description: How to upload dsym artifacts to Firebase Crashlytics
title: Firebase Crashlytics dsym uploading
weight: 4
aliases:
  - '../custom-scripts/firebase-crashlytics-dsym-uploading'
---

Here is how you can upload Xcode debugging symbols file to Firebase Crashlytics

  ```bash
  echo "Find build artifacts"
  dsymPath=$(find $FCI_BUILD_DIR/build/ios/archive/Runner.xcarchive $FCI_BUILD_DIR/build/ios/xcarchive/Runner.xcarchive -name "*.dSYM.zip" | head -1)
  if [[ -z ${dsymPath} ]]
  then
    echo "No debug symbols were found, skip publishing to Firebase Crashlytics"
  else
    echo "Publishing debug symbols from $dsymPath to Firebase Crashlytics"
    ls -d -- ios/Pods/*
    $FCI_BUILD_DIR/ios/Pods/FirebaseCrashlytics/iOS/Crashlytics.framework/upload-symbols -gsp ios/Runner/GoogleService-Info.plist -p ios $dsymPath
  fi
  ```

Add this script either to your configuration file or in your post-publish script in the Flutter workflow editor to locate and upload dSYM files to Firebase Crashlytics.

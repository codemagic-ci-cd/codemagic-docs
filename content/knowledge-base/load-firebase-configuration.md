---
description: How to load Firebase configuration files into environment variables in a Flutter workflow editor pre-build script
title: Loading Firebase configuration
weight: 4
aliases:
  - '../custom-scripts/load-firebase-configuration'
---

Instead of committing the Firebase configuration files to your repository, you can upload them to Codemagic as **environment variables** and reference them in a custom script.

1.  Save the **contents** of Firebase config files as environment variables, e.g. `ANDROID_FIREBASE_SECRET` and `IOS_FIREBASE_SECRET` in Codemagic UI (either in Application or Team variables) and select **Secure**. 
2.  Add the following **pre-build** script echoing your variables to load the Firebase configuration in Codemagic.

  ```bash
  #!/usr/bin/env sh
  set -e # exit on first failed command

  echo $ANDROID_FIREBASE_SECRET > $FCI_BUILD_DIR/android/app/google-services.json
  echo $IOS_FIREBASE_SECRET > $FCI_BUILD_DIR/ios/Runner/GoogleService-Info.plist
  ```

  In case your project is in a nested folder structure, it has to be reflected, and the script should be as follows: 

  ```bash
  #!/usr/bin/env sh
  set -e # exit on first failed command

  PROJECT_ROOT=$FCI_BUILD_DIR/myproject/path      # ADD YOUR PROJECT FOLDER PATH HERE

  echo $ANDROID_FIREBASE_SECRET > $PROJECT_ROOT/android/app/google-services.json
  echo $IOS_FIREBASE_SECRET > $PROJECT_ROOT/ios/Runner/GoogleService-Info.plist
  ```


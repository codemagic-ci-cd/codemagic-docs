---
description: How to load Firebase configuration files into environment variables in a Flutter workflow editor pre-build script
title: Loading Firebase configuration
weight: 14
aliases:
  - /custom-scripts/load-firebase-configuration
  - /knowledge-base/load-firebase-configuration
---

Instead of committing the Firebase configuration files to your repository, you can upload them to Codemagic as **environment variables** and reference them in a custom script.

 Save the **contents** of Firebase config files as environment variables, e.g. `ANDROID_FIREBASE_SECRET` and `IOS_FIREBASE_SECRET` in Codemagic UI (either in Application or Team variables) and select **Secure**. 

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `ANDROID_FIREBASE_SECRET` or `IOS_FIREBASE_SECRET`.
3. Copy and paste the config file content as **_Variable value_**.
4. Enter the variable group name, e.g. **_firebase_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - firebase_credentials
{{< /highlight >}}



8.  Add the following **pre-build** script echoing your variables to load the Firebase configuration in Codemagic.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Load Firebase configuration
      script: | 
        #!/usr/bin/env sh
        set -e # exit on first failed command

        echo $ANDROID_FIREBASE_SECRET > $CM_BUILD_DIR/android/app/google-services.json
        echo $IOS_FIREBASE_SECRET > $CM_BUILD_DIR/ios/Runner/GoogleService-Info.plist
{{< /highlight >}}

In case your project is in a nested folder structure, adjust the script accordingly: 

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Load Firebase configuration
      script: | 
        #!/usr/bin/env sh
        set -e # exit on first failed command

        PROJECT_ROOT=$CM_BUILD_DIR/myproject/path    # ADD YOUR PROJECT FOLDER PATH HERE

        echo $ANDROID_FIREBASE_SECRET > $PROJECT_ROOT/android/app/google-services.json
        echo $IOS_FIREBASE_SECRET > $PROJECT_ROOT/ios/Runner/GoogleService-Info.plist
{{< /highlight >}}


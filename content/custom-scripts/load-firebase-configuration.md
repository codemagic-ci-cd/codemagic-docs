---
description: Load your Firebase configuration files to Codemagic
title: Load Firebase configuration
weight: 1
---

Instead of committing the Firebase config files to your repository, you can upload them to Codemagic as [environment variables](https://docs.codemagic.io/building/environment-variables/) and reference them in a custom script. Note that the Firebase config file (`google-services.json` for Android or `GoogleService-Info.plist` for iOS) must be Base64-encoded.

1.  Save your Firebase config files as environment variables, e.g. `ANDROID_FIREBASE_SECRET` and `IOS_FIREBASE_SECRET`. Make sure to check **Secure**.
2.  Add the following **pre-build** script echoing your variables to load the Firebase configuration in Codemagic.

        #!/usr/bin/env sh

        set -e # exit on first failed command
        
        PROJECT_ROOT=$FCI_BUILD_DIR/myproject           # ADD YOUR PROJECT FOLDER HERE

        echo $ANDROID_FIREBASE_SECRET | base64 --decode > $PROJECT_ROOT/android/app/google-services.json
        echo $IOS_FIREBASE_SECRET | base64 --decode > $PROJECT_ROOT/ios/Runner/GoogleService-Info.plist

{{<notebox>}}

`post-clone script failed on base64 decode. The command could not be found`
If you received this error message when using the script above, it may be due to some invisible Unicode characters in the script after copy-pasting it. Try removing the space between the `base64` command and the `--decode` option and then adding it back.
{{</notebox>}}

For more details about using base64 and loading the Firebase configuration in Codemagic, see the step-by-step guide [here](https://blog.codemagic.io/how-to-load-firebase-config-in-codemagic-with-environment-variables/).

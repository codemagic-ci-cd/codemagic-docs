---
title: Testing on Firebase Test Lab
description: How to run tests on Firebase Test Lab
weight: 2
aliases: /testing-yaml/firebase-test-lab
---

Firebase Test Lab provides a cloud-based infrastructure for testing Android and iOS apps on various devices and configurations. You can test your apps on Firebase Test Lab as part of the Codemagic build workflow provided you have set up a Firebase project.

To set up testing on Firebase Test Lab in Codemagic, follow these steps.

## Firebase Test Lab prerequisites

You will need to set up the following in the [Firebase console](https://firebase.google.com/).

1. Create a Firebase project.
2. Create a service account with Editor permissions and download the **JSON key file** so you can authenticate with Firebase Test Lab during the build. See how to create a service account [here](../knowledge-base/google-play-api).
3. Enable the [Cloud Tools Results API](https://console.cloud.google.com/apis/library/toolresults.googleapis.com?pli=1&project=woven-voyage-217607&folder=&organizationId=).

Please follow the guides in the [Firebase Test Lab documentation](https://firebase.google.com/docs/test-lab/?gclid=EAIaIQobChMIs5qVwqW25QIV8iCtBh3DrwyUEAAYASAAEgLFU_D_BwE) to set up a project.

## Configure testing in codemagic.yaml

To access the Firebase project from Codemagic, add the service account JSON key file and the Firebase project name as [Environment variables](../yaml-basic-configuration/configuring-environment-variables).

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `GCLOUD_KEY_FILE`.
3. Copy and paste the content of the JSON key file as **_Variable value_**.
4. Enter the variable group name, e.g. **_firebase_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to add the `FIREBASE_PROJECT` variable to store your **Firebase project ID**.


In your `codemagic.yaml` file, import the above environment variable group and add the corresponding testing script.

{{<notebox>}}
**Note:** Codemagic machines come with gcloud CLI tools preinstalled. Refer to [CLI documentation for Android](https://firebase.google.com/docs/test-lab/android/command-line) and [CLI documentation for iOS](https://firebase.google.com/docs/test-lab/ios/command-line) for more details.
{{</notebox>}}


{{< tabpane >}}

{{< tab header="Android" >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
  environment:
    groups:
      - firebase_credentials
  scripts:
    # ...
    - name: Create debug and test APK
      script: | 
        set -ex
        cd android
        ./gradlew app:assembleAndroidTest
        ./gradlew app:assembleDebug -Ptarget="$CM_BUILD_DIR/integration_test/app_test.dart"
    - name: Run Firebase Test Lab tests
      script: | 
        set -ex
        echo $GCLOUD_KEY_FILE > ./gcloud_key_file.json
        gcloud auth activate-service-account --key-file=gcloud_key_file.json
        gcloud --quiet config set project $FIREBASE_PROJECT
        gcloud firebase test android run \
          --type instrumentation \
          --app your-app.apk \
          --test your-app-test.apk \
          --device model=TestDevice1,version=AndroidVersion1  \
          --device model=TestDevice2,version=AndroidVersion2  \
          --environment-variables coverage=true,coverageFile="/sdcard/coverage.ec" \
          --directories-to-pull /sdcard
          --timeout 3m

{{< /highlight >}}
{{< /tab >}}


{{< tab header="iOS" >}}
{{<markdown>}}

Package your application and prepare it for upload to Firebase Test Lab as described [here](https://firebase.google.com/docs/test-lab/ios/run-xctest#package-app).

Use the generated `MyTests.zip` to start testing:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
  environment:
    groups:
      - firebase_credentials
  scripts:
    # ...
    - name: Run Firebase Test Lab tests
      script: | 
        set -ex
        echo $GCLOUD_KEY_FILE > ./gcloud_key_file.json
        gcloud auth activate-service-account --key-file=gcloud_key_file.json
        gcloud --quiet config set project $FIREBASE_PROJECT
        gcloud firebase test ios run --test PATH/TO/MyTests.zip \
          --device model=MODEL_ID_1,version=VERSION_ID_1,locale=LOCALE_1,orientation=ORIENTATION_1 \
          --device model=MODEL_ID_2,version=VERSION_ID_2,locale=LOCALE_2,orientation=ORIENTATION_2
          --timeout 3m
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}

In `codemagic.yaml` file the script called `Create debug and test APK` will create two .apk files. One is the debug version of your app, and the other is the .apk that is used to run the integration tests.

The script called `Run Firebase Test Lab tests` will use the gcloud CLI tools to authenticate with Firebase and then run the test passing in the debug apk, the test .apk, and specifying a build timeout.

Check out [this sample Flutter project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/flutter/flutter-integration-tests-demo-project) and the relevant [codemagic.yaml](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/flutter/flutter-integration-tests-demo-project/codemagic.yaml) file for setting up integration tests in Firebase.

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
2. Create a service account with Editor permissions and download the JSON key file so you can authenticate with Firebase Test Lab during the build. See how to create a service account [here](../knowledge-base/google-play-api).
3. Enable the [Cloud Tools Results API](https://console.cloud.google.com/apis/library/toolresults.googleapis.com?pli=1&project=woven-voyage-217607&folder=&organizationId=).

Please follow the guides in the [Firebase Test Lab documentation](https://firebase.google.com/docs/test-lab/?gclid=EAIaIQobChMIs5qVwqW25QIV8iCtBh3DrwyUEAAYASAAEgLFU_D_BwE) to set up a project.

## Configure testing in Firebase Test Lab in codemagic.yaml

To access the Firebase project from Codemagic, add the service account JSON key file to your `codemagic.yaml` and the Firebase project name as environment variables. See how to [encrypt environment variables](../building/encrypting).

```yaml
environment:
  vars:
    GCLOUD_KEY_FILE: Encrypted(...) # <-- Put your encrypted service account JSON key file here
    FIREBASE_PROJECT: "YOUR_FIREBASE_PROJECT_NAME" # <-- Put your Firebase Project Name here
```
Then, add the scripts to run tests on the preferred platform and device. The testing step should come after build scripts.

Note that Codemagic machines come with installed gcloud CLI tools. Refer [CLI documentation for Android](https://firebase.google.com/docs/test-lab/android/command-line) and [CLI documentation for iOS](https://firebase.google.com/docs/test-lab/ios/command-line) for the detailed description.

```yaml
 - name: Run Firebase Test Lab tests
   script: |
     set -ex
     echo $GCLOUD_KEY_FILE | base64 --decode > ./gcloud_key_file.json
     gcloud auth activate-service-account --key-file=gcloud_key_file.json

     gcloud --quiet config set project $FIREBASE_PROJECT
```

### Android
```yaml
gcloud firebase test android run \
  --type instrumentation \
  --app your-app.apk \
  --test your-app-test.apk \
  --device model=TestDevice1,version=AndroidVersion1  \
  --device model=TestDevice2,version=AndroidVersion2  \
  --environment-variables coverage=true,coverageFile="/sdcard/coverage.ec" \
  --directories-to-pull /sdcard
  --timeout 3m
```

### iOS

Package your application and prepare it for upload to Firebase Test Lab as described [here](https://firebase.google.com/docs/test-lab/ios/run-xctest#package-app).

Use the generated `MyTests.zip` to start testing:

```yaml
  gcloud firebase test ios run --test PATH/TO/MyTests.zip \
    --device model=MODEL_ID_1,version=VERSION_ID_1,locale=LOCALE_1,orientation=ORIENTATION_1 \
    --device model=MODEL_ID_2,version=VERSION_ID_2,locale=LOCALE_2,orientation=ORIENTATION_2
    --timeout 3m
```

Check out [this sample Flutter project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/flutter/flutter-integration-tests-demo-project) and the relevant [codemagic.yaml](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/flutter/flutter-integration-tests-demo-project/codemagic.yaml) file for setting up integration tests in Firebase.

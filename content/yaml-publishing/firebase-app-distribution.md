---
title: Firebase App Distribution
description: How to deploy an app to Firebase App Distribution using codemagic.yaml
weight: 4
---

Codemagic enables you to automatically publish your iOS or Android app to [Firebase Console](https://console.firebase.google.com/).

If you use Firebase services, load the Firebase configuration files to Codemagic by saving them to [environment variables](/variables/environment-variable-groups/#storing-sensitive-valuesfiles). Copy/paste the contents of `google-services.json` and `GoogleService-Info.plist` and save them to the environment variables named `ANDROID_FIREBASE_SECRET` and `IOS_FIREBASE_SECRET` respectively. Click **Secure** to encrypt the values.

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**. If your workflow is configured with **Flutter workflow editor**, please go to [Publishing an app to Firebase App Distribution with Flutter workflow editor](../publishing/firebase-app-distribution).
{{</notebox>}}

### Requirements

For distributing an iOS application to Firebase App Distribution, your application must use a development, Ad Hoc or Enterprise distribution profile.

To authenticate with Firebase, Codemagic requires either a **Firebase token** or a service account with **Firebase App Distribution Admin** role.

To retrieve your Firebase token, follow the instructions in [Firebase documentation](https://firebase.google.com/docs/cli#cli-ci-systems).

Note that using a service account is a more secure option due to granular permission settings. Follow [this](/knowledge-base/google-services-authentication/#firebase) guide to set up service account for Firebase distribution.

Save the Firebase token or the contents of the service account JSON file to your environment variables in the application or team settings. Click **Secure** to encrypt the value. Then, reference it in `codemagic.yaml` as `$FIREBASE_TOKEN` or `$FIREBASE_SERVICE_ACCOUNT` respectively.

### Distribution to Firebase

Example configuration for publishing Android and iOS artifacts to Firebase:

```yaml
publishing:
  firebase:
    firebase_token: $FIREBASE_TOKEN
    # OR: firebase_service_account: $FIREBASE_SERVICE_ACCOUNT
    android:
      app_id: x:xxxxxxxxxxxx:android:xxxxxxxxxxxxxxxxxxxxxx # Add your Android app id retrieved from Firebase console
      groups: # Add one or more groups that you wish to distribute your Android application to, you can create groups in the Firebase console
        - androidTesters
        - ...
    ios:
      app_id: x:xxxxxxxxxxxx:ios:xxxxxxxxxxxxxxxxxxxxxx # Add your iOS app id retrieved from Firebase console
      groups: # Add one or more groups that you wish to distribute your iOS application to, you can create groups in the Firebase console
        - iosTesters
        - ...
```

If you wish to pass release notes with your build, create a `release_notes.txt` file and add it to the project working directory, which is either the repository root directory or the Project path specified in the Build section in your workflow settings. Codemagic will fetch the content of that file and publish it with the build.

In order to distribute an `.aab` to testers via Firebase App Distribution, your Firebase project must be linked to your Google Play account. More information is available [here](https://firebase.google.com/docs/app-distribution/android/distribute-console?apptype=aab#before_you_begin)

#### Publishing only the Android app bundle or APK artifact to Firebase App Distribution

If you are building both an Android app bundle and an APK in your workflow, Codemagic will by default try to publish both artifacts to Firebase App Distribution. If you wish to only publish one of these artifacts, specify the artifact type using the `artifact_type` field:

```yaml
publishing:
  firebase:
    firebase_token: $FIREBASE_TOKEN
    android:
      app_id: x:xxxxxxxxxxxx:android:xxxxxxxxxxxxxxxxxxxxxx
      groups:
        - androidTesters
        - ...
      artifact_type: 'apk' # Replace with 'aab' to only publish the Android app bundle
```

## Publishing to Firebase App Distribution with Fastlane

{{<notebox>}}
If you use Firebase services, load the Firebase configuration files to Codemagic by saving them to [environment variables](/variables/environment-variable-groups/#storing-sensitive-valuesfiles). Copy/paste the contents of `google-services.json` and `GoogleService-Info.plist` and save them to the environment variables named `ANDROID_FIREBASE_SECRET` and `IOS_FIREBASE_SECRET` respectively. Click **Secure** to encrypt the values.
{{</notebox>}}

Make sure to encrypt `FIREBASE_TOKEN` as an environment variable. Check [documentation](https://firebase.google.com/docs/cli#cli-ci-systems) for details.

Before running a lane, you should install Fastlane Firebase app distribution plugin.

```yaml
- name: Install fastlane-plugin-firebase_app_distribution
  script: |
    gem install bundler
    sudo gem install fastlane-plugin-firebase_app_distribution --user-install
```

Then you need to call a lane. This code is similar for Android and iOS.

Android

```yaml
- name: Execute fastlane android publishing task
  script: |
    cd android
    bundle install
    bundle exec fastlane <your_android_lane>
```

iOS

```yaml
- name: Execute fastlane ios publishing task
  script: |
    cd ios
    bundle install
    bundle exec fastlane <your_ios_lane>
```

## Publishing an Android app to Firebase App Distribution with Gradle

{{<notebox>}}
If you use Firebase services, load the Firebase configuration files to Codemagic by saving them to [environment variables](/variables/environment-variable-groups/#storing-sensitive-valuesfiles). Copy/paste the contents of `google-services.json` and `GoogleService-Info.plist` and save them to the environment variables named `ANDROID_FIREBASE_SECRET` and `IOS_FIREBASE_SECRET` respectively. Click **Secure** to encrypt the values.
{{</notebox>}}

To authorize an application for Firebase App Distribution, use [Google service account](https://firebase.google.com/docs/app-distribution/android/distribute-gradle#authenticate_using_a_service_account).
Encrypt and add to environment variables these credentials (the file is named something like `yourappname-6e632def9ad4.json`) as `GOOGLE_APP_CREDENTIALS`. Specify the filepath in your `build.gradle` in `firebaseAppDistribution` as `serviceCredentialsFile="your/file/path.json"`.

```gradle
buildTypes {
    ...
    release {
        ...
        firebaseAppDistribution {
            ...
            serviceCredentialsFile="<your/file/path.json>"
        }
    }
```

Note that in case the credentials file is not specified in `firebaseAppDistribution` build type, it will search the filepath in `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

Decode application credentials for Firebase authorization:

```bash
echo $GOOGLE_APP_CREDENTIALS | base64 --decode > $FCI_BUILD_DIR/your/file/path.json
```

Build the application:

```yaml
- echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
- flutter packages pub get
- flutter build apk --release
```

Call the `gradlew` task for distribution

```yaml
- name: Distribute app to firebase with gradle plugin
  script: cd android && ./gradlew appDistributionUploadRelease
```

{{<notebox>}}

If you didn't specify `serviceCredentialsFile`, you may export it to a random location like `/tmp/google-application-credentials.json`

```bash
echo $GOOGLE_APP_CREDENTIALS | base64 --decode > /tmp/google-application-credentials.json
```

And then export the file path on the gradlew task

```yaml
- name: Distribute app to firebase with gradle plugin
  script: |
    export GOOGLE_APPLICATION_CREDENTIALS=/tmp/google-application-credentials.json
    cd android && ./gradlew appDistributionUploadRelease
```

{{</notebox>}}

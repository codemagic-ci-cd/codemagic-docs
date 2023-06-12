---
title: Firebase App Distribution with codemagic.yaml
linkTitle: Firebase App Distribution
description: How to deploy an app to Firebase App Distribution using codemagic.yaml
weight: 5
---

</p>
{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **codemagic.yaml**. If your workflow is configured with **Flutter workflow editor**, please go to [Publishing an app to Firebase App Distribution with Flutter workflow editor](../publishing/firebase-app-distribution).
{{</notebox>}}

### Requirements

For distributing an iOS application to [Firebase Console](https://console.firebase.google.com/), your application must use a development, Ad Hoc or Enterprise distribution profile.

To authenticate with Firebase, Codemagic requires either a **Firebase token** or a service account with **Firebase App Distribution Admin** role, as shown below:


#### 1. Authenticating via service account

{{< include "/partials/firebase-authentication-service-account.md" >}}

#### 2. Authenticating via token
{{<notebox>}}
**Warning:** Firebase has marked authentication via token as deprecated and might disable it in future versions of `firebase tool`. Please authenticate using a service account, as described below.
{{</notebox>}}

To retrieve your Firebase token, follow the instructions in [Firebase documentation](https://firebase.google.com/docs/cli#cli-ci-systems).

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `FIREBASE_TOKEN`.
3. Enter the token value as **_Variable value_**.
4. Enter the variable group name, e.g. **_firebase_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.




### Distribution to Firebase

Example configuration for publishing Android and iOS artifacts to Firebase:

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  firebase:
    # use this line to authenticate via service account
    firebase_service_account: $FIREBASE_SERVICE_ACCOUNT
    
    # or this line to authenticate via token:
    # firebase_token: $FIREBASE_TOKEN
  
    android:
      # Add your Android app id retrieved from Firebase console
      app_id: x:xxxxxxxxxxxx:android:xxxxxxxxxxxxxxxxxxxxxx 
      
      # Add one or more groups that you wish to distribute your Android application to.
      # You can create groups in the Firebase console
      groups: 
        - androidTesters
        - ...

    ios:
      # Add your iOS app id retrieved from Firebase console
      app_id: x:xxxxxxxxxxxx:ios:xxxxxxxxxxxxxxxxxxxxxx 
      
      # Add one or more groups that you wish to distribute your iOS application to.
      # You can create groups in the Firebase console
      groups:
        - iosTesters
        - ...
{{< /highlight >}}


If you wish to pass release notes with your build, create a `release_notes.txt` file and add it to the project working directory, which is either the repository root directory or the Project path specified in the Build section in your workflow settings. Codemagic will fetch the content of that file and publish it with the build.

In order to distribute an `.aab` to testers via Firebase App Distribution, your Firebase project must be linked to your Google Play account. More information is available [here](https://firebase.google.com/docs/app-distribution/android/distribute-console?apptype=aab#before_you_begin)

#### Publishing only the Android app bundle or APK artifact to Firebase App Distribution

If you are building both an Android app bundle and an APK in your workflow, Codemagic will, by default, try to publish the bundle to Firebase App Distribution. If you wish to publish the APK, specify the artifact type as `apk` using the `artifact_type` field. 

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  firebase:
    firebase_service_account: $FIREBASE_SERVICE_ACCOUNT
    android:
      app_id: x:xxxxxxxxxxxx:android:xxxxxxxxxxxxxxxxxxxxxx
      groups:
        - androidTesters
        - ...
      artifact_type: 'apk' # Replace with 'aab' to only publish the Android app bundle
{{< /highlight >}}




## Publishing to Firebase App Distribution with Fastlane

Before running a lane, you should install Fastlane Firebase app distribution plugin.

{{< highlight yaml "style=paraiso-dark">}}
- name: Install fastlane-plugin-firebase_app_distribution
  script: | 
    gem install bundler
    sudo gem install fastlane-plugin-firebase_app_distribution --user-install
{{< /highlight >}}


Then you need to call a lane. This code is similar for Android and iOS.

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
- name: Execute fastlane android publishing task
  script: | 
    cd android
    bundle install
    bundle exec fastlane <your_android_lane>
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
- name: Execute fastlane ios publishing task
  script: | 
    cd ios
    bundle install
    bundle exec fastlane <your_ios_lane>
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}




## Publishing an Android app to Firebase App Distribution with Gradle

Make sure you have added the `FIREBASE_SERVICE_ACCOUNT` and `GOOGLE_APPLICATION_CREDENTIALS` variables as described above.


1. Specify the filepath in your `build.gradle` file under `firebaseAppDistribution` section as `serviceCredentialsFile="your/file/path.json"`. If you followed this guide, the path is already saved in `GOOGLE_APPLICATION_CREDENTIALS` variable

{{< highlight Groovy "style=paraiso-dark">}}
buildTypes {
    ...
    release {
        ...
        firebaseAppDistribution {
            ...
            serviceCredentialsFile=System.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        }
    }
{{< /highlight >}}

2. In your root-level (project-level) Gradle file (usually android/build.gradle), add the App Distribution Gradle plugin as a buildscript dependency:

{{< highlight groovy "style=paraiso-dark">}}
buildscript {
  repositories {
    // Make sure that you have the following two repositories
    google()  // Google's Maven repository
    mavenCentral()  // Maven Central repository
  }

  dependencies {
      ...
      classpath("com.android.tools.build:gradle:7.2.0")

      // Make sure that you have the Google services Gradle plugin dependency
      classpath("com.google.gms:google-services:4.3.15")

      // Add the dependency for the App Distribution Gradle plugin
      classpath("com.google.firebase:firebase-appdistribution-gradle:4.0.0")
  }
}
{{< /highlight >}}

3. In your module (app-level) Gradle file (usually android/app/build.gradle), add the App Distribution Gradle plugin, and make sure is located below **com.android.application** plugin because the sequence of applying plugin matters:

{{< highlight groovy "style=paraiso-dark">}}
apply plugin: 'com.android.application'
apply plugin: 'com.google.firebase.appdistribution'
{{< /highlight >}}

4. Decode application credentials for Firebase authorization:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  -name: Decode Google credentials
   script: | 
     echo $FIREBASE_SERVICE_ACCOUNT > $GOOGLE_APPLICATION_CREDENTIALS
{{< /highlight >}}


5. Build the application:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  -name: Build the app
   script: | 
     echo "flutter.sdk=$HOME/programs/flutter" > "$CM_BUILD_DIR/android/local.properties"
     flutter packages pub get
     flutter build apk --release
{{< /highlight >}}


6. Call the **gradlew** task for distribution

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  -name: Distribute app to firebase with gradle plugin
   script: | 
     cd android && ./gradlew appDistributionUploadRelease
{{< /highlight >}}

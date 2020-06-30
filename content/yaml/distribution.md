---
title: Publishing
description: Code signing and publishing with YAML.
weight: 8
---

## Setting up code signing for iOS

In order to use **automatic code signing** and have Codemagic manage signing certificates and provisioning profiles on your behalf, you need to configure API access to App Store Connect and define the environment variables listed below. Make sure to [encrypt](#encrypting-sensitive-data) the values of the variables before adding them to the configuration file.

* `APP_STORE_CONNECT_PRIVATE_KEY`

  It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api). To do so:

  1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
  2. Click on the '+' sign to generate a new API key.
  3. Enter the name for the key and select an access level (`Admin` or `Developer`).
  4. Click **Generate**.
  5. As soon as the key is generated, you can see it added in the list of active keys. Click **Download API Key** to save the private key. Note that the key can only be downloaded once.

* `APP_STORE_CONNECT_KEY_IDENTIFIER`

  In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

* `APP_STORE_CONNECT_ISSUER_ID`

  In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

* `CERTIFICATE_PRIVATE_KEY`

  A RSA 2048 bit private key to be included in the [signing certificate](https://help.apple.com/xcode/mac/current/#/dev1c7c2c67d) that Codemagic creates. You can use an existing key or create a new 2048 bit RSA key by running the following command in your terminal:

      ssh-keygen -t rsa -b 2048 -f ~/Desktop/codemagic_private_key -q -N ""

{{<notebox>}}
Alternatively, each property can be specified in the scripts section as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}

In order to use **manual code signing**, [encrypt](../yaml/yaml/#encrypting-sensitive-data) your signing certificate, the certificate password (if the certificate is password-protected) and the provisioning profile, and set the encrypted values to the following environment variables:

    CM_CERTIFICATE: Encrypted(...)
    CM_CERTIFICATE_PASSWORD: Encrypted(...)
    CM_PROVISIONING_PROFILE: Encrypted(...)

## Publishing

`publishing:` for every successful build, you can publish the generated artifacts to external services. The available integrations currently are email, Slack, Google Play, App Store Connect and Codemagic Static Pages.

    publishing:
      email:
        recipients:
          - name@example.com
      slack:
        channel: '#channel-name'
        notify_on_build_start: true
      google_play:                        # For Android app
        credentials: Encrypted(...)
        track: alpha
      app_store_connect:                  # For iOS app
        app_id: '...'                     # App's unique identifier in App Store Connect
        apple_id: name@example.com        # Email address used for login
        password: Encrypted(...)          # App-specific password

<!---Firebase app distribution can be done with a [custom script](../yaml/running-a-custom-script). [TODO: Stas will add this example on Monday]--->

### Publish an app to Firebase App Distribution

If you use a Firebase service, encrypt `google-services.json` as `ANDROID_FIREBASE_SECRET` environment variable for Android
or `GoogleService-Info.plist` as `IOS_FIREBASE_SECRET` for iOS.

    echo $ANDROID_FIREBASE_SECRET | base64 --decode > $FCI_BUILD_DIR/android/app/google-services.json
    echo $IOS_FIREBASE_SECRET | base64 --decode > $FCI_BUILD_DIR/ios/Runner/GoogleService-Info.plist

#### Publish an app using Firebase CLI

Make sure to encrypt `FIREBASE_TOKEN` as an environment variable. Check [documentation](https://firebase.google.com/docs/cli#cli-ci-systems) for details.

Android

    - |
      # publish the app to Firebase App Distribution
      apkPath=$(find build -name "*.apk" | head -1)
      echo "Found apk at $apkPath"
        
      if [[ -z ${apkPath} ]]
      then
        echo "No apks were found, skip publishing to Firebase App Distribution"
      else
        echo "Publishing $apkPath to Firebase App Distribution"
        firebase appdistribution:distribute --app <your_android_application_firebase_id> --groups <your_android_testers_group> $apkPath
      fi  

iOS

    - |
      # publish the app to Firebase App Distribution
      ipaPath=$(find build -name "*.ipa" | head -1)
      echo "Found ipa at $ipaPath"

      if [[ -z ${ipaPath} ]]
      then
        echo "No ipas were found, skip publishing to Firebase App Distribution"
      else
        echo "Publishing $ipaPath to Firebase App Distribution"
        firebase appdistribution:distribute --app <your_ios_application_firebase_id> --groups <your_ios_testers_group> $ipaPath
      fi 



#### Publish an Android app with Gradle

To authorize an application for Firebase App Distribution, use [Google service account](https://firebase.google.com/docs/app-distribution/android/distribute-gradle#authenticate_using_a_service_account).
Encrypt and add to environment variables these credentials (the file is named something like `yourappname-6e632def9ad4.json`) as `GOOGLE_APP_CREDENTIALS`. Specify the filepath in your `build.gradle` in `firebaseAppDistribution` as `serviceCredentialsFile="your/file/path.json"`.

    buildTypes {
        ...
        release {
            ...
            firebaseAppDistribution {
                ...
                serviceCredentialsFile="<your/file/path.json>"
            }
        }

 Note that in case the credentials file is not specified in `firebaseAppDistribution` build type, it will search the filepath in `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

Decode application credentials for Firebase authorization

    echo $GOOGLE_APP_CREDENTIALS | base64 --decode > $FCI_BUILD_DIR/you/file/path.json

Build the application

    - |
        # set up local properties
        echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
    - flutter packages pub get
    - flutter build apk --release

Call the gradlew task for distribution

    - |
        # distribute app to firebase with gradle plugin
        cd $FCI_BUILD_DIR/android
        ./gradlew appDistributionUploadRelease

{{<notebox>}}

If you didn't specify `serviceCredentialsFile`, you may export it to random location like `/tmp/google-application-credentials.json`

    echo $GOOGLE_APP_CREDENTIALS | base64 --decode > /tmp/google-application-credentials.json

And then export the filepath on the gradlew task

    - |
        # distribute app to firebase with gradle plugin
        export GOOGLE_APPLICATION_CREDENTIALS=/tmp/google-application-credentials.json
        cd $FCI_BUILD_DIR/android
        ./gradlew appDistributionUploadRelease

{{</notebox>}}


## Examples

More detailed examples about using YAML for code signing and publishing can be found here:

* <a href="https://blog.codemagic.io/distributing-module-yaml/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','distributing-module-yaml')">Native Android project</a>
* <a href="https://blog.codemagic.io/distributing-native-ios-sdk-with-flutter-module-using-codemagic/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','distributing-native-ios-sdk-with-flutter-module-using-codemagic/')">Native iOS project</a>
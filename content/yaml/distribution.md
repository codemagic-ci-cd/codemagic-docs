---
title: Code signing and publishing
description: Code signing and publishing with YAML.
weight: 8
---

All Android and iOS applications have to be digitally signed before release to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. In the case of mobile apps, this means that users can be assured that the apps they download from the App Store Connect or Google Play Store are from developers they can trust.

For iOS, we use Codemagic CLI tools to perform code signing and publishing for iOS apps - these tools are open source and can also be [used locally](../yaml/runninglocally/) or in other environments. Android applications are usually signed using Gradle. This page here covers the most common scripts, but different options for code signing have also been covered extensively on our blog. For example, there is a [blog post](https://blog.codemagic.io/distributing-native-ios-sdk-with-flutter-module-using-codemagic/) about code signing iOS apps with `codemagic.yaml`. There are also [step-by-step instructions](https://blog.codemagic.io/the-simple-guide-to-android-code-signing/) available on our blog for Android code signing.

All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play and App Store Connect. It is also possible to publish elsewhere with custom scripts - for example, in addition to traditional solutions, there are also some examples about Firebase App Distribution [below](../yaml/distribution/#publishing).

## Setting up code signing for iOS

{{<notebox>}}
Codemagic uses the [keychain](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/keychain/README.md#keychain) utility to manage macOS keychains and certificates.
{{</notebox>}}

In order to use **automatic code signing** and have Codemagic manage signing certificates and provisioning profiles on your behalf, you need to configure API access to App Store Connect and define the environment variables listed below. Make sure to [encrypt](#encrypting-sensitive-data) the values of the variables before adding them to the configuration file.

* `APP_STORE_CONNECT_PRIVATE_KEY`

  It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api). To do so:

  1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
  2. Click on the + sign to generate a new API key.
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

### Setting up manual code signing

With the manual code signing method, you are required to upload the signing certificate and the matching provisioning profile(s) to Codemagic in order to receive signed builds.

    - find . -name "Podfile" -execdir pod install \;
    - keychain initialize
    - |
      # set up provisioning profiles
      PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
      mkdir -p "$PROFILES_HOME"
      PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
      echo ${CM_PROVISIONING_PROFILE} | base64 --decode > $PROFILE_PATH
      echo "Saved provisioning profile $PROFILE_PATH"
    - |
      # set up signing certificate
      echo $CM_CERTIFICATE | base64 --decode > /tmp/certificate.p12

      # when using a password-protected certificate
      keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
      # when using a certificate that is not password-protected
      keychain add-certificates --certificate /tmp/certificate.p12

### Setting up automatic code signing

{{<notebox>}}
Codemagic uses the [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md#app-store-connect) utility for generating and managing certificates and provisioning profiles and performing code signing.
{{</notebox>}}

    - find . -name "Podfile" -execdir pod install \;
    - keychain initialize
    - app-store-connect fetch-signing-files "io.codemagic.app" \  # Fetch signing files for specified bundle ID (use "$(xcode-project detect-bundle-id)" if not specified)
      --type IOS_APP_DEVELOPMENT \  # Specify provisioning profile type*
      --create  # Allow creating resources if existing are not found.
    - keychain add-certificates

The available provisioning profile types are described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store).

## Setting up code signing for Android

The following templates show code signing using `key.properties`.

### Set up default debug key.properties

    - |
      # set up debug key.properties
      keytool -genkeypair \
        -alias androiddebugkey \
        -keypass android \
        -keystore ~/.android/debug.keystore \
        -storepass android \
        -dname 'CN=Android Debug,O=Android,C=US' \
        -keyalg 'RSA' \
        -keysize 2048 \
        -validity 10000

### Set up code signing with user specified keys

In order to do code signing [encrypt](../yaml/yaml/#encrypting-sensitive-data) your keystore file, keystore password (if keystore is password protected), key alias and key alias password (if key alias is password protected) and set the encrypted values to the following environment variables:

    CM_KEYSTORE: Encrypted(...)
    CM_KEYSTORE_PASSWORD: Encrypted(...)
    CM_KEY_ALIAS_USERNAME: Encrypted(...)
    CM_KEY_ALIAS_PASSWORD: Encrypted(...)

Use the following script:

    - |
      # set up key.properties
      echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
      cat >> "$FCI_BUILD_DIR/project_directory/android/key.properties" <<EOF
      storePassword=$CM_KEYSTORE_PASSWORD
      keyPassword=$CM_KEY_ALIAS_PASSWORD
      keyAlias=$CM_KEY_ALIAS_USERNAME
      storeFile=/tmp/keystore.keystore
      EOF

## Publishing

`publishing:` for every successful build, you can publish the generated artifacts to external services. The available integrations currently are email, Slack, Google Play and App Store Connect.

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

### Publishing a Flutter package to pub.dev

In order to get publishing permissions, first you will need to log in to pub.dev locally. It can be done with running `pub publish --dry-run`.
After that `credentials.json` will be generated which you can use to log in without the need of Google confirmation through browser.

`credentials.json` can be found in the pub cache directory (`~/.pub-cache/credentials.json` on MacOS and Linux, `%APPDATA%\Pub\Cache\credentials.json` on Windows)

    - echo $CREDENTIALS | base64 --decode > "$FLUTTER_ROOT/.pub-cache/credentials.json"
    - flutter pub publish --dry-run
    - flutter pub publish -f

### Publishing an app to Firebase App Distribution

If you use a Firebase service, encrypt `google-services.json` as `ANDROID_FIREBASE_SECRET` environment variable for Android
or `GoogleService-Info.plist` as `IOS_FIREBASE_SECRET` for iOS.

    echo $ANDROID_FIREBASE_SECRET | base64 --decode > $FCI_BUILD_DIR/android/app/google-services.json
    echo $IOS_FIREBASE_SECRET | base64 --decode > $FCI_BUILD_DIR/ios/Runner/GoogleService-Info.plist

#### Publishing an app using Firebase CLI

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

#### Publishing an app with Fastlane

Make sure to encrypt `FIREBASE_TOKEN` as an environment variable. Check [documentation](https://firebase.google.com/docs/cli#cli-ci-systems) for details.

Before running a lane, you should install Fastlane Firebase app distribution plugin

        - |
          # install fastlane-plugin-firebase_app_distribution
          gem install bundler
          sudo gem install fastlane-plugin-firebase_app_distribution --user-install

Then you need to call a lane. This code is similar for Android and iOS.

Android

    - |
      # execute fastlane android publishing task
      cd android
      bundle install
      bundle exec fastlane <your_android_lane>

iOS

    - |
      # execute fastlane ios publishing task
      cd ios
      bundle install
      bundle exec fastlane <your_ios_lane>


#### Publishing an Android app with Gradle

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

Decode application credentials for Firebase authorization:

    echo $GOOGLE_APP_CREDENTIALS | base64 --decode > $FCI_BUILD_DIR/your/file/path.json

Build the application:

    - |
        # set up local properties
        echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
    - flutter packages pub get
    - flutter build apk --release

Call the `gradlew` task for distribution

    - |
        # distribute app to firebase with gradle plugin
        cd android
        ./gradlew appDistributionUploadRelease

{{<notebox>}}

If you didn't specify `serviceCredentialsFile`, you may export it to random location like `/tmp/google-application-credentials.json`

    echo $GOOGLE_APP_CREDENTIALS | base64 --decode > /tmp/google-application-credentials.json

And then export the filepath on the gradlew task

    - |
        # distribute app to firebase with gradle plugin
        export GOOGLE_APPLICATION_CREDENTIALS=/tmp/google-application-credentials.json
        cd android
        ./gradlew appDistributionUploadRelease

{{</notebox>}}

## Examples

More detailed examples about using YAML for code signing and publishing can be found here:

* <a href="https://blog.codemagic.io/distributing-module-yaml/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','distributing-module-yaml')">Native Android project</a>
* <a href="https://blog.codemagic.io/distributing-native-ios-sdk-with-flutter-module-using-codemagic/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','distributing-native-ios-sdk-with-flutter-module-using-codemagic/')">Native iOS project</a>
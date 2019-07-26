---
categories:
  - Code signing
date: '2019-03-10T22:52:07+02:00'
description: Sign your Android app for publishing to Google Play Store
title: Android code signing
weight: 2
---

Code signing is required for distributing your Android app to Google Play store. It enables to identify who developed the app and ensure that all updates to the app come from you.

## Requirements

To receive a signed release APK of your app on Codemagic, you will have to 1) [prepare your Flutter project for code signing](https://docs.codemagic.io/code-signing/android-code-signing/#preparing-your-flutter-project-for-code-signing), and 2) [set up Android code signing in Codemagic UI](https://docs.codemagic.io/code-signing/android-code-signing/#setting-up-android-code-signing-on-codemagic).

For code signing, you need to upload the **keystore** containing your **certificate** and **key**. See the instructions for generating the keystore [here](#generating-a-keystore).

As a keystore can hold multiple keys, each key in it must have an **alias**. Both the keystore file and the key alias are protected by **passwords**.

{{% notebox %}}

Please note that every app must be signed using the same key throughout its lifespan.

{{% /notebox %}}

## Generating a keystore

You can create a keystore for signing your release builds with the Java Keytool utility by running the following command:

    keytool -genkey -v -keystore keystore_name.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

Keytool then prompts you to enter your personal details for creating the certificate, provide an alias for the key as well as provide passwords for the keystore and the key. It then generates the keystore as a file called **keystore_name.keystore** in the directory you're in. The key is valid for 10,000 days.

You need to upload the keystore and provide the keystore password, key alias and key password to have Codemagic sign your Android app on your behalf.

## Preparing your Flutter project for code signing

There are several approaches you can use to prepare your Flutter project for code signing, we have described two of these in this section. Note that whichever approach you use, you still need to [set up Android code signing](https://docs.codemagic.io/code-signing/android-code-signing/#setting-up-android-code-signing-on-codemagic) in the Codemagic UI.

### Configure signing in build.gradle

You can follow the instructions in [Flutter’s documentation](https://flutter.io/docs/deployment/android#signing-the-app) to configure code signing in Gradle. It's vital that you use the variable names suggested in Flutter documentation as Codemagic will reference them during the build. However, make sure to not commit your `key.properties` file to the repository, Codemagic will generate and populate the `key.properties` file during the build based on the input you provide in the UI.

### Configure signing using environment variables

Alternatively, you can use [environment variables](https://docs.codemagic.io/building/environment-variables/ 'Environment variables') to prepare your app for code signing.

1.  Set the following environment variables in Codemagic (using the values from generating your keystore file):

        FCI_KEYSTORE_PASSWORD=myKeystorePassword
        FCI_KEY_ALIAS=MyReleaseKey
        FCI_KEY_PASSWORD=myKeypassword

2.  Upload the contents of your base64-encoded keystore file to Codemagic as an environment variable with the name `FCI_KEYSTORE_FILE`.
3.  Add a custom script for decoding the keystore file stored in `FCI_KEYSTORE_FILE`. For example, click on the + icon before **Test** and paste the following script into the **Post-clone script** field:

        #!/usr/bin/env sh
        set -e # exit on first failed commandset
        echo $FCI_KEYSTORE_FILE | base64 --decode > $FCI_BUILD_DIR/keystore.jks

4.  Set your signing configuration in `build.gradle` as follows:

```
      ...
       android {
           ...
           defaultConfig { ... }

           signingConfigs {
               release {
                   if (System.getenv()["CI"]) { // CI=true is exported by Codemagic
                       storeFile file(System.getenv()["FCI_BUILD_DIR"] + "/keystore.jks")
                       storePassword System.getenv()["FCI_KEYSTORE_PASSWORD"]
                       keyAlias System.getenv()["FCI_KEY_ALIAS"]
                       keyPassword System.getenv()["FCI_KEY_PASSWORD"]
                   } else {
                       storeFile file("/path/to/local/myreleasekey.keystore")
                       storePassword "password"
                       keyAlias "MyReleaseKey"
                       keyPassword "password"
                   }
               }
           }

           buildTypes {
               release {
                   ...
                   signingConfig signingConfigs.release
               }
           }
       }
       ...
```

## Setting up Android code signing on Codemagic

You are required to upload your keystore file and provide details about your key in order to receive signed builds on Codemagic.

{{< figure size="" src="/uploads/2019/03/code signing.PNG" caption="" >}}

1. Navigate to the Publish section in app settings.
2. Click **Android code signing**.
3. Upload your release keystore file.
4. Enter the **keystore password**, **key alias** and **key password**.
5. Click **Save** to finish the setup.

{{% notebox %}}Please note that every app must be signed using the same key throughout its lifespan. {{% /notebox %}}

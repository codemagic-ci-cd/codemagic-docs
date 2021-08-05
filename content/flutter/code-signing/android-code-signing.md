---
description: How to set up Android code signing in the Flutter workflow editor
title: Android code signing
weight: 3
---

Code signing is required for distributing your Android app to the Google Play store. It enables to identify who developed the app and ensure that all updates to the app come from you.

{{<notebox>}}
This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml** please go to [Signing Android apps using codemagic.yaml](../code-signing-yaml/signing-android).
{{</notebox>}}

## Requirements

To receive a signed release .apk of your app on Codemagic, you will have to:

1. [Prepare your Flutter project for code signing](#preparing-your-flutter-project-for-code-signing)

2. [Set up Android code signing in the Flutter workflow editor](#setting-up-android-code-signing-on-codemagic)

For code signing, you need to upload the **keystore** containing your **certificate** and **key**. See the instructions for generating the keystore [here](#generating-a-keystore).

As a keystore can hold multiple keys, each key in it must have an **alias**. Both the keystore file and the key alias are protected by **passwords**.

{{<notebox>}}

- Please note that every app must be signed using the same key throughout its lifespan.
- If you're building Android App Bundles, you additionally need to [enroll your app into app signing by Google Play](https://support.google.com/googleplay/android-developer/answer/7384423).

{{</notebox>}}

## Generating a keystore

You can create a keystore for signing your release builds with the Java Keytool utility by running the following command:

```bash
keytool -genkey -v -keystore keystore_name.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias alias_name
```

Keytool then prompts you to enter your personal details for creating the certificate, as well as provide passwords for the keystore and the key. It then generates the keystore as a file called **keystore_name.jks** in the directory you're in. The key is valid for 10,000 days.

You need to upload the keystore and provide the keystore password, key alias and key password to have Codemagic sign your Android app on your behalf.

## Preparing your Flutter project for code signing

There are several approaches you can use to prepare your Flutter project for code signing, we have described two of these in this section. Note that whichever approach you use, you still need to [set up Android code signing](#setting-up-android-code-signing-on-codemagic) in the Flutter workflow editor.

### Option 1. Configure signing following Flutter's documentation

You can follow the instructions in [Flutter's documentation](https://flutter.dev/docs/deployment/android#signing-the-app) to configure code signing in Gradle. It's vital that you use the variable names suggested in Flutter documentation as Codemagic will reference them during the build. However, make sure to not commit your `key.properties` file to the repository, Codemagic will generate and populate the `key.properties` file during the build based on the input you provide in the workflow editor.

### Option 2. Configure signing using environment variables

Alternatively, you can use [environment variables](../building/environment-variables/ 'Environment variables') to prepare your app for code signing.

Set your signing configuration in `build.gradle` as follows:

```gradle
...
android {
    ...
    defaultConfig { ... }

    signingConfigs {
        release {
            if (System.getenv()["CI"]) { // CI=true is exported by Codemagic
                storeFile file(System.getenv()["FCI_KEYSTORE_PATH"])
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

1. Navigate to the **Distribution** section in app settings.
2. Click **Android code signing**.
3. Upload your release keystore file.
4. Enter the **keystore password**, **key alias** and **key password**.
5. Select **Enable Android code signing** at the top of the section to enable code signing.


{{< youtube lYp9MAfouXE >}}

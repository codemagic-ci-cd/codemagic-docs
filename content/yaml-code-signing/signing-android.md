---
title: Signing Android apps
description: How to set up Android code signing in codemagic.yaml
weight: 3
aliases: /code-signing-yaml/signing-android
---

All Android applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. There are several ways to set up code signing for Android apps.

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**. If your workflow is configured with **Flutter workflow editor** please go to [Signing Android apps using the Flutter workflow editor](../code-signing/android-code-signing).
{{</notebox>}}

## Signing Android apps using Gradle

This example shows how to set up code signing using Gradle.

1. Set your signing configuration in `build.gradle` as follows:

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
2. Add your keystore and keystore details in the `Environment variables` section of the Codemagic UI. [`Secure`](../building/encrypting/#encrypting-sensitive-data) your keystore file, keystore password (if keystore is password-protected), key alias and key alias password (if key alias is password-protected) and set the values to the following environment variables. Note that securing files requires you to [`base64 encode`](https://docs.codemagic.io/variables/environment-variable-groups/#global-variables-and-secrets) them locally and decode them during the build.

```yaml
 environment:
      groups:
        - keystore_credentials  # <-- (Includes: FCI_KEYSTORE_PATH, FCI_KEYSTORE, FCI_KEYSTORE_PASSWORD, FCI_KEY_PASSWORD, FCI_KEY_ALIAS)
```

3. In the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, you will need to decode the keystore file and add it before the build command. You can choose any path to your keystore file. For example:

```yaml
scripts:
  - name: Build Android
    script: |
      echo $FCI_KEYSTORE | base64 --decode > $FCI_KEYSTORE_PATH
      cd android && ./gradlew assembleRelease
```

## Signing Android apps using key.properties

The following templates show code signing using `key.properties`.

### Set up default debug key.properties

```yaml
- name: Set up debug key.properties
  script: |
    keytool -genkeypair \
      -alias androiddebugkey \
      -keypass android \
      -keystore ~/.android/debug.keystore \
      -storepass android \
      -dname 'CN=Android Debug,O=Android,C=US' \
      -keyalg 'RSA' \
      -keysize 2048 \
      -validity 10000
```
### Set up code signing with user-specified keys

In order to do code signing [`Secure`](../building/encrypting/#encrypting-sensitive-data) your keystore file, keystore password (if keystore is password-protected), key alias and key alias password (if key alias is password-protected) and set the values to the following environment variables.:

```
FCI_KEYSTORE_PATH: /tmp/keystore.keystore
FCI_KEYSTORE
FCI_KEYSTORE_PASSWORD
FCI_KEY_ALIAS
FCI_KEY_PASSWORD
```

Use the following script:

```yaml
- name: Set up key.properties
  script: |
    echo $FCI_KEYSTORE | base64 --decode > $FCI_KEYSTORE_PATH
    cat >> "$FCI_BUILD_DIR/project_directory/android/key.properties" <<EOF
    storePassword=$FCI_KEYSTORE_PASSWORD
    keyPassword=$FCI_KEY_PASSWORD
    keyAlias=$FCI_KEY_ALIAS
    storeFile=$FCI_KEYSTORE_PATH
    EOF
```

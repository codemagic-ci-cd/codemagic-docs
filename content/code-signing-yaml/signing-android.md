---
title: Signing Android apps
description: How to set up code signing in codemagic.yaml
weight: 2
---

All Android applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. There are several ways to set up code signing for Android apps.

## Signing Android apps using Gradle

This example shows how to set up code signing using Gradle.

1. Set your signing configuration in `build.gradle` as follows:

```
...
  android {
      ...
      defaultConfig { ... }

      signingConfigs {
          release {
              if (System.getenv()["CI"]) { // CI=true is exported by Codemagic
                  storeFile file(System.getenv()["CM_KEYSTORE_PATH"])
                  storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]
                  keyAlias System.getenv()["CM_KEY_ALIAS"]
                  keyPassword System.getenv()["CM_KEY_ALIAS_PASSWORD"]
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
2. Add your keystore and keystore details in the [`environment`](../getting-started/yaml#environment) section of the configuration file. [Encrypt](../building/encrypting/#encrypting-sensitive-data) your keystore file, keystore password (if keystore is password-protected), key alias and key alias password (if key alias is password-protected) and set the encrypted values to the following environment variables. Note that when encrypting files via UI, they will be base64 encoded and would have to be decoded during the build.

```  
environment:  
  CM_KEYSTORE: Encrypted(...)
  CM_KEYSTORE_PASSWORD: Encrypted(...)
  CM_KEY_ALIAS_USERNAME: Encrypted(...)
  CM_KEY_ALIAS_PASSWORD: Encrypted(...)
```

3. In the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, you will need to decode the keystore file and add it before the build command. You can choose any path to your keystore file. For example:

```
scripts:
  - name: Build Android
    script: |
      export CM_KEYSTORE_PATH="/tmp/keystore.keystore"
      echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
      cd android && ./gradlew assembleRelease
```

Pay attention to the fact that scripts are executed as separate processes and environment variables defined inside one script won't be accessible in another script. Therefore, if you want to access your `CM_KEYSTORE_PATH` variable from multiple scripts, it makes sense to define it in the `environment` section.

```
environment:  
  CM_KEYSTORE_PATH: /tmp/keystore.keystore
  CM_KEYSTORE: Encrypted(...)
  CM_KEYSTORE_PASSWORD: Encrypted(...)
  CM_KEY_ALIAS_USERNAME: Encrypted(...)
  CM_KEY_ALIAS_PASSWORD: Encrypted(...)
...
scripts:
  ...
  - name: Export keystore
    script: echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
  - name: Build Android
    script: cd android && ./gradlew assembleRelease
  ...
```

## Signing Android apps using key.properties

The following templates show code signing using `key.properties`.

### Set up default debug key.properties

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

### Set up code signing with user-specified keys

In order to do code signing [encrypt](../building/encrypting/#encrypting-sensitive-data) your keystore file, keystore password (if keystore is password protected), key alias and key alias password (if key alias is password protected) and set the encrypted values to the following environment variables:

    CM_KEYSTORE: Encrypted(...)
    CM_KEYSTORE_PASSWORD: Encrypted(...)
    CM_KEY_ALIAS_USERNAME: Encrypted(...)
    CM_KEY_ALIAS_PASSWORD: Encrypted(...)

Use the following script:

    - name: Set up key.properties
      script: |
        echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
        cat >> "$FCI_BUILD_DIR/project_directory/android/key.properties" <<EOF
        storePassword=$CM_KEYSTORE_PASSWORD
        keyPassword=$CM_KEY_ALIAS_PASSWORD
        keyAlias=$CM_KEY_ALIAS_USERNAME
        storeFile=/tmp/keystore.keystore
        EOF

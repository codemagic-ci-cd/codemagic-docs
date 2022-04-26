---
title: Signing Android apps
description: How to set up Android code signing in codemagic.yaml
weight: 3
aliases: /code-signing-yaml/signing-android
---

All Android applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. 

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**. If your workflow is configured with **Flutter workflow editor** please go to [Signing Android apps using the Flutter workflow editor](../code-signing/android-code-signing). There are several ways to set up code signing for Android apps.

If you are using [Codemagic Teams](../teams/teams), then signing files, such as Android keystores, can be managed under the [Code signing identities](./code-signing-identities) section in the team settings and do not have to be uploaded as environment variables as in the below instructions.
{{</notebox>}}


## Generating a keystore

You can create a keystore for signing your release builds with the Java Keytool utility by running the following command:

```bash
keytool -genkey -v -keystore keystore_name.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias alias_name
```

Keytool then prompts you to enter your personal details for creating the certificate, as well as provide passwords for the keystore and the key. It then generates the keystore as a file called **keystore_name.jks** in the directory you're in. The key is valid for 10,000 days.



Let's have a look at the 2 ways to set up code signing for Android apps:

## Signing Android apps using Gradle

This example shows how to set up code signing using Gradle.

- Set your signing configuration in `build.gradle` as follows:

```gradle
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
                  keyPassword System.getenv()["CM_KEY_PASSWORD"]
              } else {
                  keyAlias keystoreProperties['keyAlias']
                  keyPassword keystoreProperties['keyPassword']
                  storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                  storePassword keystoreProperties['storePassword']
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

{{<notebox>}}
Warning: Keep the key.properties file private; don’t check it into public source control.
{{</notebox>}}

- Save the keystore file, keystore password (if keystore is password-protected), key alias and key alias password (if key alias is password-protected) to the respective environment variables in the **Environment variables** section in Codemagic UI. Click **Secure** to encrypt the values. Note that binary files (i.e. keystore) have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to environment variables and decoded during the build.

```yaml
 environment:
      groups:
        - keystore_credentials
      # Add the above mentioned group environment variables in Codemagic UI (either in Application/Team variables)
        # CM_KEYSTORE_PATH 
        # CM_KEYSTORE
        # CM_KEYSTORE_PASSWORD
        # CM_KEY_PASSWORD
        # CM_KEY_ALIAS
```
{{<notebox>}}
Tip: Store all the keystore variables in the same group so they can be imported to codemagic.yaml workflow at once. 
  
If the group of variables is reusable for various applications, they can be defined in [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in **Team settings** for easier access.
{{</notebox>}}

- In the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, you will need to decode the keystore file and add it before the build command. You can choose any path to your keystore file. For example:

```yaml
scripts:
  - name: Build Android
    script: |
      echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH   # Not required if using team code signing identities
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

In order to code sign the build, save the keystore file, keystore password (if keystore is password-protected), key alias and key alias password (if key alias is password-protected) to the respective environment variables in the **Environment variables** section in Codemagic UI. Click **Secure** to encrypt the values. Note that binary files (i.e. keystore) have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to environment variables and decoded during the build:

```
CM_KEYSTORE_PATH: /tmp/keystore.keystore
CM_KEYSTORE
CM_KEYSTORE_PASSWORD
CM_KEY_ALIAS
CM_KEY_PASSWORD
```
```yaml
 environment:
      groups:
        - keystore_credentials
 ```
 
Use the following script:

```yaml
- name: Set up key.properties
  script: |
    echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH   # Not required if using team code signing identities
    cat >> "$CM_BUILD_DIR/project_directory/android/key.properties" <<EOF
    storePassword=$CM_KEYSTORE_PASSWORD
    keyPassword=$CM_KEY_PASSWORD
    keyAlias=$CM_KEY_ALIAS
    storeFile=$CM_KEYSTORE_PATH
    EOF
```

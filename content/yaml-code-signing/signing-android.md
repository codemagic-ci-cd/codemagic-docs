---
title: Signing Android apps
description: How to set up Android code signing in codemagic.yaml
weight: 3
aliases: /code-signing-yaml/signing-android
---

All Android applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. 


<br>

{{< youtube wPpGTY6Sis0 >}}
## Managing and uploading files

Team admin permissions are required to upload and edit files under the **Code signing identities** section. However, all team members can view the file info for any of the uploaded files.

### Generating a keystore

If you need to create a new keystore file for signing your release builds, you can do so with the Java Keytool utility by running the following command:

{{< highlight Shell "style=paraiso-dark">}}
keytool -genkey -v -keystore codemagic.keystore -storetype JKS \
        -keyalg RSA -keysize 2048 -validity 10000 -alias codemagic
{{< /highlight >}}

Keytool then prompts you to enter your personal details for creating the certificate, as well as provide passwords for the keystore and the key. It then generates the keystore as a file called **codemagic.keystore** in the directory you're in. The key is valid for 10,000 days.

### Uploading a keystore

1. Open your Codemagic Team settings, and go to  **codemagic.yaml settings** > **Code signing identities**.
2. Open **Android keystores** tab.
3. Upload the keystore file by clicking on **Choose a file** or by dragging it into the indicated frame.
4. Enter the **Keystore password**, **Key alias** and **Key password** values as indicated.
5. Enter the keystore **Reference name**. This is a unique name used to reference the file in `codemagic.yaml`
6. Click the **Add keystore** button to add the keystore.

For each of the added keystore, its common name, issuer, and expiration date are displayed.

{{<notebox>}}
**Note**: The uploaded keystore cannot be downloaded from Codemagic. It is crucial that you independently store a copy of the keystore file as all subsequent builds released to Google Play should be signed with the same keystore.

However, keep the keystore file private and do not check it into a public repository.
{{</notebox>}}


## Referencing keystores in codemagic.yaml

To tell Codemagic to fetch the uploaded keystores from the **Code signing identities** section during the build, list the reference of the uploaded keystore under the `android_signing` field.

#### Fetching a single keystore file

Add the following code to the `environment` section of your `codemagic.yaml` file:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    name: Android Workflow
    # ....
    environment:
      android_signing:
        - keystore_reference
{{< /highlight >}}

Default environment variables are assigned by Codemagic for the values on the build machine:

- Keystore path: `CM_KEYSTORE_PATH`
- Keystore password: `CM_KEYSTORE_PASSWORD`
- Key alias: `CM_KEY_ALIAS`
- Key alias password: `CM_KEY_PASSWORD`

#### Fetching multiple keystore files

When fetching multiple keystores during a build, it is necessary to explicitly set names for environment variables that will point to the file paths on the build machine.

{{< highlight yaml "style=paraiso-dark">}}
environment:
  android_signing:
    - keystore: keystore_reference_1
      keystore_environment_variable: THIS_KEYSTORE_PATH_ON_DISK_1
      keystore_password_environment_variable: THIS_KEYSTORE_PASSWORD_1
      key_alias_environment_variable: THIS_KEY_ALIAS_1
      key_password_environment_variable: THIS_KEY_PASSWORD_1
    - keystore: keystore_reference_2
      keystore_environment_variable: THIS_KEYSTORE_PATH_ON_DISK_2
      keystore_password_environment_variable: THIS_KEYSTORE_PASSWORD_2
      key_alias_environment_variable: THIS_KEY_ALIAS_2
      key_password_environment_variable: THIS_KEY_PASSWORD_2
{{< /highlight >}}


## Signing Android apps using Gradle

To sign your Android app, simply modify your **`android/app/build.gradle`** as follows:

{{< highlight Groovy "style=paraiso-dark">}}
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
{{< /highlight >}}


## Signing Android apps using user-specified keys

Instead of modifying the `build.gradle` file, you can use a script to re-create a keystore file on the build machine and use default signing method via `key.properties` file:

{{< highlight kotlin "style=paraiso-dark">}}
scripts:
  
  # ...

  - name: Set up key.properties
    script: | 
      cat >> "$CM_BUILD_DIR/project_directory/android/key.properties" <<EOF
      storePassword=$CM_KEYSTORE_PASSWORD
      keyPassword=$CM_KEY_PASSWORD
      keyAlias=$CM_KEY_ALIAS
      storeFile=$CM_KEYSTORE_PATH
      EOF    
{{< /highlight >}}

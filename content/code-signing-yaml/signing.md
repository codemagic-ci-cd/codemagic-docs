---
title: Code signing
description: How to set up code signing in codemagic.yaml
weight: 2
---

All Android and iOS applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

## Setting up code signing for iOS

Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership. You can upload your signing certificate and distribution profile to Codemagic to manage code signing yourself or use the automatic code signing option where Codemagic takes care of code signing and signing files management on your behalf. Read more about the two options below.

{{<notebox>}}
Under the hood, we use [Codemagic CLI tools](https://github.com/codemagic-ci-cd/cli-tools) to perform iOS code signing ⏤ these tools are open source and can also be [used locally](../building/running-locally/) or in other environments. Codemagic uses the [keychain](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/keychain/README.md#keychain) utility to manage macOS keychains and certificates.
{{</notebox>}}

### Setting up automatic code signing

In order to use **automatic code signing** and have Codemagic manage signing certificates and provisioning profiles on your behalf, you need to configure API access to App Store Connect and define the environment variables listed below. Make sure to [encrypt](../building/encrypting/#encrypting-sensitive-data) the values of the variables before adding them to the configuration file. Note that when encrypting files via the UI, they are base64 encoded and would have to be decoded during the build. 

* `APP_STORE_CONNECT_PRIVATE_KEY`

  It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api). To do so:

  1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
  2. Click on the + sign to generate a new API key.
  3. Enter the name for the key and select an access level (`Developer` or `App Manager`).
  4. Click **Generate**.
  5. As soon as the key is generated, you can see it added in the list of active keys. Click **Download API Key** to save the private key. Note that the key can only be downloaded once.

* `APP_STORE_CONNECT_KEY_IDENTIFIER`

  In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

* `APP_STORE_CONNECT_ISSUER_ID`

  In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

* `CERTIFICATE_PRIVATE_KEY`

  A RSA 2048 bit private key to be included in the [signing certificate](https://help.apple.com/xcode/mac/current/#/dev1c7c2c67d) that Codemagic creates. You can use an existing key or create a new 2048 bit RSA key by running the following command in your terminal:

      ssh-keygen -t rsa -b 2048 -m PEM -f ~/Desktop/codemagic_private_key -q -N ""

{{<notebox>}}
Alternatively, each property can be specified in the scripts section as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}

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

### Setting up manual code signing

In order to use **manual code signing**, [encrypt](../building/encrypting/#encrypting-sensitive-data) your signing certificate, the certificate password (if the certificate is password-protected) and the provisioning profile, and set the encrypted values to the following environment variables:

    CM_CERTIFICATE: Encrypted(...)
    CM_CERTIFICATE_PASSWORD: Encrypted(...)
    CM_PROVISIONING_PROFILE: Encrypted(...)

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

In order to do code signing [encrypt](../building/encrypting/#encrypting-sensitive-data) your keystore file, keystore password (if keystore is password protected), key alias and key alias password (if key alias is password protected) and set the encrypted values to the following environment variables:

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

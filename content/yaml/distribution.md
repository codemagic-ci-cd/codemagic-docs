---
title: Distribution
description: Code signing and publishing with YAML.
weight: 2
---

### Setting up code signing for iOS

In order to use **automatic code signing** and have Codemagic manage signing certificates and provisioning profiles on your behalf, you need to configure API access to App Store Connect and define the environment variables listed below. Make sure to [encrypt](#encrypting-sensitive-data) the values of the variables before adding them to the configuration file.

* `APP_STORE_CONNECT_PRIVATE_KEY`

  It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api).

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
Alternatively, each property can be specified in the [scripts](#scripts) section as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch%E2%80%91signing%E2%80%91files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}

In order to use **manual code signing**, [encrypt](https://docs.codemagic.io/building/yaml/#encrypting-sensitive-data) your signing certificate, the certificate password (if the certificate is password-protected) and the provisioning profile, and set the encrypted values to the following environment variables:

    CM_CERTIFICATE: Encrypted(...)
    CM_CERTIFICATE_PASSWORD: Encrypted(...)
    CM_PROVISIONING_PROFILE: Encrypted(...)

### Publishing

`publishing:` For every successful build, you can publish the generated artifacts to external services. The available integrations currently are email, Slack, Google Play, App Store Connect and Codemagic Static Pages.

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

### Examples

Examples about using YAML for code signing and publishing can be found here:

* <a href="https://blog.codemagic.io/distributing-module-yaml/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','distributing-module-yaml')">Native Android project</a>
* <a href="https://blog.codemagic.io/distributing-native-ios-sdk-with-flutter-module-using-codemagic/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','distributing-native-ios-sdk-with-flutter-module-using-codemagic/')">Native iOS project</a>
---
title: Signing iOS apps
description: How to set up iOS code signing in codemagic.yaml
weight: 1
aliases: [../code-signing-yaml/signing, /code-signing-yaml/signing-ios]
---

All iOS applications have to be digitally signed before they can be installed on real devices or made available to the public.

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**. If your workflow is configured with **Flutter workflow editor** please go to [Signing iOS apps using the Flutter workflow editor](../code-signing/ios-code-signing).
{{</notebox>}}

## Prerequisites

Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership. You can upload your signing certificate and distribution profile to Codemagic to manage code signing yourself or use the automatic code signing option where Codemagic takes care of code signing and signing files management on your behalf. Read more about the two options below.

{{<notebox>}}
Under the hood, we use [Codemagic CLI tools](https://github.com/codemagic-ci-cd/cli-tools) to perform iOS code signing ⏤ these tools are open source and can also be [used locally](../cli/codemagic-cli-tools/) or in other environments. More specifically, we use the [xcode-project utility](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md) for preparing the code signing properties for the build, the [keychain utility](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/keychain/README.md) for managing macOS keychains and certificates, and the [app-store-connect utility](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md) for creating and downloading code signing certificates and provisioning profiles. The latter makes use of the App Store Connect API for authenticating with Apple Developer Portal.
{{</notebox>}}

## Automatic code signing

In order to use automatic code signing and have Codemagic manage signing certificates and provisioning profiles on your behalf, you need to configure API access to App Store Connect.

### Creating the App Store Connect API key

It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api). To do so:

1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
2. Click on the + sign to generate a new API key.
3. Enter the name for the key and select an access level. We recommend choosing `App Manager` access rights, read more about Apple Developer Program role permissions [here](https://help.apple.com/app-store-connect/#/deve5f9a89d7).
4. Click **Generate**.
5. As soon as the key is generated, you can see it added to the list of active keys. Click **Download API Key** to save the private key for later. Note that the key can only be downloaded once.

{{<notebox >}} 
Take note of the **Issuer ID** above the table of active keys as well as the **Key ID** of the generated key as these will be required when setting up the Apple Developer Portal integration in the Codemagic UI.
{{</notebox>}}

### Saving the API key to environment variables

Save the API key and the related information in the **Environment variables** section in Codemagic UI. Click **Secure** to encrypt the values. Note that binary files (i.e. provisioning profiles & .p12 certificate) have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to **Environment variables** and decoded during the build. Below are the following environment variables:

- `APP_STORE_CONNECT_KEY_IDENTIFIER`

  In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

- `APP_STORE_CONNECT_ISSUER_ID`

  In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

- `APP_STORE_CONNECT_PRIVATE_KEY`

  This is the private API key downloaded from App Store Connect.

- `CERTIFICATE_PRIVATE_KEY`

  This is an RSA 2048 bit private key to be included in the [signing certificate](https://help.apple.com/xcode/mac/current/#/dev1c7c2c67d). 
  
  You can use the private key of an iOS Distribution certificate that has already been created in your Apple Developer Program account. 
  
  Alternatively, you can create a new private key on your Mac and the Codemagic CLI will create a new iOS Distribution certificate in your Apple Developer Program account for you.

  **Creating a new private key**
  
  You can create a new 2048 bit RSA key by running the command below in your terminal. 

  ```bash
    ssh-keygen -t rsa -b 2048 -m PEM -f ~/Desktop/codemagic_private_key -q -N ""
  ```
  
  Running the command line will create private and public keys. Open the **codemagic_private_key** and copy the **entire contents** of the file including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` tags. 
  
  Paste this into the value field of the `CERTIFICATE_PRIVATE_KEY` environment variable and mark it as **Secure** so the value is encrypted.

  This new private key will be used to create a new iOS Distribution certificate in your Apple Developer Program account if there isn't one that already matches this private key. 

  **Using an existing private key** 

  To use an existing iOS Distribution certificate private key, please do the following:

  1. On the Mac which created the iOS distribution certificate, launch Keychain Access, select the certificate entry which should be listed as iPhone Distribution: company_name (team_id), and right-click on it to select "Export."
  2. In the export prompt window that appears, make sure the file format is set to "Personal Information Exchange (.p12)", give the file a name such as "IOS_DISTRIBUTION", choose a location to save to and click on "Save" to save it to your machine.
  3. On the next prompt for the password to protect the export file, leave the password empty and click OK.
  4. Open Terminal and change to the directory where you saved the IOS_DISTRIBUTION.p12
  5. Use the following `openssl` command to export the private key:

     `openssl pkcs12 -in IOS_DISTRIBUTION.p12 -nodes -nocerts | openssl rsa -out ios_distribution_private_key`

  6. When prompted for the import password, just press enter. The private key will be written to a file called ios_distribution_private_key in the directory where you ran the command.
  7. Open the file ios_distribution_private_key with a text editor.
  8. Copy the **entire contents** of the file including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` tags.
  9. Paste the key into the value field of the `CERTIFICATE_PRIVATE_KEY` environment variable and mark it as 'Secure' so the value is encrypted.

{{<notebox>}}
Tip: Store all the App Store Connect variables in the same group so they can be imported to a codemagic.yaml workflow at once. 

If the group of variables is reusable for various applications, they can be defined in [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in **Team settings** for easier access.
{{</notebox>}}

Add the group in the **codemagic.yaml** as follows:

```yaml
environment:
  groups:
    - appstore_credentials
  # Add the above mentioned group environment variables in Codemagic UI (either in Application/Team variables): 
    # APP_STORE_CONNECT_ISSUER_ID
    # APP_STORE_CONNECT_KEY_IDENTIFIER
    # APP_STORE_CONNECT_PRIVATE_KEY 
    # CERTIFICATE_PRIVATE_KEY
```

{{<notebox>}}
Alternatively, each property can be specified in the `scripts` section of the YAML file as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}

### Specifying code signing configuration

To code sign the app, add the following commands in the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, after all the dependencies are installed, right before the build commands. 

```yaml
scripts:
  ... your dependencies installation
  - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
    script: keychain initialize
  - name: Fetch signing files
    script: |
      # You can allow creating resources if existing are not found with `--create` flag
      app-store-connect fetch-signing-files "io.codemagic.app" \
        --type IOS_APP_DEVELOPMENT \
        --create
  - name: Set up signing certificate
    script: keychain add-certificates
  - name: Set up code signing settings on Xcode project
    script: xcode-project use-profiles
  ... your build commands
```

Instead of specifying the exact bundle-id, you can use `"$(xcode-project detect-bundle-id)"`.

Based on the specified bundle ID and [provisioning profile type](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store), Codemagic will fetch or create the relevant provisioning profile and certificate to code sign the build.

## Manual code signing

In order to use manual code signing, save your **signing certificate**, the **certificate password** (if the certificate is password-protected) and the **provisioning profile** in the **Environment variables** section in Codemagic UI. Click **Secure** to encrypt the values. Note that binary files (i.e. provisioning profiles & .p12 certificate) have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to **Environment variables** and decoded during the build.

```yaml
environment:
  groups:
    - certificate_credentials
  # Add the above mentioned group environment variables in Codemagic UI (either in Application/Team variables): 
    # FCI_CERTIFICATE
    # FCI_CERTIFICATE_PASSWORD
    # FCI_PROVISIONING_PROFILE
```

Then add the code signing configuration and the commands to code sign the build in the scripts section, after all the dependencies are installed, right before the build commands.

```yaml
scripts:
  ... your dependencies installation
  - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
    script: keychain initialize
  - name: Set up Provisioning profiles from environment variables
    script: |
      PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
      mkdir -p "$PROFILES_HOME"
      PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
      echo ${FCI_PROVISIONING_PROFILE} | base64 --decode > "$PROFILE_PATH"
      echo "Saved provisioning profile $PROFILE_PATH"
  - name: Set up signing certificate
    script: |
      echo $FCI_CERTIFICATE | base64 --decode > /tmp/certificate.p12
      if [ -z ${FCI_CERTIFICATE_PASSWORD+x} ]; then
        # when using a certificate that is not password-protected
        keychain add-certificates --certificate /tmp/certificate.p12
      else
        # when using a password-protected certificate
        keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $FCI_CERTIFICATE_PASSWORD
      fi
  - name: Set up code signing settings on Xcode project
    script: xcode-project use-profiles
  ... your build commands
```

### Using multiple provisioning profiles

To set up multiple provisioning profiles, for example, to use app extensions such as [NotificationService](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension), the easiest option is to add the provisioning profiles to your environment variables with a similar naming convention:
```yaml
environment:
  groups:
    - provisioning_profile
   # Add the above mentioned group environment variables in Codemagic UI (either in Application/Team variables): 
    # FCI_PROVISIONING_PROFILE_BASE
    # FCI_PROVISIONING_PROFILE_NOTIFICATIONSERVICE
```

Then, set the profiles up in the build by using the following script in your YAML file:
```yaml
scripts:
  - name: Set up Provisioning profiles from environment variables
    script: |
      PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
      mkdir -p "$PROFILES_HOME"
      for profile in "${!FCI_PROVISIONING_PROFILE_@}"; do
        PROFILE_PATH="$(mktemp "$HOME/Library/MobileDevice/Provisioning Profiles"/ios_$(uuidgen).mobileprovision)"
        echo ${!profile} | base64 --decode > "$PROFILE_PATH"
        echo "Saved provisioning profile $PROFILE_PATH"
      done

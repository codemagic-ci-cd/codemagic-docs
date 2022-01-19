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

Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership. You can:
- **Manually** upload your signing certificate and distribution profile to Codemagic to manage code signing yourself or,
- Use the **automatic code signing** option where Codemagic takes care of code signing and signing files management on your behalf. 

Read more about the two options below.

{{<notebox>}}
Under the hood, we use [Codemagic CLI tools](https://github.com/codemagic-ci-cd/cli-tools) to perform iOS code signing ⏤ these tools are open source and can also be [used locally](../cli/codemagic-cli-tools/) or in other environments. More specifically, we use:
- [xcode-project utility](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md) for preparing the code signing properties for the build
- [keychain utility](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/keychain/README.md) for managing macOS keychains and certificates 
- [app-store-connect utility](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md) for creating and downloading code signing certificates and provisioning profiles. It makes use of the App Store Connect API for authenticating with Apple Developer Portal.
{{</notebox>}}

## Automatic code signing

In order to use automatic code signing and have Codemagic manage signing certificates and provisioning profiles on your behalf, you need to configure API access to App Store Connect.

### Creating the App Store Connect API key

{{< include "/partials/app-store-connect-api-key.md" >}}

### Saving the API key to environment variables

Save the API key and the related information in the **Environment variables**: 
1. Go to Codemagic and open your app.
2. Under the **Environment variables** section, add the environment variables with their corresponding value. 
3. Create a **group** for holding the variables. For example, `appstore_credentials` for the App Store-related information.
3. Checkmark **Secure** to encrypt the values.

{{<notebox>}}
The binary files (i.e. provisioning profiles & .p12 certificate) have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to **Environment variables** and decoded during the build.
{{</notebox>}}

Below are the following environment variables:

- `APP_STORE_CONNECT_KEY_IDENTIFIER`: In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

- `APP_STORE_CONNECT_ISSUER_ID`: In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

- `APP_STORE_CONNECT_PRIVATE_KEY`: This is the **private API key** downloaded from App Store Connect.

- `CERTIFICATE_PRIVATE_KEY`: This is an RSA 2048 bit private key to be included in the [signing certificate](https://help.apple.com/xcode/mac/current/#/dev1c7c2c67d).

Here's an example of all the keys and the respective groups that you can create and put the respective values in:

**Variable name** | **Variable value** | **Group**
--- | --- | ---
APP_STORE_CONNECT_KEY_IDENTIFIER | Put your App Store Connect Key Identifier here | appstore_credentials
APP_STORE_CONNECT_ISSUER_ID | Put your App Store Connect Issuer Id here  | appstore_credentials
APP_STORE_CONNECT_PRIVATE_KEY | Put your App Store Connect Private Key here | appstore_credentials
CERTIFICATE_PRIVATE_KEY | Put your Certificate Private Key here | certificate_credentials
 
You can use the private key of an iOS Distribution certificate that has already been created in your Apple Developer Program account. 

Alternatively, you can create a new private key on your Mac and the Codemagic CLI will create a new iOS Distribution certificate in your Apple Developer Program account for you.

**Creating a new private key**
  
 You can create a new 2048 bit RSA key by running the command below in your terminal:

```bash
ssh-keygen -t rsa -b 2048 -m PEM -f ~/Desktop/codemagic_private_key -q -N ""
```

1. Running the command will create private and public keys. 
2. Open the **codemagic_private_key**.
3. Copy the _entire contents_ of the file including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` tags. 
4. Paste this into the value field of the `CERTIFICATE_PRIVATE_KEY` environment variable on Codemagic.
5. Mark it as **Secure** so the value is encrypted.

This new private key will be used to create a new iOS Distribution certificate in your Apple Developer Program account if there isn't one that already matches this private key. 

**Using an existing private key** 

To use an existing iOS Distribution certificate private key:
1. On the Mac which created the iOS distribution certificate, launch **Keychain Access**.
2. Select the certificate entry which should be listed as iPhone Distribution: company_name (team_id).
3. Right-click on it to select "Export."
4. In the export prompt window that appears, make sure the file format is set to "Personal Information Exchange (.p12)".
5. Give the file a name such as "IOS_DISTRIBUTION".
6. Choose a location to save to and click on "Save" to save it to your machine.
7. On the next prompt for the password to protect the export file, leave the password empty and click OK.

To get the private key from the distribution certificate: 
1. Open Terminal and change to the directory where you saved the IOS_DISTRIBUTION.p12
2. Use the following `openssl` command to export the private key:

```
openssl pkcs12 -in IOS_DISTRIBUTION.p12 -nodes -nocerts | openssl rsa -out ios_distribution_private_key
```

3. When prompted for the import password, just press enter. The private key will be written to a file called **ios_distribution_private_key** in the directory where you ran the command.
4. Open the file ios_distribution_private_key with a text editor.
5. Copy the **entire contents** of the file, including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` tags.
6. Paste the key into the value field of the `CERTIFICATE_PRIVATE_KEY` environment variable.
7. Mark it as **Secure** so the value is encrypted.

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

Based on the specified bundle ID and [provisioning profile type](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store) set with the `--type` argument, Codemagic will fetch or create the relevant provisioning profile and certificate to code sign the build.

If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the  `--type` argument to `IOS_APP_STORE`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `--type` argument to `IOS_APP_ADHOC`

## Manual code signing

In order to use manual code signing, you need the following values: 
- **Signing certificate**: Your development or distribution certificate in .P12 format.
- **Certificate password**: The certificate password if the certificate is password-protected.
- **Provisioning profile**: You can get it from **Certificates, Identifiers & Profiles > Profiles** and select the provisioning profile you would like to export and download.

Save them in **Environment variables**:
1. Go to Codemagic and open your app.
2. Under the **Environment variables** section, add the environment variables with their corresponding value. 
3. Create a **group** for holding the variables. For example, `certificate_credentials` for the certificate-related information.
3. Checkmark **Secure** to encrypt the values.

{{<notebox>}} 
The binary files (i.e. provisioning profiles & .p12 certificate) have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to **Environment variables** and decoded during the build.
{{</notebox>}}

You can put the variables into a group for accessing them in the workflow configuration. Here's an example:

**Variable name** | **Variable value** | **Group**
--- | --- | ---
FCI_CERTIFICATE | Put your signing certificate here  | certificate_credentials
FCI_CERTIFICATE_PASSWORD | Put the certificate password here if it is password-protected | certificate_credentials
FCI_PROVISIONING_PROFILE | Put your provisioning profile here | appstore_credentials

Add the group in your `codemagic.yaml` to access the variables:

```yaml
environment:
  groups:
    - certificate_credentials
  # Add the above mentioned group environment variables in Codemagic UI (either in Application/Team variables): 
    # FCI_CERTIFICATE
    # FCI_CERTIFICATE_PASSWORD
    # FCI_PROVISIONING_PROFILE
```

Then, add the code signing configuration and the commands to code sign the build in the scripts section, after all the dependencies are installed, right before the build commands.

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

---
---

{{<markdown>}}
#### Creating the App Store Connect API key
Signing macOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.
{{</markdown>}}

{{< include "/partials/app-store-connect-api-key.md" >}}

#### Obtaining the certificate private key

To sign iOS apps, you can use the private key of an iOS Distribution certificate that has already been created in your Apple Developer Program account.

Alternatively, you can create a new private key on your Mac and the Codemagic CLI will create a new iOS Distribution certificate in your Apple Developer Program account for you.

{{< tabpane >}}

{{< tab header="Create a new key" >}}
{{<markdown>}}
You can create a new 2048 bit RSA key by running the command below in your terminal:

{{< highlight Shell "style=rrt">}}
ssh-keygen -t rsa -b 2048 -m PEM -f ~/Desktop/ios_distribution_private_key -q -N ""
{{< /highlight >}}

This new private key will be used to create a new iOS Distribution certificate in your Apple Developer Program account if there isn't one that already matches this private key.
{{</markdown>}}
{{< /tab >}}

{{% tab header="Use an existing key"%}}
{{<markdown>}}

1. On the Mac which created the iOS distribution certificate, open the **Keychain Access**, located in the **Applications and Utilities** folder.
2. Select the certificate entry which should be listed as `iPhone Distribution: company_name (team_id)`.
3. Right-click on it to select "Export."
4. In the export prompt window that appears, make sure the file format is set to **Personal Information Exchange (.p12)**"**.
5. Give the file a name such as "IOS_DISTRIBUTION", choose a location and click **Save**.
6. On the next prompt, leave the password empty and click **OK**.
7. Use the following `openssl` command to export the private key:

{{< highlight Shell "style=rrt">}}
openssl pkcs12 -in IOS_DISTRIBUTION.p12 -nodes -nocerts | openssl rsa -out ios_distribution_private_key
{{< /highlight >}}

8. When prompted for the import password, just press enter. The private key will be written to a file called **ios_distribution_private_key** in the directory where you ran the command.

{{</markdown>}}
{{% /tab %}}

{{< /tabpane >}}

#### Automatic vs Manual code signing

Signing macOS apps requires a `Signing certificate` (App Store **development** or **distribution** certificate in `.p12` format) and a `Provisioning profile`. In **Manual code signing** you save these files as Codemagic `Environment variables` and manually reference them in the appropriate build steps.

In **Automatic code signing**, Codemagic takes care of Certificate and Provisioning profile management for you. Based on the `certificate private key` that you provide, Codemagic will automatically fetch the correct certificate from the App Store or create a new one if necessary.

{{< include "/partials/code-signing-ios-configure-environment-vars.md" >}}

#### Automatic code signing

To code sign the app, add the following commands in the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, after all the dependencies are installed, right before the build commands. 


{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files "$BUNDLE_ID" \
            --platform MAC_OS \
            --type MAC_APP_STORE \
            --create
      - name: Fetch Mac Installer Distribution certificates
        script: | 
           # You may omit the first command if you already have the installer certificate and provided the corresponding private key
            app-store-connect create-certificate --type MAC_INSTALLER_DISTRIBUTION --save || \
            app-store-connect list-certificates --type MAC_INSTALLER_DISTRIBUTION --save
      - name: Set up signing certificate
        script: keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
{{< /highlight >}}

Instead of specifying the exact bundle-id, you can use `"$(xcode-project detect-bundle-id)"`.

Based on the specified bundle ID and [provisioning profile type](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store), Codemagic will fetch or create the relevant provisioning profile and certificate to code sign the build.

#### Manual code signing

In order to use manual code signing, you need the following: 
- **Signing certificate**: Your development or distribution certificate in .P12 format.
- **Certificate password**: The certificate password if the certificate is password-protected.
- **Provisioning profile**: You can get it from **Apple Developer Center > Certificates, Identifiers & Profiles > Profiles** and select the provisioning profile you would like to export and download.

{{<notebox>}}
**Note**: With **Manual code signing**, you also have to manually **Package the application** into a `.pkg` container and **Notarize** it.
{{</notebox>}}

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter `CM_CERTIFICATE` as the **_Variable name_**.
3. Run the following command on the certificate file to `base64` encode it and copy to clipboard:
{{< highlight Shell "style=rrt">}}
cat ios_distribution_certificate.p12 | base64 | pbcopy
{{< /highlight >}}
4. Paste into the **_Variable value_** field.
5. Enter a variable group name, e.g. **_appstore_credentials_**.
6. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
7. Click the **Add** button to add the variable.
8. Repeat steps 2 - 7 to create variables `CM_PROVISIONING_PROFILE` and `INSTALLER_CERTIFICATE`. Paste the `base64` encoded values for both of these files.
9. Add the `CM_CERTIFICATE_PASSWORD` and `INSTALLER_CERTIFICATE_PASSWORD` variables, make them **Secure** and add them to the same variable group.

Then, add the code signing configuration and the commands to code sign the build in the scripts section, after all the dependencies are installed, right before the build commands.

{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Set up provisioning profiles from environment variables
        script: | 
            PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
            mkdir -p "$PROFILES_HOME"
            PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
            echo ${CM_PROVISIONING_PROFILE} | base64 --decode > "$PROFILE_PATH"
            echo "Saved provisioning profile $PROFILE_PATH"
      - name: Set up signing certificate
        script: | 
            echo $CM_CERTIFICATE | base64 --decode > /tmp/certificate.p12
            if [ -z ${CM_CERTIFICATE_PASSWORD+x} ]; then
                # when using a certificate that is not password-protected
                keychain add-certificates --certificate /tmp/certificate.p12
            else
                # when using a password-protected certificate
                keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
            fi

            echo $INSTALLER_CERTIFICATE | base64 --decode > /tmp/installer_certificate.p12
            if [ -z ${INSTALLER_CERTIFICATE_PASSWORD+x} ]; then
                # when using a certificate that is not password-protected
                keychain add-certificates --certificate /tmp/installer_certificate.p12
            else
                # when using a password-protected certificate
                keychain add-certificates --certificate /tmp/installer_certificate.p12 --certificate-password $INSTALLER_CERTIFICATE_PASSWORD
            fi
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
{{< /highlight >}}

###### Packaging the application

To package your application into an `.pkg` Installer package and sign it with the `Mac Installer Distribution` certificate, use the following script:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Package application
      script: | 
      set -x
    
      # Command to find the path to your generated app, may be different
      APP_NAME=$(find $(pwd) -name "*.app")  
      cd $(dirname "$APP_NAME")
    
      PACKAGE_NAME=$(basename "$APP_NAME" .app).pkg
      xcrun productbuild --component "$APP_NAME" /Applications/ unsigned.pkg  # Create and unsigned package

      # Find the installer certificate commmon name in keychain
      INSTALLER_CERT_NAME=$(keychain list-certificates \
        | jq '.[]
        | select(.common_name
        | contains("Mac Developer Installer"))
        | .common_name' \
        | xargs)
      
      xcrun productsign --sign "$INSTALLER_CERT_NAME" unsigned.pkg "$PACKAGE_NAME" # Sign the package
    
      rm -f unsigned.pkg                                                       # Optionally remove the not needed unsigned package
{{< /highlight >}}

{{<notebox>}}
**Note**: Don't forget to specify the path to your generated package in the [artifacts section](../getting-started/yaml/#artifacts).
{{</notebox>}}

###### Notarizing macOS applications

Notarization is a process where Apple verifies your application to make sure it has a Developer ID code signature and does not consist of malicious content. Notarizing an app during the Codemagic build process is possible using **altool** as follows:

{{< highlight bash "style=paraiso-dark">}}
xcrun altool --notarize-app -f <file> --primary-bundle-id <bundle_id>
           {-u <username> [-p <password>] | --apiKey <api_key> --apiIssuer <issuer_id>}
           [--asc-provider <name> | --team-id <id> | --asc-public-id <id>]
{{< /highlight >}}

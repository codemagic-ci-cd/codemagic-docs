---
---

#### Prerequisites

Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership. You can:

1. **Manually** upload your signing certificate and distribution profile to Codemagic to manage code signing yourself or,
2. Use the **automatic code signing** option where Codemagic takes care of code signing and signing files management on your behalf.


More details about iOS app codesigning can be found [here](../yaml-code-signing/signing-ios).

#### Creating the App Store Connect API key

{{< include "/partials/app-store-connect-api-key.md" >}}

#### Creating the iOS Distribution Certificate

The following steps describe one way of creating an iOS Distribution Certificate. This method requires a Mac computer and the certificate will be stored on it for easier retrieval in future. For a more detailed explanation and alternative certificate generation methods, please visit [here](../yaml-code-signing/signing-ios).

1. On your Mac, open the **Keychain Access**, located in the **Applications and Utilities** folder.
2. From the upper menu, open **Preferences**
3. Click on **Certificates** and turn off the **OCSP** and the **CRL**. Close the preferences window.
4. From the upper menu, select **Certificate Assistant** and **Request a Certificate from a Certificate Authority**.
5. Add the user email address and the common name. The email address has to be the same as this one you chose when you created your Apple Developer account. The CA email address is not obligatory. Click on **Saved to disk**.
---

6. Go to your [Apple Developer Account](https://developer.apple.com/account/)
7. Go to **Certificates, IDs & Profiles**
8. In **Certificates**, click on the "+" button
9. In **Software** section, select **iOS Distribution (App Store and Ad Hoc)**
10. Click **Continue** and upload the CSR file generated in step 5.
11. Download the **iOS Distribution Certificate file**.

---

12. Open the certificate file by double clicking and add it to your Keychain
13. Select the certificate in Keychain Access, right click on it and export as a **Personal Information Exchange (.p12)** file.
14. Give the file a name such as "IOS_DISTRIBUTION", choose a location and click **Save**.
15. On the next prompt, leave the password empty and click **OK**.
16. Use the following `openssl` command to export the private key:

{{< highlight Shell "style=rrt">}}
openssl pkcs12 -in IOS_DISTRIBUTION.p12 -nodes -nocerts | openssl rsa -out ios_distribution_private_key
{{< /highlight >}}

17. When prompted for the import password, just press enter. The private key will be written to a file called **ios_distribution_private_key** in the directory where you ran the command.


#### Configuring Environment variables

1. Open your Codemagic app settings, go to **Environment variables** tab.
2. Enter `CERTIFICATE_PRIVATE_KEY` as the **_Variable name_**.
3. Open the file `ios_distribution_private_key` with a text editor.
4. Copy the **entire contents** of the file, including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` tags.
5. Paste into the **_Variable value_** field.
6. Enter a variable group name, e.g. **_appstore_credentials_**. Click the button to create the group.
7. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
8. Click the **Add** button to add the variable.

---

9. Run the following command on the **App Store Connect API key** file that you downloaded earlier (in our example saved as `codemagic_api_key.p8`) to copy its content to clipboard:
{{< highlight Shell "style=rrt">}}
cat codemagic_api_key.p8 | pbcopy
{{< /highlight >}}

10. Create a new Environment variable `APP_STORE_CONNECT_PRIVATE_KEY` and paste the value from clipboard.

---

11. Create variable `APP_STORE_CONNECT_KEY_IDENTIFIER`. The value is the **Key ID** field from **App Store Connect > Users and Access > Keys**.
12.  Create variable `APP_STORE_CONNECT_ISSUER_ID`. The value is the **Issuer ID** field from **App Store Connect > Users and Access > Keys**.

{{<notebox>}}
Tip: Store all the keystore variables in the same group so they can be imported to codemagic.yaml workflow at once. 

If the group of variables is reusable for various applications, they can be defined in [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in **Team settings** for easier access.
{{</notebox>}}

Environment variables have to be added to the workflow either individually or as a group. Modify your `codemagic.yaml` file by adding the following:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-ios:
    name: React Native iOS
    # ....
    environment:
        groups:
            - appstore_credentials
{{< /highlight >}}


To code sign the app, add the following commands in the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, after all the dependencies are installed, right before the build commands. 



{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files "$BUNDLE_ID" \
            --type IOS_APP_STORE \
            --create
      - name: Set up signing certificate
        script: keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
{{< /highlight >}}

Based on the specified bundle ID and [provisioning profile type](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store) set with the `--type` argument, Codemagic will fetch or create the relevant provisioning profile and certificate to code sign the build.

If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the  `--type` argument to `IOS_APP_STORE`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `--type` argument to `IOS_APP_ADHOC`

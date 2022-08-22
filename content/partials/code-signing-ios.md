---
---
{{<markdown>}}
#### Creating the App Store Connect API key
Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.
{{</markdown>}}
{{< include "/partials/app-store-connect-api-key.md" >}}

{{< include "/partials/code-signing-ios-obtain-certificate.md" >}}

#### Automatic vs Manual code signing

Signing iOS apps requires a `signing certificate` (App Store **development** or **distribution** certificate in `.p12` format) and a `provisioning profile`. In **manual code signing** you save these files as Codemagic `environment variables` and manually reference them in the appropriate build steps.

In **Automatic code signing**, Codemagic takes care of Certificate and Provisioning profile management for you. Based on the `Certificate private key` that you provide, Codemagic will automatically fetch the correct certificate from the App Store or create a new one if necessary.

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
            --type IOS_APP_STORE \
            --create
      - name: Set up signing certificate
        script: keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
{{< /highlight >}}

Instead of specifying the exact bundle-id, you can use `"$(xcode-project detect-bundle-id)"`.

Based on the specified bundle ID and [provisioning profile type](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store) set with the `--type` argument, Codemagic will fetch or create the relevant provisioning profile and certificate to code sign the build.

If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the  `--type` argument to `IOS_APP_STORE`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `--type` argument to `IOS_APP_ADHOC`


#### Manual code signing

In order to use manual code signing, you need the following: 
- **Signing certificate**: Your development or distribution certificate in .P12 format.
- **Certificate password**: The certificate password if the certificate is password-protected.
- **Provisioning profile**: You can get it from **Apple Developer Center > Certificates, Identifiers & Profiles > Profiles** and select the provisioning profile you would like to export and download.


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
8. Repeat steps 2 -7 to create the variable `CM_PROVISIONING_PROFILE` and paste the `base64` encoded value of the provisioning profile file.
9. Add the `CM_CERTIFICATE_PASSWORD` variable, make it **Secure** and add it to the same variable group.


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
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
{{< /highlight >}}



#### Using multiple provisioning profiles

To set up multiple provisioning profiles, for example, to use app extensions such as [Notification Service](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension), the easiest option is to add the provisioning profiles to your environment variables with a similar naming convention.

For example, create a `provisioning_profiles` Environment variable group and add variables such as:
- CM_PROVISIONING_PROFILE_BASE
- CM_PROVISIONING_PROFILE_NOTIFICATIONSERVICE

Then, include this group in your workflow and set up provisioning profiles with a script:

{{< highlight yaml "style=paraiso-dark">}}
environment:
  groups:
    - provisioning_profile

# ...

scripts:
  - name: Set up Provisioning profiles from environment variables
    script: | 
      PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
      mkdir -p "$PROFILES_HOME"
      for profile in "${!CM_PROVISIONING_PROFILE_@}"; do
        PROFILE_PATH="$(mktemp "$HOME/Library/MobileDevice/Provisioning Profiles"/ios_$(uuidgen).mobileprovision)"
        echo ${!profile} | base64 --decode > "$PROFILE_PATH"
        echo "Saved provisioning profile $PROFILE_PATH"
      done
{{< /highlight >}}

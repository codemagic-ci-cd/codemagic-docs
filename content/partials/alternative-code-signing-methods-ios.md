---
---

## Alternative code signing
### Set up provisioning profiles and Certificates from environment variables

In order to use this alternative code signing, you need the following: 
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



### Using multiple provisioning profiles

To set up multiple provisioning profiles, for example, to use app extensions such as [Notification Service](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension), the easiest option is to add the provisioning profiles to your environment variables with a similar naming convention.

For example, create a `provisioning_profiles` environment variable group and add variables such as:
- CM_PROVISIONING_PROFILE_BASE
- CM_PROVISIONING_PROFILE_NOTIFICATIONSERVICE

Then, include this group in your workflow and set up provisioning profiles with a script:

{{< highlight yaml "style=paraiso-dark">}}
environment:
  groups:
    - provisioning_profiles

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
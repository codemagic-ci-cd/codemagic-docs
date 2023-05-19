---
title: Migrating from Bitrise
description: How to migrate your projects from Bitrise to Codemagic
weight: 1
aliases:
  - /getting-started/migrating-from-bitrise
  - /knowledge-base/migrating-from-bitrise
---

Codemagic makes use of [`codemagic.yaml`](../yaml/yaml-getting-started/) for configuring your workflow. As Codemagic supports any Git-based cloud or self-hosted repository, there is no need to migrate your code - simply add a `codemagic.yaml` file to your repository root folder.

In Codemagic, there is also a [Flutter workflow editor](../flutter-configuration/flutter-projects/) for Flutter applications, which simplifies the setup but removes some flexibility.


## Migrating builds with codemagic.yaml

If you have already set up your application on Bitrise, migrating to Codemagic is straightforward.



{{< tabpane >}}

{{< tab header="Android" >}}
{{<markdown>}}

### Code signing

To set up code signing with `codemagic.yaml`, you must add your keystore and related information (passwords, alias, etc.) as environment variables.

#### Modify build.gradle

Modify your **`android/app/build.gradle`** as follows:
{{< highlight kotlin "style=paraiso-dark">}}
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


#### Configure environment variables

The environment variables referenced by the `build.gradle` need to be stored in the Codemagic UI. A detailed explanation on how Environment variables and groups work can be found [here](../variables/environment-variable-groups).

The keystore file, like all binary files, has to be base64 encoded before storing its value.

- For **Linux** machines, we recommend installing xclip:

{{< highlight Shell "style=rrt">}}
sudo apt-get install xclip
cat codemagic.keystore | base64 | xclip -selection clipboard
{{< /highlight >}}

Alternatively, you can run the following command and carefully copy/paste the output:
{{< highlight Shell "style=rrt">}}
openssl base64 -in codemagic.keystore
{{< /highlight >}}


{{<notebox>}}
**Tip**: When copying file contents always include any tags. e.g. Don't forget to copy `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` too.
{{</notebox>}}


- On **macOS**, running the following command base64 encodes the file and copies the result to the clipboard:
{{< highlight Shell "style=rrt">}}
cat codemagic.keystore | base64 | pbcopy
{{< /highlight >}}


- For **Windows**, the PowerShell command to base64 encode a file and copy it to the clipboard is:
{{< highlight powershell "style=rrt">}}
[Convert]::ToBase64String([IO.File]::ReadAllBytes("codemagic.keystore")) | Set-Clipboard
{{< /highlight >}}



1. Open your Codemagic app settings, go to **Environment variables** tab.
2. Enter `CM_KEYSTORE` as the **_Variable name_**.
3. Paste the base64 encoded value of the keystore file in the **_Variable value_** field.
4. Enter a variable group name, e.g. **_android_code_signing_**. Click the button to create the group.
5. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
6. Click the **Add** button to add the variable.
7. Continue by adding `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS` and `CM_KEY_PASSWORD`
8. Add the `CM_KEYSTORE_PATH` variable with the value `$CM_BUILD_DIR/codemagic.keystore`


{{<notebox>}}
**Tip:** Store all the keystore variables in the same group so they can be imported to codemagic.yaml workflow at once.
{{</notebox>}}

Environment variables have to be added to the workflow either individually or as a group. Modify your `codemagic.yaml` file by adding the following:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    name: Android Workflow
    # ....
    environment:
        groups:
            - android_code_signing
{{< /highlight >}}

Environment variables added with the **Secure** option checked are transferred to the build machine encrypted and are available only while the build is running. The build machine is destroyed at the end.

The content of the `base64` encoded files needs to be decoded before it can be used. Instead of the `Android sign` step on Bitrise, define a script in the `codemagic.yaml` to base64 decode your keystore to a specified location:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    # ....
    environment:
        # ....
    scripts:
      - name: Set up keystore
        script: | 
          echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
{{< /highlight >}}



### Building

Suppose you have followed the above instructions on setting up code signing with the `codemagic.yaml` configuration. In that case, to continue with Codemagic, add a script to your scripts sections to build the application. You can find various build scripts for different types of applications in our [Sample projects](../yaml-quick-start/codemagic-sample-projects/).

An example build script for building a Native Android application:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build Android
      script: | 
        ./gradlew assembleRelease     
{{< /highlight >}}

With Codemagic, you can configure which artifacts to receive at the end of the build under the [artifacts section](../yaml/yaml-getting-started/#artifacts). This provides relatively more flexibility in comparison to Bitrise's `Deploy to Bitrise.io` step. For teams on Annual or Enterprise plans, the build artifacts do not expire.

The artifacts section can for example be configured in the `codemagic.yaml` as follows:

{{< highlight yaml "style=paraiso-dark">}}
artifacts:
    - app/build/outputs/**/**/*.aab
    - app/build/outputs/**/**/*.apk
{{< /highlight >}}


### Deployment

To deploy to **Google Play**, a service account is required. Creating a service account is the same process in Codemagic and Bitrise. In theory, both platforms could use the same service account.

If you have already uploaded your service account to Bitrise, you can download it from there under `Generic file storage`. Alternatively, you can set up a new service account following the instructions [here](../knowledge-base/google-services-authentication/).

To add your service account to your configuration file, add it as an environment variable. For example, `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`. First, navigate to your application and click the `Environment variables` tab. To add the file, encode its contents with base64 and paste the value into Codemagic; make sure to check `Secure` when providing sensitive information. You can either add it to an already created group or create a new group, which you can later reference in your `codemagic.yaml`.

Like Bitrise's `Google Play Deploy` step, Codemagic allows you to modify the track, rollout fraction, and update priority. In addition, you can conveniently configure to submit the build as a draft or choose to send the changes directly to review.

Follow the example [here](../yaml-publishing/google-play/) to configure publishing to Google Play in your `codemagic.yaml`.

The `Google Play Deploy` step in `bitrise.yml` and the publishing in `codemagic.yaml` are relatively similar. However, Bitrise requires you to add the package name of the application. Codemagic publishes the relevant artifacts generated during the build with their respective names.

**bitrise.yml**

{{< highlight yaml "style=algol">}}
- google-play-deploy@3:
    inputs:
    - package_name: android_application.apk
    - user_fraction: '0.25'
    - update_priority: '3'
    - track: alpha
    - status: draft
    - retry_without_sending_to_review: 'true'
    - service_account_json_key_path: "$BITRISEIO_SERVICE_ACCOUNT_URL"
{{< /highlight >}}


**codemagic.yaml**

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  google_play:
    credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS 
    track: alpha 
    in_app_update_priority: 3
    rollout_fraction: 0.25
    changes_not_sent_for_review: true 
    submit_as_draft: true 
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}




{{< tab header="iOS" >}}
{{<markdown>}}

### Code signing

Like Bitrise, Codemagic lets users configure either a manual or an automatic option for handling iOS code signing profiles and certificates.

#### Automatic iOS code signing

Codemagic uses the [App Store Connect API](../yaml-code-signing/signing-ios/#creating-the-app-store-connect-api-key) for managing signing profiles and certificates. Bitrise uses the same API in the `Manage iOS Code Signing` step.

Thus, Codemagic requires the same values as Bitrise for handling automatic code signing. With the `codemagic.yaml` configuration, the values have to be provided as [environment variables](../yaml-code-signing/signing-ios/#saving-the-api-key-to-environment-variables). In addition, Codemagic requires you to create an RSA 2048 bit private key to be included in the signing certificate. 

Then, using the defined variables in your scripts section to automate creating and fetching profiles and certificates is possible.

Follow the steps defined in our [documentation](../yaml-code-signing/signing-ios/#automatic-code-signing) to find information on how to generate the necessary details and use them in your configuration. An example of using scripts to manage automatic code signing is found below:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
    script: keychain initialize
  - name: Fetch signing files
    script: | 
      # You can allow creating resources if existing are not found with `--create` flag
      app-store-connect fetch-signing-files "$(xcode-project detect-bundle-id)" \
        --type IOS_APP_DEVELOPMENT \
        --create
  - name: Set up signing certificate
    script: keychain add-certificates
  - name: Set up code signing settings on Xcode project
    script: xcode-project use-profiles
{{< /highlight >}}

As you can use Codemagic's automatic code signing to create new profiles and certificates, the process is very easily manageable. 

#### Manual iOS code signing

With the manual option, Codemagic requires you to add all of your signing files (profiles, certificates, etc.) as environment variables. These are the same files uploaded on Bitrise under the application's `Code Signing` tab.

If you have already set up manual code signing on Bitrise, setting it up with Codemagic is relatively simple. You can download the necessary provisioning profiles and certificates from Bitrise's `Code Signing` tab. 

In order to use manual code signing, you need the following: 
- **Signing certificate**: Your development or distribution certificate in .P12 format.
- **Certificate password**: The certificate password if the certificate is password-protected.
- **Provisioning profile**: You can get it from **Apple Developer Center > Certificates, Identifiers & Profiles > Profiles** and select the provisioning profile you would like to export and download.

{{<markdown>}}
1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter `CM_CERTIFICATE` as the **_Variable name_**.
3. Run the following command on the certificate file to `base64` encode it and copy to clipboard:
{{< highlight Shell "style=rrt">}}
cat ios_distribution_certificate.p12 | base64 | pbcopy
{{< /highlight >}}{{</markdown>}}
4. Paste into the **_Variable value_** field.
5. Enter a variable group name, e.g. **_ios_code_signing_**.
6. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
7. Click the **Add** button to add the variable.
8. Repeat steps 2 -7 to create the variable `CM_PROVISIONING_PROFILE` and paste the `base64` encoded value of the provisioning profile file.
9. Add the `CM_CERTIFICATE_PASSWORD` variable, make it **Secure** and add it to the same variable group.

10. Environment variables have to be added to the workflow either individually or as a group. Modify your `codemagic.yaml` file by adding the following:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    # ....
    environment:
        groups:
            - ios_code_signing
{{< /highlight >}}

However, you can call the variables differently if you reference them correctly in the scripts section. In the case of multiple provisioning profiles, the recommended naming convention is `CM_PROVISIONING_PROFILE_1`, `CM_PROVISIONING_PROFILE_2` etc.

As mentioned above, unlike with the Bitrise `Certificate and profile installer` step, you must reference the added files in your scripts section. Follow the detailed documentation [here](../yaml-code-signing/signing-ios/#manual-code-signing) or check out the example below.

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
    script: keychain initialize
  - name: Set up Provisioning profiles from environment variables
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


### Building

In Bitrise, the archiving to create the IPA for distribution is done in the `Xcode Archive & Export for iOS` step. 

Suppose you have followed the above instructions on setting up code signing with the `codemagic.yaml` configuration. In that case, to continue with Codemagic, add a script to your scripts sections to build the application. You can find various build scripts for different types of applications in our [Sample projects](../yaml-quick-start/codemagic-sample-projects/).

An example build script for building a Native iOS application:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build ipa for distribution
      script: | 
        xcode-project build-ipa \
          --workspace "$XCODE_WORKSPACE" \
          --scheme "$XCODE_SCHEME"
{{< /highlight >}}

With Codemagic, you can configure which artifacts to receive at the end of the build under the [artifacts section](../yaml/yaml-getting-started/#artifacts). This provides relatively more flexibility in comparison to Bitrise's `Deploy to Bitrise.io` step. For teams on Annual or Enterprise plans, the build artifacts do not expire.

The artifacts section can for example be configured in the `codemagic.yaml` as follows:

{{< highlight yaml "style=paraiso-dark">}}
artifacts:
  - build/ios/ipa/*.ipa
  - /tmp/xcodebuild_logs/*.log
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}

### Deployment

Like with Bitrise's `Deploy to App Store Connect`, the use of [App Store Connect API](../yaml-code-signing/signing-ios/#creating-the-app-store-connect-api-key) is required for deploying and publishing.

Suppose you have set up automatic code signing with Codemagic. In that case, it is relatively easy to continue with the final step to publish the application to the Apple store as you have already added all the required variables to your `codemagic.yaml` configuration. If not, follow the steps [here](../yaml-code-signing/signing-ios/#creating-the-app-store-connect-api-key). Note that Codemagic only requires the API key, its id, and the issuer id for publishing.

The details for setting up deployment and extra parameters can be found [here](../yaml-publishing/app-store-connect/#distribution-to-app-store-connect).

The `Deploy to App Store Connect` step in `bitrise.yml` and the publishing in `codemagic.yaml` are relatively similar. However, Codemagic asks you to provide your key id along with your issuer id.

**bitrise.yml**

{{< highlight yaml "style=algol">}}
- deploy-to-itunesconnect-application-loader@1:
    inputs:
    - api_issuer: 21d78e2f-b8ad-...
    - api_key_path: "$BITRISEIO_API_KEY_URL"
    - connection: api_key
{{< /highlight >}}

**codemagic.yaml**

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  app_store_connect:
    api_key: $APP_STORE_CONNECT_PRIVATE_KEY
    key_id: 3MD9688D9K
    issuer_id: 21d78e2f-b8ad-...
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}








{{< tab header="Flutter WFE" >}}
{{<markdown>}}

Besides using the `codemagic.yaml` file for configuration, it is also possible to use the **Flutter workflow editor** for Flutter applications. Note that you can either create separate workflows for `iOS` and `Android` or build them in the same workflow.

### iOS workflow

To build your Flutter iOS project with Flutter workflow editor, navigate to your workflow, and under `Build for platforms`, select `iOS`. Additional arguments can be defined under the `Build` section.

#### iOS code signing

Like Bitrise, Codemagic allows you to configure manual or automatic code signing. To configure code signing, navigate to **Distribution** > **iOS code signing**.

##### Automatic iOS code signing

Setting up automatic code signing once you have already done it on Bitrise is relatively simple. An **App Store Connect API key** is required to manage your certificates and provisioning profiles. The API key allows the service to connect to your developer account.

In Bitrise, to connect your Apple Developer account, you must first navigate to your profile settings, set up the connection, explicitly enable it under your application settings and add the `Manage iOS Code Signing` step to your workflow.

Codemagic Flutter workflow editor works almost the same. You can find the option to connect your Developer Portal account under user or team settings. Codemagic requires you to provide all of the same data - a name for your API key, the issuer ID, and the key ID, along with a .p8 file downloaded from App Store Connect. A step by step instruction on generating the key can can be found [here](../flutter-code-signing/ios-code-signing/#step-1-creating-an-app-store-api-key-for-codemagic).

Then, choose the correct API key in your workflow settings under iOS code signing. Check `Automatic` under `Select code signing method` and select the provisioning profile type under `Provisioning profile type`. If the certificates and profiles do not exist, Codemagic will attempt to generate them. Take note that Apple only allows three distribution certificates per account. 

Unlike Bitrise's `Manage iOS Code Signing` step, there is no need to add further steps to code sign the application.

##### Manual iOS code signing

If you have already set up manual code signing on Bitrise, it is easy to set it up on Codemagic. You can download the files you have uploaded on Bitrise under the applications `Code Signing` tab. After that, navigate to your workflow in Codemagic and upload these under `iOS code signing` once the code signing method is set to `manual`.

Like Bitrise, you can upload multiple provisioning profiles, for example, to handle application extensions. However, unlike Bitrise's `Certificate and profile installer` step, no extra step is required with Codemagic.

#### Deployment

Like with Bitrise's `Deploy to App Store Connect`, the use of [App Store Connect API](../yaml-code-signing/signing-ios/#creating-the-app-store-connect-api-key) is required for deploying and publishing.

Suppose you have set up automatic code signing with Codemagic. In that case, it is relatively easy to continue with the final step to publish the application to the Apple store as you have already connected your Apple Developer account. 

If not, follow the steps described [here](../flutter-code-signing/ios-code-signing/#step-1-creating-an-app-store-api-key-for-codemagic).

Once you have connected the account, navigate to **Distribution** > **App Store Connect**, enable publishing and choose the created API key from the dropdown list.

### Android workflow

To build your Flutter Android project with Flutter workflow editor, navigate to your workflow, and under `Build for platforms` select `Android`. Additional arguments can be defined under the `Build` section.

#### Android code signing

If you have already set up Android code signing on Bitrise, you can download your keystore under your workflows `Code Signing` tab. Setting up the code signing in the Codemagic Flutter workflow editor works similarly to Bitrise.

In your Codemagic workflow, navigate to **Distribution** > **Android code signing**, upload the keystore and provide the necessary passwords for the key and keystore and the key alias.

It is also necessary to configure code signing in your `build.gradle`. Like with Bitrise, it is possible to set it up based on Gradle configuration. You can modify your `build.gradle` to reference and use environment variables as an alternative. Follow the steps for either of the options [here](../flutter-code-signing/android-code-signing/) to set up Android code signing.

No extra step like `Android sign` in Bitrise is required.

#### Deployment

To deploy to Google Play, a service account is required. Creating a service account is the same process in Codemagic and Bitrise. In theory, both platforms could use the same service account.

To set up distribution to Google Play on Codemagic, navigate to **Distribution** > **Google Play**. There it is possible to upload the created service account. If you do not have a service account, follow the instructions [here](../knowledge-base/google-services-authentication/).

Like Bitrise's `Google Play Deploy` step, Codemagic allows you to modify the track, rollout fraction, and update priority. In addition, you can conveniently configure to submit the build as a draft or choose not the send the changes directly to review.
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


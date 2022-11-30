---
title: .NET MAUI apps
description: How to build a .NET MAUI app with codemagic.yaml
weight: 14
---

This guide will illustrate all of the necessary steps to successfully build and publish a .NET MAUI app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}

## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Install .NET SDK
In order to build .NET apps in Codemagic, you first need to install the .NET SDK. The easiest way to do it is by downloading and running the official Install script.

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    vars:
      DOTNET_PATH: $CM_BUILD_DIR/dotnet
      DOTNET: $CM_BUILD_DIR/dotnet/dotnet
  scripts:
    - name: Install .NET SDK
      script: | 
        wget https://dot.net/v1/dotnet-install.sh
        chmod +x dotnet-install.sh
        ./dotnet-install.sh --install-dir $DOTNET_PATH
{{< /highlight >}}

## Install MAUI
Once you have the .NET SDK installed, you can proceed to install the required .NET workloads.

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install MAUI
      script: | 
        $DOTNET nuget locals all --clear 
        $DOTNET workload install android maui \
          --source https://aka.ms/dotnet6/nuget/index.json \
          --source https://api.nuget.org/v3/index.json
{{< /highlight >}}{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install MAUI
      script: | 
        $DOTNET nuget locals all --clear 
        $DOTNET workload install ios maui \
          --source https://aka.ms/dotnet6/nuget/index.json \
          --source https://api.nuget.org/v3/index.json
{{< /highlight >}}{{< /tab >}}

{{< /tabpane >}}


## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

{{< tabpane >}}

{{% tab header="Android" %}}
#### Generating a keystore
You can create a keystore for signing your release builds with the Java Keytool utility by running the following command:

{{< highlight Shell "style=paraiso-dark">}}
keytool -genkey -v -keystore codemagic.keystore -storetype JKS \
        -keyalg RSA -keysize 2048 -validity 10000 -alias codemagic
{{< /highlight >}}

Keytool then prompts you to enter your personal details for creating the certificate, as well as provide passwords for the keystore and the key. It then generates the keystore as a file called **codemagic.keystore** in the directory you're in. The key is valid for 10,000 days.

#### Uploading a keystore

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


#### Referencing keystores in codemagic.yaml

To tell Codemagic to fetch the uploaded keystores from the **Code signing identities** section during the build, list the reference of the uploaded keystore under the `android_signing` field.

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

These values will be passed to the build command to properly code sign the app.

{{< /tab >}}



{{< tab header="iOS" >}}
{{<markdown>}}
#### Creating the App Store Connect API key
Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.
{{</markdown>}}
{{< include "/partials/app-store-connect-api-key.md" >}}

{{<markdown>}}
#### Adding the App Store Connect API key to Codemagic

1. Open your Codemagic Team settings, go to **Team integrations** > **Developer Portal** > **Manage keys**.
2. Click the **Add key** button.
3. Enter the `App Store Connect API key name`. This is a human readable name for the key that will be used to refer to the key later in application settings.
4. Enter the `Issuer ID` and `Key ID` values.
5. Click on **Choose a .p8 file** or drag the file to upload the App Store Connect API key downloaded earlier.
6. Click **Save**.

#### Adding the code signing certificate
{{</markdown>}}

{{< include "/partials/quickstart/code-signing-ios-add-certificate.md" >}}
{{<markdown>}}

#### Adding the provisioning profile
{{</markdown>}}

{{< include "/partials/quickstart/code-signing-ios-add-provisioning-profile.md" >}}

{{<markdown>}}
#### Referencing certificates and profiles in codemagic.yaml

To fetch all uploaded signing files matching a specific distribution type and bundle identifier during the build, define the `distribution_type` and `bundle_identifier` fields in your `codemagic.yaml` configuration. Note that it is necessary to configure **both** of the fields.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow 
    # ....
    environment:
      ios_signing:
        distribution_type: app_store # or: ad_hoc | development | enterprise
        bundle_identifier: com.example.id
{{< /highlight >}}

{{<notebox>}}
**Note:** If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the `distribution_type` to `app_store`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `distribution_type` to `ad_hoc`
{{</notebox>}}

When defining the bundle identifier `com.example.id`, Codemagic will fetch any uploaded certificates and profiles matching the extensions as well (e.g. `com.example.id.NotificationService`).
{{</markdown>}}

{{< /tab >}}
{{< /tabpane >}}


## Configure scripts to build the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).


### Build versioning

If you are going to publish your app to App Store Connect or Google Play, each uploaded artifact must have a new version satisfying each app store’s requirements. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).

In .NET MAUI, app version and build number are determined by `ApplicationDisplayVersion` and `ApplicationVersion` properties set either in the `.csproject` file or passed via command line. Using Codemagic CLI, you can easily fetch the latest published build version from the respective store and automatically increment it for each new build.

### Code signing
In order to code sign the app, the appropriate properties must be configured either in the `csproject` file or passed via command line.

#### Android
When using the default Codemagic code signing method (codesigning identities), the required environment variables will already be available for use in command line arguments.

#### iOS
When using the default Codemagic code signing method (codesigning identities), the correct certificate and provisioning profile will be automatically prepared. However, since the dotnet build command requires referencing the signing certificate and the provisioning profile by name, two additional script commands are necessary to get those values. Alternatively, you can enter the correct values as strings manually.

### Build script example
This is an example of the final script, including build versioning, code signing and the app building steps.

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build the app
      script: | 
        LATEST_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
        if [ -z $LATEST_BUILD_NUMBER ]; then
          UPDATED_BUILD_NUMBER=$BUILD_NUMBER
        else
          UPDATED_BUILD_NUMBER=$(($LATEST_BUILD_NUMBER + 1))
        fi
        
        cd src
        $DOTNET publish -f net6.0-android \
          -c Release \
          -p:AndroidKeyStore=True \
          -p:AndroidSigningKeyStore=$CM_KEYSTORE_PATH \
          -p:AndroidSigningKeyAlias=$CM_KEY_ALIAS \
          -p:AndroidSigningKeyPass=$CM_KEY_PASSWORD \
          -p:AndroidSigningStorePass=$CM_KEYSTORE_PASSWORD \
          -p:ApplicationVersion=$UPDATED_BUILD_NUMBER \
          -p:ApplicationDisplayVersion="1.0.0" \
          -o ../artifacts
  artifacts:
    - /Users/builder/clone/artifacts/*Signed.aab
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts: 
    - name: Build the app
      script: | 
        LATEST_BUILD_NUMBER=$(app-store-connect get-latest-testflight-build-number "$APP_ID")
        if [ -z $LATEST_BUILD_NUMBER ]; then
          UPDATED_BUILD_NUMBER=$BUILD_NUMBER
        else
          UPDATED_BUILD_NUMBER=$(($LATEST_BUILD_NUMBER + 1))
        fi
          
        CERT_NAME=$(keychain list-certificates | jq -r '.[] | .common_name')
        PROFILE_NAME=$(find ~/Library/MobileDevice/Provisioning\ Profiles -name "*.mobileprovision" -execdir sh -c '/usr/libexec/PlistBuddy -c "print :Name" /dev/stdin <<< $(security cms -D -i {})' \;)
          
        cd src
        $DOTNET publish -f net6.0-ios \
          -c Release \
          -p:BuildIpa=True \
          -p:ApplicationDisplayVersion="1.0.0" \
          -p:ApplicationVersion=$UPDATED_BUILD_NUMBER \
          -p:RuntimeIdentifier=ios-arm64 \
          -p:CodesignKey="$CERT_NAME" \
          -p:CodesignProvision="$PROFILE_NAME" \
          -o ../artifacts
  artifacts:
    - ./artifacts/*.ipa
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

## Publishing

{{< include "/partials/publishing-android-ios.md" >}}

## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the app in the Codemagic UI and start the build to see it in action.


Your final `codemagic.yaml` file should look something like this:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  maui-ios:
    name: Dotnet MAUI iOS
    max_build_duration: 120
    instance_type: mac_mini_m1
    integrations:
      app_store_connect: codemagic-api
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.maui.weather
      vars:
        DOTNET_PATH: $CM_BUILD_DIR/dotnet
        DOTNET: $CM_BUILD_DIR/dotnet/dotnet
        APP_ID: 6444530615
        BUNDLE_ID: "io.codemagic.maui.weather"
    scripts:
      - name: Install dotnet sdk
        script: | 
          wget https://dot.net/v1/dotnet-install.sh
          chmod +x dotnet-install.sh
          ./dotnet-install.sh --install-dir $DOTNET_PATH
      - name: Install MAUI
        script: | 
          $DOTNET_BIN nuget locals all --clear 
          $DOTNET_BIN workload install ios maui \
            --source https://aka.ms/dotnet6/nuget/index.json \
            --source https://api.nuget.org/v3/index.json      
      - name: Set Info.plist values
        script: | 
          # Automatically fill out the encryption compliance setting

          PLIST=$CM_BUILD_DIR/src/WeatherTwentyOne/Platforms/iOS/Info.plist
          PLIST_BUDDY=/usr/libexec/PlistBuddy
          $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST
      - name: Set build version and build the app
        script: | 
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-testflight-build-number "$APP_ID")
          if [ -z $LATEST_BUILD_NUMBER ]; then
            UPDATED_BUILD_NUMBER=$BUILD_NUMBER
          else
            UPDATED_BUILD_NUMBER=$(($LATEST_BUILD_NUMBER + 1))
          fi
          
          CERT_NAME=$(keychain list-certificates | jq -r '.[] | .common_name')
          PROFILE_NAME=$(find ~/Library/MobileDevice/Provisioning\ Profiles -name "*.mobileprovision" -execdir sh -c '/usr/libexec/PlistBuddy -c "print :Name" /dev/stdin <<< $(security cms -D -i {})' \;)
          
          cd src
          $DOTNET_BIN publish -f net6.0-ios \
            -c Release \
            -p:BuildIpa=True \
            -p:ApplicationDisplayVersion="1.0.0" \
            -p:ApplicationVersion=$UPDATED_BUILD_NUMBER \
            -p:RuntimeIdentifier=ios-arm64 \
            -p:CodesignKey="$CERT_NAME" \
            -p:CodesignProvision="$PROFILE_NAME" \
            -o ../artifacts
    artifacts:
        - ./artifacts/*.ipa
    publishing:
      app_store_connect:
        auth: integration
    
    
  maui-android:
    name: Dotnet MAUI Android
    max_build_duration: 120
    instance_type: mac_mini_m1
    environment:
      android_signing:
        - codemagic-key
      groups:
        - google_play
      vars:
        DOTNET_PATH: $CM_BUILD_DIR/dotnet
        DOTNET: $CM_BUILD_DIR/dotnet/dotnet
        PACKAGE_NAME: "io.codemagic.maui.weather"
    scripts:
      - name: Install dotnet sdk
        script: | 
          wget https://dot.net/v1/dotnet-install.sh
          chmod +x dotnet-install.sh
          ./dotnet-install.sh --install-dir $DOTNET_PATH
      - name: Install MAUI
        script: | 
          $DOTNET nuget locals all --clear 
          $DOTNET_BIN workload install android maui \
            --source https://aka.ms/dotnet6/nuget/index.json \
            --source https://api.nuget.org/v3/index.json      
      - name: Build
        script: | 
          LATEST_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
          if [ -z $LATEST_BUILD_NUMBER ]; then
            UPDATED_BUILD_NUMBER=$BUILD_NUMBER
          else
            UPDATED_BUILD_NUMBER=$(($LATEST_BUILD_NUMBER + 1))
          fi
          
          cd src
          $DOTNET_BIN publish -f net6.0-android \
            -c Release \
            -p:AndroidKeyStore=True \
            -p:AndroidSigningKeyStore=$CM_KEYSTORE_PATH \
            -p:AndroidSigningKeyAlias=$CM_KEY_ALIAS \
            -p:AndroidSigningKeyPass=$CM_KEY_PASSWORD \
            -p:AndroidSigningStorePass=$CM_KEYSTORE_PASSWORD \
            -p:ApplicationVersion=$UPDATED_BUILD_NUMBER \
            -p:ApplicationDisplayVersion="1.0.0" \
            -o ../artifacts
    artifacts:
        - /Users/builder/clone/artifacts/*Signed.aab
    publishing:
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true
{{< /highlight >}}

## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}

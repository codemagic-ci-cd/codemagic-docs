---
title: Signing iOS apps
description: How to set up iOS code signing in codemagic.yaml
weight: 1
aliases: [../code-signing-yaml/signing, /code-signing-yaml/signing-ios, code-signing-identities, ../yaml-code-signing/code-signing-identities]
---

All iOS applications have to be digitally signed before they can be installed on real devices or made available to the public.

{{<notebox>}}
**Note**: This guide is written specifically for users with `Team accounts`. If you are a `Personal account` user or if you want to use alternative Code signing methods, please check the [Code signing for Personal accounts](../yaml-code-signing/code-signing-personal) guide.
{{</notebox>}}


## Managing and uploading files

Team owner permissions are required to upload and edit files under the **Code signing identities** section. However, all team members can view the file info for any of the uploaded files.

### Creating the App Store Connect API key

Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.

{{< include "/partials/app-store-connect-api-key.md" >}}

### Adding the App Store Connect API key to Codemagic

1. Open your Codemagic Team settings, go to **Team integrations** > **Developer Portal** > **Manage keys**.
2. Click the **Add key** button.
3. Enter the `App Store Connect API key name`. This is a human readable name for the key that will be used to refer to the key later in application settings.
4. Enter the `Issuer ID` and `Key ID` values.
5. Click on **Choose a .p8 file** or drag the file to upload the App Store Connect API key downloaded earlier.
6. Click **Save**.



### Adding the Code signing certificate
{{< include "/partials/quickstart/code-signing-ios-add-certificate.md" >}}

### Adding the provisioning profile
{{< include "/partials/quickstart/code-signing-ios-add-provisioning-profile.md" >}}

## Referencing certificates and profiles in codemagic.yaml

Codemagic provides two means of fetching the required certificates and provisioning profiles during the build with the use of `codemagic.yaml`. Fetching can either be configured by specifying the distribution type and bundle identifier, or for more advanced use-cases, individual files can be fetched by their reference names.


### Fetching files by distribution type and bundle identifier

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


Note that when using the fields `distribution_type` and `bundle_identifier`, it is not allowed to configure `provisioning_profiles` and `certificates` fields.

{{<notebox>}}
**Note:** If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the `distribution_type` to `IOS_APP_STORE`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `distribution_type` to `IOS_APP_ADHOC`
{{</notebox>}}

When defining the bundle identifier `com.example.id`, Codemagic will fetch any uploaded certificates and profiles matching the extensions as well (e.g. `com.example.id.NotificationService`).


### Fetching specific files by reference names

For a more advanced configuration, it is possible to pick out specific uploaded profiles and certificates for Codemagic to fetch during the build. To do so, list the references of the uploaded files under the `provisioning_profiles` and `certificates` fields, respectively. Note than when fetching individual files, the fields `distribution_type` and `bundle_identifier` are not allowed.

Steps `Initialize keychain` & `Add certificates to keychain` scripts are not required as those are automatically fetched during the build process.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    
    # ....
    
    environment:
      ios_signing:
        provisioning_profiles:
          - profile_reference
          # - ...
        certificates:
          - certificate_reference
          # - ...
{{< /highlight >}}

Codemagic saves the files to the following locations on the build machine:

- Profiles: `~/Library/MobileDevice/Provisioning Profiles`
- Certificates: `~/Library/MobileDevice/Certificates`

It is additionally possible to include names for environment variables that will point to the file paths on the build machine.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    
    # ....
    
    environment:
      ios_signing:
        provisioning_profiles:
          - profile: profile_reference
            environment_variable: THIS_PROFILE_PATH_ON_DISK
          # - ...
        certificates:
          - certificate: certificate_reference
            environment_variable: THIS_CERTIFICATE_PATH_ON_DISK
          # - ...
{{< /highlight >}}


## Using provisioning profiles

To apply the profiles to your project during the build, add the following script before your build scripts:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    # ... your dependencies installation
    
    - name: Set up code signing settings on Xcode project
      script: xcode-project use-profiles
    
    # ... your build commands
{{< /highlight >}}

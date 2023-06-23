---
description: How to set up iOS code signing in the Flutter workflow editor
title: iOS code signing
weight: 1
aliases: /code-signing/ios-code-signing
---

Code signing is required by Apple for integrating app services, installing your iOS app on real devices, and for uploading it to App Store Connect so that it can be distributed through TestFlight or App Store. It enables to identify who developed the app and ensure that all the changes to the app come from you or your team.

To receive a signed `.ipa` file of your app on Codemagic, you need to set up code signing.

{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml** please go to [Signing iOS apps using codemagic.yaml](../code-signing-yaml/signing-ios).
{{</notebox>}}

## Prerequisites

Before you can start signing or distributing your app, there are a few things you need.

* [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership
* An [app ID](https://developer.apple.com/account/resources/identifiers/bundleId/add/) for your iOS app in Apple Developer portal 
* A **signing certificate** (`Personal Information Exchange, .p12`)
* A **provisioning profile** (`.mobileprovision`)

The signing certificates — development or distribution — help to identify who built the code. 

A provisioning profile — development or distribution — contains information about the app ID, the devices on which the app can be installed and the certificates that can be used for signing the app. Note that if your app contains app extensions, you need an additional provisioning profile for each app extension.

{{<notebox >}} 
**Note:** With **automatic code signing**, Codemagic will create both the certificate and the provisioning profile for you on your behalf without requiring a Mac.

With **manual code signing**, you need to upload the signing files manually.
{{</notebox>}}

For successful signing, the certificate and the provisioning profile must match in the following way:

{{< figure size="medium" src="../uploads/2019/03/CM-codesigning.jpg" caption="Matching the signing certificate and the provisioning profile" >}}

In short, the purpose of the different provisioning profiles is the following:

- **Development**: for testing the app on a real device while developing. 
- **Ad Hoc:** for distributing the app to non-TestFlight testers. The app must be built in **release** mode.
- **App Store**: for distributing the app via TestFlight or the App Store. The app must be built in **release** mode.

## Automatic code signing

{{< youtube aBDx6BKFXIA >}}

Codemagic makes automatic code signing possible by connecting to [App Store Connect via its API](https://developer.apple.com/app-store-connect/api/) for creating and managing your code signing certificates and provisioning profiles. It is possible to set up several code signing identities and use different code signing settings per workflow.

The following sections describe how to set up automatic code signing for builds configured in the UI. If you're building with `codemagic.yaml`, please refer [here](../code-signing-yaml/signing-ios).

### Step 1. Creating an App Store API key for Codemagic

Only App Store Connect admin can create an API key. It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api). To do so:

1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
2. Click on the + sign to generate a new API key.
3. Enter the name for the key and select an access level. We recommend choosing `App Manager`, considering that `Developer` does not have the required permissions to upload to the store. Read more about Apple Developer Program role permissions [here](https://help.apple.com/app-store-connect/#/deve5f9a89d7).
4. Click **Generate**.
5. As soon as the key is generated, you can see it added to the list of active keys. Click **Download API Key** to save the private key for later. Note that the key can only be downloaded once.

{{<notebox >}} 
**Note:** Take note of the **Issuer ID** above the table of active keys as well as the **Key ID** of the generated key as these will be required when setting up the Apple Developer Portal integration in Codemagic UI.
{{</notebox>}}

### Step 2. Connecting the Apple Developer Portal integration for your team/account

{{< include "/partials/integrations-setup-app-store-connect.md" >}}

### Step 3. Enabling automatic code signing for workflow

Once the Apple Developer Portal has been enabled for the account or team the app belongs to, you can easily enable automatic code signing per workflow.

1. Go to **App settings > Distribution > iOS code signing**.
2. Select **Automatic** as the code signing method. If you haven't enabled the Apple Developer Portal integration yet, you will be asked to enable it before you can continue configuration.
3. If you have several keys available, select the right key in the **App Store Connect API key** field.
4. Select the **provisioning profile type** used for provisioning the build. Codemagic will automatically select or generate a matching certificate for code signing. The provisioning profiles (except for Distribution) will include all the devices you have registered on your Apple Developer account at the time of creating the profile.
7. Select your app's **bundle identifier**. Codemagic lists all the bundle IDs available for the selected App Store Connect API key. If you can't see your app's bundle identifier listed, create one in [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/add/bundleId).

{{<notebox>}}
**Note:** If your app contains app extensions, an additional provisioning profile is required for each extension. Codemagic will use the bundle identifier to find the relevant provisioning profiles. If your bundle identifier is `com.example.app`, the matching profiles are the ones with `com.example.app` and `com.example.app.*` as bundle identifier.
{{</notebox>}}

As the next step, you can [configure publishing to App Store Connect](../publishing/publishing-to-app-store) to distribute the app via TestFlight or submit it to the App Store.

## Manual code signing

With the manual code signing method, you are required to upload the signing certificate and the matching provisioning profile(s) to Codemagic in order to receive signed builds.
This is required when distributing your app via Apple Developer Enterprise Program or Apple Business Manager. 

>See how to [export certificates and provisioning profiles](#exporting-certificates-and-provisioning-profiles).

### Setting up manual code signing

1. Go to **App settings > Distribution > iOS code signing**.
2. Select **Manual** as the code signing method.
3. Upload your signing certificate (in `.p12` format). If your certificate is password-protected, enter the **Certificate password**. 
4. Upload your provisioning profile (`.mobileprovision`). Note that if your app contains app extensions, you are required to upload an additional provisioning profile for each extension.

{{< figure size="medium" src="../uploads/manual_code_signing.png" caption="Manual code signing setup" >}}

Codemagic will now create a signed `.ipa` file with every build. Note that you must also [set up publishing to App Store Connect](../publishing/publishing-to-app-store) to distribute the app via TestFlight or submit it to the App Store.

#### Exporting certificates and provisioning profiles

>If you don't have an existing certificate, you will have to first [generate the signing certificate](https://help.apple.com/xcode/mac/current/#/dev154b28f09) using Xcode.

To export the signing certificate:

1. Open **Keychain Access** by searching for it in Spotlight.
2. Select **My Certificates** in the **Category** submenu on the left sidebar. 
3. Locate your certificate. The name of the certificate should start with **iPhone Developer** or **iPhone Distribution**.
3. Click on the certificate and select **File > Export Items** from the OSX menu bar.
4. You are then prompted to save the certificate. Be sure to leave the file format field filled as `Personal Information Exchange (.p12)` because saving the certificate with the `.cer` extension will not include your private key.
5. Enter the certificate export password when prompted (optional).

To export the provisioning profile:

1. Log in to the Apple Developer portal.
2. Navigate to **Certificates, Identifiers & Profiles > Profiles**.
3. Select the provisioning profile you would like to export and click **Download**.
4. Save it to have it ready.

## Additional information

More information about iOS code signing is available <a href="https://blog.codemagic.io/how-to-code-sign-publish-ios-apps/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','how-to-code-sign-publish-ios-apps')">here</a>.

---
description: Sign Flutter app for iOS
title: iOS code signing
weight: 1
---

Code signing is required by Apple for integrating app services, installing your iOS app on real devices, and for uploading it to App Store Connect so that it can be distributed through TestFlight or App Store. It enables to identify who developed the app and ensure that all the changes to the app come from you or your team.

To receive a signed `.ipa` file of your app on Codemagic, you need to set up code signing.

## Prerequisites

Before you can start signing or distributing your app, there are a few things you need.

* [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership
* An [app ID](https://developer.apple.com/account/resources/identifiers/bundleId/add/) for your iOS app in Apple Developer portal 
* A **signing certificate** (`Personal Information Exchange, .p12`)
* A **provisioning profile** (`.mobileprovision`)

The signing certificates — development or distribution — help to identify who built the code. 

A provisioning profile — development or distribution — contains information about the app ID, the devices on which the app can be installed and the certificates that can be used for signing the app. Note that if your app contains app extensions, you need an additional provisioning profile for each app extension.

{{<notebox >}} 
With **automatic code signing**, Codemagic will create both the certificate and the provisioning profile for you on your behalf without requiring a Mac.

With **manual code signing**, you need to upload the signing files manually.
{{</notebox>}}

For successful signing, the certificate and the provisioning profile must match in the following way:

{{< figure size="medium" src="../uploads/2019/03/CM-codesigning.jpg" caption="Matching the signing certificate and the provisioning profile" >}}

In short, the purpose of the different provisioning profiles is the following:

- **Development**: for testing the app on a real device while developing. 
- **Ad Hoc:** for distributing the app to non-TestFlight testers (e.g. via [Testmagic](https://testmagic.io/)). The app must be built in **release** mode.
- **App Store**: for distributing the app via TestFlight or the App Store. The app must be built in **release** mode.

## Automatic code signing

Based on the selected provisioning profile type, Codemagic will create a development or a distribution certificate and a development, Ad hoc or App store provisioning profile. The provisioning profile (except for Distribution) will include all the devices you have registered on your Apple Developer account.

{{<notebox>}}
To use automatic code signing, you are required to enable the **Apple Developer portal** integration.
{{</notebox>}}

### Enabling the Apple Developer Portal integration

Apple Developer Portal integration can be enabled in **User settings > Integrations** for personal projects and in **Team settings > Team integrations** for projects shared in the team (if you're the team owner). This allows you to conveniently use the same Apple Developer Portal credentials for automatic code signing across all projects and workflows.

1. In the list of available integrations, click the **Connect** button for **Developer Portal**.
2. Enter your **Apple ID** (Apple Developer Portal username) and **password**.
3. Click **Save**. Codemagic will attempt to establish a connection to Apple Developer Portal and will ask for a verification code for two-factor authentication or two-step verification. 
    >If you have set up several trusted phone numbers, select the phone number to which the verification code will be sent.
4. Enter the verification code and click **Save** one more time. On successful authentication, the Apple Developer Portal integration will be enabled.

### Setting up automatic code signing

1. Go to **App settings > Publish > iOS code signing**.
2. Select **Automatic** as the code signing method. If you haven't enabled the Apple Developer Portal integration yet, you will be asked to enable it before you can continue configuration.
3. If you belong to several Apple Developer teams, select the right team in the **Developer portal team** field.
4. Select the **provisioning profile type** used for provisioning the build. Codemagic will automatically select or generate a matching certificate for code signing.
7. Enter your app's **bundle identifier** (optional). By default, Codemagic looks for it from your `project.pbxproj` file. 

    >Note that if your app contains app extensions, an additional provisioning profile is required for each extension. Codemagic will use the bundle identifier to find the relevant provisioning profiles. If your bundle identifier is `com.example.app`, the matching profiles are the ones with `com.example.app` and `com.example.app.*` as bundle identifier.

8. Finally, click **Save** to finish the setup.

{{< figure size="medium" src="../uploads/automatic_code_signing.png" caption="Automatic code signing setup" >}}

As the next step, you can [configure publishing to App Store Connect](../publishing/publishing-to-app-store) to distribute the app via TestFlight or submit it to the App Store.

## Manual code signing

With the manual code signing method, you are required to upload the signing certificate and the matching provisioning profile(s) to Codemagic in order to receive signed builds.

>See how to [export certificates and provisioning profiles](#exporting-certificates-and-provisioning-profiles).

### Setting up manual code signing

1. Go to **App settings > Publish > iOS code signing**.
2. Select **Manual** as the code signing method.
3. Upload your signing certificate (in `.p12` format). If your certificate is password-protected, enter the **Certificate password**. 
4. Upload your provisioning profile (`.mobileprovision`). Note that if your app contains app extensions, you are required to upload an additional provisioning profile for each extension.
5. Click **Save** to finish the setup.

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

1. Log in to Apple Developer portal.
2. Navigate to **Certificates, Identifiers & Profiles > Profiles**.
3. Select the provisioning profile you would like to export and click **Download**.
4. Save it to have it ready.

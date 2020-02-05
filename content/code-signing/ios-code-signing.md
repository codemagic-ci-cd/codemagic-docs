---
description: Sign Flutter app for iOS
title: iOS code signing
weight: 1
---

Code signing is required by Apple for integrating app services, installing your iOS app on real devices, and for uploading it to App Store Connect so that it can be distributed through TestFlight or App Store. It enables to identify who developed the app and ensure that all the changes to the app come from you or your team.

To receive a signed `.ipa` file of your app on Codemagic, you need to set up code signing. When you build without code signing, you will receive a file that that runs on simulators only.

## Requirements

Before you can start signing or distributing your app, there are a few things you need.

* [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership
* An [app ID](https://developer.apple.com/account/resources/identifiers/bundleId/add/) for your iOS app in Apple Developer portal 
* A **signing certificate** (`Personal Information Exchange, .p12`)
* A **provisioning profile** (`.mobileprovision`)

The signing certificates — development or distribution — help to identify who built the code. The standard procedure for obtaining a signing certificate is by creating a [signing certificate via Xcode](https://help.apple.com/xcode/mac/current/#/dev154b28f09), after which you need to [export the certificate](#exporting-signing-certificate).

A provisioning profile — development or distribution — contains information about the app ID, the devices on which the app can be installed and the certificates that can be used for signing the app. Note that if your app contains app extensions, you need an additional provisioning profile for each app extension. The provisioning profiles can be managed and [downloaded](#downloading-provisioning-profile) via Apple Developer portal.

{{<notebox >}} 
**Automatic code signing without a Mac**

With **automatic code signing**, Codemagic will create both the **certificate** and the **provisioning profile** for you on your behalf. 
{{</notebox>}}

For successful signing, the certificate and the provisioning profile must match in the following way:

{{< figure size="medium" src="../uploads/2019/03/CM-codesigning.jpg" caption="Matching the signing certificate and the provisioning profile" >}}

In short, the purpose of the different provisioning profiles is the following:

- **Development**: for testing the app on a real device while developing. 
- **Ad Hoc:** for distributing the app to non-TestFlight testers (e.g. via [Testmagic](https://testmagic.io/)). The app must be built in **release** mode.
- **App Store**: for distributing the app via TestFlight or the App Store. The app must be built in **release** mode.

## Automatic code signing

With the automatic code signing feature, Codemagic will generate a signing certificate and a matching provisioning profile for you in-app and use them for code signing during the build. Depending on the selected provisioning profile type, Codemagic will create a development or a distribution certificate and a development, Ad hoc or App store provisioning profile. The provisioning profile (except for Distribution) will include all the devices you have registered on your Apple Developer account.

{{<notebox>}}
**Apple Developer Portal integration**

To use automatic code signing, you are required to enable the **Developer Portal** integration. If you have previously set up workflow-specific credentials, you can remove them in the iOS automatic code signing settings after setting up the integration.
{{</notebox>}}

### Enabling the Apple Developer Portal integration

Apple Developer Portal integration can be enabled in **User settings > Integrations** for personal projects and in **Team settings > Team integrations** for projects shared in the team (if you're the team owner). This allows you to convneniently use the same Apple Developer Portal credentials for automatic code signing across all projects and workflows.

1. In the list of available integrations, click the **Connect** button for **Developer Portal**.
2. Enter your **Apple ID** (Apple Developer Portal username) and **password**.
3. Click **Save**. Codemagic will attempt to establish a connection to Apple Developer Portal and will ask for a verification code for two-factor authentication or two-step verification. **Note** that if you have set up several trusted phone numbers, you can select a phone number for receiving the verification code.
4. Enter the verification code that was sent to you and click **Save** one more time. On successful authentication, the Apple Developer Portal integration will be enabled.

### Setting up automatic code signing for a workflow

1. Go to **App settings > Publish > iOS code signing**.
2. Select **Automatic** as the code signing method. If you haven't enabled the Apple Developer Portal integration yet, you will be asked to enable it before you can continue configuration.
3. If you belong to several Apple Developer teams, select the right team in the **Developer portal team** field.
4. Select the **provisioning profile type** used for provisioning the build. Codemagic will automatically select or generate a matching certificate for code signing.
7. Enter your app's **bundle identifier** (optional). By default, Codemagic looks for it from your `project.pbxproj` file. 

    >Note that if your app contains app extensions, an additional provisioning profile is required for each extension. Codemagic will use the bundle identifier to find the relevant provisioning profiles. If your bundle identifier is `com.example.app`, the matching profiles are the ones with `com.example.app` and `com.example.app.*` as bundle identifier.

8. Finally, click **Save** to finish the setup.

{{< figure size="medium" src="../uploads/automatic_code_signing.png" caption="Automatic code signing setup" >}}

As the next step, you can [configure publishing to App Store Connect](./publishing/publish-app-artifacts-to-app-center) to distribute your app to testers via TestFlight or submit it to App Store.

## Manual code signing

With the manual code signing method, you are required to upload the signing certificate and the matching provisioning profile(s) to Codemagic in order to receive signed builds.

1. Go to **App settings > Publish > iOS code signing**.
2. Select **Manual** as the code signing method.
3. Upload your signing certificate (in `.p12` format). If your certificate is password-protected, enter the **Certificate password**. 
4. Upload your provisioning profile (`.mobileprovision`). Note that if your app contains app extensions, you are required to upload an additional provisioning profile for each extension.
5. Click **Save** to finish the setup.

{{< figure size="medium" src="../uploads/manual_code_signing.png" caption="Manual code signing setup" >}}

Codemagic will now create a signed `.ipa` file with every build. Note that you must also [set up publishing to App Store Connect](./publishing/publish-app-artifacts-to-app-center) to distribute the app via TestFlight or submit it to the App Store.

## Exporting signing certificate

You will need a Mac to generate the signing certificate.

To export the signing certificate:

1. Open **Keychain Access** by searching for it in Spotlight.
2. Select **My Certificates** in the **Category** submenu on the left sidebar. The name of the certificate should start with **iPhone Developer** or **iPhone Distribution**.
3. Select **File** > **Export Items** from the OSX menu bar.
4. Save the certificate when prompted. Be sure to leave the file format filled as **Personal Information Exchange (.p12)** because saving the certificate with the **.cer** extension will not include your private key.
   {{< figure size="medium" src="../uploads/2019/03/keychain_certificate.PNG" caption="" >}}
5. Enter the certificate export password when prompted (optional).

## Downloading provisioning profile

You can manage your distribution profiles in [Apple Developer portal](https://developer.apple.com/account/ios/profile/profileList.action).

1. In the Provisioning Profiles section, select the appropriate provisioning profile type.
2. Click on the provisioning profile you would like to export and click **Download**.
3. Save it to have it ready.

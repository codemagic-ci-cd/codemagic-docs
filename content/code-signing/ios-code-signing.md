---
description: Sign Flutter app for iOS
title: iOS code signing
weight: 1
---

Code signing is required for installing your iOS app on real devices and publishing it to App Store. It enables to identify who developed the app and ensure that all the changes to the app come from you or your team.

To receive a signed `.ipa` file of your app on Codemagic, you need to set up code signing. When you build without code signing, you will receive only `Runner.app` that runs on simulators only.

## Requirements

Before you can start signing or distributing your app, you need to [enroll as an iOS developer](https://developer.apple.com/programs/enroll/) and [register an app ID](https://developer.apple.com/account/ios/identifier/bundle/create) in Apple Developer portal. Then, you need a **signing certificate** and a **provisioning profile** to sign the build.

{{<notebox>}}  
With our **automatic code signing** feature, Codemagic will create both the certificate and the provisioning profile for you on your behalf. When using our **manual code signing** method, you will need to first export the certificate and the provisioning profile in order to upload them, see [how to export the certificate and the provisioning profile](#exporting-signing-certificate-and-provisioning-profile).  
{{</notebox>}}

The certificate is issued by Apple and enables to identify who developed the code. Codemagic expects your certificate to be in **Personal Information Exchange (.p12)** format.

A provisioning profile contains information about the app ID, the devices on which the app can be installed and the certificates that can be used for signing the app. There are separate certificates and provisioning profiles for development and distribution. Note that if your app contains app extensions, you need an additional provisioning profile for each app extension. The provisioning profile must have the **.mobileprovision** extension.

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

To use automatic code signing, you are required to enable the **Developer Portal** integration in **User settings > Integrations** for personal projects and in **Team settings > Team integrations** for projects shared in the team (if you're the team owner). This allows you to convneniently use the same Apple Developer Portal credentials for automatic code signing across all projects and workflows.

If you have previously set up workflow-specific credentials, you can remove them in the iOS automatic code signing settings after setting up the integration.
{{</notebox>}}

### Enabling the Apple Developer Portal integration

1. In the list of available integrations, click the **Connect** button for **Developer Portal**.
2. Enter your **Apple ID** and **password**.
3. Click **Save**. Codemagic will attempt to establish a connection to Apple Developer Portal and will ask for a verification code for two-factor authentication or two-step verification. **Note** that if you have set up several trusted phone numbers, you can select a phone number for receiving the verification code.
4. Enter the verification code that was sent to you and click **Save** one more time. On successful authentication, the Apple Developer Portal integration will be enabled.

### Setting up automatic code signing for a workflow

1. Go to your **App settings**.
2. Make sure that you have **Release** mode selected in **Build** settings.
   ![Selecting Release mode in Build configuration](/uploads/build_configuration-1.png)

3. In the **Publish** section, click on iOS code signing to expand this step.
   ![Selecting iOS code signing in the Publish section](/uploads/publish_ioscodesigning-1.png)

4. Select **Automatic** as the code signing method.
   ![Automatic code signing setup for iOS](/uploads/2fa_ios_code_signing.png)
5. Enter your **Apple ID** (Apple developer portal username) and **Apple developer portal password**.
6. Then choose the **provisioning profile type**.
7. You can also enter your app's **bundle identifier** (optional). By default, Codemagic detects it automatically from your repository.
8. Finally, click **Save** to finish the setup. If your Apple developer account has two-step verification or two-step authentication enabled, you will be asked to enter your verification code in a popup and click **Save** again.

As the next step, you can configure publishing to App Store Connect to distribute your signed app to testers or submit it for review.

## Manual code signing

With the manual code signing method, you are required to upload the signing certificate and the matching provisioning profile to Codemagic in order to receive signed builds for the workflow at hand.

1. In your App settings, navigate to the Publish section.
2. Click on **iOS code signing** to expand this step.
3. Select **Manual** as the code signing method.
4. Upload your signing certificate (in `.p12` format) and provisioning profile (`.mobileprovision`). Note that if your app contains app extensions, you are required to upload an additional provisioning profile for each extension.
5. Click **Save** to finish the setup.

{{< figure size="medium" src="../uploads/2019/03/manual_code_signing.PNG" caption="Manual code signing setup" >}}

Codemagic will now create a signed `.ipa` file with every build. Note that you must also set up publishing to App Store Connect to distribute the app to the App Store.

## Exporting signing certificate and provisioning profile

You will need a Mac to generate the signing certificate.

To export the signing certificate:

1. Open **Keychain Access** by searching for it in Spotlight.
2. Select **My Certificates** in the **Category** submenu on the left sidebar. The name of the certificate should start with **iPhone Developer** or **iPhone Distribution**.
3. Select **File** > **Export Items** from the OSX menu bar.
4. Save the certificate when prompted. Be sure to leave the file format filled as **Personal Information Exchange (.p12)** because saving the certificate with the **.cer** extension will not include your private key.
   {{< figure size="medium" src="../uploads/2019/03/keychain_certificate.PNG" caption="" >}}
5. Enter the certificate export password when prompted (optional).

You can manage your distribution profiles in [Apple Developer portal](https://developer.apple.com/account/ios/profile/profileList.action).

1. In the Provisioning Profiles section, select the appropriate provisioning profile type.
2. Click on the provisioning profile you would like to export and click **Download**.
3. Save it to have it ready.

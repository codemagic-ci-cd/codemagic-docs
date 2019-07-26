---
description: Sign Flutter app for iOS
title: iOS code signing
weight: 1
---

Code signing is required for installing your iOS app on real devices and publishing it to App Store. It enables to identify who developed the app and ensure that all the changes to the app come from you or your team.

To receive a signed `.ipa` file of your app on Codemagic, you need to set up code signing. When you build without code signing, you will receive only `Runner.app` that runs on simulators only.

### Requirements

Before you can start signing or distributing your app, you need to [enroll as an iOS developer](https://developer.apple.com/programs/enroll/) and [register an app ID](https://developer.apple.com/account/ios/identifier/bundle/create) in Apple Developer portal. Then, you need a **signing certificate** and a **provisioning profile** to sign the build.

{{% notebox %}}  
With our **automatic code signing** feature, Codemagic will create both the certificate and the provisioning profile for you on your behalf. When using our **manual code signing** method, you will need to first export the certificate and the provisioning profile in order to upload them, see [how to export the certificate and the provisioning profile](#exporting-signing-certificate-and-provisioning-profile).  
{{% /notebox %}}

The certificate is issued by Apple and enables to identify who developed the code. Codemagic expects your certificate to be in **Personal Information Exchange (.p12)** format.

A provisioning profile contains information about the app ID, the devices on which the app can be installed and the certificates that can be used for signing the app. There are separate certificates and provisioning profiles for development and distribution. Note that if your app contains app extensions, you need an additional provisioning profile for each app extension. The provisioning profile must have the **.mobileprovision** extension.

For successful signing, the certificate and the provisioning profile must match in the following way:

{{< figure size="medium" src="../uploads/2019/03/CM-codesigning.jpg" caption="Matching the signing certificate and the provisioning profile" >}}

In short, the purpose of the different provisioning profiles is the following:

- **Development**: for testing the app on a real device while developing. The app must be built in **debug** mode.
- **Ad Hoc:** for distributing the app to non-TestFlight testers (e.g. via [Testmagic](https://testmagic.io/)). The app must be built in **release** mode.
- **App Store**: for distributing the app via TestFlight or the App Store. The app must be built in **release** mode.

### Setting up automatic code signing

With the automatic code signing feature, Codemagic will generate a signing certificate and a matching provisioning profile for you in-app and use them for code signing during the build. Depending on the selected provisioning profile type, Codemagic will create a development or a distribution certificate and a development, Ad hoc or App store provisioning profile. The provisioning profile (except for Distribution) will include all the devices you have registered on your Apple Developer account.

To set up automatic code signing:

1. In your App settings, navigate to the Publish section.
2. Click on **iOS code signing** to expand this step.
3. Select **Automatic** as the code signing method.
4. Enter your **Apple ID** (Apple Developer portal username) and **Apple Developer portal password**.
5. Select the provisioning profile type. Note that **Development** requires building your app in **debug** mode, while **Ad hoc** and **App store** require selecting **release** mode in the Build section.
6. You can also enter your app’s **bundle identifier** (optional). By default, Codemagic detects it automatically from your `project.pbxproj`file.
7. Click **Save** to finish the setup.

{{< figure size="medium" src="../uploads/2019/03/automatic_code_signing2.PNG" caption="Automatic code signing setup" >}}

{{% notebox %}}
If your Apple developer account has **two-step verification** or **two-step authentication** enabled, you will be asked to enter your verification code in a popup and click **Save** again. Note that the length of the session depends on Apple and is limited to approximately a day. When the session expires, you will need to verify the login again. Simply click **Save** in the iOS code signing settings to display the verification popup.
{{% /notebox %}}

After you have successfully established connection to Apple developer portal, you will have the option to specify the **Developer portal team**. Make sure to click **Save** again to save the changes.

{{< figure size="medium" src="../uploads/team_selection_edited.png" caption="Apple developer portal team selection" >}}

As the next step, you can configure publishing to App Store Connect to distribute your signed app to testers or submit it for review.

### Setting up manual code signing

With the manual code signing method, you are required to upload the signing certificate and the matching provisioning profile to Codemagic in order to receive signed builds for the workflow at hand.

1. In your App settings, navigate to the Publish section.
2. Click on **iOS code signing** to expand this step.
3. Select **Manual** as the code signing method.
4. Upload your signing certificate (in `.p12` format) and provisioning profile (`.mobileprovision`). Note that if your app contains app extensions, you are required to upload an additional provisioning profile for each extension.
5. Click **Save** to finish the setup.

{{< figure size="medium" src="../uploads/2019/03/manual_code_signing.PNG" caption="Manual code signing setup" >}}

Codemagic will now create a signed `.ipa` file with every build. Note that you must also set up publishing to App Store Connect to distribute the app to the App Store.

### Exporting signing certificate and provisioning profile

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

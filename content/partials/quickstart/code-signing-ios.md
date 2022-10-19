---
title: Code signing for iOS - quick start version
---
{{<markdown>}}
#### Creating the App Store Connect API key
Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.
{{</markdown>}}
{{< include "/partials/app-store-connect-api-key.md" >}}

#### Adding the App Store Connect API key to Codemagic

1. Open your Codemagic Team settings, go to **Team integrations** > **Developer Portal** > **Manage keys**.
2. Click the **Add key** button.
3. Enter the `App Store Connect API key name`. This is a human readable name for the key that will be used to refer to the key later in application settings.
4. Enter the `Issuer ID` and `Key ID` values.
5. Click on **Choose a .p8 file** or drag the file to upload the App Store Connect API key downloaded earlier.
6. Click **Save**.

#### Adding the code signing certificate
{{< include "/partials/quickstart/code-signing-ios-add-certificate.md" >}}

#### Adding the provisioning profile
{{< include "/partials/quickstart/code-signing-ios-add-provisioning-profile.md" >}}

#### Referencing certificates and profiles in codemagic.yaml
{{< include "/partials/quickstart/code-signing-ios-reference-certificate.md" >}}


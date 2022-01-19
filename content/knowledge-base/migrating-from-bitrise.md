---
description: How to migrate from Bitrise to Codemagic
title: Migrating from Bitrise
weight: 13
---

Codemagic makes use of codemagic.yaml for configurating your workflow. For Flutter applications, there's also a Flutter workflow editor, which simplifies the setup, but removes some degree of flexibility.

## Migrating iOS builds with codemagic.yaml

### Code signing

Like Bitrise, Codemagic also lets users configure either a manual or an automatic option for handling iOS code signing profiles and certificates.
#### Manual

Codemagic requires you to add all of your signing files (profiles, certificates, etc.) as environment variables with the manual option. These are the same files uploaded on Bitrise under the applications `Code Signing` tab.

If you have used manual code signing on Bitrise, setting it up with Codemagic is relatively simple. You can download the necessary provisioning profiles and certificates from Bitrise's `Code Signing` tab. To add them as environment variables in Codemagic, navigate to your application and click the `Environment variables` tab. Encode the contents of your files with base64 and paste the values into Codemagic; make sure to check `Secure` when providing sensitive information. Along with creating these variables, create a new variable group, e.g., `ios_code_signing`, which you can later reference in your `codemagic.yaml`. For convenience, we recommend naming your variables as `FCI_CERTIFICATE`, `FCI_CERTIFICATE_PASSWORD`, and `FCI_PROVISIONING_PROFILE`. However, you can name the variables differently if you reference them correctly in the scripts section. In the case of multiple provisioning profiles, the recommended naming convention is `FCI_PROVISIONING_PROFILE_1`, `FCI_PROVISIONING_PROFILE_2` etc.

As mentioned above, unlike with the Bitrise `Certificate and profile installer` step, you must reference the added files in your scripts section. Follow the detailed documentation [here](../yaml-code-signing/signing-ios/#manual-code-signing).

#### Automatic

When using Codemagic automatic code signing for iOS, then similar to Bitrise's `Manage iOS Code Signing` step, Codemagic uses the [App Store Connect API](../yaml-code-signing/signing-ios/#creating-the-app-store-connect-api-key) for managing signing profiles and certificates.

The same values required in Bitrise are also needed in Codemagic. With the `codemagic.yaml` configuration, the values have to be provided as [environment variables](..yaml-code-signing/signing-ios/#saving-the-api-key-to-environment-variables). In addition, codemagic requires you to create an RSA 2048 bit private key to be included in the signing certificate. 

Then, using the defined variables in your scripts section to automate creating and fetching profiles and certificates is possible.

Follow the steps defined in our [documentation](../yaml-code-signing/signing-ios/#automatic-code-signing) to find information on how to generate the necessary details and use them in your configuration.

### Deployment

To publish 

## Migrating Android builds with codemagic.yaml

### Code signing

### Deployment

## Migrating Flutter builds with Flutter workflow editor

Besides using the codemagic.yaml file for configuration, for Flutter applications it is also possible to use the Flutter workflow editor for configuration.

### Code signing

#### iOS workflow

#### Android workflow

### Deployment

#### iOS workflow

#### Android workflow

## Migrating iOS

### Code signing
lOREM IPSUM
#### Automatic

As with Bitrise, to connect your Apple Developer account, an API key connection is needed. With Bitrise, this connection can be established from under your profile settings, whereafter it has to be explicitly enabled under your application settings. To make use of automatic code signing, you will have to configure the 'Manage iOS Code Signing' in your Bitrise workflow.

With Codemagic, depending on whether your configuring with yaml or Flutter Workflow Editor, the process can vary slightly.

##### WFE

For WFE, it works almost exactly the same. Wherein the option to connect your Developer Portal account can be found under user or team settings. Codemagic requires you to provide all of the same data - a name for your API key, issuer ID and key ID, along with a .p8 file donwloaded from App Store Connect. A step by step instruction can be found under [Code signing](/flutter-code-signing/ios-code-signing/).

In this scenario, the correct API key has to be chosen in your workflow settings under iOS code signing. Check 'Automatic' under 'Select code signing method' and select the provisioning profile type under 'Provisioning profile type'. If the certificates and profiles do not exist, Codemagic will attempt to generate them. Take note that Apple only allows three distribution certificates per account. 

##### codemagic.yaml

In the case of codemagic.yaml configuration, these same values can be configured as environment variables. Go to [Signing iOS apps using codemagic.yaml](../yaml-code-signing/signing-ios/#saving-the-api-key-to-environment-variables) for more details. Along with importing the environment variables, extra scripts are needed in the yaml to load in and use the certificates and profiles.

#### Manual

If you have already configured manual code signing in Bitrise, migrating these details over to Codemagic is quite straightforward, as Bitrise allows you to download the uploaded certificates and profiles.

##### WFE

For Flutter workflow editor, you can upload these under your workflow settings at 'iOS code signing' when setting the code signing method to 'manual'.

However, take notice that these files and settings with Codemagic are specific to the given workflow. It is possible to add multiple provisioning profiles to handle application extensions. Find detailed instructions under [iOS code signing](../flutter-code-signing/ios-code-signing/#setting-up-manual-code-signing).
##### codemagic.yaml

[Signing iOS apps using codemagic.yaml](../yaml-code-signing/signing-ios/#manual-code-signing)

### Publishing
Lorem ipsum

## Migrating Android

lorem ipsum

```
codeblock
```

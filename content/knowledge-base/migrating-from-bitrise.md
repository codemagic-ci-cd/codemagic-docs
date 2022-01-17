---
description: How to migrate from Bitrise to Codemagic
title: Migrating from Bitrise
weight: 13
---

Codemagic makes use of codemagic.yaml for configurating your workflow. For Flutter applications, there's also workflow editor, which simplifies the setup, but removes some degree of flexibility.

It's easy.

## Migrating iOS

Similar to Bitrise, Codemagic also lets users configure either a manual or an automatic option for handling iOS code signing profiles and certificates.

For simplicity, Codemagic has deprecated apple_id, apple_key authentication for WFE and relies solely on API keys. However, setting everything up with apple_id, apple_key is possible for YAML builds.

### Automatic

As with Bitrise, to connect your Apple Developer account, an API key connection is needed. With Bitrise, this connection can be established from under your profile settings, whereafter it has to be explicitly enabled under your application settings. To make use of automatic code signing, you will have to configure the 'Manage iOS Code Signing' in your Bitrise workflow.

With Codemagic, depending on whether your configuring with yaml or Flutter Workflow Editor, the process can vary slightly.

#### WFE

For WFE, it works almost exactly the same. Wherein the option to connect your Developer Portal account can be found under user or team settings. Codemagic requires you to provide all of the same data - a name for your API key, issuer ID and key ID, along with a .p8 file donwloaded from App Store Connect. A step by step instruction can be found under [Code signing](/flutter-code-signing/ios-code-signing/).

In this scenario, the correct API key has to be chosen in your workflow settings under iOS code signing. Check 'Automatic' under 'Select code signing method' and select the provisioning profile type under 'Provisioning profile type'. If the certificates and profiles do not exist, Codemagic will attempt to generate them. Take note that Apple only allows three distribution certificates per account. 

#### codemagic.yaml

In the case of codemagic.yaml configuration, these same values can be configured as environment variables. Go to [Signing iOS apps using codemagic.yaml](../yaml-code-signing/signing-ios/#saving-the-api-key-to-environment-variables) for more details. Along with importing the environment variables, extra scripts are needed in the yaml to load in and use the certificates and profiles.

### Manual

If you have already configured manual code signing in Bitrise, migrating these details over to Codemagic is quite straightforward, as Bitrise allows you to download the uploaded certificates and profiles.

#### WFE

For Flutter workflow editor, you can upload these under your workflow settings at 'iOS code signing' when setting the code signing method to 'manual'.

However, take notice that these files and settings with Codemagic are specific to the given workflow. It is possible to add multiple provisioning profiles to handle application extensions. Find detailed instructions under [iOS code signing](../flutter-code-signing/ios-code-signing/#setting-up-manual-code-signing).
#### codemagic.yaml

[Signing iOS apps using codemagic.yaml](../yaml-code-signing/signing-ios/#manual-code-signing)

## Migrating Android

lorem ipsum

```
codeblock
```

title: Fastlane integration
description: How to use Fastlane in codemagic.yaml
weight: 4
---

**Fastlane** is an open source platform aimed at simplifying Android and iOS deployment. If your development team uses Fastlane, it can be used as part of your CI/CD pipeline to build and deploy your applications. Fastlane is preinstalled on the Codemagic build servers.

## Configuring Fastlane in Codemagic

Five **environment variables**  need to be added to your workflow for Fastlane integration: 

- `MATCH_PASSWORD` - the password used to encrypt/decrypt the repository used to store your distrbution certificates and provisioning profiles.
- `MATCH_KEYCHAIN` - an arbitrary name to use for the keychain on the build server, e.g "codemagic_keychain"
- `APP_STORE_CONNECT_PRIVATE_KEY` - the App Store Connect API key. Copy the entire contents of the .p8 file and paste into the environment variable value field.
- `APP_STORE_CONNECT_KEY_IDENTIFIER` - the key identifier of your App Store Connect API key.
- `APP_STORE_CONNECT_ISSUER_ID` - the issuer of your App Store Connect API key.

Environment variables can be added in the Codemagic web app using the 'Environment variables' tab. You can then import your variable groups into your codemagic.yaml. For example, if you named your variable group 'fastlane', you would import it as follows:

```
workflows:
  workflow-name:
    environment:
      groups:
        - fastlane
```

For further information about using variable groups, please click [here](https://docs.codemagic.io/variables/environment-variable-groups/).

## Cocoapods

If you are using dependencies from Cocoapods, it might be necessary to include the "cocoapods" gem in your Gemfile to prevent scope conflict issues. 

```
gem "cocoapods"
```

## Sample project

A sample project that shows how to configure Fastlane is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/fastlane-integration-demo-project).

Please refer to the **readme.md**, **Fastfile** and **codemagic.yaml** in the sample project for configuration instructions for your project.
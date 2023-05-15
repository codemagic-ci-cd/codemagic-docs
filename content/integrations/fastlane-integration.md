---
title: Fastlane integration
description: How to use Fastlane in codemagic.yaml
weight: 4
aliases:
  - /knowledge-base/beta-deployment-with-fastlane
  - /flutter-publishing/beta-deployment-with-fastlane
  - /publishing/beta-deployment-with-fastlane
---

**Fastlane** is an open source platform aimed at simplifying Android and iOS deployment. If your development team uses Fastlane, it can be used as part of your CI/CD pipeline to build and deploy your applications. Fastlane is preinstalled on the Codemagic build servers.

## Configuring Fastlane in Codemagic

In order to use Fastlane with Codemagic, you need to configure the following environment variables: 

- `MATCH_PASSWORD` - the password used to encrypt/decrypt the repository used to store your distribution certificates and provisioning profiles.
- `MATCH_KEYCHAIN` - an arbitrary name to use for the keychain on the build server, e.g "codemagic_keychain"
- `MATCH_SSH_KEY` - an SSH private key used for cloning the Match repository that contains your distribution certificates and provisioning profiles. The public key should be added to your Github account. See [here](https://docs.codemagic.io/configuration/access-private-git-submodules/) for more information about accessing Git dependencies with SSH keys.
- `APP_STORE_CONNECT_PRIVATE_KEY` - the App Store Connect API key. Copy the entire contents of the .p8 file and paste into the environment variable value field. Make sure to mark it secure in order to encrypt the value. 
- `APP_STORE_CONNECT_KEY_IDENTIFIER` - the key identifier of your App Store Connect API key.
- `APP_STORE_CONNECT_ISSUER_ID` - the issuer of your App Store Connect API key.

<br>

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `MATCH_PASSWORD`.
3. Enter the required value as **_Variable value_**.
4. Enter the variable group name, e.g. **_fastlane_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to add other required variables

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - fastlane
      - app_store_connect_credentials
{{< /highlight >}}


For further information about using variable groups, please click [here](https://docs.codemagic.io/variables/environment-variable-groups/).


## Cocoapods

If you are using dependencies from Cocoapods, it might be necessary to include the "cocoapods" gem in your Gemfile to prevent scope conflict issues. 

{{< highlight ruby "style=paraiso-dark">}}
  gem "fastlane"
  gem "cocoapods"
{{< /highlight >}}


## Fastlane plugins

If you are using any Fastlane plugins, you should create a script in your `codemagic.yaml` to install them as follows:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install Fastlane plugins
      script: | 
        cd ios     # change to ios/android folder as required
        bundle add fastlane-plugin-s3
        bundle add fastlane-plugin-dropbox
{{< /highlight >}}


## Running your Fastlane lane

In the `codemagic.yaml`, you should install your dependencies with `bundle install` and then execute the Fastlane lane with `bundle exec fastlane <lane_name>` as follows:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Run fastlane
      script: | 
        bundle install
        bundle exec fastlane beta
{{< /highlight >}}


If you need to use a specific version of bundler as defined in the `Gemfile.lock` file, you should install it with `gem install bundler:<version>` as follows:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Run fastlane
      script: | 
        gem install bundler:2.2.27
        bundle install
        bundle exec fastlane beta
{{< /highlight >}}


## Artifacts

To gather the .ipa and debug symbols from your build, add the **artifacts** section to your codemagic.yaml as follows:

{{< highlight yaml "style=paraiso-dark">}}
    artifacts:
      - ./*.ipa
      - ./*.dSYM.zip      
{{< /highlight >}}


You can find more information about configuring artifacts [here](../yaml-basic-configuration/yaml-getting-started#artifacts)


## Sample project

A sample project that shows how to configure Fastlane is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/fastlane-integration-demo-project).

Please refer to the **readme.md**, **Fastfile** and **codemagic.yaml** in the sample project for configuration instructions for your project.

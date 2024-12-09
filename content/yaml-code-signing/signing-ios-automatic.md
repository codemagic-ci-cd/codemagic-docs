---
title: Signing iOS apps automatically
description: How to set up iOS code signing in using automatic code signing in codemagic.yaml
weight: 1
aliases: [../code-signing-yaml/signing, /code-signing-yaml/signing-ios, code-signing-identities, ../yaml-code-signing/code-signing-identities]
---

All iOS applications have to be digitally signed before they can be installed on real devices or made available to the public.

### Automatic code signing

In **Automatic code signing**, Codemagic takes care of Certificate and Provisioning profile management for you. Based on the `Certificate private key` that you provide, Codemagic will automatically fetch the correct certificate from the App Store or create a new one if necessary.

When automatic code signing is used, then most up-to-date signing files are obtained directly from Apple during the build time. This requires that Codemagic has access to your Apple Developer portal account, which is achieved by using App Store Connect API key.

{{<notebox>}}
Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership. 
{{</notebox>}}


#### Creating the App Store Connect API key

{{< include "/partials/app-store-connect-api-key.md" >}}

{{< include "/partials/code-signing-ios-obtain-certificate.md" >}}

{{< include "/partials/code-signing-ios-configure-environment-vars.md" >}}

Finally, to code sign the app, add the following commands in the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, after all the dependencies are installed, right before the build commands. 

{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files "$BUNDLE_ID" \
            --type IOS_APP_STORE \
            --create
      - name: Set up signing certificate
        script: keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
{{< /highlight >}}

Instead of specifying the exact bundle-id, you can use `"$(xcode-project detect-bundle-id)"`.

Based on the specified bundle ID and [provisioning profile type](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store) set with the `--type` argument, Codemagic will fetch or create the relevant provisioning profile and certificate to code sign the build.

If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the  `--type` argument to `IOS_APP_STORE`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `--type` argument to `IOS_APP_ADHOC`
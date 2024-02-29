---
description: How to overcome common issues building iOS mobile apps on Codemagic 
title: Common iOS issues
weight: 3
aliases:
  - /troubleshooting/common-issues
---

### Getting **Not uploaded** message under the code signing identities for iOS provisioning profiles.

###### Description

When uploading a provisioning profile by opening the **Code signing identities** section in team settings, you are seeing a red cross ❌.

###### Cause

It happens when the certificate that is uploaded under the **iOS certificates** tab is not included in that particular provisioning profile that is giving you a red cross warning.

###### Solution

Open your Apple Developer account and find that exact profile under the Profiles sidebar in the left, click to Edit it and then, choose the certificate that you have uploaded in the Codemagic UI under **Code signing identities** and click to save it. After downloading it to your local machine, you need to upload it to **Code signing identities** in your team settings. 

### Error creating authentication sessions

###### Description
When App Store Connect is not correctly set up, users might encounter an error message similar to the following:

    altool[xxx:xxx] *** Error: Unable to validate archive '/Users/builder/ipas/xxx'.
    altool[xxx:xxx] *** Error: code -22020 (Unable to validate your application. We are unable to create an authentication session.)

###### Cause
The most common reason for this error message is using your Apple ID password instead of [app-specific password](https://support.apple.com/en-us/HT204397) in App Store Connect publishing settings. 

###### Solution
To generate an app-specific password, sign in to your [Apple ID account page](https://appleid.apple.com/account/manage), navigate to the **Security** section, and click **Generate Password...** below **App-Specific Passwords**. The generated app-specific password will be in this format: `abcd-efgh-ijkl-mnop`. Insert this value into the Flutter workflow editor or as a password in `codemagic.yaml` when setting up publishing to App Store Connect. Note that the password should be generated with the same Apple account that you are using for publishing.


### Errors with code signing

This is the list of the most common issues that may cause iOS code signing errors during a CI build.

###### The uploaded certificate is in a wrong format or corrupt
Codemagic looks for a certificate in **Personal Information Exchange** (`.p12`) format. See [how to export the certificate](../code-signing/ios-code-signing/#exporting-signing-certificate-and-provisioning-profile).

###### The uploaded certificate and provisioning profile do not match
For example, you're using a **development** certificate with a **distribution** profile to sign the build, or the certificate used for signing is not included in the provisioning profile.

Make sure the certificate and the provisioning profile types match.

###### Missing entitlements in the Apple Developer portal
In case of getting errors about an existing provisioning profile's missing entitlements, you can add or update the entitlements by finding and editing the profile in **Apple Developer portal > Certificates, identifier & profiles > Identifiers**. Alternatively, it can be done in Xcode under **Signing & Capabilities** of the given target. 

When building a Flutter project, a similar error could be thrown due to a couple of other reasons:

    > Code Signing Error: "Runner" requires a provisioning profile with the Push Notifications feature. Select a provisioning profile in the Signing & Capabilities editor.

1. Setting up code signing settings on Xcode project step is missing. Double check if **xcode-project use-profiles** step is missing in **codemagic.yaml** before executing the build command.
2. Export options are not valid in the project. It can be configured by adding **--export-options-plist=/Users/builder/export_options.plist** to the build command in **codemagic.yaml**. 


###### iOS scheme not specified for the `archive` action of an Xcode build

This applies when your app has custom iOS schemes. By default, Codemagic builds the `Runner` scheme, but you can use the `CM_FLUTTER_SCHEME` [environment variable](../building/environment-variables) to specify another scheme.


###### Bundle ID mismatch

Make sure that the bundle ID entered in automatic code signing setup on Codemagic matches the bundle ID in the build configuration that is used for archiving the app with Xcode.

Codemagic assigns provisioning profiles to build targets and configurations before building the iOS app. That assignment is based on the bundle ID match in both provisioning profile and the build configuration. If a signing configuration is not assigned to the build target/configuration that is used for archiving, the build will fail.

If bundle identifiers are not properly set for your project, you will often see an error message similar to this one:
```
❌ error: Runner has conflicting provisioning settings. Runner is automatically signed, but code signing identity Apple Push Services has been manually specified. Set the code signing identity value to “iPhone Developer” in the build settings editor, or switch to manual signing in the Signing & Capabilities editor. (in target ‘Runner’ from project ‘Runner’)
```

**Solution**:
* Confirm that you have set the correct bundle identifiers for all targets in Xcode.
* Verify that the bundle identifier set in Xcode matches the bundle identifier set in the Flutter workflow editor under code signing.


###### Outdated Provisioning profile that does not include Associated Domains.
In such cases, you will often see an error message similar to this one:
```
❌ error: Provisioning profile "CodeMagic" doesn't support the Associated Domains capability. (in target 'Runner' from project 'Runner').
 
❌ error: Provisioning profile "CodeMagic" doesn't include the com.apple.developer.associated-domains entitlement. (in target 'Runner' from project 'Runner').
```

**Solution**:

Log in to your Apple Developer account and verify:
* That you are using the correct bundle identifier.
* If missing, add the Associated Domain Entitlement from there.
* Update the provisioning profile and use it to configure your project.

###### iOS deployment target issue
A common error message with regard to deployment target is the following:
```
The iOS deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 8.0, but the range of supported deployment target versions is 9.0 to 14.4.99
```
The error usually occurs if the deployment target set in Podfile is lower than required or when the Podfile is missing.

**Solution**:
* Confirm if a Podfile exists in the repository. If not, create a Podfile in the `ios` directory and insert the following manually in there:

{{< highlight bash "style=paraiso-dark">}}
# Uncomment the next line to define a global platform for your project
platform :ios, ’10.0’
target 'Runner' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!
 # Pods for Runner
end
{{< /highlight >}}

* Check the Podfile and make sure that `platform :ios, ’10.0’` is set to `10.0` or above as required by dependencies.
* Confirm if `IPHONEOS_DEPLOYMENT_TARGET` is set to 9.0 or above


### Build hangs at `Xcode build done`

###### Description
When building for iOS, the build gets stuck after showing `Xcode build done` in the log but does not finish and eventually times out.

Log output look similar to this example 

    == Building for iOS ==

    == /usr/local/bin/flutter build ios --release --no-codesign ==
    Warning: Building for device with code signing disabled. You will have to manually codesign before deploying to device.
    Building net.butterflyapp.trainer for device (ios-release)...
    Running pod install...                                              3.7s
    Running Xcode build...
    Xcode build done.                                           203.6s


**Flutter**: `1.7.8+hotfix.3`, `1.7.8+hotfix.4`, `1.9.1+hotfix.2`, `1.9.1+hotfix.4`, `1.9.1+hotfix.5`

###### Solution
This is a known issue that occurs randomly and can be traced back to Flutter:

* https://github.com/flutter/flutter/issues/28415
* https://github.com/flutter/flutter/issues/35988

This issue is known to be fixed on the `master` channel.



### Mac M1 issues

###### Builds not starting

Builds not starting at all even though the team has access to `mac_mini_m1` instance.

**Solution**:
This error occurs on M1 machines when the `xcode` property is not set to version 13.x. Please configure your workflow to use Xcode version 13 or above.


###### Builds failing intermittently

Builds are intermittently failing without a clear reason.

**Solution**:
This issue can be caused by an earlier version of Xcode. Please use version `13.4.1` or newer, if possible.


###### Error when using an adhoc profile

When building iOS apps with an adhoc profile you might get this error: 
```
error: Provisioning profile "XXXX" doesn't include the currently selected
device "builder's Virtual Machine" (identifier XXXXXXXX-XXXXXXXXXXXXXXXX).
(in target 'XXXXXXX' from project 'App').
```

**Solution**:
Add the following to the end of your `xcode-project build-ipa` command:
{{< highlight yaml "style=paraiso-dark">}}
  --archive-flags="-destination 'generic/platform=iOS'"
{{< /highlight >}}



### XCode 14 known issues


###### Error (Xcode): Signing for "XXX" requires a development team. Select a development team in the Signing & Capabilities editor


**Solution**:

This issue has been fixed on the stable channel in **Flutter 3.3.3**.

However, if you would like to continue previous versions of Flutter you can open `ios/Podfile` and add the following at the end of it:

{{< highlight yaml "style=paraiso-dark">}}
post_install do |installer|
 installer.pods_project.targets.each do |target|
   flutter_additional_macos_build_settings(target)

   target_is_resource_bundle = target.respond_to?(:product_type) && target.product_type == 'com.apple.product-type.bundle'
   target.build_configurations.each do |build_configuration|
     if target_is_resource_bundle
       build_configuration.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
       build_configuration.build_settings['CODE_SIGNING_REQUIRED'] = 'NO'
       build_configuration.build_settings['CODE_SIGNING_IDENTITY'] = '-'
       build_configuration.build_settings['EXPANDED_CODE_SIGN_IDENTITY'] = '-'
     end
   end
  end
end
{{< /highlight >}}

In XCode 13 `CODE_SIGNING_ALLOWED` was set to `NO` by default for resource bundles. While in Xcode 14 they changed this to default to `YES`, which might be causing the problems.

### A required agreement is missing or has expired

###### Description
Builds are failing with the following message:

    A required agreement is missing or has expired. - This request requires an in-effect agreement that has not been signed or has expired.

###### Cause
Apple has updated Apple Developer Program License Agreement and it needs to be reviewed

###### Solution
In order to update your existing apps and submit new apps to the App Store, the Account Holder must review and accept the updated agreement by signing in to their [account](https://appstoreconnect.apple.com/agreements/#/) on the Apple Developer website.

### Certificate will no longer be valid in 30 days

###### Description
You received e-mail from Apple stating that:

    Your Distribution Certificate will no longer be valid in 30 days. To generate a new certificate, sign in and visit Certificates, Identifiers & Profiles.

###### Cause
Distribution certificates issued by Apple have a validity period of one year from the date of issuance. After one year, they expire, which means they can no longer be used to sign and distribute apps.

###### Solution
Rest assured, Codemagic simplifies the certificate management process for you. Here's how it works:
 - By providing your **App Store Connect API key ID**, **issuer ID**, and API key as a **.p8 file** (more info about how to add environment variables can be found [here](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/)), Codemagic takes care of your certificate and provisioning profile management, including the automatic renewal of certificates, except in the case where you are using a private RSA key associated with an iOS Distribution certificate previously generated within your Apple Developer Program account. You can find additional information on how to update an RSA key (CERTIFICATE_PRIVATE_KEY) for a certificate [here](https://docs.codemagic.io/yaml-code-signing/alternative-code-signing-methods/#:~:text=Obtaining%20the%20Certificate%20private%20key).

 - If you're using `manual code signing` or `Codemagic signing identities (CSI)`, you will need to create and upload your certificates and profiles that you generated on the Apple Developer UI manually to Codemagic.
 Alernativley, with CSI, users can also fetch or create resources directly from Codemagic UI instead of navigating the Apple Developer UI when going in **Teams** > **Codesignng identities** > **iOS certificate** tab > **Generate certificate** button and in there provide your API key.


### Did not find xcodeproj from /Users/builder/clone/ios

###### Description
Builds are failing with the following message:

    Did not find xcodeproj from /Users/builder/clone/ios

###### Cause
Codemagic is not able to locate the Xcode project file (xcodeproj) in the expected directory. This could be due to the project structure being different from the script's assumptions, most likely because the project is a mono repo.

###### Solution
The solution is to update the path to your project. In order to target apps inside your monorepo app, **working_directory** key is used. For example, the following sample snippet shows how it works:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  default-workflow:
    name: Default workflow
    instance_type: mac_mini_m1
    max_build_duration: 120
    # Specify path to the app folder like this
    working_directory: ios/path-to-your-project
{{< /highlight >}}

If you are using the Workflow Editor, specify the project path inside the Build step by selecting your project from the Project path dropdown.
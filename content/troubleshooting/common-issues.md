---
description: Find out how to overcome frequent issues with building your Flutter app on Codemagic. 
title: Common issues
weight: 1
---

## Two-factor authentication for Apple Developer Portal integration fails

Recently, Apple changed their private API which affects the way third-party systems offer two-factor authentication for Apple Developer Portal. This may result in two-factor authentication failing for the Apple Developer Portal integration in Codemagic despite entering a correct authentication code.

        Apple Developer Portal authentication failed
        Two factor authentication failed for user@domain.com: Incorrect Verification Code: Incorrect verification code

If you see the error message above and are convinced you have entered the correct authentication code, you can try the following workarounds:

 * Change your Apple Developer Portal password
 * Log out from all the devices except the one you want to use for receiving the authentication code

If the suggestions above do not work for you, you can export your current UI configuration and switch to building using `codemagic.yaml`, see more information in [Configuration as code (YAML)](../building/yaml).

## iOS code signing troubleshooting

This is the list of the most common issues that may cause iOS code signing errors during a CI build.

* **The uploaded certificate is in a wrong format or corrupt.** Codemagic looks for a certificate in Personal Information Exchange (`.p12`) format. See [how to export the certificate](../code-signing/ios-code-signing/#exporting-signing-certificate-and-provisioning-profile).

* **The uploaded certificate and provisioning profile do not match.** For example, you're using a development certificate and a distribution profile to sign the build, or the certificate used for signing is not included in the provisioning profile.

* **You don't have the required entitlements enabled for your app in Apple Developer portal.** In such cases, you will often see an error message similar to this one:

    > Code Signing Error: "Runner" requires a provisioning profile with the Push Notifications feature. Select a provisioning profile in the Signing & Capabilities editor.

    Check your app's entitlements by going to **Apple Developer portal > Certificates, identifier & profiles > Identifiers > App ID**.


* **You haven't specified the iOS scheme to be used for the `archive` action of Xcode build.**  This applies when your app has custom iOS schemes. By default, Codemagic builds the `Runner` scheme, but you can use the `FCI_FLUTTER_SCHEME` [environment variable](../building/environment-variables) to specify another scheme.

* **The bundle ID you have entered in automatic code signing setup on Codemagic does not match the bundle ID in the build configuration that is used for archiving the app with Xcode.** Codemagic assigns provisioning profiles to the build targets and configurations before building the iOS app. That assignment is based on the bundle ID match in both provisioning profile and the build configuration. In the case signing configuration is not assigned to the build target/configuration that is used for archiving, the build will fail.

## Version inconsistency between local and Codemagic

**Description**:
Builds succeed locally but not on Codemagic and throw vague errors, such as `Gradle task bundleRelease failed with exit code 1`, or build is successful but some functions aren't working. 

**Cause**: These issues are likely caused because plugin and gradle versions used locally are different from the versions used on Codemagic. If you are using a gradle version that is different from Codemagic, you have to define it in `gradle wrapper`. Otherwise, Codemagic ignores your `build.gradle` file and your build won't work properly. See which [software versions Codemagic uses](../releases-and-versions/versions/).

**Solution**: First, you need to make sure that the `gradlew` file isn't in `.gitignore`. Look for `**/android/gradlew`, and if it's in `.gitignore`, delete it from there. Then add `!gradle-wrapper.jar` to a new line in `.gitignore` to create an exception so that `gradle-wrapper.jar` would also be excluded from `.gitignore`.

Run `./gradlew wrapper --gradle-version [your gradle version]` locally to create `gradlew` and `gradle-wrapper.properties` files in your repository. Commit the changes and rerun your Codemagic build. 

**Additional steps**: Additional steps are required if you see the following error during the build process:

`Error! Failed to check gradle version. Malformed executable tmpABCDEF/gradlew`

Codemagic runs `./gradlew --version` on the builder side to check if it's suitable for execution. If you see the error message shown above, there is something wrong with checking the gradle version.

**To investigate and fix the issues**:

* Make a clean clone of the repository and execute the following commands:

        cd <project_root>
        chmod +x gradlew
        ./gradlew --version

* Make a fix for the issue found.
* Commit changes to the repo.
* Run the build again in Codemagic.

## iOS build hangs at `Xcode build done`

**Description**:
When building for iOS, the build gets stuck after showing `Xcode build done` in the log but does not finish and eventually times out.

**Log output**: 

    == Building for iOS ==

    == /usr/local/bin/flutter build ios --release --no-codesign ==
    Warning: Building for device with codesigning disabled. You will have to manually codesign before deploying to device.
    Building net.butterflyapp.trainer for device (ios-release)...
    Running pod install...                                              3.7s
    Running Xcode build...                                          
    Xcode build done.                                           203.6s

**Flutter**: `1.7.8+hotfix.3`, `1.7.8+hotfix.4`, `1.9.1+hotfix.2`, `1.9.1+hotfix.4`, `1.9.1+hotfix.5`

**Xcode**: N/A

**Solution**: This is a known issue that occurs randomly and can be traced back to Flutter:

* https://github.com/flutter/flutter/issues/28415
* https://github.com/flutter/flutter/issues/35988

This issue is known to be fixed on the `master` channel.

## iOS build error with `Provisioning profile`

**Description**:

This issue takes place when trying to use an outdated  Provisioning profile that do not include 
Associated Domains. 

**Log output**: 

❌ error: Provisioning profile "CodeMagic" doesn't support the Associated Domains capability. (in target 'Runner' from project 'Runner') 
❌ error: Provisioning profile "CodeMagic" doesn't include the com.apple.developer.associated-domains entitlement. (in target 'Runner' from project 'Runner')

**Solution**: 

 Log in to Apple Developer Account and verify :
  - That you have the correct bundle Id.  
  - If missing add the Associated Domain Entitlement from there.
  - Update Provisioning profile and use it in to configure your project.

 

---
description: How to overcome common issues building mobile apps on Codemagic 
title: Common issues
weight: 4
---

## iOS errors regarding creating authentication sessions

When App Store Connect is not correctly set up, users might encounter an error message similar to the following:

```
altool[xxx:xxx] *** Error: Unable to validate archive '/Users/builder/ipas/xxx'.
altool[xxx:xxx] *** Error: code -22020 (Unable to validate your application. We are unable to create an authentication session.)
```

The most common reason for the occurrence of this error message is using Apple ID password instead of [app-specific password](https://support.apple.com/en-us/HT204397) in App Store Connect publishing settings. 

To generate an app-specific password, sign in to your [Apple ID account page](https://appleid.apple.com/account/manage), navigate to the **Security** section and click **Generate Password...** below **App-Specific Passwords**. The generated app-specific password will be in this format: `abcd-efgh-ijkl-mnop`. Insert this value into the Flutter workflow editor or as a password in `codemagic.yaml` when setting up publishing to App Store Connect. Note that the password should be generated with the same Apple account that you are using for publishing.

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

```bash
cd <project_root>
chmod +x gradlew
./gradlew --version
```

* Make a fix for the issue found.
* Commit changes to the repo.
* Run the build again in Codemagic.

## iOS build hangs at `Xcode build done`

**Description**:
When building for iOS, the build gets stuck after showing `Xcode build done` in the log but does not finish and eventually times out.

**Log output**: 

```
== Building for iOS ==

== /usr/local/bin/flutter build ios --release --no-codesign ==
Warning: Building for device with code signing disabled. You will have to manually codesign before deploying to device.
Building net.butterflyapp.trainer for device (ios-release)...
Running pod install...                                              3.7s
Running Xcode build...
Xcode build done.                                           203.6s
```

**Flutter**: `1.7.8+hotfix.3`, `1.7.8+hotfix.4`, `1.9.1+hotfix.2`, `1.9.1+hotfix.4`, `1.9.1+hotfix.5`

**Xcode**: N/A

**Solution**: This is a known issue that occurs randomly and can be traced back to Flutter:

* https://github.com/flutter/flutter/issues/28415
* https://github.com/flutter/flutter/issues/35988

This issue is known to be fixed on the `master` channel.

## iOS build errors with `Provisioning profile`
This is the list of the most common issues that may cause iOS provisioning profile errors during a CI build.

### You are using an outdated Provisioning profile that does not include Associated Domains.
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

### The bundle identifiers are not properly set for your project. 
In such cases, you will often see an error message similar to this one:
```
❌ error: Runner has conflicting provisioning settings. Runner is automatically signed, but code signing identity Apple Push Services has been manually specified. Set the code signing identity value to “iPhone Developer” in the build settings editor, or switch to manual signing in the Signing & Capabilities editor. (in target ‘Runner’ from project ‘Runner’)
```

**Solution**:
* Confirm that you have set the correct bundle identifiers for all targets in Xcode.
* Verify that the bundle identifier set in Xcode matches the bundle identifier set in the Flutter workflow editor under code signing.

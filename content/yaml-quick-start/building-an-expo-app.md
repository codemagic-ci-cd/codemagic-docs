---
title: Expo apps
description: How to build a managed Expo app with codemagic.yaml
weight: 6
aliases:
  - /yaml-quick-start/building-an-expo-app
---


Expo is a framework built on top of React Native that lets teams build iOS and Android apps from a single JavaScript codebase. What makes a managed Expo project different from a bare React Native project is that the native `ios/` and `android/` directories are not stored in version control. Instead, they are generated on demand from `app.json` (or `app.config.js`) by running `npx expo prebuild`. Expo calls this workflow **Continuous Native Generation (CNG)**.

On CI, this means every build starts by generating fresh native projects from your configuration, then building them the same way any native iOS or Android project is built. The result is a reproducible, upgrade-friendly workflow where the Expo SDK version, config plugins, and `app.json` together define exactly what gets built.

{{<notebox>}}
**Note:** This guide covers managed Expo projects using CNG (the default for all projects created with `create-expo-app`). If you have already run `expo eject` or manually committed your `ios/` and `android/` directories and made custom native modifications, your project is a **bare React Native** project. Continue with the [React Native apps](https://docs.codemagic.io/yaml-quick-start/building-a-react-native-app/) guide instead.
{{</notebox>}}

{{< spacer >}}

## Prerequisites

- Expo project using SDK 52 or later
- Node.js 20 or later
- Apple Developer Program membership:  Required for iOS builds and App Store publishing 
- Google Play Developer account: Required for Android publishing

{{<notebox>}}
**Note:** This guide targets Expo SDK 52 and later, where the New Architecture is the default. SDK 55 (current stable as of early 2026) removes the Legacy Architecture entirely. If your project is on SDK 51 or earlier, upgrade before following this guide. The YAML patterns here will not apply cleanly to older SDKs.
{{</notebox>}}

{{< spacer >}}

## How managed Expo projects work on CI

Understanding a few concepts upfront will make the rest of this guide much easier to follow. Managed Expo projects have a different relationship with native code than bare React Native projects do — the build pipeline depends on tools and conventions that don't exist in a plain React Native setup, and skipping this context tends to make the YAML harder to reason about.

### Continuous Native Generation (CNG)

When you create a new Expo project with `create-expo-app`, the `ios/` and `android/` directories are added to `.gitignore` automatically. They are treated as generated artifacts — like `node_modules/` — not as source files. Running `npx expo prebuild --clean` regenerates them from scratch using your installed Expo SDK version and any config plugins declared in `app.json`.

On Codemagic, this means every build runs `npx expo prebuild --clean` as its first step before invoking Gradle or Xcode. This keeps your builds reproducible and makes Expo SDK upgrades straightforward: update the version in `package.json`, and prebuild generates the correct native projects automatically.

### The alternative: committing native directories

Some teams choose to commit `ios/` and `android/` to version control. This makes sense when you have native modifications that cannot be expressed as config plugins, or when you want complete transparency over what gets built. If you are in this situation, run `npx expo prebuild --clean` once locally, review and commit the output, then remove the prebuild step from your CI workflow and treat the project exactly as a bare React Native project. The [React Native apps](https://docs.codemagic.io/yaml-quick-start/building-a-react-native-app/) guide covers that path.

The CNG approach used in this guide is Expo's official recommendation for managed projects and is what `create-expo-app` sets up by default.

{{<notebox>}}
**Note:** Earlier Codemagic documentation for Expo described a `support-files/build.gradle` workaround that involved manually copying a generated `build.gradle` into the repo. That pattern is no longer necessary with a clean CNG approach (`npx expo prebuild --clean`) and should not be used in new projects.
{{</notebox>}}

### app.json and app.config.js

Your `app.json` file is the source of truth for your app's identity on CI: the bundle identifier, package name, version, permissions, and config plugin declarations all live here. When `expo prebuild` runs, it reads this file and writes the correct values into the generated native projects.

For configuration that varies by environment (for example, different bundle IDs for a staging build), use a dynamic `app.config.js` instead of a static `app.json`. This is a JavaScript file that exports the same config shape but can read from `process.env` at prebuild time:

{{< highlight javascript "style=paraiso-dark">}}
// app.config.js
export default ({ config }) => ({
  ...config,
  ios: {
    bundleIdentifier: process.env.BUNDLE_ID ?? 'com.example.yourapp',
  },
  android: {
    package: process.env.PACKAGE_NAME ?? 'com.example.yourapp',
  },
});
{{< /highlight >}}

Environment variables set in your Codemagic workflow are available to `app.config.js` during the prebuild step.

### EXPO_PUBLIC_ variables

Variables prefixed with `EXPO_PUBLIC_` are inlined into the JavaScript bundle at build time by Metro. Set them in Codemagic as environment variables (plain, not secret) and they will be available in your app code as `process.env.EXPO_PUBLIC_MY_VARIABLE`. Do not use this prefix for secrets — the values end up in the distributed binary.

{{< spacer >}}

## Adding the app to Codemagic

{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}

## Creating codemagic.yaml

{{< include "/partials/quickstart/create-yaml-intro.md" >}}

{{< spacer >}}

## Code signing

All apps distributed through the App Store or Google Play must be code-signed.

{{< tabpane >}}

{{< tab header="Android" >}}
{{< include "/partials/quickstart/code-signing-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/quickstart/code-signing-ios.md" >}}
{{< /tab >}}

{{< /tabpane >}}

{{< spacer >}}

## Setting up app identifiers

Your app's bundle identifier (iOS) and package name (Android) must match the values in your `app.json` (or `app.config.js`). Set them as environment variables in `codemagic.yaml` and reference them in your app config.

{{< tabpane >}}
{{< tab header="Android" >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  expo-android:
    # ...
    environment:
      vars:
        PACKAGE_NAME: "com.example.yourapp"
{{< /highlight >}}

{{< /tab >}}
{{< tab header="iOS" >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  expo-ios:
    # ...
    environment:
      vars:
        BUNDLE_ID: "com.example.yourapp"
{{< /highlight >}}

{{< /tab >}}
{{< /tabpane >}}

A minimal `app.json` referencing these identifiers:

{{< highlight json "style=paraiso-dark">}}
{
  "expo": {
    "name": "YourApp",
    "slug": "your-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.example.yourapp",
      "supportsTablet": true
    },
    "android": {
      "package": "com.example.yourapp",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
{{< /highlight >}}

If you are using `app.config.js` to read identifiers from environment variables (as shown in the [app.config.js section above](#appjson-and-appconfigjs)), the variables you set in `codemagic.yaml` will be picked up automatically during the prebuild step.

{{< spacer >}}

## Build scripts

The following sections show the scripts block for each platform. The key difference from a plain React Native build is the `npx expo prebuild --clean` step that runs before Gradle or Xcode.

{{< tabpane >}}
{{< tab header="Android" >}}

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  # --- SETUP ---
  - name: Install npm dependencies
    script: | 
      npm ci

  # --- GENERATE NATIVE PROJECTS ---
  # This step generates the android/ directory from app.json and config plugins.
  # --clean ensures a fresh generation every build, preventing stale native state.
  - name: Run Expo Prebuild
    script: | 
      npx expo prebuild --clean --platform android

  # Expo prebuild creates android/local.properties in some versions, but
  # setting it explicitly here guarantees the SDK path is always correct.
  - name: Set Android SDK location
    script: | 
      echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"

  # --- BUILD ---
  - name: Build Android release bundle
    script: | 
      LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number \
        --package-name "$PACKAGE_NAME")
      if [ -z "$LATEST_GOOGLE_PLAY_BUILD_NUMBER" ]; then
        # Fallback when the app has no published builds yet (e.g. first upload).
        # BUILD_NUMBER is a Codemagic built-in that increments with each build.
        UPDATED_BUILD_NUMBER=$BUILD_NUMBER
      else
        UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
      fi
      cd android
      ./gradlew bundleRelease \
        -PversionCode=$UPDATED_BUILD_NUMBER \
        -PversionName=1.0.$UPDATED_BUILD_NUMBER

artifacts:
  - android/app/build/outputs/**/*.aab
{{< /highlight >}}

{{< /tab >}}
{{< tab header="iOS" >}}

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  # --- SETUP ---
  - name: Install npm dependencies
    script: | 
      npm ci

  # --- GENERATE NATIVE PROJECTS ---
  # This step generates the ios/ directory from app.json and config plugins.
  # --clean ensures a fresh generation every build, preventing stale native state.
  - name: Run Expo Prebuild
    script: | 
      npx expo prebuild --clean --platform ios

  # Expo prebuild generates the Podfile, so CocoaPods must run after prebuild.
  - name: Install CocoaPods dependencies
    script: | 
      cd ios && pod install

  # --- CODE SIGNING ---
  # Sets encryption export compliance flag to avoid a manual prompt from
  # App Store Connect during upload. Set to false unless your app uses
  # non-exempt encryption (e.g. custom crypto beyond standard HTTPS/TLS).
  - name: Set Info.plist values
    script: | 
      PLIST=$CM_BUILD_DIR/ios/$XCODE_SCHEME/Info.plist
      PLIST_BUDDY=/usr/libexec/PlistBuddy
      $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST

  # Configures the Xcode project to use the provisioning profile that
  # Codemagic fetched from App Store Connect in the ios_signing block above.
  - name: Set up code signing settings on Xcode project
    script: | 
      xcode-project use-profiles

  # --- BUILD VERSIONING ---
  # Fetches the latest build number from App Store Connect and increments it.
  # APP_STORE_APPLE_ID is found under App Store Connect > App Information > Apple ID.
  - name: Increment build number
    script: | 
      cd $CM_BUILD_DIR/ios
      LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number \
        "$APP_STORE_APPLE_ID")
      agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))

  # --- BUILD ---
  - name: Build ipa for distribution
    script: | 
      xcode-project build-ipa \
        --workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" \
        --scheme "$XCODE_SCHEME"

artifacts:
  - build/ios/ipa/*.ipa
  - /tmp/xcodebuild_logs/*.log
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}

{{< /tab >}}
{{< /tabpane >}}

{{< spacer >}}

## Publishing

{{< include "/partials/publishing-android-ios.md" >}}

{{< spacer >}}

## OTA updates with Codemagic CodePush

Managed Expo projects commonly use `expo-updates` for over-the-air JavaScript bundle updates. Codemagic offers a hosted CodePush service as an alternative, with full support for React Native New Architecture apps and a CI-friendly CLI for releasing updates from your Codemagic workflows.

If you are currently using Expo OTA updates and want to migrate to Codemagic CodePush, see the [Migrating from Expo OTA to CodePush](https://docs.codemagic.io/rn-codepush/migrating-from-expo-ota/) guide.

For setting up CodePush from scratch in a new or existing React Native project, see the [CodePush setup guide](https://docs.codemagic.io/rn-codepush/setup/).

{{< spacer >}}

## Complete codemagic.yaml example

The following file defines two independent workflows: one for Android (Google Play) and one for iOS (App Store). Each workflow is triggered by pushes to `main`. Adjust the variable values, trigger configuration, and publishing targets to match your project.

{{< highlight yaml "style=paraiso-dark">}}
workflows:

  # ============================================================
  # ANDROID WORKFLOW
  # Builds a signed AAB and publishes it to Google Play internal
  # testing track on every push to main.
  # ============================================================
  expo-android:
    name: Expo Android
    max_build_duration: 120
    instance_type: mac_mini_m2

    environment:
      # --- SIGNING ---
      # keystore_reference is the name you gave the keystore when uploading it
      # under Team settings > codemagic.yaml settings > Code signing identities.
      android_signing:
        - keystore_reference

      groups:
        # google_play group should contain GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS.
        # See: https://docs.codemagic.io/yaml-publishing/google-play/
        - google_play

      vars:
        PACKAGE_NAME: "com.example.yourapp" # Your Android package name

      node: v22.11.0

    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
          include: true

    scripts:
      # --- SETUP ---
      - name: Install npm dependencies
        script: | 
          npm ci

      # --- GENERATE NATIVE PROJECTS ---
      - name: Run Expo Prebuild
        script: | 
          npx expo prebuild --clean --platform android

      - name: Set Android SDK location
        script: | 
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"

      # --- BUILD ---
      # Fetches the latest version code from Google Play and increments it.
      # On the very first upload, falls back to the Codemagic build counter.
      - name: Build Android release bundle
        script: | 
          LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number \
            --package-name "$PACKAGE_NAME")
          if [ -z "$LATEST_GOOGLE_PLAY_BUILD_NUMBER" ]; then
            UPDATED_BUILD_NUMBER=$BUILD_NUMBER
          else
            UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
          fi
          cd android
          ./gradlew bundleRelease \
            -PversionCode=$UPDATED_BUILD_NUMBER \
            -PversionName=1.0.$UPDATED_BUILD_NUMBER

    artifacts:
      - android/app/build/outputs/**/*.aab

    publishing:
      email:
        recipients:
          - YOUR_EMAIL@example.com
        notify:
          success: true
          failure: true
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true


  # ============================================================
  # iOS WORKFLOW
  # Builds a signed IPA and publishes it to TestFlight on every
  # push to main.
  # ============================================================
  expo-ios:
    name: Expo iOS
    max_build_duration: 120
    instance_type: mac_mini_m2

    # The App Store Connect integration key is configured under
    # Team integrations > Developer Portal > Manage keys.
    # Replace 'codemagic' with the name you used when saving the key.
    integrations:
      app_store_connect: codemagic

    environment:
      # --- SIGNING ---
      # Codemagic fetches the correct certificate and provisioning profile
      # from App Store Connect automatically using the integration key above.
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.yourapp # Must match app.json

      vars:
        BUNDLE_ID: "com.example.yourapp"           # Your iOS bundle identifier
        XCODE_WORKSPACE: "YourApp.xcworkspace"     # Generated by expo prebuild
        XCODE_SCHEME: "YourApp"                    # Usually matches your app name
        APP_STORE_APPLE_ID: 1234567890             # Found in App Store Connect > App Information

      node: v22.11.0
      xcode: latest
      cocoapods: default

    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
          include: true

    scripts:
      # --- SETUP ---
      - name: Install npm dependencies
        script: | 
          npm ci

      # --- GENERATE NATIVE PROJECTS ---
      # Generates ios/ from app.json and config plugins.
      # The Podfile is produced here, so pod install must run after this step.
      - name: Run Expo Prebuild
        script: | 
          npx expo prebuild --clean --platform ios

      - name: Install CocoaPods dependencies
        script: | 
          cd ios && pod install

      # --- CODE SIGNING ---
      - name: Set Info.plist values
        script: | 
          PLIST=$CM_BUILD_DIR/ios/$XCODE_SCHEME/Info.plist
          PLIST_BUDDY=/usr/libexec/PlistBuddy
          $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST

      - name: Set up code signing settings on Xcode project
        script: | 
          xcode-project use-profiles

      # --- BUILD VERSIONING ---
      - name: Increment build number
        script: | 
          cd $CM_BUILD_DIR/ios
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number \
            "$APP_STORE_APPLE_ID")
          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))

      # --- BUILD ---
      - name: Build ipa for distribution
        script: | 
          xcode-project build-ipa \
            --workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"

    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM

    publishing:
      email:
        recipients:
          - YOUR_EMAIL@example.com
        notify:
          success: true
          failure: true
      app_store_connect:
        auth: integration
        # Submit to TestFlight immediately after upload.
        # Set submit_to_app_store: true to request full App Store review.
        submit_to_testflight: true
        submit_to_app_store: false
{{< /highlight >}}

{{< spacer >}}

## Troubleshooting

**`expo prebuild --clean` fails with "package not found" or module resolution errors**

Run `npm ci` before `expo prebuild`. The prebuild command reads installed packages to determine which config plugins to apply; if `node_modules/` is missing or incomplete, it cannot resolve them.

**CocoaPods install fails after prebuild**

This almost always means the Podfile was generated for a different version of CocoaPods than what is installed on the machine. Add `cocoapods: default` to the `environment:` block to ensure Codemagic installs the version specified in your `Gemfile.lock`, or pin a specific version with `cocoapods: 1.15.2`.

**`xcode-project use-profiles` exits with "no matching provisioning profile"**

Verify that the bundle identifier in `ios_signing.bundle_identifier` in `codemagic.yaml` exactly matches the value in `app.json` (or what `app.config.js` resolves to). They must be identical — prebuild writes the identifier from `app.json` into the generated Xcode project, and Codemagic looks for a profile that matches the identifier in `codemagic.yaml`.

**`Info.plist` not found during the signing step**

Expo prebuild names the generated scheme after the `name` field in `app.json`, not the `slug`. If your `XCODE_SCHEME` variable does not match the actual scheme name, the path to `Info.plist` will be wrong. Open `ios/YourApp.xcworkspace` locally after prebuild to confirm the scheme name, or list schemes with `xcodebuild -list -workspace ios/*.xcworkspace`.

**Build number increment fails on first upload**

`app-store-connect get-latest-app-store-build-number` returns an error when no build has been uploaded yet. Start the build number at `1` explicitly for the first upload by adding a fallback:

{{< highlight yaml "style=paraiso-dark">}}
- name: Increment build number
  script: | 
    cd $CM_BUILD_DIR/ios
    LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number \
      "$APP_STORE_APPLE_ID" 2>/dev/null || echo "0")
    agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
{{< /highlight >}}

**Native module not found at runtime after prebuild**

If a package provides a native module via a config plugin, it must be listed in the `plugins` array in `app.json` for prebuild to wire it up. Check the package's documentation to confirm whether it requires a config plugin entry and what arguments it accepts.

{{< spacer >}}

## Further reading

- [React Native apps](../yaml-quick-start/building-a-react-native-app/) — bare React Native and bare Expo projects with committed native directories
- [Automatic build versioning](../knowledge-codemagic/build-versioning/) — additional versioning strategies
- [iOS code signing](../yaml-code-signing/signing-ios/) — detailed guide to certificates and provisioning profiles
- [Android code signing](../yaml-code-signing/signing-android/) — keystores, upload keys, and signing configurations
- [App Store Connect publishing](../yaml-publishing/app-store-connect/) — TestFlight, phased releases, and submission options
- [Google Play publishing](../yaml-publishing/google-play/) — tracks, rollouts, and service account setup
- [Codemagic CodePush](../rn-codepush/setup/) — OTA JavaScript bundle updates for React Native apps
- [Migrating from Expo OTA to CodePush](../rn-codepush/migrating-from-expo-ota/) — step-by-step migration guide
- [Expo documentation: Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/) — official Expo reference for CNG and prebuild
- [Expo documentation: app.json / app.config.js](https://docs.expo.dev/workflow/configuration/) — full app config reference

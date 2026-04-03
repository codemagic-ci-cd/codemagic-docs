---
title: First Release Pipeline
description: Build, sign, and distribute a mobile app with Codemagic—internal testing through App Store and Play store release
weight: 0
aliases:
  - /yaml-quick-start/first-signed-build
  - /yaml-quick-start/unified-quick-start
---

Codemagic is a cloud-based CI/CD service for building, signing, and distributing mobile apps. This quick start uses **tabs** for **Flutter**, **React Native**, **native iOS**, or **native Android**. Follow the same five steps:

1. **[Unsigned build](#step-1-a-basic-unsigned-build)** — Confirm the project compiles in CI without signing.
2. **[Signing credentials](#step-2-preparing-for-signing)** — Add Apple and Google Play signing inputs in Codemagic.
3. **[Signed build](#step-3-sign-your-build)** — Produce signed **`.ipa`**, **`.aab`**, or **`.apk`** files.
4. **[Internal distribution](#step-4-distribute-to-internal-testers)** — Optional: TestFlight and Play **internal** testing.
5. **[Store release](#step-5-publish-to-the-stores)** — Optional: separate workflows for App Store and Play **production**.

Unsigned builds need no Xcode or Gradle changes. [Steps 4–5](#step-4-distribute-to-internal-testers) are optional. For tests, caching, and triggers after this flow, see [Next steps](#next-steps).

## Connect your repo or use a sample repository

Authorize your Git host and pick a repository, or try a sample:

- **Flutter** — [flutter-android-and-ios-yaml-demo-project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/flutter/flutter-android-and-ios-yaml-demo-project)
- **React Native** — [react-native-demo-project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/react-native/react-native-demo-project)
- **Native iOS** — [ios-native-quick-start](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/ios/ios-native-quick-start)
- **Native Android** — [android-native-quick-start](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/android/android-native-quick-start)

More: [Codemagic sample projects](codemagic-sample-projects).

## Step 1: A basic unsigned build

Put **`codemagic.yaml`** at the **repository root**, commit it, open **your stack’s tab** below, and replace placeholders (workspace, scheme, package name, and so on).

Workflows live under **`workflows:`** with **`environment`**, **`scripts`**, and **`artifacts`**; add **`publishing:`** in Steps 4–5 when you distribute builds.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  my-workflow:
    name: My workflow name
    instance_type: mac_mini_m2
    max_build_duration: 60

    environment:   # variables, groups, tool versions, signing references
    triggering:    # branches, PRs, tags, webhooks
    scripts:       # build and test steps
    artifacts:     # files to keep from the build
    publishing:    # distribution and notifications
    cache:         # dependency caches

{{< /highlight >}}

These iOS examples use **`xcode: latest`**, and [the corresponding environment](../specs-macos/xcode-26-2) . Pin a specific **major.minor** version only if your project requires it.

{{< tabpane >}}

{{< tab header="Flutter" >}}
{{< markdown >}}
Debug **iOS** without signing (`--no-codesign`) and **Android** debug APK.
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  flutter-ios-unsigned:
    name: Flutter iOS (unsigned debug)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      flutter: stable
      xcode: latest
      cocoapods: default
    scripts:
      - name: Get Flutter packages
        script: flutter pub get
      - name: Install CocoaPods dependencies
        script: find . -name "Podfile" -execdir pod install \;
      - name: Build iOS debug without code signing
        script: flutter build ios --debug --no-codesign
    artifacts:
      - build/ios/iphoneos/**/*.app
      - /tmp/xcodebuild_logs/*.log

  flutter-android-debug:
    name: Flutter Android (debug APK)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      flutter: stable
    scripts:
      - name: Set up local.properties
        script: echo "flutter.sdk=$HOME/programs/flutter" > "$CM_BUILD_DIR/android/local.properties"
      - name: Get Flutter packages
        script: flutter pub get
      - name: Build Android debug APK
        script: flutter build apk --debug
    artifacts:
      - build/app/outputs/flutter-apk/*.apk
{{< /highlight >}}

{{< /tab >}}

{{< tab header="React Native" >}}
{{< markdown >}}
**Android** `assembleDebug` and **unsigned iOS** via `xcodebuild` with `CODE_SIGNING_ALLOWED=NO`. Adjust `XCODE_WORKSPACE`, `XCODE_SCHEME`, and Node version as needed. **Expo without committed `ios`/`android`:** see [Using Expo without prebuild](building-a-react-native-app#using-expo-without-prebuild).
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  rn-android-debug:
    name: React Native Android (debug)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      node: v22.11.0
    scripts:
      - name: Install npm dependencies
        script: npm ci
      - name: Set Android SDK location
        script: echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      - name: Build Android debug
        script: cd android && ./gradlew assembleDebug
    artifacts:
      - android/app/build/outputs/**/*.apk

  rn-ios-unsigned:
    name: React Native iOS (unsigned debug)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      node: v22.11.0
      xcode: latest
      cocoapods: default
      vars:
        XCODE_WORKSPACE: "YourApp.xcworkspace"
        XCODE_SCHEME: "YourApp"
    scripts:
      - name: Install npm dependencies
        script: npm ci
      - name: Install CocoaPods dependencies
        script: cd ios && pod install
      - name: Build iOS without code signing
        script: xcodebuild -workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" -scheme "$XCODE_SCHEME" -configuration Debug -destination 'generic/platform=iOS' CODE_SIGNING_ALLOWED=NO build
    artifacts:
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - /tmp/xcodebuild_logs/*.log
{{< /highlight >}}

{{< collapsible title="Using Expo without prebuild" >}}

On CI you need `ios` and `android` folders. If you do not commit them, run **`npx expo prebuild`** during the build (and align `applicationId` / bundle identifier with `app.json`). Full steps and YAML snippets are in [Using Expo without prebuild](building-a-react-native-app#using-expo-without-prebuild) and [Setting up the Android package name and iOS bundle identifier](building-a-react-native-app#setting-up-the-android-package-name-and-ios-bundle-identifier).

{{< /collapsible >}}

{{< /tab >}}

{{< tab header="iOS (native)" >}}
{{< markdown >}}
Assumes the **workspace** at the repo root; see [iOS native apps](building-a-native-ios-app) if yours lives under `ios/` only. For **`.xcodeproj`** only, use `-project` instead of `-workspace`.
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-native-unsigned:
    name: Native iOS (unsigned debug)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      xcode: latest
      cocoapods: default
      vars:
        XCODE_WORKSPACE: "YourApp.xcworkspace"
        XCODE_SCHEME: "YourApp"
    scripts:
      - name: Install CocoaPods dependencies
        script: pod install
      - name: Build iOS without code signing
        script: |
          xcodebuild \
            -workspace "$CM_BUILD_DIR/$XCODE_WORKSPACE" \
            -scheme "$XCODE_SCHEME" \
            -configuration Debug \
            -destination 'generic/platform=iOS' \
            CODE_SIGNING_ALLOWED=NO \
            build
    artifacts:
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - /tmp/xcodebuild_logs/*.log
{{< /highlight >}}

{{< /tab >}}

{{< tab header="Android (native)" >}}
{{< markdown >}}
Assumes Gradle at the **repository root**; see [Android native apps](building-a-native-android-app) for subfolder layouts.
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-native-debug:
    name: Native Android (debug)
    max_build_duration: 120
    instance_type: mac_mini_m2
    scripts:
      - name: Set Android SDK location
        script: echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/local.properties"
      - name: Build Android debug
        script: ./gradlew assembleDebug
    artifacts:
      - app/build/outputs/**/*.apk
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

Commit `codemagic.yaml`, push, and start a build in the [Codemagic UI](https://codemagic.io/apps). If it fails, check YAML path, **`local.properties`**, and iOS paths—[Common issues](../troubleshooting/common-issues), [iOS](../troubleshooting/common-ios-issues), [Android](../troubleshooting/common-android-issues).

## Step 2: Preparing for signing

Flutter and React Native use the **same** Apple and Android artifacts as native when bundle ID / application ID match. Full detail: [Signing iOS](../yaml-code-signing/signing-ios), [Signing Android](../yaml-code-signing/signing-android).

{{< tabpane >}}

{{< tab header="iOS" >}}
{{< markdown >}}
**Apple Developer Program** membership required.

1. **App Store Connect API key** — Create under App Store Connect → **Users and Access → Integrations**; upload the **`.p8`** in Codemagic **Team integrations**.
2. **Distribution certificate and App Store profile** — Add under **Team settings → Code signing identities** (or use **Fetch** after the API key is saved).

Minimal YAML (use your key name and bundle ID). Run **`xcode-project use-profiles`** before the IPA step in Step 3.
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
integrations:
  app_store_connect: YOUR_API_KEY_NAME

environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: com.example.app
{{< /highlight >}}

{{< markdown >}}
More: [Signing iOS apps](../yaml-code-signing/signing-ios).
{{< /markdown >}}
{{< /tab >}}

{{< tab header="Android" >}}
{{< markdown >}}
1. Create or reuse a **release keystore** (see [Signing Android apps](../yaml-code-signing/signing-android)).
2. Upload it under **Code signing identities → Android keystores** and note the **reference name**.
3. Reference it in YAML; Codemagic sets **`CM_KEYSTORE_*`** and **`CM_KEY_*`** on the build VM.

{{< /markdown >}}

{{< highlight Shell "style=paraiso-dark">}}
keytool -genkey -v -keystore codemagic.keystore -storetype JKS \
  -keyalg RSA -keysize 2048 -validity 10000 -alias codemagic
{{< /highlight >}}

{{< markdown >}}
2. **Upload** the keystore under **Team settings → codemagic.yaml settings → Code signing identities → Android keystores**. Set keystore password, key alias, key password, and a **reference name** you will use in YAML.

3. **`android_signing` in `codemagic.yaml`** — Codemagic injects the keystore on the build machine and sets **`CM_KEYSTORE_PATH`**, **`CM_KEYSTORE_PASSWORD`**, **`CM_KEY_ALIAS`**, and **`CM_KEY_PASSWORD`**:

{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
environment:
  android_signing:
    - your_keystore_reference_name
{{< /highlight >}}

{{< markdown >}}
4. **Gradle release signing (required)** — Uploading the keystore and listing `android_signing` is not enough: **`release` must use those variables** or you still get **unsigned** release outputs. Add a `signingConfigs.release` block in **`android/app/build.gradle`** (Groovy) that reads the `CM_*` env vars when Codemagic sets **`CI=true`**, and point **`buildTypes.release`** at it:

{{< /markdown >}}

{{< highlight Groovy "style=paraiso-dark">}}
android {
    // ...
    signingConfigs {
        release {
            if (System.getenv()["CI"]) {
                storeFile file(System.getenv()["CM_KEYSTORE_PATH"])
                storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]
                keyAlias System.getenv()["CM_KEY_ALIAS"]
                keyPassword System.getenv()["CM_KEY_PASSWORD"]
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
{{< /highlight >}}

{{< markdown >}}
For a complete **`android { }`** example with an **`else`** branch (so local **`./gradlew assembleRelease`** still works via `key.properties`), see [Signing Android apps using Gradle](../yaml-code-signing/signing-android#signing-android-apps-using-gradle). Kotlin DSL (**`.kts`**) projects need the same wiring in **`build.gradle.kts`** — see [Signing Android apps](../yaml-code-signing/signing-android).

**Expected artifact:** **`.aab`** or **`.apk`** from `./gradlew bundleRelease` / `assembleRelease` (see **your** tab’s signed example below).

**More:** [Signing Android apps](../yaml-code-signing/signing-android).
{{< /markdown >}}
{{< /tab >}}

{{< /tabpane >}}

## Step 3: Sign your build

After identities exist in **Team settings** (and **App Store Connect** integration for iOS), use **your stack’s tab**. Replace placeholders (`<App Store Connect API key name>`, keystore reference, `PACKAGE_NAME`, bundle ID, workspace, scheme).

{{< tabpane >}}

{{< tab header="Flutter" >}}
{{< markdown >}}
Two workflows: **Android** (signed **AAB**) and **iOS** (signed **IPA**). Each needs the matching credentials from **Step 2** above. For more Flutter options, see [Flutter apps](building-a-flutter-app).
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  flutter-android-signed:
    name: Flutter Android (signed release)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      android_signing:
        - keystore_reference
      vars:
        PACKAGE_NAME: "com.example.yourapp"
      flutter: stable
    scripts:
      - name: Set up local.properties
        script: echo "flutter.sdk=$HOME/programs/flutter" > "$CM_BUILD_DIR/android/local.properties"
      - name: Get Flutter packages
        script: flutter pub get
      - name: Build Android App Bundle
        script: flutter build appbundle --release
    artifacts:
      - build/**/outputs/**/*.aab

  flutter-ios-signed:
    name: Flutter iOS (signed release)
    max_build_duration: 120
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: <App Store Connect API key name>
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.yourapp
      flutter: stable
      xcode: latest
      cocoapods: default
    scripts:
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
      - name: Get Flutter packages
        script: flutter pub get
      - name: Install CocoaPods dependencies
        script: find . -name "Podfile" -execdir pod install \;
      - name: Flutter build ipa
        script: |
          flutter build ipa --release \
            --build-name=1.0.0 \
            --build-number=1 \
            --export-options-plist=/Users/builder/export_options.plist
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
{{< /highlight >}}

{{< /tab >}}

{{< tab header="React Native" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  rn-android-signed:
    name: React Native Android (signed release)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      android_signing:
        - keystore_reference
      vars:
        PACKAGE_NAME: "com.example.yourapp"
      node: v22.11.0
    scripts:
      - name: Install npm dependencies
        script: npm ci
      - name: Set Android SDK location
        script: echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      - name: Build Android release bundle
        script: |
          cd android
          ./gradlew bundleRelease
    artifacts:
      - android/app/build/outputs/**/*.aab

  rn-ios-signed:
    name: React Native iOS (signed release)
    max_build_duration: 120
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: <App Store Connect API key name>
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.yourapp
      vars:
        XCODE_WORKSPACE: "YourApp.xcworkspace"
        XCODE_SCHEME: "YourApp"
        APP_STORE_APPLE_ID: 1234567890
      node: v22.11.0
      xcode: latest
      cocoapods: default
    scripts:
      - name: Install npm dependencies
        script: npm ci
      - name: Install CocoaPods dependencies
        script: |
          cd ios && pod install
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa \
            --workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
{{< /highlight >}}

{{< /tab >}}

{{< tab header="iOS (native)" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-native-signed:
    name: Native iOS (signed release)
    max_build_duration: 120
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: <App Store Connect API key name>
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.yourapp
      vars:
        XCODE_WORKSPACE: "YourApp.xcworkspace"
        XCODE_SCHEME: "YourApp"
      xcode: latest
      cocoapods: default
    scripts:
      - name: Install CocoaPods dependencies
        script: pod install
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa \
            --workspace "$CM_BUILD_DIR/$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
{{< /highlight >}}


{{< /tab >}}

{{< tab header="Android (native)" >}}
{{< markdown >}}
Matches [Android native apps](building-a-native-android-app): `android_signing` and `bundleRelease`.
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-native-signed:
    name: Native Android (signed release)
    max_build_duration: 120
    instance_type: mac_mini_m2
    environment:
      android_signing:
        - keystore_reference
      vars:
        PACKAGE_NAME: "com.example.yourapp"
    scripts:
      - name: Set Android SDK location
        script: echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/local.properties"
      - name: Build Android release bundle
        script: ./gradlew bundleRelease
    artifacts:
      - app/build/outputs/**/*.aab
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

{{< notebox >}}
**Common issues (signed builds)**

- **iOS:** Run **`xcode-project use-profiles`** before **`xcode-project build-ipa`** or **`flutter build ipa`**. Check **`distribution_type`** and **bundle ID** match your provisioning profile; Flutter often needs **`--export-options-plist=/Users/builder/export_options.plist`**. More detail: [Common iOS issues](../troubleshooting/common-ios-issues).
- **Android:** The **`keystore_reference`** name in YAML must match **Code signing identities**; **`release`** builds need **`signingConfigs`** wired to **`CM_KEYSTORE_*`** / **`CM_KEY_*`** when `CI=true` (see the Gradle section above). See [Common Android issues](../troubleshooting/common-android-issues).
- **Google Play:** Upload and signing problems are covered in [Common Google Play errors](../troubleshooting/common-google-play-errors).

If the failure is unclear, open the failing step in the build log and search these guides for the error text.
{{</notebox>}}

## Step 4: Distribute to internal testers

Add **`publishing:`** to workflows that already produce signed artifacts. To run on git events, add **`triggering:`** and [webhooks](../yaml-running-builds/webhooks)—see [Starting builds automatically](../yaml-running-builds/starting-builds-automatically).

{{< tabpane >}}

{{< tab header="iOS (TestFlight)" >}}
{{< markdown >}}
[App Store Connect publishing](../yaml-publishing/app-store-connect) — full options.
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        beta_groups:
          - Internal testers
{{< /highlight >}}
{{< /tab >}}

{{< tab header="Android (Play internal)" >}}
{{< markdown >}}
Store the Play service account JSON as a [secret variable](../yaml-basic-configuration/environment-variables). [Google Play publishing](../yaml-publishing/google-play) — tracks, credentials, versioning.
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

Other targets: [Publishing](../yaml-publishing/) (Firebase App Distribution, GitHub Releases, and more).

## Step 5: Publish to the stores

**Create separate workflows** in the same `codemagic.yaml` for publishing to the App Store or Play store. Set when each workflow runs with `triggering:`.

Store submission has **review**, **metadata**, and **rollout** rules that internal testing does not; use the full guides for **`phased_release`**, **staged rollouts**, and Magic Actions timing.

Two **sibling** workflows under **`workflows:`** (production **`.ipa`** / **`.aab`**—reuse your Step 3 build configuration in place of **`# …`**):

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-app-store-release:
    name: iOS App Store release
    # ...
    publishing:
      app_store_connect:
        auth: integration
        submit_to_app_store: true

  android-play-production:
    name: Android Play production
    # ...
    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: production
{{< /highlight >}}

{{< tabpane >}}

{{< tab header="iOS (App Store)" >}}
{{< highlight yaml "style=paraiso-dark">}}
    publishing:
      app_store_connect:
        auth: integration
        submit_to_app_store: true
{{< /highlight >}}
{{< /tab >}}

{{< tab header="Android (Play production)" >}}
{{< markdown >}}
**`track: production`** sends the **`.aab`** to the production track. Optional **`rollout_fraction`** and promotion between tracks are in [Google Play publishing](../yaml-publishing/google-play).

Each upload must use a **higher version code** than the last one on that track—see [Automatic build versioning](../knowledge-codemagic/build-versioning).
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: production
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

Details: [App Store Connect publishing](../yaml-publishing/app-store-connect), [Google Play publishing](../yaml-publishing/google-play), [Automatic build versioning](../knowledge-codemagic/build-versioning).

## Next steps

- **Tests** — [Testing](../yaml-testing/testing), [Firebase Test Lab](../yaml-testing/firebase-test-lab)
- **Caching** — [Caching](../knowledge-codemagic/caching)
- **Triggers** — [Webhooks](../yaml-running-builds/webhooks), [branches / PRs / tags](../yaml-running-builds/starting-builds-automatically), [scheduling](../yaml-running-builds/scheduling)
- **Stack guides** — [Flutter](building-a-flutter-app), [React Native](building-a-react-native-app), [iOS native](building-a-native-ios-app), [Android native](building-a-native-android-app)
- **Reference** — [codemagic.yaml](../yaml/yaml-getting-started)

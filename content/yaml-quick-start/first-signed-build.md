---
title: First Release Pipeline
description: Build, sign, and distribute a mobile app with Codemagic—internal testing through App Store and Play store release
weight: 0
aliases:
  - /yaml-quick-start/unified-quick-start
---

Codemagic is a cloud-based CI/CD service for building, signing, and distributing mobile apps. This quick start uses **tabs** so you can follow **Flutter**, **React Native**, **native iOS**, or **native Android**. The flow is the same in five steps:

1. **[Unsigned build](#step-1-a-basic-unsigned-build)** — Run a workflow without signing to confirm the project compiles in CI.
2. **[Signing credentials](#step-2-preparing-for-signing)** — Create or gather Apple and Android signing inputs, then upload them in Codemagic.
3. **[Signed build](#step-3-sign-your-build)** — Add signing to YAML and produce signed **`.ipa`**, **`.aab`**, or **`.apk`** files.
4. **[Internal distribution](#step-4-distribute-to-internal-testers)** — Publish to **TestFlight** (internal testers) and Google Play **internal** testing.
5. **[Store release](#step-5-publish-to-the-stores)** — Use **separate workflows** to submit to the **App Store** and **Google Play** production.

You do not need to modify your Xcode or Gradle project to run unsigned builds. Signing requires adding credentials, but does not require restructuring your project.

[Step 4](#step-4-distribute-to-internal-testers) and [Step 5](#step-5-publish-to-the-stores) are optional publishing paths. After that, [Next steps: from signed build to full CI/CD](#next-steps-from-signed-build-to-full-cicd) lists what most teams add next; [Further capabilities](#further-capabilities-and-next-steps) links stack guides and reference.

## Connect your repo or use a sample repository

To connect your repo, authorize the relevant connection then choose the repo you want to use.

To try Codemagic without wiring your own app first, clone one of these sample projects:

- **Flutter** — [flutter-android-and-ios-yaml-demo-project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/flutter/flutter-android-and-ios-yaml-demo-project)
- **React Native** — [react-native-demo-project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/react-native/react-native-demo-project)
- **Native iOS** — [ios-native-quick-start](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/ios/ios-native-quick-start)
- **Native Android** — [android-native-quick-start](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/android/android-native-quick-start)

More samples are listed on [Codemagic sample projects](codemagic-sample-projects).

## Step 1: A basic unsigned build

Put **`codemagic.yaml` at the repository root**, commit it, open **your stack’s tab**, copy the **unsigned** workflow, and replace **placeholders** (workspace, scheme, package name, and so on) for your app.

Each workflow lives under the top-level **`workflows:`** key. The examples below start with **`environment`**, **`scripts`**, and **`artifacts`**; add **`publishing:`** in **Steps 4–5** when you distribute builds (**Step 5** normally uses **extra** workflow entries—see there).

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
Two workflows: **debug iOS** without code signing (`--no-codesign`), and **debug Android APK**.
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
Two workflows: **Android `assembleDebug`** and **unsigned iOS** via `xcodebuild` with `CODE_SIGNING_ALLOWED=NO`. Adjust `XCODE_WORKSPACE`, `XCODE_SCHEME`, and Node version to match your project.
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
        script: |
          cd android
          ./gradlew assembleDebug
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
        script: |
          cd ios && pod install
      - name: Build iOS without code signing
        script: |
          xcodebuild \
            -workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" \
            -scheme "$XCODE_SCHEME" \
            -configuration Debug \
            -destination 'generic/platform=iOS' \
            CODE_SIGNING_ALLOWED=NO \
            build
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
Assumes the **Xcode workspace** lives at the **repository root** (as in [iOS native apps](building-a-native-ios-app)). If your workspace is only under `ios/`, use `cd ios && pod install` and point `-workspace` to `$CM_BUILD_DIR/ios/YourApp.xcworkspace`.
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

{{< notebox >}}
If you use a **.xcodeproj** only, swap `-workspace` for `-project YourApp.xcodeproj` in the `xcodebuild` command (same pattern as [iOS native apps](building-a-native-ios-app)).
{{</notebox>}}

{{< /tab >}}

{{< tab header="Android (native)" >}}
{{< markdown >}}
Assumes the **Gradle project** is at the **repository root** (as in [Android native apps](building-a-native-android-app)). If the project is in a subfolder, run Gradle from that directory and adjust `local.properties` paths.
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

Commit `codemagic.yaml` to your repository and push. In [Codemagic](https://codemagic.io/apps), click on `Start new build` to run it.

If an unsigned workflow finishes successfully, your Codemagic setup is working and you can move on to **signing**.

If a build fails, typical causes are YAML at the wrong path, **`local.properties`** next to the wrong **`build.gradle`**, or iOS **workspace/scheme/paths**—see [Common issues](../troubleshooting/common-issues), [Common iOS issues](../troubleshooting/common-ios-issues), and [Common Android issues](../troubleshooting/common-android-issues).

## Step 2: Preparing for signing

Add the credentials for App Store or Google Play. The **iOS** and **Android** tabs below describe what to upload; Flutter and React Native use the **same** Apple and Android files as native apps when your bundle ID and application ID match.

Details and troubleshooting: [Signing iOS apps](../yaml-code-signing/signing-ios), [Signing Android apps](../yaml-code-signing/signing-android); walkthroughs: [iOS native](building-a-native-ios-app#code-signing), [Android native](building-a-native-android-app#code-signing).

Set this up **once per platform** (iOS and/or Android). You will reference the same uploaded files from **your** signed workflow in the next section, regardless of framework.

{{< tabpane >}}

{{< tab header="iOS" >}}
{{< markdown >}}
**Requirements:** Active [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.

1. **App Store Connect API key** — Create in [App Store Connect](https://appstoreconnect.apple.com/access/integrations/api) under **Users and Access → Integrations → App Store Connect API**; download the **`.p8`** (once). Note **Issuer ID** and **Key ID**. Upload in Codemagic under **Team integrations → Developer Portal → Manage keys**.
2. **Signing files for your bundle ID** — **Apple Distribution** certificate (e.g. `.p12`) and an **App Store** provisioning profile (`.mobileprovision`). Add them under **Team settings → codemagic.yaml settings → Code signing identities** (**iOS certificates** / **iOS provisioning profiles**), or use **Fetch** after the API key is saved.

**Minimal signing block in `codemagic.yaml`** (use your key name and bundle ID). Run **`xcode-project use-profiles`** in `scripts` **before** the IPA build step (see **your** stack’s signed YAML in **Step 3** below).
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
**Expected artifact:** signed **`.ipa`** (artifact paths match **your** tab’s signed example below).

**More:** [Signing iOS apps](../yaml-code-signing/signing-ios).
{{< /markdown >}}
{{< /tab >}}

{{< tab header="Android" >}}
{{< markdown >}}
1. **Release keystore** — Generate locally with **Java keytool**, or use an existing upload key:

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

Use the workflow in **your stack’s tab** after the identities above exist in **Team settings** → **Code signing identities** (and your **App Store Connect** integration key is saved under **Team integrations** when you build iOS). Replace placeholders such as `<App Store Connect API key name>`, `keystore_reference`, `PACKAGE_NAME`, `bundle_identifier`, workspace, and scheme names.

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
{{< markdown >}}
Two workflows: **Android** (**AAB**) and **iOS** (**IPA**), using the same `android_signing` / `ios_signing` settings as in **Step 2** above. Adjust paths if your `android/` or `ios/` layout differs.
{{< /markdown >}}

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
{{< markdown >}}
Matches the pattern in [iOS native apps](building-a-native-ios-app): `ios_signing`, `xcode-project use-profiles`, and `xcode-project build-ipa`.
{{< /markdown >}}

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

Optional: once **Step 3** produces signed artifacts, add **`publishing:`** to each workflow.

To run distribution workflows when you push code, set up [Webhooks](../yaml-running-builds/webhooks) from your Git host and define **`triggering:`** in `codemagic.yaml` as in [Starting builds automatically](../yaml-running-builds/starting-builds-automatically). You can still start any workflow manually with Codemagic UI.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-testflight-internal:
    name: iOS TestFlight (internal)
    # ...
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        beta_groups:
          - Internal testers

  android-play-internal:
    name: Android Play internal testing
    # ...
    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
{{< /highlight >}}

The tabs below spell out each **`publishing`** block and link to the full guides.

{{< tabpane >}}

{{< tab header="iOS (TestFlight)" >}}
{{< markdown >}}
Reuse the **`app_store_connect`** integration from signing. **`auth: integration`** uploads the **`.ipa`** from **`artifacts`**. **`submit_to_testflight`** and **`beta_groups`** run in **post-processing** after the main workflow finishes. Replace group names with your **Internal testing** groups in App Store Connect.

Full options (release scheduling, phased release, and so on): [App Store Connect publishing](../yaml-publishing/app-store-connect).
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
Store the Play **service account** JSON as a [secret environment variable](../yaml-basic-configuration/environment-variables) (for example **`GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS`**) and attach the variable group to the workflow **`environment`** if you use groups. **`track: internal`** targets [internal testing](https://support.google.com/googleplay/android-developer/answer/9845334). For a **new** listing, upload the first **`.aab`** **once** in Play Console; later uploads need a **higher version code**—see [Automatic build versioning](../knowledge-codemagic/build-versioning).

Details and optional fields: [Google Play publishing](../yaml-publishing/google-play).
{{< /markdown >}}

{{< highlight yaml "style=paraiso-dark">}}
    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

For **Firebase App Distribution**, **GitHub Releases**, and other targets, see [Publishing](../yaml-publishing/).

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
{{< markdown >}}
**`submit_to_app_store: true`** requests App Store review in **post-processing** after the **`.ipa`** upload (same pattern as TestFlight actions in Step 4). You still need a valid app record, screenshots, privacy details, and so on in App Store Connect.

Details: [App Store Connect publishing](../yaml-publishing/app-store-connect).
{{< /markdown >}}

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

## Next steps: from signed build to full CI/CD

After optional **Steps 4–5**—or if you skip them—most teams go on to:

- **Tests** — Run [unit and integration tests](../yaml-testing/testing) in CI, or [Firebase Test Lab](../yaml-testing/firebase-test-lab) for Android device testing.
- **Caching** — Speed up repeat builds with [dependency and Xcode caching](../knowledge-codemagic/caching) (Gradle, CocoaPods, Pub / Flutter, and related paths).
- **Workflows** — Trigger builds from [webhooks](../yaml-running-builds/webhooks), [branches, pull requests, or tags](../yaml-running-builds/starting-builds-automatically), and use [scheduling](../yaml-running-builds/scheduling) where it helps.
- **More distribution** — Extra tracks, Firebase App Distribution, GitHub Releases, and the rest of [Publishing](../yaml-publishing/).

## Further capabilities and next steps

- **Build versioning** — [Automatic build versioning](../knowledge-codemagic/build-versioning) (for example App Store or TestFlight build numbers).
- **Desktop** — [Flutter code signing](building-a-flutter-app#code-signing) (macOS / Windows), [Signing macOS apps](../yaml-code-signing/signing-macos).
- **[codemagic.yaml reference](../yaml/yaml-getting-started)** — full configuration reference.

**Deeper guide for your stack:** [Flutter](building-a-flutter-app), [React Native](building-a-react-native-app), [iOS native](building-a-native-ios-app), or [Android native](building-a-native-android-app). For notifications, environment groups, and other topics, use the sidebar or search the docs.

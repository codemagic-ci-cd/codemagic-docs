---
title: 'OTA updates for Ionic Capacitor apps'
description: Step-by-step guide to enabling CodePush OTA updates in an Ionic Capacitor app, including migration from Ionic Appflow Live Updates
meta_title: OTA Updates for Ionic Capacitor Apps with Codemagic CodePush
meta_description: Learn how to integrate Codemagic CodePush into an Ionic Capacitor app for instant over-the-air updates — including plugin setup, deployment configuration, Appflow Live Updates migration, and a full Codemagic CI/CD pipeline with codemagic.yaml.
weight: 23
---

This guide walks you through integrating Codemagic CodePush into an Ionic Capacitor app to deliver JavaScript and web asset updates instantly, without waiting for an App Store or Google Play review.

---

## Prerequisites

- Ionic Capacitor project (Capacitor 4 or later)
- Node.js 18+
- A Codemagic account with CodePush access
- The Codemagic CodePush CLI:

{{< highlight bash "style=paraiso-dark">}}
npm install -g @codemagic/code-push-cli
{{< /highlight>}}
- Java 21 for the Android build toolchain

---

## Migrating from Ionic Appflow Live Updates

### How CodePush differs from Appflow

If you are migrating from Ionic Appflow, the mental model is similar but the implementation differs in a few important ways. Appflow handles update checks through its own SDK with minimal code changes on your side; with CodePush, you call `codePush.sync()` explicitly, which gives you more control over when and how updates are presented. Deployment channels in Appflow map directly to deployments in CodePush — Staging and Production work the same way.

| | **Appflow Live Updates** | **Codemagic CodePush** |
|---|---|---|
| **Update check** | Appflow SDK, configurable | `codePush.sync()` called in your code |
| **SDK package**| Appflow SDK | `cap-codepush` |
| **Deployment channels** | Channels | Deployments (Staging / Production) |
| **CLI** | `ionic deploy` | `code-push release` |
| **Rollback** | Dashboard | Automatic on crash; `code-push rollback` |

### Migrating from Appflow — what to remove

Before adding CodePush, remove all Appflow Live Updates references from your project. Leaving them in place will cause conflicts, since both SDKs attempt to manage and replace the same web assets. The steps below cover the most common Appflow setup — your project may use a subset of these depending on which Appflow features you had enabled.

Remove the Appflow SDK package:

{{< highlight bash "style=paraiso-dark">}}
npm uninstall @ionic/portals @ionic-enterprise/live-updates
# remove whichever Appflow OTA package your project uses
{{< /highlight>}}

Remove the Appflow plugin block from `capacitor.config.ts`:

{{< highlight typescript "style=paraiso-dark">}}
// Remove this:
plugins: {
  LiveUpdates: {
    appId: 'your-appflow-app-id',
    channel: 'Production',
    autoUpdateMethod: 'background',
    maxVersions: 2
  }
}
{{< /highlight>}}

Remove any Appflow SDK initialisation calls from your app code — typically `Deploy.configure(...)` or `IonicLiveUpdates` calls in `app.component.ts` or `main.ts`.

## Configuring your Capacitor app

### Where this guide diverges from the React Native CodePush docs

If you have used Codemagic CodePush with React Native, you will notice that several things are different for Capacitorr:

**No `strings.xml` or `Info.plist` entries required.** The React Native plugin reads configuration from native resource files directly because React Native has no equivalent of the Capacitor config layer. In Capacitor, the `plugins` block in `capacitor.config.ts` is read by the native plugin at runtime via Capacitor's configuration bridge. You do not need to touch `strings.xml` or `Info.plist`.

**No root component wrapping.** React Native integrates CodePush by wrapping the root component: `export default codePush(App)`. Capacitor has no equivalent — you call `codePush.sync()` directly in your app's lifecycle, as shown in Step 4.

**No `code-push release-react`.** React Native uses `code-push release-react` which builds the JS bundle internally. For Capacitor, you build with `ionic build` yourself and release the output folder with `code-push release`.


### Step 1 — Authenticate the CLI and register your apps

Log in using the access token provided by Codemagic:

{{< highlight bash "style=paraiso-dark">}}
code-push login --access-key YOUR_ACCESS_TOKEN
{{< /highlight>}}

Create a separate CodePush app registration for each platform:

{{< highlight bash "style=paraiso-dark">}}
code-push app add MyApp-iOS
code-push app add MyApp-Android
{{< /highlight>}}

Each app is provisioned with two deployment environments automatically: **Staging** and **Production**. List the deployment keys — you will need them in the next step:

{{< highlight bash "style=paraiso-dark">}}
code-push deployment ls MyApp-iOS -k
code-push deployment ls MyApp-Android -k
{{< /highlight>}}

---

### Step 2 — Install the plugin

Install the `cap-codepush` plugin. The package is versioned to match your Capacitor major version:

{{< highlight bash "style=paraiso-dark">}}
npm install cap-codepush@8
{{< /highlight>}}

Match the `cap-codepush` version to your Capacitor major version: `@8` for Capacitor 8, `@7` for Capacitor 7, `@3` for Capacitor 6, `@2` for Capacitor 5, `@1` for Capacitor 4.

Also install the required Capacitor peer dependencies:

{{< highlight bash "style=paraiso-dark">}}
npm install @capacitor/device @capacitor/dialog @capacitor/filesystem
{{< /highlight>}}

Sync the native projects:

{{< highlight bash "style=paraiso-dark">}}
npx cap sync
{{< /highlight>}}

---

### Step 3 — Configure the plugin

All CodePush configuration goes in `capacitor.config.json` (or `capacitor.config.ts`). No changes to `Info.plist` or `strings.xml` are required.

Add a `CodePush` block under `plugins` with your deployment keys and the Codemagic server URL:

{{< highlight json "style=paraiso-dark">}}
{
  "appId": "com.example.myapp",
  "appName": "MyApp",
  "webDir": "www",
  "plugins": {
    "CodePush": {
      "IOS_DEPLOY_KEY": "YOUR_IOS_STAGING_DEPLOYMENT_KEY",
      "ANDROID_DEPLOY_KEY": "YOUR_ANDROID_STAGING_DEPLOYMENT_KEY",
      "SERVER_URL": "https://codepush.pro/"
    }
  }
}
{{< /highlight>}}

Run `npx cap sync` after any change to `capacitor.config.ts` to propagate the values into the native projects.

{{<notebox>}} 
For production builds, replace the Staging keys with your Production deployment keys. A common CI pattern is to generate the config file at build time and inject the appropriate key from an environment variable.
{{</notebox>}}


---

### Step 4 — Add CodePush sync to your app

Open `src/app/app.component.ts` (or your app entry point) and add an update check on startup.

#### Silent background update (recommended for iOS)

Silent updates download in the background and apply on the next app launch. This is fully compliant with App Store guidelines and is the recommended approach for iOS:

{{< highlight typescript "style=paraiso-dark">}}
import { Component } from '@angular/core';
import { codePush } from 'cap-codepush';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor() {
    this.checkForUpdates();
  }

  async checkForUpdates() {
    if (!Capacitor.isNativePlatform()) {
      return; // skip in browser
    }
    try {
      await codePush.sync();
    } catch (err) {
      console.error('CodePush sync failed:', err);
    }
  }
}
{{< /highlight>}}

#### Interactive update prompt (Android / internal distribution only)

{{<notebox>}} 
**Important:** Apple's App Store guidelines do not permit showing users an update prompt. Only use `updateDialog` for Android builds or internal/enterprise distribution.
{{</notebox>}} 


{{< highlight typescript "style=paraiso-dark">}}
import { codePush, InstallMode } from 'cap-codepush';

async checkForUpdatesInteractive() {
  if (!Capacitor.isNativePlatform()) return;

  await codePush.sync(
    {
      updateDialog: {
        title: 'Update Available',
        optionalUpdateMessage: 'A new version is available. Install now?',
        optionalInstallButtonLabel: 'Install',
        optionalIgnoreButtonLabel: 'Later',
        mandatoryUpdateMessage: 'A required update is available.',
        mandatoryContinueButtonLabel: 'Continue',
      },
      installMode: InstallMode.IMMEDIATE,
    },
    (progress) => {
      console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
    }
  );
}
{{< /highlight>}}

#### Check for updates on app resume (optional)

To catch updates when the app comes back to the foreground:

{{< highlight typescript "style=paraiso-dark">}}
import { App } from '@capacitor/app';

// In constructor or ngOnInit
App.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    this.checkForUpdates();
  }
});
{{< /highlight>}}

---

### Step 5 — Build the native binary and install on device

CodePush delivers updates on top of an already-installed native binary. Users must have installed the app from the App Store, Google Play, or a direct install before they can receive OTA updates.

Build and install the initial binary as you normally would:

{{< highlight bash "style=paraiso-dark">}}
ionic build
npx cap sync
{{< /highlight>}}

Then build and run via Xcode (iOS) or Android Studio (Android), or use the `codemagic.yaml` workflows at the end of this guide to build through Codemagic CI/CD.

---

### Step 6 — Release an OTA update

Once the base binary is on devices, any subsequent change to your web code can be shipped as a CodePush update.

#### Build and sync web assets

{{< highlight bash "style=paraiso-dark">}}
ionic build
npx cap copy
{{< /highlight>}}

Running `npx cap copy` copies the compiled web assets from `www/` into the native project directories without updating native plugin dependencies. This is intentional — a CodePush release only delivers web assets, so native dependencies must stay in sync with the installed binary. Running `npx cap sync` instead risks updating native plugin code that will not be delivered to users and could cause crashes if your web code references the newer native APIs.


#### Release to Staging

{{< highlight bash "style=paraiso-dark">}}
# iOS
code-push release MyApp-iOS ios/App/App/public/ "1.0.0" \
  --deploymentName Staging \
  --description "Your release description"

# Android
code-push release MyApp-Android android/app/src/main/assets/public/ "1.0.0" \
  --deploymentName Staging \
  --description "Your release description"
{{< /highlight>}}

The version string (`"1.0.0"`) must match the `version` field in your `package.json`. This ensures the update is only delivered to users running a compatible native binary. To target all installed binary versions during development:

{{< highlight bash "style=paraiso-dark">}}
code-push release MyApp-iOS ios/App/App/public/ "*" --deploymentName Staging
{{< /highlight>}}

#### Verify the release

{{< highlight bash "style=paraiso-dark">}}
code-push deployment history MyApp-iOS Staging
code-push deployment history MyApp-Android Staging
{{< /highlight>}}

#### Promote to Production

Once validated in Staging, promote the release to Production without re-uploading:

{{< highlight bash "style=paraiso-dark">}}
code-push promote MyApp-iOS Staging Production
code-push promote MyApp-Android Staging Production
{{< /highlight>}}

#### Rollback if needed

{{< highlight bash "style=paraiso-dark">}}
code-push rollback MyApp-iOS Production
code-push rollback MyApp-Android Production
{{< /highlight>}}

---

## Automate with Codemagic CI/CD

Add a `codemagic.yaml` to your repository to automate both OTA releases and full native builds.

The example below defines three workflows:

- **`ota-update`** — builds web assets, syncs them to the native folders, and releases an OTA update to Staging. Runs automatically on every push to `main`. No code signing needed.
- **`android-release`** — full signed Android build, published to Google Play.
- **`ios-release`** — full signed iOS build, published to TestFlight/App Store.

Store your CodePush access token as a secret environment variable in your team settings (**Team Settings → Environment variable groups**) in a group called `codepush_credentials`.

{{< highlight yaml "style=paraiso-dark">}}
workflows:

  # ─────────────────────────────────────────────────────────────────
  # OTA UPDATE — runs on every merge to main, no native build needed
  # ─────────────────────────────────────────────────────────────────
  ota-update:
    name: CodePush OTA Release
    max_build_duration: 30
    instance_type: linux_x2
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
    environment:
      node: latest
      groups:
        - codepush_credentials  # contains CODEPUSH_ACCESS_TOKEN
      vars:
        CODEPUSH_APP_IOS: "MyApp-iOS"
        CODEPUSH_APP_ANDROID: "MyApp-Android"
        CODEPUSH_DEPLOYMENT: "Staging"
    scripts:
      - name: Install dependencies
        script: npm ci
      - name: Build web assets
        script: ionic build --prod
      - name: Sync web assets to native directories
        script: npx cap copy
      - name: Install CodePush CLI
        script: npm install -g @codemagic/code-push-cli
      - name: Authenticate with CodePush
        script: code-push login --access-key $CODEPUSH_ACCESS_TOKEN
      - name: Release iOS OTA update
        script: | 
          APP_VERSION=$(node -p "require('./package.json').version")
          COMMIT_MESSAGE=$(git log --format=%B -n 1 $CM_COMMIT)
          code-push release \
            $CODEPUSH_APP_IOS \
            ios/App/App/public/ \
            "$APP_VERSION" \
            --deploymentName "$CODEPUSH_DEPLOYMENT" \
            --description "$COMMIT_MESSAGE"
      - name: Release Android OTA update
        script: | 
          APP_VERSION=$(node -p "require('./package.json').version")
          COMMIT_MESSAGE=$(git log --format=%B -n 1 $CM_COMMIT)
          code-push release \
            $CODEPUSH_APP_ANDROID \
            android/app/src/main/assets/public/ \
            "$APP_VERSION" \
            --deploymentName "$CODEPUSH_DEPLOYMENT" \
            --description "$COMMIT_MESSAGE"
    publishing:
      email:
        recipients:
          - your-team@example.com
        notify:
          success: true
          failure: true


  # ─────────────────────────────────────────────────────────────────
  # ANDROID NATIVE RELEASE — full build + Google Play publish
  # Run this when native code, plugins, or the app version changes
  # ─────────────────────────────────────────────────────────────────
  android-release:
    name: Android Release Build
    max_build_duration: 120
    instance_type: linux_x2
    environment:
      android_signing:
        - keystore_reference
      groups:
        - google_play
      vars:
        PACKAGE_NAME: "com.example.myapp"
        GOOGLE_PLAY_TRACK: "internal"
      node: latest
    scripts:
      - name: Set up local.properties
        script: | 
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      - name: Install npm dependencies
        script: npm ci
      - name: Build web assets
        script: ionic build --prod
      - name: Sync web assets to native project
        script: npx cap copy android
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
            -PversionName=$(node -p "require('../package.json').version")
    artifacts:
      - android/app/build/outputs/**/*.aab
      - android/app/build/outputs/**/*.apk
    publishing:
      email:
        recipients:
          - your-team@example.com
        notify:
          success: true
          failure: true
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: $GOOGLE_PLAY_TRACK
        submit_as_draft: true


  # ─────────────────────────────────────────────────────────────────
  # iOS NATIVE RELEASE — full build + TestFlight / App Store publish
  # Run this when native code, plugins, or the app version changes
  # ─────────────────────────────────────────────────────────────────
  ios-release:
    name: iOS Release Build
    max_build_duration: 120
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.myapp
      vars:
        APP_STORE_APPLE_ID: "1555555551"
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
      node: latest
    scripts:
      - name: Install npm dependencies
        script: npm ci
      - name: Install CocoaPods dependencies
        script: cd ios/App && pod install
      - name: Build web assets
        script: ionic build --prod
      - name: Sync web assets to native project
        script: npx cap copy ios
      - name: Set up code signing
        script: xcode-project use-profiles
      - name: Increment build number
        script: | 
          cd $CM_BUILD_DIR/ios/App
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number \
            "$APP_STORE_APPLE_ID")
          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
      - name: Build IPA
        script: |
          cd $CM_BUILD_DIR/ios/App
          xcode-project build-ipa \
            --workspace "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - ios/App/build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      email:
        recipients:
          - your-team@example.com
        notify:
          success: true
          failure: true
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        beta_groups:
          - Internal Testers
{{< /highlight>}}

{{<notebox>}} 
**When to run which workflow:** Use `ota-update` for everyday changes that only touch JavaScript, TypeScript, or web assets. Use `android-release` or `ios-release` when you add or update native plugins, change Capacitor configuration, update native platform code, or bump the app's store version. After each native release, update the version string in `package.json` so future CodePush releases correctly target the new binary.
{{</notebox>}} 

---

## Troubleshooting

**Update is not received by the app**

- Confirm `SERVER_URL` in `capacitor.config.json` is exactly `https://codepush.pro/` — the trailing slash matters.
- Confirm the deployment key in your config matches the output of `code-push deployment ls MyApp-iOS -k`.
- The version string in `code-push release` must match the `version` in `package.json`, unless you used `"*"` to target all versions.
- Configuration changes are baked into the native binary at build time — rebuild and reinstall the app after any changes to `capacitor.config.json`.

**CSP error blocking network requests**

Confirm that `https://codepush.pro` appears in the `default-src` directive of your Content Security Policy `<meta>` tag in `src/index.html`.

**Plugin not found or `codePush` is undefined**

The plugin registers after the native platform is ready. In Angular, make sure your sync call runs after `Platform.ready()` resolves, or place it in `ngOnInit` rather than the constructor.

---

## Next steps

- [CodePush overview and pricing](https://codemagic.io/codepush/)
- [Building Ionic Capacitor apps with Codemagic](../yaml-quick-start/building-an-ionic-app/)
- [Environment variables and secrets](../yaml-basic-configuration/environment-variables/)
- [Build versioning](../configuration/build-versioning/)

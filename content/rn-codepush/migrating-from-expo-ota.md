---
title: 'Migrating from Expo Updates'
description: Step-by-step guide to replacing Expo Updates (EAS Update) with Codemagic CodePush in a React Native app
meta_title: Migrate from Expo Updates (EAS Update) to Codemagic CodePush
meta_description: Learn how to migrate your React Native app from Expo Updates and EAS Update to Codemagic CodePush — including SDK swap, native configuration, CI pipeline changes, and a full concept mapping table.
weight: 20
---

This guide walks through migrating a React Native app's OTA update mechanism from Expo Updates / EAS Update to Codemagic CodePush. It covers the conceptual differences between the two systems, maps equivalent concepts, and provides step-by-step instructions for completing the migration.

---

## Why migrate?

Expo Updates (via EAS Update) is tightly integrated with the Expo ecosystem and EAS toolchain. Teams moving to bare React Native, teams already using Codemagic for CI/CD, or teams looking for tighter CLI-based workflow control often find Codemagic CodePush to be a better fit. Key reasons to make the switch include:

- **Single platform** — CodePush is hosted by Codemagic, so OTA updates and CI/CD builds live in the same platform.
- **CLI-first workflow** — every release, promotion, rollback, and rollout is controlled from the CLI or your CI pipeline, with no dependency on a separate Expo account.
- **React Native (non-Expo) compatibility** — CodePush works natively with bare React Native without requiring Expo modules.
- **Deployment model familiarity** — the Staging → Production promotion model maps directly to how most CI/CD pipelines already think about environments.

---

## Concept mapping

Before starting the migration, it helps to understand how concepts translate between the two systems.

| **Expo Updates** / **EAS Update** | **Codemagic CodePush** | **Notes** |
|---|---|---|
| EAS project / `projectId` | CodePush app (`code-push app add`) | One registration per platform recommended |
| Channel (e.g. `preview`, `production`) | Deployment (e.g. `Staging`, `Production`) | Same idea; CodePush calls them deployments |
| Branch | Deployment | EAS branches map roughly to CodePush deployments |
| `eas update --channel production` | `code-push release-react MyApp-iOS ios` | Both bundle and publish JS in one command |
| Runtime version | Target binary version (`--target-binary-version`) | Controls which native binary receives a given update |
| `eas update:configure` | `code-push app add` + native file edits | CodePush configuration is done in native files |
| `expo-updates` package | `@code-push-next/react-native-code-push` | The client-side SDK |
| `updates.url` in `app.json` | `CodePushServerURL` in `Info.plist` / `strings.xml` | The update server endpoint |
| EAS access token | CodePush access token | Used for CLI authentication |
| `eas update --branch ...` promote | `code-push promote MyApp Staging Production` | Promotes a validated update to production |
| `--rollout-percentage=10` | `--rollout 25` on `release-react` or `patch` | Specifies a percentage of users that should receive a new update |

---

## Before you begin

**Prerequisites:**

- A React Native app currently using `expo-updates` / EAS Update for OTA delivery.
- Node.js ≥ 16 installed.
- A Codemagic account. Sign up at [codemagic.io](https://codemagic.io/signup) if you do not have one.
- A **CodePush access token** provided by the Codemagic team. [Request one here](https://codemagic.io/contact-sales/).

{{<notebox>}} 
**Important:** CodePush updates are managed entirely through the CLI and CI pipelines — not through the Codemagic web UI. Ensure your team is comfortable with CLI-based workflows before starting.
{{</notebox>}}

---

## Step 1 — Install the CodePush CLI

Install the Codemagic CodePush CLI globally:

{{< highlight bash "style=paraiso-dark">}}
npm install -g @codemagic/code-push-cli
{{< /highlight >}}

Verify the installation:

{{< highlight bash "style=paraiso-dark">}}
code-push --version
{{< /highlight >}}

You should see a version number printed. If the command is not found, check that your global npm bin directory is in your `PATH`.

---

## Step 2 — Authenticate the CLI

Log in using the access token provided by the Codemagic team:

{{< highlight bash "style=paraiso-dark">}}
code-push login "https://codepush.pro/" --accessKey $CODEPUSH_TOKEN
{{< /highlight >}}

Store your access token in a safe place (e.g. a password manager or a secrets manager). You will need it again when setting up CI.

---

## Step 3 — Register your apps on the CodePush server

Create a CodePush app registration for each platform. React Native bundles differ per platform, so separate registrations are required.

{{< highlight bash "style=paraiso-dark">}}
code-push app add MyApp-Android
code-push app add MyApp-iOS
{{< /highlight >}}

Use any naming convention you like, but including the platform name in the app name is strongly recommended for clarity.

When an app is created, CodePush automatically provisions two deployments: **Staging** and **Production**. These are the equivalents of your EAS Update channels.

To list apps and confirm registration:

{{< highlight bash "style=paraiso-dark">}}
code-push app list
{{< /highlight >}}

### Retrieve deployment keys

Each deployment has a unique deployment key embedded in the app binary. Retrieve them with:

{{< highlight bash "style=paraiso-dark">}}
code-push deployment list MyApp-iOS -k
code-push deployment list MyApp-Android -k
{{< /highlight >}}

You will need these keys in Steps 6 and 7 below.

---

## Step 4 — Remove Expo Updates from the project

### 4a. Uninstall the package

{{< highlight bash "style=paraiso-dark">}}
# npm
npm uninstall expo-updates

# yarn
yarn remove expo-updates
{{< /highlight >}}

### 4b. Remove EAS Update configuration from `app.json` / `app.config.js`

Remove the `updates` block and `runtimeVersion` field from your Expo config:

{{< highlight diff "style=paraiso-dark">}}
 {
   "expo": {
     "name": "MyApp",
     "slug": "my-app",
-    "runtimeVersion": {
-      "policy": "fingerprint"
-    },
-    "updates": {
-      "url": "https://u.expo.dev/your-project-id",
-      "enabled": true,
-      "checkAutomatically": "ON_LOAD"
-    }
   }
 }
{{< /highlight >}}

### 4c. Remove EAS Update native configuration

**Android — `AndroidManifest.xml`**

Remove any `expo-updates` meta-data tags that were added during EAS configuration:

{{< highlight diff "style=paraiso-dark">}}
- <meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL"
-   android:value="https://u.expo.dev/your-project-id" />
- <meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION"
-   android:value="@string/expo_runtime_version" />
{{< /highlight >}}

**iOS — `Expo.plist`** (if present)

If your iOS project contains an `Expo.plist` file that was added as part of EAS Update, you can remove it, or leave it in place — it will simply be ignored once `expo-updates` is no longer installed.

### 4d. Remove `eas.json` channels (optional)

If you are fully abandoning EAS and no longer need EAS Build, you can remove the `channel` property from each build profile in `eas.json`. If you continue to use EAS Build to produce your native binaries, leave the file as-is.

---

## Step 5 — Install the CodePush client SDK

{{< highlight bash "style=paraiso-dark">}}
# npm
npm install @code-push-next/react-native-code-push

# yarn
yarn add @code-push-next/react-native-code-push
{{< /highlight >}}

---

## Step 6 — Configure native projects

### iOS — `Info.plist`

Add the CodePush server URL and your deployment key to `ios/<YourApp>/Info.plist`:

{{< highlight xml "style=paraiso-dark">}}
<key>CodePushServerURL</key>
<string>https://codepush.pro/</string>
<key>CodePushDeploymentKey</key>
<string>YOUR_IOS_DEPLOYMENT_KEY</string>
{{< /highlight >}}

Replace `YOUR_IOS_DEPLOYMENT_KEY` with the Staging key for development builds and the Production key for release builds. Use environment variables or build scripts to inject the correct key rather than hardcoding both in the file.

### Android — `android/app/src/main/res/values/strings.xml`

{{< highlight xml "style=paraiso-dark">}}
<string moduleConfig="true" name="CodePushServerUrl">https://codepush.pro/</string>
<string moduleConfig="true" name="CodePushDeploymentKey">YOUR_ANDROID_DEPLOYMENT_KEY</string>
{{< /highlight >}}

As with iOS, use your Staging key for debug/QA builds and your Production key for release builds.

### Android — `android/app/build.gradle`

Add the CodePush Gradle plugin at the bottom of the file:

{{< highlight groovy "style=paraiso-dark">}}
apply from: "../../node_modules/@code-push-next/react-native-code-push/android/codepush.gradle"
{{< /highlight >}}

### iOS — install CocoaPods

{{< highlight bash "style=paraiso-dark">}}
cd ios && pod install && cd ..
{{< /highlight >}}

---

## Step 7 — Update native bundle loading

CodePush needs to intercept the JS bundle URL so it can serve updated bundles. This requires a small change to your native app delegate.

### iOS — Objective-C (`AppDelegate.m`)

Add the import at the top of the file:

{{< highlight objc "style=paraiso-dark">}}
#import <CodePush/CodePush.h>
{{< /highlight >}}

Replace the existing bundle URL:

{{< highlight objc "style=paraiso-dark">}}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  #else
    return [CodePush bundleURL];    // <-- replaces the original bundleURL call
  #endif
}
{{< /highlight >}}

### iOS — Swift (`AppDelegate.swift`)

Add the import:

{{< highlight swift "style=paraiso-dark">}}
import CodePush
{{< /highlight >}}

Update the `bundleURL` method:

{{< highlight swift "style=paraiso-dark">}}
override func bundleURL() -> URL? {
  #if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
  #else
    CodePush.bundleURL()    // <-- replaces Bundle.main.url(...)
  #endif
}

{{< /highlight >}}

### Android — `MainApplication.kt` (React Native < 0.82)

{{< highlight kotlin "style=paraiso-dark">}}
import com.microsoft.codepush.react.CodePush

class MainApplication : Application(), ReactApplication {
    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            // ...
            override fun getJSBundleFile(): String {
                return CodePush.getJSBundleFile()
            }
        }
}
{{< /highlight >}}

### Android — `MainApplication.kt` (React Native ≥ 0.82)

{{< highlight kotlin "style=paraiso-dark">}}
import com.microsoft.codepush.react.CodePush

class MainApplication : Application(), ReactApplication {
    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList = PackageList(this).packages,
            jsBundleFilePath = CodePush.getJSBundleFile(),
        )
    }
}
{{< /highlight >}}

---

## Step 8 — Wrap the root component

In your app's entry point (typically `App.tsx` or `index.js`), wrap the root component with the CodePush HOC:

{{< highlight tsx "style=paraiso-dark">}}
import codePush from '@code-push-next/react-native-code-push';

function App() {
  // your app code
}

export default codePush(App);
{{< /highlight >}}

This enables the SDK to check for updates automatically on app launch. For advanced update strategies (background downloads, custom dialogs, mandatory update UI), see the [Advanced sync options](https://docs.codemagic.io/rn-codepush/advanced-sync-options/) documentation.

{{<notebox>}} 
Using Expo Router?
If your project uses Expo Router, the root of your application is handled differently. Instead of wrapping App.tsx, apply the CodePush HOC to the default export in `app/_layout.tsx`:

{{< highlight typescript "style=paraiso-dark">}}
import codePush from '@code-push-next/react-native-code-push';

function RootLayout() {
  return <Stack />;
}

export default codePush(RootLayout);
{{< /highlight >}}

{{</notebox>}}


---

## Step 9 — Validate end-to-end

Before updating your CI pipeline, verify that CodePush is working correctly with a local test release to your Staging deployment.

{{< highlight bash "style=paraiso-dark">}}
code-push release-react MyApp-iOS ios --deployment-name Staging
code-push release-react MyApp-Android android --deployment-name Staging
{{< /highlight >}}

Install the updated development build on a device or simulator, open the app, and confirm that the update is downloaded and applied. Refer to [Debugging and common issues](https://docs.codemagic.io/rn-codepush/debugging-and-common-issues/) if no update is received.

---

## Step 10 — Update your CI/CD pipeline

This is where the migration pays dividends if you are already on Codemagic — the OTA release step lives in the same `codemagic.yaml` as your regular build.

### Codemagic (`codemagic.yaml`)

Replace any `eas update` steps with the CodePush equivalents:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  # ... your existing build and test steps ...

  - name: Install CodePush CLI
    script: | 
      npm install -g @codemagic/code-push-cli

  - name: Release CodePush update to Staging
    script: | 
      code-push login "https://codepush.pro" --accessKey $CODEPUSH_TOKEN
      code-push release-react MyApp-iOS ios --deployment-name Staging
      code-push release-react MyApp-Android android --deployment-name Staging
{{< /highlight >}}

Store `CODEPUSH_TOKEN` as a **secure environment variable** in your Codemagic project settings — never commit it to the repository.

### GitHub Actions (if applicable)

{{< highlight yaml "style=paraiso-dark">}}
- name: Install CodePush CLI
  run: npm install -g @codemagic/code-push-cli

- name: Release CodePush update to Staging
  env:
    CODEPUSH_TOKEN: ${{ secrets.CODEPUSH_TOKEN }}
  run: | 
    code-push login "https://codepush.pro" --accessKey $CODEPUSH_TOKEN
    code-push release-react MyApp-iOS ios --deployment-name Staging
    code-push release-react MyApp-Android android --deployment-name Staging
{{< /highlight >}}

---

## Step 11 — Adopt the Staging → Production promotion workflow

The recommended CodePush release workflow mirrors the EAS Update concept of channels but adds an explicit promotion step:


{{< mermaid >}}
graph LR

%% Colors %%
classDef red fill:#ed2633,stroke:#FFF,stroke-width:1px,color:#fff

    RELEASE(Release to Staging) --> TEST(Internal testing and QA)
    TEST --> PROMOTE(Promote to Production - no rebuild required)
{{< /mermaid >}}

After a Staging release is validated, promote it:

{{< highlight bash "style=paraiso-dark">}}
code-push promote MyApp-iOS Staging Production
code-push promote MyApp-Android Staging Production
{{< /highlight >}}

This ensures the exact tested bundle — not a freshly built one — is what reaches your production users.

---

## Production controls

Once the migration is complete, you can leverage CodePush's production controls that have no direct equivalent in EAS Update:

### Percentage rollouts

Release to a subset of users and increase gradually:

{{< highlight bash "style=paraiso-dark">}}
# Release to 20% of users
code-push release-react MyApp-iOS ios --rollout 20

# Increase rollout after monitoring
code-push patch MyApp-iOS Production --rollout 50
code-push patch MyApp-iOS Production --rollout 100
{{< /highlight >}}

### Mandatory updates

Force an update to install immediately (useful for critical bug fixes):

{{< highlight bash "style=paraiso-dark">}}
code-push release-react MyApp-iOS ios --mandatory
{{< /highlight >}}

### Rollback

Instantly revert users to the previous working update:

{{< highlight bash "style=paraiso-dark">}}
code-push rollback MyApp-iOS Production
code-push rollback MyApp-Android Production
{{< /highlight >}}

### Target binary version

Restrict an update to a specific native app version (the equivalent of EAS Update's runtime version):

{{< highlight bash "style=paraiso-dark">}}
# Deliver only to apps running binary version 1.2.0
code-push release-react MyApp-iOS ios --target-binary-version "1.2.0"

# Deliver to any 1.2.x patch version
code-push release-react MyApp-iOS ios --target-binary-version "~1.2.0"
{{< /highlight >}}

---

## Common issues after migration

| **Symptom** | **Likely cause** | **Resolution** |
|---|---|---|
| App does not check for updates | Deployment key not set or wrong server URL | Verify `CodePushServerURL` and `CodePushDeploymentKey` in native files |
| Update downloads but never applies | `notifyAppReady()` not called | CodePush requires the app to confirm a successful launch; the HOC wrapper handles this automatically when using `codePush(App)` |
| CLI authentication fails | Token expired or incorrectly set | Re-request a token and re-run `code-push login` |
| Release reaches wrong users | Staging key used in production build | Inject deployment keys via environment variables per build type |
| `pod install` fails after adding SDK | Stale Podfile.lock | Delete `ios/Podfile.lock` and run `pod install` again |

---

## Next steps

- [Concepts](https://docs.codemagic.io/rn-codepush/concepts/) — understand how CodePush updates work end-to-end
- [Setup](https://docs.codemagic.io/rn-codepush/setup/) — detailed SDK configuration reference
- [Releasing updates](https://docs.codemagic.io/rn-codepush/releasing-updates/) — full release workflow documentation
- [Production control](https://docs.codemagic.io/rn-codepush/production-control/) — rollouts, rollbacks, and mandatory updates
- [CI integration](https://docs.codemagic.io/rn-codepush/ci-integration/) — automate releases in Codemagic or GitHub Actions
- [Security and access](https://docs.codemagic.io/rn-codepush/security-and-access/) — authentication and update signing
- [CLI quick reference](https://docs.codemagic.io/rn-codepush/cli-quick-reference/) — copy-paste commands for common operations
- [Analytics](https://docs.codemagic.io/rn-codepush/codepush-analytics/) — monitor update adoption and rollout health
- [Advanced sync options](https://docs.codemagic.io/rn-codepush/advanced-sync-options/) — customize update dialogs, install modes, and restart behavior
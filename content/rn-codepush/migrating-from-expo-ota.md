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
-    "slug": "my-app",
+    "slug": "my-app"
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

{{< notebox >}}
**Note:** JSON does not allow trailing commas. Ensure your `app.json` remains valid JSON after removing the `runtimeVersion` and `updates` blocks.
{{</ notebox >}}

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

{{< notebox >}}
**Using Continuous Native Generation (CNG)?**
If your project does not have committed `ios/` and `android/` directories — the
default for projects created with `create-expo-app` — skip Steps 6 and 7.
Follow [CNG projects: apps without native folders](#cng-projects-apps-without-ios-and-android-folders)
instead, then continue from Step 8.
If your project **does** commit its native folders (bare React Native or an ejected
Expo project), continue with Step 6 as written.
{{</ notebox >}}

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
<string name="CodePushServerUrl">https://codepush.pro/</string>
<string name="CodePushDeploymentKey">YOUR_ANDROID_DEPLOYMENT_KEY</string>
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

### iOS — Objective-C (`AppDelegate.mm`)

Add the import at the top of the file:

{{< highlight objc "style=paraiso-dark">}}
#import <CodePush/CodePush.h>
{{< /highlight >}}

In the `bundleURL` method, replace the `NSBundle` URL with the CodePush equivalent:

{{< highlight objc "style=paraiso-dark">}}
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [CodePush bundleURL]; // <-- Replaces [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
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
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
  #else
    return CodePush.bundleURL()
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

## CNG projects: apps without native folders

In a **Continuous Native Generation (CNG)** project the `ios/` and `android/`
directories do not live in the repository. They are generated on demand by
`expo prebuild`, which runs automatically inside EAS Build and can be triggered
locally at any time with:

{{< highlight bash "style=paraiso-dark">}}
npx expo prebuild --clean
{{< /highlight >}}

Any edits made directly to those folders are silently overwritten the next time
`prebuild` runs. This is the same problem `expo-updates` itself solves — it ships
with an Expo **config plugin** that injects its native configuration into the
freshly generated files during `prebuild`. The same technique works for CodePush.

There are two ways to handle this. Choose the one that fits your team's workflow.

| | Option A — Config plugin | Option B — Post-prebuild script |
|---|---|---|
| Runs automatically during `prebuild` | ✅ | ❌ (requires an extra CI step) |
| Works identically locally and in CI | ✅ | ❌ |
| Survives `prebuild --clean` | ✅ | ✅ |
| Complexity | Moderate | Simple |
| Risk from RN version changes | Low | Higher (string matching) |

**Option A is recommended** for teams that fully embrace CNG. Option B is a
pragmatic fallback if a config plugin feels like too much overhead for your
project right now.

---

### Option A — Expo config plugin (recommended)

#### 1. Install the config-plugins package

If it is not already in your project:

{{< highlight bash "style=paraiso-dark">}}
# npm
npm install --save-dev @expo/config-plugins

# yarn
yarn add --dev @expo/config-plugins
{{< /highlight >}}

#### 2. Create `app.plugin.js` at the project root

This plugin modifies the four locations that Steps 6 and 7 cover for bare
projects — `Info.plist`, `strings.xml`, `build.gradle`, `AppDelegate`, and
`MainApplication` — and handles both React Native < 0.82 and ≥ 0.82 for the
`MainApplication` change.

{{< highlight js "style=paraiso-dark">}}
// app.plugin.js
const {
  withInfoPlist,
  withStringsXml,
  withAppBuildGradle,
  withAppDelegate,
  withMainApplication,
} = require('@expo/config-plugins');

const CODEPUSH_SERVER_URL = 'https://codepush.pro/';

// ─── iOS: Info.plist ─────────────────────────────────────────────────────────

function withCodePushIOS(config, { iosDeploymentKey = '' }) {
  return withInfoPlist(config, (c) => {
    c.modResults['CodePushServerURL'] = CODEPUSH_SERVER_URL;
    c.modResults['CodePushDeploymentKey'] = iosDeploymentKey;
    return c;
  });
}

// ─── Android: strings.xml ────────────────────────────────────────────────────

function withCodePushAndroidStrings(config, { androidDeploymentKey = '' }) {
  return withStringsXml(config, (c) => {
    const strings = c.modResults.resources.string ?? [];

    const set = (name, value) => {
      const existing = strings.find((s) => s.$.name === name);
      if (existing) {
        existing._ = value;
      } else {
        strings.push({ $: { name, moduleConfig: 'true' }, _: value });
      }
    };

    set('CodePushServerUrl', CODEPUSH_SERVER_URL);
    set('CodePushDeploymentKey', androidDeploymentKey);
    c.modResults.resources.string = strings;
    return c;
  });
}

// ─── Android: build.gradle ───────────────────────────────────────────────────

function withCodePushAndroidGradle(config) {
  return withAppBuildGradle(config, (c) => {
    const line =
      'apply from: "../../node_modules/' +
      '@code-push-next/react-native-code-push/android/codepush.gradle"';
    if (!c.modResults.contents.includes('codepush.gradle')) {
      c.modResults.contents += `\n${line}\n`;
    }
    return c;
  });
}

// ─── iOS: AppDelegate ────────────────────────────────────────────────────────
//
// NOTE: The exact structure of AppDelegate varies across React Native versions.
// After running `expo prebuild --clean` for the first time, inspect the
// generated AppDelegate.swift (or .mm) to confirm the replacement landed
// correctly before committing the plugin to your team.
//
// The patterns below cover:
//   • New Architecture / RN ≥ 0.71 Swift projects (bundleURL override)
//   • Legacy Objective-C projects (sourceURLForBridge)

function withCodePushAppDelegate(config) {
  return withAppDelegate(config, (c) => {
    let src = c.modResults.contents;

    if (c.modResults.language === 'swift') {
      // Add import after the last import line if not already present
      if (!src.includes('import CodePush')) {
        src = src.replace(
          /^(import \S+)$/m,
          (match) => `${match}\nimport CodePush`
        );
      }
      // Replace the embedded bundle URL inside bundleURL()
      src = src.replace(
        /Bundle\.main\.url\(\s*forResource:\s*"main",\s*withExtension:\s*"jsbundle"\s*\)/g,
        'CodePush.bundleURL()'
      );
    } else {
      // Objective-C / Objective-C++
      if (!src.includes('#import <CodePush/CodePush.h>')) {
        src = src.replace(
          /#import "AppDelegate\.h"/,
          '#import "AppDelegate.h"\n#import <CodePush/CodePush.h>'
        );
      }
      src = src.replace(
        /\[\[NSBundle mainBundle\] URLForResource:@"main" withExtension:@"jsbundle"\]/g,
        '[CodePush bundleURL]'
      );
    }

    c.modResults.contents = src;
    return c;
  });
}

// ─── Android: MainApplication.kt ─────────────────────────────────────────────
//
// Supports both MainApplication architectures:
//   • RN < 0.82  — overrides getJSBundleFile() inside DefaultReactNativeHost
//   • RN ≥ 0.82  — passes jsBundleFilePath to getDefaultReactHost()
//
// The correct branch is chosen by detecting which pattern is present in the
// generated file, so the plugin works across RN versions without configuration.

function withCodePushMainApplication(config) {
  return withMainApplication(config, (c) => {
    let src = c.modResults.contents;

    // Add import if missing
    if (!src.includes('com.microsoft.codepush.react.CodePush')) {
      src = src.replace(
        /(import com\.facebook\.react\.ReactApplication)/,
        '$1\nimport com.microsoft.codepush.react.CodePush'
      );
    }

    if (src.includes('getDefaultReactHost')) {
      // ── RN ≥ 0.82: inject jsBundleFilePath into getDefaultReactHost() ──
      // We target the opening of the function call broadly to avoid depending
      // on named-argument ordering, which may change across RN template versions.
      // After running `expo prebuild --clean`, verify that MainApplication.kt
      // contains `jsBundleFilePath = CodePush.getJSBundleFile()`.
      if (!src.includes('CodePush.getJSBundleFile()')) {
        const patched = src.replace(
          /(getDefaultReactHost\s*\([^)]+)\)/,
          '$1,\n            jsBundleFilePath = CodePush.getJSBundleFile()\n        )'
        );
        if (patched === src) {
          // Regex did not match — template structure may differ in this RN version.
          // Fall through and let the verification step catch it.
          console.warn(
            '⚠️  withCodePushMainApplication: could not inject jsBundleFilePath. ' +
            'Verify MainApplication.kt after prebuild.'
          );
        }
        src = patched;
      }
    } else {
      // ── RN < 0.82: override getJSBundleFile() inside DefaultReactNativeHost ──
      if (!src.includes('CodePush.getJSBundleFile()')) {
        src = src.replace(
          /object\s*:\s*DefaultReactNativeHost\(this\)\s*\{/,
          'object : DefaultReactNativeHost(this) {\n' +
          '            override fun getJSBundleFile(): String = CodePush.getJSBundleFile()\n'
        );
      }
    }

    c.modResults.contents = src;
    return c;
  });
}

// ─── Root plugin ─────────────────────────────────────────────────────────────

module.exports = function withCodePush(config, props = {}) {
  config = withCodePushIOS(config, props);
  config = withCodePushAndroidStrings(config, props);
  config = withCodePushAndroidGradle(config);
  config = withCodePushAppDelegate(config);
  config = withCodePushMainApplication(config);
  return config;
};
{{< /highlight >}}

#### 3. Register the plugin in `app.config.js`

Use `app.config.js` (not `app.json`) so deployment keys can be read from
environment variables at build time — avoiding hardcoded keys for different
environments (Staging vs Production).

{{< highlight js "style=paraiso-dark">}}
// app.config.js
export default ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      './app.plugin',
      {
        iosDeploymentKey: process.env.CODEPUSH_IOS_KEY ?? '',
        androidDeploymentKey: process.env.CODEPUSH_ANDROID_KEY ?? '',
      },
    ],
  ],
});
{{< /highlight >}}

In Codemagic, define `CODEPUSH_IOS_KEY` and `CODEPUSH_ANDROID_KEY` as **secure
environment variables** in your project settings — one set for Staging builds and
one set for Production builds. The plugin picks up whichever pair is active for
the current workflow run.

#### 4. Verify the output

Run `prebuild` locally and inspect the generated files to confirm the plugin
applied all changes correctly. Do this the first time you add the plugin, and
again after any React Native version upgrade.

{{< highlight bash "style=paraiso-dark">}}
npx expo prebuild --clean

# iOS
grep -A1 "CodePushServerURL" ios/<YourApp>/Info.plist
grep "CodePush" ios/<YourApp>/AppDelegate.swift

# Android
grep "CodePush" android/app/src/main/res/values/strings.xml
grep "codepush.gradle" android/app/build.gradle
grep "CodePush" android/app/src/main/java/**/MainApplication.kt
{{< /highlight >}}

If any replacement did not land — most commonly because your RN version's
AppDelegate or MainApplication uses a slightly different structure — adjust the
regex in `app.plugin.js` to match, re-run `prebuild --clean`, and verify again.

Once the output looks correct the generated `ios/` and `android/` directories can
be deleted; they will be regenerated automatically by EAS Build and by
Codemagic if you run `expo prebuild` as a workflow step.

---

### Option B — Post-prebuild script in Codemagic

If you prefer not to write a config plugin, add two steps to your Codemagic
workflow: run `expo prebuild` first, then immediately patch the generated files
with a Node.js script before the native build starts.

#### 1. Create `scripts/inject-codepush.js`

{{< highlight js "style=paraiso-dark">}}
#!/usr/bin/env node
/**
 * Injects CodePush configuration into freshly prebuild-generated native files.
 * Run immediately after `expo prebuild` in CI.
 *
 * Required environment variables:
 *   APP_NAME              — must match the Xcode target folder name (e.g. "MyApp")
 *   CODEPUSH_IOS_KEY      — deployment key for the iOS build
 *   CODEPUSH_ANDROID_KEY  — deployment key for the Android build
 */

const fs = require('fs');
const path = require('path');

const SERVER_URL = 'https://codepush.pro/';
const APP_NAME = process.env.APP_NAME;
const IOS_KEY = process.env.CODEPUSH_IOS_KEY ?? '';
const ANDROID_KEY = process.env.CODEPUSH_ANDROID_KEY ?? '';

if (!APP_NAME) {
  console.error('❌  APP_NAME environment variable is required.');
  process.exit(1);
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function patch(filePath, transform) {
  const original = fs.readFileSync(filePath, 'utf8');
  const result = transform(original);
  if (result !== original) {
    fs.writeFileSync(filePath, result);
    console.log(`✅  Patched: ${filePath}`);
  } else {
    console.log(`⏭   Already patched or pattern not found: ${filePath}`);
  }
}

// ─── iOS: Info.plist ─────────────────────────────────────────────────────────

patch(
  path.join(__dirname, '..', 'ios', APP_NAME, 'Info.plist'),
  (src) => {
    if (src.includes('CodePushServerURL')) return src;
    return src.replace(
      '</dict>\n</plist>',
      `\t<key>CodePushServerURL</key>\n\t<string>${SERVER_URL}</string>\n` +
      `\t<key>CodePushDeploymentKey</key>\n\t<string>${IOS_KEY}</string>\n` +
      `</dict>\n</plist>`
    );
  }
);

// ─── iOS: AppDelegate (.swift, .mm, or .m) ───────────────────────────────────
// expo prebuild generates AppDelegate.mm (Objective-C++) by default for most
// React Native versions. Swift is used in some RN 0.71+ templates. We detect
// whichever file exists rather than assuming an extension.

const iosDelegateDir = path.join(__dirname, '..', 'ios', APP_NAME);
const delegateCandidates = ['AppDelegate.swift', 'AppDelegate.mm', 'AppDelegate.m'];
const delegateEntry = delegateCandidates
  .map((f) => ({ file: f, full: path.join(iosDelegateDir, f) }))
  .find(({ full }) => fs.existsSync(full));

if (!delegateEntry) {
  console.error(`❌  Could not locate AppDelegate in ios/${APP_NAME}/ (tried .swift, .mm, .m)`);
  process.exit(1);
}

patch(delegateEntry.full, (src) => {
  let out = src;

  if (delegateEntry.file.endsWith('.swift')) {
    // Swift
    if (!out.includes('import CodePush')) {
      out = out.replace(/^(import \S+)$/m, '$1\nimport CodePush');
    }
    out = out.replace(
      /Bundle\.main\.url\(\s*forResource:\s*"main",\s*withExtension:\s*"jsbundle"\s*\)/g,
      'CodePush.bundleURL()'
    );
  } else {
    // Objective-C / Objective-C++ (.mm or .m)
    if (!out.includes('#import <CodePush/CodePush.h>')) {
      out = out.replace(
        /#import "AppDelegate\.h"/,
        '#import "AppDelegate.h"\n#import <CodePush/CodePush.h>'
      );
    }
    out = out.replace(
      /\[\[NSBundle mainBundle\] URLForResource:@"main" withExtension:@"jsbundle"\]/g,
      '[CodePush bundleURL]'
    );
  }

  return out;
});

// ─── Android: strings.xml ────────────────────────────────────────────────────

patch(
  path.join(
    __dirname, '..', 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml'
  ),
  (src) => {
    if (src.includes('CodePushServerUrl')) return src;
    return src.replace(
      '</resources>',
      `    <string name="CodePushServerUrl">${SERVER_URL}</string>\n` +
      `    <string name="CodePushDeploymentKey">${ANDROID_KEY}</string>\n` +
      `</resources>`
    );
  }
);

// ─── Android: build.gradle ───────────────────────────────────────────────────

patch(
  path.join(__dirname, '..', 'android', 'app', 'build.gradle'),
  (src) => {
    const line =
      'apply from: "../../node_modules/' +
      '@code-push-next/react-native-code-push/android/codepush.gradle"';
    return src.includes('codepush.gradle') ? src : `${src}\n${line}\n`;
  }
);

// ─── Android: MainApplication.kt ─────────────────────────────────────────────
// Supports both RN < 0.82 (getJSBundleFile) and RN ≥ 0.82 (getDefaultReactHost)

const mainAppGlob = path.join(
  __dirname, '..', 'android', 'app', 'src', 'main', 'java'
);

function findFile(dir, name) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findFile(full, name);
      if (found) return found;
    } else if (entry.name === name) {
      return full;
    }
  }
  return null;
}

const mainAppPath = findFile(mainAppGlob, 'MainApplication.kt');
if (!mainAppPath) {
  console.error('❌  Could not locate MainApplication.kt');
  process.exit(1);
}

patch(mainAppPath, (src) => {
  let out = src;

  if (!out.includes('com.microsoft.codepush.react.CodePush')) {
    out = out.replace(
      /(import com\.facebook\.react\.ReactApplication)/,
      '$1\nimport com.microsoft.codepush.react.CodePush'
    );
  }

  if (!out.includes('CodePush.getJSBundleFile()')) {
    if (out.includes('getDefaultReactHost')) {
      // RN ≥ 0.82 — target the function call broadly; do not rely on
      // named-argument ordering, which may vary across RN template versions.
      const patched = out.replace(
        /(getDefaultReactHost\s*\([^)]+)\)/,
        '$1,\n            jsBundleFilePath = CodePush.getJSBundleFile()\n        )'
      );
      if (patched === out) {
        console.warn(
          '⚠️  Could not inject jsBundleFilePath into getDefaultReactHost(). ' +
          'Verify MainApplication.kt manually — the template structure may differ ' +
          'in your React Native version.'
        );
      }
      out = patched;
    } else {
      // RN < 0.82
      out = out.replace(
        /object\s*:\s*DefaultReactNativeHost\(this\)\s*\{/,
        'object : DefaultReactNativeHost(this) {\n' +
        '            override fun getJSBundleFile(): String = CodePush.getJSBundleFile()\n'
      );
    }
  }

  return out;
});

console.log('\nCodePush injection complete.');
{{< /highlight >}}

#### 2. Add prebuild and injection steps to `codemagic.yaml`

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  your-workflow:
    environment:
      vars:
        APP_NAME: MyApp
        CODEPUSH_IOS_KEY: $CODEPUSH_IOS_STAGING_KEY
        CODEPUSH_ANDROID_KEY: $CODEPUSH_ANDROID_STAGING_KEY
    scripts:
      - name: Run Expo prebuild
        script: npx expo prebuild --clean

      - name: Inject CodePush native configuration
        script: node scripts/inject-codepush.js

      # … your existing iOS / Android build steps follow
{{< /highlight >}}

Store `CODEPUSH_IOS_STAGING_KEY`, `CODEPUSH_ANDROID_STAGING_KEY` (and any
Production equivalents) as **secure environment variables** in Codemagic project
settings. Use different variable values per workflow to ensure the correct
deployment key is injected for each environment.

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
- name: Release CodePush update to Staging
  env:
    CODEPUSH_TOKEN: ${{ secrets.CODEPUSH_TOKEN }}
  run: |
    npx @codemagic/code-push-cli login "https://codepush.pro" --accessKey $CODEPUSH_TOKEN
    npx @codemagic/code-push-cli release-react MyApp-iOS ios --deployment-name Staging
    npx @codemagic/code-push-cli release-react MyApp-Android android --deployment-name Staging
{{< /highlight >}}

---

## Step 11 — Adopt the Staging → Production promotion workflow

The recommended CodePush release workflow mirrors the EAS Update concept of channels but adds an explicit promotion step:

{{< mermaid >}}
graph LR
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
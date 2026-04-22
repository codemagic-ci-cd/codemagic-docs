---
title: Issues and debugging
description: Troubleshooting and common failure modes
meta_title: 'Debug CodePush OTA Updates: Common Issues and Fixes'
meta_description: Troubleshoot CodePush OTA updates, including common errors, CLI debugging, device logs, SDK integration issues, and rollout pitfalls.
weight: 7
---

This section covers tools and techniques for diagnosing problems with OTA updates.

When an update does not install or behaves unexpectedly, the issue is usually caused by one of the following:

- a native binary without the CodePush SDK (first-time rollout)
- a configuration mismatch
- a version targeting problem
- an SDK integration issue
- a build or bundle error

The tools below help identify where the failure occurs.

---

## Debugging OTA updates

CodePush provides several ways to inspect and diagnose OTA (over-the-air) update behavior on a device.

Effective debugging typically combines:

* CLI debugging tools
* Device logs
* Release metadata (CLI inspection)
* Error monitoring tools (via source maps)

Understanding how to use these together is key to quickly identifying where an issue occurs.

### CLI debugging tools

The CodePush CLI includes a debug command that streams logs from a connected device.

Example for Android:

{{< highlight bash "style=paraiso-dark">}}
code-push debug android
{{< /highlight >}}

This command uses Android Debug Bridge (adb logcat) to stream logs and automatically filters CodePush-related messages.

Requirements (Android):

- Android device connected
- Android Debug Bridge (`adb`) installed
- only one connected device

Logs are filtered using the prefix: **[CodePush]**


This helps isolate messages related to the update process.

Typical log messages include:

* Checking for updates
* Update found / not found
* Download progress
* Installation status
* Restart triggers
* Rollback detection

For iOS, logs are collected from the simulator.

Requirements:

- macOS
- iOS simulator running

Physical iOS devices are not supported by the CLI debug command.

### Inspecting device logs

Even without the CLI debug command, OTA behaviour can be inspected through standard logging tools.

Useful tools include:

- `adb logcat` for Android
- Xcode console logs for iOS

Filter logs using:

{{< highlight bash "style=paraiso-dark">}}
[CodePush]
{{< /highlight >}}

You can trace the full update lifecycle through logs:

{{< highlight text "style=paraiso-dark">}}
check for update
download bundle
install update
restart application
{{< /highlight>}}

If an update fails, the logs usually contain the reason.

### Source maps for error monitoring tools

When CodePush releases a new JavaScript bundle, the bundle is compiled and minified.

Error monitoring tools such as:

- Sentry
- Datadog

use **source maps** to translate stack traces back to the original source code.

Because each OTA update generates a new bundle, the corresponding source maps should also be uploaded to the monitoring tool.

If source maps are not uploaded:

- stack traces may reference compiled bundle code
- debugging production errors becomes much more difficult

Most monitoring platforms provide documentation for integrating CodePush releases into their source map upload process.

## Common update failures

The following issues are common when releasing CodePush updates.

### Native binary without the CodePush SDK

OTA updates only install on native builds that already contain the CodePush SDK. If the SDK was recently added to the project but the store binary users have installed predates that change, `release-react` will publish successfully and the update will appear in the deployment history, but **no client will pick it up** — there is nothing on the device to check the server.

Symptoms:

- Release shows in `code-push deployment history <APP> <DEPLOYMENT>` with active installs staying at zero.
- No `[CodePush]` log entries appear on device when you open the app, even with good network connectivity.
- The issue affects all users, not a subset.

Fix:

1. Confirm the SDK is wired up in the React Native project (see [Setup](/rn-codepush/setup/#add-codepush-to-a-react-native-app)).
2. Rebuild the app so the native binary includes the SDK, and install that build on the devices that should receive updates:
   - **Staging:** a fresh dev or internal-distribution build on your test devices is enough; no store release needed.
   - **Production:** publish to the App Store / Google Play and wait for users to update.
3. Subsequent `release-react` calls against the matching deployment will then reach those devices over the air.

This is a one-time gate per deployment when first adopting CodePush; after devices are on an SDK-enabled binary, the regular OTA flow applies. See [Concepts](/rn-codepush/concepts/#prerequisite-a-native-build-with-the-sdk) for the underlying reason.

### Wrong binary version targeting

Updates are only installed if the device's app version satisfies the `targetBinaryVersion` constraint.

Example targeting:

{{< highlight bash "style=paraiso-dark">}}
--targetBinaryVersion "1.2.x"
{{< /highlight >}}

If the installed app version does not match the specified range, the update will not be delivered.

A common mistake is forgetting to update the target version after releasing a new app store build.



### Running the CLI outside the project directory

The `release-react` command expects to run inside the root of a React Native project.

Required files include:

- `package.json`
- React Native project structure

If the command is executed from another directory, the bundle generation step may fail.

### Incorrect deployment key

If the deployment key embedded in the mobile app does not match the intended deployment, the app will check the wrong update channel.

Common scenarios include:

- development builds using the Production key
- production builds using the Staging key
- incorrect key in environment configuration

This can cause updates to appear missing or install unexpectedly.

### Missing or invalid version metadata

The CodePush CLI attempts to automatically detect the app version.

On Android, this is usually read from:

{{< highlight text "style=paraiso-dark">}}
build.gradle → versionName
{{< /highlight >}}

On iOS, it is read from:

{{< highlight text "style=paraiso-dark">}}
Info.plist → CFBundleShortVersionString
{{< /highlight >}}

If these values are missing or not valid semantic versions, the release command may fail.

In this case the version can be specified manually with the `targetBinaryVersion` option.

### Missing `notifyAppReady` after a manual update flow

If your app **installs an OTA update without** going through the default **`sync()` on startup** path (for example you use **`checkForUpdate`**, then download and **`install()`** yourself), you must call **`notifyAppReady()`** once the new JavaScript bundle has started successfully.

If **`notifyAppReady`** never runs, CodePush assumes the update **crashed or failed to boot**. On the **next** app restart the runtime can **roll the app back** to the previous bundle so users are not stuck on a broken release. In practice this looks like “the update installed, then disappeared” or “we keep reverting to the old JS,” which is a frequent source of confusion.

The method is also available as **`notifyApplicationReady`** (legacy alias).

When you use **`codePush.sync()`** in the usual way—for example wrapping the root component so **`sync`** runs on launch—the client **calls `notifyAppReady` for you** after a successful check path. You only need to think about this when you implement a **custom** update pipeline.

For more on **`sync`** and related APIs, see [Advanced: sync options](/rn-codepush/advanced-sync-options/). For **`notifyAppReady`** and other client APIs, use [`@code-push-next/react-native-code-push`](https://www.npmjs.com/package/@code-push-next/react-native-code-push) (README and TypeScript types) as the source of truth.

## When to investigate further

If updates still do not install after verifying configuration, the following checks can help narrow the issue:

- confirm the device can reach the CodePush server
- verify the update appears in the deployment history
- confirm the deployment key matches the expected environment
- inspect device logs for update installation errors

These checks usually identify where the update pipeline is failing.

If you need to review the release process, see [Releasing updates](/rn-codepush/releasing-updates/). For installation metrics and failure counts, see [Analytics](/rn-codepush/analytics/).

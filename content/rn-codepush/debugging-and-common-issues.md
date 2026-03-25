---
title: Issues and debugging
description: Troubleshooting and common failure modes
meta_title: 'Debug CodePush OTA Updates: Common Issues and Fixes'
meta_description: Troubleshoot CodePush OTA updates, including common errors, CLI debugging, device logs, SDK integration issues, and rollout pitfalls.
weight: 7
---

This section covers tools and techniques for diagnosing problems with OTA updates.

When an update does not install or behaves unexpectedly, the issue is usually caused by one of the following:

- a configuration mismatch
- a version targeting problem
- an SDK integration issue
- a build or bundle error

The tools below help identify where the failure occurs.

---

# Debugging OTA updates

CodePush provides several ways to inspect update behaviour on a device.

These include CLI debug tools and device logs.

## CLI debugging tools

The CodePush CLI includes a debug command that streams logs from a connected device.

Example for Android:

```
code-push debug android
```

This command reads logs using `adb logcat`.

Requirements:

- Android device connected
- Android Debug Bridge (`adb`) installed
- only one connected device

Logs are filtered using the prefix:

```
[CodePush]
```

This helps isolate messages related to the update process.

Typical log messages include:

- update check results
- bundle download status
- installation results
- rollback events

For iOS, logs are collected from the simulator.

Requirements:

- macOS
- iOS simulator running

Physical iOS devices are not supported by the CLI debug command.

## Inspecting device logs

Even without the CLI debug command, OTA behaviour can be inspected through normal device logs.

Useful tools include:

- `adb logcat` for Android
- Xcode console logs for iOS

Filter logs using:

```
[CodePush]
```

These messages show each stage of the update process:

```
check for update
download bundle
install update
restart application
```

If an update fails, the logs usually contain the reason.

## Source maps for error monitoring tools

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

#### Wrong binary version targeting

Updates are only installed if the device's app version satisfies the `targetBinaryVersion` constraint.

Example targeting:

```
--targetBinaryVersion "1.2.x"
```

If the installed app version does not match the specified range, the update will not be delivered.

A common mistake is forgetting to update the target version after releasing a new app store build.



#### Running the CLI outside the project directory

The `release-react` command expects to run inside the root of a React Native project.

Required files include:

- `package.json`
- React Native project structure

If the command is executed from another directory, the bundle generation step may fail.

#### Incorrect deployment key

If the deployment key embedded in the mobile app does not match the intended deployment, the app will check the wrong update channel.

Common scenarios include:

- development builds using the Production key
- production builds using the Staging key
- incorrect key in environment configuration

This can cause updates to appear missing or install unexpectedly.

#### Missing or invalid version metadata

The CodePush CLI attempts to automatically detect the app version.

On Android this is usually read from:

```
build.gradle → versionName
```

On iOS it is read from:

```
Info.plist → CFBundleShortVersionString
```

If these values are missing or not valid semantic versions, the release command may fail.

In this case the version can be specified manually with the `targetBinaryVersion` option.

#### Missing `notifyAppReady` after a manual update flow

If your app **installs an OTA update without** going through the default **`sync()` on startup** path (for example you use **`checkForUpdate`**, then download and **`install()`** yourself), you must call **`notifyAppReady()`** once the new JavaScript bundle has started successfully.

If **`notifyAppReady`** never runs, CodePush assumes the update **crashed or failed to boot**. On the **next** app restart the runtime can **roll the app back** to the previous bundle so users are not stuck on a broken release. In practice this looks like “the update installed, then disappeared” or “we keep reverting to the old JS,” which is a frequent source of confusion.

The method is also available as **`notifyApplicationReady`** (legacy alias).

When you use **`codePush.sync()`** in the usual way—for example wrapping the root component so **`sync`** runs on launch—the client **calls `notifyAppReady` for you** after a successful check path. You only need to think about this when you implement a **custom** update pipeline.

For more on **`sync`** and related APIs, see [Advanced: sync options](/rn-codepush/advanced-sync-options/). The upstream React Native CodePush docs describe **`notifyAppReady`** in the [JavaScript API reference](https://github.com/microsoft/react-native-code-push/blob/master/docs/api-js.md).

## When to investigate further

If updates still do not install after verifying configuration, the following checks can help narrow the issue:

- confirm the device can reach the CodePush server
- verify the update appears in the deployment history
- confirm the deployment key matches the expected environment
- inspect device logs for update installation errors

These checks usually identify where the update pipeline is failing.

If you need to review the release process, see [Releasing updates](/rn-codepush/releasing-updates/). For installation metrics and failure counts, see [Analytics](/rn-codepush/analytics/).

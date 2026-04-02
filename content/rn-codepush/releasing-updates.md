---
title: Releasing updates
description: Publish and promote CodePush updates
meta_title: Release and Promote CodePush OTA Bundle Updates to Users
meta_description: Publish and promote CodePush OTA updates, including staging and production deployments, release metadata, descriptions, and CLI workflows.
weight: 3
---

This page explains how to publish OTA updates with the **CodePush CLI**. Bundles are not uploaded or promoted from the Codemagic UI; creating and changing releases is done with CLI commands (locally, in CI, or on any machine with the CLI and an access key).

For a compact list of commands and flags, see [CLI quick reference](/rn-codepush/cli-quick-reference/).

After the SDK is integrated into the React Native app, updates can be released without rebuilding the native application. CodePush distributes new JavaScript bundles and assets to installed apps.

A typical workflow uses two deployments:

```
Staging
Production
```

Updates are first released to **Staging**, tested internally, and then promoted to **Production**.

```
release update → Staging
test internally
promote update → Production
```

## Publishing to Staging

The most common way to publish an update is with the `release-react` command.

Example:

```
code-push release-react MyApp-Android android
```

For iOS:

```
code-push release-react MyApp-iOS ios
```

The command performs several steps automatically:

```
react-native bundle
→ generate JavaScript bundle
→ collect static assets
→ package update
→ upload bundle to CodePush server
```

The update is then assigned to the selected deployment. If no deployment is specified, the CLI usually defaults to **Staging**.

## What gets uploaded

CodePush distributes only runtime JavaScript assets. Typical package contents include:

- JavaScript bundle
- images and static assets
- metadata about the release

CodePush does **not** distribute mobile app binaries such as `.apk` or `.ipa` files. OTA updates only replace the JavaScript layer of the app. Changes that require native code modifications must still be released through the app stores.

When possible, the CodePush client downloads only the changed files, so end users receive smaller differential updates without any extra configuration.

## Targeting specific app versions

Updates must be compatible with the installed app version. The `targetBinaryVersion` parameter controls which app versions receive the update.

Example:

```
code-push release-react MyApp-Android android --targetBinaryVersion "1.2.x"
```

Supported version formats include:

```
1.2.x
=1.2.3 <1.3.0
```

Devices install the update only if their binary version satisfies the specified version range.

## Verifying the Staging release

After releasing an update to **Staging**, install a build configured with the Staging deployment key.

Typical verification process:

1. install the staging build on a device
2. launch the app
3. confirm the update downloads and installs
4. restart the app to apply the update

If the update installs successfully, the OTA pipeline is working correctly. Testing with a staging deployment helps ensure production users are not exposed to broken updates.

## Promoting an update to Production

Once an update has been validated in Staging, it can be promoted to the Production deployment.

Example:

```
code-push promote MyApp-Android Staging Production
```

Promotion copies the existing release from one deployment to another without rebuilding the bundle.

```
Staging release created
→ internal testing
→ promote to Production
```

This ensures that the same tested bundle is deployed to end users.

## Monitoring releases

Each release recorded by CodePush includes telemetry metrics such as:

- active installations
- downloads
- successful installs
- failures
- rollbacks

These metrics help teams monitor update adoption and detect issues with newly deployed bundles.

## Next steps

After the first release workflow is working, teams typically add additional controls to manage production updates.

The next section covers:

- staged rollouts
- version targeting strategies
- rollbacks
- update safety mechanisms

For rollout monitoring and release analytics, see [Analytics](/rn-codepush/analytics/). For troubleshooting failed installs, see [Debugging and common issues](/rn-codepush/debugging-and-common-issues/). For commands only, see [CLI quick reference](/rn-codepush/cli-quick-reference/).

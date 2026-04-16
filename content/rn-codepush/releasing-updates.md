---
title: Releasing updates
description: Publish and promote CodePush updates
meta_title: Release and Promote CodePush OTA Bundle Updates to Users
meta_description: Publish and promote CodePush OTA updates, including staging and production deployments, release metadata, descriptions, and CLI workflows.
weight: 3
---


This guide explains how to publish and manage over-the-air (OTA) updates using the CodePush CLI.


{{<notebox>}} 
**Important**:
CodePush updates are not managed through the Codemagic UI. All releases, promotions, and rollbacks are performed using CLI commands — locally, in CI/CD pipelines, or any environment with the CLI installed and authenticated.
{{</notebox>}}

## Overview

After integrating the CodePush SDK into your React Native app as explained in the [previous sectio](http://localhost:1313/rn-codepush/setup/#add-codepush-to-a-react-native-app)n, you can ship updates without rebuilding or resubmitting your app to the App Store or Google Play.

CodePush delivers:
* Updated JavaScript bundles
* App assets (e.g. images, fonts)

These updates are downloaded silently by users’ devices (depending on your install mode).

## Recommended Workflow

Use a **Staging → Production** promotion flow for all releases. This ensures every update is tested before reaching end users and keeps production stable.

**Step 1: Release to Staging**

Publish the update to the Staging deployment first. This makes it available only to internal users, QA, or testers.

{{< highlight bash "style=paraiso-dark">}}
code-push release-react <app-name> <platform> --deployment-name Staging
{{< /highlight>}}

At this stage:

* The update is not visible to production users
* You can safely validate functionality and stability
* Multiple iterations can be released without impact

**Step 2: Validate in Staging**

Test the update thoroughly before promoting it. Typical checks include:

* App launch and navigation flow
* New features and UI changes
* Regression testing of existing functionality
* Crash-free behavior on target devices
* Compatibility with supported app versions

Only proceed once the update is confirmed stable.

**Step 3: Promote to Production**

After successful validation, promote the exact same update from Staging to Production. No rebuild is required.
{{< highlight bash "style=paraiso-dark">}}
code-push promote <app-name> Staging Production
{{< /highlight >}}

This ensures:

* The tested build is what users receive
* No discrepancies between test and production releases
* Faster and safer rollout to all users

**Summary Flow:**

{{< highlight bash "style=paraiso-dark">}}
Release to Staging -> Internal Testing & QA -> Promote to Production
{{< /highlight >}}

Think of this as a single pipeline with two decision points:

* Release → Staging: publish a new update for validation
* Test: verify the update is safe to ship
* Promote → Production: make it live for users


## What gets uploaded

CodePush delivers only JavaScript runtime assets and the files required by the application’s JS layer.

A typical update includes only changed files and assets, such as:

* JavaScript bundle
* Static assets (images, fonts, etc.)
* Release metadata (deployment and version information)

CodePush does not include native binaries such as **.apk** or **.ipa** files. OTA updates are limited to changes in the JavaScript layer only.

Any modification involving native code (e.g. Swift, Objective-C, Java, Kotlin, or native modules) must be released through the App Store or Google Play.

### Delta updates

CodePush uses delta updates (file-level diffs) for each release and delivers only the files or assets that changed.

This means users download a lightweight delta package instead of the full JavaScript bundle and all assets every time, resulting in faster updates and smaller downloads for users.

## Version control

CodePush uses a two-layer versioning model that separates native app versions from JavaScript update versions. This ensures updates are only delivered to compatible app binaries while still allowing fast OTA iteration.

**1. Native App Version (Binary Version)**

This is the version of the app installed from the App Store / Google Play. It defines the native code baseline that a CodePush update must be compatible with.

It maps to **CFBundleShortVersionString (e.g. 1.2.0)(for iOS)** and **versionName (e.g. 1.2.0)(for Android)**

This is the version you configure in CodePush as the target binary version.

**2. CodePush Update Version**

Each CodePush release is a **JavaScript + asset bundle update** applied on top of a native binary. These updates:

* Do not change the native app version
* Are stored and ordered within a deployment history
* Can be rolled back independently of app store releases

**Target Binary Version (Compatibility Control)**

To ensure updates are only delivered to compatible app builds, CodePush uses `--target-binary-version`

This flag determines which native app versions are eligible to receive the update.

It directly matches:

* CFBundleShortVersionString on iOS
* versionName on Android

For an example, if you specify:
{{< highlight bash "style=paraiso-dark">}}
--target-binary-version "1.2.0"
{{< /highlight >}}

Then only apps running version 1.2.0 will receive the update. You can also define ranges:
{{< highlight bash "style=paraiso-dark">}}
--target-binary-version "~1.2.0"
{{< /highlight >}}

This includes compatible patch versions like **1.2.1**, **1.2.2**, etc., depending on semantic versioning rules.



## Next steps

After the first release workflow is working, teams typically add additional controls to manage production updates.

The next section covers:

- staged rollouts
- version targeting strategies
- rollbacks
- update safety mechanisms

For rollout monitoring and release analytics, see [Analytics](/rn-codepush/analytics/). For troubleshooting failed installs, see [Debugging and common issues](/rn-codepush/debugging-and-common-issues/). For commands only, see [CLI quick reference](/rn-codepush/cli-quick-reference/).

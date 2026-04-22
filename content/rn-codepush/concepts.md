---
title: Concepts
description: Core concepts behind CodePush and OTA updates
meta_title: CodePush OTA update model, deployments, and lifecycle
meta_description: Learn how CodePush OTA updates work, including bundles versus store releases, deployment channels, and the end-to-end update lifecycle.
weight: 1
---

This section explains how CodePush works at a conceptual level before any setup or commands. Understanding the update model makes the configuration and release workflow easier to follow.

---

### The Problem: Slow App Store Updates

By default, shipping a mobile app update looks like this:

{{< highlight text "style=paraiso-dark">}}
Developer makes a change
→ Build a new app binary
→ Submit to App Store / Play Store
→ Wait for review
→ Users download the update
{{< /highlight >}}

This process is slow and rigid:

* Reviews can take hours or days
* Urgent fixes are delayed
* Users must manually update

### The Idea: Over-the-Air (OTA) Updates with CodePush

CodePush enables OTA updates for React Native apps. Instead of distributing a new binary, the app downloads an updated JavaScript bundle from a server:

{{< highlight text "style=paraiso-dark">}}
Developer releases JS update
→ CodePush server stores update
→ App checks server for updates
→ New bundle downloaded
→ Update applied on restart/resume/immediately
{{< /highlight >}}

Typical OTA use cases:

* Hotfixes for production bugs
* UI tweaks or styling updates
* Feature flag changes
* Configuration or content updates
* Experimentation or staged feature rollouts

Benefits: Faster releases, reduced dependency on app store reviews, and quicker fixes for users.


## JavaScript layer vs Native layer

React Native apps contain two layers.

The **Native layer** is the compiled platform code, such as:

- Swift / Objective-C for iOS
- Java / Kotlin for Android

This includes platform integrations, native modules, permissions, OS APIs, and the compiled app binary. Changes to this layer require rebuilding the app and publishing through the app stores.

The **JavaScript layer** contains the React Native application logic:

- UI components
- business logic
- navigation
- state management
- bundled static assets

CodePush updates this **JavaScript bundle and its assets**. As long as JS remains compatible with the already-installed native binary, it can be delivered as an OTA update.

## What can and cannot be updated

✅ Can Be Updated via CodePush (OTA-safe):

* Fixing JavaScript bugs
* UI or layout adjustments
* Styling changes
* Updating bundled images or static assets
* Feature flags or configuration logic
* JavaScript performance improvements

These updates modify only the JavaScript bundle, so they can be safely delivered over the air. 

❌ Require a New App Release

* Adding or modifying native modules
* Upgrading React Native or native dependencies
* Editing native configuration files (build.gradle, Info.plist, etc.)
* Changing app permissions (camera, location, etc.)
* Adding platform-specific features or integrations

 These changes affect compiled native code, so they must go through the App Store or Play Store.

### Delta updates

CodePush uses delta updates (file-level diffs) for each release and delivers only the JavaScript files and assets that changed.

Instead of redownloading a complete bundle and all static assets on every update, users receive a smaller delta package. This keeps OTA updates faster and reduces bandwidth usage.

## How the update flow works

A CodePush-enabled app includes a client SDK that communicates with the update server:

{{< highlight text "style=paraiso-dark">}}
app launch
* CodePush SDK checks for updates (based on configuration)
* update available?
* download JavaScript bundle + assets
* store update locally
* apply update (typically on next restart)
{{< /highlight >}}

The update replaces the previously installed JavaScript bundle while keeping the native application unchanged.

If an update fails or causes the app to crash on startup before it is marked as successful, the client can automatically revert to the previous working bundle.

### Prerequisite: a native build with the SDK

Because CodePush relies on the client SDK to check the server, download bundles, and swap the JS layer at launch, **the SDK must already be present in the native binary running on each user's device**. A store build that does not include the SDK cannot install OTA updates — `release-react` will still publish the bundle, but no client will pick it up.

The first time you add CodePush to an existing app, you therefore need to:

1. Integrate the SDK in your React Native project (see [Setup](/rn-codepush/setup/)).
2. Produce a native build that includes the SDK and the deployment key you want to target.
3. Install that build on the devices you expect to receive updates — local dev machines or QA devices for **Staging**, App Store / Google Play for **Production**.
4. Only then start shipping JS changes to that deployment as OTA updates.

For Staging validation this usually just means running a fresh debug build on a test device; no store release is required. For Production, end users must actually update to the new store binary before they can receive anything CodePush publishes.

After that, the usual pattern — occasional native releases for native changes, OTA releases for everything else — applies.

## Deployment model

CodePush organizes updates using **apps** and **deployments**.

Each mobile application registered with CodePush is called an **app**. A project may contain multiple apps, such as:

- `MyApp-Android`
- `MyApp-iOS`

Separating apps by platform is recommended because React Native bundles differ between platforms.

Each app contains one or more **deployments**. Deployments represent release channels. Default deployments include **Staging** and **Production**.

{{< highlight text "style=paraiso-dark">}}
release update → Staging
internal testing
promote update → Production
{{< /highlight >}}

This workflow lets teams validate OTA updates before exposing them to all users. Creating, promoting, and changing those releases is done with the **CodePush CLI**, not from a web upload UI—see [Releasing updates](/rn-codepush/releasing-updates/).

### Deployment keys

Each deployment has a **deployment key**. The deployment key is embedded in the mobile app and tells the CodePush SDK which deployment to check for updates.

Example usage:

- development builds use the **Staging** key
- production builds use the **Production** key

This separation ensures test updates do not reach production users.

## Where CodePush fits in the release process

Traditional mobile release:

{{< highlight text "style=paraiso-dark">}}
commit
→ CI build
→ store submission
→ user installs update
{{< /highlight>}}

Release workflow with CodePush:

{{< highlight text "style=paraiso-dark">}}
commit
→ CI build
→ store release (initial binary)
→ OTA updates via CodePush
→ occasional store releases for native changes
{{< /highlight >}}

This lets teams ship small fixes and improvements between full app store releases.

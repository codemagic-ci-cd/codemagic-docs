---
title: Concepts
description: Core concepts behind CodePush and OTA updates
weight: 1
---

This section explains how CodePush works at a conceptual level before any setup or commands. Understanding the update model makes the configuration and release workflow easier to follow.

## OTA updates with CodePush

Mobile apps are normally updated through the app stores:

```
developer commits change
→ CI builds new binary
→ binary submitted to App Store / Play Store
→ store review
→ users download update
```

This process can take hours or days and requires users to install a new app version.

CodePush enables **over-the-air (OTA) updates** for React Native applications. Instead of distributing a new binary, the app downloads an updated JavaScript bundle from a server.

```
developer releases JS update
→ CodePush server stores update
→ app checks server for updates
→ new bundle downloaded
→ update applied on restart
```

Typical OTA use cases include:

- hotfixes for production bugs
- small UI changes
- feature flag changes
- configuration updates
- content changes
- experimentation or staged feature releases

OTA updates reduce release latency and allow teams to fix issues quickly without waiting for store approval.

## JavaScript layer vs native layer

React Native apps contain two layers.

The native layer is the compiled platform code, such as:

- Swift / Objective-C for iOS
- Java / Kotlin for Android

This includes platform integrations, native modules, permissions, OS APIs, and the compiled app binary. Changes to this layer require rebuilding the app and publishing through the app stores.

The JavaScript layer contains the React Native application logic:

- UI components
- business logic
- navigation
- state management
- bundled static assets

CodePush updates this **JavaScript bundle and its assets**. As long as a change only affects the JavaScript layer, it can usually be delivered as an OTA update.

## What can and cannot be updated

Typical OTA-safe changes include:

- fixing JavaScript bugs
- UI adjustments
- styling changes
- updating bundled images or assets
- feature flag logic
- JavaScript performance improvements

These changes modify only the JavaScript bundle.

Some changes require rebuilding the native app, such as:

- adding or modifying native modules
- upgrading native dependencies
- modifying `build.gradle`, `Info.plist`, or other native configuration
- changing OS permissions
- adding platform-specific functionality

These changes affect the compiled native code and cannot be distributed through CodePush. In these cases, a new binary must be built and released through the app stores.

## How the update flow works

A CodePush-enabled app includes a client SDK that communicates with the update server:

```
app launch
→ CodePush SDK checks server
→ update available?
→ download JavaScript bundle
→ store update locally
→ apply update on next restart
```

The update replaces the previously installed JavaScript bundle while keeping the native application unchanged. If an update fails or causes the app to crash on startup, the client can automatically revert to the previous working bundle.

## Deployment model

CodePush organizes updates using **apps** and **deployments**.

Each mobile application registered with CodePush is called an **app**. A project may contain multiple apps, such as:

- `MyApp-Android`
- `MyApp-iOS`

Separating apps by platform is recommended because React Native bundles differ between platforms.

Each app contains one or more **deployments**. Deployments represent release channels. Default deployments include **Staging** and **Production**.

```
release update → Staging
internal testing
promote update → Production
```

This workflow lets teams validate OTA updates before exposing them to all users.

### Deployment keys

Each deployment has a **deployment key**. The deployment key is embedded in the mobile app and tells the CodePush SDK which deployment to check for updates.

Example usage:

- development builds use the **Staging** key
- production builds use the **Production** key

This separation ensures test updates do not reach production users.

## Where CodePush fits in the release process

Traditional mobile release:

```
commit
→ CI build
→ store submission
→ user installs update
```

Release workflow with CodePush:

```
commit
→ CI build
→ store release (initial binary)
→ OTA updates via CodePush
→ occasional store releases for native changes
```

This lets teams ship small fixes and improvements between full app store releases.

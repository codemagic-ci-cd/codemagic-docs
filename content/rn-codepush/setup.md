---
title: Setup
description: Get CodePush running with Codemagic and React Native
meta_title: Set Up CodePush for React Native Apps and the CodePush CLI
meta_description: Set up CodePush for React Native, including projects, CLI authentication, deployment keys, app configuration, and deployment channels.
weight: 2
aliases:
  - /rn-codepush/codepush-integration/
---

This section prepares a project to use CodePush with Codemagic. After completing these steps you will have:

- a CodePush project created on the Codemagic server
- the CLI installed and authenticated
- a React Native app configured to receive OTA updates

Codemagic hosts the CodePush server and developers interact with it using access tokens and the CodePush CLI.

These instructions are for React Native New Architecture projects. If your app is already configured, skip to the deployment key and CI sections to verify configuration.

The same Codemagic server can be used for all of your apps.

## Setup CodePush with Codemagic

Before integrating CodePush into your app, you need to create a project on the Codemagic CodePush server and configure the CLI.

### Create a CodePush project

Each mobile application using CodePush must be registered on the server.

In most cases you should create **separate apps for each platform**, for example:

```
MyApp-Android
MyApp-iOS
```

React Native bundles differ between platforms, so separating them avoids installation issues.

Create an app using the CLI:

```
code-push app add MyApp-Android
```

For iOS:

```
code-push app add MyApp-iOS
```

When an app is created, CodePush automatically creates two deployments:

```
Staging
Production
```

These deployments act as release channels for OTA updates.

### Get an access token

The CodePush CLI authenticates using access tokens generated in the Codemagic UI.

Generate a token and log in from the CLI:

```
code-push login "https://codepush.pro"
```

Paste the token when prompted. Once authenticated, the CLI can create apps, manage deployments, and publish updates.

If you do not have access to the Codemagic UI, request an access key from the Codemagic team.

### Install and configure the CLI

Install the CodePush CLI globally:

```
npm install -g @codemagic/code-push-cli
```

Verify the installation:

```
code-push --version
```

You can confirm that authentication and configuration are working by listing your apps:

```
code-push app list
```

## Add CodePush to a React Native app

Once the server and CLI are configured, the next step is integrating the CodePush client SDK into your React Native application.

The SDK allows the app to:

- check the CodePush server for updates
- download new JavaScript bundles
- install updates on restart

### Install the SDK

Install the React Native CodePush package:

```
npm install @code-push-next/react-native-code-push
```

or

```
yarn add @code-push-next/react-native-code-push
```

The SDK provides the runtime logic that checks for updates and applies new bundles.

### Configure deployment keys

Each CodePush deployment has a **deployment key**.

You can list deployments and keys using:

```
code-push deployment list MyApp-Android -k
```

Example output:

```
Name       Key
Staging    <deployment-key>
Production <deployment-key>
```

Deployment keys are embedded in the mobile app so it knows which deployment to check for updates.

Typical configuration:

- development builds use the **Staging** deployment key
- production builds use the **Production** deployment key

This prevents test updates from reaching production users.

### Configure staging and production builds

Most teams configure different deployment keys for different build types.

```
development build uses Staging deployment
production build uses Production deployment
```

This allows internal testers to validate updates before they reach users.

Deployment keys are typically set in platform configuration files or environment variables during the build process.

### Configure server URL and deployment keys in native projects

Make sure the Codemagic server URL is set in your app. For the hosted service, use:

```
https://codepush.pro/
```

Add the server URL and deployment key to the native configuration files.

For iOS (`Info.plist`):

```
<key>CodePushServerURL</key>
<string>https://codepush.pro/</string>
<key>CodePushDeploymentKey</key>
<string>YOUR_DEPLOYMENT_KEY</string>
```

For Android (`strings.xml`):

```
<string moduleConfig="true" name="CodePushServerUrl">https://codepush.pro/</string>
<string moduleConfig="true" name="CodePushDeploymentKey">YOUR_DEPLOYMENT_KEY</string>
```

### Add CodePush to your root component

Wrap your app entry point with the CodePush plugin:

```
import codePush from '@code-push-next/react-native-code-push';

function App() {
  ...
}

export default codePush(App);
```

## Run a test OTA release

To confirm everything works end-to-end, publish a quick test release:

```
code-push release-react MyApp-Android android
```

You only need this one command to bundle, upload, and release an OTA update to a deployment.

For the full release workflow, see [Releasing updates](/rn-codepush/releasing-updates/).

## Next steps

After completing setup, use the following sections to continue:

- [Releasing updates](/rn-codepush/releasing-updates/) - publish your first OTA release
- [CLI quick reference](/rn-codepush/cli-quick-reference/) - copy-paste commands for auth, releases, and rollouts
- [CI integration](/rn-codepush/ci-integration/) - automate releases in CI/CD
- [Production control](/rn-codepush/production-control/) - rollouts, rollbacks, and version targeting
- [Security and access](/rn-codepush/security-and-access/) - authentication and signing
- [Debugging and common issues](/rn-codepush/debugging-and-common-issues/) - troubleshooting
- [Advanced: sync options](/rn-codepush/advanced-sync-options/) - customize `sync()`, dialogs, progress, and restart behavior

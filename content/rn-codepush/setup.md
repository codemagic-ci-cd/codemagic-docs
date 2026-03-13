---
title: Setup
description: Get CodePush running with Codemagic and React Native
weight: 2
aliases:
  - /rn-codepush/codepush-integration/
---

This section prepares a project to use CodePush with Codemagic. After completing these steps you will have:

- a CodePush project created on the Codemagic server
- the CLI installed and authenticated
- a React Native app configured to receive OTA updates

Codemagic hosts the CodePush server and developers interact with it using access tokens and the CodePush CLI.

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
code-push app add MyApp-Android android react-native
```

For iOS:

```
code-push app add MyApp-iOS ios react-native
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
code-push login
```

Paste the token when prompted. Once authenticated, the CLI can create apps, manage deployments, and publish updates.

### Install and configure the CLI

Install the CodePush CLI globally:

```
npm install -g @code-push-next/cli
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
code-push deployment list MyApp-Android
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
development build ??? Staging deployment
production build ??? Production deployment
```

This allows internal testers to validate updates before they reach users.

Deployment keys are typically set in platform configuration files or environment variables during the build process.

### Configure update check behaviour

The CodePush SDK allows different update strategies. Common options include:

Check for updates on every app launch:

```
checkFrequency: CodePush.CheckFrequency.ON_APP_START
```

Manual update checks:

```
CodePush.sync()
```

Background updates that install on the next restart are also common.

The appropriate strategy depends on how quickly updates should reach users.

## CI integration

Once the CLI and SDK are configured, OTA updates can be released from a CI pipeline.

This allows updates to be automatically published after a successful build or deployment step.

```
commit
??? CI build
??? run CodePush release command
??? update published
```

### Codemagic YAML example

Example step in a `codemagic.yaml` workflow:

```
scripts:
  - name: Release OTA update
    script: |
      code-push login --accessKey $CODEPUSH_TOKEN
      code-push release-react MyApp-Android android
```

The CI pipeline authenticates with the CodePush server and publishes the update.

### GitHub Actions example

CodePush releases can also be triggered from GitHub Actions.

Example step:

```
- name: Release CodePush update
  run: |
    code-push login --accessKey $CODEPUSH_TOKEN
    code-push release-react MyApp-Android android
```

This allows teams to integrate OTA releases into existing CI/CD workflows.

## Next steps

After completing setup:

- the CodePush server is configured
- the CLI is authenticated
- the React Native app contains the CodePush SDK

You can now publish your first OTA update using the release workflow described in the next section.

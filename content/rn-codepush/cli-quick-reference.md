---
title: CLI quick reference
description: Copy-paste CodePush CLI commands for auth, releases, and rollouts
meta_title: CodePush CLI Commands Quick Reference for React Native
meta_description: CodePush CLI cheat sheet for React Native OTA, including login, apps, deployment keys, release-react, promote, patch, rollback, and device debug.
weight: 9
---

Examples use placeholder app names **`MyApp-Android`** and **`MyApp-iOS`**—replace them with your registered CodePush apps. Platform arguments for `release-react` are **`android`** or **`ios`**.

All bundle uploads and release changes go through the **CLI** (locally or in CI), not the Codemagic UI. For install options and client-side APIs, see [Advanced: sync options](/rn-codepush/advanced-sync-options/).

---

## Install and version

```shell
npm install -g @codemagic/code-push-cli
code-push --version
```

See [Setup](/rn-codepush/setup/) for full installation and server configuration.

---

## Authentication

Interactive login (paste token when prompted):

```shell
code-push login
```

Non-interactive (CI and scripts):

```shell
code-push login --accessKey $CODEPUSH_ACCESS_KEY
```

See [Security and access](/rn-codepush/security-and-access/) for keys and token handling.

---

## Apps and deployments

Register an app (creates **Staging** and **Production** deployments):

```shell
code-push app add MyApp-Android
code-push app add MyApp-iOS
```

List apps:

```shell
code-push app list
```

List deployments and **deployment keys** (`-k`):

```shell
code-push deployment list MyApp-Android -k
```

---

## Publish a React Native bundle (`release-react`)

Default deployment is usually **Staging** if you omit a deployment flag (confirm with `code-push release-react --help` for your CLI version).

**Android**

```shell
code-push release-react MyApp-Android android
```

**iOS**

```shell
code-push release-react MyApp-iOS ios
```

**Common options** (combine as needed):

```shell
code-push release-react MyApp-Android android \
  --targetBinaryVersion "1.2.x" \
  --description "Short release notes" \
  --mandatory \
  --rollout 25
```

| Flag | Purpose |
|------|---------|
| `--targetBinaryVersion` | Limit which store app versions may install the update |
| `--description` | Release notes (for example shown in an in-app update dialog) |
| `--mandatory` | Treat the release as mandatory on supported clients |
| `--rollout <n>` | Deliver to approximately `n` percent of users |

See [Releasing updates](/rn-codepush/releasing-updates/) and [Production control](/rn-codepush/production-control/) for workflows, constraints, and examples.

---

## Promote between deployments

Copy the current release from **Staging** to **Production** without rebuilding:

```shell
code-push promote MyApp-Android Staging Production
```

---

## Change rollout on an existing release (`patch`)

Update rollout percentage without creating a new release:

```shell
code-push patch MyApp-Android Production --rollout 50
```

See [Production control](/rn-codepush/production-control/#rollouts) for rollout rules and limits.

---

## Roll back a deployment

```shell
code-push rollback MyApp-Android Production
```

Restores the previous release for that deployment. See [Production control](/rn-codepush/production-control/#rollbacks).

---

## Device debug logs (Android)

```shell
code-push debug android
```

Requires a connected device, `adb`, and a single Android target. For iOS simulator requirements and log interpretation, see [Issues and debugging](/rn-codepush/debugging-and-common-issues/#cli-debugging-tools).

---

## CI

Run the same commands non-interactively after `code-push login --accessKey …`. See [CI integration](/rn-codepush/ci-integration/) for workflow patterns.

---

## Full flag lists

Run `code-push --help` and `code-push <command> --help` for the authoritative option list for your installed CLI version.

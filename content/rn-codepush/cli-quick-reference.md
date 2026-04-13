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

## Install and version check

{{< highlight bash "style=paraiso-dark">}}
npm install -g @codemagic/code-push-cli
code-push --version
{{< /highlight >}}

See [Setup](/rn-codepush/setup/) for full installation and server configuration.

---

## Authentication

{{< highlight bash "style=paraiso-dark">}}
code-push login "https://codepush.pro" --accessKey $CODEPUSH_ACCESS_KEY
{{< /highlight >}}

See [Security and access](/rn-codepush/security-and-access/) for keys and token handling.

---

## Apps and deployments

Register an app (creates **Staging** and **Production** deployments):

{{< highlight shell "style=paraiso-dark">}}
code-push app add MyApp-Android
code-push app add MyApp-iOS
{{< /highlight>}}


List apps:

{{< highlight shell "style=paraiso-dark">}}
code-push app list
{{< /highlight >}}

List deployments and **deployment keys** (`-k`):

{{< highlight shell "style=paraiso-dark">}}
code-push deployment list MyApp-Android -k
{{< /highlight >}}

---

## Publish a React Native bundle (`release-react`)

Default deployment is usually **Staging** if you omit a deployment flag (confirm with `code-push release-react --help` for your CLI version).

**Android**

{{< highlight shell "style=paraiso-dark">}}
code-push release-react MyApp-Android android
{{< /highlight >}}

**iOS**

{{< highlight shell "style=paraiso-dark">}}
code-push release-react MyApp-iOS ios
{{< /highlight>}}

**Common options** (combine as needed):

{{< highlight shell "style=paraiso-dark">}}
code-push release-react MyApp-Android android -d Production --targetBinaryVersion "1.2.x" --description "Short release notes" --mandatory --rollout 25
{{< /highlight >}}

| Flag | Purpose |
|------|---------|
| `--targetBinaryVersion` | Limit which store app versions may install the update |
| `--description` | Release notes (for example shown in an in-app update dialog) |
| `--mandatory` | Treat the release as mandatory on supported clients |
| `--rollout <n>` | Deliver to approximately `n` percent of users |

See [Releasing updates](/rn-codepush/releasing-updates/) and [Production control](/rn-codepush/production-control/) for workflows, constraints, and examples.

---

## Promote between deployments

Promote an existing release from one deployment to another without rebuilding or creating a new bundle.

{{< highlight shell "style=paraiso-dark">}}
code-push promote MyApp-Android Staging Production
{{< /highlight>}}

Promotion allows you to safely move tested updates between environments without rebuilding or modifying the original release.

---

## Change rollout on an existing release

Update the rollout percentage of an existing release without creating a new one using the `patch` command.

{{< highlight shell "style=paraiso-dark">}}
code-push patch MyApp-Android Production --rollout 50
{{< /highlight >}}

See [Production control](/rn-codepush/production-control/#rollouts) for rollout rules and limits.

---

## Roll back a deployment

To revert a deployment to the previous release, use the rollback command.

{{< highlight shell "style=paraiso-dark">}}
code-push rollback MyApp-Android Production
{{< /highlight>}}

This will deactivate the current release and restore the previously active version for the specified deployment. See [Production control](/rn-codepush/production-control/#rollbacks).

---

## Device debug logs (Android)

{{< highlight shell "style=paraiso-dark">}}
code-push debug android
{{< /highlight >}}

Requires a connected device, `adb`, and a single Android target. For iOS simulator requirements and log interpretation, see [Issues and debugging](/rn-codepush/debugging-and-common-issues/#cli-debugging-tools).

---


## Full flag lists

Run `code-push --help` and `code-push <command> --help` for the authoritative option list for your installed CLI version.

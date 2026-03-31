---
title: Production control
description: Manage rollouts, targeting, and rollback behavior
meta_title: Control CodePush Rollouts, Targeting, and Rollbacks
meta_description: Manage CodePush production releases with rollouts, binary version targeting, mandatory updates, rollback, and staged promotion workflows.
weight: 4
---

After OTA updates are working, the next step is managing how updates reach users in production.

CodePush provides several controls that allow teams to:

- gradually roll out updates
- target specific app versions
- enforce mandatory updates
- recover from faulty releases

These controls help reduce risk when releasing changes to live users.

---

## Rollouts

Rollouts allow an update to be delivered to only a percentage of users.

Instead of immediately deploying an update to everyone, you can gradually increase the rollout percentage as confidence grows.

Example release with a rollout:

```
code-push release-react MyApp-Android android --rollout 25
```

This update will be delivered to approximately **25% of users** running the compatible app version.

Typical rollout process:

```
release update → 10%
monitor behaviour
increase rollout → 25%
increase rollout → 50%
increase rollout → 100%
```

Rollouts can be increased using the `patch` command.

Example:

```
code-push patch MyApp-Android Production --rollout 50
```

This updates the rollout percentage without creating a new release.

### Rollout constraints

There are several limitations to rollouts:

- only **one rollout per deployment** can be active
- a rollout must reach **100% before another release can be published**
- rollout values must be between **1 and 100**

These constraints prevent multiple partially deployed updates from conflicting with each other.

## Targeting builds

OTA updates must be compatible with the version of the app installed on a device.

The `targetBinaryVersion` parameter controls which app versions are allowed to install an update.

Example:

```
code-push release-react MyApp-Android android --targetBinaryVersion "1.2.x"
```

Supported targeting formats include:

```
1.2.x
=1.2.3 <1.3.0
```

When a device checks for updates, CodePush verifies that the installed binary version satisfies the specified version range.

If the version does not match, the update will not be installed.

This allows teams to support multiple active store versions while delivering different updates to each version.

## Mandatory updates

Updates can be marked as **mandatory**.

Mandatory updates install immediately instead of waiting for a later restart.

Example:

```
code-push release-react MyApp-Android android --mandatory
```

Mandatory updates are useful for:

- critical bug fixes
- security patches
- breaking logic errors

On the client, **`mandatoryInstallMode`** controls *when* a mandatory update is applied (for example immediately versus on next resume). See [Advanced: sync options](/rn-codepush/advanced-sync-options/).

### Mandatory update propagation

The mandatory flag propagates across releases.

Example release sequence:

```
v1 optional
v2 mandatory
v3 optional
```

If a user is running **v1** and checks for updates, they will receive **v3**, but it will be treated as **mandatory**.

This happens because v3 contains the changes introduced in the mandatory release v2.

## Rollbacks

If an update causes problems, CodePush allows teams to quickly revert to a previous working release.

Two rollback mechanisms exist.

### Automatic rollback

The CodePush client monitors app startup behaviour.

If an update causes the app to crash before the update is confirmed as successful, the client automatically restores the previous working bundle.

This protects users from being stuck with a broken update.

### Manual rollback

A release can also be rolled back manually using the CLI.

Example:

```
code-push rollback MyApp-Android Production
```

This restores the previous release for that deployment.

After a rollback, devices checking for updates will receive the earlier working version instead.

## Using these controls together

In production environments, teams typically combine these controls to reduce risk.

Example workflow:

```
release update → 10% rollout
monitor crashes and metrics
increase rollout gradually
mark update mandatory if critical
rollback if issues appear
```

This approach allows teams to deploy updates safely while still benefiting from the speed of OTA updates.

For rollout monitoring and adoption metrics, see [Analytics](/rn-codepush/analytics/). For access control and signing, see [Security and access](/rn-codepush/security-and-access/). For `release-react`, `patch`, and `rollback` syntax, see [CLI quick reference](/rn-codepush/cli-quick-reference/).

---
title: Production control
description: Manage rollouts, targeting, and rollback behavior
meta_title: Control CodePush Rollouts, Targeting, and Rollbacks
meta_description: Manage CodePush production releases with rollouts, binary version targeting, mandatory updates, rollback, and staged promotion workflows.
weight: 4
---

Once OTA updates are set up, the next step is controlling how changes are delivered to users in production.

CodePush provides release controls that let teams:

* roll out updates gradually
* target specific app versions
* enforce mandatory updates when required
* quickly revert problematic releases

These controls help minimize risk and ensure safe, predictable delivery of updates to production users.

---

## Rollouts (Gradual Release)

Rollouts allow an update to be delivered to only a percentage of users instead of releasing it to everyone at once.

This approach helps reduce risk by letting you monitor performance, crashes, and user feedback before increasing exposure.

**1. How rollouts work**

You start by releasing an update to a small percentage of users and gradually increase it as confidence grows:
{{< highlight bash "style=paraiso-dark">}}
Release update → 10%
Monitor behavior and stability
Increase rollout → 25%
Continue monitoring
Increase rollout → 50%
Finalize rollout → 100%
{{< /highlight >}}

Example release with a rollout: 

{{< highlight bash "style=paraiso-dark">}}
code-push release-react MyApp-Android android --rollout 25
{{< /highlight >}}

This publishes an update that is initially delivered to approximately 25% of eligible users (i.e., users running a compatible app version).

**2. Updating an existing rollout**

You can adjust the rollout percentage without creating a new release using the patch command:

{{< highlight bash "style=paraiso-dark">}}
code-push patch MyApp-Android Production --rollout 50
{{< /highlight >}}

This updates the existing release to be delivered to 50% of users.

### Rollout constraints

There are several constraints to be aware of when using rollouts:

* **Only one active rollout per deployment:** You cannot have multiple in-progress (partial) rollouts within the same deployment.
* **A rollout must reach 100% before a new release can be created:** You need to either complete the rollout or stop it before publishing another update to the same deployment.
* **Rollout values must be between 1 and 100:** The percentage must be a whole number within this range.

These constraints ensure consistency and prevent conflicts between updates. Allowing multiple partially deployed releases at the same time could result in users receiving different or incompatible versions of the app, making behavior harder to predict and debug.

## Mandatory updates

Updates can be marked as **mandatory**. Mandatory updates ensure that users install a specific update before continuing to use the app. This is useful when a release contains critical fixes or breaking changes that must be applied immediately.

When an update is marked as mandatory, the app will install it and typically restart automatically, without waiting for user interaction.

Example:

{{< highlight bash "style=paraiso-dark">}}
code-push release-react <app_name> <platform> --mandatory
{{< /highlight>}}

This marks the update as mandatory, meaning all eligible users will be required to install it.

You can also mark an already released update as mandatory using the patch command:

{{< highlight bash "style=paraiso-dark">}}
code-push patch <app_name> <platform> --mandatory true
{{< /highlight >}}

Mandatory updates are best reserved for situations such as:

* Critical bug fixes (e.g., crashes, data corruption)
* Security issues
* Breaking API changes
* Urgent compliance or legal requirements

On the client, **`mandatoryInstallMode`** controls *when* a mandatory update is applied (for example immediately versus on next resume). See [Advanced: sync options](/rn-codepush/advanced-sync-options/).

### Mandatory update propagation

The mandatory flag can affect how updates are applied across multiple releases, but it does not literally “propagate” as a property to future releases.

Example release sequence:

{{< highlight bash "style=paraiso-dark">}}
v1 → optional
v2 → mandatory
v3 → optional
{{< /highlight >}}

If a user is running **v1** and checks for updates, they will receive **v3**. However, the update will be treated as mandatory because the user has not yet installed the mandatory update **(v2)**, the system ensures that any later update containing those changes is still applied as mandatory.

## Rollbacks

Rollbacks allow you to quickly revert users to a previous working update if a release introduces issues.

This is a critical safety mechanism that helps minimize the impact of bugs, crashes, or broken functionality in production.

There are two types of rollback mechanisms: **automatic and manual**


### Automatic rollback

The CodePush client monitors whether an update is successfully applied.

After an update is installed, it is considered pending until the app explicitly confirms it as successful (typically by calling **notifyAppReady**).

If the app crashes or restarts before confirming the update, the client assumes the update is faulty and automatically rolls back to the previous working version.

This prevents users from being stuck with a broken update.

### Manual rollback

A manual rollback is triggered by explicitly reverting a release using the CLI:

{{< highlight bash "style=paraiso-dark">}}
code-push rollback <app_name> <deployment_name>
{{< /highlight >}}

This disables the latest release and restores the previous stable update for all users in that deployment.

{{<notebox>}}
**📌 Important:**
* Automatic rollback is not based on generic **startup behavior** alone. 
It specifically depends on whether the update is confirmed as successful
* You must ensure your app calls:
**notifyAppReady()** (or equivalent). Otherwise, even a healthy update may be rolled back unintentionally
{{</notebox>}}

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

This strategy allows teams to:

* Limit impact of faulty updates through gradual exposure
* Validate stability using real-world data before full release
* Enforce critical fixes when necessary
* Recover quickly using rollbacks

For rollout monitoring and adoption metrics, see [Analytics](/rn-codepush/analytics/). For access control and signing, see [Security and access](/rn-codepush/security-and-access/). For `release-react`, `patch`, and `rollback` syntax, see [CLI quick reference](/rn-codepush/cli-quick-reference/).

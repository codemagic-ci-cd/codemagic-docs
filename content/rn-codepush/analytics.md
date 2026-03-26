---
title: Analytics
description: Usage, health, and adoption metrics
meta_title: CodePush OTA Analytics, Metrics, and Adoption Tracking
meta_description: Track CodePush OTA adoption, including download and install metrics, deployment health, analytics dashboards, and release success signals.
weight: 8
aliases:
  - /rn-codepush/codepush-analytics/
---

CodePush provides analytics that help teams understand how OTA updates are being adopted and whether releases are working correctly.

These metrics allow developers to:

- monitor update adoption
- detect installation problems
- evaluate rollout success
- understand overall OTA usage

Analytics are typically visible in the Codemagic **OTA Updates dashboard**.

These insights help teams decide when to proceed with a rollout, adjust or halt rollout using the CodePush CLI, or roll back—see [Production control](/rn-codepush/production-control/).

## OTA update metrics

Each CodePush release tracks several metrics related to update installation.

Common metrics include:

| Metric | Description |
|------|-------------|
| **active** | number of users currently running this release |
| **downloaded** | update downloaded but not yet installed |
| **installed** | update successfully installed |
| **failed** | update installation failed (includes client-side rollbacks) |

These metrics reflect different stages of the update lifecycle.

Typical installation flow:

```
device checks server
→ bundle downloaded
→ update installed
→ app restarted
→ update becomes active
```

If the app crashes during startup after an update, the client may automatically revert to the previous working version. These events are counted as **failed** installs.

Monitoring these metrics helps detect problems early after a release.

## Deployment health

Analytics can also be used to monitor the overall health of a deployment.

Key indicators include:

#### Install rates

The ratio between downloads and successful installs can indicate whether updates are installing correctly.

Example signal:

```
high downloads
low installs
```

This may indicate a problem with update installation or client integration.

#### Rollout monitoring

When using staged rollouts, analytics help verify how an update spreads across the user base.

Example rollout monitoring flow:

```
release → 10% rollout
observe installs
increase rollout → 25%
monitor crash reports
increase rollout → 100%
```

If issues appear during rollout, use the CodePush CLI to change the rollout (for example with `patch`) or roll back the deployment—see [Production control](/rn-codepush/production-control/).

#### Failure rates

High failure counts may indicate:

- corrupted bundles
- incompatible updates
- client integration issues

Monitoring failures after each release helps teams identify problematic updates quickly.

## Usage analytics

In addition to per-release metrics, the dashboard provides overall usage statistics.

These typically include:

- monthly download counts
- total update installs
- historical usage trends

These numbers help teams understand:

- how frequently OTA updates are delivered
- how quickly users adopt updates
- how much OTA traffic the project generates

## Using analytics effectively

Analytics are most useful when reviewed after each release.

A typical release monitoring process might look like this:

```
release update
→ monitor installs and failures
→ confirm adoption rate
→ expand rollout
```

Combining CodePush analytics with external monitoring tools such as crash reporting or error tracking helps teams diagnose issues faster and validate release quality.

---
title: CodePush analytics
description: Installation and usage metrics for OTA updates
weight: 8
---

CodePush analytics are available via the dashboard, CLI or API, so you can use the one suitable to your workflow.

## Accessing your metrics

### Dashboard

The Codemagic OTA Updates dashboard gives a visual overview of your team's OTA activity.

The main page shows team-level totals for the current month:

- **Downloads** - total update downloads across all projects
- **Installs** - total successful installs across all projects

It also includes a time-series chart of succeeded and failed installs, updated hourly.

Each project is listed below with its latest release and per-release download, install, and failure counts. Clicking through to a project shows time-series charts for downloads, installs, and failures broken down by release version, with a configurable date range.

### CLI

You can view per-release metrics directly in the terminal without leaving your release workflow.

`deployment ls` shows the latest release for each deployment along with its current install metrics:

| **Metric** | **Description** |
| --- | --- |
| Active | Users currently running this release |
| Total | All successful installs since release |
| Pending | Downloaded but not yet installed |
| Rollbacks | Automatic client-side rollbacks |

Run the following command to list deployment metrics for an app:

{{< highlight bash "style=paraiso-dark">}}
code-push deployment ls MyApp-Android
{{< /highlight >}}

`deployment history` shows the same metrics for all recent releases in a deployment, useful for comparing adoption across versions:

{{< highlight bash "style=paraiso-dark">}}
code-push deployment history MyApp-Android Production
{{< /highlight >}}

### API

The [REST API](https://codemagic.io/api/v3/schema#tag/over-the-air-updates/GET/api/v3/ota/deployments/{deployment_id}/releases) provides time-series usage data for integrating CodePush metrics into external dashboards or observability tooling.

Per-deployment metrics are available for a configurable date range:

| **Metric** | **Description** |
| --- | --- |
| download_count | Update downloads over the period |
| deployment_succeeded_count | Successful installs over the period |
| deployment_failed_count | Failed installs over the period |

{{< highlight bash "style=paraiso-dark">}}
curl 'https://codemagic.io/api/v3/ota/deployments/{deployment_id}/releases?page_size=30&page=1' \
  --header 'x-auth-token: YOUR_SECRET_TOKEN'
{{< /highlight >}}

Team-level usage is also available, aggregating across all projects:

{{< highlight bash "style=paraiso-dark">}}
curl 'https://codemagic.io/api/v3/ota/{team_id}/usage?period_from=&period_to=' \
  --header 'x-auth-token: YOUR_SECRET_TOKEN'
{{< /highlight >}}

See the [REST API reference](/codemagic-rest-api/api-overview/) for the full endpoint list.

## Deployment health

Analytics can be used to monitor the overall health of a deployment and ensure OTA updates are being delivered and installed correctly. Some of the key indicators are described below.

### Install rates

The ratio between downloads and successful installs can indicate whether updates are installing correctly.

Example signal:

{{< highlight text "style=paraiso-dark">}}
high downloads
low installs
{{< /highlight >}}

This may indicate:

* Installation failures
* Client-side integration issues
* App crashes during or after install

### Rollout monitoring

When using staged rollouts, analytics help verify how an update spreads across the user base.

Example rollout monitoring flow:

{{< highlight text "style=paraiso-dark">}}
release → 10% rollout
observe installs
increase rollout → 25%
monitor crash reports
increase rollout → 100%
{{< /highlight >}}

If issues appear during rollout, you can:

* Adjust rollout percentage using the CLI (e.g. patch)
* Roll back the deployment
* Pause further exposure until resolved

See [Production control](/rn-codepush/production-control/) for more details.

### Failure rates

High failure counts may indicate:

* Corrupted or invalid bundles
* Incompatible updates (version targeting issues)
* Client-side integration problems
* Runtime crashes triggering automatic rollback

Monitoring failures after each release helps teams identify problematic updates quickly.

## Using analytics effectively

Analytics are most useful when reviewed after each release to ensure updates are performing as expected.

A typical release monitoring process might look like this:

{{< highlight text "style=paraiso-dark">}}
release deployed
→ monitor installs and downloads
→ track failure rate and crashes
→ evaluate rollout health
→ increase rollout or rollback if needed
{{< /highlight >}}

Combining CodePush analytics with external monitoring tools such as crash reporting or error tracking helps teams diagnose issues faster and validate release quality.

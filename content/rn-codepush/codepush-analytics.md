---
title: CodePush analytics
description: Installation and usage metrics for OTA updates
weight: 8
---

Customers using a CodePush server managed by Codemagic get access to analytics about their monthly usage as well as detailed deployment metrics on the OTA Updates page.

These metrics allow developers to:

- monitor update adoption
- detect installation problems
- evaluate rollout success
- understand overall OTA usage

Analytics are typically visible in the Codemagic **OTA Updates dashboard**.

These insights help teams decide when to proceed with a rollout, adjust or halt rollout using the CodePush CLI, or roll back—see [Production control](/rn-codepush/production-control/).

## Usage analytics

The main OTA Updates page gives an overview of your team's OTA usage across all projects (apps), grouped by month.

* **Downloads** - the total number of update downloads across all projects in a given month
* **Installs** - the total number of successful update installs across all projects in a given month

Additionally, the page includes an installation chart showing the daily number of successful and failed installs, helping you understand when end users install updates and identify trends or potential issues.

{{<notebox>}}
**Note**: Data on the page is updated hourly.
{{</notebox>}}

## Projects and release metrics

Your projects (apps) on the server are listed in the **Projects** section of the OTA Updates page. 

To view detailed metrics for a specific project and deployment channel, click the **arrow** icon next to the project and select the desired **Deployment channel** at the top of the page. 

The page then lists all updates to the project for the selected deployment channel and shows the number of downloads, successful installs, and failed installs for each update. You can also select a time period at the top of the page to track adoption trends over time.

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

---
title: CodePush analytics
description: Installation and usage metrics for OTA updates
weight: 2
---

Customers using a CodePush server managed by Codemagic get access to analytics about their monthly usage as well as detailed deployment metrics on the [OTA Updates](https://codemagic.io/ota) page.

## Usage analytics

The main [OTA Updates](https://codemagic.io/ota) page gives an overview of your OTA usage across all projects (apps), grouped by month.

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

{{<notebox>}}
**Note**: Data on the page is updated hourly.
{{</notebox>}}

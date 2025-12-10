---
title: Analytics
description: Installation and usage metrics for OTA updates
weight: 2
---

Customers using a CodePush server managed by Codemagic get access to analytics about their monthly usage as well as detailed deployment metrics on the [OTA Updates](https://codemagic.io/ota) page.

## Usage analytics

The main [OTA update](https://codemagic.io/ota) page gives an overview of your total usage across all your projects, grouped by month.

* **Downloads** - the total number of downloads across all projects (apps) in a month
* **Installs** - the total number of successful installs across all projects (apps) in a month

To understand when your end users have been installing updates and whether there have been major issues on a specific date, we display an installation chart showing the number of daily successful and failed installs.

{{<notebox>}}
**Note**: Data on the page is updated hourly.
{{</notebox>}}

## Projects and release metrics

Your projects (apps) on the server are listed in the **Projects** section of the OTA Updates page. 

To view detailed metrics per project and deployment channel, click the **arrow** icon next to the project. Then, select the correct **Deployment channel** at the top of the page. 

This will list all releases to the project for the selected deployment channel and display the number of downloads, installs and failures per release. Select a time period at the top of the page to see changes in release adoption over time.

{{<notebox>}}
**Note**: Data on the page is updated hourly.
{{</notebox>}}
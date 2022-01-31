---
title: Shared dashboards
description: Use public links to distribute builds and artifacts in codemagic.yaml
weight: 12
aliases: /publishing-yaml/public-dashboards, /yaml-publishing/public-dashboards
---

Shared dashboards make it possible for teams to share the list of team's builds, release notes (if passed) and build artifacts with people outside Codemagic using a public link (build logs will not be exposed). This is a convenient option for distributing builds to testers or sharing build artifacts with stakeholders. 

{{<notebox>}}
The shared dashboards feature is available for teams only. It is not possible to create shared dashboards for apps on personal accounts.
{{</notebox>}}

## Enabling shared dashboards

To use shared dashboards, team owners will have to enable the feature in team settings. 

In team settings, expand the **Shared dashboards** section and click **Enable sharing**. This will allow any team member to create dashboards and generate public links to share them.

Shared dashboards can be disabled anytime by clicking **Disable sharing**.

## Creating and sharing a build dashboard

1. Open the **Builds** page via the left navigation bar.
2. Click the **Filters** button at the top right of the page and use the **team**, **application**, **workflow**, **branch**, **tag** and **status** filters to create a build dashboard. 
3. Then click **Share dashboard** at the top of the page to generate a public link. A popup with the generated link will appear, and you can copy the link to the clipboard. The generated link will be also saved to the **Shared dashboards** section in team settings.

{{<notebox>}}
Please note that anyone with the public link can access the build dashboard and download build artifacts.
{{</notebox>}}

## Managing links

All generated links to shared dashboards are listed in the **Shared dashboards** section in team settings. 

Links can be revoked by deleting them or when a team owner disables sharing by clicking **Disable sharing**. When sharing is re-enabled, the available links become active again.

---
title: Build dashboards
description: Use public links to distribute builds and artifacts in codemagic.yaml
weight: 3
aliases: 
  - /publishing-yaml/public-dashboards
  - /yaml-publishing/public-dashboards
  - /yaml-publishing/shared-dashboards
---

Build dashboards make it possible for teams to share the list of team's builds, release notes (if passed) and build artifacts with people outside Codemagic using a public link (build logs will not be exposed). This is a convenient option for distributing builds to testers or sharing build artifacts with stakeholders.

The artifact download links in build dashboards are valid for 24 hours. Download links are recreated on each dashboard refresh.

{{<notebox>}}
**Note:** The build dashboards feature is available for teams only. It is not possible to create build dashboards for apps on personal accounts.
{{</notebox>}}

## Enabling build dashboards

To use build dashboards, team admins will have to enable the feature in team settings. 

In team settings, expand the **Build dashboards** section and click **Enable sharing**. This will allow any team member to create dashboards and generate public links to share them.

Build dashboards can be disabled anytime by clicking **Disable sharing**.

## Creating and sharing a build dashboard

1. Open the **Builds** page via the left navigation bar.
2. Click the **Share dashboard** button at the top right of the page and use the **application**, **workflow**, **build status**, **labels**,  **branch** and **tag** filters to configure a build dashboard.
3. Then click **Create dashboard** at the bottom of the right configuration sidebar to generate a public link. A generated link will appear, and you can copy the link to the clipboard. The generated link will be also saved to the **Build dashboards** section in team settings.

{{<notebox>}}
**Note:** **Share dashboard** will be available only when the currently selected team has build dashboards enabled.
{{</notebox>}}

{{<notebox>}}
**Note:** Please note that anyone with the public link can access the build dashboard and download build artifacts.
{{</notebox>}}

## Managing links

All generated links to build dashboards are listed in the **Build dashboards** section in team settings.

Links can be revoked by deleting them or when a team admin disables sharing by clicking **Disable sharing**. When sharing is re-enabled, the available links become active again.

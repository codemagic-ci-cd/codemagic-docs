---
title: Public dashboards
description: Use public links to distribute builds and artifacts
weight: 2
aliases:
---

Public dashboards make it possible for teams to share the list of team's builds, release notes (if passed) and build artifacts with people outside Codemagic using a public link (build logs will not be exposed). This is a convenient option for distributing builds to testers or sharing build artifacts with stakeholders. 

{{<notebox>}}
The public dashboards feature is available for teams only. It is not possible to create public dashboards for apps on personal accounts.
{{</notebox>}}

## Enabling public dashboards

To use public dashboards, teams owners will have to enable the feature in team settings. 

In team settings, expand the **Public dashboards** section and click **Enable sharing**. This will allow any team member to create public links to share the build dashboards they create. 

Public dashboards can be disabled anytime by clicking **Disable sharing**.

## Creating and sharing a build dashboard

Open the **Builds** page via the left sidebar and use the **team**, **application**, **workflow** and **branch** filters to create a build dashboard. Then click **Share dashboard** at the top of the page to generate a public link to it. A popup with the generated link will appear and you can copy the link to clipboard. The generated link will be also saved to the **Public dashboards** section in team settings.

{{<notebox>}}
Please note that anyone with the public link can access the build dashboard and download build artifacts.
{{</notebox>}}

## Managing links

All generated links to public dashboards are listed in the **Public dashboards** section in team settings. 

Links can be revoked by deleting them or when a team owner disables sharing by clicking **Disable sharing**. When sharing is reenabled, the available links become active again.

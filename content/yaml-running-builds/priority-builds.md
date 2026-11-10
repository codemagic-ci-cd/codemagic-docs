---
title: Priority builds
linkTitle: Priority builds
description: Start a build ahead of your team's other queued builds
weight: 6
---

When your team triggers more builds than its [build concurrency](/billing/pricing/#pricing-for-teams) allows, the extra builds wait in the queue and start in the order they were triggered. Build priority lets you move an urgent build ahead of the rest, for example a hotfix, or a development build when hundreds of [white-label](/yaml-quick-start/white-label-getting-started/) builds are already queued.

## How build priority works

* Every build has a priority from `0` to `10`. The default is `0`.
* When one of your team's concurrency slots frees up, the queued build with the highest priority starts next. Builds with the same priority start in the order they were triggered.
* Priority only changes the order of your team's own queue. It doesn't move your builds ahead of other teams' builds, doesn't add concurrency, and doesn't stop builds that are already running.
* Builds started automatically by webhooks or schedules always have priority `0`. You can set a priority only when you start a build with the Codemagic API or manually from the Codemagic UI.

## Start a priority build using the Codemagic API

Set the `priority` field when you start a build with the **Start a new build** endpoint (`POST /api/v3/apps/{app_id}/builds`) of the [Codemagic REST API](https://codemagic.io/api/v3/schema). It takes an integer from `0` to `10`. Any other value is rejected with a `400` error.

The **Get build info** and **List team builds** endpoints return the `priority` of each build.

{{<notebox>}}
**Note:** The `POST /builds` endpoint described in [Builds API](/rest-api/builds/) doesn't support priority. If you add `priority` to its payload, it is ignored and the build starts with priority `0`.
{{</notebox>}}

## Start a priority build from the Codemagic UI

When you start a build manually with **Start new build**, select **Highest priority build** to give the build priority `10`. Builds with a priority higher than `0` show a **Priority** label in the builds list.

{{<notebox>}}
**Note:** **Highest priority build** isn't available when you rerun an existing build.
{{</notebox>}}

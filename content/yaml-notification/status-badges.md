---
title: Build status badges
description: How to add build status badges using codemagic.yaml
weight: 3
aliases: 
  - /publishing-yaml/status-badges
  - /yaml-publishing/status-badges
---

Adding Codemagic status badges to repositories helps to keep the latest build status visible. The build status badge is workflow-specific and displays whether the build passed or failed. 

## Adding status badges to your repository

The build status badge URL can be constructed as following: `https://api.codemagic.io/apps/<app-id>/<workflow-id>/status_badge.svg`

1. To find the `<app-id>`, navigate to your application in the Codemagic UI and copy the ID shown in the URL after `https://codemagic.io/app/`.
2. In the URL, replace `<workflow-id>` with the ID (workflow name defined in `codemagic.yaml`) of the workflow whose build status you want to display.

Based on the following YAML example, the right substitute for `<workflow-id>` would be `release-workflow`.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  release-workflow:
    name: Release
{{< /highlight >}}


Thus, the final URL should look something like `https://api.codemagic.io/apps/5fcd4dc959d78f8de3d0af97/release-workflow/status_badge.svg`.

To use the build status badge with markdown, e.g. when adding it to a repository's README, it should be formatted in the following way:

{{< highlight markdown "style=paraiso-dark">}}
[![Codemagic build status](https://api.codemagic.io/apps/<app-id>/<workflow-id>/status_badge.svg)](https://codemagic.io/apps/<app-id>/<workflow-id>/latest_build)
{{< /highlight >}}


{{<notebox>}}

**Note:** If builds are set to public (or the user has logged in and has access to the build), then clicking on the link will open up the build page on Codemagic.

{{</notebox>}}

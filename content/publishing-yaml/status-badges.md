---
title: Build status badges
description: Use Codemagic status badges to see the status of the latest build
weight: 2
aliases:
---

Adding Codemagic status badges to repositories helps to keep the latest build status visible.

## Adding status badges to your repository

The build status badge URL can be constructed as following: `https://api.codemagic.io/apps/<app-id>/<workflow>/status_badge.svg`

1. To substitute `<app-id>`, navigate to your application in the Codemagic UI and copy the ID after `https://codemagic.io/app/`.
2. In the URL, replace `<workflow>` with the workflow that you want to get the status badge of.

Based on the following YAML example, the right substitute for `<workflow>` would be `release-workflow`.
```yaml
workflows:
  release-workflow:
    name: Release
```

Thus, the final URL should look something like `https://api.codemagic.io/apps/5fcd4dc959d78f8de3d0af97/release-workflow/status_badge.svg`.

To use the badge with markdown, when for example adding it to a repositories README, it should be used in the following way:
```
[![Codemagic build status](https://api.codemagic.io/apps/<app-id>/<workflow>/status_badge.svg)](https://codemagic.io/apps/<app-id>/<workflow>/latest_build)
```

---
description: How to publish a snap to the Snap Store using the Flutter workflow editor
title: Snapcraft Snap Store
weight: 5
aliases: /publishing/publishing-to-snapscraft
---

The [snap packages](../flutter-configuration/flutter-projects/#building-snap-packages) you build in Codemagic can be published straight to the [Snapcraft Snap Store](https://snapcraft.io/) as part of the build workflow.

1. Go to **App settings > Distribution > Snapcraft** to configure publishing to the Snapcraft Snap Store.
2. Upload your Snapcraft login credentials file. This can be created by running the following command locally.

```
snapcraft export-login snapcraft-login-credentials
```

3. Select a channel for publishing the snap package.
4. Select the **Enable Snapcraft publishing** checkbox to enable publishing to the Snapcraft Snap Store.

Now each time you run the workflow on Codemagic, the snap package artifact will be published to the selected channel on Snapcraft.

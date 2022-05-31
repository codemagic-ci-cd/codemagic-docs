---
description: How to change produced binary names for Android and iOS
title: Custom binary names
weight: 10
---

In order to change generated the **.ipa** file name, **CFBundleDisplayName** string value in **Info.plist** needs to be renamed.If the app is configured with flavors, then **CFBundleName** string value is required to be renamed with a custom name.

For Android binary names, configuring **app/build.gradle** can be done as follows to update the `archiveBaseName`:

```
defaultConfig {
   setProperty("archivesBaseName", applicationId + "-v" + versionCode + "(" + versionName + ")")
  }
```

The example above generates a binary name with your app package name and its version. In order to have custom names, then the following lne achieves it:

```
setProperty("archivesBaseName", "YOUR_CUSTOM_NAME")
```

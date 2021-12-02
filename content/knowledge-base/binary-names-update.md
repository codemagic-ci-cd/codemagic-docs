---
description: How to change produced binary names for Android and iOS
title: Custom binary names
weight: 11
---

In order to change generated the **.ipa** file name, **CFBundleDisplayName** string value in **Info.plist** needs to be renamed.If the app is configured with flavors, then **CFBundleName** string value is required to be renamed with a custom name.


For Android, configuring **build.gradle** as follows renames the generated binary names:

``` 
defaultConfig {
    ...
    archiveBaseName = "CustomAppName-" + versionName + "-" + versionCode
    ...
}
```
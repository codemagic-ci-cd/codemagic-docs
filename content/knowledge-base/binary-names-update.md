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

The example above generates a binary name with your app package name and its version. 

In order to give your binary a custom name, this can be done as follows:

```
setProperty("archivesBaseName", "YOUR_CUSTOM_NAME")
```

As Flutter does not allow to change binary names in **build.gradle**, a temporary solution is adding the following line after executing the build command:

```
name: Renaming binary
script: |
     mv build/app/outputs/flutter-apk/app-release.apk build/app/outputs/flutter-apk/my_custom_binary_name.apk
```

Then, the same name must be included in tha path under the artefacts section:

```
- build/app/outputs/flutter-apk/my_custom_binary_name.apk
```
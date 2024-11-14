---
description: How to change produced binary names for Android and iOS
title: Custom binary names
weight: 12
aliases:
 - /knowledge-base/binary-name-update
---

## iOS

In order to change the file name for the generated **.ipa** artifact, edit the **CFBundleDisplayName** key in the `Info.plist` file.

If the app is configured with **flavors**, the **CFBundleName** key needs to be configured with a custom name.


## Android

In order to change the artifact file name for Android apps, edit the **archiveBaseName** property in the `app/build.gradle` file.

For example, to generate a binary name using your app package name and version:

{{< highlight Groovy "style=paraiso-dark">}}
defaultConfig {
   setProperty("archivesBaseName", applicationId + "-v" + versionCode + "(" + versionName + ")")
  }
{{< /highlight >}}


To use some arbitrary custom name, set the property as follows:

{{< highlight Groovy "style=paraiso-dark">}}
  setProperty("archivesBaseName", "YOUR_CUSTOM_NAME")
{{< /highlight >}}


#### Flutter

As Flutter does not allow binary names to be changed in `build.gradle`, a temporary workaround is to use the `mv` command. Make sure to reference the new .apk file in the `artifacts` section:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Rename the apk and aab file
      script: | 
        mv build/app/outputs/flutter-apk/app-release.apk \
          build/app/outputs/flutter-apk/my_renamed_binary_name-release.apk

        mv build/app/outputs/bundle/release/app-release.aab \
          build/app/outputs/bundle/release/my_renamed_binary_name-release.aab
  artifacts:
    - build/app/outputs/flutter-apk/my_renamed_binary_name-release.apk
    - build/app/outputs/bundle/release/my_renamed_binary_name-release.aab
{{< /highlight >}}


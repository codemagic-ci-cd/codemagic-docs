---
description: How to configure caching for your builds
title: Caching
weight: 4
aliases:
  - /flutter/dependency-caching
  - /flutter-configuration/dependency-caching
---

Caching can improve the efficiency of your build and deployment processes on Codemagic by reusing components that are generated or fetched during the build, such as packages, libraries, and compiled code.

When you have enabled caching for a workflow, Codemagic will automatically generate a cache based on the output of the first successful build. This cache is stored for a maximum of 14 days. After 14 days, the cache expires and is no longer accessible for subsequent builds. When this occurs, your workflow will fetch all dependencies and artifacts again and generate a new cache. This new cache is then uploaded and can be used for the next 14 days, following the same process.

For example, you may consider caching the following paths:

| **Path**                                    | **Description**                                  |
| ------------------------------------------- | ------------------------------------------------ |
| `$HOME/.pub-cache`                          | Dart cache                                       |
| `$HOME/.gradle/caches`                      | Gradle cache. Note: do not cache `$HOME/.gradle` |
| `$HOME/Library/Caches/CocoaPods`            | CocoaPods cache                                  |

A great article on Unity caching can be found in [our blog](https://blog.codemagic.io/unity-caching/).


{{<notebox>}}
**Note:** Caching `$HOME/Library/Developer/Xcode/DerivedData` won't help to speed up iOS builds with Xcode 10.2 or later.
{{</notebox>}}

## Enabling dependency caching

{{< tabpane >}}

{{< tab header="codemagic.yaml" >}}
{{<markdown>}}
To use caching, simply add a `cache` section to your `codemagic.yaml` file and list the paths you would like to cache.

{{< highlight yaml "style=paraiso-dark">}}
  cache:
    cache_paths:
      - ~/.gradle/caches
      - ...
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="Flutter WFE" >}}
{{<markdown>}}
1. In your app settings, open the **Dependency caching** section.
2. Check the **Enable dependency caching** option. By default, caching is disabled.
3. Enter the path(s) to the dependencies to be cached and click **Add**. Note that you can delete added paths anytime.
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}

{{<notebox>}}
**⚠️ Note:** If your dependencies have any warnings or errors when trying to cache them, the caching process will not complete successfully even though you will see a cache for the workflow listed under the Caching tab in the UI. You should reset the cache by deleting the workflow cache under the Caching tab and deal with any errors or warnings.
{{</notebox>}}

## Cache usage limits

Maximum cache size is limited to
- **10GB** per workflow for teams, and 
- **3GB** per workflow for personal accounts.

Note that installing dependencies without using caching could be faster than retrieving or updating cached data.

## Removing cached dependencies

In order to clear the collected cache, navigate to the **Dependency caching** section in app settings and click **Clear cache**. During the next build, dependencies will be downloaded afresh.

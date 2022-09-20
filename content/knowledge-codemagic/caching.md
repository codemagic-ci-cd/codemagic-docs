---
description: How to configure caching for your builds
title: Caching
weight: 3
---

You can speed up your builds by storing dependencies on Codemagic. To use caching, simply add a `cache` section to your `codemagic.yaml` file and list the paths you would like to cache.

For example, you may consider caching the following paths:

| **Path**                                    | **Description**                                  |
| ------------------------------------------- | ------------------------------------------------ |
| `$FLUTTER_ROOT/.pub-cache`                  | Dart cache                                       |
| `$HOME/.gradle/caches`                      | Gradle cache. Note: do not cache `$HOME/.gradle` |
| `$HOME/Library/Caches/CocoaPods`            | CocoaPods cache                                  |

A great article on Unity caching can be found in [our blog](https://blog.codemagic.io/unity-caching/).

{{< highlight yaml "style=paraiso-dark">}}
  cache:
    cache_paths:
      - ~/.gradle/caches
      - ...
{{< /highlight >}}

{{<notebox>}}
**Note:** Caching `$HOME/Library/Developer/Xcode/DerivedData` won't help to speed up iOS builds with Xcode 10.2 or later.
{{</notebox>}}

## Cache usage limits

Currently, there is no caching limit in size, however, exceeding 1GB cache size might cause performance issues. It means that installing dependencies with no caches could be faster than recovering or updating cached data.

## Removing cached dependencies

In order to clear the collected cache, navigate to the **Caching** section in app settings and click **Clear cache**. During the next build, dependencies will be downloaded afresh.

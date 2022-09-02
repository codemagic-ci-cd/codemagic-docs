---
description: How to cache dependencies for builds configured with the Flutter workflow editor
title: Dependency caching
weight: 6
aliases: 
    - '../building/dependency-caching'
    - /flutter/dependency-caching
---

You can speed up your builds by storing dependencies on Codemagic. To use caching, you must **enable dependency caching** in app settings. Note that caching is workflow-specific.


You can add paths to be cached, for example:

| **Path**                                    | **Description**                                  |
| ------------------------------------------- | ------------------------------------------------ |
| `$FLUTTER_ROOT/.pub-cache`                  | Dart cache                                       |
| `$HOME/.gradle/caches`                      | Gradle cache. Note: do not cache `$HOME/.gradle` |
| `$HOME/Library/Caches/CocoaPods`            | CocoaPods cache                                  |

&nbsp;

{{<notebox>}}

Caching `$HOME/Library/Developer/Xcode/DerivedData` won't help to speed up iOS builds with Xcode 10.2 or later.

{{</notebox>}}

## Enabling dependency caching

1. In your app settings, open the **Dependency caching** section.
2. Check the **Enable dependency caching** option. By default, caching is disabled.
3. Enter the path(s) to the dependencies to be cached and click **Add**. Note that you can delete added paths anytime.

## Cache usage limits

Currently, there is no caching limit in size, however, exceeding 1GB cache size might cause performance issues. It means that installing dependencies with no caches could be faster than recovering or updating cached data. 

## Removing cached dependencies

In order to clear the collected cache, navigate to the **Dependency caching** section in app settings and click **Clear cache**. During the next build, dependencies will be downloaded afresh.

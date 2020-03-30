---
description: Store your dependencies on Codemagic for a faster build time.
title: Dependency caching
weight: 10
---

You can speed up your builds by storing dependencies on Codemagic. To use caching, you must **enable dependency caching** in app settings. Note that caching is workflow-specific.

You can add paths to be cached, for example:

| **Path**                                    | **Description**                                  |
| ------------------------------------------- | ------------------------------------------------ |
| `$FCI_BUILD_DIR/build`                      | Build cache                                      |
| `$HOME/.pub-cache`                          | Dart cache                                       |
| `$HOME/Library/Developer/Xcode/DerivedData` | Xcode cache                                      |
| `$HOME/.gradle/caches`                      | Gradle cache. Note: do not cache `$HOME/.gradle` |

## Enabling dependency caching

1. In your app settings, open the **Dependency caching** section.
   ![](../uploads/2020/dependency-cache.png)
   
2. Check the **Enable dependency caching** option. By default, caching is disabled.
3. Enter the path(s) to the dependencies to be cached and click **Add**. Note that you can delete added paths anytime.
4. Click **Save** to save the settings.

## Remove cashed dependencies

In order to clear the collected cache, navigate to **Dependency caching** section and click on **Clear cache**. During the next build dependencies will be downloaded afresh.

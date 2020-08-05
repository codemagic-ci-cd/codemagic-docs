---
description: Create GitHub release and upload generated artifacts when build was triggered on tag creation.
title: GitHub releases
weight: 9
---

Codemagic enables you to automatically create a GitHub release and upload generated artifacts when your build is triggered on tag creation. Read more about GitHub releases here: https://help.github.com/en/github/administering-a-repository/about-releases.

## Requirements

1. The setting is only available for GitHub repositories. 
2. You need to enable automatic build triggering on tag creation. This setting can be found in **App settings > Build triggers > Trigger on tag creation**. Don't forget to add a branch pattern and ensure the webhook exists.

## Setting up GitHub release publishing.

The setting can be found in **App settings > Publish > GitHub releases**. To enable it, check the **Create a release and publish artifacts** checkbox. To notify users that the release is not ready for production and may be unstable, mark it as **pre-release** by enabling checkbox **Mark build as pre-release**.

{{<notebox>}}

Publishing to GitHub happens only for successful builds triggered on tag creation and is unavailable for manual builds. 

{{</notebox>}}

You can control which of the generated artifacts will be uploaded to the created release by defining artifact name glob patterns. You can use a specific name, e.g. `app-release.apk` or use glob patterns. Two patterns `*.apk` and `*.ipa` are added by default. To add a new pattern, enter the pattern and click **Add**. Don't forget to click **Save** when you are done. Note that you can delete added patterns anytime.

{{<notebox>}}

Next pattern wildcards are supported:

1. `*`      matches everything
2. `?`       matches any single character
3. `[seq]`   matches any character in seq
3. `[!seq]`  matches any character not in seq

{{</notebox>}}

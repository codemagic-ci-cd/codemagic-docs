---
description: Publish release notes with the build.
title: Publish release notes
weight: 4
---

Create a custom release notes file to notify users of the changes as you publish a new version of your app.

Release notes can be published to:

* **Email**. The release notes will be included in the publishing email if you have publishing to email configured in App settings > Publish > Email.
* **Slack**. The release notes will be included in the Slack notification if you have Slack publishing configured in App settings > Publish > Slack.
* **Google Play**. The release notes will be published to Google Play Console if you have Google Play publishing configured in App settings > Publish > Google Play. The content of the release notes file is published for `en-US`.

## Setting up release notes

Create a `release_notes.txt` file and add it to the root of the repository. When present, Codemagic will fetch the content of that file and publish it with the build.
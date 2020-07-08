---
description: Receive artifacts of successful builds and build status updates with email or Slack.
title: Email and Slack notifications
weight: 8
---

## Email

Email publishing settings can be found in **App settings > Publish > Email**.

Email publishing is the only publishing option which is set enabled (`Enable email publishing`) by default. Initially Codemagic uses the email which is specified as default one in the service you used to login (Github, Bitbucket, Gitlab). You can fill in multiple emails.

If a build has finished successfully, release notes (if passed) and generated artifacts are published to the provided email.

If a buid failed, failure reason will be sent with the link to check build logs. Check `Publish artifacts even if tests fail` to publish artifacts even when one or more tests fail. If the option is unchecked, generated artifacts (if any) will be attached to successful builds only.

### MS Teams

To be able to receive an email from Codemagic to your MS Teams account, please go to your MS Teams account and make sure to set `Anyone can send emails to this address` in `Get email address` -> `advanced settings`.

From the whole address e.g. `My awesome company <543l5kj43.some.address@somedomain.teams.ms>` use only the part in angle brackets.

## Slack

Slack publishing settings can be found in **App settings > Publish > Slack**.

To be able to use this publishing option you need to enable Slack integration at **User settings > Integration > Slack**. Once your Slack workspace is connected, you can choose a channel to be used.

If a build finished successfully, release notes (if passed) and generated artifacts are published in the specified channel.

If a build has failed, build logs link is sent. Check `Publish artifacts even if tests fail` to publish artifacts even when one or more tests fail. If the option is unchecked, generated artifacts (if any) will be attached to successful builds only.

Check `Notify when build starts` checkbox to receive a build started notification.

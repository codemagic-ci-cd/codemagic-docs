---
description: How to configure build status updates with links to artifacts in the Flutter workflow editor
title: Email and Slack notifications
weight: 11
aliases: 
  - /publishing/email-and-slack-notifications
  - /flutter-publishing/email-and-slack-notifications
---

## Email

Email publishing settings can be found in **App settings > Notifications > Email**.

Email publishing is the only publishing option that is enabled by default. Codemagic uses the email specified as the default one in the service you used to log in (Github, Bitbucket, Gitlab). You can add multiple email addresses.

If the build finishes successfully, release notes (if passed), and the generated artifacts will be published to the provided email.

If the build fails, you will be sent a link to the build logs. Check the **Publish artifacts even if tests fail** option in the workflow editor to publish artifacts even when one or more tests fail. If that option is unchecked, generated artifacts (if there are any) will be attached only to successful builds.

### MS Teams

To be able to receive emails from Codemagic to your MS Teams account, please go to your MS Teams account and select **Anyone can send emails to this address** in **Get email address > Advanced settings**.

Use only the part in angle brackets from the whole address line (e.g. `My awesome company <543l5kj43.some.address@somedomain.teams.ms>`).

## Slack

In order to set up publishing to Slack, you first need to connect the Slack workspace in **User settings > Integrations > Slack** for your personal apps and in **Teams > Your_team > Team integrations > Slack** for the team apps.

Once your Slack workspace is connected, you can enable Slack publishing and select a channel for publishing in **App settings > Notifications > Slack** when using the workflow editor.

In order to publish to **private channels**, you need to invite the Codemagic app to the channels, otherwise, the app does not have access to private channels. To invite the Codemagic app to private channels, write `@codemagic` in the channel. If you are in the Codemagic web app, refresh the page, and the new channel will become available in the dropdown menu.

If the build finishes successfully, release notes (if passed), and the generated artifacts will be published to the specified channel.

If the build fails, a link to the build logs is published. Check **Publish artifacts even if tests fail** to publish artifacts even when one or more tests fail. If the option is unchecked, generated artifacts (if any) will be attached to successful builds only.

To receive a notification when a build starts, check the checkbox **Notify when the build starts**.

## Published artifacts

When you set up email or Slack publishing, Codemagic publishes the following artifacts:

- `app`, `ipa`, `apk`, the archive with Flutter web build directory, Linux application bundle files, Windows MSIX packages

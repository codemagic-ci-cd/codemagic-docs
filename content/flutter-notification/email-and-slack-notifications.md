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

Email publishing is the only publishing option that is enabled by default. Codemagic automatically publishes to your signup email or the email specified as the default one in the service you signed up with (GitHub, Bitbucket, GitLab). You can add multiple email addresses as build notification recipients. Note that any external email addresses must be [verified](#email-recipient-verification) to receive build notification emails.

If the build succeeds, the email includes release notes (if provided) and download links for the build artifacts. By default, the links are valid for 24 hours. To change this, select your personal account or team and go to **Settings > Artifact download links**.

If the build fails, the email includes a link to the build logs. Check the **Publish artifacts even if tests fail** option in the workflow editor to publish artifacts even when one or more tests fail. If that option is unchecked, generated artifacts (if there are any) will be attached only to successful builds.

### Email recipient verification

External recipients — people who are not members of your Codemagic team — must verify their email address by opting in to receive emails from Codemagic.

Unverified recipients receive an opt-in email from Codemagic the first time a workflow runs with their email address as a recipient. That run doesn't send them a build notification. Once they verify their email address, they'll receive build notifications from subsequent workflow runs.

{{<notebox>}}
**Note for teams:**
Verification is team-wide, so external recipients only need to verify their email address once to receive notifications across all workflows within that team.
{{</notebox>}}

#### Monitoring email verification status

To see external email addresses and their verification status, select your personal account or team and go to **Settings > External emails** in the Codemagic UI.

Additionally, when a build notification configuration includes an unverified recipient, team admins (or account owners) will receive an email notification.

### MS Teams

To be able to receive emails from Codemagic to your MS Teams account, please go to your MS Teams account and select **Anyone can send emails to this address** in **Get email address > Advanced settings**.

Use only the part in angle brackets from the whole address line (e.g. `My awesome company <543l5kj43.some.address@somedomain.teams.ms>`).

## Slack

To set up publishing to Slack, you first need to connect the Slack workspace. Navigate to **Personal Account > Settings > Integrations > Slack** to connect Slack for your personal apps or **[Your team] > Settings > Team integrations > Slack** to connect Slack for team apps.

Once your Slack workspace is connected, you can enable Slack publishing and select a channel for publishing in **App settings > Notifications > Slack** when using the workflow editor.

To publish to **private channels**, you need to invite the Codemagic app to them. To invite the Codemagic app to private channels, write `@codemagic` in the channel. If you are in the Codemagic web app, refresh the page, and the new channel will become available in the dropdown menu.

If the build succeeds, the Slack message includes release notes (if provided) and download links for the build artifacts. By default, the links are valid for 24 hours. To change this, select your personal account or team and go to **Settings > Artifact download links**.

If the build fails, a link to the build logs is published. Check **Publish artifacts even if tests fail** to publish artifacts even when one or more tests fail. If the option is unchecked, generated artifacts (if any) will be attached to successful builds only.

To receive a notification when a build starts, check the checkbox **Notify when the build starts**.

## Published artifacts

When you set up email or Slack publishing, Codemagic publishes the following artifacts:

- `.app`, `.ipa`, `.apk`, `.exe`
- Flutter web build archive
- Linux application bundle files
- Windows MSIX packages

{{<notebox>}}
**Important:** Success emails are only sent when artifacts are available for Codemagic to collect.
{{</notebox>}}

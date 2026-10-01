---
description: How to send build status updates to email with links to artifacts in codemagic.yaml
title: Email
weight: 1
aliases:
  - /yaml-publishing/email
---

## Configuring email notifications

{{<notebox>}}
**Note:** This guide applies to workflows configured with **codemagic.yaml**. If you're using **Flutter Workflow Editor**, please refer [here](../flutter-notification/email-and-slack-notifications).
{{</notebox>}}

Notify your Codemagic team members or external recipients by email when a build finishes. Note that external recipients need to [verify their email address and consent](#email-recipient-verification) to receiving build notifications.

If the build succeeds, the email includes release notes (if provided) and download links for the build artifacts. By default, the links are valid for 24 hours. To change this, select your personal account or team and go to **Settings > Artifact download links**.

If the build fails, the email includes a link to the build logs.

Both notifications are on by default. To turn one off, set `success` or `failure` to `false`.

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  email:
    recipients:
      - name@example.com
    notify:
      success: true  # Set to false to skip emails for successful builds
      failure: true  # Set to false to skip emails for failed builds
{{< /highlight >}}

When you set up email publishing, Codemagic publishes the following artifacts:

- `.app`, `.ipa`, `.apk`, `.exe`
- Flutter web build archive
- Linux application bundle files
- Windows MSIX packages

{{<notebox>}}
**Important:** Success emails are only sent when artifacts are available for Codemagic to collect. If your build scripts include cleanup steps (such as `flutter clean` or Fastlane's `clean_build_artifacts`) that run *before* Codemagic collects artifacts, the binaries will be deleted and **no email will be sent** — even if the build itself succeeded.
{{</notebox>}}

## Email recipient verification

External recipients — people who are not members of your Codemagic team — must verify their email address and consent to receiving build notifications from Codemagic. Both happen in a single step.

Codemagic sends unverified recipients an opt-in email in one of two ways:

- **In advance:** Team admins (or account owners) can go to **Settings > External emails** and click **Add external recipients**. The opt-in email is sent immediately.
- **On the first build:** If the recipient hasn't been added in advance, they receive the opt-in email the first time a workflow runs with their email address as a recipient. That run doesn't send them a build notification yet.

Once they click **Confirm** in the opt-in email, their email address is verified and they'll receive build notifications from then on.

Codemagic sends the opt-in email only once. If a recipient misses it, please reach out to our support team.

{{<notebox>}}
**Note for teams:**
Verification is team-wide, so external recipients only need to verify their email address once to receive notifications across all workflows within that team.
{{</notebox>}}

### Monitoring email verification status

To see external email addresses and their verification status, select your personal account or team and go to **Settings > External emails** in the Codemagic UI. All team members can view this list, but only team admins (or account owners) can add recipients.

Additionally, when a workflow runs with an unverified email address as a recipient, team admins (or account owners) are notified by email. This notification is sent only once per unverified email address.

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

- **In advance:** Team admins (or account owners) can go to **Settings > External recipients** and click **Add external recipients**. The opt-in email is sent immediately.
- **On the first build:** If the recipient hasn't been added in advance, they receive the opt-in email the first time a workflow runs with their email address as a recipient. That run doesn't send them a build notification yet.

Once they click **Confirm** in the opt-in email, their email address is verified and they'll receive build notifications from then on.

Codemagic sends the opt-in email only once. If a recipient misses it, please reach out to our support team.

{{<notebox>}}
**Note for teams:**
Verification is team-wide, so external recipients only need to verify their email address once to receive notifications across all workflows within that team.
{{</notebox>}}

### Monitoring email verification status

To see external email addresses and their verification status, select your personal account or team and go to **Settings > External recipients** in the Codemagic UI. All team members can view this list, but only team admins (or account owners) can add recipients.

Additionally, when a workflow runs with an unverified email address as a recipient, team admins (or account owners) are notified by email. This notification is sent only once per unverified email address.

### Restricting notifications to whitelisted domains

To make sure build notifications only reach addresses your organization trusts, team admins (or account owners) can restrict external recipients to specific email domains:

1. Select your personal account or team and go to **Settings > External recipients**.
2. Turn on **Enable domain whitelisting** and enter a domain, such as `example.com`.
3. To add more domains, click **Whitelist a domain**. You can whitelist up to 50 domains.

Once at least one domain is whitelisted, build notifications are only sent to external recipients whose email addresses are on a whitelisted domain. Keep in mind that:

- Team members always receive build notifications, whatever their email domain.
- Domains match exactly, so `example.com` doesn't cover `mail.example.com`. Whitelist each subdomain separately.
- When a build skips an external recipient because their domain isn't whitelisted, team admins (or account owners) are notified by email. This notification is sent once per address until the list of whitelisted domains changes.

To see the whitelisted domains, expand **Whitelisted domains** in the same section. To remove a domain, click the bin icon next to it. Removing the last domain turns domain whitelisting off, and build notifications are sent to all confirmed external recipients again.

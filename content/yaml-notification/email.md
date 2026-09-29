---
description: How to send build status updates to email with links to artifacts in codemagic.yaml
title: Email
weight: 1
aliases:
  - /yaml-publishing/email
---

Notify your Codemagic team members or [external recipients](#email-recipient-verification) by email when a build finishes.

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

External recipients — people who are not members of your Codemagic team — must verify their email address by opting in to receive emails from Codemagic.

Unverified recipients receive an opt-in email from Codemagic the first time a workflow runs with their email address as a recipient. That run doesn't send them a build notification. Once they verify their email address, they'll receive build notifications from subsequent workflow runs.

{{<notebox>}}
**Note for teams:**
Verification is team-wide, so external recipients only need to verify their email address once to receive notifications across all workflows within that team.
{{</notebox>}}

### Monitoring email verification status

To see external email addresses and their verification status, select your personal account or team and go to **Settings > External emails** in the Codemagic UI.

Additionally, when a build notification configuration includes an unverified recipient, team admins (or account owners) will receive an email notification.

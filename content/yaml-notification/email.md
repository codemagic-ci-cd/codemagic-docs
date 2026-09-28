---
description: How to send build status updates to email with links to artifacts in codemagic.yaml
title: Email
weight: 1
aliases:
  - /yaml-publishing/email
---

Notify [verified recipients](#email-recipient-verification) by email when a build finishes.

If the build finishes successfully, release notes (if passed) and the generated artifacts will be published to the provided email address(es). The artifact download links in email are, by default, valid for 24 hours. You can configure the lifetime of publicly accessible artifact download links by selecting your personal account or team and navigating to **Settings > Artifact download links**.

If the build fails, an email with a link to build logs will be sent.

If you don't want to receive an email notification on build success or failure, you can set `success` to `false` or `failure` to `false` accordingly.

{{< highlight yaml "style=paraiso-dark">}}

publishing:
  email:
    recipients:
      - name@example.com
    notify:
      success: false # To not receive a notification when a build succeeds
      failure: false # To not receive a notification when a build fails
{{< /highlight >}}



When you set up email publishing, Codemagic publishes the following artifacts:

- `app`
- `ipa`
- `apk`
- the archive with Flutter web build directory
- Linux application bundle files
- Windows MSIX packages
- .exe

{{<notebox>}}
**Important:** Email notifications are only sent when artifacts are available for Codemagic to collect. If your build scripts include cleanup steps (such as `flutter clean` or Fastlane's `clean_build_artifacts`) that run *before* Codemagic collects artifacts, the binaries will be deleted and **no email will be sent** — even if the build itself succeeded.
{{</notebox>}}

## Email recipient verification

External recipients — people who are not members of your Codemagic team — will need to verify their email address by opting in to receive emails from Codemagic. 

When an unverified external recipient is first included as a recipient, they’ll receive an opt-in email from Codemagic when the workflow runs. Once they verify their email address, they’ll begin receiving build notifications from subsequent workflow runs.

The workflow that triggers the verification email will not send a build notification to the unverified recipient.

{{<notebox>}}
**Note for teams:** 
- To exempt a recipient from verification, team admins can invite them to join the team from team settings in the Codemagic UI. Once they become a team member, they are verified automatically and do not need to complete email verification.
- Verification is team-wide, so external recipients only need to verify their email address once to receive notifications across all workflows within that team.
{{</notebox>}}

### Monitoring email verification status

The external email addresses from your build notifications are visibile when you select your personal account or team and go to **Settings > External emails** in the Codemagic UI. For each email address, you can also see its verification status. 

Additionally, when a build notification configuration includes an unverified recipient, the email address will be flagged in the build logs and team admins (or account owners) will receive an email notification. 

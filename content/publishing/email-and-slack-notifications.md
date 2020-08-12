---
description: Receive artifacts of successful builds and build status updates with email or Slack.
title: Email and Slack notifications
weight: 8
---

## Email

Email publishing settings can be found in **App settings > Publish > Email**.

Email publishing is the only publishing option that is enabled by default. Codemagic uses the email specified as the default one in the service you used to log in (Github, Bitbucket, Gitlab). You can add multiple email addresses.

If a build has finished successfully, release notes (if passed) and generated artifacts are published to the provided email.

If a build failed, you will be emailed a link for the build logs. Check **Publish artifacts even if tests fail** to publish artifacts even when one or more tests fail. If that option is unchecked, generated artifacts (if there are any) will be attached only to successful builds.

### MS Teams

To be able to receive emails from Codemagic to your MS Teams account, please go to your MS Teams account and make sure to choose **Anyone can send emails to this address** in **Get email address > advanced settings**.

Use only the part in angle brackets from the whole address line (e.g. `My awesome company <543l5kj43.some.address@somedomain.teams.ms>`).

## Slack

Publishing settings for Slack can be found in **App settings > Publish > Slack**.

To be able to use this publishing option for your personal applications, you need to enable Slack integration at **User settings > Integration > Slack**. Once your Slack workspace is connected, you can choose a channel that is going to be used for this. 

Similarly, if you want to use this publishing option for an application which belongs to a team, you need to enable Slack integration at **Teams > Your_team > Team integrations > Slack**.

If a build finished successfully, release notes (if passed) and generated artifacts are published in the specified channel.

If a build has failed, a link for the build logs is sent out. Check **Publish artifacts even if tests fail** to publish artifacts even when one or more tests fail. If the option is unchecked, generated artifacts (if any) will be attached to successful builds only.

To receive a notification when a build starts, check the checkbox **Notify when build starts**.


{{<notebox>}}
* `app`, `ipa`, `apk`, archive with Flutter web build directory and Linux application bundle files will be published.
* Email and Slack publishing settings can also be set from `codemagic.yaml`. More details [here](https://docs.codemagic.io/yaml/distribution/#publishing). Keep in mind that Slack integration still needs to be enabled.
* All the artifacts found by patterns in `.yaml` configuration will be published. More information on artifacts with `.yaml` configuration is [here](https://docs.codemagic.io/yaml/yaml/#artifacts).
{{</notebox>}}

---
title: Build distribution to tester groups
description: Distribute app builds to groups of testers
weight: 3
aliases:
---

Tester groups is a convenient way to manage the testers for your application in the Codemagic UI and distribute application builds to a group of emails outside Codemagic. 

{{<notebox>}}
Note that tester groups are only available for **teams** and can be used with apps configured using `codemagic.yaml`.
{{</notebox>}}

## Managing tester groups

Tester groups are **app-specific** and can be created and managed in app settings on the **Tester groups** tab. You can set up more than one tester group.

The tester invitation process supports bulk upload of tester emails, provided that email addresses are separated by a comma or a new line. 

Each invited tester will receive an email to confirm their consent to receive build emails with app artifacts. Based on the confirmation status, testers will have one of the following statuses in the UI:


* **"Active"** -- tester is eligible to receieve emails on successful app builds.
* **"Pending"** -- tester has not confirmed the invitation and will not receive any further emails until they confirm.
* **"Rejected"** -- delivery to that email has failed (e.g. email bounced) and the tester will not receive any further emails.

You can add new testers and remove existing ones anytime.

Note that you will also need to include the tester group in your codemagic.yaml workflow to publish builds to that group, see more about that [in the following section](#configuring-build-delivery-to-tester-groups).

## Updating workflows to send new build versions

In order to send testers publishing emails with app artifacts, the names of the tester groups must be specified in the `publishing` section of `codemagic.yaml` as follows:

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  tester_groups:
    - tester_group_1
    - tester_group_2
{{< /highlight >}}

This allows you to configure which workflows publish to tester groups and have different workflows publish to different groups. 

Note that publishing emails are only sent on successful builds. If the build fails, tester groups are not notified.

## Limit on the number of testers

By default, you are allowed to invite up to 20 testers across all applications in the team. Please get in touch with us should you require a higher limit.

---
title: Build distribution to tester groups
description: Distribute app builds to groups of testers
weight: 3
aliases:
---

Tester groups is a convenient way to manage the testers for your application in the Codemagic UI and distribute application builds to a group of emails outside Codemagic. 

{{<notebox>}}
Note that tester groups are only available for **teams** with billing enabled and can be used with apps configured using `codemagic.yaml`.
{{</notebox>}}

## Creating and managing tester groups

Tester groups are **app-specific** and can be created and managed in app settings on the **Tester groups** tab. You can set up more than one tester group.

Once you create a new group, enter the email addresses of the testers to be added to the group. Testers with valid email addresses will receive an invitation email to confirm their consent to receive emails with application builds. 

* On successful confirmation, the tester will show as **"Active"** in the UI and is eligible to receieve emails on successful app builds. Note that you will also need to include the tester group in your codemagic.yaml workflow to publish builds to that group, see more about that [here](#configuring-build-delivery-to-tester-groups).
* Testers that have not confirmed the invitation will remain **"Pending"** and will not receive any further emails until they complete confirmation.
* Tester emails that encounter delivery failures (e.g. they bounce) are marked **"Rejected"** in the UI and will not receive any further emails.

You can add new testers and remove existing ones anytime.

### Limit on the number of testers

By default, you are allowed to invite up to 20 testers across all applications in the team. Please get in touch with us should you require a higher limit.

## Configuring build delivery to tester groups

In order to send testers publishing emails with app artifacts, the names of the tester groups must be specified in the `publishing` section of `codemagic.yaml` as follows:

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  tester_groups:
    - tester_group_1
    - tester_group_2
{{< /highlight >}}

This allows you to configure which workflows publish to tester groups and have different workflows publish to different groups. 

Note that publishing emails are only sent on successful builds. If the build fails, tester groups are not notified.

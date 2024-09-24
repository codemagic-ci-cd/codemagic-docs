---
title: Build distribution to tester groups
description: Distribute app builds to groups of testers
weight: 3
aliases:
---

Tester groups are a convenient way to manage testers for your app in the Codemagic UI and distribute app builds to a group of email addresses outside of Codemagic. Testers who have confirmed their email addresses will receive an email with the app artifacts after every successful build of the workflow.

{{<notebox>}}
Note that tester groups are only available for **teams** and apps using the `codemagic.yaml` configuration.
{{</notebox>}}

## How to distribute builds to tester groups

Two steps are required to automate build distribution to tester groups.

### Step 1. Create a tester group

On the **Tester groups** tab in your app settings, create a new tester group and invite testers by entering their email addresses. You can invite many testers at once, provided that email addresses are separated by a comma or a new line.   

Note the name of the tester group as you will have to use it in the `codemagic.yaml` file.

### Step 2. Update the codemagic.yaml file

In order to send testers publishing emails with app artifacts, the names of the tester groups must be specified in the `publishing` section of `codemagic.yaml` as follows:

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  tester_groups:
    - tester_group_1
    - tester_group_2
{{< /highlight >}}

This allows you to configure which workflows publish to tester groups and have different workflows publish to different groups. 

Tester groups receive an email only when the workflow builds successfully. If the build fails, tester groups are not notified. 

## Testers management

Each invited tester will receive an email to confirm their consent to receive build emails with app artifacts. Only confirmed testers will receieve emails with app artifacts. 

In the UI, testers will have one of the following statuses:

* **"Active"** -- tester is eligible to receieve emails on successful app builds.
* **"Pending"** -- tester has not confirmed the invitation and will not receive any further emails until they confirm.
* **"Rejected"** -- delivery to that email has failed (e.g. email bounced) and the tester will not receive any further emails.

You can add new testers and remove existing ones anytime.

## Limit on the number of testers

By default, the number of testers is limited to 20 across all applications in the team. Please get in touch with us should you require a higher limit.

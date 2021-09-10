---
title: Webhooks
description: Set up webhooks for automatic builds
weight: 5
aliases: /building/webhooks
---

Webhooks are necessary in order to be able to trigger builds automatically in response to events in the repository.

* **GitHub**: Open your project and navigate to **Settings** > **Webhooks** > **Add webhook**, paste the **payload URL** from below (both `application/json` or `application/x-www-form-urlencoded` are supported as the **Content type**), and select the following events: **Branch or tag creation**, **Pull requests**, **Pushes**.

* **GitLab**: Navigate to **Settings** > **Webhooks**, paste the **payload URL** and check the following boxes in the **Trigger** section: **Push events**, **Tag push events**, **Merge request events**. Also, be sure to enable **SSL verification**.

* **Bitbucket**: Open your application repository, go to **Settings** > **Webhooks** (in **Workflow** section) > **Add webhook**, then enter an arbitrary title for the webhook and paste the **payload URL** in the **URL** field. For **Triggers**, select **Choose from a full list of triggers** and select the following events: **Push** in the **Repository** section and **Created**, **Updated**, **Merged** in the **Pull Request** section.

* **AWS CodeCommit**: Open your application repository, go to **Notify** > **Create notification rule**, then enter the name and move on to configure the details (if you do not have an initial target created, click **Create target** and set the type to **SNS Topic**). From the **Pull request** section check the **Source updated** and **Created** events, from the **Branches and tags** section, select the **Created** and **Updated** events. Navigate to the **Simple Notification Service** and click on **Create subscription** and paste in the Codemagic payload URL as an endpoint. Once done, you will find a new webhook with a link to subscribe to the **Simple Notification Service** in the Codemagic UI under **Application settings** > **Webhooks**.

 then enter an arbitrary title for the webhook and paste the **payload URL** in the **URL** field. For **Triggers**, select **Choose from a full list of triggers** and select the following events: **Push** in the **Repository** section and **Created**, **Updated**, **Merged** in the **Pull Request** section.

{{<notebox>}}
The payload URL has the following format: `https://api.codemagic.io/hooks/[appId]`. 

You can find your app ID in the browser URL after `app/` when you open the app on Codemagic: `https://codemagic.io/app/[appId]`
{{</notebox>}}

---
title: Webhooks
description: Set up webhooks for automatic builds
weight: 4
---

Webhooks are necessary in order to be able to trigger builds automatically in response to events in the repository.

* **GitHub**: Open your project and navigate to **Settings** > **Webhooks** > **Add webhook**, paste the **payload URL** from below (both `application/json` or `application/x-www-form-urlencoded` are supported as the **Content type**), and select the following events: **Branch or tag creation**, **Pull requests**, **Pushes**.

* **GitLab**: Navigate to **Settings** > **Webhooks**, paste the **payload URL** and check the following boxes in the **Trigger** section: **Push events**, **Tag push events**, **Merge request events**. Also, be sure to enable **SSL verification**.

* **Bitbucket**: Open your application repository, go to **Settings** > **Webhooks** (in **Workflow** section) > **Add webhook**, then enter an arbitrary title for the webhook and paste the **payload URL** in the **URL** field. For **Triggers**, select **Choose from a full list of triggers** and select the following events: **Push** in the **Repository** section and **Created**, **Updated**, **Merged** in the **Pull Request** section.

{{<notebox>}}
The payload URL has the following format: `https://api.codemagic.io/hooks/[appId]`. 

You can find your app ID in the browser URL after `app/` when you open the app on Codemagic: `https://codemagic.io/app/[appId]`
{{</notebox>}}

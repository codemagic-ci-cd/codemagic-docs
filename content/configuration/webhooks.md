---
title: Webhooks
description: Set up webhooks for automatic builds
weight: 6
aliases: [/building/webhooks, /flutter-configuration/webhooks]
---

Webhooks are necessary in order to be able to trigger builds automatically in response to events in the repository.

{{<notebox>}}
The payload URL has the following format: `https://api.codemagic.io/hooks/[appId]`.

You can find your app ID in the browser URL after `app/` when you open the app on Codemagic: `https://codemagic.io/app/[appId]`
{{</notebox>}}

All received webhooks are visible in the Codemagic UI when navigating to your application and selecting the **Webhooks** tab.

After configuring **Webhooks**, automatic build triggering can be set up as explained [here](https://docs.codemagic.io/flutter-configuration/automatic-build-triggering/). More information about how to set up automatic build triggering in the **yaml** file can be found [here](https://docs.codemagic.io/yaml/yaml-getting-started/#triggering)

## Setting up webhooks for Github

Open your project and navigate to **Settings** > **Webhooks** > **Add webhook**, paste the **payload URL** from above (both `application/json` or `application/x-www-form-urlencoded` are supported as the **Content type**), and select the following events: **Branch or tag creation**, **Pull requests**, **Pushes**.

## Setting up webhooks for GitLab

Navigate to **Settings** > **Webhooks**, paste the **payload URL** and check the following boxes in the **Trigger** section: **Push events**, **Tag push events**, **Merge request events**. Also, be sure to enable **SSL verification**.

## Setting up webhooks for Bitbucket

Open your application repository, go to **Settings** > **Webhooks** (in **Workflow** section) > **Add webhook**, then enter an arbitrary title for the webhook and paste the **payload URL** in the **URL** field. For **Triggers**, select **Choose from a full list of triggers** and select the following events: **Push** in the **Repository** section and **Created**, **Updated**, **Merged** in the **Pull Request** section.

## Setting up webhooks for AWS CodeCommit

To start using webhooks with **AWS CodeCommit**, it is first necessary to create a subscription with the **AWS Simple Notification Service**.

### Configuring the subscription

1. Open up **AWS Simple Notification Service** in the **AWS Console**.
2. Navigate to **Topics** > **Create topic**.
3. Set the type to **Standard**, give the topic a name and click on **Create topic**.
4. Navigate to **Subscriptions** > **Create subscription**.
5. Select the previously configured topic, set the protocol to **HTTPS**, and set the Codemagic **payload URL** as the endpoint. Proceed by clicking **Create subscription**.
6. In the Codemagic UI, navigate to your application and select the **Webhooks** tab.
7. Under **Recent deliveries**, choose the most recent webhook, and copy the subscription link under the **Results** tab to your browser.

### Configuring webhook events

Open your application repository and navigate to **Notify** > **Create notification rule** and enter a name for your Notification rule.

Under **Events that trigger notifications**, select the **Source updated** and **Created** events in the **Pull request** section and the **Created** and **Updated** events in the **Branches and tags** section.

Set the target type to **SNS topic**, select a configured target and click on **Submit**.

## Setting up webhooks for Azure DevOps

Open your application repository, go to **Project Settings** > **Service Hooks**, click on **Create a new subscription...** and select **Web Hooks**. Under **Trigger on this type of event**, choose the event you wish to trigger builds for. Codemagic supports **Code pushed**, **Pull request created**, and **Pull request updated** events. In Azure, each of the events requires its own webhook. Once the event has been selected, choose your repository under filters and configure any additional settings.

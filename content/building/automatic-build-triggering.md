---
title: Automatic build triggering
weight: 2
---

In order to fully automate your CI/CD pipeline, you can set up automatic build triggering by configuring which branches to track and when to trigger builds.

Build triggers can be configured in **App settings > Build triggers**.

## Tracking specific branches

The branches tracked for building are selected by entering branch patterns and including or excluding the matching branches. Note that you can either enter the exact name of the branch to select it or use the wildcard symbols listed in the table below to select more than one branch with one pattern.

![](../uploads/2019/07/branch_patterns-1.png)

The first (i.e. topmost) pattern in the list is applied first. Each following pattern will limit the set of branches further. In the case of conflicting patterns, the latter one will prevail. You can check the targeted branches by clicking the eye icon next to **Watched branch patterns**.

To add a new branch pattern:

1. Navigate to **App settings >** **Build triggers**.
2. Enter a pattern matching the name of one or more branches in the project.
3. Select **Include** or **Exclude** from the dropdown to limit the set of targeted branches by either including or excluding the matching branches.
4. For **pull request builds**, select whether the tracked branch is the **Source** or the **Target** branch of the pull request. This setting has no effect on other types of builds.
5. Click **Add pattern** to save it. You can always edit or delete added patterns.
6. Click **Save** at the end of the section for the changes to take effect.

## Build triggers

Under Automatic build triggering, you can select when to trigger builds.

**Trigger on push**. When checked, a build will be started every time you commit code to any of the tracked branches.

**Trigger on pull request update** (not supported for apps from custom sources). When checked, your workflow is run when a pull request is opened or updated to verify the resulting merge commit. 

* For triggering pull requests, you can specify whether each branch pattern matches the **source** or the **target** branch of the pull request.

* If you want to only run tests for pull requests and skip building for platforms, select **Run tests only** under Build > Build for platforms.

**Trigger on tag creation**. When checked, Codemagic will automatically build the tagged commit whenever you create a tag for this app. Note that the watched branch settings have no effect on tag builds.

**Cancel outdated webhook builds**. When checked, Codemagic will automatically cancel all ongoing and queued builds triggered by webhooks on push or pull request commit when a more recent build has been triggered for the same branch. We recommend enabling this feature when you're making several commits, each of which triggers a build.

If you don't check any of these triggering options, you will have to run builds manually for this workflow.

## Webhooks

Codemagic automatically adds webhooks to GitHub, GitLab, and Bitbucket after you have enabled any of the triggers in **App settings** > **Automatic build triggering**.

In case of failure to add a webhook, you should manually set up the webhook in your repository hosting service to enable automatic builds in response to events in the repository.

* **GitHub**: Open your project and navigate to **Settings** > **Webhooks** > **Add webhook**, paste the **payload URL** from below, make sure **Content type** is `application/json` and select the following events: **Branch or tag creation**, **Pull requests**, **Pushes**.

* **GitLab**: Navigate to **Settings** > **Webhooks**, paste the **payload URL** and check the following boxes in the **Trigger** section: **Push events**, **Tag push events**, **Merge request events**. Also, be sure to enable **SSL verification**.

* **Bitbucket**: Open your application repository, go to **Settings** > **Webhooks** (in **Workflow** section) > **Add webhook**, then enter an arbitrary title for the webhook and paste the **payload URL** in the **URL** field. For **Triggers**, select **Choose from a full list of triggers** and select the following events: **Push** in the **Repository** section and **Created**, **Updated**, **Merged** in the **Pull Request** section.

{{<notebox>}}
The payload URL has the following format: `https://api.codemagic.io/hooks/[appId]`. 

You can find your app ID in the browser URL after `app/` when you open the app on Codemagic: `https://codemagic.io/app/[appId]`
{{</notebox>}}

## Custom build triggers

Build triggering in response to custom events can be set up by sending a `POST` request to the `https://api.codemagic.io/builds` endpoint. 

`POST https://api.codemagic.io/builds`

Content:

        {
        "appId": "----appId----",
        "workflowId": "-----workflowId-----,
        "branch": "masters"
        }

Header:

`"x-auth-token": "----token----"`

`x-auth-token` is available via **User settings** > **Integrations** > **Codemagic API** > **Show**.

You can find the `workflowId` and `appId` from your **App settings** > **Workflow settings** > **Build status badge** > **Badge markdown**.

Badge markdown has the following format: `(api.codemagic.io/apps/[appId]/[workflowId]/status_badge.svg)`

For use with YAML configuration, `workflowId` is the workflow ID in your `codemagic.yaml` configuration file shown below:
```
workflows:
  my-workflow:                # workflow ID 
    name: My workflow name    # workflow name displayed in UI
```

## Skipping builds

If you do not wish Codemagic to build a particular commit, include `[skip ci]` or `[ci skip]` in your commit message.

---
categories:
  - Build configuration
date: '2019-03-31T15:09:08+03:00'
menu:
  docs_sidebar:
    weight: 1
title: Automatic build triggering
weight: 1
---

In order to fully automate your CI/CD pipeline, you can set up automatic build triggering by configuring which branches to track and when to trigger builds.

Build triggers can be configured in **App settings > Build triggers**.

## Targeting specific branches

The branches targeted for building are selected by entering branch patterns and including or excluding the matching branches. Note that you can either enter the exact name of the branch to select it or use the wildcard symbols listed in the table below to select more than one branch with one pattern.

![](/uploads/tracked branches.PNG)

The first (i.e. topmost) pattern in the list is applied first. Each following pattern will limit the set of branches further. You can check the targeted branches by clicking the eye icon next to **Watched branch patterns**.

To add a new branch pattern:

1. Navigate to the **Build triggers** section in App settings.
2. Enter a pattern matching the name of one or more branches in the project.
3. Select **Include** or **Exclude** from the dropdown to limit the set of targeted branches by either including or excluding the matching branches.
4. Click **Add pattern** to save and apply it. You can always edit or delete added patterns.

## Build triggers

Under Automatic build triggering, you can select when to trigger builds.

![](/uploads/automatic build triggering.PNG)

**Trigger on every push**. When checked, a build will be started every time you commit code to any of the tracked branches.

**Trigger on pull request update** (not supported for apps from custom sources). When checked, Codemagic will run the tests for the opened or updated pull request (merge request in GitLab jargon) without building the Android or the iOS app and pass the result back to the repository.

{{% notebox %}}

**Note on apps hosted in Bitbucket**  
Webhooks for building pull request updates are automatically created for new apps but should be reviewed for apps added prior to releasing the **Trigger on pull request update** option. In Bitbucket, go to **Settings > Webhooks > Edit > Pull Requests** and make sure to check **Created** and **Updated**.

{{% /notebox %}}

If you don't check any of these triggering options, you will have to run builds manually for this workflow.

## Skipping builds

If you do not wish Codemagic to build a particular commit, include `[skip ci]` or `[ci skip]` in your commit message.

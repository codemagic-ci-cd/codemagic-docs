---
title: Starting builds automatically with Flutter workflow editor
linkTitle: Starting builds automatically
description: How to setup builds to run on repository events or on schedule
weight: 4
aliases: 
  - /flutter-configuration/automatic-build-triggering
  - /flutter/automatic-build-triggering
---

In order to fully automate your CI/CD pipeline, you can set up automatic build triggering by configuring which branches to track and when to trigger builds.

Build triggers can be configured in **App settings > Build triggers**.

Codemagic automatically adds webhooks to the repositories added via GitHub app or from GitHub, GitLab or Bitbucket via the OAuth integration after you have enabled any of the triggers in this section. For repositories added via SSH or HTTP/HTTPS, you would have to [set up webhooks manually](../building/webhooks). Note that webhook triggers might not be supported for all repository providers.



## Build triggers

Under **Automatic build triggering**, you can select when to trigger builds.

{{<notebox>}}
**Note:** If you have a `codemagic.yaml` in your repository root, it is automatically used for configuring builds that are triggered in response to the events defined in the file and any configuration in the Flutter workflow editor is ignored.
{{</notebox>}}

**Trigger on push**. When checked, a build will be started every time you commit code to any of the tracked branches.

**Trigger on pull request update**. When checked, your workflow is run when a pull request is opened or updated to verify the resulting merge commit. 

* For triggering pull requests, you can specify whether each branch pattern matches the **source** or the **target** branch of the pull request.

* If you want to only run tests for pull requests and skip building for platforms, select **Run tests only** under **Build > Build for platforms**.

**Trigger on tag creation**. When checked, Codemagic will automatically build the tagged commit whenever you create a tag for this app. Note that the watched branch settings do not affect tag builds.

If enabled, you would be able to specify tag patterns to trigger builds. Similarly to **Watched branch patterns**, the first pattern in the list is applied first and each pattern will limit the set of tag labels further. In the case of conflicting patterns, the latter will prevail. Using wildcard symbols is supported, click **Show pattern examples** for more information.

**Cancel outdated webhook builds**. When checked, Codemagic will automatically cancel all ongoing and queued builds triggered by webhooks on push or pull request commit when a more recent build has been triggered for the same branch. We recommend enabling this feature when you're making several commits, each of which triggers a build.

If you don't enable any automatic build triggers, you can start builds only manually for this workflow.



## Tracking specific branches and tags

You can configure the branches and tags to track under **Watched branch pattern
s** and **Watched tag patterns** respectively.

The branches and tags tracked for building are selected by entering branch patterns and including or excluding the matching branches.

Note that you can either enter the exact name of the branch or tag to select it or use the wildcard symbols to select more than one branch with one pattern. Click **Show pattern examples** in the UI for tips. Additionally, please refer to [Wildcard Match Documentation](https://facelessuser.github.io/wcmatch/fnmatch/) for more advanced matching patterns.

The first (i.e. topmost) pattern in the list is applied first. Each following pattern will limit the set of branches further. In the case of conflicting patterns, the latter will prevail. You can check the targeted branches by clicking the eye icon next to **Watched branch patterns**.

To add a new branch pattern:

1. Navigate to **App settings > Build triggers > Watched branch patterns**.
2. Enter a pattern matching the name of one or more branches in the project.
3. Select **Include** or **Exclude** from the dropdown to limit the set of targeted branches by either including or excluding the matching branches.
4. For **pull request builds**, select whether the tracked branch is the **Source** or the **Target** branch of the pull request. This setting does not affect other types of builds.
5. Click **Add pattern** to save it. You can always edit or delete added patterns.

To add a new tag pattern:

1. Navigate to **App settings > Build triggers > Watched tag patterns**.
2. Enter a tag pattern.
5. Click **Add pattern** to save it. You can always edit or delete added patterns.

## Exit or ignore build on certain commit message

You can **skip building** automatically triggered workflows by adding `[skip ci]` or `[ci skip]` to your commit message. The workflow will still be started but it will exit without building.

If you want to exit a build **when commit message does not include certain string**, then you can add the following script at the top of your scripts section and it will take care of exiting the build or moving forward. In the following example, builds will proceed only if the commit message includes **_buildcd_** string.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Exit build if keyword not defined
      script: | 
        set -e
        set -x
        export COMMIT_MSG=$(git log -1 --pretty=%B)
        echo COMMIT_MSG
        if [[ $COMMIT_MSG != *"buildcd"* ]]
          then
            echo "Commit needs to include 'buildcd' in it's message."
            exit 1
          else 
            echo "Commit message includes 'buildcd', moving forward..."
        fi 
{{< /highlight >}}

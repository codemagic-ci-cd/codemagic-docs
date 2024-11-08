---
title: Starting builds automatically with codemagic.yaml
linkTitle: Starting builds automatically
description: How to setup builds to run on repository events
weight: 4
aliases: 
---


In order to fully automate your CI/CD pipeline, you can set up automatic build triggering by configuring which branches to track and when to trigger builds.

`triggering:` section in `codemagic.yaml` defines the events for automatic build triggering and watched branches. If no events are defined, you can start builds only manually.

For repositories added via SSH or HTTP/HTTPS, or if you are configuring your builds using `codemagic.yaml`, you would have to [set up webhooks manually](../building/webhooks). Note that webhook triggers might not be supported for all repository providers.

{{<notebox>}}
**Note:** The team admin who added the repository can update the webhook by clicking the **Update webhook** button in the Codemagic UI.
{{</notebox>}}

## Build triggers

In the `events:` section, specify which events in the repository trigger builds.
- **push** - a build will be started every time you commit code to any of the tracked branches.
- **pull_request** - a build will be started when a pull request is opened or updated to verify the resulting merge commit.
     
    For triggering pull requests, you can specify whether each branch pattern matches the **source** or the **target** branch of the pull request.

- **pull_request_labeled** - a build will be started every time you add a new label to a **GitHub** pull request.

- **tag** - Codemagic will automatically build the tagged commit whenever you create a tag for this app. Note that the watched branch settings do not affect tag builds.

    If enabled, you would be able to specify `tag_patterns:` to trigger builds. Similarly to **Watched branch patterns**, the first pattern in the list is applied first and each pattern will limit the set of tag labels further. In the case of conflicting patterns, the latter will prevail. Using wildcard symbols is supported.

To avoid running builds on outdated commits, you can set `cancel_previous_builds` to automatically cancel all ongoing and queued builds triggered by webhooks on push or pull request commit when a more recent build has been triggered for the same branch.

{{<notebox>}}
**Note:** When starting workflows using webhooks, Codemagic uses the `codemagic.yaml` file from the source branch. If you are triggering builds on Pull requests, make sure the PR source branch has a valid `codemagic.yaml` file. Otherwise, the build will be skipped and the **Recent deliveries** section in **Apps > Webhooks** will show a message similar to _*"Webhook is skipped. There are no workflows configured to run on pull request from 'testing' to 'release'"*_.
{{</notebox>}}

## Tracking specific branches and tags

Instead of watching all branches and tags, you can limit automatic build triggering to branches or tags whose name matches a specific pattern.

The branches tracked for building are selected by configuring the `branch_patterns` section. The tracked tags can be configured in the `tag_patterns` section.

A pattern can match the name of a particular branch or tag. You can use wildcard symbols to create a pattern that matches several branches or tags, see the examples below.

Note that for pull request builds, you have to specify whether the watched branch is the source or the target of the pull request.

The first (i.e. topmost) pattern in the list is applied first. Each following pattern will limit the set of values further. In the case of conflicting patterns, the latter will prevail.


{{< highlight yaml "style=paraiso-dark">}}
triggering:
  events:                       # List the events that trigger builds
    - push
    - pull_request
    - pull_request_labeled      #GitHub only
    - tag
  branch_patterns:              # Include or exclude watched branches
    - pattern: '*'
      include: true
      source: true
    - pattern: excluded-target
      include: false
      source: false
    - pattern: included-source
      include: true
      source: true
  tag_patterns:                 # Include or exclude watched tag labels
    - pattern: '*'
      include: true
    - pattern: excluded-tag
      include: false
    - pattern: included-tag
      include: true
  cancel_previous_builds: false  # Set to `true` to automatically cancel outdated webhook builds
{{< /highlight >}}

### Pattern examples

| Pattern | Explanation |
|-|-|
|`*`| Matches everything |
|`*-dev`| Matches values with the suffix `-dev`, e.g. `v0.0.42-dev`|
|`!(*-dev)`| Matches values without the suffix `-dev`, e.g. `v0.0.42`|
|`{test,qa}/*`| Matches values with the prefix `test/` or `qa/`, e.g. `test/popup`|
|`v+([0-9]).+([0-9]).+([0-9])`| Matches tags with three numbers, e.g. `v0.0.42`|

Please refer to [Wildcard Match Documentation](https://facelessuser.github.io/wcmatch/fnmatch/) for more advanced matching patterns.

## Working with Pull Requests
When dealing with pull requests, you have two options: you can either focus on the branch where the proposed changes are made, or you can target the destination branch after the pull request has been merged.

**Example 1**. When creating pull requests on the `main` branch from a `feature` branch, which is a way to propose and review changes before they're integrated into `main`, remember to set `source:false` and `pattern:main`. This will ensure that the build runs on the proposed code changes within the `feature` branch when pull request is created or updated.

{{< highlight yaml "style=paraiso-dark">}}
triggering:
  events:
    - pull_request
  branch_patterns:
    - pattern: 'main'
      include: true
      source: false  
{{< /highlight >}}

**Example 2**. Setting `source:true`, `pattern:main` will trigger the build on the `main` branch once the pull request has been merged from the `feature` branch into the `main` branch.

{{< highlight yaml "style=paraiso-dark">}}
triggering:
  events:
    - push
    - pull_request
  branch_patterns:
    - pattern: 'main'
      include: true
      source: true  
{{< /highlight >}}

{{<notebox>}}
**Note:** The above pattern is set for the `main` branch but you can set similar patterns for any branch depending on your workflow.
{{</notebox>}}

**Example 3**. Trigger a build when adding a label to your pull request.

{{< highlight yaml "style=paraiso-dark">}}
triggering:
  events:
    - pull_request_labeled
{{< /highlight >}}
You will learn later in this page how to add a [condition](#using-condition-inside-when) to filter the added labels.

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




## Using `when` to run or skip builds

In addition to [build triggers](#build-triggers) and [branch filtering](#tracking-specific-branches), you can further specify and automate workflow behavior by using `when` keyword to run or skip a build depending on the specified `changeset` and `condition` states.

### Using `changeset` inside `when`

By using `changeset` setting, you can avoid unnecessary builds when functional components of your repository were not modified. 

{{<notebox>}}
**Note:** After `changeset` setting is configured in `codemagic.yaml`, the subsequent build will be triggered regardless of the condition and only after that successful build, builds will be skipped according to the `changeset` condition.
{{</notebox>}}

When using `changeset` filtering, a build will be run if any of the following is true:
- `codemagic.yaml` file was modified
- watched files/folders have changed **since the last successful build**

You should specify the files to watch in `changeset` by using the `includes` and `excludes` keys.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  sample-workflow:
    name: Sample App workflow
    triggering:
      events:
        - push
    when:
      changeset:
        includes:
          - '.'
        excludes:
          - '**/*.md'
{{< /highlight >}}


In this case, the build would be skipped if there were changes only to Markdown files `.md`.

Both the `includes` and `excludes` keys in `changeset` are *optional*. If the `includes` key is not specified, its value will default to `'.'` (track everything). The `excludes` key defaults to no exclusions.

{{<notebox>}}
**Note:** Adding one or more `includes` keys will disable the default "include all" behavior. Remember to add the `'.'` pattern if needed.
{{</notebox>}}

If you use a monorepo, each workflow can be responsible for building a part of your application. Use conditional workflow triggering and specify the path to the application in the changeset as in the example below.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build-android:
    name: Build Android
    triggering:
      events:
        - push
    when:
      changeset:
        includes:
          - 'android/'
{{< /highlight >}}


As a result, commits with changes outside of the `android` folder will skip a build.

{{<notebox>}}
**Note:** 'Skipping' a build means that the build will be triggered and only after fetching app sources and meeting the **changeset** condition, the build will be stopped.
{{</notebox>}}

{{<notebox>}}
**Note:** The **`codemagic.yaml`** is always included in the changeset by default.
{{</notebox>}}



### Using `condition` inside `when`

Use `condition` to run or skip a build depending on the values of environment variables or webhook payload.

The `condition` you specify will be evaluated during the build. The build will be skipped if the condition evaluates to `false`.

You can use logical operators `==`, `not`, `and`, `or`.

Environment variables are available under the `env` variable. You can check [built-in](https://docs.codemagic.io/variables/environment-variables/) or other environment variables.

Webhook payload is available under the `event` variable. You can check the structure of the webhook payloads that your git provider sends on the **Webhooks** tab in application settings. Note that `event` is not available if the build is started manually from the UI or by a schedule.

{{< collapsible title="Webhook payload sample" >}}
Here's a JOSN payload from GitHub which you can access from the `event` variable.
```json
{
    "action": "labeled", // could be "opened", "synchronize", "reopened", or "ready_for_review"
    "number": 2,
    "pull_request": {
      "url": "https://api.github.com/repos/username/repo/pulls/2",
      "id": 100000000,
      "issue_url": "https://api.github.com/repos/username/repo/issues/2",
      "number": 2,
      "state": "open",
      "title": "fix-2",
      "user": {
        "login": "username",
        "id": 100000000,
        "url": "https://api.github.com/users/username",
        ...
      },
      "created_at": "2023-10-18T05:27:35Z",
      "updated_at": "2023-10-18T05:28:21Z",
      "assignee": null,
      "assignees": [],
      "requested_reviewers": [],
      "requested_teams": [],
      "labels": [
        {
          "id": 100000000,
          "url": "https://api.github.com/repos/username/repo/labels/label",
          "name": "label",
          "color": "6816E0",
          "default": false,
          "description": ""
        }
      ],
      "draft": false,
      "merged": false,
      "mergeable": true,
      "rebaseable": true,
      "mergeable_state": "clean",
      "merged_by": null,
      "comments": 0,
      "review_comments": 0,
      "maintainer_can_modify": false,
      "commits": 1,
      "additions": 2,
      "deletions": 4,
      "changed_files": 1,
      ...
    },
    "label": {
      "id": 100000000,
      "url": "https://api.github.com/repos/username/repo/labels/label",
      "name": "label",
      "color": "6816E0",
      "default": false,
      "description": ""
    },
    "repository": {
      "id": 100000000,
      "name": "repo",
      "full_name": "username/repo",
      "private": true,
      "html_url": "https://github.com/username/repo",
      "created_at": "2023-10-16T11:24:57Z",
      "updated_at": "2023-10-16T11:24:57Z",
      "pushed_at": "2023-10-18T05:27:35Z",
      "git_url": "git://github.com/username/repo.git",
      "visibility": "private",
      "default_branch": "main",
      ...
    },
    "sender": {
      "login": "username",
      "id": 100000000,
      "url": "https://api.github.com/users/username",
      "type": "User",
      ...
    },
    ...
  }
```
{{< /collapsible >}}


**Example 1**. This build will continue if the triggering event was *not* a draft pull request update. In other words, it will skip the build if a pull request is marked as a draft:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build:
    name: Build on PR update
    triggering:
      events:
        - pull_request
    when:
      condition: not event.pull_request.draft
{{< /highlight >}}

**Example 2**. Use built-in environment variables in the condition. This build will continue only if the source branch is "master." In other words, it will skip the build if the source branch of the pull request is anything other than "master," regardless of the destination branch.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build:
    name: Build on PR update
    triggering:
      events:
        - pull_request
    when:
      condition: env.CM_BRANCH == "master"
{{< /highlight >}}

**Example 3**. This build is triggered on adding a label to a pull request but will continue only if the label added was anything else than "codemagicTest":

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build:
    name: Build on PR update
    triggering:
      events:
        - pull_request_labeled
    when:
      condition: not event.pull_request.labels[0].name == "codemagicTest"
{{< /highlight >}}

**Example 4**. You can also combine triggering conditions, just make sure that each condition is wrapped in brackets:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build:
    name: Build on PR update
    triggering:
      events:
        - pull_request
        - pull_request_labeled
    when:
      condition: (not event.pull_request.draft) and (not event.pull_request.labels[0].name == "codemagicTest")
{{< /highlight >}}

{{<notebox>}}
**Note:** Condition expression is evaluated only after cloning the repository so the builds will be started regardless of the `condition`. However, if a `condition` is not met, the build will terminate early and will be marked as `skipped`.
{{</notebox>}}
## Using `when` to run or skip build steps

You may want to either run or skip some specific build steps in your workflow when building your application.

Both `changeset` and `condition` are supported for build steps.


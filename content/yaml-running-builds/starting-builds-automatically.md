---
title: Starting builds automatically with codemagic.yaml
linkTitle: Starting builds automatically
description: How to setup builds to run on repository events
weight: 4
aliases: 
---


In order to fully automate your CI/CD pipeline, you can set up automatic build triggering by configuring which branches to track and when to trigger builds.

`triggering:` section in `codemagic.yaml` defines the events for automatic build triggering and watched branches. If no events are defined, you can start builds only manually.

When using the Flutter workflow editor, Codemagic automatically adds webhooks to the repositories added via GitHub app or from GitHub, GitLab or Bitbucket via the OAuth integration after you have enabled any of the triggers in this section. For repositories added via SSH or HTTP/HTTPS, or if you are configuring your builds using `codemagic.yaml`, you would have to [set up webhooks manually](../building/webhooks). Note that webhook triggers might not be supported for all repository providers.



## Build triggers

Under the `events:` section you can specify on which events the builds should be triggered:
- **push** - a build will be started every time you commit code to any of the tracked branches.
- **pull_request** - your workflow is run when a pull request is opened or updated to verify the resulting merge commit.
     
    For triggering pull requests, you can specify whether each branch pattern matches the **source** or the **target** branch of the pull request.

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
When dealing with Pull Requests, you have two options: you can either focus on the branch where the proposed changes are made, or you can target the destination branch after the PR has been merged.

Example 1 - When creating pull requests on the `feature` branch, remember to set `source:false`. This will ensure that the build runs on the proposed code changes within the `feature` branch.

{{< highlight yaml "style=paraiso-dark">}}
triggering:
      events:
        - pull_request
      branch_patterns:
        - pattern: 'feature'
          include: true
          source: false  
{{< /highlight >}}

Example 2 - To merge Pull Requests with the `master/main` branch, simply set `source:true`. This will trigger the build on `master/main` branch once the pull request has been merged.

{{< highlight yaml "style=paraiso-dark">}}
triggering:
      events:
        - pull_request
      branch_patterns:
        - pattern: 'feature'
          include: true
          source: true  
{{< /highlight >}}


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

Example 1. This build will continue if the triggering event was *not* a draft pull request update. In other words, it will skip the build if a pull request is marked as a draft:

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

Example 2. This build will *not* continue if the pull request branch has a specific label name, "codemagicTest" in the following sample:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build:
    name: Build on PR update
    triggering:
      events:
        - pull_request
    when:
      condition: not event.pull_request.labels[0].name == "codemagicTest"
{{< /highlight >}}

Example 3. You can also combine triggering conditions, just make sure that each condition is wrapped with brackets:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build:
    name: Build on PR update
    triggering:
      events:
        - pull_request
    when:
      condition: (not event.pull_request.draft) and (event.pull_request.labels[0].name == "codemagicTest)
{{< /highlight >}}

{{<notebox>}}
**Note:** Condition expression is evaluated only after cloning the repository so the builds will be started regardless of the `condition`. However, if a `condition` is not met, the build will terminate early and will be marked as `skipped`.
{{</notebox>}}
## Using `when` to run or skip build steps

You may want to either run or skip some specific build steps in your workflow when building your application.

Both `changeset` and `condition` are supported for build steps.


---
title: Starting builds automatically
description: How to setup builds to run on repository events
weight: 4
aliases: 
---


In order to fully automate your CI/CD pipeline, you can set up automatic build triggering by configuring which branches to track and when to trigger builds.

`triggering:` section in `codemagic.yaml` defines the events for automatic build triggering and watched branches. If no events are defined, you can start builds only manually.

Codemagic automatically adds webhooks to the repositories added via GitHub app or from GitHub, GitLab or Bitbucket via the OAuth integration after you have enabled any of the triggers in this section. For repositories added via SSH or HTTP/HTTPS, you would have to [set up webhooks manually](../building/webhooks). Note that webhook triggers might not be supported for all repository providers.



## Build triggers

Under the `events:` section you can specify on which events the builds should be triggered:
- **push** - a build will be started every time you commit code to any of the tracked branches.
- **pull** - your workflow is run when a pull request is opened or updated to verify the resulting merge commit.
     
    For triggering pull requests, you can specify whether each branch pattern matches the **source** or the **target** branch of the pull request.

- **tag** - Codemagic will automatically build the tagged commit whenever you create a tag for this app. Note that the watched branch settings do not affect tag builds.

    If enabled, you would be able to specify `tag_patterns:` to trigger builds. Similarly to **Watched branch patterns**, the first pattern in the list is applied first and each pattern will limit the set of tag labels further. In the case of conflicting patterns, the latter will prevail. Using wildcard symbols is supported.

To avoid running builds on outdated commits, you can set `cancel_previous_builds` to automatically cancel all ongoing and queued builds triggered by webhooks on push or pull request commit when a more recent build has been triggered for the same branch.



## Tracking specific branches

The branches tracked for building are selected by configuring `branch_patterns:` section. 
A branch pattern can match the name of a particular branch, or you can use wildcard symbols to create a pattern that matches several branches. Note that for pull request builds, you have to specify whether the watched branch is the source or the target of the pull request.

The first (i.e. topmost) pattern in the list is applied first. Each following pattern will limit the set of branches further. In the case of conflicting patterns, the latter will prevail.


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
  tag_patterns:                 # Include or exlude watched tag labels
    - pattern: '*'
      include: true
    - pattern: excluded-tag
      include: false
    - pattern: included-tag
      include: true
  cancel_previous_builds: false  # Set to `true` to automatically cancel outdated webhook builds
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

That’s not entirely correct. We would run script if
the watched paths or codemagic.yaml was updated at some point
there is no build that finished successfully since the last modification of watched files/dirs and codemagic.yaml

In addition to [build triggers](#build-triggers) and [branch filtering](#tracking-specific-branches), you can further specify and automate workflow behavior by using `when` keyword to run or skip a build depending on the specified `changeset` and `condition` states.

### Using `changeset` inside `when`

Using `changeset` setting. you can avoid unnecessary builds when functional components of your repository were not modified. Use conditional workflow triggering to skip building the workflow if the watched files were not updated since the last successful build.

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


As a result, commits with changes outside of the `android` folder will not trigger a build.

{{<notebox>}}
**Note:** The **`codemagic.yaml`** is always included in the changeset by default.
{{</notebox>}}



### Using `condition` inside `when`

Use `condition` to run or skip a build depending on the values of environment variables or webhook payload.

The `condition` you specify will be evaluated during the build. The build will be skipped if the condition evaluates to `false`.

You can use logical operators `==`, `not`, `and`, `or`.

Environment variables are available under the `env` variable. You can check [built-in](https://docs.codemagic.io/variables/environment-variables/) or other environment variables.

Webhook payload is available under the `event` variable. You can check the structure of the webhook payloads that your git provider sends on the **Webhooks** tab in application settings. Note that `event` is not available if the build is started manually from the UI or by a schedule.

For example, this build will continue if the triggering event was *not* a draft pull request update:

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


## Using `when` to run or skip build steps

You may want to either run or skip some specific build steps in your workflow when building your application.

Both `changeset` and `condition` are supported for build steps.


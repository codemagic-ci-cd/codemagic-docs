---
title: Run builds and builds steps conditionally
description: Configure conditions when build or build step should be run
---

In addition to the triggers specified in the [triggering section](/yaml/yaml-getting-started/#triggering) of `codemagic.yaml`, it is possible to define custom conditions for more control over when to run builds and build steps.

## Skip building a specific commit

Include `[skip ci]` or `[ci skip]` in your commit message, if you do not wish Codemagic to build a particular commit.

## Using `when` to run or skip builds

Add the `when` key to the workflow root to either skip or run it depending on the specified `changeset` and `condition`.

For example, a workflow or script step will run if recent changes include changes to Markdown files (`.md`) *and* the current build is triggered by a PR update webhook and the PR is not a draft PR.

```yaml
when:
  changeset:
    includes:
      - '**/*.md'
  condition: event.pull_request.draft == false
```

### Using `changeset` inside `when`

You can avoid unnecessary builds when functional components of your repository were not modified. Use conditional workflow triggering to skip building the workflow if the watched files were not updated since the last successful build.

You should specify the files to watch in `changeset` by using the `includes` and `excludes` keys.

```yaml
workflows:
  build-app:
    name: Build App
    triggering:
      events:
        - push
    when:
      changeset:
        includes:
          - '.'
        excludes:
          - '**/*.md'
```

In this case, the build would be skipped if there were changes only to Markdown files `.md`.

Note that `codemagic.yaml` is always included in the changeset by default.

Both keys `includes` and `excludes` in `changeset` are *optional*. If the `includes` key is not specified, its value will default to `'.'`. The `excludes` key defaults to no exclusions.

If you use a monorepo, each workflow can be responsible for building a part of your application. Use conditional workflow triggering and specify the path to the application in the changeset as in the example below.

```yaml
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
```

As a result, commits with changes outside of the `android` folder will not trigger a build.

### Using `condition` inside `when`

Use `condition` for checking values of environment variables or webhook payload values to either run or skip build.

The `condition` you specify will be evaluated during the build. The build will be skipped if the condition evaluates to `false`.

The current environment is accessible under the `env` variable.

For example, the build will not run if the current branch is not master:

```yaml
workflows:
  build-master:
    name: Build master branch
    when:
      condition: env.FCI_BRANCH != 'master'
```

Webhook payload is accessible under the `event` variable. Note that `event` is not available if the build is started manually from the UI or by a schedule.

Be sure to check the webhook event body in your application settings on the Webhooks tab.

Note that in addition to `and` it is possible to use other logical operators in conditions, e.g. `not`, `or`.

## Using `when` to run or skip build steps

You may want to either run or skip some specific build steps in your workflow when building your application.

Both `changeset` and `condition` are supported for build steps.


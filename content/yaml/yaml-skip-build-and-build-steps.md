---
title: Skip builds and build steps conditionally
description: Configure conditions when build or build step should be run
weight: 3
---

## Skip building a specific commit

Include `[skip ci]` or `[ci skip]` in your commit message, if you do not wish Codemagic to build a particular commit.

## Using `when` to skip builds

Add `when` key to a workflow root to either skip it or run it, depending on the specified `changeset` and `condition`.

For example, a workflow or script step will run if recent changes include changes to Markdown files (`.md`) *and* the current build is PR update webhook and the PR not draft PR.

```yaml
when:
  changeset:
    includes:
      - '**/*.md'
  condition: event.pull_request.draft == true
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

If you use a monorepo, each workflow could be responsible for building a part of your application. Use conditional workflow triggering and specify the path to the application in the changeset as in the example below.

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

As a result, commits with changes outside of the android folder will not trigger a build.


### Using `condition` inside `when`

`condition` will be evaluated during the build. Build will be skipped if condition evaluates to `false`.

Current environment is accessible under `env` variable.

Examples

```python
env.ENV == 'debug'  # build will run if ENV is equal to `debug`
env.PLATFORM == 'windows'  # build will run if PLATFORM is equal to `windows`
env.FCI_BRANCH != 'master' # build will be skipped if the current branch is not master
```

Webhook payload is accessible under `event` variable. Note that `event` is not available if build started manually or by a schedule.

Be sure to check the webhook event body in application settings under Webhooks tab.

For the purpose of giving an example, let's assume that webhook body is equal to the following structure

```json
{
  "pull_request": {"draft": true},
  "repository": {"open_issues_count": 3},

  ...
}


```python
event.pull_request.draft == true  # build will run only for draft pull requests
event.repository.open_issues_count > 1  # build will run if issues count is more than one
```

It's possible to use logical operators in conditions, e.g. `not`, `and`, `or`.

```python
event.pull_request.draft == false and event.repository.open_issues_count
```

## Using `when` to skip build steps

You may also want to skip some specific steps when building your application. Use the same approach with scripts.

Both `changeset` and `condition` are supported for build steps.

```yaml
workflows:
  build-android:
    name: Build All
    environment:
      vars:
        CI_ENV: debug
    scripts:
      - name: Build Android
        script: ./gradlew assembleDebug
        when:
          changeset:
            includes:
              - 'android/'
            excludes:
              - '**/*.md'
          condition: env.CI_ENV == 'debug'
```


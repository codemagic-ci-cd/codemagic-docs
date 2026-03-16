---
title: CI integration
description: Release updates automatically from CI
weight: 6
---

CodePush updates can be published manually from a developer machine, but many teams choose to release OTA updates from CI pipelines.

Releasing from CI allows updates to be automatically deployed after successful builds, tests, or merges. This makes OTA updates part of the normal delivery workflow.

This reduces manual release steps and keeps OTA updates consistent with the rest of your CI/CD process.

Typical CI release flow:

```
commit
→ CI build
→ tests pass
→ CodePush release command
→ update deployed
```

In most cases the CI pipeline runs the same `release-react` command used locally.

```
build succeeds
→ release-react
→ update deployed
```

To publish updates from CI, the pipeline must:

- install the CodePush CLI
- authenticate using an access token
- run the release command

## Releasing from Codemagic

Codemagic workflows can publish OTA updates as part of a build pipeline.

A typical pattern is to run the release command after the build and tests complete successfully.

Example step in `codemagic.yaml`:

```
scripts:

  - name: Install CodePush CLI
    script: |
      npm install -g @codemagic/code-push-cli

  - name: Release CodePush update
    script: |
      code-push login --accessKey $CODEPUSH_TOKEN
      code-push release-react MyApp-Android android
```

The pipeline performs the following steps:

```
build app
→ authenticate with CodePush
→ bundle JavaScript
→ upload update
```

The access token should be stored as a **secure environment variable** in the Codemagic project settings.

## Releasing from GitHub Actions

CodePush releases can also be triggered from GitHub Actions or other CI systems.

Example GitHub Actions step:

```
- name: Install CodePush CLI
  run: npm install -g @codemagic/code-push-cli

- name: Release CodePush update
  run: |
    code-push login --accessKey $CODEPUSH_TOKEN
    code-push release-react MyApp-Android android
```

As with Codemagic, the access token should be stored as a repository secret.

## Choosing when to release OTA updates

Teams use different strategies for triggering OTA releases.

Common approaches include:

Release on every successful merge to the main branch:

```
merge to main
→ CI build
→ publish OTA update
```

Release only for specific commits or tags:

```
tag created
→ CI build
→ publish OTA update
```

Release manually through CI pipelines:

```
developer triggers pipeline
→ OTA update published
```

The appropriate strategy depends on how frequently updates should be delivered and how tightly the OTA workflow should be coupled with the CI pipeline.

## Best practices

When integrating CodePush with CI, it is recommended to:

- store access tokens as secure secrets
- restrict who can trigger OTA release pipelines
- release to **Staging** first and promote to **Production**
- monitor update metrics after deployment

These practices help ensure that OTA updates are released safely and predictably.

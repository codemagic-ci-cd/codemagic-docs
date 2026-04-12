---
title: CI integration
description: Release updates automatically from CI
meta_title: Automate CodePush OTA Releases from CI/CD Pipelines
meta_description: Automate CodePush OTA releases from continuous integration, including workflow configuration, tokens, release commands, and pipeline patterns.
weight: 6
---

CodePush updates can be published manually from a developer machine, but many teams choose to release OTA updates from CI pipelines.

For a one-page list of CLI commands (including `login` and `release-react`), see [CLI quick reference](/rn-codepush/cli-quick-reference/).

Releasing from CI allows updates to be automatically deployed after successful builds, tests, or merges. This makes OTA updates part of the normal delivery workflow.

This reduces manual release steps and keeps OTA updates consistent with the rest of your CI/CD process.

Typical CI release flow:

{{< highlight text "style=paraiso-dark">}}
commit
→ CI build
→ tests pass
→ CodePush release command
→ update deployed
{{< /highlight >}}

In most cases the CI pipeline runs the same `release-react` command used locally.

{{< highlight text "style=paraiso-dark">}}
build succeeds
→ release-react
→ update deployed
{{< /highlight >}}

To publish updates from CI, the pipeline must:

- [install the CodePush CLI]()
- [authenticate using an access token]()
- [run the release command]()

## Releasing from Codemagic

Codemagic workflows can publish OTA updates by running the CodePush CLI as part of a build step.

They use the same commands you would run locally (such as release-react), and there is no separate “dashboard publish” mechanism for OTA releases.

A common pattern is to trigger the CodePush release only after a successful build and test phase as shown above.

Example step in `codemagic.yaml`:

{{< highlight bash "style=paraiso-dark">}}
scripts:
  - name: Install CodePush CLI
    script: |
      npm install -g @codemagic/code-push-cli

  - name: Release CodePush update
    script: |
      code-push login "https://codepush.pro" --accessKey $CODEPUSH_TOKEN
      code-push release-react MyApp-Android android
```
{{< /highlight>}}

The pipeline performs the following steps:

{{< highlight text "style=paraiso-dark">}}
build app
→ install CLI tools
→ authenticate with CodePush
→ bundle JavaScript
→ upload update
{{< /highlight >}}

The access token should be stored as a **secure environment variable** in the Codemagic project settings.

## Releasing from GitHub Actions

CodePush releases can also be triggered from GitHub Actions or other CI systems.

Example GitHub Actions steps:
Create a repository secret (for example **`CODEPUSH_TOKEN`**). Without an **`env`** block, `$CODEPUSH_TOKEN` in **`run`** is empty—map the secret as shown, or use `${{ secrets.CODEPUSH_TOKEN }}` in the command instead.

{{< highlight bash "style=paraiso-dark">}}
- name: Install CodePush CLI
  run: npm install -g @codemagic/code-push-cli

- name: Release CodePush update
  env:
    CODEPUSH_TOKEN: ${{ secrets.CODEPUSH_TOKEN }}
  run: |
    code-push login "https://codepush.pro" --accessKey $CODEPUSH_TOKEN
    code-push release-react MyApp-Android android
{{< /highlight>}}

As with Codemagic, the access token should be stored as a repository secret.

## Choosing when to release OTA updates

Teams can choose different strategies for triggering OTA (CodePush) releases depending on their workflow, release frequency, and risk tolerance.

**1. Release on every merge to main**

In this approach, every change merged into the main branch automatically triggers an OTA release.

Typical flow:

{{< highlight text "style=paraiso-dark">}}
merge to main
→ CI build
→ tests pass
→ OTA update published
{{< /highlight >}}

**2. Release based on tags or specific commits**

Here, OTA updates are only published when a version tag or specific commit is created.

Typical flow:

{{< highlight text "style=paraiso-dark">}}
tag created (e.g. v1.2.0)
→ CI build
→ OTA update published
{{< /highlight >}}

**3. Manual CI-triggered releases**

In this model, OTA releases are triggered manually via the CI system.

Typical flow:

{{< highlight text "style=paraiso-dark">}}
developer triggers pipeline
→ CI build
→ OTA update published
{{< /highlight >}}

OTA release strategy is not fixed—teams choose the level of automation based on how often they want to ship and how much control they need over production deployments.

## Best practices

When integrating CodePush with CI, it is recommended to:

- store access tokens as secure secrets
- restrict who can trigger OTA release pipelines
- release to **Staging** first and promote to **Production**
- monitor update metrics after deployment

These practices help ensure that OTA updates are released safely and predictably.

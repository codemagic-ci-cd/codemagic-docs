---
title: Capawesome Cloud integration
description: How to publish Live Updates to Capawesome Cloud from your Codemagic workflows using codemagic.yaml
weight: 4
---

[Capawesome Cloud](https://capawesome.io/cloud/) delivers [Live Updates](https://capawesome.io/docs/cloud/live-updates/) to [Capacitor](https://capacitorjs.com/) and [Cordova](https://cordova.apache.org/) apps: you publish a new version of your web assets and users receive it over the air, without going through an App Store or Google Play review. This guide shows how to publish a Live Update from a Codemagic workflow with the [Capawesome CLI](https://capawesome.io/docs/cloud/cli/).

A sample project that shows how to configure the Capawesome Cloud integration is available [in our Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/capawesome_cloud_demo_project).

## Prerequisites

Before wiring Capawesome Cloud into `codemagic.yaml`, make sure that:

1. You have a [Capawesome Cloud](https://console.cloud.capawesome.io) account and an app. Note the **app ID**; you will need it in every command below.
2. The Live Update SDK is installed and configured in your project, as described in the [Getting Started guide](https://capawesome.io/docs/cloud/live-updates/setup/).
3. A native build that includes the SDK has been shipped to your users. Live Updates can only change the **web layer**; the native binary must already contain the plugin.

## Configure access to Capawesome Cloud

The Capawesome CLI authenticates with an API token. Follow these steps to make it available to your Codemagic builds:

1. Generate a new token via the [Tokens](https://console.cloud.capawesome.io/settings/tokens) page of the Capawesome Cloud Console. The token is shown only once, so copy it right away.
2. Open your Codemagic app settings, and go to the **Environment variables** tab.
3. Enter `CAPAWESOME_TOKEN` as the **_Variable name_**. The CLI reads this variable automatically, so no login step is needed in your scripts.
4. Copy and paste the Capawesome Cloud token string as **_Variable value_**.
5. Enter the variable group name, e.g. **_capawesome_credentials_**. Click the button to create the group.
6. Make sure the **Secret** option is selected.
7. Click the **Add** button to add the variable.
8. Add a second (non-secret) variable `CAPAWESOME_APP_ID` with the ID of your app to the same group.
9. Add the variable group to your `codemagic.yaml` file:

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - capawesome_credentials
{{< /highlight >}}

## Publish a Live Update

Build your web assets, make sure the target channel exists, and upload the bundle. The same commands work for Capacitor and Cordova apps:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install dependencies
      script: | 
        npm ci
    - name: Build web assets
      script: | 
        npm run build
    - name: Create channel (no-op if it already exists)
      script: | 
        npx @capawesome/cli apps:channels:create \
          --app-id $CAPAWESOME_APP_ID \
          --name production \
          --ignore-errors
    - name: Upload Live Update to Capawesome Cloud
      script: | 
        npx @capawesome/cli apps:liveupdates:upload \
          --app-id $CAPAWESOME_APP_ID \
          --path dist \
          --channel production \
          --git-ref $CM_COMMIT
{{< /highlight >}}

- Replace `dist` with the directory that contains your built web assets (e.g. `www` for Ionic Angular and Cordova projects). It is the same directory as `webDir` in your Capacitor configuration.
- `--git-ref $CM_COMMIT` associates the bundle with the commit that produced it.
- `apps:channels:create --ignore-errors` is idempotent, so you don't need to create channels by hand.
- The CLI exits with a non-zero code if the upload fails, which fails the Codemagic build.
- `npx @capawesome/cli` resolves to the latest CLI release. For reproducible pipelines, pin it to a specific version (e.g. `npx @capawesome/cli@4.27.0`).

Once the upload completes, the bundle is available to every device subscribed to the channel. Other useful upload options are `--rollout-percentage` for [gradual rollouts](https://capawesome.io/docs/cloud/live-updates/rollouts/) and `--private-key` for [code signing](#sign-your-bundles). See the [CLI command reference](https://capawesome.io/docs/cloud/cli/commands/#appsliveupdatesupload) for the full list.

### Use versioned channels

A Live Update must stay compatible with the native binary installed on the device. Capawesome Cloud recommends [versioned channels](https://capawesome.io/docs/cloud/live-updates/channels/#versioned-channels) for this: each native release is pinned to its own channel (e.g. `production-<versionCode>`) at build time, and bundles are uploaded to the matching channel.

If you use the Codemagic `BUILD_NUMBER` as the native version code when [versioning your builds](../knowledge-codemagic/build-versioning/), derive the channel name from it:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Upload Live Update to the versioned channel
      script: | 
        CHANNEL="production-$BUILD_NUMBER"
        npx @capawesome/cli apps:channels:create \
          --app-id $CAPAWESOME_APP_ID \
          --name $CHANNEL \
          --ignore-errors
        npx @capawesome/cli apps:liveupdates:upload \
          --app-id $CAPAWESOME_APP_ID \
          --path dist \
          --channel $CHANNEL \
          --git-ref $CM_COMMIT
{{< /highlight >}}

This also works when the same workflow builds and publishes the native app on Codemagic (see [Ionic Capacitor apps](../yaml-quick-start/building-an-ionic-app/) or [Ionic Cordova apps](../yaml-quick-start/building-a-cordova-app/)): add the Live Update step after the web build, and every native release ships with a matching bundle in its own channel.

### Sign your bundles

[Code signing](https://capawesome.io/docs/cloud/live-updates/code-signing/) lets your app verify that every Live Update was produced by you. To sign bundles in Codemagic:

1. Generate a key pair on your machine with `npx @capawesome/cli apps:liveupdates:generatesigningkey` and add the public key to your app configuration as described in the [code signing guide](https://capawesome.io/docs/cloud/live-updates/code-signing/#configure-the-public-key).
2. Add the **content** of `private.pem` as a secret environment variable (e.g. `CAPAWESOME_PRIVATE_KEY`) to the `capawesome_credentials` group in Codemagic.
3. Pass the variable with `--private-key`, which accepts the key content directly:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Upload signed Live Update
      script: | 
        npx @capawesome/cli apps:liveupdates:upload \
          --app-id $CAPAWESOME_APP_ID \
          --path dist \
          --channel production \
          --git-ref $CM_COMMIT \
          --private-key "$CAPAWESOME_PRIVATE_KEY"
{{< /highlight >}}

{{<notebox>}}
**Warning:** Never commit `private.pem` to your repository. Keep it only in the Codemagic secret variable.
{{</notebox>}}

## Full `codemagic.yaml` example

A Live Update only needs your web assets, so the workflow does not require a macOS machine or any native tooling. The following workflow publishes a Live Update on every push to `main`:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  live-update-workflow:
    name: Publish Live Update to Capawesome Cloud
    max_build_duration: 30
    instance_type: linux_x2
    environment:
      groups:
        - capawesome_credentials # <-- (Includes CAPAWESOME_TOKEN and CAPAWESOME_APP_ID)
      node: 20
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
          include: true
          source: true
    scripts:
      - name: Install dependencies
        script: | 
          npm ci
      - name: Build web assets
        script: | 
          npm run build
      - name: Create channel (no-op if it already exists)
        script: | 
          npx @capawesome/cli apps:channels:create \
            --app-id $CAPAWESOME_APP_ID \
            --name production \
            --ignore-errors
      - name: Upload Live Update to Capawesome Cloud
        script: | 
          npx @capawesome/cli apps:liveupdates:upload \
            --app-id $CAPAWESOME_APP_ID \
            --path dist \
            --channel production \
            --git-ref $CM_COMMIT
    publishing:
      email:
        recipients:
          - user_one@example.com
        notify:
          success: true
          failure: true
{{< /highlight >}}

{{<notebox>}}
**Note:** In CI, the CLI never prompts for input. Pass every required value as a flag and add `--yes` to commands that ask for confirmation. If authentication fails, check that the `capawesome_credentials` group is referenced in the workflow and that the variable is named `CAPAWESOME_TOKEN`. See [Scripting](https://capawesome.io/docs/cloud/cli/scripting/) for the CLI's behaviour in CI.
{{</notebox>}}

## Further reading

- [Live Updates documentation](https://capawesome.io/docs/cloud/live-updates/), including [rollouts](https://capawesome.io/docs/cloud/live-updates/rollouts/), [rollbacks](https://capawesome.io/docs/cloud/live-updates/rollbacks/) and [troubleshooting](https://capawesome.io/docs/cloud/live-updates/troubleshooting/)
- [Capawesome CLI command reference](https://capawesome.io/docs/cloud/cli/commands/)

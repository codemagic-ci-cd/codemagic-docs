---
title: HotCodePush integration
description: How to ship over-the-air updates with HotCodePush using codemagic.yaml
weight: 11
---

[HotCodePush](https://hotcodepush.com/) is the over-the-air (OTA) update service for [React Native](https://reactnative.dev/), [Expo](https://expo.dev/), [Capacitor](https://capacitorjs.com/) and [Cordova](https://cordova.apache.org/) apps. An OTA update replaces the web or JavaScript layer of an app that is already in the App Store or Google Play. The native layer stays as it is, so a native change still needs a store release.

This page assumes that the HotCodePush [quickstart](https://hotcodepush.com/docs/quickstart) has run in your project: `npx hotcodepush init` installed the SDK, wrote `hotcodepush.json` and wired a build step into the native builds. The [CLI reference](https://hotcodepush.com/docs/cli) lists every command and option.

## Configure access to HotCodePush

Follow these steps to configure access to HotCodePush:

1. Sign in to the [HotCodePush console](https://console.hotcodepush.com) and create an API token under [Settings › Tokens](https://console.hotcodepush.com/settings/tokens). A token expires after 30 days by default, so pick a longer expiry for a pipeline.
2. Open your Codemagic app settings, and go to the **Environment variables** tab.
3. Enter `HOTCODEPUSH_TOKEN` as the **_Variable name_**. The CLI reads this exact name.
4. Copy and paste the token as **_Variable value_**.
5. Enter the variable group name, e.g. **_hotcodepush_**. Click the button to create the group.
6. Make sure the **Secret** option is selected.
7. Click the **Add** button to add the variable.
8. Add the variable group to your `codemagic.yaml` file

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - hotcodepush
{{< /highlight >}}

{{<notebox>}}
**Note:** Keep the token out of `vars` in `codemagic.yaml`, since that section is committed with the file. If your app signs its bundles, add a second secret variable `HOTCODEPUSH_SIGNING_KEY` with the content of the private key file, in its own group. See [Sign your bundles](https://hotcodepush.com/docs/guides/code-signing).
{{</notebox>}}

## Register your store builds

The build step that `init` wired into the native build runs `hotcodepush binary create`. It registers each store build with HotCodePush together with the bundle it ships, so a device only takes an OTA update that matches its build. In CI this step needs `HOTCODEPUSH_TOKEN`, so add the variable group to every workflow that builds for the App Store or Google Play:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-store-build:
    environment:
      groups:
        - hotcodepush
{{< /highlight >}}

Before the native build runs `xcode-project build-ipa` or `./gradlew`, the workflow prepares the project as usual:

- React Native: `npm ci`
- Expo: `npm ci`, then `npx expo prebuild`
- Capacitor: `npm ci`, `npm run build`, `npx cap sync`
- Cordova: `npm ci`, then `cordova platform add`

The CLI needs Node.js 22 or later. The default Codemagic build machines ship it.

## Ship an OTA update with HotCodePush

A workflow on every push to `main` releases the merge as an OTA update:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ota-release:
    name: Release to production
    instance_type: mac_mini_m2
    environment:
      groups:
        - hotcodepush
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
          include: true
    scripts:
      - name: Install dependencies
        script: npm ci
      - name: Build the web app
        script: npm run build
      - name: Release to production
        script: npx hotcodepush release create --channel production --bundle-version "$(git rev-parse --short HEAD)" --git-ref "$CM_BRANCH" --yes --json
{{< /highlight >}}

A few notes on this workflow:

- The **Build the web app** step is for Capacitor and Cordova apps. A React Native or Expo app drops it, because the CLI packages the bundle per platform inside the upload.
- `--channel` names the [channel](https://hotcodepush.com/docs/concepts/channels) the release goes to. Without it the CLI uses the channel from `hotcodepush.json`.
- `--bundle-version` labels the bundle with the short commit hash, so the release log names the commit. Without it the CLI uses the version from `package.json`.
- `--git-ref "$CM_BRANCH"` records the branch the release came from.
- `--yes` answers the confirmation that a pipeline cannot answer. `--json` prints the result, or the error, as JSON.

The CLI uploads the bundle, releases it to the channel and waits until it is live. Devices take the update within about a minute. A failed command fails the step with the CLI's exit code, and the [error catalog](https://hotcodepush.com/docs/cli/errors) names the fix.

We recommend that you pin the CLI as a dev dependency, so `npm ci` installs the version your team tested:

{{< highlight bash "style=paraiso-dark">}}
npm install --save-dev --save-exact hotcodepush
{{< /highlight >}}

The HotCodePush [Codemagic recipe](https://hotcodepush.com/docs/ci/codemagic) covers preview channels per pull request and gradual rollouts from the same workflow.

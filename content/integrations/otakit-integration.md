---
title: OtaKit integration
description: How to integrate your workflows with OtaKit using codemagic.yaml
weight: 17
---

[OtaKit](https://otakit.app/) is an open-source live-update service for [Capacitor](https://capacitorjs.com/) apps. It lets you ship web-layer changes (JavaScript, HTML and CSS) to apps after they have been published to the App Store or Google Play. You can use the hosted service or [self-host](https://otakit.app/docs/self-host) it.

## Configure access to OtaKit

Follow these steps to give your Codemagic workflow access to OtaKit:

1. Sign up for [OtaKit](https://console.otakit.app/), create an app and note its **App ID** (`app_...`)
2. In the OtaKit dashboard, go to **Settings** > **API Keys** and create a new API key (`otakit_sk_...`)
3. Open your Codemagic app settings, and go to the **Environment variables** tab.
4. Enter the desired **_Variable name_**, e.g. `OTAKIT_TOKEN`.
5. Copy and paste the API key as **_Variable value_**.
6. Enter the variable group name, e.g. **_otakit_credentials_**. Click the button to create the group.
7. Make sure the **Secret** option is selected.
8. Click the **Add** button to add the variable.
9. Repeat steps 4 to 8 for `OTAKIT_APP_ID` with your OtaKit App ID, in the same group.
10. Add the variable group to your `codemagic.yaml` file

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - otakit_credentials
{{< /highlight >}}

The OtaKit CLI reads `OTAKIT_TOKEN` and `OTAKIT_APP_ID` from the environment, so no login step is needed in CI. If you self-host OtaKit, also add `OTAKIT_SERVER_URL` with the URL of your server.

## Configure your project

Add the OtaKit plugin to your Capacitor app:

{{< highlight bash "style=paraiso-dark">}}
  npm install @otakit/capacitor-updater
  npx cap sync
{{< /highlight >}}

Set your OtaKit App ID in **capacitor.config.ts**:

{{< highlight typescript "style=paraiso-dark">}}
  plugins: {
    OtaKit: {
      appId: "YOUR_OTAKIT_APP_ID",
    },
  },
{{< /highlight >}}

Then call `notifyAppReady()` once your app has loaded. If a new bundle never confirms that it started, OtaKit rolls back to the previous one automatically:

{{< highlight typescript "style=paraiso-dark">}}
import { OtaKit } from "@otakit/capacitor-updater";

await OtaKit.notifyAppReady();
{{< /highlight >}}

Only devices running a native build that includes the plugin can receive live updates, so publish a store build with the plugin before relying on them.

## Deploy a live update to OtaKit

Build your web assets, then upload the bundle with the OtaKit CLI. By default the CLI uploads the `webDir` from your Capacitor config:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install dependencies
      script: |
        npm ci
    - name: Build web assets
      script: |
        npm run build
    - name: Upload to OtaKit
      script: |
        npx --yes @otakit/cli@latest upload
{{< /highlight >}}

`upload` on its own only uploads the bundle, so you can release it later from the dashboard. To release it to devices in the same step, add `--release`, which releases to the base channel:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Upload and release to OtaKit
      script: |
        npx --yes @otakit/cli@latest upload --release
{{< /highlight >}}

To release to a named channel instead, for example for testers, pass the channel name:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Upload and release to the staging channel
      script: |
        npx --yes @otakit/cli@latest upload --release staging
{{< /highlight >}}

Every release is signed, devices verify each download before applying it, and you can roll a release out to a percentage of devices from the dashboard or the CLI. See the [OtaKit CLI reference](https://otakit.app/docs/cli) for all options. We recommend pinning the CLI version (for example `@otakit/cli@1.12.0`) after your first successful build.

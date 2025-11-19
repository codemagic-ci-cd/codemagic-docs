---
title: Capgo integration
description: How to integrate your workflows with Capgo using codemagic.yaml
weight: 5
---

[Capgo](https://capgo.app/) allows you to deploy live updates for Capacitor apps after they have been published to the App Store or Google Play.

A sample project that shows how to configure Capgo integration is available [in our Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/capgo_integration_demo_project).


## Configuring Capgo in Codemagic

### Configure environment variables

In order to get live updates in your Capgo account via Codemagic, you need to complete the following steps:

1. Sign up with [Capgo](https://capgo.app/) to get your login token

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `CAPGO_TOKEN`.
3. Copy and paste the Capgo token string as **_Variable value_**.
4. Enter the variable group name, e.g. **_capgo_credentials_**. Click the button to create the group.
5. Make sure the **Secret** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - capgo_credentials
{{< /highlight >}}


### Configure your project

There are two ways of configuring your Capacitor project with Capgo: automatic and manual.

#### Automatic mode

Enable it by running the following command with your CAPGO_TOKEN:

`npx @capgo/cli init [CAPGO_TOKEN]`

#### Manual mode

1. Add the Capgo plugin to your packages

`npm i @capgo/capacitor-updater`

2. Modify your Capacitor project by adding the following in your **capacitor.config.json**

{{< highlight json "style=paraiso-dark">}}
  "plugins": {
      "CapacitorUpdater": {
          "autoUpdate": true,  
          "version": "1.0.0" // Bump this number each time you release a native version in the app store
      }
  }
{{< /highlight >}}

2. Inside your main app file (index.tsx), import the following package:

{{< highlight TypeScript "style=paraiso-dark">}}
import { CapacitorUpdater } from '@capgo/capacitor-updater'

CapacitorUpdater.notifyAppReady()
{{< /highlight >}}


### Configure `codemagic.yaml`

Add the following scripts to your `codemagic.yaml` file to:
- upload your project to Capgo

Ensure you first install your dependencies and build your JS:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Update dependencies and copy web assets to native project
      script: | 
        npx cap sync
    - name: Upload to Capgo
      script: | 
        npx @capgo/cli bundle upload --a $CAPGO_TOKEN
{{< /highlight >}}


When uploading app versions to **Capgo**, executing the following command will submit updates to all users (if production channel is set to public):

{{< highlight yaml "style=paraiso-dark">}}
  npx @capgo/cli@latest bundle upload -c production
{{< /highlight >}}

As soon as users start installing app versions on their devices, a device list will be visible in the Capgo UI. You can choose any one of them in order to let specific groups of users know about updates shipped with version uploads.

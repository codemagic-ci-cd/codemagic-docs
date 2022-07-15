---
title: Steam
description: How to deploy an app to Steam using codemagic.yaml
weight: 5
---

Codemagic allows you to deploy your unity application to Steam.

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**.
{{</notebox>}}

## Prerequisites

- A Unity **Plus** or **Pro** license. Your license is used to activate Unity on the Codemagic build server so the project can be built. The license is returned automatically once the workflow completes.
- A Steam Partner account is required to publish to Steam.

## Getting Started

SteamCMD is the tool used to upload builds to Steam. SteamCMD requires logging into Steam and will normally require a Steam Guard code be entered.
To solve this problem, there are two options.

1. Disable Steam Guard for the account doing the Steam upload.  This is not recommended, as it makes the Steam account less secure.

2. Use sentry files that are generated after logging in successfully to Steam on the build machine. When these sentry files are present on the build machine, a Steam Guard code is not required.
So we are going to save the sentry files as secure environment variables and then place them at the correct path when the build starts.

### Obtain the sentry files:
First you need to install the SteamCMD.
{{< tabpane >}}
{{% tab header="MacOS" %}}
```shell
   mkdir ~/Steam
   curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf - -C ~/Steam
```

{{% /tab %}}

{{% tab header="Linux" %}}
```shell
   sudo apt-get install lib32gcc1
   mkdir ~/Steam 
   curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz" | tar zxvf - -C ~/Steam
```
{{< /tab >}}

{{< /tabpane >}}

Then log into Steam with the following, which will prompt for the Steam Guard code:
```shell
   ~/Steam/steamcmd.sh +login steam $STEAM_USERNAME $STEAM_PASSWORD
```
You can now see the **ssfn** file in `~/Steam/ssfn*******************` and the **config.vdf** file at `~/Steam/config/config.vdf`.

{{<notebox>}}
Warning: Keep the sentry files private; don't check them into public source control.
{{</notebox>}}

- Save the ssfn file name, ssfn file itself, and the config file to the respective environment variables in the **Environment variables** section in Codemagic UI, so they can be used in subsequent builds. Click **Secure** to encrypt the values. Note that binary files (i.e. ssfn, config.vdf) have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to environment variables and decoded during the build.

{{<notebox>}}
Warning: When you are base64 encoding the files, make sure to remove the new lines `\n` of the encoded value before saving it to Codemagic. 
{{</notebox>}}

If you don't want to install the SteamCMD on your local machine to obtain the sentry files, you can use Codemagic machines to do so and then copy them into your local machine using the secure copy command `scp`.
```shell
   scp -P <port> builder@X.X.X.X ~/Library/Application\ Support/ssfn******************* .
   scp -P <port> builder@X.X.X.X ~/Library/Application\ Support/config/config.vdf .
```

### Decode Sentry Files
In your workflow you need to base64 decode these files:
```yaml
      - name: Decode Sentry files
        script: | 
          echo $CONFIG_FILE | base64 --decode > steam/config.vdf
          echo $SSFN_FILE | base64 --decode > steam/$SSFN_FILE_NAME
```

### Copy Sentry files
And then copy them to the correct path:
{{< tabpane >}}
{{% tab header="MacOS" %}}
```yaml
      - name: Copy Sentry Files
        script: | 
          mkdir -p ~/Library/Application\ Support/Steam/config
          cp ~/clone/steam/$SSFN_FILE_NAME ~/Library/Application\ Support/Steam
          cp ~/clone/steam/config.vdf ~/Library/Application\ Support/Steam/config
```

{{% /tab %}}

{{% tab header="Linux" %}}
```yaml
      - name: Copy Sentry Files
        script: | 
          mkdir -p ~/Steam/config
          cp ~/clone/steam/$SSFN_FILE_NAME ~/Steam
          cp ~/clone/steam/config.vdf ~/Steam/config
```
{{< /tab >}}

{{< /tabpane >}}

### Upload to Steam
To configure the upload to Steam, edit the following two files in the demo project:
```
   steam/app_build.vdf
   steam/depot_build.vdf
```
These are standard VDF files required for uploading a build to Steam and require your application's AppID, DepotID and branch name for deployment.

And then use the script to publish your app to steam:
```yaml
      - name: Upload Build to Steam
        script: | 
          ~/Steam/steamcmd.sh +login $STEAM_USERNAME $STEAM_PASSWORD +run_app_build ~/clone/steam/app_build.vdf +quit
```

See the sample project [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/unity/unity-deploy-steam).
---
title: Steam
description: How to deploy an app to Steam using codemagic.yaml
weight: 15

---

Codemagic enables you to automatically publish your Windows/MacOS/Linux desktop app to Steam.

{{<notebox>}}
This guide only applies to workflows configured with **codmegic.yaml**.
{{</notebox>}}

{{<notebox>}}
A Steam Partner account is required to create and configure an app to appear on Steam.
{{</notebox>}}

### Upload to Steam

steamcmd is a tool used to upload builds to Steam, and can be installed as part of the build workflow using:

```
   - name: Install steamcmd
      script: |
         mkdir ../Steam
         curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf - -C ../Steam
```

To upload the build use:

```
   - name: Upload Build to Steam
      script: |
         ../Steam/steamcmd.sh +login $STEAM_USERNAME $STEAM_PASSWORD +run_app_build /path/to/app_build.vdf +quit 
```

{{<notebox>}}
Set up STEAM_USERNAME and STEAM_PASSWORD as secure environment variables for your Codemagic application.
{{</notebox>}}

To configure the upload to Steam, edit the following two files in the demo project:
```
   steam/app_build.vdf
   steam/depot_build.vdf
```

These are standard VDF files required for uploading a build to Steam and require your application's AppID, DepotID and branch name for deployment.

### Steam Guard

Logging into Steam using steamcmd will normally ask for a Steam Guard code, unless that is disabled by the Steam account.

To ensure the build machine does not get stuck waiting for a Steam Guard code, you can copy sentry files that get generated after logging in successfully to Steam on the build machine. When these sentry files are present on the build machine, a Steam Guard code is not required.

To obtain the sentry files, expand the "Explore build machine via SSH or VNC client" stage when making a build for the command to SSH into the build machine.  Once access is obtained, install steamcmd with:

```
   mkdir Steam
   curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf - -C Steam
```

Then log into Steam with the following, which will prompt for the Steam Guard code:
```
   Steam/steamcmd.sh +login <steam username> <steam password>
```

After entering the Steam Guard code and successfully logging into Steam, you will need to copy two files to your local machine using scp.  Issue the following commands from your local machine:
```
   scp -P <port> builder@X.X.X.X ~/Library/Application\ Support/ssfn******************* .
   scp -P <port> builder@X.X.X.X ~/Library/Application\ Support/config/config.vdf .
```

Once the ssfn and config.vdf files are obtained, they must be included in your depot so they can be copied onto the build machine in subsequent builds using:
```
   - name: Copy Sentry Files
      script: |
         mkdir ~/Library/Application\ Support/Steam
         cp ~/clone/steam/ssfn******************* ~/Library/Application\ Support/Steam
         mkdir ~/Library/Application\ Support/Steam/config
         cp ~/clone/steam/config.vdf ~/Library/Application\ Support/Steam/config        
```

{{<notebox>}}
The cp commands above assume the sentry files were copied to a steam directory under the root of the project.
{{</notebox>}}
---
title: Steam
description: How to deploy an app to Steam using codemagic.yaml
weight: 8
---

</p>
{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **codemagic.yaml**.
{{</notebox>}}

A sample project showcasing steps included in this guide is available in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/unity/unity-deploy-steam).

## Prerequisites

- A Unity **Plus** or **Pro** license. Your license is used to activate Unity on the Codemagic build server so the project can be built. The license is returned automatically once the workflow completes.
- A Steam Partner account is required to publish to Steam.

## Getting Started

**SteamCMD** is a tool used to upload builds to Steam. SteamCMD requires logging in to Steam and typically requires entering a Steam Guard code.
There are two ways of solving this problem.

1. Disable Steam Guard for the account doing the Steam upload.  This is not recommended, as it makes the Steam account less secure.

2. Use sentry files that are generated after logging in successfully to Steam. A Steam Guard code is not required when these sentry files are present on the build machine.
Thus, we will save the sentry files as secure environment variables and place them at the correct path when the build starts.

### Obtain the sentry files:
First, you need to install the SteamCMD.
{{< tabpane >}}
{{% tab header="macOS" %}}
{{< highlight bash "style=paraiso-dark">}}
   mkdir ~/Steam
   curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz" | tar zxvf - -C ~/Steam
{{< /highlight >}}


{{% /tab %}}

{{% tab header="Linux" %}}
{{< highlight bash "style=paraiso-dark">}}
   sudo apt-get install lib32gcc1
   mkdir ~/Steam 
   curl -sqL "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz" | tar zxvf - -C ~/Steam
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

Then log into Steam using the following command, which will prompt for the Steam Guard code:
{{< highlight bash "style=paraiso-dark">}}
   ~/Steam/steamcmd.sh +login steam $STEAM_USERNAME $STEAM_PASSWORD
{{< /highlight >}}

The **ssfn** file will be stored as `~/Steam/ssfn*******************` and the **config.vdf** file as `~/Steam/config/config.vdf`.

{{<notebox>}}
**Warning:** Keep the sentry files private; do not check them into public source control.
{{</notebox>}}

### Configure environment variables

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `SSFN_FILE_NAME`.
3. Enter the ssfn file name as **_Variable value_**.
4. Enter the variable group name, e.g. **_steam_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Enter another variable named `SSFN_FILE` and copy/paste the `base64` encoded value of the ssfn file. Follow the instructions for [storing binary files](/yaml-basic-configuration/configuring-environment-variables/#storing-binary-files).
8. Repeat the previous step to add the `config.vdf` file as a variable named `CONFIG_FILE`.


{{<notebox>}}
**Warning:** When base64 encoding the files, make sure to remove the new lines `\n` of the encoded value before saving it to Codemagic. 
{{</notebox>}}

If you don't want to install the SteamCMD on your local machine to obtain the sentry files, you can use Codemagic machines to do so and then copy them into your local machine using the secure copy command `scp`.
{{< highlight bash "style=paraiso-dark">}}
   scp -P <port> builder@X.X.X.X ~/Library/Application\ Support/ssfn******************* .
   scp -P <port> builder@X.X.X.X ~/Library/Application\ Support/config/config.vdf .
{{< /highlight >}}

### Decode Sentry Files
In your workflow you need to base64 decode these binary files before they can be used:
{{< highlight yaml "style=paraiso-dark">}}
      - name: Decode Sentry files
        script: | 
          echo $CONFIG_FILE | base64 --decode > steam/config.vdf
          echo $SSFN_FILE | base64 --decode > steam/$SSFN_FILE_NAME
{{< /highlight >}}


### Copy Sentry files
And then copy them to the correct path, depending on the build machine type:
{{< tabpane >}}
{{% tab header="macOS" %}}
{{< highlight yaml "style=paraiso-dark">}}
      - name: Copy Sentry Files
        script: | 
          mkdir -p ~/Library/Application\ Support/Steam/config
          cp ~/clone/steam/$SSFN_FILE_NAME ~/Library/Application\ Support/Steam
          cp ~/clone/steam/config.vdf ~/Library/Application\ Support/Steam/config
{{< /highlight >}}


{{% /tab %}}

{{% tab header="Linux" %}}
{{< highlight yaml "style=paraiso-dark">}}
      - name: Copy Sentry Files
        script: | 
          mkdir -p ~/Steam/config
          cp ~/clone/steam/$SSFN_FILE_NAME ~/Steam
          cp ~/clone/steam/config.vdf ~/Steam/config
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

### Upload to Steam
To configure the upload to Steam, edit the following two files in the project by adding your application's AppID, DepotID, and branch name for deployment:

**steam/app_build.vdf**
{{< highlight json "style=paraiso-dark">}}

"AppBuild"
{
	"AppID" "2086870" // Your AppID
	"Desc" "Published using Codemagic" // internal description for this build
	"Preview" "0" // make this a preview build only, nothing is uploaded
	"Local" "" // put content on local content server instead of uploading to Steam
	"SetLive" "cm-release" // set this build live on cm-branch branch (Change this)
	"ContentRoot" "..\win64" // content root folder relative to this script file
	"BuildOutput" ".\output\" // put build cache and log files on different drive for better performance
	"Depots"
	{
		// file mapping instructions for each depot are in separate script files
		"2086871" "depot_build.vdf"
	}
}
{{< /highlight >}}

**steam/depot_build.vdf**
{{< highlight json "style=paraiso-dark">}}

"DepotBuild"
{
	// Set your assigned depot ID here
	"DepotID" "2086871"

	// include all files recursively
	"FileMapping"
	{
		// This can be a full path, or a path relative to ContentRoot
		"LocalPath" "*"

		// This is a path relative to the install folder of your game
		"DepotPath" "."
		
		// If LocalPath contains wildcards, setting this means that all
		// matching files within subdirectories of LocalPath will also
		// be included.
		"Recursive" "1"
  }
}
{{< /highlight >}}
These are standard VDF files required for uploading a build to Steam and require your application's AppID, DepotID, and branch name for deployment.


Finally, use the following script in your `codemagic.yaml` to publish your app to Steam:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
    - name: Upload Build to Steam
    script: | 
        ~/Steam/steamcmd.sh +login $STEAM_USERNAME $STEAM_PASSWORD +run_app_build ~/clone/steam/app_build.vdf +quit
{{< /highlight >}}


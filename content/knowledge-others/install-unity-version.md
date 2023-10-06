---
description: How to install a different Unity version
title: Installing a different Unity version
weight: 13
aliases:
 - /knowledge-base/install-unity-version
---


## Use Codemagic's supported versions

If you need to install Unity, you would need to specify the preferred version in your `codemagic.yaml` file like this:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  unity-workflow:
      ...
      environment:
        unity: YOUR-DESIRED-UNITY-VERSION # e.g. 2021.3.6f1
{{< /highlight >}}

This will automatically install the specified Unity version to the build machine and set the `UNITY_HOME` to `/Applications/Unity/Hub/Editor/<YOUR-DESIRED-UNITY-VERSION>/Unity.app` and you can continue building your app as described [here](../yaml-quick-start/building-a-unity-app/).


#### The available Unity versions on Mac machines are the following:
{{< tabpane >}}
{{% tab header="2022.X" %}}
- `2022.2.16f1`
- `2022.3.5f1`
{{< /tab >}}
{{% tab header="2021.X" %}}
- `2021.3.4f1`
- `2021.3.6f1`
- `2021.3.7f1`
- `2021.3.9f1`
- `2021.3.10f1`
- `2021.3.11f1`
- `2021.3.12f1`
- `2021.3.13f1`
- `2021.3.15f1`
- `2021.3.20f1`
- `2021.3.23f1`
- `2021.3.24f1`
{{< /tab >}}
{{% tab header="2020.X" %}}
- `2020.3.15f2`
- `2020.3.21f1`
- `2020.3.38f1`
- `2020.3.40f1`
- `2020.3.41f1`
{{< /tab >}}
{{< /tabpane >}}

If you can't find your desired Unity version in the list, please contact us [here](https://codemagic.io/contact/).

{{<notebox>}}
**Notes:**
- These versions are the `Unity Editor (macOS x86_64)`, and have only the `macOS`, `Android`, and `iOS` modules.
- Mac machines with Apple silicon support Unity built for `x86_46` architecture.
- If your app requires additional modules then you need to install it using [Unity Hub CLI](./-others/install-unity-version/#unity-installation-script) like this: `/Applications/Unity\ Hub.app/Contents/MacOS/Unity\ Hub -- --headless install-modules --version <UNITY_VERSION> -m windows-mono`, this will install the windows modules for the specified` <UNITY_VERSION>`.
{{</notebox>}}

## Download from Unity Hub CLI
It is possible to use the Unity Hub CLI to download and install a different Unity Editor version and target support files for that version. 

License activation and return takes place with the Unity version already installed on the machine, but building of the Xcode project or Android binary will use the version of Unity you install. 


### Getting the Unity version number and changeset id

In order to install a different version, you can use the info from the `ProjectSettings/ProjectVersion.txt` file which has the unity version and changeset that the project uses.
You only need to add this script.

{{< tabpane >}}
{{% tab header="Mac" %}}
{{< highlight yaml "style=paraiso-dark">}}
    scripts:  
      - name: Retrieve Used Unity Version
        script: | 
          UNITY_VERSION=$(echo $(sed -n '1p' ProjectSettings/ProjectVersion.txt) | cut -c 18-)
          UNITY_VERSION_CHANGESET=$(echo $(sed -n '2p' ProjectSettings/ProjectVersion.txt) | cut -d "(" -f2 | cut -d ")" -f1 | xargs)
          echo "UNITY_VERSION=$UNITY_VERSION" >> $CM_ENV
          echo "UNITY_VERSION_CHANGESET=$UNITY_VERSION_CHANGESET" >> $CM_ENV
          echo "UNITY_HOME=/Applications/Unity/Hub/Editor/${UNITY_VERSION}/Unity.app" >> $CM_ENV #to update the default Unity home.
{{< /highlight >}}
{{< /tab >}}
{{% tab header="Windows" %}}
{{< highlight yaml "style=paraiso-dark">}}
    scripts: 
      - name: Retrieve Used Unity Version
        script: | 
          $env:UNITY_VERSION=(Get-Content ProjectSettings/ProjectVersion.txt -TotalCount 1).Substring(17)
          $env:UNITY_VERSION_CHANGESET=([regex] "\((.*)\)").match((Get-Content ProjectSettings/ProjectVersion.txt -TotalCount 2)).groups[1].value
          Add-Content -Path $env:CM_ENV -Value "UNITY_VERSION=$UNITY_VERSION"
          Add-Content -Path $env:CM_ENV -Value "UNITY_VERSION_CHANGESET=$UNITY_VERSION_CHANGESET"
          Add-Content -Path $env:CM_ENV -Value "UNITY_HOME=C:\Program Files\Unity\Hub\Editor\$env:UNITY_VERSION\Editor"
{{< /highlight >}}
{{< /tab >}}


{{< /tabpane >}}

### Activating Unity
Even though you are installing a different version of Unity to build your apps with, you should activate your license using the default Unity version already installed on the machine. Unity Hub CLI commands do not work correctly if a license is not already active on the machine.


### Unity installation script
After activating the Unity license as usual, add the following script to install the desired version and modules you wish to use. The example below uses Unity Hub CLI commands to install the specified Unity version as well as the Android and iOS Build Support modules.

{{< tabpane >}}
{{% tab header="Mac" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts: 
    - name: Install Unity version
      script: |  
        /Applications/Unity\ Hub.app/Contents/MacOS/Unity\ Hub -- --headless install --version $UNITY_VERSION --changeset $UNITY_VERSION_CHANGESET 
        /Applications/Unity\ Hub.app/Contents/MacOS/Unity\ Hub -- --headless install-modules --version $UNITY_VERSION -m ios android 
{{< /highlight >}}
{{< /tab >}}
{{% tab header="Windows" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts: 
    - name: Install Unity version
      script: |  
        New-Item ".\install-unity.bat" #create an empty batch file
        Set-Content install-unity.bat "`"$env:UNITY_HUB`" -- --headless install -v $env:UNITY_VERSION --changeset $env:UNITY_VERSION_CHANGESET"
        Add-Content install-unity.bat "`"$env:UNITY_HUB`" -- --headless install-modules --version $env:UNITY_VERSION -m ios android"
        Start-Process -FilePath ".\install-unity.bat" -Wait -NoNewWindow #start executing the batch file
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}


### Building with the newly installed Unity version

Use the Unity version you installed on the machine:

{{< tabpane >}}
{{% tab header="Mac" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build the Unity app
      script: |  
        $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$BUILD_SCRIPT -nographics
{{< /highlight >}}

{{< /tab >}}
{{% tab header="Windows" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build the Unity app
      script: |  
        cmd.exe /c "$env:UNITY_VERSION" -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$env:BUILD_SCRIPT -nographics
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

### Android Workflow configuration sample
{{< tabpane >}}
{{% tab header="Mac" %}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  unity-android-workflow:
      name: Unity Android Workflow
      instance_type: mac_pro
      max_build_duration: 120
      environment:
        groups:
          # Add the group environment variables in Codemagic UI (in Application or Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
          - unity # <-- (Includes UNITY_HOME, UNITY_SERIAL, UNITY_EMAIL and UNITY_PASSWORD)
          - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS <-- Put your google-services.json)
        vars:
          UNITY_VERSION: 2019.4.38f1
          UNITY_VERSION_CHANGESET: fdbb7325fa47
          BUILD_SCRIPT: BuildAndroid
          PACKAGE_NAME: "io.codemagic.unity" # <-- Put your package name here e.g. com.domain.myapp
        android_signing:
        - unity_test
        xcode: latest
      triggering:
        events:
          - push
          - tag
          - pull_request
        branch_patterns:
          - pattern: develop
            include: true
            source: true
      scripts:
        - name: Activate Unity License
          script: |  
            $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile -serial ${UNITY_SERIAL} -username ${UNITY_EMAIL} -password ${UNITY_PASSWORD}      
        - name: Install Unity version, build support modules, ndk and jdk
          script: |  
            /Applications/Unity\ Hub.app/Contents/MacOS/Unity\ Hub -- --headless install --version ${UNITY_VERSION} --changeset ${UNITY_VERSION_CHANGESET}
            /Applications/Unity\ Hub.app/Contents/MacOS/Unity\ Hub -- --headless install-modules --version ${UNITY_VERSION} -m android android-sdk-ndk-tools android-open-jdk          
        - name: Set build number and export Unity
          script: | 
            export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks=alpha) + 1))
            $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$BUILD_SCRIPT -nographics -buildTarget Android      
      artifacts:
        - android/*.aab
        - android/*.apk
      publishing:
        scripts:
          - name: Deactivate Unity License
            script: $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -returnlicense -nographics
{{< /highlight >}}
{{< /tab >}}
{{% tab header="Windows" %}}
{{< highlight yaml "style=paraiso-dark">}}
 unity-android-workflow:
    name: Unity Install Older Version Workflow
    max_build_duration: 120
    instance_type: windows_x2
    environment:
      groups:
        # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
        - unity # <-- (Includes UNITY_HOME, UNITY_SERIAL, UNITY_EMAIL and UNITY_PASSWORD)
      vars:
        UNITY_VERSION: 2021.3.3f1
        UNITY_VERSION_CHANGESET: af2e63e8f9bd
        BUILD_SCRIPT: BuildAndroid
        PACKAGE_NAME: "io.codemagic.unity" # <-- Put your package name here e.g. com.domain.myapp
      android_signing:
        - unity_test
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: "*"
          include: true
      cancel_previous_builds: false
    scripts:
      - name: Activate Unity License (installed version)
        script: | 
          cmd.exe /c "$env:$UNITY_HOME/Unity.exe" -batchmode -serial $env:UNITY_SERIAL -username $env:UNITY_EMAIL -password $env:UNITY_PASSWORD -quit -nographics
      - name: Install Unity version
        script: | 
          New-Item ".\install-unity.bat" #create an empty batch file
          Add-Content install-unity.bat "`"C:\Program Files\Unity Hub\Unity Hub.exe`" -- --headless install -v $env:UNITY_VERSION --changeset $env:UNITY_VERSION_CHANGESET"
          Add-Content install-unity.bat "`C:\Program Files\Unity Hub\Unity Hub.exe`" -- --headless install-modules --version $env:UNITY_VERSION -m android android-sdk-ndk-tools android-open-jdk"
          Start-Process -FilePath ".\install-unity.bat" -Wait -NoNewWindow #start executing the batch file
      - name: Build Unity Using (installed version)
        script: | 
          cmd.exe /c "C:\Program Files\Unity\Hub\Editor\$env:$UNITY_VERSION\Editor\Unity.exe" -batchmode -quit -logFile "$env:CM_BUILD_DIR\\android\\log.txt" -projectPath . -executeMethod BuildScript.$env:BUILD_SCRIPT -nographics
    artifacts:
      - android/*.aab
      - android/*.apk
      - android/*.txt
    publishing:
      scripts:
        - name: Deactivate new Unity License using a Command Prompt
          script: | 
            cmd.exe /c "C:\Program Files\Unity\Hub\Editor\$env:$UNITY_VERSION\Editor\Unity.exe" -batchmode -quit -returnlicense -nographics 
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

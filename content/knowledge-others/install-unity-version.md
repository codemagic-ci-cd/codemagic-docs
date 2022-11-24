---
description: How to install a different Unity version
title: Installing a different Unity version
weight: 13
aliases:
 - /knowledge-base/install-unity-version
---

Each build machine image has a specific version of Unity installed. You can find out the specific Unity version by consulting the build machine specification for [MacOS](../specs/versions-macos) and for [Windows](../specs/versions-windows) instances.

If you need to use a different Unity version, then it is possible to use the Unity Hub CLI to download and install a different Unity Editor version and target support files for that version. 

License activation and return takes place with the Unity version already installed on the machine, but building of the Xcode project or Android binary will use the version of Unity you install. 


## Getting the Unity version number and changeset id

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
          echo "UNITY_VERSION_BIN=/Applications/Unity/Hub/Editor/${UNITY_VERSION}/Unity.app/Contents/MacOS/Unity" >> $CM_ENV
{{< /highlight >}}
{{< /tab >}}
{{% tab header="Windows" %}}
{{< highlight yaml "style=paraiso-dark">}}
    scripts: 
      - name: Retrieve Used Unity Version
        script: | 
          $env:UNITY_VERSION=(Get-Content ProjectSettings/ProjectVersion.txt -TotalCount 1).Substring(17)
          $env:UNITY_VERSION_CHANGESET=([regex] "\((.*)\)").match((Get-Content ProjectSettings/ProjectVersion.txt -TotalCount 2)).groups[1].value
          $env:UNITY_VERSION_BIN="/Applications/Unity/Hub/Editor/$env:UNITY_VERSION/Unity.app/Contents/MacOS/Unity"
          Add-Content -Path $env:CM_ENV -Value "UNITY_VERSION=$UNITY_VERSION"
          Add-Content -Path $env:CM_ENV -Value "UNITY_VERSION_CHANGESET=$UNITY_VERSION_CHANGESET"
          Add-Content -Path $env:CM_ENV -Value "UNITY_VERSION_BIN=$UNITY_VERSION_BIN"
{{< /highlight >}}
{{< /tab >}}


{{< /tabpane >}}

## Activating Unity
Even though you are installing a different version of Unity to build your apps with, you should activate your license using the default Unity version already installed on the machine. Unity Hub CLI commands do not work correctly if a license is not already active on the machine.


## Unity installation script
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


## Building with the newly installed Unity version

Use the Unity version you installed on the machine:

{{< tabpane >}}
{{% tab header="Mac" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build the Unity app
      script: |  
        $UNITY_VERSION_BIN -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$BUILD_SCRIPT -nographics
{{< /highlight >}}

{{< /tab >}}
{{% tab header="Windows" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build the Unity app
      script: |  
        cmd.exe /c "$env:UNITY_VERSION_BIN" -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$env:BUILD_SCRIPT -nographics
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

## Android Workflow configuration sample
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
          UNITY_BIN: $UNITY_HOME/Contents/MacOS/Unity
          UNITY_VERSION: 2019.4.38f1
          UNITY_VERSION_CHANGESET: fdbb7325fa47
          UNITY_VERSION_BIN: /Applications/Unity/Hub/Editor/${UNITY_VERSION}/Unity.app/Contents/MacOS/Unity
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
            $UNITY_BIN -batchmode -quit -logFile -serial ${UNITY_SERIAL?} -username ${UNITY_EMAIL?} -password ${UNITY_PASSWORD?}      
        - name: Install Unity version, buld support modules, ndk and jdk
          script: |  
            /Applications/Unity\ Hub.app/Contents/MacOS/Unity\ Hub -- --headless install --version ${UNITY_VERSION} --changeset ${UNITY_VERSION_CHANGESET}
            /Applications/Unity\ Hub.app/Contents/MacOS/Unity\ Hub -- --headless install-modules --version ${UNITY_VERSION} -m android android-sdk-ndk-tools android-open-jdk          
        - name: Set build number and export Unity
          script: | 
            export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks=alpha) + 1))
            $UNITY_BIN_VERSION -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$BUILD_SCRIPT -nographics -buildTarget Android      
      artifacts:
        - android/*.aab
        - android/*.apk
      publishing:
        scripts:
          - name: Deactivate Unity License
            script: $UNITY_BIN -batchmode -quit -returnlicense -nographics
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
        UNITY_BIN: $UNITY_HOME/Unity.exe
        UNITY_VERSION: 2021.3.3f1
        UNITY_VERSION_CHANGESET: af2e63e8f9bd
        UNITY_VERSION_BIN: C:\Program Files\Unity\Hub\Editor\$UNITY_VERSION\Editor\Unity.exe
        UNITY_HUB: C:\Program Files\Unity Hub\Unity Hub.exe
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
          cmd.exe /c "$env:UNITY_BIN" -batchmode -serial $env:UNITY_SERIAL -username $env:UNITY_EMAIL -password $env:UNITY_PASSWORD -quit -nographics
      - name: Install Unity version
        script: | 
          New-Item ".\install-unity.bat" #create an empty batch file
          Add-Content install-unity.bat "`"$env:UNITY_HUB`" -- --headless install -v $env:UNITY_VERSION --changeset $env:UNITY_VERSION_CHANGESET"
          Add-Content install-unity.bat "`"$env:UNITY_HUB`" -- --headless install-modules --version $env:UNITY_VERSION -m android android-sdk-ndk-tools android-open-jdk"
          Start-Process -FilePath ".\install-unity.bat" -Wait -NoNewWindow #start executing the batch file
      - name: Build Unity Using (installed version)
        script: | 
          cmd.exe /c "$env:UNITY_VERSION_BIN" -batchmode -quit -logFile "$env:CM_BUILD_DIR\\android\\log.txt" -projectPath . -executeMethod BuildScript.$env:BUILD_SCRIPT -nographics
    artifacts:
      - android/*.aab
      - android/*.apk
      - android/*.txt
    publishing:
      scripts:
        - name: Deactivate new Unity License using a Command Prompt
          script: | 
            cmd.exe /c "$env:UNITY_BIN" -batchmode -quit -returnlicense -nographics 
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

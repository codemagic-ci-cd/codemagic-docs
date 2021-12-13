---
title: Building Unity mobile apps
description: How to build Unity mobile apps with codemagic.yaml
weight: 12

---

Unity is a cross-platform game engine developed by Unity Technologies. It can be used to create mobile applications that run on iOS and Android.

Codemagic's Unity premium macOS base image has the Unity SDK, iOS and Android modules pre-installed. 

This guide will show you how to configure a workflow that builds and publishes your app to TestFlight and Google Play using a **codemagic.yaml** configuration file. 

## Prerequisites

- A Unity **Plus** or **Pro** license. Your license is used to activate Unity on the Codemagic build server so the iOS and Android projects can be exported. The license is then returned before the workflow builds and publishes your apps to the App Store and Google Play.
- If you are publishing to the Apple App Store, you will need an active membership for the Apple Developer Program.
- For publishing to Google Play, you will require an active Google Play Developer account.

{{<notebox>}}
**Important!** The Unity SDK is not included in our standard base images. Please contact us [here](https://codemagic.io/contact/) to request access to the Unity SDK base image.
{{</notebox>}}

## Adding your Unity project to Codemagic

It is possible to add repositories from Github, Gitlab, Bitbucket or any Git based repository. Please refer to the following documentation about adding apps from these sources.

- [Adding apps from GitHub](../getting-started/github/).
- [Adding apps from GitLab](../getting-started/gitlab/).
- [Adding apps from Bitbucket](../getting-started/bitbucket/).
- [Adding apps from other repositories](../getting-started/other/).

## Setting up your workflow

These are the key steps in setting up your workflow for building Unity mobile apps: 

1. On the Applications page in Codemagic, click the **Add application** button and follow the on-screen instructions to add your Unity project.
2. Add environment variables for Unity as described [here]({{< ref "#unity-variables" >}}).
3. Add environment variables for iOS code signing as described [here]({{< ref "#ios-variables" >}}).
4. Add environment variables for Android code signing as described [here]({{< ref "#android-variables" >}}).
5. Add a build script to Unity as explained [here]({{< ref "#unity-build-script" >}}).
6. Add a post-processing script to Unity for iOS builds as described [here]({{< ref "#post-processing-script" >}}).
7. Set the iOS bundle identifier in Unity as described [here]({{< ref "#bundle-identifier" >}}).
8. Configure the Android build settings in Unity as described [here]({{< ref "#android-build-settings" >}}).
9. Configure Custom Gradle templates as described [here]({{< ref "#custom-gradle-template" >}}).
10. Add a script for license activation, mobile app export and license return [here]({{< ref "#license-activation" >}}).
11. Create a codemagic.yaml workflow configuration using the Unity template and configure with your details as shown [here]({{< ref "#workflow-configuration" >}}).

## Environment variables for Unity {#unity-variables}

You will need to set the following environment variables for Unity specific values in Codemagic: 

`UNITY_HOME`, `UNITY_SERIAL`, `UNITY_USERNAME` and `UNITY_PASSWORD`.

If you are using a Team in Codemagic, you can add these as global environment variables for your team by clicking on **Teams > your Team name** and then clicking on **Global variables and secrets**. Otherwise, you can add the environment variables at the application level by clicking the **Environment variables** tab.

Add the environment variables as follows (make sure the **Secure** option is checked for any sensitive values):

1. Create a variable called `UNITY_HOME` and set the value to `/Applications/Unity/Hub/Editor/2020.3.20f1/Unity.app` and click the **Add** button.
2. Create a variable called `UNITY_SERIAL` and set the value to your Unity serial number. In the **Select group** dropdown type `unity` and click on the **Create "unity" group** button. Mark the variable as **secure** to encrypt the value and click the **Add** button.
3. Create a variable called `UNITY_USERNAME` and set the value to **email address** used with your Unity ID , add to the "unity" group,  mark this as **secure** to encrypt the value and click the **Add** button.
4. Create a variable called `UNITY_PASSWORD` and set the value to your Unity ID **password**, add to the "unity" group, mark this as **secure** to encrypt the value and click the **Add** button.

## Environment variables for iOS code signing {#ios-variables}

You will need to create the following environment variables in a group called `ios_credentials` for iOS code signing:

`APP_STORE_CONNECT_KEY_IDENTIFIER`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_PRIVATE_KEY` and `CERTIFICATE_PRIVATE_KEY`

Please refer to the documentation about signing iOS apps [here](../yaml-code-signing/signing-ios/) for further details.

## Environment variables for Android code signing {#android-variables}

You will need to set the following environment variables in a variable group called `keystore_credentials` for Android code signing:

`FCI_KEYSTORE_PATH`, `FCI_KEYSTORE`, `FCI_KEYSTORE_PASSWORD`, `FCI_KEY_PASSWORD` and `FCI_KEY_ALIAS`


Please refer to the documentation about signing Android apps [here](../yaml-code-signing/signing-android/) for further details.

## Add a build script to Unity {#unity-build-script}

A Unity build script is required to build the Xcode project in headless mode. 

Open Unity and add a new C# script in the project explorer in Assets/Editor called **Build**. 

Paste the following script into the new file:

```c#
using System.Linq;
using UnityEditor;
using UnityEngine;

public static class BuildScript
{

    [MenuItem("Build/Build Android")]
    public static void BuildAndroid()
    {

        PlayerSettings.Android.useCustomKeystore = true;

        // Set bundle version. NEW_BUILD_NUMBER environment variable is set in the codemagic.yaml 
        var versionIsSet = int.TryParse(Environment.GetEnvironmentVariable("NEW_BUILD_NUMBER"), out int version);
        if (versionIsSet)
        {
            Debug.Log($"Bundle version code set to {version}");
            PlayerSettings.Android.bundleVersionCode = version;
        }
        else
        {
            Debug.Log("Bundle version not provided");
        }

        // Set keystore name
        string keystoreName = Environment.GetEnvironmentVariable("FCI_KEYSTORE_PATH");
        if (!String.IsNullOrEmpty(keystoreName))
        {
            Debug.Log($"Setting path to keystore: {keystoreName}");
            PlayerSettings.Android.keystoreName = keystoreName;
        }
        else
        {
            Debug.Log("Keystore name not provided");
        }

        // Set keystore password
        string keystorePass = Environment.GetEnvironmentVariable("FCI_KEYSTORE_PASSWORD");
        if (!String.IsNullOrEmpty(keystorePass))
        {
            Debug.Log("Setting keystore password");
            PlayerSettings.Android.keystorePass = keystorePass;
        }
        else
        {
            Debug.Log("Keystore password not provided");
        }

        // Set keystore alias name
        string keyaliasName = Environment.GetEnvironmentVariable("FCI_KEY_ALIAS_USERNAME");
        if (!String.IsNullOrEmpty(keyaliasName))
        {
            Debug.Log("Setting keystore alias");
            PlayerSettings.Android.keyaliasName = keyaliasName;
        }
        else
        {
            Debug.Log("Keystore alias not provided");
        }

        // Set keystore password
        string keyaliasPass = Environment.GetEnvironmentVariable("FCI_KEY_ALIAS_PASSWORD");
        if (!String.IsNullOrEmpty(keyaliasPass))
        {
            Debug.Log("Setting keystore alias password");
            PlayerSettings.Android.keyaliasPass = keyaliasPass;
        }
        else
        {
            Debug.Log("Keystore alias password not provided");
        }
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.locationPathName = "android/android.aab";
        buildPlayerOptions.target = BuildTarget.Android;
        buildPlayerOptions.options = BuildOptions.None;
        buildPlayerOptions.scenes = GetScenes();

        Debug.Log("Building Android");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log("Built Android");
    }

    [MenuItem("Build/Build iOS")]
    public static void BuildIos()
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.locationPathName = "ios";
        buildPlayerOptions.target = BuildTarget.iOS;
        buildPlayerOptions.options = BuildOptions.None;
        buildPlayerOptions.scenes = GetScenes();

        Debug.Log("Building iOS");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log("Built iOS");
    }

    [MenuItem("Build/Build Windows")]
    public static void BuildWindows()
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.locationPathName = "windows/" + Application.productName + ".exe";
        buildPlayerOptions.target = BuildTarget.StandaloneWindows64;
        buildPlayerOptions.options = BuildOptions.None;
        buildPlayerOptions.scenes = GetScenes();

        Debug.Log("Building StandaloneWindows64");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log("Built StandaloneWindows64");
    }

    private static string[] GetScenes()
    {
        return (from scene in EditorBuildSettings.scenes where scene.enabled select scene.path).ToArray();
    }

}
```

## Add a post-processing script to Unity {#post-processing-script}

When publishing your app to TestFlight or the App Store, you will be asked if your app uses encryption. 

You can automate your answer to this question by setting the key `ITSAppUsesNonExemptEncryption` in your app's `Info.plist` file and set the value to `NO` if the app doesn't use encryption. 

For more details about complying with encryption export regulations, please see [here](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations).

A Unity post-processing script can be used to set values in the `Info.plist` of the Xcode project.

Open Unity and add a new C# script in the project explorer in Assets/Editor called 'PostProcessing' and then add the following:

```c#
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;
using System.IO;

public class IosBuildPostprocessor
{

    [PostProcessBuild(1)]
    public static void EditPlist(BuildTarget target, string path)
    {
        if (target != BuildTarget.iOS)
            return;


        string plistPath = path + "/Info.plist";
        PlistDocument plist = new PlistDocument();
        plist.ReadFromFile(plistPath);

        PlistElementDict rootDict = plist.root;

        // Add ITSAppUsesNonExemptEncryption to Info.plist
        rootDict.SetString("ITSAppUsesNonExemptEncryption", "false");


        File.WriteAllText(plistPath, plist.WriteToString());
    }
}
```

## Set the iOS bundle identifier in Unity {#bundle-identifier}

You should set the bundle id of your iOS application before building the Xcode project. 

You can do this as follows:

1. Open Unity and File > Build Settings.
2. Make sure iOS is selected in the Platform section.
3. Make sure iOS is selected and click on the Player Settings button.
4. Expand the Other Setting section.
5. In the Indetification section check the 'Override Default Bundle Identifier' option.
6. Set the Bundle Identifier to match the identifier name you have used in your Apple Developer Program account.

## Configure Android build settings in Unity {#android-build-settings}

Google recommends that Android applications be published to Google Play using the application bundle (.aab). You should configure the following settings in Unity before building the application bundle:

1. Open Unity and click File > Build Settings.
2. Make sure Android is selected in the Platform section.
3. Check the 'Build App Bundle (Google Play)' checkbox.
4. Make sure that 'Export Project' is **not** checked.
5. Click on the Player Settings button.
6. Expand 'Other Settings' and check the 'Override Default Package Name' checkbox.
7. Enter the package name for your app, e.g. com.domain.yourappname.
8. Set the 'Version number'.
9. Put any integer value in the 'Bundle Version Code'. This will be overriden with the build script.
10. Set the 'Minimum API Level' and 'Target API Level' to **Android 11.0 (API level 30)** which is required for publishing application bundles.
11. In the 'Configuration' section set 'Scripting Backend' to **IL2CPP**.
12. In the 'Target Architectures' section check **ARMv7** and **ARM64** to support 64-bit architectures so the app is compliant with the Google Play 64-bit requirement.

## Add a custom base Gradle template {#custom-gradle-template}

You will need to add custom gradle templates so your Android builds work with Codemagic.  

1. Open Unity and File > Build Settings.
2. Make sure Android is selected in the Platform section.
3. Click on the Player Settings.
4. Expand the Publishing Settings .
5. Check the 'Custom Base Gradle Template'.
6. Close the project settings and build settings.


### Modify the custom base Gradle template

Modify the base Gradle template as follows:

1. In the project explorer expand Assets > Plugins > Android.
2. Double click on baseProjectTemplate.gradle.
3. Replace the entire file contents with the following:

```groovy
// GENERATED BY UNITY. REMOVE THIS COMMENT TO PREVENT OVERWRITING WHEN EXPORTING AGAIN

allprojects {
    buildscript {
        repositories {**ARTIFACTORYREPOSITORY**
            google()
            mavenCentral()
        }

        dependencies {
            // If you are changing the Android Gradle Plugin version, make sure it is compatible with the Gradle version preinstalled with Unity
            // See which Gradle version is preinstalled with Unity here https://docs.unity3d.com/Manual/android-gradle-overview.html
            // See official Gradle and Android Gradle Plugin compatibility table here https://developer.android.com/studio/releases/gradle-plugin#updating-gradle
            // To specify a custom Gradle version in Unity, go do "Preferences > External Tools", uncheck "Gradle Installed with Unity (recommended)" and specify a path to a custom Gradle version
            classpath 'com.android.tools.build:gradle:4.0.1'
            **BUILD_SCRIPT_DEPS**
        }
    }

    repositories {**ARTIFACTORYREPOSITORY**
        google()
        mavenCentral()
        flatDir {
            dirs "${project(':unityLibrary').projectDir}/libs"
        }
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```
## License activation and return {#license-activation}

Your Unity license needs to be activated on the Codemagic build server so the XCode project can be created. 

Once this is done, the license can be returned and Codemagic can continue with building and publishing your iOS app. 

The best way to perform this step is to run an external shell script, which means that even if the workflow itself fails your license will be returned. 

Create the script as follows:

1. Open Terminal and run `touch export_unity.py` to create a new shell script file. 
2. Before checking this file into source control, run `chmod +x export_unity.py` so the script can be executed.
3. Open the file in your preferred editor.
4. Add the script below to `export_unity.py` and check the file into the root of your repository.

```python
import os
import platform
import sys

# Check if the app type argument has been provided, e.g python3 export_unity.py windows | ios | android
if len(sys.argv) >= 2:
    APP_TYPE = sys.argv[1].lower()
    print(f'APP_TYPE set to: {APP_TYPE}')
else:
    print('APP_TYPE not set. End process.')
    sys.exit()

# Check that environment variables have been set
vars = {'UNITY_HOME' : None, 'UNITY_SERIAL': None, 'UNITY_USERNAME' : None, 'UNITY_PASSWORD': None}
for key,value in vars.items():
    if key in os.environ:
        vars[key] = os.getenv(key)
    else:
        print(f'{key} is not set. End process.')
        sys.exit()   

# Set location of Unity binary according to machine type
platform = platform.system()
if platform == 'Darwin':
    UNITY_BIN = vars['UNITY_HOME'] + '/Contents/MacOS/Unity' 
    LOG_DIR = '/Logs/'
elif platform == 'Windows':
    UNITY_BIN = vars['UNITY_HOME'] + '\\Unity.exe'
    LOG_DIR = '\\Logs\\'
elif platform == "Linux":
    print("Build for Linux on Mac or Windows. End Process.")
    sys.exit()

# Check that UNITY_BIN has been set
if UNITY_BIN is not None:
    print('UNITY_BIN set to: ' + UNITY_BIN)
else:
    print('UNITY_BIN does not exist. End process.')
    sys.exit()

# Set log file locations
UNITY_PROJECT_PATH = os.getcwd()
LOG_PATH = f'{UNITY_PROJECT_PATH}{LOG_DIR}'
UNITY_LOG_FILE_PLATFORM = f'{LOG_PATH}unity_build_{APP_TYPE}.log'
UNITY_LOG_FILE_LICENSE = f'{LOG_PATH}unity_license.log'

def buildPlatform(appType, unityBin, projectPath, logPath):
    print(f'UNITY START BUILDING {appType}')
    os.system(f'"{unityBin}" -quit -batchmode -projectPath {projectPath} -executeMethod BuildScript.Build{appType.capitalize()} -nographics -logFile {logPath}')
    print(f'UNITY END BUILDING {appType}')

def activateLicense(unityBin, logPath, unitySerial, unityUsername, unityPassword):
    print('UNITY LICENSE START')
    os.system(f'"{unityBin}" -quit -batchmode -skipBundles -logFile {logPath} -serial {unitySerial} -username {unityUsername} -password {unityPassword}')
    print('UNITY LICENSE END')

def returnLicense(unityBin):
    print('UNITY RETURN LICENSE START')
    os.system(f'"{unityBin}" -quit -batchmode -returnlicense -nographics')
    print('UNITY RETURN LICENSE END')


activateLicense(UNITY_BIN, UNITY_LOG_FILE_LICENSE, vars["UNITY_SERIAL"],vars["UNITY_USERNAME"],vars["UNITY_PASSWORD"])
buildPlatform(APP_TYPE.upper(), UNITY_BIN, UNITY_PROJECT_PATH, UNITY_LOG_FILE_PLATFORM)
returnLicense(UNITY_BIN)

print('UNITY BUILDING DONE')
```
## Workflow configuration with codemagic.yaml{#workflow-configuration}

Your workflow should be configured using the **codemagic.yaml** configuration file and checked into the root of the branches you wish to build using Codemagic.

Add the following to your **codemagic.yaml** configuration file:


```yaml
workflows:
  unity-ios-workflow:
    name: Unity iOS Workflow
    max_build_duration: 120
    environment:
      groups:
      # Add the group environment variables in Codemagic UI (either in Application or Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
        - unity # <-- (Includes UNITY_HOME, UNITY_SERIAL, UNITY_USERNAME and UNITY_PASSWORD)
        - ios_credentials # <-- (Includes  APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY, CERTIFICATE_PRIVATE_KEY)
      vars:
        UNITY_IOS_DIR: ios
        XCODE_PROJECT: "Unity-iPhone.xcodeproj"
        XCODE_SCHEME: "Unity-iPhone"
        BUNDLE_ID: "com.domain.yourappname" # <-- Put your Bundle Id here.
        APP_STORE_APP_ID: 1555555551 # <-- Put the app id number here. This is found in App Store Connect > App > General > App Information
        cocoapods: default
    scripts:
      - name: Set up macOS keychain using Codemagic CLI 'keychain' command
        script: |
          keychain initialize       
      - name: Export Unity
        script: |
          python3 export_unity.py ios
      - name: Fetch signing files
        script: |
          app-store-connect fetch-signing-files $BUNDLE_ID --type IOS_APP_STORE
      - name: Use system default keychain
        script: |
          keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: |
          xcode-project use-profiles
      - name: Increment build number
        script: |
          cd ios && agvtool new-version -all $(($(app-store-connect get-latest-testflight-build-number "$APP_STORE_APP_ID") + 1))
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa --project "$UNITY_IOS_DIR/$XCODE_PROJECT" --scheme "$XCODE_SCHEME"
    artifacts:
        - build/ios/ipa/*.ipa
        - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
        app_store_connect:            
            api_key: $APP_STORE_CONNECT_PRIVATE_KEY         
            key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
            issuer_id: $APP_STORE_CONNECT_ISSUER_ID
    unity-android-workflow:
        name: Unity Android Workflow
        max_build_duration: 120
      environment:
          groups:
          # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
              - unity # <-- (Includes UNITY_HOME, UNITY_SERIAL, UNITY_USERNAME and UNITY_PASSWORD)
              - keystore_credentials # <-- (Includes FCI_KEYSTORE, FCI_KEYSTORE_PASSWORD, FCI_KEY_ALIAS_PASSWORD, FCI_KEY_ALIAS_USERNAME)
              - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS <-- Put your google-services.json)
          vars:
              PACKAGE_NAME: "com.domain.yourappname" # <-- Put your package name here e.g. com.domain.myapp
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
          - name: Set up keystore
            script: |
              echo $FCI_KEYSTORE | base64 --decode > /tmp/keystore.keystore            
          - name: Set build number and export Unity
            script: |
              export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks=alpha) + 1))
              python3 export_unity.py android        
      artifacts:
          - android/*.aab
      publishing:
          google_play:
            # See the following link for information regarding publishing to Google Play - https://docs.codemagic.io/publishing-yaml/distribution/#google-play
            credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
            track: alpha   # Any default or custom track
  unity-windows-workflow:
      name: Unity Windows Workflow
      max_build_duration: 120
      environment:
        groups:
          - unity
      scripts:
        - name: Build Windows
          script: | 
            python export_unity_fan.py windows
      artifacts:
        - windows/your_project_name.exe # <- update with the name of your project
        - Logs/unity_build_*.log    
```

---
title: Building a Unity iOS app
description: How to build a Unity iOS app with codemagic.yaml
weight: 12

---

Unity is a cross-platform game engine developed by Unity Technologies. It can be used to create mobile applications that run on iOS and Android.

Codemagic's Unity premium macOS base image has the Unity SDK, iOS and Android modules pre-installed. 

This guide will show you how to configure a workflow that builds and publishes your app to TestFlight using a **codemagic.yaml** configuration file. 

{{<notebox>}}
**Important!** Building Unity apps on Codemagic is currently in closed beta release. If you are interested in taking part in the beta, please contact us [here](https://codemagic.io/contact/)
{{</notebox>}}

## Adding your Unity iOS project

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. On the popup, select **Other** as the project type and click **Continue**.
3. In your IDE, create a [`codemagic.yaml`](./yaml). This will be used to create our workflow.
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.

## Environment variables for Unity

You will need to set the following environment variables for Unity specific values in Codemagic: 

`UNITY_HOME`, `UNITY_SERIAL`, `UNITY_USERNAME` and `UNITY_PASSWORD`.

You can add these as global environment variables for your team as follows (make sure the secure option is checked for any sensitive values):

1. In the Codemagic web app click on Teams > your Team name.
2. Click on Global variables and secrets.
3. Create a variable called `UNITY_HOME` and set the value to `/Applications/Unity/Hub/Editor/2020.3.20f1/Unity.app` and click the 'Add' button.
4. Create a variable called `UNITY_SERIAL` and set the value to your Unity serial number. In the 'Select group' dropdown type `unity` and click on the 'Create "unity" group' button. Mark the variable as **secure** to encrypt the value and click the 'Add' button.
5. Create a variable called `UNITY_USERNAME` and set the value to your Unity ID **username**, add to the "unity' group,  mark this as **secure** to encrypt the value and click the 'Add' button.
6. Create a variable called `UNITY_PASSWORD` and set the value to your Unity ID **password**, add to the "unity' group, mark this as **secure** to encrypt the value and click the 'Add' button.

## Environment variables for iOS code signing

You will need to set the following environment variables for iOS code signing:

`APP_STORE_CONNECT_KEY_IDENTIFIER`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_PRIVATE_KEY` and `CERTIFICATE_PRIVATE_KEY`

Add these to a variable group called `ios_credentials`. 

Please refer to the documentation about signing iOS apps [here](../yaml-code-signing/signing-ios/) for further details.
## Add a build script to Unity

A Unity build script is required to build the Xcode project in headless mode. 

Open Unity and add a new C# script in the project explorer in Assets/Editor called 'Build'. 

Paste the following script into the new file:

```c#
using System.Linq;
using UnityEditor;
using UnityEngine;

public static class BuildScript
{

    [MenuItem("Build/Build All")]
    public static void BuildAll()
    {
        BuildAndroid();
        BuildXcode();
    }

    [MenuItem("Build/Build Android")]
    public static void BuildAndroid()
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.locationPathName = "android";
        buildPlayerOptions.target = BuildTarget.Android;
        buildPlayerOptions.options = BuildOptions.None;
        buildPlayerOptions.scenes = GetScenes();

        Debug.Log("Building Android");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log("Built Android");
    }

    [MenuItem("Build/Build Xcode")]
    public static void BuildXcode()
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

    private static string[] GetScenes()
    {
        return (from scene in EditorBuildSettings.scenes where scene.enabled select scene.path).ToArray();
    }

}
```

## Add a post-processing script to Unity

When publishing your app to TestFlight or the App Store you will be asked if your app uses encryption. You can automate your answer to this question by setting the key `ITSAppUsesNonExemptEncryption` in your app's `Info.plist` file and set the value to `NO` if the app doesn't use encryption. 

For more details about complying with encryption export regulations please see [here](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations).

A Unity post-processing script can be used to set values in the `Info.plist` of the Xcode project. This can be done as follows:

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

## Set the iOS bundle id in Unity

You should set the bundle id of your iOS application before building the Xcode project. 

You can do this as follows:

1. Open Unity and File > Build Settings
2. Make sure iOS is select in the Platform section
3. Click on the Player Settings

## License activation and return

Your Unity license needs to be activated on the Codemagic build server so the XCode project can be created. 

Once this is done the license can be returned and Codemagic can continue with building and publishing your iOS app. 

The best way to perform this step is to run an external shell script, which means that even if the workflow itself fails your license will be returned. 

Create the script as follows:

1. Open Terminal and run `touch export_ios_unity.sh` to create a new shell script file. 
2. Before checking this file into source control run `chmod +x export_ios_unity.sh` so the script can be executed.
3. Open the file in your preferred editor.
4. Add the script below to `export_ios_unity.sh` and check the file into the root of your repository.

```bash
echo "using Unity:"
echo $UNITY_HOME

if [ ! -d "$UNITY_HOME" ]; then
  # Control will enter here if $DIRECTORY exists.
  echo "UNITY_HOME is not defined, please define UNITY_HOME env var where Unity app is located"
  exit 1;
fi

UNITY_BIN=./Unity

if [ "$(uname)" == "Darwin" ]; then
  echo "Runing under Mac OS X platform";
  UNITY_BIN="$UNITY_HOME/Contents/MacOS/Unity";
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  echo "Runing under GNU/Linux platform";
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
  echo "Runing under 32 bits Windows NT platform";
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
  echo "Runing under 64 bits Windows NT platform";
fi

if [ -f "$UNITY_BIN" ]; then
  echo "Building using bin $UNITY_BIN"
else
  echo "Error: $UNITY_BIN does not exist"
  exit 1;
fi

UNITY_PROJECT_PATH="./"
UNITY_LOG_FILE_IOS="$UNITY_PROJECT_PATH/Logs/unity_build_ios.log"
UNITY_LOG_FILE_ANDROID="$UNITY_PROJECT_PATH/Logs/unity_build_android.log"
UNITY_LOG_FILE="$UNITY_PROJECT_PATH/Logs/unity_build.log"

echo "UNITY_LOG_FILE_PATH=$UNITY_LOG_FILE_PATH"
echo "UNITY_PROJECT_PATH=$UNITY_PROJECT_PATH"

# Begin script in case all parameters are correct
echo "UNITY LICENSE START"
$UNITY_BIN -quit -batchmode -logFile -skipBundles -serial $UNITY_SERIAL -username $UNITY_USERNAME -password $UNITY_PASSWORD
echo "UNITY LICENSE END"

echo "UNITY BUILD IOS START"
$UNITY_BIN -quit -batchmode -projectPath $UNITY_PROJECT_PATH -executeMethod BuildScript.BuildXcode -nographics -logfile $UNITY_LOG_FILE_IOS
echo "UNITY BUILD IOS END"

echo "UNITY RETURN LICENSE START"
$UNITY_BIN -quit -batchmode -returnlicense -nographics
echo "UNITY RETURN LICENSE END"

if [ $? -eq 0 ]; then
  echo "Unity Build Complete"
else
  echo "Unity Build Failed"
  exit 1;
fi
sleep 1

echo "Done everything"

exit 0
```



## Workflow configuration

Add the following to your **codemagic.yaml** configuration file:


```yaml
workflows:
  unity-ios-workflow:
    name: Unity iOS Workflow
    max_build_duration: 120
    environment:
      groups:
        - unity
        - ios_credentials
      vars:
        UNITY_IOS_DIR: ios
        XCODE_PROJECT: "Unity-iPhone.xcodeproj"
        XCODE_SCHEME: "Unity-iPhone"
        BUNDLE_ID: "com.your.bundleid" # <-- Put your Bundle Id here.
        APP_STORE_APP_ID: 1555555551 # <-- Put the app id number here. This is found in App Store Connect > App > General > App Information
        cocoapods: default
    scripts:
      - name: Set up macOS keychain using Codemagic CLI 'keychain' command
        script: |
          keychain initialize       
      - name: Export Unity
        script: |
          ./export_unity_ios.sh
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
```

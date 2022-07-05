---
title: Building Unity mobile apps
description: How to build Unity mobile apps with codemagic.yaml
weight: 12

---

Unity is a cross-platform game engine developed by Unity Technologies. It can be used to create mobile applications that run on iOS and Android.

Codemagic's Unity macOS VMs have the Unity SDK, iOS and Android modules pre-installed. 

This guide will show you how to configure a workflow that builds and publishes your app to TestFlight and Google Play using a **codemagic.yaml** configuration file. 

## Prerequisites

- A Unity **Plus** or **Pro** license. Your license is used to activate Unity on the Codemagic build server so the iOS and Android projects can be exported. 

- The license is returned during the publishing step of the workflow which is always run **except if the build is cancelled**. 

- To check if you have exceeded your license activations, or to return licenses this should be done in the Unity dashboard (here)[https://id.unity.com/en/serials]

- If you are publishing to the Apple App Store, you will need an active membership for the Apple Developer Program.

- For publishing to Google Play, you will require an active Google Play Developer account.

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
10. Create a codemagic.yaml workflow configuration using the Unity template and configure with your details as shown [here]({{< ref "#workflow-configuration" >}}).

## Environment variables for Unity {#unity-variables}

You will need to set the following environment variables for Unity specific values in Codemagic: 

`UNITY_SERIAL`, `UNITY_EMAIL` and `UNITY_PASSWORD`.

If you are using a Team in Codemagic, you can add these as global environment variables for your team by clicking on **Teams > your Team name** and then clicking on **Global variables and secrets**. Otherwise, you can add the environment variables at the application level by clicking the **Environment variables** tab.

Add the environment variables as follows (make sure the **Secure** option is checked for any sensitive values):

1. Create a variable called `UNITY_SERIAL` and set the value to your Unity serial number. In the **Select group** dropdown type `unity` and click on the **Create "unity" group** button. Mark the variable as **secure** to encrypt the value and click the **Add** button.
2. Create a variable called `UNITY_EMAIL` and set the value to **email address** used with your Unity ID , add to the "unity" group,  mark this as **secure** to encrypt the value and click the **Add** button.
3. Create a variable called `UNITY_PASSWORD` and set the value to your Unity ID **password**, add to the "unity" group, mark this as **secure** to encrypt the value and click the **Add** button.

Note that the environment variable `UNITY_HOME` is already set on the build machines. 

On the macOS Unity base image `UNITY_HOME` is set to `/Applications/Unity/Hub/Editor/2020.3.28f1/Unity.app`.
## Environment variables for iOS code signing {#ios-variables}

You will need to create the following environment variables in a group called `ios_credentials` for iOS code signing:

`APP_STORE_CONNECT_KEY_IDENTIFIER`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_PRIVATE_KEY` and `CERTIFICATE_PRIVATE_KEY`

Please refer to the documentation about signing iOS apps [here](../yaml-code-signing/signing-ios/) for further details.

## Environment variables for Android code signing {#android-variables}

You will need to set the following environment variables in a variable group called `keystore_credentials` for Android code signing:

`CM_KEYSTORE_PATH`, `CM_KEYSTORE`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_PASSWORD` and `CM_KEY_ALIAS`


Please refer to the documentation about signing Android apps [here](../yaml-code-signing/signing-android/) for further details.

## Add a build script to Unity {#unity-build-script}

A Unity build script is required to build the Xcode project in headless mode. 

Open Unity and add a new C# script in the project explorer in Assets/Editor called **Build**. 

Paste the following script into the new file:

{{< highlight csharp "style=paraiso-dark">}}
using System.Linq;
using System;
using UnityEditor;
using UnityEngine;

public static class BuildScript
{

    [MenuItem("Build/Build Android")]
    public static void BuildAndroid()
    {

        PlayerSettings.Android.useCustomKeystore = true;
        EditorUserBuildSettings.buildAppBundle = true;

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
        string keystoreName = Environment.GetEnvironmentVariable("CM_KEYSTORE_PATH");
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
        string keystorePass = Environment.GetEnvironmentVariable("CM_KEYSTORE_PASSWORD");
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
        string keyaliasName = Environment.GetEnvironmentVariable("CM_KEY_ALIAS");
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
        string keyaliasPass = Environment.GetEnvironmentVariable("CM_KEY_PASSWORD");
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

    private static string[] GetScenes()
    {
        return (from scene in EditorBuildSettings.scenes where scene.enabled select scene.path).ToArray();
    }

}
{{< /highlight >}}

## Add a post-processing script to Unity {#post-processing-script}

When publishing your app to TestFlight or the App Store, you will be asked if your app uses encryption. 

You can automate your answer to this question by setting the key `ITSAppUsesNonExemptEncryption` in your app's `Info.plist` file and set the value to `NO` if the app doesn't use encryption. 

For more details about complying with encryption export regulations, please see [here](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations).

A Unity post-processing script can be used to set values in the `Info.plist` of the Xcode project.

Open Unity and add a new C# script in the project explorer in Assets/Editor called 'PostProcessing' and then add the following:

{{< highlight csharp "style=paraiso-dark">}}
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
{{< /highlight >}}

## Set the iOS bundle identifier in Unity {#bundle-identifier}

You should set the bundle id of your iOS application before building the Xcode project. 

You can do this as follows:

1. Open Unity and File > Build Settings.
2. Make sure iOS is selected and click on the Player Settings button.
3. Expand the 'Other Settings' section.
4. In the 'Identification' section check the 'Override Default Bundle Identifier' option.
5. Set the 'Bundle Identifier' to match the identifier name you have used in your Apple Developer Program account.

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

{{< highlight groovy "style=paraiso-dark">}}
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
{{< /highlight >}}
## Workflow configuration with codemagic.yaml{#workflow-configuration}

Your workflow should be configured using the **codemagic.yaml** configuration file and checked into the root of the branches you wish to build using Codemagic.

Add the following to your **codemagic.yaml** configuration file:


{{< highlight yaml "style=paraiso-dark">}}
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
        UNITY_BIN: $UNITY_HOME/Contents/MacOS/Unity
        BUILD_SCRIPT: BuildIos
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
      - name: Activate Unity License
        script: | 
          $UNITY_BIN -batchmode -quit -logFile -serial ${UNITY_SERIAL?} -username ${UNITY_EMAIL?} -password ${UNITY_PASSWORD?}
      - name: Build the Xcode project
        script: | 
          $UNITY_BIN -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$BUILD_SCRIPT -nographics -buildTarget iOS          
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
      scripts:
        - name: Deactivate Unity License
          script: $UNITY_BIN -batchmode -quit -returnlicense -nographics 
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
            - keystore_credentials # <-- (Includes CM_KEYSTORE, CM_KEYSTORE_PASSWORD, CM_KEY_PASSWORD, CM_KEY_ALIAS)
            - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS <-- Put your google-services.json)
        vars:
          UNITY_BIN: $UNITY_HOME/Contents/MacOS/Unity
          BUILD_SCRIPT: BuildAndroid
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
      - name: Activate Unity License
        script: | 
          $UNITY_BIN -batchmode -quit -logFile -serial ${UNITY_SERIAL?} -username ${UNITY_EMAIL?} -password ${UNITY_PASSWORD?}      
      - name: Set up keystore
        script: | 
          echo $CM_KEYSTORE | base64 --decode > $CM_BUILD_DIR/keystore.keystore            
      - name: Set build number and export Unity
        script: | 
          export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks alpha) + 1))
          $UNITY_BIN -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.$BUILD_SCRIPT -nographics -buildTarget Android     
    artifacts:
        - android/*.aab
    publishing:
      scripts:
        - name: Deactivate Unity License
          script: $UNITY_BIN -batchmode -quit -returnlicense -nographics
      google_play:
        # See the following link for information regarding publishing to Google Play - https://docs.codemagic.io/publishing-yaml/distribution/#google-play
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: alpha   # Any default or custom track    
{{< /highlight >}}

# How to build an Oculus VR app with Unity and Codemagic

Unity is a cross-platform game engine developed by Unity Technologies. It allows us to quickly create various types of applications and games and, in particular, it lets us design XR (AR or VR) experiences.

An Oculus VR app is built just like an Android app: we have to produce an Android package (`.apk`). Codemagic's Unity premium macOS base image has the Unity SDK and Android modules pre-installed.

This guide will show you how to configure your Unity project and a Codemagic workflow that builds and publishes a Unity VR app to an Oculus dev release channel using a **codemagic.yaml** configuration file.

## Prerequisites

- A Unity Plus or Pro license. Your license is used to activate Unity on the Codemagic build server so the VR project can be exported. The license is returned during the publishing step of the workflow which is always run.
- An Oculus developer account. This account will be used to publish the built Unity app to the Oculus app release channel. You can sign up for the Oculus developer program [here](https://developer.oculus.com/).
- An Oculus app associated with your Unity VR app configured for new build uploads in release channels. To learn more about Oculus developer apps and release channels, check out [the Oculus official docs](https://developer.oculus.com/resources/publish-intro/).

## Adding your Unity project to Codemagic

It is possible to add repositories from Github, Gitlab, Bitbucket or any Git based repository. Please refer to the following documentation about adding apps from these sources.

- [Adding apps from GitHub.](https://docs.codemagic.io/getting-started/github/)
- [Adding apps from GitLab.](https://docs.codemagic.io/getting-started/gitlab/)
- [Adding apps from Bitbucket.](https://docs.codemagic.io/getting-started/bitbucket/)
- [Adding apps from other repositories.](https://docs.codemagic.io/getting-started/other/)

## Setting up your workflow

These are the key steps in setting up your workflow for building a Unity VR app for Oculus:

1. On the Applications page in Codemagic, click the **Add application** button and follow the on-screen instructions to add your Unity project.
2. Add environment variables for Unity as described [here](#unity-variables).
3. Add environment variables for Android code signing as described [here](#android-variables).
4. Add environment variables for Oculus app signing as described [here](#oculus-variables).
5. Add a build script to Unity as explained [here](#unity-build-script).
6. Configure the Android and VR build settings in Unity as described [here](#unity-build-settings).
7. Configure Custom Gradle templates as described [here](#custom-gradle-template).
8. Create a codemagic.yaml workflow configuration using the Unity template and configure with your details as shown [here](#workflow-configuration).

## Environment variables for Unity {#unity-variables}

You will need to set the following environment variables for Unity specific values in Codemagic:

`UNITY_SERIAL`, `UNITY_USERNAME` and `UNITY_PASSWORD`.

If you are using a Team in Codemagic, you can add these as global environment variables for your team by clicking on **Teams > Your Team name** and then clicking on **Global variables and secrets**. Otherwise, you can add the environment variables at the application level by clicking the **Environment variables** tab.

Add the environment variables as follows (make sure the **Secure** option is checked for any sensitive values):

1. Create a variable called `UNITY_SERIAL` and set the value to your Unity serial number. In the **Select group** dropdown type `unity` and click on the **Create "unity" group** button. Mark the variable as **secure** to encrypt the value and click the **Add** button.
2. Create a variable called `UNITY_USERNAME` and set the value to **email address** used with your Unity ID, add it to the "unity" group, mark this as **secure** to encrypt the value and click the **Add** button.
3. Create a variable called `UNITY_PASSWORD` and set the value to your Unity ID **password**, add to the "unity" group, mark this as **secure** to encrypt the value and click the **Add** button.

Note that the environment variable `UNITY_HOME` is already set on the build machines.

On the macOS Unity base image `UNITY_HOME` is set to `/Applications/Unity/Hub/Editor/2020.3.28f1/Unity.app`.

## Environment variables for Android code signing {#android-variables}

You will need to set the following environment variables in a variable group called `keystore_credentials` for Android code signing:

`CM_KEYSTORE_PATH`, `CM_KEYSTORE`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_PASSWORD` and `CM_KEY_ALIAS`.

Please refer to the documentation about signing Android apps [here](https://docs.codemagic.io/yaml-code-signing/signing-android/) for further details.

## Environment variables for Oculus app signing {#oculus-variables}

You will need to set the following environment variables in a variable group called `oculus` for Oculus app signing:

`OCULUS_APP_ID` and `OCULUS_APP_SECRET` (or `OCULUS_USER_TOKEN`)

You can find this info in your Oculus app dashboard, in the API section:

- The `OCULUS_APP_ID` is the **App ID** field of your app.
- If you own the application, then you'll be able to get the **App secret** field of your app and use it to fill the `OCULUS_APP_SECRET` Codemagic environment variable. Else, you will need to generate a user token and add it to your Codemagic environment variable as `OCULUS_USER_TOKEN`.

## Add a build script to Unity {#unity-build-script}

A Unity build script is required to build the project in headless mode.

Open Unity and add a new C# script in the project explorer in Assets/Editor called **Build**.

Paste the following script into the new file:

```cs
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
        EditorUserBuildSettings.buildAppBundle = false;

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
        buildPlayerOptions.locationPathName = "android/android.apk";
        buildPlayerOptions.target = BuildTarget.Android;
        buildPlayerOptions.options = BuildOptions.None;
        buildPlayerOptions.scenes = GetScenes();

        Debug.Log("Building Android");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log("Built Android");
    }

    private static string[] GetScenes()
    {
        return (from scene in EditorBuildSettings.scenes where scene.enabled select scene.path).ToArray();
    }

}
```

**Warning:** this script does not auto-increment the bundle version of your Android app so you will need to:

- either update it by hand along with the rest of your modifications in your commit(s)
- or use a specific Unity C# script that handles version number auto-increment like this one inspired by the [Version Incrementor from Francesco Forno](http://forum.unity3d.com/threads/automatic-version-increment-script.144917/):
  
    ```cs
    // Adapted from the Version Incrementor Script for Unity by Francesco Forno (Fornetto Games)
    
    using UnityEditor;
    using UnityEngine;
    
    public static class VersionIncrementor
    {
        public static void IncreaseBuild()
        {
            _IncrementVersion(0, 0, 1);
        }

        private static void _IncrementVersion(int majorIncr, int minorIncr, int buildIncr)
        {
            string[] lines = PlayerSettings.bundleVersion.Split('.');
    
            int MajorVersion = int.Parse(lines[0]) + majorIncr;
            int MinorVersion = int.Parse(lines[1]) + minorIncr;
            int Build = int.Parse(lines[2]) + buildIncr;
    
            PlayerSettings.bundleVersion =
                MajorVersion.ToString("0") + "." +
                MinorVersion.ToString("0") + "." +
                Build.ToString("0");
            PlayerSettings.Android.bundleVersionCode =
                MajorVersion * 10000 + MinorVersion * 1000 + Build;
        }
    }
    ```

    And call it in your **Builds** script:

    ```cs
    public static class BuildScript
    {

        [MenuItem("Build/Build Android")]
        public static void BuildAndroid()
        {
            // auto-increment the bundle build version
            VersionIncrementor.IncreaseBuild();

            PlayerSettings.Android.useCustomKeystore = true;
            EditorUserBuildSettings.buildAppBundle = false;

            // (same code as before)
        }

        private static string[] GetScenes()
        {
            return (from scene in EditorBuildSettings.scenes where scene.enabled select scene.path).ToArray();
        }

    }
    ```

## Configure Android and VR build settings in Unity {#unity-build-settings}

To begin with, make sure that when you first create your project, you start from the **official Unity VR project template**. This will automatically add various sample assets and global settings to your project.

Then, you need to check your build configuration so that the project uses Android as the build target. If it is not yet the case, click File > Build Settings, select Android in the Platform section and click on the **Switch Platform** button.

Then, click Edit > Project Settings and:

1. Click on the XR Plug-in Management tab and pick the **Oculus** option for the Android build.
2. Click on the Player settings tab.
3. Expand 'Other Settings' and check the 'Override Default Package Name' checkbox.
4. Enter the package name for your app, e.g. com.domain.yourappname.
5. Set the 'Version number'.
6. Set the 'Minimum API Level' and 'Target API Level' to **Android 10.0 (API Level 29)** (be careful, higher versions are not supported by Oculus at the moment).
7. In the 'Configuration' section set 'Scripting Backend' to **IL2CPP**.

## Add a custom base Gradle template {#custom-gradle-template}

You will need to add custom gradle templates so your Android builds work with Codemagic.

1. Open Unity and File > Build Settings.
2. Make sure Android is selected in the Platform section.
3. Click on the Player Settings.
4. Expand the Publishing Settings.
5. Check the ‘Custom Base Gradle Template’.
6. Close the project settings and build settings.

Then modify the base Gradle template as follows:

1. In the project explorer expand Assets > Plugins > Android.
2. Double click on baseProjectTemplate.gradle.
3. Replace the entire file contents with the following:

```gradle
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

## Workflow configuration with codemagic.yaml {#workflow-configuration}

Your workflow should be configured using the **codemagic.yaml** configuration file and checked into the root of the branches you wish to build using Codemagic.

Since the Oculus CLI tools are not pre-installed on Codemagic machines, we need to download and set these up during the workflow, before using this CLI to publish our app to the release channel.

Add the following to your **codemagic.yaml** configuration file:

```yaml
workflows:
  unity-oculus-workflow:
    name: Unity Oculus Workflow
    max_build_duration: 120
    environment:
        groups:
        # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
            - unity # <-- (Includes UNITY_HOME, UNITY_SERIAL, UNITY_USERNAME and UNITY_PASSWORD)
            - keystore_credentials # <-- (Includes CM_KEYSTORE, CM_KEYSTORE_PASSWORD, CM_KEY_PASSWORD, CM_KEY_ALIAS)
            - oculus # <-- (Includes OCULUS_APP_ID, OCULUS_APP_SECRET)
        vars:
            UNITY_BIN: $UNITY_HOME/Contents/MacOS/Unity
            PACKAGE_NAME: "com.domain.yourappname" # <-- Put your package name here e.g. com.domain.myapp
            OCULUS_RELEASE_CHANNEL: ALPHA # <-- Put your release channel name here (cannot be "store" = Production)
    scripts:
        - name: Activate Unity License
            script: | 
                $UNITY_BIN -batchmode -quit -logFile -serial ${UNITY_SERIAL?} -username ${UNITY_USERNAME?} -password ${UNITY_PASSWORD?}      
        - name: Set up keystore
            script: | 
                echo $CM_KEYSTORE | base64 --decode > $CM_BUILD_DIR/keystore.keystore
        - name: Build Unity app
            script: | 
                $UNITY_BIN -batchmode -quit -logFile -projectPath . -executeMethod BuildScript.BuildAndroid -nographics -buildTarget Android
    artifacts:
        - android/*.apk
    publishing:
        scripts:
            - name: Deactivate License
              script: $UNITY_BIN -batchmode -quit -returnlicense -nographics
            - name: Install Oculus CLI tools
              script: |
                wget -O ovr-platform-util "https://www.oculus.com/download_app/?id=1462426033810370&access_token=OC%7C1462426033810370%7C"
                chmod +x ./ovr-platform-util
            - name: Publish app on a Oculus test release channel
              script: |
                ./ovr-platform-util upload-quest-build --app_id $OCULUS_APP_ID  --app_secret $OCULUS_APP_SECRET --apk android/android.apk --channel $OCULUS_RELEASE_CHANNEL
```

**Important note:** if you use the `OCULUS_USER_TOKEN` environment variable instead of the `OCULUS_APP_SECRET` one, you need to change the last line of the **codemagic.yaml** file to the following:

```yaml
./ovr-platform-util upload-quest-build --app_id $OCULUS_APP_ID --token $OCULUS_USER_TOKEN --apk android/android.apk --channel $OCULUS_RELEASE_CHANNEL
```

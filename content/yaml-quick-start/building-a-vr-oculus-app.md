---
title: Oculus VR apps with Unity
description: How to build a Unity Oculus VR app with codemagic.yaml
weight: 13

---

Unity is a cross-platform game engine developed by Unity Technologies. It allows you to quickly create various types of applications and games and, in particular, it lets you design XR (AR or VR) experiences.

The process of building Oculus VR apps with Unity closely follows the steps for building a regular Unity Android project with a couple of extra steps.

This guide will illustrate all of the necessary steps to successfully build and publish an Oculus Unity VR app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

## Prerequisites

* Building Unity apps in a cloud CI/CD environment requires a Unity **Plus** or a **Pro** license. Your license is used to activate Unity on the Codemagic build server so the iOS and Android projects can be exported.  The license is returned during the publishing step of the workflow which is always run **except if the build is cancelled**.

  You can use [Unity dashboard](https://id.unity.com/en/serials) to check the number of free seats on your license or to manually return a seat if necessary.

* You will also need an Oculus developer account. This account will be used to publish the built Unity app to the Oculus app release channel. You can sign up for the Oculus developer program [here](https://developer.oculus.com/).
* An Oculus app associated with your Unity VR app configured for new build uploads in release channels. To learn more about Oculus developer apps and release channels, check out [the Oculus official docs](https://developer.oculus.com/resources/publish-intro/).

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

#### Generating a keystore
You can create a keystore for signing your release builds with the Java Keytool utility by running the following command:

{{< highlight Shell "style=paraiso-dark">}}
keytool -genkey -v -keystore codemagic.keystore -storetype JKS \
        -keyalg RSA -keysize 2048 -validity 10000 -alias codemagic
{{< /highlight >}}

Keytool then prompts you to enter your personal details for creating the certificate, as well as provide passwords for the keystore and the key. It then generates the keystore as a file called **codemagic.keystore** in the directory you're in. The key is valid for 10,000 days.

#### Uploading a keystore

1. Open your Codemagic Team settings, and go to  **codemagic.yaml settings** > **Code signing identities**.
2. Open **Android keystores** tab.
3. Upload the keystore file by clicking on **Choose a file** or by dragging it into the indicated frame.
4. Enter the **Keystore password**, **Key alias** and **Key password** values as indicated.
5. Enter the keystore **Reference name**. This is a unique name used to reference the file in `codemagic.yaml`
6. Click the **Add keystore** button to add the keystore.

For each of the added keystore, its common name, issuer, and expiration date are displayed.

{{<notebox>}}
**Note**: The uploaded keystore cannot be downloaded from Codemagic. It is crucial that you independently store a copy of the keystore file as all subsequent builds released to Google Play should be signed with the same keystore.

However, keep the keystore file private and do not check it into a public repository.
{{</notebox>}}

#### Referencing keystores in codemagic.yaml

To tell Codemagic to fetch the uploaded keystores from the **Code signing identities** section during the build, list the reference of the uploaded keystore under the `android_signing` field.

Add the following code to the `environment` section of your `codemagic.yaml` file:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    name: Android Workflow
    # ....
    environment:
      android_signing:
        - keystore_reference
{{< /highlight >}}

Default environment variables are assigned by Codemagic for the values on the build machine:

- Keystore path: `CM_KEYSTORE_PATH`
- Keystore password: `CM_KEYSTORE_PASSWORD`
- Key alias: `CM_KEY_ALIAS`
- Key alias password: `CM_KEY_PASSWORD`


## Configuring Unity license

Each Unity build will have to activate a valid Unity Plus or a Unity Pro license using your **Unity email**, **Unity serial number** and the **Unity password**.

1. You can add these as global environment variables for your personal account by navigating to **Teams > Personal Account** or team by navigating to **Teams > Your Team Name** and then clicking on **Global variables and secrets**. Likewise, you can add the environment variables at the application level by clicking the **Environment variables** tab.

2. Enter `UNITY_EMAIL` as the **_Variable name_**.
3. Enter the email address used with your Unity ID as **_Variable value_**.
4. Enter the variable group name, e.g. **_unity_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to also add `UNITY_SERIAL` and `UNITY_PASSWORD` variables.
8. Add the **unity_credentials** variable group to the `codemagic.yaml`:
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - unity_credentials
{{< /highlight >}}

{{<notebox>}}
**Note:** The `UNITY_HOME` environment variable is already set on the build machines. 

On the macOS Unity base image `UNITY_HOME` is set to `/Applications/Unity/Hub/Editor/2020.3.28f1/Unity.app`.
{{</notebox>}}


## Activating and deactivating the license
#### Activation
To activate a Unity license on the build machine, add the following step at the top of your `scripts:` section in `codemagic.yaml`:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Activate Unity license
      script: | 
        $UNITY_BIN -batchmode -quit -logFile \
          -serial ${UNITY_SERIAL?} \
          -username ${UNITY_EMAIL?} \
          -password ${UNITY_PASSWORD?}
{{< /highlight >}}

#### Deactivation
To deactivate a Unity license on the build machine, add the following script step in the `publishing:` section in `codemagic.yaml`:

{{< tabpane >}}

{{< tab header="Linux instances" >}}
{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    scripts:
      - name: Deactivate Unity License
      script: | 
        $UNITY_BIN -batchmode -quit -returnlicense -nographics
{{< /highlight >}}
{{< /tab >}}

{{% tab header="Mac M2 instances" %}}
{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    scripts:
      - name: Deactivate Unity License
      script: | 
        /Applications/Unity\ Hub.app/Contents/Frameworks/UnityLicensingClient_V1.app/Contents/MacOS/Unity.Licensing.Client \
          --return-ulf \
          --username ${UNITY_USERNAME?} \
          --password ${UNITY_PASSWORD?}
{{< /highlight >}}
{{% /tab %}}

{{< /tabpane >}}

{{<notebox>}}
**Note:** If a build is manually cancelled before reaching the publishing section, the license WILL NOT BE RETURNED automatically. This may cause future builds to fail if there are no free license seats available.

Visit [Unity dashboard](https://id.unity.com/en/subscriptions) to manually deactivate license.
{{</notebox>}}


## Creating a build script

You need to create additional build script to allow building and codesigning Unity projects in headless mode. Add a new file `/Assets/Editor/Build.cs` with the following content:

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
        EditorUserBuildSettings.buildAppBundle = false;

        // Auto-set the version code using Codemagic's
        // current workflow index
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
{{< /highlight >}}

## Configuring Unity project settings

To begin with, make sure that when you first create your project, you start from the **official Unity VR project template**. This will automatically add various sample assets and global settings to your project.

Then, you need to check your build configuration so that the project uses Android as the build target. If it is not yet the case, click **File > Build Settings**, select **Android** in the **Platform** section and click on the **Switch Platform** button.

Then, click **Edit > Project Settings** and:

1. Click on the **XR Plug-in Management** tab and pick the **Oculus** option for the Android build.
2. Click on the **Player settings** tab.
3. Expand **Other Settings** and check the **Override Default Package Name** checkbox.
4. Enter the package name for your app, e.g. `com.domain.yourappname`.
5. Set the **Version number**.
6. Put any integer value in the **Bundle Version Code**. This will be overridden with the build script.
7. Set the **Minimum API Level** and **Target API Level** to `Android 10.0 (API Level 29)` (note that higher versions are not supported by Oculus at the moment).
8. In the **Configuration** section set **Scripting Backend** to `IL2CPP`.

#### Add a custom base Gradle template
You will need to add custom Gradle templates so your Android builds work with Codemagic.  

1. Open Unity and **File > Build Settings**.
2. Make sure **Android** is selected in the **Platform** section.
3. Click on the **Player Settings**.
4. Expand the **Publishing Settings**.
5. Check the **Custom Base Gradle Template**.
6. Close the project settings and build settings.

#### Modify the base Gradle template
1. In the project explorer expand **Assets > Plugins > Android**.
2. Double click on **baseProjectTemplate.gradle**.
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


## Build versioning
When publishing your app, each uploaded artifact must have a unique build version. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).

A simple way to automatically increment the build version is to use Codemagic [built-in variables](../yaml-basic-configuration/environment-variables), such as `BUILD_NUMBER` - auto incremented number of builds for this project and workflow combination. The `/Assets/Editor/Build.cs` build script can use this environment variable to set the actual build number for the resulting `.apk`.


## Building the app

Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    #...
    vars:
      UNITY_BIN: $UNITY_HOME/Contents/MacOS/Unity
  scripts:
    - name: Activate Unity license
      script: #...
    - name: Set the build number
      script: | 
        export NEW_BUILD_NUMBER=$BUILD_NUMBER
    - name: Build the project
      script: | 
        $UNITY_BIN -batchmode \
          -quit \
          -logFile \
          -projectPath . \
          -executeMethod BuildScript.BuildAndroid \
          -nographics \
          -buildTarget Android
    artifacts:
      - android/*.apk
{{< /highlight >}}


## Publishing
Codemagic offers a wide array of options for app publishing and the list of partners and integrations is continuously growing. For the most up-to-date information, check the guides in the **Configuration > Publishing** section of these docs. 

#### Email publishing
{{< include "/partials/quickstart/publishing-email.md" >}}

#### Oculus distribution
Meta Platforms Technologies provides several options for selling and distributing apps on their platform. To learn more about different options, please visit their [official page](https://developer.oculus.com/policy/distribution-options/).

To distribute your app to one of their stores, you can use the **Oculus Platform Utility**. This example will showcase distribution to the **Meta Quest Store** but you can find documentation on other available options in the [official Oculus platform utility docs](https://developer.oculus.com/resources/publish-reference-platform-command-line-utility/).

##### Configure Oculus credentials
Follow [the official guide](https://developer.oculus.com/resources/publish-reference-platform-command-line-utility/#credentials) to obtain either a **Oculus app ID / App secret** combination or an **Oculust user token**.

1. You can add these as global environment variables for your personal account by navigating to **Teams > Personal Account** or team by navigating to **Teams > Your Team Name** and then clicking on **Global variables and secrets**. Likewise, you can add the environment variables at the application level by clicking the **Environment variables** tab.

2. Enter `OCULUS_APP_ID` as the **_Variable name_**.
3. Enter the corresponding value as **_Variable value_**.
4. Enter the variable group name, e.g. **_oculus_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the process to also add either the `OCULUS_APP_SECRET` or the `OCULUS_USER_TOKEN` variable.
8. Add the **unity_credentials** variable group to the `codemagic.yaml`:
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - oculus_credentials
    vars:
      OCULUS_RELEASE_CHANNEL: ALPHA
{{< /highlight >}}

##### Publish the app
Add following script steps to the `publishing:` section in your `codemagic.yaml` file to download the Oculus Platform Utility tool and to upload your app to the store:

{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    scripts:
      - name: Deactivate License
        script: #...
      - name: Install Oculus CLI tools
        script: | 
          wget -O ovr-platform-util \
            "https://www.oculus.com/download_app/?id=1462426033810370&access_token=OC%7C1462426033810370%7C"
          chmod +x ./ovr-platform-util
      - name: Publish app on a Oculus test release channel
        script: | 
          ./ovr-platform-util upload-quest-build \
            --app_id $OCULUS_APP_ID  \
            --app_secret $OCULUS_APP_SECRET \
            --apk android/android.apk \
            --channel $OCULUS_RELEASE_CHANNEL
{{< /highlight >}}


{{<notebox>}}
**Note:** If you are using Oculus user token to authenticate, replace the last script step with the following:
{{< highlight yaml >}}
    - name: Publish app on a Oculus test release channel
      script: | 
        ./ovr-platform-util upload-quest-build \
        --app_id $OCULUS_APP_ID  \
        --token $OCULUS_USER_TOKEN \
        --apk android/android.apk \
        --channel $OCULUS_RELEASE_CHANNEL
{{< /highlight >}}
{{</notebox>}}


## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the app in the Codemagic UI and start the build to see it in action.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  unity-oculus-workflow:
    name: Unity Oculus Workflow
    max_build_duration: 120
    environment:
      android_signing:
        - keystore_reference
      groups:
        - unity_credentials
        - oculus_credentials
      vars:
        UNITY_BIN: $UNITY_HOME/Contents/MacOS/Unity
        OCULUS_RELEASE_CHANNEL: ALPHA # <-- Put your release channel name here (cannot be "store" = Production)
    scripts:
      - name: Activate Unity License
        script: | 
        $UNITY_BIN -batchmode -quit -logFile \
          -serial ${UNITY_SERIAL?} \
          -username ${UNITY_EMAIL?} \
          -password ${UNITY_PASSWORD?}     
      - name: Set the build number
        script: | 
          export NEW_BUILD_NUMBER=$BUILD_NUMBER
      - name: Build the project
        script: | 
          $UNITY_BIN -batchmode \
            -quit \
            -logFile \
            -projectPath . \
            -executeMethod BuildScript.BuildAndroid \
            -nographics \
            -buildTarget Android
    artifacts:
        - android/*.apk
    publishing:
      scripts:
        - name: Deactivate License
          script: | 
            /Applications/Unity\ Hub.app/Contents/Frameworks/UnityLicensingClient_V1.app/Contents/MacOS/Unity.Licensing.Client \
              --return-ulf \
              --username ${UNITY_USERNAME?} \
              --password ${UNITY_PASSWORD?}
        - name: Install Oculus CLI tools
          script: | 
            wget -O ovr-platform-util \
              "https://www.oculus.com/download_app/?id=1462426033810370&access_token=OC%7C1462426033810370%7C"
            chmod +x ./ovr-platform-util
        - name: Publish app on a Oculus test release channel
          script: | 
            ./ovr-platform-util upload-quest-build \
              --app_id $OCULUS_APP_ID  \
              --app_secret $OCULUS_APP_SECRET \
              --apk android/android.apk \
              --channel $OCULUS_RELEASE_CHANNEL
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
{{< /highlight >}}

## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}
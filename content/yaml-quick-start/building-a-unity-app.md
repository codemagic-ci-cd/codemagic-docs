---
title: Unity apps
description: How to build Unity mobile apps with codemagic.yaml
weight: 12

---

Unity is a cross-platform game engine developed by Unity Technologies. It can be used to create mobile applications that run on iOS and Android.

This guide will illustrate all of the necessary steps to successfully build and publish a Unity app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/unity/unity-demo-project).

## Unity licensing requirements

Building Unity apps in a cloud CI/CD environment requires a Unity **Plus** or a **Pro** license. Your license is used to activate Unity on the Codemagic build server so the iOS and Android projects can be exported.  The license is returned during the publishing step of the workflow which is always run **except if the build is cancelled**.

You can use [Unity dashboard](https://id.unity.com/en/serials) to check the number of free seats on your license or to manually return a seat if necessary.

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}


## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

{{< tabpane >}}

{{% tab header="Android" %}}
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
{{% /tab %}}

{{< tab header="iOS" >}}
{{< include "/partials/quickstart/code-signing-ios.md" >}}
{{< /tab >}}

{{< tab header="macOS" >}}
{{< include "/partials/quickstart/code-signing-macos.md" >}}
{{< /tab >}}

{{< tab header="Windows" >}}
Code signing is not required when creating Windows Unity apps.
 
{{< /tab >}}
{{< /tabpane >}}


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
**Note:** The `UNITY_HOME` environment variable is already set on the build machines to `/Applications/Unity/Hub/Editor/<default-unity-version>/Unity.app`.

See the default Unity version from the macOS build machine specification [here](../specs/versions-macos/).
{{</notebox>}}

## Activating and deactivating the license
#### Activation
To activate a Unity license on the build machine, add the following step at the top of your `scripts:` section in `codemagic.yaml`:

{{< tabpane >}}

{{< tab header="macOS/Linux instance types" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Activate Unity license
      script: | 
        $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile \
          -serial ${UNITY_SERIAL} \
          -username ${UNITY_EMAIL} \
          -password ${UNITY_PASSWORD}
{{< /highlight >}}
{{< /tab >}}

{{% tab header="Windows instances" %}}
When using Codemagic Windows instance types, Unity activation is performed in the same command that build the app.
{{% /tab %}}

{{< /tabpane >}}

#### Deactivation
To deactivate a Unity license on the build machine, add the following script step in the `publishing:` section in `codemagic.yaml`:

{{< tabpane >}}

{{< tab header="mac (Intel) & Linux instance types" >}}
{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    scripts:
      - name: Deactivate Unity License
      script: | 
        $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -returnlicense -nographics
{{< /highlight >}}
{{< /tab >}}

{{% tab header="Mac M1 instances" %}}
{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    scripts:
      - name: Deactivate Unity License
        script: | 
          /Applications/Unity\ Hub.app/Contents/Frameworks/UnityLicensingClient_V1.app/Contents/MacOS/Unity.Licensing.Client \
            --return-ulf \
            --username ${UNITY_EMAIL?} \
            --password ${UNITY_PASSWORD?}
{{< /highlight >}}
{{% /tab %}}

{{% tab header="Windows instances" %}}
{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    scripts:
      - name: Deactivate Unity License
        script: | 
          cmd.exe /c "$env:UNITY_HOME\\Unity.exe" -batchmode -quit -returnlicense -nographics
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

    [MenuItem("Build/Build Windows")]
    public static void BuildWindows()
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.locationPathName = "win/" + Application.productName + ".exe";
        buildPlayerOptions.target = BuildTarget.StandaloneWindows;
        buildPlayerOptions.options = BuildOptions.None;
        buildPlayerOptions.scenes = GetScenes();

        Debug.Log("Building Windows");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log("Built Windows");
    }

    [MenuItem("Build/Build Mac")]
    public static void BuildMac()
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.locationPathName = "mac/" + Application.productName + ".app";
        buildPlayerOptions.target = BuildTarget.StandaloneOSX;
        buildPlayerOptions.options = BuildOptions.None;
        buildPlayerOptions.scenes = GetScenes();

        Debug.Log("Building StandaloneOSX");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log("Built StandaloneOSX");
    }

    private static string[] GetScenes()
    {
        return (from scene in EditorBuildSettings.scenes where scene.enabled select scene.path).ToArray();
    }

}
{{< /highlight >}}


## Configuring Unity project settings

Depending on the target platform, you will need to configure some settings in your Unity project.

{{< tabpane >}}

{{% tab header="Android" %}}
#### Project settings
Google recommends that Android applications be published to Google Play using the application bundle (.aab). You should configure the following settings in Unity before building the application bundle:

1. Open Unity and click **File > Build Settings**.
2. Make sure Android is selected in the **Platform** section.
3. Check the **Build App Bundle (Google Play)** checkbox.
4. Make sure that **Export Project** is **NOT** checked.
5. Click on the **Player Settings** button.
6. Expand **Other Settings** and check the **Override Default Package Name** checkbox.
7. Enter the package name for your app, e.g. "com.domain.yourappname".
8. Set the **Version number**.
9. Put any integer value in the **Bundle Version Code**. This will be overridden by the build script.
10. Set the **Minimum API Level** and **Target API Level** to `Android 11.0 (API level 30)` which is required for publishing application bundles.
11. In the **Configuration** section set **Scripting Backend** to `IL2CPP`.
12. In the **Target Architectures** section check **ARMv7** and **ARM64** to support 64-bit architectures so the app is compliant with the Google Play 64-bit requirement.

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
{{% /tab %}}

{{% tab header="iOS" %}}
#### Set the iOS bundle identifier
You should set the bundle id of your iOS application before building the Xcode project. 

1. Open Unity and **File > Build Settings**.
2. Make sure **iOS** is selected and click on the **Player Settings** button.
3. Expand the **Other Settings** section.
4. In the **Identification** section check the **Override Default Bundle Identifier** option.
5. Set the **Bundle Identifier** to match the identifier name you have used in your Apple Developer Program account.
{{% /tab %}}

{{< /tabpane >}}

## Build versioning

If you are going to publish your app to App Store Connect or Google Play, each uploaded artifact must have a new version satisfying each app store’s requirements. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).



{{< tabpane >}}
{{% tab header="Android" %}}
One very useful method of calculating the code version is to use Codemagic command line tools to get the latest build number from Google Play and increment it by one. You can then save this as the `NEW_BUILD_NUMBER` environment variable that is already expected by the `/Assets/Editor/Build.cs` build script.

The prerequisite is a valid **Google Cloud Service Account**. Please follow these steps:
1. Go to [this guide](../knowledge-base/google-services-authentication) and complete the steps in the **Google Play** section.
2. Skip to the **Creating a service account** section in the same guide and complete those steps also.
3. You now have a `JSON` file with the credentials.
4. Open Codemagic UI and create a new Environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`.
5. Paste the content of the downloaded `JSON` file in the **_Value_** field, set the group name (e.g. **google_play**) and make sure the **Secure** option is checked.
6. Add the **google_play** variable group to the `codemagic.yaml` as well as define the `PACKAGE_NAME` and the `GOOGLE_PLAY_TRACK`:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow-id:
    # ....
    environment:
      android_signing:
        - keystore_reference
      groups:
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.unitysample"
        GOOGLE_PLAY_TRACK: alpha
{{< /highlight >}}

7. Modify the build script to fetch the latest build number from Google Play, increment it and pass it as command line argument to the build command
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set the build number
      script: | 
        export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number \
          --package-name "$PACKAGE_NAME" \
          --tracks="$GOOGLE_PLAY_TRACK") + 1))
{{< /highlight >}}
{{% /tab %}}


{{% tab header="iOS" %}}

In order to get the latest build number from App Store or TestFlight, you will need the App Store credentials as well as the **Application Apple ID**. This is an automatically generated ID assigned to your app and it can be found under **General > App Information > Apple ID** under your application in App Store Connect.

1. Add the **Application Apple ID** to the `codemagic.yaml` as a variable
2. Add the script to get the latest build number using `app-store-connect`, increment it and pass it as command line argument to the build command:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    integrations:
      app_store_connect: <App Store Connect API key name>
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.unitysample
      vars:
        APP_ID: 1555555551
    scripts:
      - name: Set the build number
        script: | 
          BUILD_NUMBER=($(app-store-connect get-latest-app-store-build-number "$APP_ID") + 1)
          cd ios
          agvtool new-version -all $BUILD_NUMBER

{{< /highlight >}}
{{% /tab %}}

{{< /tabpane >}}


## Building the app

Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).


{{< tabpane >}}
{{% tab header="Android" %}}

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    #...
  scripts:
    - name: Activate Unity license
      script: #...
    - name: Set the build number
      script: #... 
    - name: Build the project
      script: | 
        $UNITY_HOME/Contents/MacOS/Unity -batchmode \
          -quit \
          -logFile \
          -projectPath . \
          -executeMethod BuildScript.BuildAndroid \
          -nographics
    artifacts:
      - android/*.aab
{{< /highlight >}}
{{< /tab >}}


{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    #...
    vars:
      UNITY_IOS_DIR: ios
      XCODE_PROJECT: "Unity-iPhone.xcodeproj"
      XCODE_SCHEME: "Unity-iPhone"
  scripts:
    - name: Activate Unity license
      script: #...
    - name: Generate the Xcode project from Unity
      script: | 
        $UNITY_HOME/Contents/MacOS/Unity -batchmode \
          -quit \
          -logFile \
          -projectPath . \
          -executeMethod BuildScript.BuildIos \
          -nographics
    - name: Set up code signing settings on Xcode project
      script: | 
        xcode-project use-profiles
    - name: Set the build number
      script: #...
    - name: Build the project
      script: | 
        xcode-project build-ipa --project "$UNITY_IOS_DIR/$XCODE_PROJECT" --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}

{{<notebox>}}
**Note**: If you are using Pod files and Xcode workspace, replace the **Build the project** step by this (don't forget to configure the `XCODE_WORKSPACE` variable):
{{< highlight yaml >}}
    - name: Install pods
      script: | 
        pod install
    - name: Build the project
      script: | 
        xcode-project build-ipa \
          --workspace "$UNITY_IOS_DIR/$XCODE_WORKSPACE" \
          --scheme "$XCODE_SCHEME"
{{< /highlight >}}
{{</notebox>}}

{{< /tab >}}


{{< tab header="macOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    #...
    vars:
      UNITY_MAC_DIR: mac
      BUNDLE_ID: "io.codemagic.unitysample"
  scripts:
    - name: Set up keychain
      script: | 
        keychain initialize
    - name: Fetch signing files
      script: | 
        app-store-connect fetch-signing-files "$BUNDLE_ID" \
          --type MAC_APP_STORE \
          --platform MAC_OS \
          --create
    - name: Fetch Mac Installer Distribution certificates
      script: | 
        app-store-connect list-certificates --type MAC_INSTALLER_DISTRIBUTION --save || \
        app-store-connect create-certificate --type MAC_INSTALLER_DISTRIBUTION --save 
    - name: Add certs to keychain
      script: | 
        keychain add-certificates
    - name: Set up code signing settings on Xcode project
      script: | 
        xcode-project use-profiles
    - name: Activate License
      script: #...
    - name: Build the project
      script: | 
        $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile \
          -projectPath . \
          -executeMethod BuildScript.BuildMac \
          -nographics
    - name: Package macOS application
      script: | 
        set -x
        #
        # Command to find the path to your generated app
        APP_NAME=$(find $(pwd) -name "*.app")
        cd $(dirname "$APP_NAME")
        PACKAGE_NAME=$(basename "$APP_NAME" .app).pkg
        #
        # Create an unsigned package
        xcrun productbuild \
          --component "$APP_NAME" \
          /Applications/ unsigned.pkg
        #
        # Find the installer certificate common name in keychain
        INSTALLER_CERT_NAME=$(keychain list-certificates \
            | jq '.[]
              | select(.common_name
              | contains("Mac Developer Installer"))
              | .common_name' \
            | xargs)
        #
        # Sign the package
        xcrun productsign \
          --sign "$INSTALLER_CERT_NAME" \
          unsigned.pkg "$PACKAGE_NAME"
        #
        # Optionally remove the not needed unsigned package
        rm -f unsigned.pkg
    artifacts:
      - $UNITY_MAC_DIR/*.app
      - $UNITY_MAC_DIR/*.pkg
{{< /highlight >}}
{{< /tab >}}


{{< tab header="Windows" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Activate & Build Unity Using a Command Prompt
      script: | 
        cmd.exe /c "$env:UNITY_HOME\\Unity.exe" ^
          -batchmode -quit -logFile ^
          -projectPath . ^
          -executeMethod BuildScript.BuildWindows ^
          -nographics ^
          -serial $env:UNITY_SERIAL ^
          -username $env:UNITY_EMAIL ^
          -password $env:UNITY_PASSWORD
    - name: Export Unity
      script: | 
        cd windows
        7z a -r release.zip ./*
    artifacts:
      - windows/*.zip
{{< /highlight >}}

{{< /tab >}}
{{< /tabpane >}}
 

{{<notebox>}}
**Note**: Read how to use different Unity version [here](../knowledge-others/install-unity-version/).
{{</notebox>}}

## Publishing

{{< include "/partials/publishing-android-ios.md" >}}

#### App Store post processing

When publishing your app to TestFlight or the App Store, you will be asked if your app uses encryption. 

You can automate your answer to this question by setting the key `ITSAppUsesNonExemptEncryption` in your app's `Info.plist` file and set the value to `NO` if the app doesn't use encryption. 

For more details about complying with encryption export regulations, please see [here](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations).

A Unity post-processing script can be used to set values in the `Info.plist` of the Xcode project.

Create a new file `/Assets/Editor/PostProcessing.cs` with the following content:

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

<!-- ## Caching
You can speed up your build by caching the Library folder, read more about caching [here](https://docs.codemagic.io/yaml/yaml-getting-started/#cache).
{{< highlight yaml "style=paraiso-dark">}}
    cache:
      cache_paths:
        - $CM_BUILD_DIR/Library
{{< /highlight >}} -->


## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the app in the Codemagic UI and start the build to see it in action.

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  unity-android-workflow:
    name: Unity Android Workflow
    max_build_duration: 120
    environment:
      android_signing:
        - keystore_reference
      groups:
        - unity_credentials
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.unitysample"
        GOOGLE_PLAY_TRACK: alpha
        PACKAGE_NAME: "io.codemagic.unitysample"
    scripts:
      - name: Activate Unity License
        script: | 
          $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile \
            -serial ${UNITY_SERIAL} \
            -username ${UNITY_EMAIL} \
            -password ${UNITY_PASSWORD}
      - name: Set the build number
        script: | 
          export NEW_BUILD_NUMBER=$(($(google-play get-latest-build-number \
            --package-name "$PACKAGE_NAME" \
            --tracks="$GOOGLE_PLAY_TRACK") + 1))
      - name: Build the project
        script: | 
          $UNITY_HOME/Contents/MacOS/Unity -batchmode \
            -quit \
            -logFile \
            -projectPath . \
            -executeMethod BuildScript.BuildAndroid \
            -nographics
    artifacts:
      - android/*.aab
    publishing:
      scripts:
        - name: Deactivate Unity License
          script: | 
            /Applications/Unity\ Hub.app/Contents/Frameworks/UnityLicensingClient_V1.app/Contents/MacOS/Unity.Licensing.Client \
            --return-ulf \
            --username ${UNITY_EMAIL} \
            --password ${UNITY_PASSWORD}
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: GOOGLE_PLAY_TRACK
        submit_as_draft: true
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  unity-ios-workflow:
    name: Unity iOS Workflow
    max_build_duration: 120
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.unitysample
      groups:
        - unity_credentials
      vars:
        UNITY_IOS_DIR: ios
        XCODE_PROJECT: "Unity-iPhone.xcodeproj"
        XCODE_SCHEME: "Unity-iPhone"
        BUNDLE_ID: "io.codemagic.unitysample"
        APP_ID: 1555555551
    scripts:
      - name: Activate Unity license
        script: | 
          $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile \
            -serial ${UNITY_SERIAL} \
            -username ${UNITY_EMAIL} \
            -password ${UNITY_PASSWORD}
      - name: Generate the Xcode project from Unity
        script: | 
          $UNITY_HOME/Contents/MacOS/Unity -batchmode \
            -quit \
            -logFile \
            -projectPath . \
            -executeMethod BuildScript.BuildIos \
            -nographics
      - name: Set up code signing settings on Xcode project
        script: | 
          xcode-project use-profiles
      - name: Set the build number
        script: | 
          BUILD_NUMBER=($(app-store-connect get-latest-app-store-build-number "$APP_ID") + 1)
          cd $UNITY_IOS_DIR
          agvtool new-version -all $BUILD_NUMBER
      - name: Build the project
        script: | 
          xcode-project build-ipa \
            --project "$UNITY_IOS_DIR/$XCODE_PROJECT" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
      scripts:
        - name: Deactivate Unity License
          script: | 
            /Applications/Unity\ Hub.app/Contents/Frameworks/UnityLicensingClient_V1.app/Contents/MacOS/Unity.Licensing.Client \
            --return-ulf \
            --username ${UNITY_EMAIL} \
            --password ${UNITY_PASSWORD}
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      app_store_connect:
        auth: integration
        #
        # Configuration related to TestFlight (optional)
        # Note: This action is performed during post-processing.
        submit_to_testflight: true 
        #
        # Specify the names of beta tester groups that will get access 
        # to the build once it has passed beta review.
        beta_groups:
          - group name 1
          - group name 2
        #
        # Configuration related to App Store (optional)
        # Note: This action is performed during post-processing.
        submit_to_app_store: true
{{< /highlight >}}
{{< /tab >}}

{{< tab header="MacOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  unity-macos-workflow:
    name: Unity Mac Workflow
    max_build_duration: 120
    environment:
      groups:
        - unity_credentials
        - appstore_credentials
      vars:
        UNITY_MAC_DIR: mac
        XCODE_PROJECT: "Unity-iPhone.xcodeproj"
        XCODE_SCHEME: "Unity-iPhone"
        BUNDLE_ID: "io.codemagic.unitysample"
    scripts:
      - name: Activate Unity license
        script: | 
          $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile \
            -serial ${UNITY_SERIAL} \
            -username ${UNITY_EMAIL} \
            -password ${UNITY_PASSWORD}
      - name: Set up keychain
        script: | 
          keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files "$BUNDLE_ID" \
            --platform MAC_OS \
            --type MAC_APP_STORE \
            --create
      - name: Fetch Mac Installer Distribution certificates
        script: |  
            app-store-connect list-certificates --type MAC_APP_DISTRIBUTION --save || \
            app-store-connect create-certificate --type MAC_APP_DISTRIBUTION --save
      - name: Add certs to keychain
        script: | 
          keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: | 
          xcode-project use-profiles    
      - name: Build the project
        script: | 
          $UNITY_HOME/Contents/MacOS/Unity -batchmode -quit -logFile \
            -projectPath . \
            -executeMethod BuildScript.BuildMac \
            -nographics
      - name: Package application
        script: | 
          set -x

          APP_NAME=$(find $(pwd) -name "*.app")  
          cd $(dirname "$APP_NAME")
    
          PACKAGE_NAME=$(basename "$APP_NAME" .app).pkg
          xcrun productbuild \
            --component "$APP_NAME" \
            /Applications/ unsigned.pkg

          INSTALLER_CERT_NAME=$(keychain list-certificates \
            | jq '.[]
            | select(.common_name
            | contains("Mac Developer Installer"))
            | .common_name' \
            | xargs)
      
          xcrun productsign \
            --sign "$INSTALLER_CERT_NAME" \
            unsigned.pkg \
            "$PACKAGE_NAME"
          rm -f unsigned.pkg            
    artifacts:
      - $UNITY_MAC_DIR/*.app
      - $UNITY_MAC_DIR/*.pkg
    publishing:
      scripts:
        - name: Deactivate Unity License
          script: | 
            /Applications/Unity\ Hub.app/Contents/Frameworks/UnityLicensingClient_V1.app/Contents/MacOS/Unity.Licensing.Client \
            --return-ulf \
            --username ${UNITY_EMAIL} \
            --password ${UNITY_PASSWORD}
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      app_store_connect:
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID
        submit_to_testflight: false 
        submit_to_app_store: true
{{< /highlight >}}
{{< /tab >}}


{{< tab header="Windows" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  unity-windows-workflow:
    name: Unity Windows Workflow
    max_build_duration: 120
    instance_type: windows_x2
    environment:
      groups:
        - unity_credentials
    scripts:
      - name: Activate & Build Unity Using a Command Prompt
        script: | 
          cmd.exe /c "$env:UNITY_HOME\\Unity.exe" ^
            -batchmode -quit -logFile ^
            -projectPath . ^
            -executeMethod BuildScript.BuildWindows ^
            -nographics ^
            -serial $env:UNITY_SERIAL ^
            -username $env:UNITY_EMAIL ^
            -password $env:UNITY_PASSWORD
      - name: Export Unity
        script: | 
          cd windows
          7z a -r release.zip ./*
    artifacts:
      - windows/*.zip
    publishing:
      scripts:
        - name: Deactivate Unity License
          script: | 
            cmd.exe /c "$env:UNITY_HOME\\Unity.exe" -batchmode -quit -returnlicense -nographics
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      slack:
        channel: "#your-channel-name"
        notify_on_build_start: true
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}


## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}

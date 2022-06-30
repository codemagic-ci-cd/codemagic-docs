---
title: Building a React Native app
description: How to build a React Native app with codemagic.yaml
weight: 5
aliases:
  - '../yaml/building-a-react-native-app'
  - /getting-started/building-a-react-native-app
---
React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. Pairing it with Codemagic's CI/CD pipeline creates a powerful tool that automates all phases of mobile app development.



## Setting up a React Native project

If you do not have an existing React Native project or if you just want to quickly test Codemagic using a sample project, follow these steps to get started:


{{< tabpane >}}
{{< tab header="Clone a sample" >}}
<p>For a quick start, you can clone the appropriate project from our <a href="https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/react-native">Sample projects repository</a> to a version control platform of your choice and proceed with the next steps.</p>
{{< /tab >}}

{{< tab header="New Expo project" >}}
<p>If you are new to mobile development, the easiest way to get started is with Expo CLI. Expo is a set of tools built around React Native and, while it has many features, the most relevant feature for us right now is that it can get you writing a React Native app within minutes. You will only need a recent version of Node.js and a phone or emulator.</p>
{{<markdown>}}
1. If necessary, install <a href="https://nodejs.org/en/download/">Node 14 LTS</a> or greater.

2. Install Expo CLI:
{{</markdown>}}
{{< tabpane >}}
{{% tab header="npm" %}}
{{< highlight Shell "style=rrt">}}
npm install -g expo-cli
{{< /highlight >}}
{{% /tab %}}

{{% tab header="yarn" %}}
{{< highlight Shell "style=rrt">}}
yarn global add expo-cli
{{< /highlight >}}
{{% /tab %}}
{{% /tabpane %}}
{{<markdown>}}
3. Create a new project
{{< highlight Shell "style=rrt">}}
expo init CodemagicSample
cd CodemagicSample
{{< /highlight >}}
    
4. Configure the Git repository for the app.
{{</markdown>}}
{{% /tab %}}

{{% tab header="New React Native CLI project" lang="en" %}}
If you are already familiar with mobile development, you may want to use React Native CLI. It requires Xcode or Android Studio to get started. The required steps are outlined at the [official React Native site](https://reactnative.dev/docs/environment-setup).
{{% /tab %}}
{{< /tabpane >}}


---

## Using Expo without ejecting

To run a build on CI/CD we need to have the iOS and Android project folders. If you can't or don’t want to permanently eject Expo from your app, then you can do it on the build server each time you run a build. Follow the steps below to get started. You can check the finished sample app in our [samples repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/react-native/expo-react-native-not-ejected/codemagic.yaml).

1. Clone your repository to a temporary new location or create a new branch. in order to eject Expo once and get the `android/app/build.gradle` file.
2. Eject Expo once by running the following command:
{{< highlight Shell "style=rrt">}}
expo eject
{{< /highlight >}}
3. Copy the `android/app/build.gradle` file from the ejected project and add it to your main repository. In our example, we create a `support-files` folder and store the `build.gradle` inside.
4. Whenever this guide calls for making changes to the `android/app/build.gradle`, apply these changes to the `support-files/build.gradle` file instead.
5. Follow the steps in other **Expo without ejecting** sections in this guide to install the expo cli tools on the VM, run the scripts to copy the `build.gradle` file to the correct location and use other tools to adjust iOS settings in the `info.plist` file.

---

## Adding the app to Codemagic

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. If you have more than one team configured in Codemagic, select the team you wish to add the app to.
2. Connect the repository where the source code is hosted. Detailed instructions are available for each Git provider:
    [Bitbucket](../getting-started/bitbucket.md)
    [GitHub](../getting-started/github.md)
    [GitLab](../getting-started/gitlab.md)
    [Others](../getting-started/other.md)
3. Select the repository from the list of available repositories. Select the **React Native App** as the project type.
4. Click **Finish: Add apllication**

---

## Creating codemagic.yaml
In order to use `codemagic.yaml` for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the repository. Detailed explanation can be found [here](../yaml/yaml-getting-started.md).

{{<notebox>}}
**Tip**
You can find the complete codemagic.yaml example in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/react-native/react-native-demo-project/codemagic.yaml#L5).
{{</notebox>}}

If you prefer to write your `codemagic.yaml` file from scratch, you can start with this minimal configuration.

{{< tabpane >}}
{{% tab header="Android" %}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
    react-native-android:
        name: React Native Android
        max_build_duration: 120
        instance_type: mac_mini
{{< /highlight >}}

{{% /tab %}}

{{% tab header="iOS" %}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
    react-native-ios:
        name: React Native iOS
        max_build_duration: 120
        instance_type: mac_mini
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}


{{<notebox>}}
**Tip**
You can have more than one workflow in the same `codemagic.yaml` file. If you are building for both the Android and iOS, simply enter both workflows as:
{{</notebox>}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
    react-native-android:
        name: React Native Android
        # .......    
        # .......
        # .......  
    react-native-ios:
        name: React Native iOS
        # ......
{{< /highlight >}}


Scan for the `codemagic.yaml` file by selecting a branch to scan and clicking the **Check for configuration** file button at the top of the page. Note that you can have different configuration files in different branches.

---

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.
{{<notebox>}}
**Tip** If you are using [Codemagic Teams](../teams/teams), then signing files, such as Android keystores, can be managed under the [Code signing identities](./code-signing-identities) section in the team settings and do not have to be uploaded as environment variables as in the below instructions.
{{</notebox>}}

{{< tabpane >}}

{{< tab header="Android" >}}

<h4> Generating a keystore</h4>
<p>You can create a keystore for signing your release builds with the Java Keytool utility by running the following command:</p>

{{< highlight Shell "style=rrt">}}
keytool -genkey -v -keystore codemagic.keystore -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias codemagic
{{< /highlight >}}

<p>Keytool then prompts you to enter your personal details for creating the certificate, as well as provide passwords for the keystore and the key. It then generates the keystore as a file called <b>codemagic.keystore</b> in the directory you're in. The key is valid for 10,000 days.</p>


{{<notebox>}}
**Warning:** Keep the keystore and the key.properties files private; do not check them into public source control.
{{</notebox>}}

<h4> Signing Android apps using Gradle</h4>
Modify your <code><b>android/app/build.gradle</b></code> as follows:
{{< highlight kotlin "style=paraiso-dark">}}
...
  android {
      ...
      defaultConfig { ... }
      signingConfigs {
          release {
              if (System.getenv()["CI"]) { // CI=true is exported by Codemagic
                  storeFile file(System.getenv()["CM_KEYSTORE_PATH"])
                  storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]
                  keyAlias System.getenv()["CM_KEY_ALIAS"]
                  keyPassword System.getenv()["CM_KEY_PASSWORD"]
              } else {
                  keyAlias keystoreProperties['keyAlias']
                  keyPassword keystoreProperties['keyPassword']
                  storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                  storePassword keystoreProperties['storePassword']
              }
          }
      }
      buildTypes {
          release {
              ...
              signingConfig signingConfigs.release
          }
      }
  }
  ...
{{< /highlight >}}


<h4> Configuring Environment variables</h4>

<p>The environment variables referenced by the <code>build.gradle</code> need to be stored in the Codemagic UI. A detailed explanation on how Environment variables and groups work can be found <a href="../variables/environment-variable-groups.md">here</a>.</p>

The keystore file, like all binary files, has to be base64 encoded before storing its value.

{{< tabpane >}}
{{< tab header="Linux" >}}

<p>For Linux machines, we recommend installing xclip:</p>

{{< highlight Shell "style=rrt">}}
sudo apt-get install xclip
cat codemagic.keystore | base64 | xclip -selection clipboard
{{< /highlight >}}

Alternatively, you can run the following command and carefuly copy/paste the output:
{{< highlight Shell "style=rrt">}}
openssl base64 -in codemagic.keystore
{{< /highlight >}}

{{<notebox>}}
**Tip**: When copying file contents always include any tags. e.g. Don't forget to copy `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` too.
{{</notebox>}}

{{< /tab >}}

{{< tab header="macOS" >}}

<p>On macOS, running the following command base64 encodes the file and copies the result to the clipboard:</p>
{{< highlight Shell "style=rrt">}}
cat codemagic.keystore | base64 | pbcopy
{{< /highlight >}}
{{< /tab >}}

{{< tab header="Windows" >}}
<p>For Windows, the PowerShell command to base64 encode a file and copy it to the clipboard is:</p>
{{< highlight powershell "style=rrt">}}
[Convert]::ToBase64String([IO.File]::ReadAllBytes("codemagic.keystore")) | Set-Clipboard
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}

<br>
<ol>
<li>Open your Codemagic app settings, go to <b>Environment variables</b> tab.</li>
<li>Enter `CM_KEYSTORE` as the <b><i>Variable name</i></b>.</li>
<li>Paste the base64 encoded value of the keystore file in the <b><i>Variable value</i></b> field.</li>
<li>Enter a variable group name, e.g. <b><i>keystore_credentials</i></b>. Click the button to create the group.</li>
<li>Make sure the <b>Secure</b> option is selected so that the variable can be protected by encryption.</li>
<li>Click the <b>Add</b> button to add the variable.</li>
<li>Continue by adding <code>CM_KEYSTORE_PASSWORD</code>, <code>CM_KEY_ALIAS</code> and <code>CM_KEY_PASSWORD</code></li>
<li>Add the <code>CM_KEYSTORE_PATH</code> variable with the value <code>CM_KEYSTORE_PATH = $CM_BUILD_DIR/codemagic.keystore</code></li>
</ol>

{{<notebox>}}
**Tip:** Store all the keystore variables in the same group so they can be imported to codemagic.yaml workflow at once. 
  
If the group of variables is reusable for various applications, they can be defined in [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in **Team settings** for easier access.
{{</notebox>}}

<p>Environment variables have to be added to the workflow either individually or as a group. Modify your <code>codemagic.yaml</code> file by adding the following:</p>
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    name: React Native Android
    # ....
    environment:
        groups:
            - keystore_credentials
{{< /highlight >}}

<p>Environment variables added with the <b>Secure</b> option checked are tranferred to the build machine encrypted and are available only while the build is running. The build machine is destroyed at the end.</p>
<p>The content of the <code>base64</code> encoded files needs to be decoded before it can be used. Add the following script to your <code>codemagic.yaml</code> <b>scripts</b> section:</p>

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    # ....
    environment:
        # ....
    scripts:
      - name: Set up keystore
        script: |
     echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}

<h4> Prerequisites</h4>

<p>Signing iOS applications requires <a href="https://developer.apple.com/programs/enroll/">Apple Developer Program</a> membership. You can:
<ul>
<li> <b>Manually</b> upload your signing certificate and distribution profile to Codemagic to manage code signing yourself or, </li>
<li> Use the <b>automatic code signing</b> option where Codemagic takes care of code signing and signing files management on your behalf.</li>
</ul>

<p>More details about iOS app codesigning can be found <a href="../yaml-code-signing/signing-ios.md">here</a>.

<h4> Creating the App Store Connect API key</h4>

{{< include "/partials/app-store-connect-api-key.md" >}}

<h4> Creating the iOS Distribution Certificate</h4>

<p>The following steps describe one way of creating an iOS Distribution Certificate. This method requires a Mac computer and the certificate will be stored on it for easier retrieval in future. For a more detailed explanation and alternative certificate generation methods, please visit <a href="../yaml-code-signing/signing-ios.md">here.</a></p>

<ol>
<li> On your Mac, open the <b>Keychain Access</b>, located in the **Applications and Utilities** folder.</li>
<li>From the upper menu, open <b>Preferences</b></li>
<li>Click on <b>Certificates</b> and turn off the <b>OCSP</b> and the <b>CRL</b>. Close the preferences window.</li>
<li>From the upper menu, select <b>Certificate Assistant</b> and <b>Request a Certificate from a Certificate Authority</b>.</li>
<li>Add the user email address and the common name. The email address has to be the same as this one you chose when you created your Apple Developer account. The CA email address is not obligatory. Click on <b>Saved to disk</b>.</li>

<hr>

<li> Go to your [Apple Developer Account](https://developer.apple.com/account/)</li>
<li> Go to <b>Certificates, IDs & Profiles</b></li>
<li>In <b>Certificates</b>, click on the "+" button</li>
<li>In <b>Software</b> section, select <b>iOS Distribution (App Store and Ad Hoc)</b></li>
<li>Click <b>Continue</b> and upload the CSR file generated in step 5.</li>
<li>Download the <b>iOS Distribution Certificate file</b>.</li>
<hr>
<li>Open the certificate file by double clicking and add it to your Keychain</li>
<li>Select the certificate in Keychain Access, right click on it and export as a <b>Personal Information Exchange (.p12)</b> file.</li>
<li>Give the file a name such as "IOS_DISTRIBUTION", choose a location and click <b>Save</b>.</li>
<li>On the next prompt, leave the password empty and click <b>OK</b>.</li>
<li>Use the following <code>openssl</code> command to export the private key:

{{< highlight Shell "style=rrt">}}
openssl pkcs12 -in IOS_DISTRIBUTION.p12 -nodes -nocerts | openssl rsa -out ios_distribution_private_key
{{< /highlight >}}
</li>
<li>When prompted for the import password, just press enter. The private key will be written to a file called <b>ios_distribution_private_key</b> in the directory where you ran the command.</li>
</ol>


<h4> Configuring Environment variables</h4>
<ol>
<li> Open your Codemagic app settings, go to <b>Environment variables</b> tab.</li>
<li> Enter <code>CERTIFICATE_PRIVATE_KEY</code> as the <b><i>Variable name</i></b>.</li>
<li> Open the file <code>ios_distribution_private_key</code> with a text editor.</li>
<li> Copy the <b>entire contents</b> of the file, including the <code>-----BEGIN RSA PRIVATE KEY-----</code> and <code>-----END RSA PRIVATE KEY-----</code> tags.</li>
<li> Paste into the <b><i>Variable value</i></b> field.</li>
<li> Enter a variable group name, e.g. <b><i>appstore_credentials</b></i>. Click the button to create the group.</li>
<li> Make sure the <b>Secure</b> option is selected so that the variable can be protected by encryption.</li>
<li> Click the <b>Add</b> button to add the variable.</li>
<hr>
<li> Run the following command on the <b>App Store Connect API key</b> file that you downloaded earlier (in our example saved as <code>codemagic_api_key.p8</code>) to copy its content to clipboard:
{{< highlight Shell "style=rrt">}}
cat codemagic_api_key.p8 | base64 | pbcopy
{{< /highlight >}}
</li>
<li> Create a new Environment variable <code>APP_STORE_CONNECT_PRIVATE_KEY</code> and paste the value from clipboard.</li>
<hr>
<li> Create variable <code>APP_STORE_CONNECT_KEY_IDENTIFIER</code>. The value is the <b>Key ID</b> field from <b>App Store Connect > Users and Access > Keys</b>.</li>
<li> Create variable <code>APP_STORE_CONNECT_ISSUER_ID</code>. The value is the <b>Issuer ID</b> field from <b>App Store Connect > Users and Access > Keys</b>.</li>
</ol>

{{<notebox>}}
Tip: Store all the keystore variables in the same group so they can be imported to codemagic.yaml workflow at once. 

If the group of variables is reusable for various applications, they can be defined in [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in **Team settings** for easier access.
{{</notebox>}}

<p>
Environment variables have to be added to the workflow either individually or as a group. Modify your <code>codemagic.yaml</code> file by adding the following:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-ios:
    name: React Native iOS
    # ....
    environment:
        groups:
            - appstore_credentials
{{< /highlight >}}
</p>

{{<markdown>}}
To code sign the app, add the following commands in the [`scripts`](../getting-started/yaml#scripts) section of the configuration file, after all the dependencies are installed, right before the build commands. 

{{</markdown>}}

{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files "$BUNDLE_ID" \
            --type IOS_APP_DEVELOPMENT \
            --create
      - name: Set up signing certificate
        script: keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
{{< /highlight >}}

{{<markdown>}}
Based on the specified bundle ID and [provisioning profile type](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--mac_catalyst_app_development--mac_catalyst_app_direct--mac_catalyst_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store) set with the `--type` argument, Codemagic will fetch or create the relevant provisioning profile and certificate to code sign the build.

If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the  `--type` argument to `IOS_APP_STORE`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `--type` argument to `IOS_APP_ADHOC`
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}


---

## Setting up package name / bundle identifier

Configure Android package name and/or iOS bundle identifier by adding the corresponding variables in the `codemagic.yaml` and editing the `app.json` files.

{{< tabpane >}}
{{< tab header="Android" >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    # ....
    environment:
      groups:
        # ...
      vars:
        PACKAGE_NAME: "io.codemagic.sample.reactnative"
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-ios:
    # ....
    environment:
      groups:
        # ...
      vars:
        BUNDLE_ID: "io.codemagic.sample.reactnative"
{{< /highlight >}}

{{< /tab >}}
{{< /tabpane >}}


Example of minimal `app.json` file. Add the `android` and/or `ios` keys:
{{< highlight json "style=paraiso-dark">}}
{
  "expo": {
    "name": "codemagicSample",
    "slug": "codemagicSample",
    "version": "1.0.0",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "io.codemagic.sample.reactnative"
    },
    "android": {
      "package": "io.codemagic.sample.reactnative"
    }
  }
}
{{< /highlight >}}

---

## Configure scripts to build and sign the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).


{{< tabpane >}}
{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
scripts:
    # ....
  - name: Install npm dependencies
    script: |
    npm install
  - name: Set Android SDK location
    script: |
   echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/android/local.properties"
  - name: Build Android release
    script: |
   cd android && ./gradlew bundleRelease

artifacts:
  - android/app/build/outputs/**/*.aab
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  environment:
    groups:
      # ...
    vars:
      BUNDLE_ID: "io.codemagic.sample.reactnative"
      XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Put the name of your Xcode workspace here
      XCODE_SCHEME: "CodemagicSample" # <-- Put the name of your Xcode scheme here
scripts:
  # ...
  - name: Build ipa for distribution
    script: |
   xcode-project build-ipa --workspace "$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME"
artifacts:
  - build/ios/ipa/*.ipa
  - /tmp/xcodebuild_logs/*.log
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
  - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}


#### Using Expo without ejecting
{{< tabpane >}}

{{< tab header="Android" >}}
{{<markdown>}}

Add the following scripts just after the **Install npm dependencies**

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Install Expo CLI and eject
    script: | 
      npm install -g expo-cli
      expo eject
  - name: Set up app/build.gradle
    script: |
   mv ./support-files/build.gradle android/app
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
Add the following scripts at the start of the scripts section


{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Install Expo CLI and eject
    script: | 
      yarn install
      yarn global add expo-cli
      expo eject
  - name: Set Info.plist values
    script: | 
      PLIST=$FCI_BUILD_DIR/$XCODE_SCHEME/Info.plist
      PLIST_BUDDY=/usr/libexec/PlistBuddy
      $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST
  - name: Install CocoaPods dependencies
    script: |
    cd ios && pod install
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}

---

## Build versioning

If you are going to publish your app to App Store Connect or Google Play, each uploaded artifact must have a new version satisfying each app store’s requirements. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning.md).


{{< tabpane >}}

{{< tab header="Android" >}}
{{<markdown>}}

One very useful method of calculating the code version is to use Codemagic command line tools to get the latest build number from Google Play and increment it by one.

You can find the full sample project with the instructions on alternative ways to perform Android build versioning [in our repository](https://github.com/codemagic-ci-cd/android-versioning-example).


The prerequisite is a valid **Google Cloud Service Account**. Plese follow these steps:
1. Go to [this guide](../knowledge-base/google-services-authentication.md) and complete the steps in the **Google Play** section.
2. Skip to the **Creating a service account** section in the same guide and complete those steps also.
3. You now have a `json` file with the credentials.
4. Open Codemagic UI and create a new Environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`.
5. Paste the content of the downloaded `JSON` file in the **_Value_** field, set the group name (e.g. **google_play**) and make sure the **Secure** option is checked.
---
6. Add the **google_play** variable group to the `codemagic.yaml`
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-ios:
    # ....
    environment:
      groups:
        - keystore_credentials
        - google_play
{{< /highlight >}}
7. Modify the build script to calculate the build number and use it as gradlew arguments.
{{< highlight yaml "style=paraiso-dark">}}
scripts:
    # ....
  - name: Build Android release
    script: | 
      LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name '$PACKAGE_NAME')
      if [ -z LATEST_BUILD_NUMBER ]; then
        # fallback in case no build number was found from Google Play.
        # Alternatively, you can `exit 1` to fail the build
        # BUILD_NUMBER is a Codemagic built-in variable tracking the number of times this workflow has been built
          UPDATED_BUILD_NUMBER=$BUILD_NUMBER
      else
          UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
      fi
      cd android && ./gradlew bundleRelease -PversionCode=$UPDATED_BUILD_NUMBER -PversionName=1.0.$UPDATED_BUILD_NUMBER
{{< /highlight >}}
8. Modify the `android/app/build.gradle` file to get the build number values and apply them:
{{< highlight kotlin "style=paraiso-dark">}}

// get version code from the specified property argument `-PversionCode` during the build call
def getMyVersionCode = { ->
    return project.hasProperty('versionCode') ? versionCode.toInteger() : -1
}

// get version name from the specified property argument `-PversionName` during the build call
def getMyVersionName = { ->
    return project.hasProperty('versionName') ? versionName : "1.0"
}

....
android {
    ....
    defaultConfig {
        ...
        versionCode getMyVersionCode()
        versionName getMyVersionName()
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
In addition to the App Store credentials configured earlier, in order to get the latest build number from App Store or TestFlight, you will also need the **Application Apple ID**. This is an automatically generated ID assigned to your app and it can be found under **General > App Information > Apple ID** under your application in App Store Connect.

1. Add the *Application Apple ID** to the `codemagic.yaml` as a variable
2. Add the script to get the latest build number using `app-store-connect` and configure the new build number using `agvtool`.
3. Your `codemagic.yaml` will look like this:
{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  # ...
  environment:
    # ...
    vars:
      # ...
      APP_ID: 1555555551
  # ...
  scripts:
    - name: Increment build number
      script: | 
        #!/bin/sh
        set -e
        set -x
        cd $FCI_BUILD_DIR
        LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "APP_ID")
        agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
    - name: Build ipa for distribution
      script:
        # ....
{{< /highlight >}}
{{</markdown>}}

{{< /tab >}}
{{< /tabpane >}}

---

## Publishing
Codemagic offers a wide array of options for app publishing and the list of partners and integrations is continuously growing. For the most up-to-date information, check the guides in the **Configuration > Publishing** section of these docs.
To get more details on the publishing options presented in this guide, please check the [Email publishing](../yaml-publishing/email.md), the [Google Play Store](../yaml-publishing/google-play.md) publishing and the [App Store Connect](../yaml-publishing/app-store-connect.md).

#### Email publishing
If the build finishes successfully, release notes (if passed), and the generated artifacts will be published to the provided email address(es). If the build fails, an email with a link to build logs will be sent.

If you don’t want to receive an email notification on build success or failure, you can set `success` to `false` or `failure` to `false` accordingly.
{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  # ...
  environment:
  # ...
  scripts:
  # ... 
  publishing:
    email:
      recipients:
        - user_1@example.com
        - user_2@example.com
      notify:
        success: true
        failure: false
{{< /highlight >}}

#### Google Play / App Store

{{< tabpane >}}
{{< tab header="Android" >}}
{{<markdown>}}
Publishing apps to Google Play requires you to set up a service account in Google Play Console and save the content of the `JSON` key file to a secure environment variable as explained above in **Android Build Versioning** steps 1-5.
Configuring Google Play publishing is simple as you only need to provide credentials and choose the desired track. If the app is in `draft` status, please also include the `submit_as_draft: true` or promote the app status in Google Play.
{{< highlight yaml "style=paraiso-dark">}}
react-native-android:
  # ... 
  publishing:
    # ...
    google_play:
      credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
      track: internal
      submit_as_draft: true
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
Codemagic enables you to automatically publish your iOS or macOS app to [App Store Connect](https://appstoreconnect.apple.com/) for beta testing with [TestFlight](https://developer.apple.com/testflight/) or distributing the app to users via App Store. Codemagic uses the **App Store Connect API key** for authenticating communication with Apple's services. You can read more about generating an API key from Apple's [documentation page](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api).

Please note that

1. for App Store Connect publishing, the provided key needs to have [App Manager permission](https://help.apple.com/app-store-connect/#/deve5f9a89d7),
2. and in order to submit your iOS application to App Store Connect, it must be code signed with a distribution [certificate](https://developer.apple.com/support/certificates/).

The following snippet demonstrates how to authenticate with and upload the IPA to App Store Connect, submit the build to beta tester groups in TestFlight and configure releasing the app to App Store. See additional configuration options for App Store Connect publishing [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/publish.md).

{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  # ... 
  publishing:
    # ...
    app_store_connect:
      api_key: $APP_STORE_CONNECT_PRIVATE_KEY
      key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
      issuer_id: $APP_STORE_CONNECT_ISSUER_ID
        #
        # Configuration related to TestFlight (optional)
        # Note: This action is performed during post-processing.
      submit_to_testflight: true 
      beta_groups: # Specify the names of beta tester groups that will get access to the build once it has passed beta review.
        - group name 1
        - group name 2
      #
      # Configuration related to App Store (optional)
      # Note: This action is performed during post-processing.
      submit_to_app_store: true
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}

---

## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the App in Codemagic UI and start the build to see it in action.


Your final `codemagic.yaml` file should look something like this:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    name: React Native Android
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      groups:
        - keystore_credentials
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.sample.reactnative"
    scripts:
      - name: Set up keystore
        script: | 
          echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
      - name: Install npm dependencies
        script: | 
          npm install
      - name: Set Android SDK location
        script: | 
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/android/local.properties"
      - name: Install npm dependencies
        script: | 
          npm install
      - name: Install Expo CLI and eject
        script: | 
          npm install -g expo-cli
          expo eject
      - name: Set up app/build.gradle
        script: | 
          mv ./support-files/build.gradle android/app
      - name: Set Android SDK location
        script: | 
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$FCI_BUILD_DIR/android/local.properties"
      - name: Build Android release
        script: | 
          LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name '$PACKAGE_NAME')
          if [ -z LATEST_BUILD_NUMBER ]; then
              # fallback in case no build number was found from google play. Alternatively, you can `exit 1` to fail the build
              UPDATED_BUILD_NUMBER=$BUILD_NUMBER
          else
              UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
          fi
          cd android && ./gradlew bundleRelease -PversionCode=$UPDATED_BUILD_NUMBER -PversionName=1.0.$UPDATED_BUILD_NUMBER
    artifacts:
      - android/app/build/outputs/**/*.aab
    publishing:
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true


  react-native-ios:
    name: React Native iOS
    max_build_duration: 120
    instance_type: mac_mini
    environment:
      groups:
        - appstore_credentials
      vars:
        BUNDLE_ID: "io.codemagic.sample.reactnative"
        XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Put the name of your Xcode workspace here
        XCODE_SCHEME: "CodemagicSample" # <-- Put the name of your Xcode scheme here
        APP_ID: 1555555551
    scripts:
      - name: Install Expo CLI and eject
        script: | 
          yarn install
          yarn global add expo-cli
          expo eject
      - name: Set Info.plist values
        script: | 
          PLIST=$FCI_BUILD_DIR/$XCODE_SCHEME/Info.plist
          PLIST_BUDDY=/usr/libexec/PlistBuddy
          $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST
      - name: Install CocoaPods dependencies
        script: | 
          cd ios && pod install
      - name: Set up keychain to be used for code signing using Codemagic CLI 'keychain' command
        script: keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files "$BUNDLE_ID" \
            --type IOS_APP_DEVELOPMENT \
            --create
      - name: Set up signing certificate
        script: keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
      - name: Increment build number
        script: | 
          #!/bin/sh
          set -e
          set -x
          cd $FCI_BUILD_DIR
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "APP_ID")
          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
      - name: Build ipa for distribution
        script: | 
          xcode-project build-ipa --workspace "$XCODE_WORKSPACE" --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
    publishing:
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

        # Configuration related to TestFlight (optional)
        # Note: This action is performed during post-processing.
        submit_to_testflight: true
        beta_groups: # Specify the names of beta tester groups that will get access to the build once it has passed beta review.
          - group name 1
          - group name 2

        # Configuration related to App Store (optional)
        # Note: This action is performed during post-processing.
        submit_to_app_store: false
{{< /highlight >}}

---

## Next steps
While this basic workflow configuration is incredibly useful, it is certainly not the end of the road and there are numerous advanced actions that Codemagic can help you with.

We encourage you to investigate [Running tests with Codemagic](../yaml-testing/testing.md) to get you started with testing, as well as additional guides such as the one on running tests on [Firebase Test Lab](../yaml-testing/firebase-test-lab.md) or [Registering iOS test devices](../custom-menu-position/ios-provisioning.md).

Documentation on [Using codemagic.yaml](../yaml/yaml-getting-started.md) teaches you to configure additional options such as [changing the instance type](../yaml-getting-started/#instance-type) on which to build, speeding up builds by configuring [Caching options](../yaml-getting-started/#instance-type#cache), or configuring builds to be [automatically triggered](../yaml-getting-started/#triggering) on repository events.

---

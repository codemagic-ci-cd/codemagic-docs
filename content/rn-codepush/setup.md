---
title: Setup
description: Get CodePush running with Codemagic and React Native
meta_title: Set Up CodePush for React Native Apps and the CodePush CLI
meta_description: Set up CodePush for React Native, including projects, CLI authentication, deployment keys, app configuration, and deployment channels.
weight: 2
aliases:
  - /rn-codepush/codepush-integration/
---

This section prepares a project to use CodePush with Codemagic. After completing these steps you will have:

- a CodePush project created on the Codemagic server
- the CLI installed and authenticated
- a React Native app configured to receive OTA updates

Codemagic hosts the CodePush server and developers interact with it using [access tokens](#get-an-access-token) and the CodePush CLI. If you want to learn about how OTA updates work, check out the [concepts page](https://docs.codemagic.io/rn-codepush/concepts/).

These instructions are for React Native New Architecture projects. If your app is already configured, skip to setting up [deployment keys](#add-codepush-to-a-react-native-app) and CI sections to verify configuration.

The same Codemagic server can be used for all of your apps.

---

## Install and configure the CLI

Install the CodePush CLI globally:

{{< highlight bash "style=paraiso-dark">}}
npm install -g @codemagic/code-push-cli
{{< /highlight >}}

Verify the installation:

{{< highlight bash "style=paraiso-dark">}}
code-push --version
{{< /highlight >}}

This command prints the installed CLI version. If the installation was successful, you will see a version number (e.g., x.x.x). If the command is not found, it usually means the CLI was not installed correctly.

## Get an access token

The CodePush CLI authenticates using access tokens provided by the Codemagic team. Request a token [here](https://codemagic.io/contact-sales/).

To log in from the CLI:

{{< highlight bash "style=paraiso-dark">}}
code-push login "https://codepush.pro/" --access-key $ACCESS_TOKEN
{{< /highlight >}}

This command authenticates the CLI directly using the provided access token. Once authenticated, the CLI can create apps, manage deployments, and publish updates.

## Create a CodePush project

Each mobile application using CodePush must be registered on the server. This step creates a record on the CodePush server that your app will connect to for receiving updates.

In most cases, you should create separate apps for each platform, for example:


* MyApp-Android
* MyApp-iOS


React Native bundles differ between platforms, so separating them ensures that each app receives the correct update package and avoids compatibility issues.


To create an Android app using the CLI:

{{< highlight bash "style=paraiso-dark">}}
code-push app add MyApp-Android
{{< /highlight >}}

For iOS:
{{< highlight bash "style=paraiso-dark">}}
code-push app add MyApp-iOS
{{< /highlight>}}

You can use any naming convention, but including the platform in the name is recommended for clarity when managing multiple apps.


When an app is created, CodePush automatically creates two deployments:

* Staging
* Production

These deployments act as separate release channels, allowing you to control which users receive which updates.

* Staging → typically used for testing updates internally
* Production → used for releasing updates to end users

You can create additional deployments if needed (e.g., QA, Beta), depending on your workflow by running `code-push deployment add <appName> <deploymentName>`. It is possible to rename existing deployments through `code-push deployment rename <appName> <deploymentName> <newDeploymentName>` and delete via `code-push deployment rm <appName> <deploymentName>`

## Add CodePush to a React Native app

After configuring the server and CLI, the next step is integrating the CodePush client SDK into your React Native application. This allows your app to receive over-the-air (OTA) updates without going through the app store.

1. **Install the React Native CodePush package:**

{{< highlight bash "style=paraiso-dark">}}
# Using npm
npm install @code-push-next/react-native-code-push

# Using yarn
yarn add @code-push-next/react-native-code-push
{{< /highlight>}}

The SDK handles checking for updates, downloading new bundles, and applying updates when the app restarts.

2. **Configure Deployment Keys**

Each CodePush deployment has a deployment key that tells the app which deployment to check for updates.

List deployments and keys:

{{< highlight bash "style=paraiso-dark">}}
code-push deployment list <app_name> -k
{{< /highlight >}}

Recommended usage:

* Development builds → Staging deployment key
* Production builds → Production deployment key

This ensures test updates do not reach production users. Deployment keys are typically injected via environment variables or set in platform configuration files.

3. **Configure Server URL and Deployment Keys in Native Projects**

To connect your React Native app to the CodePush server, you must configure the server URL and the deployment key in your native project files. These values tell the app which server to check for updates and which deployment channel to use.

Server URL for Codemagic hosted service:
{{< highlight bash "style=paraiso-dark">}}
https://codepush.pro/
{{< /highlight >}}

iOS (Info.plist) example:

{{< highlight bash "style=paraiso-dark">}}
<key>CodePushServerURL</key>
<string>https://codepush.pro/</string>
<key>CodePushDeploymentKey</key>
<string>YOUR_DEPLOYMENT_KEY</string>
{{< /highlight >}}

{{<notebox>}} 
📒 Notes:
* Replace YOUR_DEPLOYMENT_KEY with the key for Staging (development builds) or Production (release builds).
* These keys can also be injected dynamically using build scripts or environment variables to avoid hardcoding sensitive information.
* Ensures the app connects to the correct deployment when it starts.
{{</notebox>}}

Android (strings.xml) example:

{{< highlight bash "style=paraiso-dark">}}
<string moduleConfig="true" name="CodePushServerUrl">https://codepush.pro/</string>
<string moduleConfig="true" name="CodePushDeploymentKey">YOUR_DEPLOYMENT_KEY</string>
{{< /highlight >}}

{{<notebox>}} 
📒 Notes:

* Same as iOS, use the correct deployment key for your build type.
* If you have multiple build variants (e.g., debug, release), configure keys separately for each variant to prevent test updates from reaching production users.
{{</notebox>}} 

4. **Wrap Your Root Component with CodePush**

Integrate CodePush by wrapping your app’s root component:

{{< highlight bash "style=paraiso-dark">}}
import codePush from '@code-push-next/react-native-code-push';

function App() {
  // Your app code here
}

export default codePush(App);
{{< /highlight >}}

This enables the SDK to automatically check for updates on app start (or based on your chosen update strategy).

### CodePush iOS Setup (React Native)

This guide covers the iOS-specific configuration required to enable CodePush OTA updates in your React Native app.

**1. Install iOS Dependencies**

Navigate to the ios directory and install CocoaPods:

{{< highlight bash "style=paraiso-dark">}}
cd ios && pod install && cd ..
{{< /highlight>}}

**2. Update AppDelegate**

You need to configure your app to load the JavaScript bundle from CodePush instead of the embedded bundle.

**Objective-C**: If your project is `Objective-C` based (scroll down for `Swift` based configuration), then open the `AppDelegate.m` file and add an import statement for the CodePush headers at the top:

{{< highlight text "style=paraiso-dark">}}
#import <CodePush/CodePush.h>
{{< /highlight>}}

**3. Update JS Bundle Location**

Find the following existing bundle reference in the `AppDelegate.m` file:

{{< highlight bash "style=paraiso-dark">}}
jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
{{< /highlight >}}

And replace it with:

{{< highlight bash "style=paraiso-dark">}}
jsCodeLocation = [CodePush bundleURL];
{{< /highlight >}}

At the end, your `sourceURLForBridge` method should look like this:

{{< highlight bash "style=paraiso-dark">}}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  #else
    return [CodePush bundleURL];
  #endif
}
{{< /highlight >}}

**Swift** :If your project is using `Swift` based configuration, then follow the steps below:

1. Navigate to your iOS project and open the `AppDelegate.swift` file
2. Add the following import at the top of the file:

{{< highlight bash "style=paraiso-dark">}}
import CodePush
{{< /highlight >}}

3. Find the following line of code in the `AppDelegate.swift` file:

{{< highlight bash "style=paraiso-dark">}}
Bundle.main.url(forResource: "main", withExtension: "jsbundle")
{{< /highlight >}}

And replace it with:

{{< highlight bash "style=paraiso-dark">}}
CodePush.bundleURL()
{{< /highlight>}}

Your `bundleUrl` method should look like this:

{{< highlight bash "style=paraiso-dark">}}
override func bundleURL() -> URL? {
#if DEBUG
   RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
   CodePush.bundleURL()
#endif
}
{{< /highlight >}}

### CodePush Android Setup (React Native)

{{<notebox>}}
Plugin installation and configuration for React Native 0.76 version and above
{{</notebox>}}

**1. Ensure Native Linking** 

In `android/app/build.gradle`, add `codepush.gradle` as an additional build task definition to the end of the file:

{{< highlight bash "style=paraiso-dark">}}
apply from: "../../node_modules/@code-push-next/react-native-code-push/android/codepush.gradle"
{{< /highlight >}}

**2. Update MainApplication**

Open the `MainApplication` file and update it as follows:

{{< highlight shell "style=paraiso-dark">}}
...
// 1. Import the plugin class.
import com.microsoft.codepush.react.CodePush

class MainApplication : Application(), ReactApplication {
   override val reactNativeHost: ReactNativeHost =
       object : DefaultReactNativeHost(this) {
           override fun getPackages(): List<ReactPackage> = PackageList(this).packages.apply {
             // Packages that cannot be autolinked yet can be added manually here, for example:
             // add(MyReactNativePackage())
            }

           // 2. Override the getJSBundleFile method in order to let
           // the CodePush runtime determine where to get the JS
           // bundle location from on each app start
           override fun getJSBundleFile(): String {
             return CodePush.getJSBundleFile() 
           }
    };
}

{{< /highlight>}}

For React Native **0.82** and above, make the following changes to `MainApplication.kt`:

{{< highlight shell "style=paraiso-dark">}}
...
// 1. Import the plugin class.
import com.microsoft.codepush.react.CodePush

class MainApplication : Application(), ReactApplication {

    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
        context = applicationContext,
        packageList =
            PackageList(this).packages.apply {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // add(MyReactNativePackage())
            },
        // 2. RN 0.82+ uses ReactHost config instead of overriding getJSBundleFile().
        // Set jsBundleFilePath to CodePush so CodePush resolves the JS bundle path
        // at startup (OTA update if available, fallback to bundled JS otherwise).
        jsBundleFilePath = CodePush.getJSBundleFile(),
        )
    }
}
{{< /highlight>}}




### Run a test OTA release

To verify that CodePush is working end-to-end, you can publish a quick test release:
{{< highlight bash "style=paraiso-dark">}}
code-push release-react <app_name> <platform_ios_or_android>
{{< /highlight>}}

This single command:

* Bundles your React Native JavaScript code
* Uploads it to the CodePush server
* Releases it to the default deployment (usually Staging, if another deployment channel is needed, you can manage it by adding `-d <deployment_name>` to the command above)

For the full release workflow, see [Releasing updates](/rn-codepush/releasing-updates/).

✅ Best Practices
* Use Environment Variables – Avoid hardcoding deployment keys.
* Separate Staging and Production Keys – Always validate updates in Staging before promoting to Production.
* Confirm Connectivity – After configuration, make sure the app can fetch updates from the server by testing a Staging release.

Properly configuring the server URL and deployment keys ensures that CodePush can deliver OTA updates reliably and safely for each platform.

## Next steps

After completing setup, use the following sections to continue:

- [Releasing updates](/rn-codepush/releasing-updates/) - publish your first OTA release
- [CLI quick reference](/rn-codepush/cli-quick-reference/) - copy-paste commands for auth, releases, and rollouts
- [CI integration](/rn-codepush/ci-integration/) - automate releases in CI/CD
- [Production control](/rn-codepush/production-control/) - rollouts, rollbacks, and version targeting
- [Security and access](/rn-codepush/security-and-access/) - authentication and signing
- [Debugging and common issues](/rn-codepush/debugging-and-common-issues/) - troubleshooting
- [Advanced: sync options](/rn-codepush/advanced-sync-options/) - customize `sync()`, dialogs, progress, and restart behavior

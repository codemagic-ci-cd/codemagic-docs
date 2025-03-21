---
title: CodePush integration
description: How to integrate your workflows with CodePush using Codemagic
weight: 22
---

[**CodePush**](https://github.com/microsoft/code-push) is a cloud service that enables React Native developers to deploy mobile app updates directly to their users’ devices without re-deploying them to the stores. 
Codemagic offers a hosted and maintained CodePush server with a free license for annual plan subscriptions. Dedicated CodePush servers are available on request. To activate your team's CodePush account and for more information, please contact us [here](https://codemagic.io/contact/).

## Step by step guide to configure CodePush

{{<notebox>}}
**Note**: The same server can be used for all of your apps. 
{{</notebox>}}

{{<notebox>}}
**Note**: Skip to step 5 if CodePush is already configured for your project.
{{</notebox>}}

1. Start with setting up CodePush in your React Native project by following the steps for [iOS](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md) and [Android](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md)
2. Install React Native CodePush plugin by running **npm install --save react-native-code-push** in the root directory
3. Make sure Codemagic provided server URL is correctly configured in the project:

For iOS, place the following key and its string in Info.plist:

{{< highlight bash "style=paraiso-dark">}}
<key>CodePushServerURL</key>
<string>https://codepush.pro/</string>
{{< /highlight >}}

For Android, add the following line in **strings.xml**:

{{< highlight bash "style=paraiso-dark">}}
 <string moduleConfig="true" name="CodePushServerUrl">https://codepush.pro/</string>
{{< /highlight >}}

4. While making changes in Info.plist and strings.xml files, add the Deployment keys:

For iOS:

{{< highlight bash "style=paraiso-dark">}}
<key>CodePushDeploymentKey</key>
<string>YOUR_DEPLOYMENT_KEY</string>
{{< /highlight >}}

For Android:

{{< highlight bash "style=paraiso-dark">}}
<string moduleConfig="true" name="CodePushDeploymentKey">YOUR_DEPLOYMENT_KEY</string>
{{< /highlight >}}

**Note**: About how to find the deployment keys, please refer to step **7**.

5. After configuring all the above-mentioned steps, it is time to set up the Codemagic side configuration and authentication. For that, [contact Codemagic team](https://codemagic.io/contact/) for an access key.
6. Add the following lines in **codemagic.yaml**:

{{< highlight bash "style=paraiso-dark">}}
scripts:
    - name: Install CodePush cli tools
      script: |                         
          git clone https://github.com/microsoft/code-push-server /tmp/code-push-server
          cd /tmp/code-push-server/cli
          npm install && npm run build && npm install -g
    - name: CodePush authentication
      script: |
          code-push-standalone login "https://codepush.pro" --key $CODEPUSH_TOKEN       
    - name: CodePush add app # this script can be skipped if you have existing apps
      script: |
          code-push-standalone app add YOUR_PREFERRED_APP_NAME
          code-push-standalone app ls
    - name: Install npm dependencies
      script: |
        npm install
    - name: Codepush deployment
      script: |         
           code-push-standalone release-react APP_NAME_CREATED_ABOVE ios -d Staging# -d refers to the deployment name e.g. Production, Staging
           code-push-standalone release-react APP_NAME_CREATED_ABOVE android -d Staging # -d refers to the deployment name e.g. Production, Staging
{{< /highlight >}}

{{<notebox>}}
**Note**: **$CODEPUSH_TOKEN** for authentication will be provided by the Codemagic team and it needs to be added as an environment variable and then imported in **codemagic.yaml**. More info can be found [here](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/)
{{</notebox>}}

{{<notebox>}}
**Note**: Running **code-push-standalone release-react** generates updates and releases them to the server to be served 
{{</notebox>}}


7. In order to reveal the Deployment keys, run **code-push-standalone deployment ls YOUR_APP_NAME -k**
8. By default, you get two Deployment channels: Staging and Production. You can add new ones, rename or delete them by running the following commands:

{{< highlight bash "style=paraiso-dark">}}
To Add: code-push-standalone deployment add <appName> <deploymentName>
To Remove: code-push-standalone deployment rm <appName> <deploymentName>
To Rename: code-push-standalone deployment rename <appName> <deploymentName> <newDeploymentName>
{{< /highlight >}}

9. Likewise, apps can be added, renamed and deleted:

{{< highlight bash "style=paraiso-dark">}}
To Add: code-push-standalone app add <appName>
To Rename: code-push-standalone app rename <appName> <newAppName>
To Delete: code-push-standalone app rm <appName>
{{< /highlight >}}

10. If you need to patch releases e.g. you need to make a change in a previous release e.g. increase rollout percentage, a missed bug fix etc. you can achieve it by running **code-push-standalone patch <appName> <deploymentName>**

11. You cannot delete a deployment release history but you can roll it back in case any release was shipped with a broken feature or anything, by running **code-push-standalone rollback <appName> <deploymentName>**
    
12. After testing an update against a deployment channel, it is possible to promote it by running the following command:

{{< highlight bash "style=paraiso-dark">}}
code-push-standalone promote <appName> <sourceDeploymentName> <destDeploymentName>
{{< /highlight >}}

## Managing apps and deployments with the CodePush CLI

You can manage your apps and deployments using the CodePush CLI which you can install on your local machine as follows:

{{< highlight bash "style=paraiso-dark">}}
git clone https://github.com/microsoft/code-push-server /tmp/code-push-server
cd /tmp/code-push-server/cli
npm install && npm run build && npm install -g
{{< /highlight >}}

You can log into your account using the CodePush access key provided by Codemagic.

The CodePush CLI reference is available [here](https://github.com/microsoft/code-push-server/tree/main/cli). 

To view deployments, update metadata, and installation metrics you can use the `code-push-standalone deployment ls <app_name>` command as described in the CodePush CLI docs [here](https://github.com/microsoft/code-push-server/tree/main/cli#:~:text=If%20at%20any%20time%20you%27d%20like%20to%20view%20the%20list%20of%20deployments%20that%20a%20specific%20app%20includes%2C%20you%20can%20simply%20run%20the%20following%20command%3A)


## Debugging notes

If your project **Info.plist** file key **CFBundleShortVersionString** does not hold a semver string value, then it's highly likely you will see the following error when releasing an update:

{{< highlight bash "style=paraiso-dark">}}
[Error]  The "CFBundleShortVersionString" key in the "ios/Codemagic_RN/Info.plist" file needs to specify a valid semver string, containing both a major and minor version (e.g. 1.3.2, 1.1).
{{< /highlight >}}

The solution is to either change the value in **Info.plist** file to a semver string value which is not recommended, or the best option is to add **--targetBinaryVersion**  to the build/release command: **code-push-standalone release-react iOS ios --targetBinaryVersion 1.0.0**

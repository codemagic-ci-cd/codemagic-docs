---
title: CodePush integration
description: How to integrate your workflows with CodePush using Codemagic
weight: 7
---

[**CodePush**](https://github.com/microsoft/code-push) is a cloud service that enables React Native developers to deploy mobile app updates directly to their users’ devices without re-deploying them to the stores. 
Codemagic offers a hosted and maintained CodePush server. Dedicated CodePush servers are available on request. To activate your team's CodePush account and for more information, please contact us [here](https://codemagic.io/pricing/#enterprise).

## Step by step guide to configure CodePush
{{<notebox>}}
**Note**: The following instructions are for the React Native New Architecture. Please update your project by checking the steps below if you need the New Architecture support for CodePush.
{{</notebox>}}
<br/>
{{<notebox>}}
**Note**: The same server can be used for all of your apps. 
{{</notebox>}}
<br/>
{{<notebox>}}
**Note**: Skip to step 5 if CodePush is already configured for your project.
{{</notebox>}}

1. Install the React Native CodePush plugin by running `yarn add @code-push-next/react-native-code-push` in the root directory of your project.
2. Set up CodePush in your React Native project by following the steps for [iOS](https://github.com/CodePushNext/react-native-code-push/blob/master/docs/setup-ios.md) and [Android](https://github.com/CodePushNext/react-native-code-push/blob/master/docs/setup-android.md)
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
{{<notebox>}}
**Note**: About how to find the deployment keys, please refer to step **8**.
{{</notebox>}}

5. After configuring all the above-mentioned steps, it is time to set up the Codemagic side configuration and authentication. For that, [contact Codemagic team](https://codemagic.io/pricing/#enterprise) for an access key.
6. Use the CodePush plugin in your app to export your root component as follows:

    {{< highlight bash "style=paraiso-dark">}}
    # import the CodePush plugin
    import codePush from '@code-push-next/react-native-code-push';

    function App() {
      ...
    }
    # export your root component
    export default codePush(App);
    {{< /highlight >}}
7. Add the following lines in **codemagic.yaml**:

    {{< highlight bash "style=paraiso-dark">}}
    scripts:
        - name: Install Codemagic CodePush CLI tools
          script: |
              npm install -g @codemagic/code-push-cli
        - name: CodePush authentication
          script: |
              code-push login "https://codepush.pro" --key $CODEPUSH_TOKEN       
        - name: CodePush add app # this script can be skipped if you have existing apps
          script: |
              code-push app add YOUR_PREFERRED_APP_NAME
              code-push app ls
        - name: Install npm dependencies
          script: |
            npm install
        - name: Codepush deployment
          script: |         
              code-push release-react APP_NAME_CREATED_ABOVE ios -d Staging # -d refers to the deployment name e.g. Production, Staging
              code-push release-react APP_NAME_CREATED_ABOVE android -d Staging # -d refers to the deployment name e.g. Production, Staging
    {{< /highlight >}}

{{<notebox>}}
**Note**: **$CODEPUSH_TOKEN** for authentication will be provided by the Codemagic team and it needs to be added as an environment variable and then imported in **codemagic.yaml**. More info can be found [here](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/)
{{</notebox>}}
<br/>
{{<notebox>}}
**Note**: Running **code-push release-react** generates updates and releases them to the server to be served 
{{</notebox>}}


8. In order to reveal the Deployment keys, run **code-push deployment ls YOUR_APP_NAME -k**
9. By default, you get two Deployment channels: Staging and Production. You can add new ones, rename or delete them by running the following commands:

{{< highlight bash "style=paraiso-dark">}}
To Add: code-push deployment add <appName> <deploymentName>
To Remove: code-push deployment rm <appName> <deploymentName>
To Rename: code-push deployment rename <appName> <deploymentName> <newDeploymentName>
{{< /highlight >}}

10. Likewise, apps can be added, renamed and deleted:

{{< highlight bash "style=paraiso-dark">}}
To Add: code-push app add <appName>
To Rename: code-push app rename <appName> <newAppName>
To Delete: code-push app rm <appName>
{{< /highlight >}}

11. If you need to patch a previous release, e.g. increase the rollout percentage, push a missed bug fix or similar, you can achieve it by running `code-push patch <appName> <deploymentName>`

12. You cannot delete a deployed release, but you can roll back a release by running `code-push rollback <appName> <deploymentName>`
    
13. After testing an update against a deployment channel, it is possible to promote it by running the following command:

{{< highlight bash "style=paraiso-dark">}}
code-push promote <appName> <sourceDeploymentName> <destDeploymentName>
{{< /highlight >}}

## Managing apps and deployments with the CodePush CLI

You can manage your apps and deployments using the Codemagic CodePush CLI which you can install on your local machine as follows:

{{< highlight bash "style=paraiso-dark">}}
   npm install -g @codemagic/code-push-cli
{{< /highlight >}}

You can log into your account using the CodePush access key provided by Codemagic.

The CodePush CLI reference is available [here](https://github.com/codemagic-ci-cd/code-push-pro). 

To view deployments, update metadata, and installation metrics you can use the `code-push deployment ls <app_name>` command as described in the CodePush CLI docs [here](https://github.com/codemagic-ci-cd/code-push-pro?tab=readme-ov-file#deployment-management)


## Debugging notes

If your project **Info.plist** file key **CFBundleShortVersionString** does not hold a semver string value, then it's highly likely you will see the following error when releasing an update:

{{< highlight bash "style=paraiso-dark">}}
[Error]  The "CFBundleShortVersionString" key in the "ios/Codemagic_RN/Info.plist" file needs to specify a valid semver string, containing both a major and minor version (e.g. 1.3.2, 1.1).
{{< /highlight >}}

The solution is to either change the value in **Info.plist** file to a semver string value which is not recommended, or the best option is to add **--targetBinaryVersion**  to the build/release command: **code-push release-react iOS ios --targetBinaryVersion 1.0.0**

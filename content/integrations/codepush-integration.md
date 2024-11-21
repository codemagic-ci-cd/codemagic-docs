---
title: CodePush integration
description: How to integrate your workflows with CodePush
weight: 7
---

[**CodePush**](https://github.com/microsoft/code-push) is a cloud service that enables React Native developers to deploy mobile app updates directly to their users’ devices without re-deploying them to the stores.

## Step by step guide to configure CodePush

1. Start with setting up CodePush in your React Native project by following the steps for [iOS](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md) and [Android](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md)
2. Install React Native CodePush plugin by running **npm install --save react-native-code-push** in the root directory
3. Make sure Codemagic provided server URL is correctly configured in the project:

for iOS, place the following key and its string in Info.plist:

```
<key>CodePushServerURL</key>
<string>https://codepush.codemagic.io/</string>
```

for Android, add the following line in **strings.xml**:

```
 <string moduleConfig="true" name="CodePushServerUrl">https://codepush.codemagic.io/</string>
```
4. While making changes in Info.plist and strings.xml files, add the Deployment keys:

for iOS:

```
<key>CodePushDeploymentKey</key>
<string>YOUR_DEPLOYMENT_KEY</string>
```

for Android:

```
<string moduleConfig="true" name="CodePushDeploymentKey">YOUR_DEPLOYMENT_KEY</string>
```
**Note**: About how to find the deployment keys, please refer to step **7**

5. After configuring all the above-mentioned steps, it is time to set up the Codemagic side congiruations and authentication. For that, [contact Codemagic team](https://codemagic.io/contact/) for an access key.
6. Add the following lines in **codemagic.yaml****:

```
scripts:
    - name: Install CodePush cli tools
      script: |                         
          git clone https://github.com/microsoft/code-push-server /tmp/code-push-server
          cd /tmp/code-push-server/cli
          npm install && npm run build && npm install -g
    - name: CodePush authentication
      script: |
          code-push-standalone login "https://codepush.codemagic.io" --key $CODEPUSH_TOKEN       
    - name: CodePush add app
      script: |
          code-push-standalone app add YOUR_PREFERRED_APP_NAME
          code-push-standalone app ls
    - name: Install npm dependencies
      script: |
        npm install
    - name: Codepush deployment
      script: |         
           code-push-standalone release-react APP_NAME_CREATED_ABOVE ios 
           code-push-standalone release-react APP_NAME_CREATED_ABOVE android
```

**Note**: $CODEPUSH_TOKEN for authentication will be provided by the Codemagic team.

7. In order to reveal the Deployment keys, run **code-push-standalone deployment ls YOUR_APP_NAME -k**
8. By default, you get two Deployment channels: Staging and Production. You can add new ones, rename them or delete them by running the following commands:

```
To Add: code-push-standalone deployment add <appName> <deploymentName>
To Remove: code-push-standalone deployment rm <appName> <deploymentName>
To Rename: code-push-standalone deployment rename <appName> <deploymentName> <newDeploymentName>
```
9. Likewise, apps can be added, renamed and deleted:
```
To Add: code-push-standalone app add <appName>
To Rename: code-push-standalone app rename <appName> <newAppName>
To Delete: code-push-standalone app rm <appName>
```

## Debugging notes

If your project **Info.plist** file key **CFBundleShortVersionString** does not hold a semver string value, then highly likely you will see the following error when releasing an update:

```
[Error]  The "CFBundleShortVersionString" key in the "ios/Codemagic_RN/Info.plist" file needs to specify a valid semver string, containing both a major and minor version (e.g. 1.3.2, 1.1).
```

Solution is either change the value in **Info.plist** file to a semver string value which is not recommended, or the best option is to add **--targetBinaryVersion**  to the build/release command: **code-push-standalone release-react iOS ios --targetBinaryVersion 1.0.0**

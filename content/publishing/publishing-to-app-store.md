---
description: How to deploy a Flutter app to App Store and TestFlight using the Flutter workflow editor
title: App Store Connect
weight: 1
---

Codemagic enables you to automatically publish your app to App Store Connect for beta testing with TestFlight or distributing the app to users via App Store. To do so, you must first set up [iOS code signing](../code-signing/ios-code-signing/) using distribution code signing [certificate](https://developer.apple.com/support/certificates/) and then configure publishing to App Store Connect.

{{<notebox>}}
This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml** please go to [Publishing to App Store Connect using codemagic.yaml](../publishing-yaml/distribution/#app-store-connect).
{{</notebox>}}

## Requirements

Codemagic needs your **[App Store Connect API key](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api)** to perform publishing to App Store Connect on your behalf. Publishing to App Store Connect requires that the app is code signed with a [distribution certificate](https://developer.apple.com/support/certificates/).

In addition, the application must be **App Store ready** for build distribution, meaning that it must have all the correct icons and icon sizes. Otherwise App Store Connect will tag the binary as invalid, and you will not be able to distribute it at all.

It is also worth pointing out the necessity for each uploaded binary to have a **different version**, otherwise it will be refused by App Store Connect. See the [Build versioning](../building/build-versioning/) article for instructions on incrementing app version with Codemagic.

{{<notebox>}}Please note that you will need to create an **app record** in App Store Connect before you can automate publishing with Codemagic. It is recommended to upload the very first version of the app manually. {{</notebox>}}

## Setting up publishing to App Store Connect on Codemagic

In this section we give step-by-step instructions on how to configure publishing App Store Connect using Flutter workflow editor.

### Step 1. Creating an App Store API key for Codemagic

It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api). To do so:

1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
2. Click on the + sign to generate a new API key.
3. Enter the name for the key and select an access level. For App Store Connect publishing the key needs to have `App Manager` permissions. Read more about Apple Developer Program role permissions [here](https://help.apple.com/app-store-connect/#/deve5f9a89d7).
4. Click **Generate**.
5. As soon as the key is generated, you can see it added in the list of active keys. Click **Download API Key** to save the private key for later. Note that the key can only be downloaded once.

{{<notebox >}} 
Take note of the **Issuer ID** above the table of active keys as well as the **Key ID** of the generated key as these will be required when setting up the Apple Developer Portal integration in Codemagic UI.
{{</notebox>}}

### Step 2. Connecting the Apple Developer Portal integration for your team/account

The Apple Developer Portal integration can be enabled in **User settings > Integrations** for personal projects and in **Team settings > Team integrations** for projects shared in the team (if you're the team owner). This allows you to conveniently use the same access credentials for publishing across different apps and workflows.

1. In the list of available integrations, click the **Connect** button for **Developer Portal**.
2. In the **App Store Connect API key name**, provide a name for the key you are going to set up the integration with. This is for identifying the key in Codemagic.
3. Enter the **Issuer ID** related to your Apple Developer account. You can find it above the table of active keys on the Keys tab of the [Users and Access](https://appstoreconnect.apple.com/access/api) page.
4. Enter the **Key ID** of the key to be used for code signing.
5. In the **API key** field, upload the private API key downloaded from App Store Connect.
6. Click **Save** to finish the setup.

If you work with multiple Apple Developer teams, you can add additional keys by clicking **Add another key** right after adding the first key and repeating the steps described above. You can delete existing keys or add new ones when you click **Manage keys** next to the Developer Portal integration in user or team settings.

### 3. Enabling App Store Connect publishing for workflow

Once the Apple Developer Portal has been enabled for the account or team the app belongs to, you can easily enable App Store Connect publishing per workflow.

1. Navigate to the Publish section in app settings **App settings > Publish**.
2. Click **App Store Connect**.
3. If you have several keys available, select the right key in the **App Store Connect API key** field.
4. Mark the **Submit to TestFlight** checkbox to automatically enroll your build to beta testers.  
5. Select **Enable App Store Connect publishing** at the top of the section to enable publishing.

Once you have successfully set up publishing to App Store Connect, Codemagic will automatically distribute the app to App Store Connect every time you build the workflow. Note that you must manually submit the app to App Store in App Store Connect.

## Submitting an app to App Store

To make your iOS app available to the public, it must be submitted for review in App Store Connect.

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/).
2. Navigate to **My Apps** and identify the app you would like to publish to App Store.
3. To start the submission process, click **Prepare for Submission**.
4. Check that you app metadata is up to date, and once everything is ready, click the **Submit for Review** button.

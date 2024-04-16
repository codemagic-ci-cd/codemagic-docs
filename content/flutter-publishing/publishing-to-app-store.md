---
description: How to deploy a Flutter app to App Store and TestFlight using the Flutter workflow editor
title: App Store Connect publishing using Flutter workflow editor
linkTitle: App Store Connect
weight: 1
aliases: /publishing/publishing-to-app-store
---

Codemagic enables you to automatically publish your app to App Store Connect for beta testing with TestFlight or distributing the app to users via App Store. To do so, you must first set up [iOS code signing](../code-signing/ios-code-signing/) using a distribution code signing [certificate](https://developer.apple.com/support/certificates/) and then configure publishing to App Store Connect.

{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml** please go to [Publishing to App Store Connect using codemagic.yaml](../yaml-publishing/app-store-connect).
{{</notebox>}}

## Requirements

Codemagic needs your **[App Store Connect API key](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api)** to perform publishing to App Store Connect on your behalf. Publishing to App Store Connect requires that the app is code signed with a [distribution certificate](https://developer.apple.com/support/certificates/).

In addition, the application must be **App Store ready** for build distribution, meaning that it must have all the correct icons and icon sizes. Otherwise, App Store Connect will tag the binary as invalid, and you will not be able to distribute it at all.

It is also worth pointing out the necessity for each uploaded binary to have a **different version**; otherwise, it will be refused by App Store Connect. See the [Build versioning](../building/build-versioning/) article for instructions on incrementing app version with Codemagic.

{{<notebox>}}**Note:** You will need to create an **app record** in App Store Connect before you can automate publishing with Codemagic. It is recommended to upload the very first version of the app manually.
{{</notebox>}}

In order to be able to test iOS apps on Apple devices, manual device UDID registration in the Apple Developer Program account is required. Alternatively, Codemagic's automatic device registration can be used to register devices as explained [here](https://docs.codemagic.io/testing/ios-provisioning/).

## Setting up publishing to App Store Connect on Codemagic

This section gives step-by-step instructions on how to configure publishing to App Store Connect using Flutter workflow editor.

### Step 1. Creating an App Store API key for Codemagic

{{<notebox>}}
**Tip:** You may also reuse any of the keys you've already set up for automatic [iOS](../code-signing/ios-code-signing/#automatic-code-signing) or [macOS](../code-signing/macos-code-signing/#automatic-code-signing) code signing.
{{</notebox>}}

{{< include "/partials/app-store-connect-api-key.md">}}

### Step 2. Connecting the Apple Developer Portal integration for your team/account

{{< include "/partials/integrations-setup-app-store-connect.md" >}}

### Step 3. Enabling App Store Connect publishing for workflow

Once the Apple Developer Portal has been enabled for the account or team the app belongs to, you can easily enable App Store Connect publishing per workflow.

1. Navigate to **App settings > Distribution**.
2. Click **App Store Connect**.
3. If you have several keys available, select the right key in the **App Store Connect API key** field.
4. Mark the **Publish even if tests fail** checkbox to continue uploading the app artifact even when the tests failed.
5. Select **Enable App Store Connect publishing** at the top of the section to enable publishing.

Your app will be now published to App Store Connect. However, you can select additional options to submit the build to TestFlight beta review or App Store review.

#### Submitting an app to TestFlight

1. Mark the **Submit to TestFlight beta review** checkbox to submit the build for beta review and prepare it for distributing to beta testers. Note: This action is performed during [post-processing](#post-processing-of-app-store-connect-distribution).
2. Mark the **Distribute to beta groups** checkbox and enter the names of the beta groups to automatically distribute the build to the testers in those groups once the build has passed beta review. Note: This action is performed during [post-processing](#post-processing-of-app-store-connect-distribution).

#### Submitting an app to App Store review

In order to submit your application to App Store review, mark the **Submit to App Store review** checkbox. Note: This action is performed during [post-processing](#post-processing-of-app-store-connect-distribution).

Alternatively, if you wish to submit an already uploaded build for review in App Store Connect, follow the steps below:

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/).
2. Navigate to **My Apps** and identify the app you would like to publish to App Store.
3. To start the submission process, click **Prepare for Submission**.
4. Check that your app metadata is up to date, and once everything is ready, click the **Submit for Review** button.

When using the workflow editor, developers have a few different methods to choose from for publishing their app on Apple's App Store once it has been approved by Apple. Each method caters to different strategies and needs. Here’s a breakdown of the release options available and how you can configure them in App Store Connect:

**Release Methods**

1. **Manual Release**: Once your app is approved by Apple, you can choose when to release it on the App Store manually. This gives you complete control over the timing of the release.

2. **Automatic Release**: By selecting this option, your application will be automatically released on the App Store once it is approved by Apple. This feature is useful if you wish to make your app available to users as soon as possible without any manual intervention required.

3. **Scheduled Release**: You have the option to schedule a specific date and time for your app to be published on the App Store. This feature is useful if you want your app to be launched at a particular moment, such as the beginning of a business day or a particular event, but only after it has been approved by Apple.

Configuration in App Store Connect
To configure these release options, you need to navigate to App Store Connect. Here’s how you can set it up:

1. Log in to your Apple Developer account and access App Store Connect.
2. Select your app from the list of your applications.
3. Navigate to the 'App Store' tab, and then go to the **Distribution settings** section.
4. Scroll to the 'Version Release' section: Here, you will find options to manage how your app is released:
    * Choose "Manually release this version" if you want to manually push your app live after Apple's approval.
    * Select "Automatically release this version" to have the app go live as soon as Apple approves it.
    * Opt for "Automatically release this version after App Review, but no earlier than..." to set up a scheduled release. You can specify the date and time when the app should go live.

These settings must be specified before you submit your app for review by Apple. Changing these settings after submission or post-approval might require another submission or at least an update in your App Store Connect configuration.


## Submitting release notes

To add localized release notes that will appear in the Test Details (What to test?) section, include a `release_notes.json` with the following content:

{{< highlight json "style=paraiso-dark">}}
[
    {
        "language": "en-GB",
        "text": "British English release notes text"
    },
    {
        "language": "en-US",
        "text": "The US English release notes text"
    }
]
{{< /highlight >}}

Supported languages could be found [here](https://developer.apple.com/documentation/appstoreconnectapi/betabuildlocalizationcreaterequest/data/attributes).

{{<notebox>}}
**Note:** Uploading release notes takes place in the [post-processing](#post-processing-of-app-store-connect-distribution) step.
{{</notebox>}}

## Post-processing of App Store Connect distribution

Some App Store Connect actions, like submitting the build to TestFlight beta review, distributing the build to beta groups and uploading release notes take place asynchronously in the post-processing step after the app artifact has been successfully published to App Store Connect and the main workflow has completed running in Codemagic. This avoids using the macOS build machine while we are waiting for Apple to complete processing the build and it becomes available for further actions.

Post-processing has a two-step timeout. If the uploaded build cannot be found in App Store Connect in 15 minutes, the step times out. This may happen if there are issues with the uploaded artifact, in which case the build does not become available in App Store Connect at all and you'll receive an email from App Store Connect. The overall timeout for post-processing is 120 minutes. If the uploaded build has not exited the processing status by then, post-processing in cancelled. You will be still able to manually submit the build to beta review, upload release notes and distribute the app to beta groups once the build becomes available in App Store Connect.

Note that Codemagic does not send status updates on the post-processing step. You can check the build log for the status of post-processing or check your email for updates from App Store Connect.

Post-processing does not consume any build minutes.

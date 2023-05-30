---
title: App Store Connect publishing using codemagic.yaml
linkTitle: App Store Connect
description: How to deploy an app to App Store and TestFlight using codemagic.yaml
weight: 1
aliases: 
  - '/publishing-yaml/distribution/' 
  - '/yaml-publishing/distribution/'
---


Codemagic enables you to automatically publish your iOS or macOS app to [App Store Connect](https://appstoreconnect.apple.com/) for beta testing with [TestFlight](https://developer.apple.com/testflight/) or distributing the app to users via App Store. Codemagic uses the **App Store Connect API key** for authenticating communication with Apple's services. You can read more about generating an API key from Apple's [documentation page](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api).

{{<notebox>}}
**Note:** This guide only applies to workflows configured with **codmegic.yaml**. If your workflow is configured with the **Flutter workflow editor** please go to [Publishing to App Store Connect using Flutter workflow editor](../publishing/publishing-to-app-store).
{{</notebox>}}

{{< youtube hDXfKccLMjI >}}

### Requirements

Please note that

1. for App Store Connect publishing, the provided key needs to have [App Manager permission](https://help.apple.com/app-store-connect/#/deve5f9a89d7),
2. and in order to submit your iOS application to App Store Connect, it must be code signed with a distribution [certificate](https://developer.apple.com/support/certificates/).

### Creating the App Store Connect API key
Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.

{{< include "/partials/app-store-connect-api-key.md" >}}

### Setting up publishing to App Store Connect

There are two options for setting up publishing to App Store Connect. You can either connect the Apple Developer Portal integration in the UI and reference the API key name in `codemagic.yaml`, or add the API key along with the required metadata as environment variables and reference them in your configuration file.

{{< tabpane >}}

{{< tab header="Using Apple Developer Portal integration" >}}
{{< include "/partials/yaml-publishing-app-store-connect-team-integration.md" >}}
{{< /tab >}}

{{< tab header="Using environment variables" >}}
{{< include "/partials/yaml-publishing-app-store-connect-environment-variables.md" >}}
{{< /tab >}}

{{< /tabpane >}}

### Post-processing of App Store Connect distribution (Magic Actions)

Some App Store Connect actions, like `submit_to_testflight`, `beta_groups`, `cancel_previous_submissions`, `expire_build_submitted_for_review`, and uploading release notes take place asynchronously in the post-processing step after the app artifact has been successfully published to App Store Connect and the main workflow has completed running in Codemagic. This avoids using the macOS build machine while we are waiting for Apple to complete processing the build and it becomes available for further actions.

Post-processing of App Store Distribution jobs, or Magic Actions in short, has a two-step timeout. If the uploaded build cannot be found in App Store Connect in 15 minutes, the step times out. This may happen if there are issues with the uploaded artifact, in which case the build does not become available in App Store Connect at all and you'll receive an email from App Store Connect. The overall timeout for post-processing is 120 minutes. If the uploaded build has not exited the processing status by then, post-processing is cancelled. You will still be able to manually submit the build to beta review, upload release notes and distribute the app to beta groups once the build becomes available in App Store Connect.

Note that Codemagic does not send status updates on the post-processing step. You can check the build log for the status of post-processing or check your email for updates from App Store Connect.

Post-processing does not consume any build minutes.

{{<notebox>}}
**Note:** Post-processing triggered by the presence of release notes will only occur if the release notes are found in the project's working directory and contain the "whatsNew" keyword:
 ``` 
  [
    {
        "language": "en-US",
        "text": "Customized text",
        "whatsNew": "Customized description",
    }
  ]
  ```
{{</notebox>}}

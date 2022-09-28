---
title: App Store Connect
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

### Requirements

Please note that

1. for App Store Connect publishing, the provided key needs to have [App Manager permission](https://help.apple.com/app-store-connect/#/deve5f9a89d7),
2. and in order to submit your iOS application to App Store Connect, it must be code signed with a distribution [certificate](https://developer.apple.com/support/certificates/).

### Creating the App Store Connect API key
Signing iOS applications requires [Apple Developer Program](https://developer.apple.com/programs/enroll/) membership.

{{< include "/partials/app-store-connect-api-key.md" >}}

### Configuring environment variables
{{< include "/partials/quickstart/publish-ios-environment-variables.md" >}}
### Distribution to App Store Connect

The following snippet demonstrates how to authenticate with and upload the IPA to App Store Connect, submit the build to beta tester groups in TestFlight and configure releasing the app to App Store. See additional configuration options for App Store Connect publishing [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/publish.md).

{{<notebox>}}**Note:** Please note that you will need to create an **app record** in App Store Connect before you can automate publishing with Codemagic. It is recommended to upload the very first version of the app manually. Suppose you have set up an **app record** but have not manually uploaded the app's first version. In that case, manual configuration of the settings must be done on App Store Connect after the build is complete, such as uploading the required screenshots and providing the values for the privacy policy URL and application category. {{</notebox>}}


{{< highlight yaml "style=paraiso-dark">}}
publishing:
  app_store_connect:
    # Contents of the API key saved as a secure environment variable:
    api_key: $APP_STORE_CONNECT_PRIVATE_KEY 
    
    # Alphanumeric value that identifies the API key, 
    # can also reference environment variable such as $APP_STORE_CONNECT_KEY_IDENTIFIER
    key_id: 3MD9688D9K 

    # Alphanumeric value that identifies who created the API key,
    # can also reference environment variable such as $APP_STORE_CONNECT_ISSUER_ID
    issuer_id: 21d78e2f-b8ad-... 
    
    
    # Configuration related to TestFlight (optional)

    # Optional boolean, defaults to false. Whether or not to submit the uploaded
    # build to TestFlight beta review. Required for distributing to beta groups.
    # Note: This action is performed during post-processing.
    submit_to_testflight: true 

    # Specify the names of beta tester groups that will get access to the build 
    # once it has passed beta review.
    beta_groups: 
      - group name 1
      - group name 2
    
    
    # Configuration related to App Store (optional)

    # Optional boolean, defaults to false. Whether or not to submit the uploaded
    # build to App Store review. Note: This action is performed during post-processing.
    submit_to_app_store: true
    
    # Optional, defaults to MANUAL. Supported values: MANUAL, AFTER_APPROVAL or SCHEDULED
    release_type: SCHEDULED

    # Optional. Timezone-aware ISO8601 timestamp with hour precision when scheduling
    # the release. This can be only used when release type is set to SCHEDULED.
    # It cannot be set to a date in the past.
    earliest_release_date: 2021-12-01T14:00:00+00:00 
    
    # Optional. The name of the person or entity that owns the exclusive rights
    # to your app, preceded by the year the rights were obtained.
    copyright: 2021 Nevercode Ltd
{{< /highlight >}}



{{<notebox>}}
**Note:** To use different Apple Developer Portal accounts for publishing your iOS apps, set up separate workflows.
{{</notebox>}}

### Post-processing of App Store Connect distribution (Magic Actions)

Some App Store Connect actions, like `submit_to_testflight`, `beta_groups` and uploading release notes take place asynchronously in the post-processing step after the app artifact has been successfully published to App Store Connect and the main workflow has completed running in Codemagic. This avoids using the macOS build machine while we are waiting for Apple to complete processing the build and it becomes available for further actions.

Post-processing of App Store Distribution jobs, or Magic Actions in short, has a two-step timeout. If the uploaded build cannot be found in App Store Connect in 15 minutes, the step times out. This may happen if there are issues with the uploaded artifact, in which case the build does not become available in App Store Connect at all and you'll receive an email from App Store Connect. The overall timeout for post-processing is 120 minutes. If the uploaded build has not exited the processing status by then, post-processing is cancelled. You will still be able to manually submit the build to beta review, upload release notes and distribute the app to beta groups once the build becomes available in App Store Connect.

Note that Codemagic does not send status updates on the post-processing step. You can check the build log for the status of post-processing or check your email for updates from App Store Connect.

Post-processing does not consume any build minutes.

#### Connect the Apple Developer Portal integration for your team/account

{{< include "/partials/integrations-setup-app-store-connect.md" >}}

#### Distribution to App Store Connect

The following snippet demonstrates how to authenticate with and upload the IPA to App Store Connect, submit the build to beta tester groups in TestFlight and configure releasing the app to App Store. See additional configuration options for App Store Connect publishing [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/publish.md).

To submit solely to internal testers without requiring Apple's beta review (TestFlight Internal Testing Only), add the `--custom-export-options='{"testFlightInternalTestingOnly": true}'` argument to `use-profiles` during iOS code signing as detailed [here](https://docs.codemagic.io/yaml-code-signing/signing-ios/#using-provisioning-profiles).

{{<notebox>}}**Note:** Please note that you will need to create an **app record** in App Store Connect before you can automate publishing with Codemagic. It is recommended to upload the very first version of the app manually. Suppose you have set up an **app record** but have not manually uploaded the app's first version. In that case, manual configuration of the settings must be done on App Store Connect after the build is complete, such as uploading the required screenshots and providing the values for the privacy policy URL and application category. {{</notebox>}}

{{< highlight yaml "style=paraiso-dark">}}
# Integration section is required to make use of the keys stored in 
# Codemagic UI under Apple Developer Portal integration.
workflows:
  ios-workflow:
    name: iOS Workflow
    integrations:
      app_store_connect: <App Store Connect API key name>

    environment:
      # ...  

    scripts:
      # ...  

    publishing:
      app_store_connect:
        # Use referenced App Store Connect API key to authenticate binary upload
        auth: integration 

        # Configuration related to TestFlight (optional)

        # Optional boolean, defaults to false. Whether or not to submit the uploaded
        # build to TestFlight beta review.
        # Note: This action is performed during post-processing.
        submit_to_testflight: true

        # Optional boolean, defaults to false. Set to true to automatically expire 
        # previous build in review or waiting for review in Testflight before
        # submitting a new build to beta review. Expired builds will no longer be available for testers.
        # Note: This action is performed during post-processing.
        expire_build_submitted_for_review: true

        # Specify the names of beta tester groups that will get access to the build.
        beta_groups: 
          - group name 1
          - group name 2
        
        # Configuration related to App Store (optional)

        # Optional boolean, defaults to false. Whether or not to submit the uploaded
        # build to App Store review. Note: This action is performed during post-processing.
        submit_to_app_store: true

        # Optional boolean, defaults to false. Set to true to cancel the previous 
        # submission (if applicable) when submitting a new build to App Store review.
        # This allows automatically submitting a new build for review if a previous submission exists.
        # Note: This action is performed during post-processing.
        cancel_previous_submissions: true
        
        # Optional, defaults to MANUAL. Supported values: MANUAL, AFTER_APPROVAL or SCHEDULED
        release_type: SCHEDULED

        # Optional. Timezone-aware ISO8601 timestamp with hour precision when scheduling
        # the release. This can be only used when release type is set to SCHEDULED.
        # It cannot be set to a date in the past.
        earliest_release_date: 2021-12-01T14:00:00+00:00 
        
        # Optional. The name of the person or entity that owns the exclusive rights
        # to your app, preceded by the year the rights were obtained.
        copyright: 2021 Nevercode Ltd

        # Optional boolean. Whether or not to release an App Store version update in phases.
        # With this option turned on, your version update will be released over a 7-day period
        # to a percentage of your users (selected at random by their Apple ID) with automatic
        # updates turned on. Learn more from 
        # https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases.
        # If not specified, then App Store version default phased release configuration is reused.
        phased_release: true
{{< /highlight >}}

{{<notebox>}}
**Note:** To use different Apple Developer Portal accounts for publishing your iOS apps, set up separate workflows.
{{</notebox>}}

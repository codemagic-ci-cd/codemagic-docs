Codemagic enables you to automatically publish your iOS or macOS app to [App Store Connect](https://appstoreconnect.apple.com/) for beta testing with [TestFlight](https://developer.apple.com/testflight/) or distributing the app to users via App Store. Codemagic uses the **App Store Connect API key** for authenticating communication with Apple's services. You can read more about generating an API key from Apple's [documentation page](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api).

Please note that:

1. for App Store Connect publishing, the provided key needs to have [App Manager permission](https://help.apple.com/app-store-connect/#/deve5f9a89d7),
2. and in order to submit your iOS application to App Store Connect, it must be code signed with a distribution [certificate](https://developer.apple.com/support/certificates/).

The following snippet demonstrates how to authenticate with and upload the IPA to App Store Connect, submit the build to beta tester groups in TestFlight and configure releasing the app to App Store. See additional configuration options for App Store Connect publishing [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/publish.md).

{{< highlight yaml "style=paraiso-dark">}}
sample-workflow-ios:
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

---
---

Codemagic offers a wide array of options for app publishing and the list of partners and integrations is continuously growing. For the most up-to-date information, check the guides in the **Configuration > Publishing** section of these docs.
To get more details on the publishing options presented in this guide, please check the [Email publishing](../yaml-publishing/email.md), the [Google Play Store](../yaml-publishing/google-play.md) publishing and the [App Store Connect](../yaml-publishing/app-store-connect.md).

#### Email publishing
If the build finishes successfully, release notes (if passed), and the generated artifacts will be published to the provided email address(es). If the build fails, an email with a link to build logs will be sent.

If you don’t want to receive an email notification on build success or failure, you can set `success` to `false` or `failure` to `false` accordingly.
{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  # ...
  environment:
  # ...
  scripts:
  # ... 
  publishing:
    email:
      recipients:
        - user_1@example.com
        - user_2@example.com
      notify:
        success: true
        failure: false
{{< /highlight >}}

#### Publishing to Google Play and App Store

{{< tabpane >}}
{{< tab header="Android" >}}
{{<markdown>}}
Publishing apps to Google Play requires you to set up a service account in Google Play Console and save the content of the `JSON` key file to a secure environment variable as explained above in **Android Build Versioning** steps 1-5.
Configuring Google Play publishing is simple as you only need to provide credentials and choose the desired track. If the app is in `draft` status, please also include the `submit_as_draft: true` or promote the app status in Google Play.
{{< highlight yaml "style=paraiso-dark">}}
react-native-android:
  # ... 
  publishing:
    # ...
    google_play:
      credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
      track: internal
      submit_as_draft: true
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
Codemagic enables you to automatically publish your iOS or macOS app to [App Store Connect](https://appstoreconnect.apple.com/) for beta testing with [TestFlight](https://developer.apple.com/testflight/) or distributing the app to users via App Store. Codemagic uses the **App Store Connect API key** for authenticating communication with Apple's services. You can read more about generating an API key from Apple's [documentation page](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api).

Please note that

1. for App Store Connect publishing, the provided key needs to have [App Manager permission](https://help.apple.com/app-store-connect/#/deve5f9a89d7),
2. and in order to submit your iOS application to App Store Connect, it must be code signed with a distribution [certificate](https://developer.apple.com/support/certificates/).

The following snippet demonstrates how to authenticate with and upload the IPA to App Store Connect, submit the build to beta tester groups in TestFlight and configure releasing the app to App Store. See additional configuration options for App Store Connect publishing [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/publish.md).

{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
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
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}
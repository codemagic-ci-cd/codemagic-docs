
In order to get the latest build number from App Store or TestFlight, you will need the App Store credentials as well as the **Application Apple ID**. This is an automatically generated ID assigned to your app and it can be found under **General > App Information > Apple ID** under your application in App Store Connect.

1. Add the **Application Apple ID** to the `codemagic.yaml` as a variable
2. Add the script to get the latest build number using `app-store-connect` and configure the new build number using `agvtool`.
3. Your `codemagic.yaml` will look like this:
{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  # ...
  environment:
    # ...
    vars:
      # ...
      APP_ID: 1555555551
  # ...
  scripts:
    - name: Increment build number
      script: | 
        #!/bin/sh
        cd $CM_BUILD_DIR/ios
        LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "$APP_ID")
        agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
    - name: Build ipa for distribution
      script:
        # build command
{{< /highlight >}}

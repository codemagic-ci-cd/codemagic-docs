---
title: Huawei AppGallery
description: How to deploy an app to Huawei AppGallery using codemagic.yaml
weight: 4
---

Codemagic enables you to automatically publish your iOS or Android app to Huawei AppGallery.

## Creating an API Client in Huawei AppGallery
An API client is an identity credential used by AppGallery Connect to manage user access to AppGallery Connect APIs. Before accessing an API, you must create an API client with the permission for accessing the API. The procedure is as follows:

1. Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html) and click **Users and permissions**.
2. Go to **API key** > **Connect API** and click **Create**.
3. For **Name**, enter a custom client name. Set **Project** to **N/A**, select the required roles, and click **OK**.

{{<notebox>}}
NOTE: Set Project to N/A to define the API client as a team-level one. Otherwise, the result code 403 will be returned during API calls.
{{</notebox>}}

4. After the client is successfully created, you need to save the **Client ID** and the **Client Secret** (**Key**) to [environment variables](/variables/environment-variable-groups/#storing-sensitive-valuesfiles) in a group named **app_gallery** for example.

## Get the App ID
1. Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html) and click **My apps** and select you app.
3. Go to **App Information** and save the **App ID** to the environment variables as well in the **app_gallery** environment group.

## App Signing
If you want to release your app in App Bundle format `.aab` and use the dynamic delivery feature, you will need to sign your app. 

You will need to upload the signing key to the Codemagic environment variables so Codemagic can sign your app before publishing it, see the [docs](https://docs.codemagic.io/yaml-code-signing/signing-android/).

1. Go to your app page.
2. Go to **App Signing** tab in the *Services* section.
3. Choose the first option *(Let AppGallery connect create and manage app signature for you)*.
4. After you create your upload key, you need to export a PEM certificate for the new upload key.

{{< highlight bash "style=paraiso-dark">}}
$ keytool -export -rfc -keystore YOUR_KEYSTORE.jks -alias upload -file upload_certificate.pem
{{< /highlight >}}

5. Upload the **upload_certificate.pem** file and click **Submit**.

## Adding the Fastlane script to your code
First, you need to set up Fastlane at your project by running `fastlane init` command, see the [docs](https://docs.fastlane.tools/getting-started/android/setup/).

Now add this lane to your **Fastlane** file.
{{< highlight shell "style=paraiso-dark">}}
  lane :huawei do
    gradle(
      task: 'bundle', #apk & aab
      build_type: 'Release',
      print_command: true,
    )

    huawei_appgallery_connect(
    client_id: "#{ENV["CLIENT_ID"]}",
    client_secret: "#{ENV["CLIENT_SECRET"]}",
    app_id: "#{ENV["APP_ID"]}",
    apk_path: "./app/build/outputs/bundle/release/app-release.aab",

    # Optional, Parameter beyond this are optional
    is_aab: true,
    submit_for_review: true,
    delay_before_submit_for_review: 20,
)
  end
{{< /highlight >}}

## Publish to the AppGallery store
After you set everything up you need to execute the lane from you `codemagic.yaml` file, so add this to your scripts section:

{{< highlight yaml "style=paraiso-dark">}}
      - name: Publish to the AppGallery store
        script: |
          fastlane add_plugin huawei_appgallery_connect
          bundle install
          bundle exec fastlane huawei
{{< /highlight >}}
The whole `codemagic.yaml` file should look something like this:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-fastlane:
    name: Android Fastlane
    instance_type: linux_x2
    environment:
      groups:
        - app_gallery # <-- (Includes CLIENT_ID, CLIENT_SECRET, APP_ID)
      android_signing:
        - codemagic_test
    scripts:
      - chmod +x gradlew
      - name: Publish to the AppGallery store
        script: |
          fastlane add_plugin huawei_appgallery_connect
          bundle install
          bundle exec fastlane huawei
    artifacts:
      - app/build/outputs/**/**/*.aab
{{< /highlight >}}

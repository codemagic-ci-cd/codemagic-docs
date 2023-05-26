---
description: How to white-label your application using codemagic.yaml
title: White label apps
aliases:
  - /getting-started/white-label-apps
  - /knowledge-git/white-label-apps
  - /knowledge-white-label/white-label-scripts
weight: 15  
---

These are the steps you need to get started white labeling your application using Codemagic.

1. [Create a Codemagic app linked with the base code](#create-a-codemagic-app-linked-with-the-base-code)
2. [Storing client’s assets somewhere Codemagic can access](#storing-clients-assets)
3. [Create a unique environment variable group for each client (via UI or API)](#create-a-new-unique-environment-variables-group-for-each-client-via-ui-or-api)
4. [Setup your `codemagic.yaml` workflows to dynamically build for all clients](#setup-your-codemagicyaml-workflows-to-dynamically-build-for-all-clients)
5. [Start new builds via API, passing the client Id, and the environment variable group name](#start-new-builds-via-api)

## 1. Create a Codemagic app linked with the base code
You don’t have to create a Codemagic application for each client you want to white-label for, only one application linked with your base code is required.

{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}

## 2. Storing client assets

While you have only one dynamic workflow, you need to give each client a unique identifer so Codemagic knows who are you building for.

Each client should have a folder containing all unique assets needed for rebranding and uses a unique identifier in the file name for each client, e.g. `assets_001.zip` for client `001`.

{{<notebox>}}
💡 The zip archive typically contains these folders:

- **`android_assets/`**. This folder contains the Android icons from `/android/app/src/main/res/`.
- **`ios_assets/`**. This folder contains the iOS icons from `/ios/Runner/Assets.xcassets/AppIcon.appiconset/`.

Other assets such as fonts, images, etc. can also be added to this zip archive. 

Avoid adding any sensitive files such as certificates, profiles, key stores, or other sensitive data in this archive.

{{</notebox>}}

All archive files for all clients need to be stored somewhere Codemagic can access during the build e.g.(S3/GCP bucket, or headless CMS).

## 3. Create a unique environment variable group for each client
During the white-label build, Codemagic uses client-specific data to set or replace various values in the base code and to sign and publish the app to the stores. 

You should create a uniquely named environment variable group for each of your clients that contains secure environment variables for items such as certificates, profiles, API keys, or other client-specific credentials.

This group might contain the following environment variables:
- Android package name. `PACKAGE_NAME`.
- Android Keystore information. `CM_KEYSTORE` (base64 encoded), `CM_KEY_ALIAS`, `CM_KEY_PASSWORD`, `CM_KEYSTORE_PASSWORD`, `CM_KEYSTORE_PATH`.
- The content of the Google Cloud service JSON file to publish to Play Store. `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`, learn how to get it [here](../yaml-publishing/google-play/#configure-google-play-api-access).
- iOS app details. `APP_STORE_ID`, `BUNDLE_ID`.
- App Store Connect API key. `APP_STORE_CONNECT_KEY_IDENTIFIER`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_PRIVATE_KEY`, learn how to create create a new key [here](../yaml-code-signing/alternative-code-signing-methods/#:~:text=Creating%20the%20App%20Store%20Connect%20API%20key).
- iOS Distribution certificate private key. `CERTIFICATE_PRIVATE_KEY`, learn how to obtain it [here](../yaml-code-signing/alternative-code-signing-methods/#:~:text=Obtaining%20the%20Certificate%20private%20key).
- **.env** file if your app uses some secrets at runtime. `DOTENV_FILE` (base64 encoded).


To add these values you can either use the [Codemagic UI](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/#configuring-environment-variables) or use the Codemagic REST API to add these groups and values programmatically, which could be advantageous if you have a large number of clients or wish to add these values from your own backend system or client dashboard.


To add an environment variable using the Codemagic REST API, you need your API access token, the application id, the client group unique name, and the variable name and value. 

- The access token is available in the Codemagic UI under **Teams > Personal Account > Integrations > Codemagic API > Show**. You can then store this as an environment variable if you are calling the REST API from other workflows.
- Once you have added your app in Codemagic, open its settings and copy the **application id** from the browser address bar - `https://codemagic.io/app/<APP_ID>/settings`
- The client group name, is the group that holds all variables for this client e.g. `WL_001`, `WL_002`.

An example of adding a secure variable to an application group looks like this:

{{< highlight bash "style=paraiso-dark">}}
curl -XPOST -H 'x-auth-token: <your-auth-token>' \
       -H 'Content-Type: application/json;charset=utf-8' \
       -d '{
       "key": "<variable-name>",
       "value": "<variable-value>"
       "group":"<client-unique-group-name>",
       "secure": true
       }' \
       'https://api.codemagic.io/apps/<app-id>/variables'
{{< /highlight >}}

{{<notebox>}}
💡
Files such as **Android keystores**, or **.env** files should be base64 encoded and can be passed like this:

  `-d '{ "key": "<variable-name>", "value":`**`$(cat fileName | base64) ...`**

  And then decode it during the build like this:

  `echo $VAR | base64 --decode > /path`

{{</notebox>}}

## 4. Setup your codemagic.yaml workflows to dynamically build for all clients

Your codemagic.yaml file contains various workflows for building your app for all clients e.g. `android-qa-workflow`, `ios-release-workflow`.

In most cases, white label automation is done using shell scripts to perform tasks such as downloading assets, copying files such as logos, images, fonts, etc. to a new location, or changing string values in projects. Here you will find some common script samples we are using in our final [sample project](https://github.com/codemagic-ci-cd/white-label-demo-project/blob/main/codemagic.yaml).

### Downloading assets from Amazon S3

The Amazon CLI tools are pre-installed on Codemagic’s machines which makes it easy to store assets such as images, fonts, logos, etc. in an encrypted S3 bucket and then download these to the build machine when building each white label version. 

The following is an example of downloading a zip archive from Amazon S3 during the build where the `CLIENT_ID` variable is provided when the build is triggered using the Codemagic REST API:

{{< highlight yaml "style=paraiso-dark">}}
environment:
  groups:
    - aws_credentials
  vars:
    S3_BUCKET_NAME: cmwhitelabel 
    CLIENT_ASSETS_FOLDER: client_assets
  ...    
scripts:
  - name: Get assets from AWS S3 bucket
    script: | 
      aws s3 cp s3://$S3_BUCKET_NAME/assets_${CLIENT_ID}.zip assets.zip
      unzip assets.zip -d $CLIENT_ASSETS_FOLDER
{{< /highlight >}}

{{<notebox>}}
Use this script if you're using a headless CMS instead:
{{< highlight yaml>}}
scripts:
  - name: Get assets from Contentful CMS
    script: | 
      FILE_URL=$(curl --request GET --header "Authorization: Bearer $CONTENTFUL_API_TOKEN" "https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/assets" | jq '.items[].fields' | jq -r --arg id "assets_$CLIENT_ID" '. | select (.title==$id) | .file.url' | cut -c 3-) 
      curl -H "Authorization: Bearer $CONTENTFUL_API_TOKEN" $FILE_URL --output assets.zip

{{< /highlight >}}


{{</notebox>}}

### Changing the Android package name

You can use the [change_app_package_name](https://pub.dev/packages/change_app_package_name) flutter package to set a new Android package name, by installing the package first, then running it with the string value stored in the environment variable called `$PACKAGE_NAME`.

{{< highlight yaml "style=paraiso-dark">}}
- name: Change Android package name
  script: | 
    flutter pub add change_app_package_name
    flutter pub run change_app_package_name:main $PACKAGE_NAME
{{< /highlight >}}
### Changing the iOS bundle ID

The automation scripts used in a white label workflow will often need to modify the content of a configuration file. This can be achieved using the `sed` stream editor utility, which can perform basic text transformations such as replacing or adding text in a file. 

For example, if you want to change the bundle identifier used in the Xcode project by modifying the `project.pbxproj` file, the following script will look for all instances of the string “io.codemagic.whitelabel.dev” and replace it with the string value stored in the environment variable called `$BUNDLE_ID`.

{{< highlight yaml "style=paraiso-dark">}}
- name: Set bundle id
  script: | 
    PBXPROJ=$CM_BUILD_DIR/ios/Runner.xcodeproj/project.pbxproj
    sed -i.bak "s/\$BASE_BUNDLE_ID/$BUNDLE_ID/g" $PBXPROJ
{{< /highlight >}}

### Chaning app name

{{< tabpane >}}
{{% tab header="Android" %}}
Using `sed`, the following script will replace the line in the `AndroidManifest.xml` that starts with `android:label=` with a new line contains the new app name `$APP_NAME`.

{{< highlight yaml "style=paraiso-dark">}}
- name: Change Android app name
  script: sed -i.bak "s/android:label=.*/android:label=\"$APP_NAME\"/g" android/app/src/main/AndroidManifest.xml
{{< /highlight >}}

{{% /tab %}}

{{% tab header="iOS" %}}

**PlistBuddy** is a utility on macOS that can be used to perform operations on plist files. This approach can be used with native Swift/Objective-C apps, but please note that setting values directly in a Flutter project may cause problems with your project and you should consider using `sed` instead.

{{< highlight yaml "style=paraiso-dark">}}
- name: Change iOS app name
  script: /usr/libexec/PlistBuddy -c "Set :CFBundleName $APP_NAME" -c "Set :CFBundleDisplayName $APP_NAME" ios/${XCODE_SCHEME}/Info.plist
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

### Changing app icons

{{< tabpane >}}
{{% tab header="Android" %}}

For Android apps, you should run a script to update the icons located in `android/app/src/main/res` where you will find a number of directories that contain an icon for specific resolutions such as `drawable-hdpi`, `drawable-mdpi`, `drawable-xhdpi`, `drawable-xxhdpi`, `drawable-xxxhdpi`. Your script to update the icons in your Android project might look something like this:

{{< highlight yaml "style=paraiso-dark">}}
name: Change Android app icons
script: cp -r ./$CLIENT_ASSETS_FOLDER/android_assets/* ./android/app/src/main/res
{{< /highlight >}}

{{% /tab %}}

{{% tab header="iOS" %}}

For iOS apps, if you look at an Xcode project using Finder, you will see that the icons added in Xcode are located in `<project-name>/<scheme-name>/Assets.xcassets/AppIcon.appiconset`. This means that after downloading icon assets for a specific client’s build, you can change them on disk by simply deleting the existing `AppIcon.appiconset` directory, and then copying the assets into the `Assets.xcassets` directory. 

{{< highlight yaml "style=paraiso-dark">}}
name: Change iOS app icons
script: cp -r ./$CLIENT_ASSETS_FOLDER/ios_assets ios/Runner/Assets.xcassets/
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

### Automatic build versioning

Each new app version that is published to Google Play or the Apple App Store needs to have a unique build number. You can use Codemagic’s CLI tools to retrieve the previous build number and then increment this for each new build. For example, the following shows how to increment the build number when building Flutter apps:
{{< tabpane >}}
{{% tab header="Android" %}}

{{< highlight yaml "style=paraiso-dark">}}
name: Flutter build aab with automatic versioning
script: | 
  flutter build appbundle --release \
    --build-name=1.0.0 \
    --build-number=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks="$GOOGLE_PLAY_TRACK") + 1))

{{< /highlight >}}

{{% /tab %}}

{{% tab header="iOS" %}}

{{< highlight yaml "style=paraiso-dark">}}
name: Flutter build ipa with automatic versioning
script: | 
  flutter build ipa --release \
    --build-name=1.0.0 \
    --build-number=$(($(app-store-connect get-latest-testflight-build-number "$APP_STORE_ID") + 1)) \
    --export-options-plist=/Users/builder/export_options.plist
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

### Publishing to customer stores
You can automate the process of publishing each client’s app to their store account with Codemagic.


{{< tabpane >}}
{{% tab header="Play Store" %}}

Make sure you add each client’s service account JSON key file to their environment variables group so Codemagic can authenticate and publish the app to their store.
{{< highlight yaml "style=paraiso-dark">}}
publishing:
  google_play:
    credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
    track: <your-track>
{{< /highlight >}}
{{<markdown>}}
Read more on this [here](https://docs.codemagic.io/yaml-publishing/google-play/).
{{</markdown>}}

{{% /tab %}}

{{% tab header="App Store" %}}

If you’re using the automatic iOS code signing method, then each client’s environment group already has their App Store Connect account credentials, and they’ll be used to publish the app to this account.

{{< highlight yaml "style=paraiso-dark">}}
publishing:      
  app_store_connect:
    api_key: $APP_STORE_CONNECT_PRIVATE_KEY
    key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
    issuer_id: $APP_STORE_CONNECT_ISSUER_ID
{{< /highlight >}}
{{<markdown>}}
Read more on this [here](https://docs.codemagic.io/yaml-publishing/app-store-connect/).
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


<br>
{{<notebox>}}

⚠️ Neither Apple nor Google provides APIs that programmatically allow an app to be created. Therefore, you will need to create and upload the first version of each app manually. After that Codemagic can fully automate the white-label process.
{{</notebox>}}

### Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to download client assets from AWS S3 bucket, chaning app name and icons, replacing exciting package name and bundle Id, build, code sign, automatically version and publish to each customer stores accounts.

Your final `codemagic.yaml` file should look something like this:

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-client-release:
    name: Android client release
    instance_type: mac_mini_m1
    labels:
      - ${CLIENT_ID} # Helpful when you open your Codemagic's builds page 
    environment:
      groups:
        - aws_credentials # Includes (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION)
      vars:
        S3_BUCKET_NAME: cmwhitelabel # The name of your S3 bucket that have all of your clients assets.
        CLIENT_ASSETS_FOLDER: client_assets # The name of unzipped folder on the build machine that have the client assets.
        ANDROID_ASSETS_FOLDER: android_assets # The name of your folder in S3 bucket that have the client's Android assets from (/android/app/src/main/res/).
        IOS_ASSETS_FOLDER: ios_assets # The name of your folder in S3 bucket that have the client's iOS assets from (/ios/Runner/Assets.xcassets/).
        GOOGLE_PLAY_TRACK: internal
    scripts:
      - name: Get assets from AWS S3 bucket
        script: | 
          aws s3 cp s3://$S3_BUCKET_NAME/assets_${CLIENT_ID}.zip assets.zip
          unzip assets.zip -d $CLIENT_ASSETS_FOLDER
      - name: Set Package name
        script: | 
          flutter pub add change_app_package_name
          flutter pub run change_app_package_name:main $PACKAGE_NAME
      - name: Change Android icons
        script: cp -r ./$CLIENT_ASSETS_FOLDER/$ANDROID_ASSETS_FOLDER/* ./android/app/src/main/res
      - name: Set up keystore
        script: echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
      - name: Install dependencies
        script: flutter packages pub get
      - name: Flutter build aab and automatic versioning
        script: | 
          BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks="$GOOGLE_PLAY_TRACK") + 1))
          flutter build appbundle --release \
          --build-name=1.0.$BUILD_NUMBER \
          --build-number=$BUILD_NUMBER
    artifacts: 
      - build/**/outputs/**/*.aab
    publishing:
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: $GOOGLE_PLAY_TRACK 
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-client-release:
    name: iOS client release
    instance_type: mac_mini_m1
    labels:
      - ${CLIENT_ID} # Helpful when you open your Codemagic's builds page  
    environment:
      groups:
        - aws_credentials # Includes (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION)
      vars:
        S3_BUCKET_NAME: cmwhitelabel # The name of your S3 bucket that have all of your clients assets.
        CLIENT_ASSETS_FOLDER: client_assets # The name of unzipped folder on the build machine that have the client assets.
        ANDROID_ASSETS_FOLDER: android_assets # The name of your folder in S3 bucket that have the client's Android assets from (/android/app/src/main/res/).
        IOS_ASSETS_FOLDER: ios_assets # The name of your folder in S3 bucket that have the client's iOS assets from (/ios/Runner/Assets.xcassets/).
        XCODE_WORKSPACE: "ios/Runner.xcworkspace"
        XCODE_SCHEME: "Runner"
        BASE_BUNDLE_ID: io.codemagic.whitelabel.dev # <-- Put the bundle ID that exists in the code, it will be replaced with the client's.
    scripts:
      - name: Get assets from AWS S3 bucket
        script: | 
          aws s3 cp s3://$S3_BUCKET_NAME/assets_${CLIENT_ID}.zip assets.zip
          unzip assets.zip -d $CLIENT_ASSETS_FOLDER
      - name: Set bundle id # Replace the base bundle Id with the client's
        script: | 
          PBXPROJ=$CM_BUILD_DIR/ios/Runner.xcodeproj/project.pbxproj
          sed -i.bak "s/\$BASE_BUNDLE_ID/$BUNDLE_ID/g" $PBXPROJ
      - name: Change iOS icons
        script: cp -r ./$CLIENT_ASSETS_FOLDER/$IOS_ASSETS_FOLDER ios/Runner/Assets.xcassets/
      - name: Install pods
        script: find . -name "Podfile" -execdir pod install \;
      - name: iOS code signing
        script: | 
          keychain initialize
          app-store-connect fetch-signing-files "$BUNDLE_ID" --type IOS_APP_STORE --create
          keychain add-certificates
          xcode-project use-profiles
      - name: Install dependencies
        script: flutter packages pub get      
      - name: Flutter build ipa and automatic versioning
        script: | 
          BUILD_NUMBER=$(($(app-store-connect get-latest-app-store-build-number "$APP_STORE_ID") + 1))
          flutter build ipa --release \
          --build-name=1.0.$BUILD_NUMBER \
          --build-number=$BUILD_NUMBER\
          --export-options-plist=/Users/builder/export_options.plist
    artifacts: 
      - build/ios/ipa/*.ipa
    publishing:      
      app_store_connect:
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

## 5. Start new builds via API

The Codemagic REST API is used in a white-label workflow to trigger builds for each unique client version you need to build. When triggering a build, you can pass environment variables in the API request's payload that identify a specific client so their unique assets can be downloaded and used for the build, and the unique client environment group name that holds all the client secrets.

To trigger a build using the Codemagic REST API, you need your API access token, the application id, and the workflow id. 

- The access token is available in the Codemagic UI under **Teams > Personal Account > Integrations > Codemagic API > Show**. You can then store this as an environment variable if you are calling the REST API from other workflows.
- Once you have added your app in Codemagic, open its settings and copy the **application id** from the browser address bar - `https://codemagic.io/app/<APP_ID>/settings`
- The workflow id is the string value you assigned to the `name` property e.g "ios-qa-build"

An example of triggering a single build and passing an environment variable to specify the client id and a group to read the variables from might look like this:


{{< highlight yaml "style=paraiso-dark">}}
- name: Trigger single client builds
  script: | 
    CLIENT="001"
    curl -H "Content-Type: application/json" -H "x-auth-token: ${CM_API_KEY}" \
      --data '{
          "appId": "<app-id>", 
          "workflowId": "<workflow-id>",
          "branch": "<branch-name>",
          "labels": ["'${CLIENT}'"],
          "environment": { 
              "variables": { 
                  "CLIENT_ID": "'${CLIENT}'"
              },
              "groups": [
                  "WL_${CLIENT}"
              ]
          }
        }' \
       https://api.codemagic.io/builds
{{< /highlight >}}



In the following example, to trigger builds for clients `001`, `002` and `003` a simple array is first defined and then a for loop is used to initiate a build for each element in the array. The unique `CLIENT_ID` variable is provided in the payload for the three builds that are started when this command is run.

{{< highlight yaml "style=paraiso-dark">}}
- name: Trigger multiple client builds
  script: | 
      CLIENTS=("001" "002" "003")
      for CLIENT in ${CLIENTS[@]}; do
          echo "CLIENT: $CLIENT"  
          curl -H "Content-Type: application/json" -H "x-auth-token: ${CM_API_KEY}" \
              --data '{
                  "appId": "<app-id>", 
                  "workflowId": "<workflow-id>",
                  "branch": "<branch-name>",
                  "environment": { 
                      "variables": { 
                          "CLIENT_ID": "'${CLIENT}'"
                      },
                      "groups": [
                          "WL_${CLIENT}"
                      ]                      
                  }
              }' \
          https://api.codemagic.io/builds
      done
{{< /highlight >}}

The **Codemagic REST API** can also be used for white label solutions where a dashboard is made available to your clients so they can customize an app themselves. This means they could upload their own icons, images, etc. to brand their app and then create a new build of their app. It could also be more advanced and allow clients to add their own distribution certificates, provisioning profiles and API keys.

You can find out more about the Codemagic REST API [here](../rest-api/codemagic-rest-api/)

Check out the white label sample project [here](https://github.com/codemagic-ci-cd/white-label-demo-project).
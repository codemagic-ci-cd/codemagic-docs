---
description: All the required steps to White label your application using Codemagic
title: White label getting started guide
weight: 2
aliases:
  - /getting-started/white-label-apps
  - /knowledge-git/white-label-apps
  - /knowledge-white-label/white-label-scripts
---

These are the steps you need to get started white labeling your application using Codemagic.

1. [Create a Codemagic app linked with the base code](#create-a-codemagic-app-linked-with-the-base-code)
2. [Storing client’s assets somewhere Codemagic can access](#storing-clients-assets)
3. [Create a new unique environment variables group for each client (via UI or API)](#create-a-new-unique-environment-variables-group-for-each-client-via-ui-or-api)
4. [Setup your `codemagic.yaml` workflows to dynamically build for all clients](#setup-your-codemagicyaml-workflows-to-dynamically-build-for-all-clients)
5. [Start new builds via API, passing the client Id, and the environment variables’ group name](#start-new-builds-via-api)

## 1. Create a Codemagic app linked with the base code
You don’t have to create a Codemagic application for each client you want to white-label for, only one application linked with your base code is required.

Adding applications to Codemagic is a simple and straightforward process of connecting your Git repository and selecting the repository root for the application, read more [here](https://docs.codemagic.io/getting-started/adding-apps/).

## 2. Storing client’s assets

While you have only one dynamic workflow, you need to give each client a unique identity so Codemagic knows who are you building for.

Each client should have a folder containing all unique assets needed for rebranding and uses a unique identifier in the file name for each client, e.g. `assets_001.zip` for client `001`.

{{<notebox>}}
💡 The zip archive can have these folders:

- **`android_assets/`**. This folder contains the Android icons from `/android/app/src/main/res/`.
- **`ios_assets/`**. This folder contains the iOS icons from `/ios/Runner/Assets.xcassets/AppIcon.appiconset/`.
{{</notebox>}}

All archive files for all clients need to be stored somewhere Codemagic can access during the build e.g.(S3/GCP bucket, or headless CMS).

## 3. Create a new unique environment variables group for each client (via UI or API)

During the white-label build, Codemagic uses client-specific data to set or replace various values in the base code and to sign and publish the app to the stores. 

You should create a uniquely named environment variable group for each of your clients that contains secure environment variables for items such as certificates, profiles, API keys, or other client-specific credentials.

To add these values you can either use the [Codemagic UI](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/#configuring-environment-variables) or use the Codemagic REST API to add these groups and values programmatically, which could be advantageous if you have a large number of clients or wish to add these values from your own backend system or client dashboard.


To add an environment variable using the Codemagic REST API, you need your API access token, the application id, the client group unique name, and the variable name and value. 

- The access token is available in the Codemagic UI under **Teams > Personal Account > Integrations > Codemagic API > Show**. You can then store this as an environment variable if you are calling the REST API from other workflows.
- Once you have added your app in Codemagic, open its settings and copy the **application id** from the browser address bar - `https://codemagic.io/app/<APP_ID>/settings`
- The client group name, is the group that holds all variables for this client e.g. "WL_CLIENT_ID".

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

### Downloading assets from a headless CMS

If you prefer to store your assets in a CMS system, then you can usually interact with its API and download any uploaded files using a cURL request.  

The example below shows how to download assets from Contentful providing the `CLIENT_ID` for the assets you want to download.


{{< highlight yaml "style=paraiso-dark">}}

# curl request to the Contentful API and parse the response with jq to get the url and remove leading double slash from the url.
FILE_URL=$(curl --request GET --header "Authorization: Bearer $CONTENTFUL_API_TOKEN" "https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/assets" | jq '.items[].fields' | jq -r --arg id "assets_$CLIENT_ID" '. | select (.title==$id) | .file.url' | cut -c 3-) 

# cURL request to download the file to the build machine
curl -H "Authorization: Bearer $CONTENTFUL_API_TOKEN" $FILE_URL --output assets.zip
{{< /highlight >}}

### Downloading assets from Amazon S3

The Amazon CLI tools are pre-installed on Codemagic’s machines which makes it easy to store assets such as images, fonts, logos, etc. in an encrypted S3 bucket and then download these to the build machine when building each white label version. 

The following is an example of downloading a zip archive from Amazon S3 during the build where the `CLIENT_ID` variable is provided when the build is triggered using the Codemagic REST API:

{{< highlight yaml "style=paraiso-dark">}}
name: Get assets from AWS S3 bucket
script: | 
  aws s3 cp s3://cmwhitelabel/assets_${CLIENT_ID}.zip $CM_BUILD_DIR/assets.zip
  unzip assets.zip -d client_assets
{{< /highlight >}}

### Changing string values in files

The automation scripts used in a white label workflow will often need to modify the content of a configuration file. This can be achieved using the `sed` stream editor utility, which can perform basic text transformations such as replacing or adding text in a file. 

For example, if you want to change the bundle identifier used in the Xcode project by modifying the `project.pbxproj` file, the following script will look for all instances of the string “io.codemagic.whitelabel.dev” and replace it with the string value stored in the environment variable called BUNDLE_ID which would be typically passed to the workflow using the REST API.

{{< highlight yaml "style=paraiso-dark">}}
environment:
  vars:
    PBXPROJ=$CM_BUILD_DIR/ios/Runner.xcodeproj/project.pbxproj
    ...
name: Set bundle id
script: | 
  # The value of BUNDLE_ID will be set when the build is triggered using the Codemagic REST API
  sed -i.bak "s/\io.codemagic.whitelabel.dev/$BUNDLE_ID/g" $PBXPROJ
{{< /highlight >}}

### Updating plist files

**PlistBuddy** is a utility on macOS that can be used to perform operations on plist files. This approach can be used with native Swift/Objective-C apps, but please note that setting values directly in a Flutter project may cause problems with your project and you should consider using `sed` instead.

{{< highlight yaml "style=paraiso-dark">}}

# Set the path to the Info.plist in your project
PLIST=$CM_BUILD_DIR/project-name/Info.plist

# Set the location of the PlistBuddy binary
PLIST_BUDDY=/usr/libexec/PlistBuddy

# Set the bundle id $BUNDLE_ID which is passed as environment variable in API request to trigger the build
$PLIST_BUDDY -c "Set :CFBundleIdentifier $BUNDLE_ID" $PLIST

# Set CFBundleDisplayName using $BUNDLE_DISPLAY_NAME which is passed as environment variable in API request to trigger the build
$PLIST_BUDDY -c "Set :CFBundleDisplayName $BUNDLE_DISPLAY_NAME" $PLIST

# Set the app version number
$PLIST_BUDDY -c "Set :CFBundleShortVersionString 1.0.0" $PLIST

# Set the value for App Uses Non Exempt encryption to false
$PLIST_BUDDY -c "Set :ITSAppUsesNonExemptEncryption NO" $PLIST

{{< /highlight >}}

### Changing app icons

{{< tabpane >}}
{{% tab header="Android" %}}

For Android apps, you should run a script to update the icons located in `android/app/src/main/res` where you will find a number of directories that contain an icon for specific resolutions such as `drawable-hdpi`, `drawable-mdpi`, `drawable-xhdpi`, `drawable-xxhdpi`, `drawable-xxxhdpi`. Your script to update the icons in your Android project might look something like this:

{{< highlight yaml "style=paraiso-dark">}}
name: Change Android app icons
script: | 
  cp -r ./$CLIENT_ASSETS_FOLDER/android_assets/* ./android/app/src/main/res
{{< /highlight >}}

{{% /tab %}}

{{% tab header="iOS" %}}

For iOS apps, if you look at an Xcode project using Finder, you will see that the icons added in Xcode are located in `<project-name>/<scheme-name>/Assets.xcassets/AppIcon.appiconset`. This means that after downloading icon assets for a specific client’s build, you can change them on disk by simply deleting the existing `AppIcon.appiconset` directory, and then copying the assets into the `Assets.xcassets` directory. 

For example, you could do the following as one of your workflow steps:

{{< highlight yaml "style=paraiso-dark">}}
name: Change iOS app icons
script: | 
  # delete the existing icons
  rm -rf ios/Runner/Assets.xcassets/AppIcon.appiconset
  # copy the downloaded icons to Assets.xcassets directory
  cp -r ./$CLIENT_ASSETS_FOLDER/ios_assets ios/Runner/Assets.xcassets/
{{< /highlight >}}

{{< /tab >}}

{{< /tabpane >}}

### Automatic build versioning

Each new app version that is published to Google Play or the Apple App Store needs to have a unique build number. You can use Codemagic’s CLI tools to retrieve the previous build number and then increment this for each new build. For example, the following shows how to increment the build number when building Flutter iOS apps:

{{< highlight yaml "style=paraiso-dark">}}
name: Flutter build ipa and automatic versioning
script: | 
  flutter build ipa --release \
    --build-name=1.0.0 \
    --build-number=$(($(app-store-connect get-latest-testflight-build-number "$APP_STORE_ID") + 1)) \
    --export-options-plist=/Users/builder/export_options.plist
{{< /highlight >}}

## Publish to client’s stores
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

⚠️ There’s a limitation when it comes to dealing with stores, you need to manually create and upload the 1st version of each app, then Codemagic can take care of the rest.
{{</notebox>}}

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
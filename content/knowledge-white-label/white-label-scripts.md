---
description: White label automation script samples
title: White label scripts
weight: 2
aliases:
  - /getting-started/white-label-apps
  - /knowledge-git/white-label-apps
---

In most cases, white label automation is done using shell scripts to perform tasks such as downloading assets, copying files such as logos, images, fonts etc. to a new location, or changing string values in projects. Here you will find some common script samples.

## Changing string values in files

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

## Updating plist files

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


## Downloading assets from Amazon S3

The Amazon CLI tools are pre-installed on Codemagic’s machines which makes it easy to store assets such as images, fonts, logos, etc. in an encrypted S3 bucket and then download these to the build machine when building each white label version. 

One approach is to create a zip archive for each customer that contains their unique assets and use a unique identifier in the file name for each customer. For example, `assets_001.zip` would clearly identify that this zip archive contains the assets for client `001`. The following is an example of downloading a zip archive from Amazon S3 during the build where the `CLIENT_ID` variable is provided when the build is triggered using the Codemagic REST API:

{{< highlight yaml "style=paraiso-dark">}}
name: Get assets from AWS S3 bucket
script: | 
  aws s3 cp s3://cmwhitelabel/assets_${CLIENT_ID}.zip $CM_BUILD_DIR/assets.zip
  unzip assets.zip -d client_assets
{{< /highlight >}}

Since this is encrypted storage, it would also be possible to store other sensitive values for each customer such as API keys, tokens and certificates in a settings.env file which might look something like this:

{{< highlight yaml "style=paraiso-dark">}}
APP_STORE_CONNECT_KEY_IDENTIFIER=XXXXXXXXXX
APP_STORE_CONNECT_ISSUER_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

APP_STORE_CONNECT_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----
xxxx
xxxx
xxxx
xxxx
-----END PRIVATE KEY-----'

CERTIFICATE_PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----
xxxx
xxxx
xxxx
xxxx
-----END RSA PRIVATE KEY-----'

GCLOUD_SERVICE_ACCOUNT_CREDENTIALS='{
  "type": "service_account",
  "project_id": "xxxx",
  "private_key_id": "xxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n",
  "client_email": "xxxxx-xxxx@pxxxx.iam.gserviceaccount.com",
  "client_id": "xxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/xxxx-xxxx%40pc-api-xxxx-xxxx.iam.gserviceaccount.com"
}'
{{< /highlight >}}

You can learn how to use a settings.env file at build time [here](../knowledge-others/import-variables-from-env-file/).

## Downloading assets from a headless CMS

If you prefer to store your assets in a CMS system, then you can usually interact with its API and download any uploaded files using a cURL request.  

The example below shows how to download assets from Contentful providing the `CLIENT_ID` for the assets you want to download.


{{< highlight yaml "style=paraiso-dark">}}

# curl request to the Contentful API and parse the response with jq to get the url and remove leading double slash from the url.
FILE_URL=$(curl --request GET --header "Authorization: Bearer $CONTENTFUL_API_TOKEN" "https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/assets" | jq '.items[].fields' | jq -r --arg id "assets_$CLIENT_ID" '. | select (.title==$id) | .file.url' | cut -c 3-) 

# cURL request to download the file to the build machine
curl -H "Authorization: Bearer $CONTENTFUL_API_TOKEN" $FILE_URL --output assets.zip
{{< /highlight >}}


## Changing app icons

For iOS apps, if you look at an Xcode project using Finder, you will see that the icons added in Xcode are located in `<project-name>/<scheme-name>/Assets.xcassets/AppIcon.appiconset`. This means that after downloading icon assets for a specific client’s build, you can change them on disk by simply deleting the existing `AppIcon.appiconset` directory, and then copying the assets into the `Assets.xcassets` directory. 

For example, you could do the following as one of your workflow steps:

{{< highlight yaml "style=paraiso-dark">}}
name: Change iOS app icons
script: | 
  # delete the existing icons
  rm -rf ios/Runner/Assets.xcassets/AppIcon.appiconset
  # copy the downloaded icons to Assets.xcassets directory
  cp -r ./client_assets/AppIcon.appiconset ios/Runner/Assets.xcassets/
{{< /highlight >}}

For Android apps, you should run a similar script to update the icons located in app/src/main/res where you will find a number of directories that contain an icon for specific resolutions such as `drawable-hdpi`, `drawable-mdpi`, `drawable-xhdpi`, `drawable-xxhdpi`, `drawable-xxxhdpi`. Your script to update the icons in your Android project might look something like this:

{{< highlight yaml "style=paraiso-dark">}}
name: Change Android app icons
script: | 
  unzip android_assets.zip -d android_assets
  cp -r ./android_assets/* ./myapp/android/app/src/main/res
{{< /highlight >}}

## Automatic build versioning

Each new app version that is published to Google Play or the Apple App Store needs to have a unique build number. You can use Codemagic’s CLI tools to retrieve the previous build number and then increment this for each new build. For example, the following shows how to increment the build number when building a Flutter iOS apps:

{{< highlight yaml "style=paraiso-dark">}}
name: Flutter build ipa and automatic versioning
script: | 
  flutter build ipa --release \
    --build-name=1.0.0 \
    --build-number=$(($(app-store-connect get-latest-testflight-build-number "$APP_STORE_ID") + 1)) \
    --export-options-plist=/Users/builder/export_options.plist
{{< /highlight >}}

## Triggering builds with the Codemagic REST API

The Codemagic REST API is used in a white label workflow to trigger builds for each unique client version you need to build. When triggering a build, you can pass environment variables which identify a specific client so their unique assets can be downloaded and used for the build. It can be as simple as passing the ID number associated with the client. 

To trigger a build using the Codemagic REST API you need your API access token, the application id, and the workflow id. 

- The access token is available in the Codemagic UI under **Teams > Personal Account > Integrations > Codemagic API > Show**. You can then store this as an environment variable if you are calling the REST API from other workflows.
- Once you have added your app in Codemagic, open its settings and copy the **application id** from the browser address bar - `https://codemagic.io/app/<APP_ID>/settings`
- The workflow id is the string value you assigned to the `name` property e.g "ios-qa-build"

An example of triggering a single build and passing an environment variable to spedify the client id might look like this:


{{< highlight yaml "style=paraiso-dark">}}
- name: Trigger single clieny builds
        script: | 
          CLIENT="001"
            curl -H "Content-Type: application/json" -H "x-auth-token: ${CM_API_KEY}" \
              --data '{
                "appId": "62f12bd754bf379f7b80f532", 
                "workflowId": "ios-qa-client-release",
                "branch": "main",
								"labels": ["'${CLIENT}'"],
                "environment": { 
                  "variables": { 
                    "CLIENT_ID": "'${CLIENT}'"
                   }
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
                "appId": "62f12bd754bf379f7b80f532", 
                "workflowId": "ios-qa-client-release",
                "branch": "main",
                "environment": { 
                  "variables": { 
                    "CLIENT_ID": "'${CLIENT}'"
                   }
                }
              }' \
            https://api.codemagic.io/builds
          done
{{< /highlight >}}

The **Codemagic REST API** can also be used for white label solutions where a dashboard is made available to your customers so they can customize an app themselves. This means they could upload their own icons, images, etc. to brand their app and then create a new build of their app. It could also be more advanced and allow customers to add their own distribution certificates, provisioning profiles and API keys.

You can find our more about the Codemagic REST API [here](../rest-api/codemagic-rest-api.md)
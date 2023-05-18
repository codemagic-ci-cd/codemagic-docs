---
description: White label automation script samples
title: White label scripts
weight: 2
aliases:
  - /getting-started/white-label-apps
  - /knowledge-git/white-label-apps
---

In most cases, white label automation is done using shell scripts to perform tasks such as downloading assets, copying files such as logos, images, fonts etc. to a new location, or changing string values in projects. Here you will find some common script samples. For sample projects see the repository [here](https://github.com/codemagic-ci-cd/white-label-demo-project).

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

The following is an example of downloading a zip archive from Amazon S3 during the build where the `CLIENT_ID` variable is provided when the build is triggered using the Codemagic REST API:

{{< highlight yaml "style=paraiso-dark">}}
name: Get assets from AWS S3 bucket
script: | 
  aws s3 cp s3://cmwhitelabel/assets_${CLIENT_ID}.zip $CM_BUILD_DIR/assets.zip
  unzip assets.zip -d client_assets
{{< /highlight >}}

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


## Adding clients' environment variables
During the white-label build, Codemagic uses client-specific data to set or replace various values in the base code and to sign and publish the app to the stores. 

You should create a uniquely named environment variable group for each of your customers that contains secure environment variables for items such as certificates, profiles, API keys, or other customer-specific credentials.

To add these values you can either use the [Codemagic UI](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/#configuring-environment-variables) or use the Codemagic REST API to add these groups and values programmatically, which could be advantageous if you have a large number of customers or wish to add these values from your own backend system or customer dashboard.


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
**Note:** 
Sometimes you might want to store files e.g. **Android keystores**, or **.env** files. You can pass them as a base64 encoded value like this:

  `-d '{ "key": "<variable-name>", "value":`**`$(cat fileName | base64) ...`**

  And then decode it during the build like this:

  `echo $VAR | base64 --decode > /path`

{{</notebox>}}

## Automatic build versioning

Each new app version that is published to Google Play or the Apple App Store needs to have a unique build number. You can use Codemagic’s CLI tools to retrieve the previous build number and then increment this for each new build. For example, the following shows how to increment the build number when building Flutter iOS apps:

{{< highlight yaml "style=paraiso-dark">}}
name: Flutter build ipa and automatic versioning
script: | 
  flutter build ipa --release \
    --build-name=1.0.0 \
    --build-number=$(($(app-store-connect get-latest-testflight-build-number "$APP_STORE_ID") + 1)) \
    --export-options-plist=/Users/builder/export_options.plist
{{< /highlight >}}

## Triggering builds with the Codemagic REST API

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

The **Codemagic REST API** can also be used for white label solutions where a dashboard is made available to your customers so they can customize an app themselves. This means they could upload their own icons, images, etc. to brand their app and then create a new build of their app. It could also be more advanced and allow customers to add their own distribution certificates, provisioning profiles and API keys.

You can find out more about the Codemagic REST API [here](../rest-api/codemagic-rest-api/)

Check out the white label sample project [here](https://github.com/codemagic-ci-cd/white-label-demo-project).


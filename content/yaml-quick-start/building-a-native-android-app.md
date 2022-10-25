---
title: Android native apps
description: How to build an Android app with codemagic.yaml
weight: 2
aliases:
  - /yaml/building-a-native-android-app
  - /getting-started/building-a-native-android-app
  - /yaml-basic-configuration/building-a-native-android-app
---

This guide will illustrate all of the necessary steps to successfully build and publish a native Android app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/android/android-espresso-demo-project).

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

{{< include "/partials/quickstart/code-signing-android.md" >}}


## Setting up the Android package name

Configure Android package name by adding the corresponding variable in the `codemagic.yaml`:
{{< highlight yaml "style=paraiso-dark">}}
  workflows:
    react-native-android:
      # ....
      environment:
        groups:
          # ...
        vars:
          PACKAGE_NAME: "io.codemagic.sample.androidnative"
{{< /highlight >}}

## Configure scripts to build the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).

{{< highlight yaml "style=paraiso-dark">}}
scripts:
    # ....
  - name: Set Android SDK location
    script: | 
      echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/local.properties"
  - name: Build Android release
    script: | 
      ./gradlew bundleRelease # -> to create the .aab
      # gradlew assembleRelease # -> to create the .apk

artifacts:
  - android/app/build/outputs/**/*.aab
{{< /highlight >}}

## Build versioning

If you are going to publish your app to Google Play, each uploaded artifact must have a new version. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).

{{< include "/partials/quickstart/build-versioning-android.md" >}}


## Publishing

Codemagic offers a wide array of options for app publishing and the list of partners and integrations is continuously growing. For the most up-to-date information, check the guides in the **Configuration > Publishing** section of these docs.
To get more details on the publishing options presented in this guide, please check the [Email publishing](../yaml-publishing/email) and the [Google Play Store](../yaml-publishing/google-play) publishing docs.

#### Email publishing
{{< include "/partials/quickstart/publishing-email.md" >}}}

#### Publishing to Google Play
{{< include "/partials/quickstart/publishing-google-play.md" >}}


## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the app in the Codemagic UI and start the build to see it in action.


Your final `codemagic.yaml` file should look something like this:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  native-android:
    name: Native Android
    max_build_duration: 120
    instance_type: mac_mini_m1
    environment:
      android_signing:
        - keystore_reference
      groups:
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.sample.androidnative"
    scripts:
      - name: Set Android SDK location
        script: | 
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      - name: Build Android release
        script: | 
          LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name '$PACKAGE_NAME')
          if [ -z LATEST_BUILD_NUMBER ]; then
              # fallback in case no build number was found from google play. Alternatively, you can `exit 1` to fail the build
              UPDATED_BUILD_NUMBER=$BUILD_NUMBER
          else
              UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
          fi
          ./gradlew bundleRelease -PversionCode=$UPDATED_BUILD_NUMBER -PversionName=1.0.$UPDATED_BUILD_NUMBER
    artifacts:
      - android/app/build/outputs/**/*.aab
    publishing:
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true
{{< /highlight >}}

## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}
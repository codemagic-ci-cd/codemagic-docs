---
title: Building a native Android app
description: How to build an Android app with codemagic.yaml
weight: 7
aliases:
  - '../yaml/building-a-native-android-app'
  - /getting-started/building-a-native-android-app
---

## Setting up an Android project

The apps you have available on Codemagic are listed on the Applications page. Click **Add application** to add a new app.

1. On the Applications page, click **Set up build** next to the app you want to start building. 
2. On the popup, select **Android App** as the project type and click **Continue**.
3. Create a [`codemagic.yaml`](./yaml) file and add in it the commands to build, test and publish your project. See the full Android workflow example [below](#android-workflow-example).
4. Commit the configuration file to the root of your repository.
5. Back in app settings in Codemagic, scan for the `codemagic.yaml` file by selecting a **branch** to scan and clicking the **Check for configuration file** button at the top of the page. Note that you can have different configuration files in different branches.
6. If a `codemagic.yaml` file is found in that branch, you can click **Start your first build** and select the **branch** and **workflow** to build.
7. Finally, click **Start new build** to build the app.

{{<notebox>}}
**Tip**

Note that you need to set up a [webhook](../building/webhooks) for automatic build triggering. Click the **Create webhook** button on the right sidebar in app settings to add a webhook (not available for apps added via SSH/HTTP/HTTPS).

{{</notebox>}}

## Building an Android app

The necessary command for building native Android application goes under `scripts` in the [overall architecture](../getting-started/yaml/#template) in the `codemagic.yaml` file. For Android (built with gradle), the script looks like this:

```yaml
- ./gradlew build
```

## Testing, code signing and publishing an Android app

To test, code sign and publish an Android app:

* The code for testing an Android app also goes under `scripts`. A few examples of testing can be found [here](../testing-yaml/testing).
* All Android applications need to be signed before release, see how to do that [here](../code-signing-yaml/signing-android).
* All generated artifacts can be published to external services. Script examples are available under the [Publishing section](../publishing-yaml/distribution/).

## Android workflow example

{{<notebox>}}
You can find an up-to-date codemagic.yaml Android workflow in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/android/android-espresso-demo-project/codemagic.yaml).
{{</notebox>}}

The following example shows how to set up a workflow that builds your app and publishes it to a Google Play internal track.

```yaml
workflows:
  android-workflow:
    name: Android Workflow
    max_build_duration: 60
    instance_type: mac_mini
    environment:
      groups:
        - keystore_credentials # Comment this out if you are using code-signing-identities <-- Includes - CM_KEYSTORE, CM_KEYSTORE_PASSWORD, CM_KEY_PASSWORD, CM_KEY_ALIAS
        - google_play # <-- Includes - GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        - other
      # Add the group environment variables in Codemagic UI (either in Application/Team variables) - https://docs.codemagic.io/variables/environment-variable-groups/
      node: latest
    triggering:
      events:
        - push
        - tag
        - pull_request
      branch_patterns:
        - pattern: release
          include: true
          source: true
    scripts:
      - name: Set up local properties
        script: echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/local.properties"
      - name: Set up key.properties file for code signing
        script: |
          echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
          cat >> "$CM_BUILD_DIR/key.properties" <<EOF
          storePassword=$CM_KEYSTORE_PASSWORD
          keyPassword=$CM_KEY_PASSWORD
          keyAlias=$CM_KEY_ALIAS
          storeFile=$CM_KEYSTORE_PATH
          EOF
      - name: Build Android app
        script: 
          ./gradlew bundleRelease  # To generate an .apk use--> ./gradlew assembleRelease
    artifacts:
      - app/build/outputs/**/**/*.aab
      - app/build/outputs/**/**/*.apk
    publishing:
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
```

{{<notebox>}}
Note: You can skip `Set up key properties` script if you are using a **Team account**. Instead, follow the code signing guide for [Android code signing](../yaml-code-signing/signing-android). You will need to add your keystore reference as follows in your yaml configuration.
  
  ```
  environment:
    android_signing:
        - your_keystore_reference
  ```
{{</notebox>}}


{{<notebox>}}Note that you should incremenet the versionCode in `android/app/build.gradle`. {{</notebox>}}

Incrementing the version code can be done as follows:

```gradle
android {
    ...
    
    def appVersionCode = Integer.valueOf(System.env.BUILD_NUMBER ?: 0)
    defaultConfig {
        ...
        versionCode appVersionCode
        ...
    }
}
```

---
title: Publishing and deployment
description: How to set up publishing and build status notifications in codemagic.yaml
weight: 1
aliases:
    - '../yaml/distribution'
---

All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play and App Store Connect. It is also possible to publish elsewhere with custom scripts, see the examples below.

## Integrations for publishing and notifications

Codemagic has out-of-the-box support for publishing to the services listed below. Read more about each individual integration and see the configuration examples below.

### Email

If the build finishes successfully, release notes (if passed) and the generated artifacts will be published to the provided email address(es). If the build fails, an email with a link to build logs will be sent.

If you don't want to receive an email notification on build success or failure, you can set `success` to `false` or `failure` to `false` accordingly.

```yaml
publishing:
  email:
    recipients:
      - name@example.com
    notify:
      success: false     # To not receive a notification when a build succeeds
      failure: false     # To not receive a notification when a build fails
```

### Slack

Integrate Slack publishing into your Codemagic build pipeline to get notified when a build starts and receive build artifacts or logs when the build finishes.

#### Connecting your Slack workspace

To set up publishing to Slack, you first need to connect your Slack workspace in **User settings > Integrations > Slack** for personal apps and in **Teams > Your_team > Team integrations > Slack** for team apps. 

![List of integrations](../uploads/slack_connect.png)

Click **Connect** next to the Slack integration. You will be then redirected to an authorization page. Review the requested permissions and click **Allow** to give Codemagic Slack app access to your Slack workspace and allow it post build status updates and build artifacts (see also our [privacy policy](https://codemagic.io/privacy-policy/)).

![Authorization page](../uploads/slack_allow.png)

After you have successfully authorized Codemagic and connected your workspace, you will be redirected back to Codemagic. You can disconnect your Slack workspace anytime by clicking **Disconnect**.

![Slack integration is enabled](../uploads/slack_connected.png)

#### Configuring Slack publishing

The Slack channel for publishing is configured separately for each workflow in the `publishing` section of `codemagic.yaml` (refer [here](../publishing/email-and-slack-notifications/#slack) if you're configuring app settings in the Flutter workflow editor).

{{<notebox>}}
In order to publish to **private channels**, you need to invite Codemagic app to the channels, otherwise the app does not have access to private channels. To invite Codemagic app to private channels, write `@codemagic` in the channel.
{{</notebox>}}

If the build finishes successfully, release notes (if passed) and the generated artifacts will be published to the specified channel. If the build fails, a link to the build logs is published. When you set `notify_on_build_start` to `true`, the channel will be notified when a build starts.

If you don't want to receive a Slack notification on build success or failure, you can set `success` to `false` or `failure` to `false` accordingly.

```yaml
publishing:
  slack:
    channel: '#channel-name'
    notify_on_build_start: true    # To receive a notification when a build starts
    notify:
      success: false               # To not receive a notification when a build succeeds
      failure: false               # To not receive a notification when a build fails
```

### Google Play

Codemagic enables you to automatically publish your app either to one of the predefined tracks (`internal`, `alpha`, `beta` and `production`) on Google Play, or to your custom closed testing tracks. In order to do so, you will need to set up a service account in Google Play Console and add the `JSON` key file to your Codemagic configuration file, see how to [set up a service account](../knowledge-base/google-play-api/). The proper way to add your keys to `codemagic.yaml` is to [encrypt](../building/encrypting) the contents of the key file and add the encrypted value into the configuration file.

If your application supports [in-app updates](https://developer.android.com/guide/playcore/in-app-updates) Codemagic allows setting the update priority. Otherwise, `in_app_update_priority` can be omitted or set to `0`.

In addition, Codemagic supports [staged releases](https://support.google.com/googleplay/android-developer/answer/6346149?hl=en), allowing users to choose which fraction of the testers or users get access to the application. To release to everyone, omit `rollout_fraction` from codemagic.yaml. 

```yaml
publishing:
  google_play:                        # For Android app
    credentials: Encrypted(...)       # JSON key file for Google Play service account
    track: alpha                      # Name of the track: internal, alpha, beta, production, internal app sharing, or your custom track name
    in_app_update_priority: 3         # Priority of the release (only set if in-app updates are supported): integer in range [0, 5]
    rollout_fraction: 0.25            # Rollout fraction (set only if releasing to a fraction of users): value between (0, 1)
    changes_not_sent_for_review: true # To be used ONLY if your app cannot be sent for review automatically *
```

{{<notebox>}}
\* The field `changes_not_sent_for_review` is required if you are getting the next error:

`Changes cannot be sent for review automatically. Please set the query parameter changesNotSentForReview to true. Once committed, the changes in this edit can be sent for review from the Google Play Console UI.`

If your changes are sent to review automatically, but the field is still set to `true`, you will get the next error:

`Changes are sent for review automatically. The query parameter changesNotSentForReview must not be set.`
{{</notebox>}}

If you are getting a 400 error related to app being in draft status it means you need to promote your draft build to the next level up of testing tracks. Play Console will show you how to do this. You'll need to go through the steps, fill out questionnaires, upload various screen shots and then after approval you can move to the Alpha testing track and Codemagic will publish (publishing builds on Draft status is not supported).

If you are getting an error related to permissions then it is likely an issue related to the service account that has been created. Go through the steps of creating a service account once more carefully see how to [set up a service account](../knowledge-base/google-play-api/).

{{<notebox>}}
You can override the publishing track specified in the configuration file using the environment variable `GOOGLE_PLAY_TRACK`. This is useful if you're starting your builds via [Codemagic API](../rest-api/overview/) and want to build different configurations without editing the configuration file.
{{</notebox>}}

### App Store Connect

Codemagic enables you to automatically publish your iOS or macOS app to [App Store Connect](https://appstoreconnect.apple.com/) for beta testing with [TestFlight](https://developer.apple.com/testflight/) or distributing the app to users via App Store. Codemagic uses the **App Store Connect API key** for authenticating communication with Apple's services. You can read more about generating an API key from Apple's [documentation page](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api). 

Please note that
1. for App Store Connect publishing, the provided key needs to have [App Manager permission](https://help.apple.com/app-store-connect/#/deve5f9a89d7),
2. and in order to submit your iOS application to App Store Connect, it must be code signed with a distribution [certificate](https://developer.apple.com/support/certificates/).  

```yaml
publishing:
  app_store_connect:                  # For iOS or macOS app
    api_key: Encrypted(...)           # Contents of the API key, can also reference environment variable such as $APP_STORE_CONNECT_PRIVATE_KEY
    key_id: 3MD9688D9K                # Alphanumeric value that identifies the API key, can also reference environment variable such as $APP_STORE_CONNECT_KEY_IDENTIFIER
    issuer_id: 21d78e2f-b8ad-...      # Alphanumeric value that identifies who created the API key, can also reference environment variable such as $APP_STORE_CONNECT_ISSUER_ID
    submit_to_testflight: true        # Optional boolean, defaults to false. Whether or not to submit the uploaded build to TestFlight to automatically enroll your build to beta testers.
```

Submitting a build for TestFlight beta review depends on Apple's build processing time. By default, Codemagic will repeat submission attemps for 20 minutes. You could change for how long the submission attempts should be tried by setting `APP_STORE_CONNECT_MAX_BUILD_PROCESSING_WAIT` environment variable. For example, setting 42 minutes timeout:

```yaml
environment:
  vars:
    APP_STORE_CONNECT_MAX_BUILD_PROCESSING_WAIT: 42
```


## GitHub releases

Publishing GitHub releases is available for GitHub repositories only.

{{<notebox>}}
As of deprecating the GitHub OAuth integration, Codemagic no longer has write access to the repositories. Setting up a personal access token is needed to publish releases to GitHub. Please follow the instructions below.
{{</notebox>}}

Publishing happens only for successful builds triggered on tag creation and is unavailable for manual builds.

1. Create a personal access token in GitHub as described [here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).
2. Add the personal access token as an environment variable with the name `GITHUB_TOKEN` in the `environment` section.
3. In the `triggering` section, configure triggering on tag creation. Don't forget to add a branch pattern and ensure the webhook exists.

  ```yaml
  triggering:
    events:
      - tag
  ```

4. Add the following script after the build or to publishing scripts that publishes the artifacts with tag builds. Edit the placeholders like your application name and the path to build artifacts to match your setup.

    ```bash
    #!/usr/bin/env zsh

    # Publish only for tag builds
    if [ -z ${FCI_TAG} ]; then
    echo "Not a tag build will not publish GitHub release"
    exit 0
    fi

    # See more options about `gh release create` usage from GitHub CLI
    # official docs at https://cli.github.com/manual/gh_release_create

    gh release create "${FCI_TAG}" \
        --title "<Your Application Name> ${FCI_TAG}" \
        --notes-file changelog.md \
        path/to/build-artifact.ipa \
        path/to/build-artifact.apk

    # Note that you don't need to include title and changelog if you do not want to.
    # Any number of artifacts can be included with the release.
    ```

## Publishing a Flutter package to pub.dev

In order to get publishing permissions, first you will need to log in to pub.dev locally. It can be done with running `pub publish --dry-run`.
After that `credentials.json` will be generated which you can use to log in without the need of Google confirmation through browser.

`credentials.json` can be found in the pub cache directory (`~/.pub-cache/credentials.json` on MacOS and Linux, `%APPDATA%\Pub\Cache\credentials.json` on Windows)

```yaml
- echo $CREDENTIALS | base64 --decode > "$FLUTTER_ROOT/.pub-cache/credentials.json"
- flutter pub publish --dry-run
- flutter pub publish -f
```

## Publishing an app to Firebase App Distribution

If you use a Firebase service, encrypt `google-services.json` as `ANDROID_FIREBASE_SECRET` environment variable for Android
or `GoogleService-Info.plist` as `IOS_FIREBASE_SECRET` for iOS.

```bash
echo $ANDROID_FIREBASE_SECRET | base64 --decode > $FCI_BUILD_DIR/android/app/google-services.json
echo $IOS_FIREBASE_SECRET | base64 --decode > $FCI_BUILD_DIR/ios/Runner/GoogleService-Info.plist
```

### Publishing an app using Firebase CLI

Make sure to encrypt `FIREBASE_TOKEN` as an environment variable. Check [documentation](https://firebase.google.com/docs/cli#cli-ci-systems) for details.

Android

```yaml
- name: Publish the app to Firebase App Distribution
  script: |
    apkPath=$(find build -name "*.apk" | head -1)
    if [[ -z ${apkPath} ]]
    then
      echo "No apks were found, skip publishing to Firebase App Distribution"
    else
      echo "Publishing $apkPath to Firebase App Distribution"
      firebase appdistribution:distribute --app <your_android_application_firebase_id> --groups <your_android_testers_group> $apkPath
    fi
```

iOS

```yaml
- name: Publish the app to Firebase App Distribution
  script: |
    ipaPath=$(find build -name "*.ipa" | head -1)
    if [[ -z ${ipaPath} ]]
    then
      echo "No ipas were found, skip publishing to Firebase App Distribution"
    else
      echo "Publishing $ipaPath to Firebase App Distribution"
      firebase appdistribution:distribute --app <your_ios_application_firebase_id> --groups <your_ios_testers_group> $ipaPath
    fi
```

### Publishing an app with Fastlane

Make sure to encrypt `FIREBASE_TOKEN` as an environment variable. Check [documentation](https://firebase.google.com/docs/cli#cli-ci-systems) for details.

Before running a lane, you should install Fastlane Firebase app distribution plugin

```yaml
- name: Install fastlane-plugin-firebase_app_distribution
  script: |
    gem install bundler
    sudo gem install fastlane-plugin-firebase_app_distribution --user-install
```

Then you need to call a lane. This code is similar for Android and iOS.

Android

```yaml
- name: Execute fastlane android publishing task
  script: |
    cd android
    bundle install
    bundle exec fastlane <your_android_lane>
```

iOS

```yaml
- name: Execute fastlane ios publishing task
  script: |
    cd ios
    bundle install
    bundle exec fastlane <your_ios_lane>
```

### Publishing an Android app with Gradle

To authorize an application for Firebase App Distribution, use [Google service account](https://firebase.google.com/docs/app-distribution/android/distribute-gradle#authenticate_using_a_service_account).
Encrypt and add to environment variables these credentials (the file is named something like `yourappname-6e632def9ad4.json`) as `GOOGLE_APP_CREDENTIALS`. Specify the filepath in your `build.gradle` in `firebaseAppDistribution` as `serviceCredentialsFile="your/file/path.json"`.

```gradle
buildTypes {
    ...
    release {
        ...
        firebaseAppDistribution {
            ...
            serviceCredentialsFile="<your/file/path.json>"
        }
    }
```

Note that in case the credentials file is not specified in `firebaseAppDistribution` build type, it will search the filepath in `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

Decode application credentials for Firebase authorization:

```bash
echo $GOOGLE_APP_CREDENTIALS | base64 --decode > $FCI_BUILD_DIR/your/file/path.json
```

Build the application:

```yaml
- echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
- flutter packages pub get
- flutter build apk --release
```

Call the `gradlew` task for distribution

```yaml
- name: Distribute app to firebase with gradle plugin
  script: cd android && ./gradlew appDistributionUploadRelease
```

{{<notebox>}}

If you didn't specify `serviceCredentialsFile`, you may export it to random location like `/tmp/google-application-credentials.json`

```bash
echo $GOOGLE_APP_CREDENTIALS | base64 --decode > /tmp/google-application-credentials.json
```

And then export the filepath on the gradlew task

```yaml
- name: Distribute app to firebase with gradle plugin
  script: |
    export GOOGLE_APPLICATION_CREDENTIALS=/tmp/google-application-credentials.json
    cd android && ./gradlew appDistributionUploadRelease
```

{{</notebox>}}

## Publishing web applications to Firebase Hosting

Publishing web applications to Firebase Hosting With Codemagic publishing to Firebase Hosting is a straight-forward process as the Firebase CLI is already pre-installed on our virtual machines. Please note that before trying to publish to Firebase Hosting, you will have to set it up for your project locally. You can find more information in the official [documentation](https://firebase.google.com/docs/hosting/quickstart) for Firebase.

1. To get started with adding Firebase Hosting to Codemagic, you will need to obtain your Firebase token. In order to do that, run `firebase login:ci` in your local terminal. 
2. After running the command, your default browser should prompt for authorization to your Firebase project - when access is granted, the necessary token will appear in your terminal.
3. Copy and [encrypt](../building/encrypting/) the token using the Codemagic UI.
4. Add your encrypted token to your .yaml file by setting it under your environment variables with the name `FIREBASE_TOKEN`.
5. Create a new script for publishing to Firebase Hosting in your scripts section of the .yaml file and add it right after the build step

```yaml
- name: Publish to Firebase Hosting
  script: |
    firebase deploy --token "$FIREBASE_TOKEN"
```
When the build is successful, you can see your application published to Firebase Hosting. You can find the direct URL to the deployed build also from the log output in Codemagic UI:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

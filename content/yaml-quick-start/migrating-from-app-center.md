---
title: Migrating from App Center
description: How to ship your workflows to Codemagic
weight: 1
---

## Quick comparison


| **Features**                | **App Center** | **Codemagic**  |
|-----------------------------| ---------------|----------------|
| `Swift/Objective-C iOS`     |    ☑️           |      ✅        |
| `Android apps`              |    ☑️           |      ✅        |
| `React Native CLI apps`     |    ☑️           |      ✅        |
| `Expo React Native apps`    |    ❌          |      ✅        |
| `Flutter apps`              |    ❌          |      ✅        |
| `Unity apps`                |    ☑️           |      ✅        |
| `Ionic apps`                |    ☑️           |      ✅        |
| `White-labeling solution`   |    ❌          |      ✅        |
| `Automatic iOS code signing`|    ❌          |      ✅        |
| `Manual iOS code signing`   |    ☑️           |      ✅        |
| `Android code signing`      |    ☑️           |      ✅        |
| `Automatic build versioning`|    ☑️           |      ✅        |
| `Running integrations tests`|    ☑️           |      ✅        |
| `Running unit tests`        |    ☑️           |      ✅        |
| `App Store publishing`      |    ☑️           |      ✅        |
| `Play Store publishing`     |    ☑️           |      ✅        |
| `Firebase App Distribution `|    ❌          |      ✅        |
| `Slack integration`         |    ❌          |      ✅        |
| `Email notifications`       |    ☑️           |      ✅        |
| `macOS M2 support`          |    ❌          |      ✅        |
| `Linux machines support`    |    ❌          |      ✅        |
| `Windows machines support`  |    ☑️           |      ✅        |
| `Over-the-air (OTA) updates`|    ☑️           |      ✔️*        |
| `Analytics`                 |    ☑️           |      ✔️*        |
| `Apple device registration` |    ❌           |      ✅        |
| `Remote access to build machines`| ❌         |      ✅        |
| `Global environment variables`|  ❌           |      ✅        |
| `Install apps from QR code` |    ❌           |      ✅        |
| `Gitlab self-hosted runners`|    ☑️            |      ✅        |
| `Github self-hosted runners`|    ❌           |      ✅        |
| `Bitbucket self-hosted runners`| ❌           |      ✅        |
| `Enabling iOS app capability`|    ❌          |      ✅        |
| `Building iOS and Android together`| ❌       |      ✅        |
| `Inter-connected workflow support`|  ❌       |      ✅        |
| `Build logs for each build step`|    ❌       |      ✅        |
| `Dependency caching`            |    ❌       |      ✅        |



* CodePush will continue standalone, so users can continue using the feature by App Center. Alternatively, Codemagic can be integrated with Expo Application Services (EAS update).
* Codemagic allows you to integrate with Sentry and Firebase Crahslytics for analytics and uploading debug symbols


#### Performance overview

**Test name** | **Codemagic (M2)** | **Codemagic (M1)** | **App Center**
--- | --- | --- | ---
Building Project | [**5m 4s**](https://codemagic.io/app/660936c197f2bee5b7353663/build/6613924355709ef49738d259) | [6m 13s](https://codemagic.io/app/660936c197f2bee5b7353663/build/660abe3a7eedcf9b3279f83d) | [39m 27s](https://appcenter.ms/orgs/Nevercode_Codemagic/apps/Benchmark_iOS/build/branches/main/builds/9)
Overall improvement | 778% | 635% | -778% / -635%

As it can be seen, building the benchmark project took around 5-6 minutes with Codemagic macOS M1 and M2 machines while the build completed in 39 minutes 24 seconds with App Center. Worth pointing out that App Center limits free tier users to 30 minutes build duration per build and based on the performance rate above, the 30 minute build duration range will not allow you to complete your builds due to the fact that they will timeout.

#### Debugging options

Unlike App Center, Codemagic allows you to have straightforward debugging sessions:

1. Each build step has its own logs printed out which help you understand where issues could stem from. However, App Center presents all the build logs in one output which makes it extra challenging.
2. When building with Codemagic, you can enable remote access to builder machines through SSH and VNC sessions which means that you can access Xcode and Mac machines without quitting your ongoing build while debugging issues. Once you confirmed that your solution works, then you can either directly push these changes from Codemagic machines or do it manually.

## Step-by-Step transitioning guide

1. Sign up with Codemagic by clicking the link [here](https://codemagic.io/signup), or if you have already registered, then login to your account [here](https://codemagic.io/login)
2. Complete the onboarding the process by either getting started with a personal account or by creating a team where you and your colleagues can contribute to your app building and publishing process. You will be guided through once signed up.
3. Add your repository to Codemagic by either connecting your Git cloud provider account or by entering the clone URL manually.
4. Add **codemagic.yaml** in the root directory of the repository and check the file content below:


{{< tabpane >}}


{{< tab header="iOS with React Native CLI" >}}
{{<markdown>}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
 react-native-ios:
        name: React Native iOS
        max_build_duration: 120
        instance_type: mac_mini_m2
        integrations:
          app_store_connect: codemagic
        environment:
          ios_signing:
            distribution_type: app_store
            bundle_identifier: io.codemagic.sample.reactnative
          vars:
            XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Put the name of your Xcode workspace here
            XCODE_SCHEME: "CodemagicSample" # <-- Put the name of your Xcode scheme here
            APP_ID: 1555555551 # <-- Put the app id number here. This is found in App Store Connect > App > General > App Information
          node: v19.7.0
          xcode: latest
          cocoapods: default
        scripts:
            - name: Install npm dependencies
              script: |
                npm install
            - name: Install CocoaPods dependencies
              script: |
                cd ios && pod install
            - name: Set Info.plist values
              script: |
                # This allows publishing without manually answering the question about encryption 
                PLIST=$CM_BUILD_DIR/$XCODE_SCHEME/Info.plist
                PLIST_BUDDY=/usr/libexec/PlistBuddy
                $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST
            - name: Set up code signing settings on Xcode project
              script: |
                xcode-project use-profiles --warn-only
            - name: Increment build number
              script: |
                cd $CM_BUILD_DIR/ios
                LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "$APP_ID")
                agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
            - name: Build ipa for distribution
              script: |
                xcode-project build-ipa \
                  --workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" \
                  --scheme "$XCODE_SCHEME"
        artifacts:
            - build/ios/ipa/*.ipa
            - /tmp/xcodebuild_logs/*.log
            - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app
            - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM
        publishing:
          email:
            recipients:
              - user_1@example.com
              - user_2@example.com
            notify:
              success: true
              failure: false
          app_store_connect:
            auth: integration
            submit_to_testflight: true
            beta_groups: # Specify the names of beta tester groups that will get access to the build once it has passed beta review.
              - group name 1
              - group name 2
            submit_to_app_store: false
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}


{{< tab header="Android with React Native CLI" >}}
{{<markdown>}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
    react-native-android:
        name: React Native Android
        max_build_duration: 120
        instance_type: mac_mini_m2
        environment:
          android_signing:
            - keystore_reference
          groups:
            - google_play # <-- (Includes GCLOUD_SERVICE_ACCOUNT_CREDENTIALS <-- Put your google-services.json)
          vars:
            PACKAGE_NAME: "io.codemagic.sample.reactnative" # <-- Put your package name here e.g. com.domain.myapp
          node: v19.7.0
        scripts:
            - name: Install npm dependencies
              script: |
                npm install
            - name: Set Android SDK location
              script: |
                echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"            
            - name: Build Android release
              script: |
                LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
                if [ -z LATEST_BUILD_NUMBER ]; then
                  # fallback in case no build number was found from google play. Alternatively, you can `exit 1` to fail the build
                  UPDATED_BUILD_NUMBER=$BUILD_NUMBER
                else
                  UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
                fi
                cd android
                ./gradlew bundleRelease \
                  -PversionCode=$UPDATED_BUILD_NUMBER \
                  -PversionName=1.0.$UPDATED_BUILD_NUMBER
        artifacts:
            - android/app/build/outputs/**/*.aab
        publishing:
          email:
            recipients:
              - user_1@example.com
              - user_2@example.com
            notify:
              success: true     # To not receive a notification when a build succeeds
              failure: false    # To not receive a notification when a build fails
          google_play:
            credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
            track: alpha   # Any default or custom track that is not in ‘draft’ status
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


Once **codemagic.yaml** is configured, Codemagic automatically detects it and by clicking the **Start new build** button, your app is built and published to the stores.


## Automatic build triggering without manual intervention

Codemagic allows you to trigger builds on **pull_request**, **pull_request_labeled**, ** **push** and **tag** events. 

- **push** - a build will be started every time you commit code to any of the tracked branches.
- **pull_request** - a build will be started when a pull request is opened or updated to verify the resulting merge commit.
- **pull_request_labeled** - a build will be started every time you add a new label to a **GitHub** pull request.
- **tag** - Codemagic will automatically build the tagged commit whenever you create a tag for this app. Note that the watched branch settings do not affect tag builds.

Below you can find the steps to enable automatic build triggering:

1. Grab the webhooks URL and configure it in the repository settings. You can find the webhook URL in the Codemagic web app when navigating to your application and selecting the Webhooks tab. Below you can find how to configure webhooks with Azure DevOps.

#### Azure DevOps webhook configuration

Open your application repository, go to **Project Settings** > **Service Hooks**, click on **Create a new subscription...** and select **Web Hooks**. Under **Trigger on this type of event**, choose the event you wish to trigger builds for. Codemagic supports **Code pushed**, **Pull request created**, and **Pull request updated** events. In Azure, each of the events requires its own webhook. Once the event has been selected, choose your repository under filters and configure any additional settings.

2. Configure the **triggering** section in **codemagic.yaml**. The ready-to-use codemagic.yaml samples above have it already added. Check them for reference:

{{< highlight yaml "style=paraiso-dark">}}
```
 triggering:
      events:
          - push
          - tag
          - pull_request
          - pull_request_labeled
      branch_patterns:
          - pattern: develop
            include: true
            source: true
```
{{< /highlight>}}

3. Done! Now, as soon as any changes made based on the events above, builds will be triggered and you can check the webhook messages by navigating to your application and selecting the Webhooks tab.

Additionally, by using **when** to run and skip builds along with using **changeset** inside **when**, you can avoid unnecessary builds when functional components of your repository were not modified. More information about it can be found [here](https://docs.codemagic.io/yaml-running-builds/starting-builds-automatically/#using-when-to-run-or-skip-builds)


## Code signing iOS apps

All iOS applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. Codemagic handles the code signing process with ease through its manual and automatic code signing methods. The following steps will help you set up code signing for iOS applications:

1. Have your Apple Developer account as required by Apple
2. You can either let Codemagic generate a distribution certificate and provisioning profile or you do it yourself in Apple Developer account, then share them with Codemagic, so it can use these resources during code signing the application:


#### Adding code signing certificate

The steps below describe how to upload a distribution certificate. 

{{< tabpane >}}

{{< tab header="Upload certificate" >}}
{{<markdown>}}
  1. Log in to App Store Connect and navigate to Users and Access > Integrations » App Store Connect API.
  2. Click on the + sign to generate a new API key.
  3. Enter the name for the key and select an access level. We recommend choosing App Manager access rights.
  4. Click Generate.
  5. As soon as the key is generated, you can see it added to the list of active keys. Click Download API Key to save the private key.
  6. Open your Codemagic Team settings, go to Team integrations > Developer Portal > Manage keys.
  7. Click the Add key button.
  8. Enter the App Store Connect API key name. This is a human readable name for the key that will be used to refer to the key later in application settings.
  9. Enter the Issuer ID and Key ID values.
  10. Click on Choose a **.p8** file or drag the file to upload the App Store Connect API key downloaded earlier.
  11. Click Save.

{{</markdown>}}
{{< /tab >}}

{{< tab header="Generate new certificate" >}}
{{<markdown>}}
  If you have added the App Store Connect API key to Codemagic, you can also generate a new Apple Development or Apple Distribution certificate.

  1. Open your Codemagic Team settings, go to codemagic.yaml settings > Code signing identities.
  2. Open iOS certificates tab.
  3. Click Generate certificate.
  4. Provide a Reference name for the certificate.
  5. Choose the Certificate type.
  6. Select the App Store Connect API key to use.
  7. Click Create certificate.

  Once the certificate has been created, Codemagic will allow you to download the certificate and provides the password for it.
 
{{</markdown>}}
{{< /tab >}}

{{< tab header="Fetch from Developer Portal" >}}
{{<markdown>}}
  Existing signing certificates previously generated by Codemagic can be automatically fetched from Apple Developer Portal based on your team’s App Store Connect API key.

  Fetching a certificate that was not generated by Codemagic is not possible because each certificate is linked with a private signing key to which Codemagic has no access.

  1. Open your Codemagic Team settings, go to codemagic.yaml settings > Code signing identities.
  2. Open iOS certificates tab.
  3. Click Fetch certificate.
  4. Select a certificate from the Development certificates or Distribution certificates list.
  5. Click Fetch selected.

{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


#### Adding code signing provisioning profile

Codemagic allows you to upload a provisioning profile to be used for the application or to fetch a profile from the Apple Developer Portal.

{{< tabpane >}}

{{< tab header="Fetch from developer account" >}}
{{<markdown>}}
    You can automatically fetch the provisioning profiles from the Apple Developer Portal based on your team’s App Store Connect API key. The bundle identifier is listed for every available profile along with it’s name.

    The profiles are displayed grouped by category: Development profiles, Ad Hoc profiles, App Store profiles, and Enterprise profiles. For each selected profile, it is necessary to provide a unique Reference name, which can be later used in codemagic.yaml to fetch the profile.

        1. Open your Codemagic Team settings, go to codemagic.yaml settings > Code signing identities.
        2. Open iOS provisioning profiles tab.
        3. Click Fetch profiles
        4. Select the desired profile(s) and enter a Reference name for each one.
        5. Click Download selected. (scroll down if necessary)

{{</markdown>}}
{{< /tab >}}

{{< tab header="Upload a profile" >}}
{{<markdown>}}
    You can upload provisioning profiles with the .mobileprovision extension, providing a unique Reference name is required for each uploaded profile.

        1. Open your Codemagic Team settings, go to codemagic.yaml settings > Code signing identities.
        2. Open iOS provisioning profiles tab.
        3. Upload the provisioning profile file by clicking on Choose a .mobileprovision file or by dragging it into the indicated frame.
        4. Enter the Reference name for the profile.
        5. Click Add profile.

{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}

## Code signing Android apps

All Android applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. Follow the steps below to complete the android code signing configuration:

1. Generate a keystore file for signing your release builds. Running the following Java Keytool utility on your local machine will generate the necessary keystore file:

{{< highlight Shell "style=paraiso-dark">}}
keytool -genkey -v -keystore codemagic.keystore -storetype JKS \
        -keyalg RSA -keysize 2048 -validity 10000 -alias codemagic
{{< /highlight >}}

2. Open your Codemagic Team settings, and go to codemagic.yaml settings > Code signing identities.
3. Open Android keystores tab.
4. Upload the keystore file by clicking on Choose a file or by dragging it into the indicated frame.
5. Enter the Keystore password, Key alias and Key password values as indicated.
6. Enter the keystore Reference name. This is a unique name used to reference the file in codemagic.yaml
7. Click the Add keystore button to add the keystore.
8. Go to your android workflow in codemagic.yaml, and reference the keystore file name like below:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    name: Android Workflow
    # ....
    environment:
      android_signing:
        - keystore_reference
{{< /highlight >}}


## Publishing iOS apps to App Store Connect

Codemagic enables you to automatically publish your iOS or macOS app to App Store Connect for beta testing with TestFlight or distributing the app to users via App Store. Codemagic uses the App Store Connect API key for authenticating communication with Apple’s services. You can read more about generating an API key from Apple’s documentation page.

The following steps will allow you to configure the process successfully:

1. As you have already created and connected your .p8 file from the App Store Connect account as explained above under the Adding code signing certificate section, we can refer to the steps there for generating the api key and adding to Codemagic
2. After completing those steps, all you need is to use the reference name in codemagic.yaml:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    integrations:
      app_store_connect: <App Store Connect API key name>
{{< /highlight >}}

3. And add the publishing section in codemagic.yaml as shown in the ready-to-use content right at the top:


{{< highlight yaml "style=paraiso-dark">}}
  publishing:
      app_store_connect:
        # Use referenced App Store Connect API key to authenticate binary upload
        auth: integration 

        # Configuration related to TestFlight (optional)

        # Optional boolean, defaults to false. Whether or not to submit the uploaded
        # build to TestFlight beta review. Required for distributing to beta groups.
        # Note: This action is performed during post-processing.
        submit_to_testflight: true

        # Optional boolean, defaults to false. Set to true to automatically expire 
        # previous build in review or waiting for review in Testflight before
        # submitting a new build to beta review. Expired builds will no longer be available for testers.
        # Note: This action is performed during post-processing.
        expire_build_submitted_for_review: true

        # Specify the names of beta tester groups that will get access to the build 
        # once it has passed beta review.
        beta_groups: 
          - group name 1
          - group name 2
        
        # Configuration related to App Store (optional)

        # Optional boolean, defaults to false. Whether or not to submit the uploaded
        # build to App Store review. Note: This action is performed during post-processing.
        submit_to_app_store: true

        # Optional boolean, defaults to false. Set to true to cancel the previous 
        # submission (if applicable) when submitting a new build to App Store review.
        # This allows automatically submitting a new build for review if a previous submission exists.
        # Note: This action is performed during post-processing.
        cancel_previous_submissions: true
        
        # Optional, defaults to MANUAL. Supported values: MANUAL, AFTER_APPROVAL or SCHEDULED
        release_type: SCHEDULED

        # Optional. Timezone-aware ISO8601 timestamp with hour precision when scheduling
        # the release. This can be only used when release type is set to SCHEDULED.
        # It cannot be set to a date in the past.
        earliest_release_date: 2024-12-01T14:00:00+00:00 
        
        # Optional. The name of the person or entity that owns the exclusive rights
        # to your app, preceded by the year the rights were obtained.
        copyright: 2024 Nevercode Ltd
{{< /highlight >}}

With these, your app will be published to TestFlight or App Store Connect for production. All it takes is just specifying **true** or **false**.

## Publishing Android apps to Google Play Store

Like App Store Connect publishing, Codemagic builds and publishes your Android apps to Play Store. To achieve it, you need to follow the steps below:

1. To allow Codemagic to publish applications to Google Play, it is necessary to set up access using Google Play API. Visual explanation of how to create a service account json file and connect it with your Play Store app can be found [here](https://docs.codemagic.io/yaml-publishing/google-play/)
2. After creating the required JSON file, you can now configure Play Store publishing in **codemagic.yaml**. [Here](https://docs.codemagic.io/yaml-publishing/google-play/#configure-publishing-in-codemagicyaml) you can find on how to achieve it easily.


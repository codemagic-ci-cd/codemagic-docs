---
title: React Native apps
description: How to build a React Native app with codemagic.yaml
weight: 5
aliases:
  - /yaml/building-a-react-native-app
  - /getting-started/building-a-react-native-app
  - /yaml-basic-configuration/building-a-react-native-app
---

React Native is a cross-platform solution that allows you to build apps for both iOS and Android faster using a single language. Pairing it with Codemagic's CI/CD pipeline creates a powerful tool that automates all phases of mobile app development.



## Setting up a React Native project

If you do not have an existing React Native project or if you just want to quickly test Codemagic using a sample project, follow these steps to get started:


{{< tabpane >}}
{{< tab header="Clone a sample" >}}

{{<markdown>}}

For a quick start, you can clone the appropriate project from our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/react-native) to a version control platform of your choice and proceed with the next steps.

&nbsp;

{{</markdown>}}

{{< /tab >}}


{{< tab header="New Expo project" >}}
{{<markdown>}}
If you are new to mobile development, the easiest way to get started is with Expo. Expo is a set of tools built around React Native and, while it has many features, the most relevant feature for us right now is that it can get you writing a React Native app within minutes. You will only need a recent version of Node.js and a phone or emulator.

1. If necessary, install [Node 14 LTS](https://nodejs.org/en/download/) or greater.

2. Create a new project
{{< highlight Shell "style=rrt">}}
npx create-expo-app CodemagicSample
cd CodemagicSample
{{< /highlight >}}
    
3. Configure the Git repository for the app.
{{</markdown>}}
{{% /tab %}}

{{% tab header="New React Native CLI project" lang="en" %}}
If you are already familiar with mobile development, you may want to use React Native CLI. It requires Xcode or Android Studio to get started. The required steps are outlined at the [official React Native site](https://reactnative.dev/docs/environment-setup).
{{% /tab %}}
{{< /tabpane >}}


---

## Using Expo without ejecting

To run a build on CI/CD we need to have the `ios` and `android` project folders. If you can't or don’t want to permanently eject Expo from your app, then you can do it on the build server each time you run a build. Follow the steps below to get started. You can check the finished sample app in our [samples repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/react-native/expo-react-native-not-ejected/codemagic.yaml).

1. Clone your repository to a temporary new location or create a new branch. in order to eject Expo once and get the `android/app/build.gradle` file.
2. Eject Expo once by running the following command:
{{< highlight Shell "style=rrt">}}
expo eject
{{< /highlight >}}
3. Copy the `android/app/build.gradle` file from the ejected project and add it to your main repository. In our example, we create a `support-files` folder and store the `build.gradle` inside.
4. Whenever this guide calls for making changes to the `android/app/build.gradle`, apply these changes to the `support-files/build.gradle` file instead.
5. Follow the steps in other **Expo without ejecting** sections in this guide to install the expo cli tools on the VM, run the scripts to copy the `build.gradle` file to the correct location and use other tools to adjust iOS settings in the `info.plist` file.

---

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}

## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

{{< tabpane >}}

{{< tab header="Android" >}}
{{< include "/partials/quickstart/code-signing-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/quickstart/code-signing-ios.md" >}}
{{< /tab >}}

{{< /tabpane >}}



## Setting up the Android package name and iOS bundle identifier

Configure Android package name and iOS bundle identifier by adding the corresponding variables in the `codemagic.yaml` and editing the `app.json` files.

{{< tabpane >}}
{{< tab header="Android" >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    # ....
    environment:
      groups:
        # ...
      vars:
        PACKAGE_NAME: "io.codemagic.sample.reactnative"
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-ios:
    # ....
    environment:
      groups:
        # ...
      vars:
        BUNDLE_ID: "io.codemagic.sample.reactnative"
{{< /highlight >}}

{{< /tab >}}
{{< /tabpane >}}


Example of minimal `app.json` file. Add the `android` and/or `ios` keys:
{{< highlight json "style=paraiso-dark">}}
{
  "expo": {
    "name": "codemagicSample",
    "slug": "codemagicSample",
    "version": "1.0.0",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "io.codemagic.sample.reactnative"
    },
    "android": {
      "package": "io.codemagic.sample.reactnative"
    }
  }
}
{{< /highlight >}}


## Configure scripts to build the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).


{{< tabpane >}}
{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
scripts:
    # ....
  - name: Install npm dependencies
    script: | 
      npm install
  - name: Set Android SDK location
    script: | 
      echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
  - name: Build Android release
    script: | 
      cd android
      ./gradlew bundleRelease

artifacts:
  - android/app/build/outputs/**/*.aab
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
react-native-ios:
  environment:
    groups:
      # ...
    vars:
      BUNDLE_ID: "io.codemagic.sample.reactnative"
      XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Name of your Xcode workspace
      XCODE_SCHEME: "CodemagicSample" # <-- Name of your Xcode scheme
scripts:
  # ...
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
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}


#### Using Expo without ejecting
{{< tabpane >}}

{{< tab header="Android" >}}
{{<markdown>}}

Add the following scripts just after the **Install npm dependencies**

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Install Expo CLI and eject
    script: | 
      npm install -g expo-cli
      expo eject
  - name: Set up app/build.gradle
    script: |
   mv ./support-files/build.gradle android/app
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
Add the following scripts at the start of the scripts section


{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Install Expo CLI and eject
    script: | 
      yarn install
      yarn global add expo-cli
      expo eject
  - name: Set Info.plist values
    script: | 
      PLIST=$CM_BUILD_DIR/$XCODE_SCHEME/Info.plist
      PLIST_BUDDY=/usr/libexec/PlistBuddy
      $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST
  - name: Install CocoaPods dependencies
    script: |
    cd ios && pod install
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


## Build versioning

If you are going to publish your app to App Store Connect or Google Play, each uploaded artifact must have a new version satisfying each app store’s requirements. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).


{{< tabpane >}}

{{< tab header="Android" >}}
{{< include "/partials/quickstart/build-versioning-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/quickstart/build-versioning-ios.md" >}}
{{< /tab >}}

{{< /tabpane >}}

## Publishing

{{< include "/partials/publishing-android-ios.md" >}}


## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the app in the Codemagic UI and start the build to see it in action.


Your final `codemagic.yaml` file should look something like this:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    name: React Native Android
    max_build_duration: 120
    instance_type: mac_mini_m1
    environment:
      android_signing:
        - keystore_reference
      groups:
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.sample.reactnative"
    scripts:
      - name: Set Android SDK location
        script: | 
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      - name: Install npm dependencies
        script: | 
          npm install
      - name: Install Expo CLI and eject
        script: | 
          npm install -g expo-cli
          expo eject
      - name: Set up app/build.gradle
        script: | 
          mv ./support-files/build.gradle android/app
      - name: Build Android release
        script: | 
          LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
          if [ -z $LATEST_GOOGLE_PLAY_BUILD_NUMBER ]; then
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
          success: true
          failure: false
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true


  react-native-ios:
    name: React Native iOS
    max_build_duration: 120
    instance_type: mac_mini_m1
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.sample.reactnative
      vars:
        BUNDLE_ID: "io.codemagic.sample.reactnative"
        XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Put the name of your Xcode workspace here
        XCODE_SCHEME: "CodemagicSample" # <-- Put the name of your Xcode scheme here
        APP_STORE_APPLE_ID: 1555555551
    scripts:
      - name: Install Expo CLI and eject
        script: | 
          yarn install
          yarn global add expo-cli
          expo eject
      - name: Set Info.plist values
        script: | 
          PLIST=$CM_BUILD_DIR/$XCODE_SCHEME/Info.plist
          PLIST_BUDDY=/usr/libexec/PlistBuddy
          $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST
      - name: Install CocoaPods dependencies
        script: | 
          cd ios && pod install
      - name: Set up provisioning profiles settings on Xcode project
        script: xcode-project use-profiles
      - name: Increment build number
        script: | 
          cd $CM_BUILD_DIR/ios
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "$APP_STORE_APPLE_ID")
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

        # Configuration related to TestFlight (optional)
        # Note: This action is performed during post-processing.
        submit_to_testflight: true
        beta_groups: # Specify the names of beta tester groups that will get access to the build once it has passed beta review.
          - group name 1
          - group name 2

        # Configuration related to App Store (optional)
        # Note: This action is performed during post-processing.
        submit_to_app_store: false
{{< /highlight >}}


## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}



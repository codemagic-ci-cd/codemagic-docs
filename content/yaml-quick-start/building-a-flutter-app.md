---
title: Flutter apps
description: How to build a Flutter app with codemagic.yaml
weight: 4
aliases:
  - '../yaml/building-a-flutter-app'
  - '/getting-started/building-a-flutter-app'
  - /yaml-basic-configuration/building-a-flutter-app
startLineBreak: true
---

This guide will illustrate all of the necessary steps to successfully build and publish a Flutter app with Codemagic. It will cover the basic steps such as build versioning, code signing and publishing.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/flutter).

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
`codemagic.yaml` is a highly customizable configuration file that you can use to build, test and publish Flutter apps, widgets, and Flutter or Dart packages. The Workflow Editor is a quick way to get started building standard Flutter applications.

You can simultaneously set up workflows both in `codemagic.yaml` and the Workflow Editor. However, when a `codemagic.yaml` is detected in the repository, it is automatically used for configuring builds that are triggered in response to the events defined in the file and any configuration in the Flutter workflow editor is ignored.

{{<notebox>}}
**Note:** For documentation on building Flutter projects using the workflow editor, please refer to [**Building Flutter apps via the workflow editor**](../flutter-configuration/flutter-projects).
{{</notebox>}}

{{< include "/partials/quickstart/create-yaml-intro.md" >}}


## Setting the Flutter version

When building a Flutter application with Codemagic, you can customize your build environment by configuring various settings. One such setting is the option to choose the Flutter version or channel for the build process. Codemagic provides several options: defining a specific channel or version, or alternatively, you can leverage [Flutter Version Management (FVM)](https://fvm.app/docs/) for version management.

{{< tabpane >}}

{{< tab header="Specific Flutter channel or version" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
    sample-workflow:
        environment:
            flutter: stable
{{< /highlight >}}
{{<notebox>}}
**Note**: The possible versions are `default`, `stable`, `beta`, and `master`, along with any specific versions, e.g., `3.7.6`.
{{</notebox>}}
{{< /tab >}}

{{< tab header="Flutter Version Management (FVM)" >}}
{{<markdown>}}
If you wish to use Flutter Version Management (FVM) in your Codemagic project, you must define the flutter version as `fvm` under the environment settings in your workflow.
{{</markdown>}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
    sample-workflow:
        environment:
            flutter: fvm
{{< /highlight >}}
{{<notebox>}}
**Note**: This automatically sets the Flutter version from your project's `fvm_config.json` file, located at the root of your project in the `.fvm` directory. If this file does not exist, the build will fail.
{{</notebox>}}
<br>
{{<markdown>}}
Moreover, when using FVM, Codemagic allows you to set the specific FVM flavor in your `codemagic.yaml` to provide all the needed flexibility when managing the Flutter version.
{{</markdown>}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
    sample-workflow:
        environment:
            flutter:
                version: fvm
                flavor: dev
{{< /highlight >}}
{{<notebox>}}
**Note**: If the requested flavor does not exist in the config file, the build will fail.
{{</notebox>}}
{{< /tab >}}

{{< /tabpane >}}

## Code signing

All applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed.

{{< tabpane >}}

{{< tab header="Android" >}}
{{< include "/partials/quickstart/code-signing-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/quickstart/code-signing-ios.md" >}}
{{< /tab >}}

{{< tab header="macOS" >}}
{{< include "/partials/quickstart/code-signing-macos.md" >}}
{{< /tab >}}

{{< tab header="Windows" >}}
{{<markdown>}}
Normally, you would need to locally sign your app if you are going to publish it to the **Microsoft Store**. Since this is not possible when using cloud CI/CD, you need to create an **MSIX package** and publish through **Microsoft Partner Center**

1. Follow [this guide](../knowledge-others/partner-center-authentication) to setup **Microsoft Partner Center** authentication and create a new **Client secret**.
2. Open your Codemagic app settings, and go to the **Environment variables** tab.
3. Enter the desired **_Variable name_**, e.g. `CLIENT_SECRET`.
4. Enter the API key string as **_Variable value_**.
5. Enter the variable group name, e.g. **_windows_credentials_**. Click the button to create the group.
6. Make sure the **Secure** option is selected.
7. Click the **Add** button to add the variable.
8. Repeat the steps to also add `STORE_ID`, `TENANT_ID` and `CLIENT_ID` variables.
9. Add the **windows_credentials** variable group to the `codemagic.yaml`:
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - windows_credentials
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}


## Configure scripts to build the app
Add the following scripts to your `codemagic.yaml` file in order to prepare the build environment and start the actual build process.
In this step you can also define the build artifacts you are interested in. These files will be available for download when the build finishes. For more information about artifacts, see [here](../yaml/yaml-getting-started/#artifacts).


{{< tabpane >}}
{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set up local.properties
      script: | 
        echo "flutter.sdk=$HOME/programs/flutter" > "$CM_BUILD_DIR/android/local.properties"
    - name: Get Flutter packages
      script: | 
        flutter packages pub get
    - name: Build AAB with Flutter
      script: | 
        flutter build appbundle --release
    artifacts:
      - build/**/outputs/**/*.aab
      - build/**/outputs/**/mapping.txt
      - flutter_drive.log
{{< /highlight >}}

{{<notebox>}}
**Note**: To build an `.apk` version for debug, replace the build command with:
{{< highlight bash>}}
  flutter build apk --debug
{{< /highlight >}}
{{</notebox>}}
<br>
{{<notebox>}}
**Note**: To build a universal `.apk` from the existing `.aab` bundle with user-specified keys, configure the environment variables as explained [here](../yaml-code-signing/alternative-code-signing-methods) and add the following script after the build step:
{{< highlight yaml>}}
  scripts:
    - name: Build universal apk
      script: | 
        android-app-bundle build-universal-apk \
          --bundle 'project_directory/build/**/outputs/**/*.aab' \
          --ks /tmp/keystore.keystore \
          --ks-pass $CM_KEYSTORE_PASSWORD \
          --ks-key-alias $CM_KEY_ALIAS \
          --key-pass $CM_KEY_PASSWORD
{{< /highlight >}}

Please make sure to wrap the `--bundle` pattern in single quotes. If the `--bundle` option is not specified, default glob pattern `**/*.aab` will be used.
{{</notebox>}}

{{< /tab >}}


{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set up code signing settings on Xcode project
      script: | 
        xcode-project use-profiles
    - name: Get Flutter packages
      script: | 
        flutter packages pub get
    - name: Install pods
      script: | 
        find . -name "Podfile" -execdir pod install \;
    - name: Flutter build ipa
      script: | 
        flutter build ipa --release \
          --build-name=1.0.0 \
          --export-options-plist=/Users/builder/export_options.plist
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - flutter_drive.log
{{< /highlight >}}

{{<notebox>}}
**Note**: To build an unsigned `.app` version for debug, replace the build command with:
{{< highlight bash>}}
  flutter build ios --debug --no-codesign
{{< /highlight >}}
{{</notebox>}}

{{< /tab >}}


{{< tab header="macOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    
    # ... code signing scripts

    - name: Get Flutter packages
      script: | 
          flutter packages pub get
    - name: Install pods
      script: | 
        find . -name "Podfile" -execdir pod install \;
    - name: Build Flutter macOS
      script: | 
          flutter config --enable-macos-desktop && \
          flutter build macos --release
    
    # ... create package scripts
        
    artifacts:
      - build/macos/**/*.pkg
{{< /highlight >}}
{{< /tab >}}


{{< tab header="Windows" >}}
{{<markdown>}}
#### Building an unpackaged Windows executable

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Get Flutter packages
      script: | 
          flutter packages pub get
    - name: Build Flutter Windows
      script: | 
        flutter config --enable-windows-desktop
        flutter build windows --release
        cd build/windows/runner/Release
        7z a -r ../release.zip ./*
    artifacts:
      - build/windows/runner/*.zip
{{< /highlight >}}

#### Creating an MSIX package for publishing to Microsoft Store
Codemagic uses the [Flutter msix package](https://pub.dev/packages/msix) for packaging the application. For publishing to the Microsoft Store, it is necessary to define certain arguments during packaging.

To pass these arguments to the packaging tool, either add the parameters to the packaging command in `codemagic.yaml` or add the package to your project and [configure](https://pub.dev/packages/msix#gear-configuration-optional) the arguments inside the `pubspec.yaml` file.

To generate MSIX, add the package under `dev_dependencies` in your `pubspec.yaml` file:
{{< highlight yaml "style=paraiso-dark">}}
  dev_dependencies:
    msix: ^2.6.5
{{< /highlight >}}

Also add the following configuration at the end of the `pubspec.yaml` file:
{{< highlight yaml "style=paraiso-dark">}}
  msix_config:
    display_name: <AppName>
    publisher_display_name: <PublisherName>
    identity_name: <PublisherName.AppName>
    publisher: <PublisherID>
    msix_version: 1.0.0.0
    logo_path: ./logo/<file_name.png>
    store: true
{{< /highlight >}}

The required values are:
 - `display_name`: The name of your app that will be displayed to users.
 - `publisher_display_name`: The name of the publisher to be displayed to users (can be an individual’s name or a company’s name).
 - `identity_name`: The unique identifier of the Windows app.
 - `publisher`: The Publisher ID present inside your Microsoft Partner Center app.
 - `msix_version`: Specifies the version of the app’s build. Uses the format “Major.Minor.Build.Revision”, where “Major” cannot be “0”.
 - `logo_path`: The relative path of the logo file (optional). If not provided, the default Flutter logo is used.
 - `store`: Setting this to true generates an MSIX package distributable using Microsoft Partner Center

When defining the arguments inside codemagic.yaml, the necessary flags to add to the `msix:create` command are `--store`, `--display-name`, `--publisher-display-name`, `--publisher` and `--version`.

The values for `--display-name`, `--publisher-display-name` and `--publisher` can be found when when logging into [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/home) and navigating to **Apps and games > Your application > Product Identity**.

The argument `--display-name` should be set to match the value of `Package/Identity/Name`, the argument `--publisher` should be set to match the value of `Package/Identity/Publisher` and the argument `--publisher-display-name` should be set to match the value of `Package/Properties/PublisherDisplayName`.

Check out how to version your package in the [Microsoft documentation](https://docs.microsoft.com/en-us/windows/uwp/publish/package-version-numbering). Note that per Microsoft Store requirements applications are not allowed to have a version with a revision number (last digit of the version) other than zero.

Add the following script after the **Build Flutter Windows** step:
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build Flutter Windows
      # ....
    - name: Create package
      script: | 
        # if you did not add the msix pub package to your project:
        flutter pub add msix  
        #
        # if you have specified configuration in pubspec.yaml:
        flutter pub run msix:create
        #
        # if you did not modify `pubspec.yaml`:
        #flutter pub run msix:create --store \
        #  --publisher-display-name=MyName \
        #  --display-name=MyAppName \
        #  --publisher=CN=xx-yy-zz \
        #  --identity-name=com.flutter.MyApp \
        #  --version=1.0.2.0
    artifacts:
      - build/windows/**/*.msix
{{< /highlight >}}

For all the possible flags for the `msix:create` command, check the [pub documentation](https://pub.dev/packages/msix#clipboard-available-configuration-fields). Note that when configuring the flags both in `codemagic.yaml` and `pubspec.yaml`, the ones configured in `codemagic.yaml` take precedence.

{{</markdown>}}
{{< /tab >}}


{{< tab header="web" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build web
      script: | 
        flutter config --enable-web
        flutter build web --release
        cd build/web
        7z a -r ../web.zip ./*
  artifacts:
    - build/*.zip
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}


## Build versioning

If you are going to publish your app to App Store Connect or Google Play, each uploaded artifact must have a new version satisfying each app store’s requirements. Codemagic allows you to easily automate this process and increment the version numbers for each build. For more information and details, see [here](../configuration/build-versioning).


{{< tabpane >}}
{{< tab header="Android" >}}
{{<markdown>}}
One very useful method of calculating the code version is to use Codemagic command line tools to get the latest build number from Google Play and increment it by one.

You can find the full sample project with the instructions on alternative ways to perform Android build versioning [in our repository](https://github.com/codemagic-ci-cd/android-versioning-example).


The prerequisite is a valid **Google Cloud Service Account**. Please follow these steps:
1. Go to [this guide](../knowledge-base/google-services-authentication) and complete the steps in the **Google Play** section.
2. Skip to the **Creating a service account** section in the same guide and complete those steps also.
3. You now have a `JSON` file with the credentials.
4. Open Codemagic UI and create a new Environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`.
5. Paste the content of the downloaded `JSON` file in the **_Value_** field, set the group name (e.g. **google_play**) and make sure the **Secure** option is checked.
6. Add the **google_play** variable group to the `codemagic.yaml` as well as define the `PACKAGE_NAME` and the `GOOGLE_PLAY_TRACK`:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow-id:
    # ....
    environment:
      groups:
        - keystore_credentials
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.fluttersample"
        GOOGLE_PLAY_TRACK: alpha
{{< /highlight >}}

7. Modify the build script to fetch the latest build number from Google Play, increment it and pass it as command line argument to the build command
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build AAB with Flutter
      script: | 
        BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks="$GOOGLE_PLAY_TRACK") + 1))      
        flutter build appbundle --release \
          --build-name=1.0.$BUILD_NUMBER \
          --build-number=$BUILD_NUMBER
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}


{{< tab header="iOS" >}}
{{<markdown>}}
In order to get the latest build number from App Store or TestFlight, you will need the App Store credentials as well as the **Application Apple ID**. This is an automatically generated ID assigned to your app and it can be found under **General > App Information > Apple ID** under your application in App Store Connect.

1. Add the **Application Apple ID** to the `codemagic.yaml` as a variable
2. Add the script to get the latest build number using `app-store-connect`, increment it and pass it as command line argument to the build command:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    integrations:
      app_store_connect: <App Store Connect API key name>
    environment:
      vars:
        APP_ID: 1555555551
    scripts:
      - name: Flutter build ipa
        script: | 
          BUILD_NUMBER=$(($(app-store-connect get-latest-app-store-build-number "$APP_ID") + 1))
          flutter build ipa --release \
            --build-name=1.0.$BUILD_NUMBER \
            --build-number=$BUILD_NUMBER
{{< /highlight >}}
{{</markdown>}}

{{< /tab >}}

{{< /tabpane >}}


## Publishing

{{< include "/partials/publishing-android-ios.md" >}}


## Conclusion
Having followed all of the above steps, you now have a working `codemagic.yaml` file that allows you to build, code sign, automatically version and publish your project using Codemagic CI/CD.
Save your work, commit the changes to the repository, open the app in the Codemagic UI and start the build to see it in action.

Your final `codemagic.yaml` file should look something like this:

{{< tabpane >}}

{{< tab header="Android" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    name: Android Workflow
    max_build_duration: 120
    environment:
      android_signing:
        - keystore_reference
      groups:
        - google_play
      vars:
        PACKAGE_NAME: "io.codemagic.fluttersample"
        GOOGLE_PLAY_TRACK: alpha
      flutter: stable
    scripts:
      - name: Set up local.properties
        script: | 
          echo "flutter.sdk=$HOME/programs/flutter" > "$CM_BUILD_DIR/android/local.properties"
      - name: Get Flutter packages
        script: | 
          flutter packages pub get
      - name: Flutter analyze
        script: | 
          flutter analyze
      - name: Flutter unit tests
        script: | 
          flutter test
        ignore_failure: true
      - name: Build AAB with Flutter
        script: | 
          BUILD_NUMBER=$(($(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks="$GOOGLE_PLAY_TRACK") + 1))      
          flutter build appbundle --release \
            --build-name=1.0.$BUILD_NUMBER \
            --build-number=$BUILD_NUMBER
    artifacts:
      - build/**/outputs/**/*.aab
      - build/**/outputs/**/mapping.txt
      - flutter_drive.log
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
        track: $GOOGLE_PLAY_TRACK
        submit_as_draft: true
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    max_build_duration: 120
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: io.codemagic.fluttersample
      vars:
        APP_ID: 1555555551
      flutter: stable
    scripts:
      - name: Set up code signing settings on Xcode project
        script: | 
          xcode-project use-profiles
      - name: Get Flutter packages
        script: | 
          flutter packages pub get
      - name: Install pods
        script: | 
          find . -name "Podfile" -execdir pod install \;
      - name: Flutter analyze
        script: | 
          flutter analyze
      - name: Flutter unit tests
        script: | 
          flutter test
        ignore_failure: true
      - name: Flutter build ipa
        script: | 
          flutter build ipa --release \
            --build-name=1.0.0 \
            --build-number=$(($(app-store-connect get-latest-app-store-build-number "$APP_ID") + 1)) \
            --export-options-plist=/Users/builder/export_options.plist
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - flutter_drive.log
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
{{< /tab >}}

{{< tab header="MacOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  macos-workflow:
    name: macOS Workflow
    max_build_duration: 120
    environment:
      groups:
        - appstore_credentials
      flutter: stable
      xcode: latest
      cocoapods: default
    scripts:
      - name: Set up keychain to be used for code signing
        script: | 
          keychain initialize
      - name: Fetch signing files
        script: | 
          app-store-connect fetch-signing-files "$BUNDLE_ID" \
            --platform MAC_OS \
            --type MAC_APP_STORE \
            --create
      - name: Fetch Mac Installer Distribution certificates
        script: | 
           # You may omit the first command if you already have
           # the installer certificate and provided the corresponding private key
            app-store-connect list-certificates --type MAC_INSTALLER_DISTRIBUTION --save || \
            app-store-connect create-certificate --type MAC_INSTALLER_DISTRIBUTION --save
            
      - name: Set up signing certificate
        script: keychain add-certificates
      - name: Set up code signing settings on Xcode project
        script: | 
          xcode-project use-profiles
      - name: Get Flutter packages
        script: | 
          flutter packages pub get
      - name: Install pods
        script: | 
          find . -name "Podfile" -execdir pod install \;
      - name: Flutter analyze
        script: | 
          flutter analyze
      - name: Flutter unit tests
        script: | 
          flutter test
        ignore_failure: true
      - name: Build Flutter macOS
        script: | 
          flutter config --enable-macos-desktop && \
          flutter build macos --release \
            --build-name=1.0.$PROJECT_BUILD_NUMBER \
            --build-number=$PROJECT_BUILD_NUMBER
      - name: Package application
        script: | 
          set -x
    
          # Command to find the path to your generated app, may be different
          APP_NAME=$(find $(pwd) -name "*.app")  
          cd $(dirname "$APP_NAME")
    
          # Create and unsigned package
          PACKAGE_NAME=$(basename "$APP_NAME" .app).pkg
          xcrun productbuild --component "$APP_NAME" /Applications/ unsigned.pkg

          # Find the installer certificate common name in keychain
          INSTALLER_CERT_NAME=$(keychain list-certificates \
            | jq '.[]
            | select(.common_name
            | contains("Mac Developer Installer"))
            | .common_name' \
            | xargs)
      
          # Sign the package
          xcrun productsign --sign "$INSTALLER_CERT_NAME" unsigned.pkg "$PACKAGE_NAME" 
    
          rm -f unsigned.pkg 
    artifacts:
      - build/macos/**/*.pkg
    publishing:
      email:
        recipients:
          - user_1@example.com
          - user_2@example.com
        notify:
          success: true
          failure: false
      app_store_connect:
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID

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
{{< /tab >}}


{{< tab header="Windows" >}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  # This workflow is for a normal windows build consisting of the `.exe` file
  windows-workflow:
    name: Windows workflow
    instance_type: windows_x2
    max_build_duration: 60
    environment:
      flutter: master
    cache:
      cache_paths:
        - ~/.pub-cache
    scripts:
      - name: Get Flutter packages
        script: flutter packages pub get
      - name: Configure for Windows
        script: flutter config --enable-windows-desktop
      - name: Build Windows
        script: flutter build windows
      - name: Export bundle
        script: | 
          cd build/windows/runner/Release
          7z a -r ../release.zip ./*
    artifacts:
      - build/windows/runner/*.zip
    publishing:
      email:
        recipients:
          - email@example.com
  
  # This workflow is for a MSIX package build that can be 
  # published to Microsoft Store using Partner Center
  windows-release-workflow:
    name: Windows release workflow
    instance_type: windows_x2
    max_build_duration: 60
    environment:
      groups:
        - windows-signing
      flutter: master
    cache:
      cache_paths:
        - ~/.pub-cache
    scripts:
      - name: Get Flutter packages
        script: flutter packages pub get
      - name: Configure for Windows
        script: flutter config --enable-windows-desktop
      - name: Build Windows
        script: flutter build windows
      - name: Package Windows
        script: flutter pub run msix:create
        
        # If you don't have the configurations created inside pubspec.yaml, then you need 
        # to pass the configurations as parameters. Use the following script in that case:
        # ----------------------------------------------------------------------------------
        # - name: Package Windows
        #   script: |
        #     flutter pub add msix
        #     flutter pub run msix:create --display-name='<AppName>' \
        #       --publisher-display-name='<PublisherName>' \
        #       --publisher='<PublisherID>' \
        #       --identity-name='<PublisherName.AppName>' \
        #       --version=1.0.0.0 \
        #       --logo-path='./logo/<file_name.png>' \
        #       --store=true
        # ----------------------------------------------------------------------------------
    artifacts:
      - build/windows/**/*.msix
    publishing:
      partner_center:
        store_id: $STORE_ID
        tenant_id: $TENANT_ID
        client_id: $CLIENT_ID
        client_secret: $CLIENT_SECRET
      email:
        recipients:
          - email@example.com
{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}




## Next steps
{{< include "/partials/quickstart/next-steps.md" >}}

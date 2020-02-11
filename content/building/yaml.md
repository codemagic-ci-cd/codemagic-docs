---
title: Configuration as code (YAML)
description: Customize the build and configure all your workflows in a single file.
weight: 1
---

`codemagic.yaml` is an advanced option for customizing the build and configuring all your workflows in a single file. The file can be committed to version control, and when detected in repository, will be used to configure the build instead of the settings in the UI.

{{<notebox>}}

**Limitations**

The YAML feature is currently in *beta* and has the following limitations:

* Exporting configuration from UI is supported for Flutter-based Android, iOS and web apps.
* The exported configuration is not identical to the settings in UI and lacks the configuration for some features, such as **Stop build if tests fail** and publishing to Codemagic Static Pages.
* YAML configuration is not yet available for apps from custom sources.

{{</notebox>}}

## Exporting current configuration as YAML

You can get started with YAML easily if you have an existing project set up on Codemagic. 

1. Navigate to your app settings.
2. Expand the **Advanced configuration (beta)** tab.
3. Click **Download configuration** and save the generated `codemagic.yaml` file to a suitable location. 

Note that in order to use the file for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the project. 

## Encrypting sensitive data

During the export, Codemagic automatically encrypts the secret environment variables in your build configuration. 

If you wish to add new environment variables to the YAML file, you can encrypt them via Codemagic UI. 

1. In your app settings > Advanced configuration (beta), click **Encrypt environment variables**.
2. Paste the value of the variable in the field or upload it as a file.
3. Click **Encrypt**. 
4. Copy the encrypted value and paste it to the configuration file.

An example of an encrypted value:

```
Encrypted(Z0FBQUFBQmRyY1FLWXIwVEhqdWphdjRhQ0xubkdoOGJ2bThkNmh4YmdXbFB3S2wyNTN2OERoV3c0YWU0OVBERG42d3Rfc2N0blNDX3FfblZxbUc4d2pWUHJBSVppbXNXNC04U1VqcGlnajZ2VnJVMVFWc3lZZ289)
```

{{<notebox>}}Note that when the value is uploaded as a file, it is encoded to `base64`.{{</notebox>}}

Writing the base64-encoded environment variable to a file can be done like this:

```
scripts:
  - echo $MY_FILE | base64 --decode > my-file.json
```

## Building with YAML

When detected in repository, `codemagic.yaml` is automatically used for configuring builds that are triggered in response to the events defined in the file. Any configuration in the UI is ignored.

You can also use `codemagic.yaml` for manual builds.

1. In your app settings, click **Start new build**. 
2. In the **Specify build configuration** popup, select a **branch**.
3. If a `codemagic.yaml` file is found in that branch, you can click **Select workflow from codemagic.yaml**.
4. Then select the YAML **workflow**.
5. Finally, click **Start new build** to build the workflow.

## Template

This is the skeleton structure of `codemagic.yaml`.

    workflows:
      my-workflow:
        name: My workflow name
        environment:
          vars:
            PUBLIC_ENV_VAR: "value here"
          flutter: stable
          xcode: latest
        cache:
          cache_paths:
            - ~/.pub-cache
        triggering:
          events:
            - push
          branch_patterns:
            - pattern: '*'
              include: true
              source: true
        scripts:
          - ...
        artifacts:
          - build/**/outputs/**/*.aab
        publishing:
          email:
            recipients:
              - name@example.com

### Workflows

You can use `codemagic.yaml` to define several workflows for building a project. Each workflow describes the entire build pipeline from triggers to publishing.

    workflows:
      my-workflow:                # workflow ID
        name: My workflow name    # workflow name displayed in UI
        environment:
        cache:
        triggering:
        branch_patterns:
        scripts:
        artifacts:
        publishing:

The main sections in each workflow are described below.

### Environment

`environment:` Contains your environment variables and enables to specify the version of Flutter used for building. This is also where you can add credentials and API keys required for code signing. Make sure to [encrypt the values](#encrypting-sensitive-data) of variables that hold sensitive data. 

    environment:
      vars:             # Define your environment variables here
        PUBLIC_ENV_VAR: "value here"
        SECRET_ENV_VAR: Encrypted(...)
        
        # Android code signing
        CM_KEYSTORE: Encrypted(...)
        CM_KEYSTORE_PASSWORD: Encrypted(...)
        CM_KEY_ALIAS_PASSWORD: Encrypted(...)
        CM_KEY_ALIAS_USERNAME: Encrypted(...)
        
        # iOS automatic code signing
        APP_STORE_CONNECT_ISSUER_ID: Encrypted(...)
        APP_STORE_CONNECT_KEY_IDENTIFIER: Encrypted(...)
        APP_STORE_CONNECT_PRIVATE_KEY: Encrypted(...)
        CERTIFICATE_PRIVATE_KEY: Encrypted(...)

        # iOS manual code signing
        CM_CERTIFICATE: Encrypted(...)
        CM_CERTIFICATE_PASSWORD: Encrypted(...)
        CM_PROVISIONING_PROFILE: Encrypted(...)

      flutter: stable   # Define the channel name or version (e.g. v1.13.4)
      xcode: latest     # Define latest, edge or version (e.g. 11.2)

#### Setting up code signing for iOS

In order to use **automatic code signing** and have Codemagic manage signing certificates and provisioning profiles on your behalf, you need to configure API access to App Store Connect and define the environment variables listed below.

* `APP_STORE_CONNECT_PRIVATE_KEY`

  It is recommended to create a dedicated App Store Connect API key for Codemagic in [App Store Connect](https://appstoreconnect.apple.com/access/api).

  1. Log in to App Store Connect and navigate to **Users and Access > Keys**.
  2. Click on the '+' sign to generate a new API key. 
  3. Enter the name for the key and select an access level (`Admin` or `Developer`).
  4. Click **Generate**.
  5. As soon as the key is generated, you can see it added in the list of active keys. Click **Download API Key** to save the private key. Note that the key can only be downloaded once.

* `APP_STORE_CONNECT_KEY_IDENTIFIER`

  In **App Store Connect > Users and Access > Keys**, this is the **Key ID** of the key.

* `APP_STORE_CONNECT_ISSUER_ID`

  In **App Store Connect > Users and Access > Keys**, this is the **Issuer ID** displayed above the table of active keys.

* `CERTIFICATE_PRIVATE_KEY`

  A RSA 2048 bit private key to be included in the signing certificate. Read more about it [here](https://help.apple.com/xcode/mac/current/#/dev1c7c2c67d).

{{<notebox>}}
Alternatively, each property can be specified in the [scripts](#scripts) section as a command argument to programs with dedicated flags. See the details [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch%E2%80%91signing%E2%80%91files.md#--issuer-idissuer_id). In that case, the environment variables will be fallbacks for missing values in scripts.
{{</notebox>}}

In order to use **manual code signing**, [encrypt](https://docs.codemagic.io/building/yaml/#encrypting-sensitive-data) your signing certificate, the certificate password (if the certificate is password-protected) and the provisioning profile, and set the encrypted values to the following environment variables:

    CM_CERTIFICATE: Encrypted(...)
    CM_CERTIFICATE_PASSWORD: Encrypted(...)
    CM_PROVISIONING_PROFILE: Encrypted(...)

### Cache

`cache:` Enables to define the paths to be cached and stored on Codemagic. See the recommended paths for [dependency caching](./dependency-caching).

    cache:
      cache_paths:
        - ~/.pub-cache
        - ...

### Triggering

`triggering:` Defines the events for automatic build triggering and the watched branches. If no events are defined, you can start builds only manually. 

A branch pattern can match the name of a particular branch, or you can use wildcard symbols to create a pattern that matches several branches. Note that for **pull request builds**, it is required to specify whether the watched branch is the source or the target of pull request.

    triggering:
      events:                # List the events that trigger builds
        - push
        - pull_request
        - tag
      branch_patterns:       # Include or exclude watched branches
        - pattern: '*'
          include: true
          source: true
        - pattern: excluded-target
          include: false
          source: false
        - pattern: included-source
          include: true
          source: true

### Scripts

`scripts:` Contains the scripts and commands to be run during the build. This is where you can specify the commands to test, build and code sign your project. 

#### Building for Android

Below is an example of building a Flutter app for Android.

    scripts:
      - |
        # set up debug key.properties
        keytool -genkeypair \
          -alias androiddebugkey \
          -keypass android \
          -keystore ~/.android/debug.keystore \
          -storepass android \
          -dname 'CN=Android Debug,O=Android,C=US' \
          -keyalg 'RSA' \
          -keysize 2048 \
          -validity 10000
      - |
        # set up local properties
        echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
      - flutter packages pub get
      - flutter test
      - flutter build apk --release

**Note on building Android app bundles**

If your app settings in Codemagic have building Android app bundles enabled, we will automatically include a script for generating a signed `app-universal.apk` during the YAML export. If you're creating a YAML file from a scratch, add the script below to receive this file:

    # generate signed universal apk with user specified keys
    universal-apk generate \
          --ks /tmp/keystore.keystore \
          --ks-pass $CM_KEYSTORE_PASSWORD \
          --ks-key-alias $CM_KEY_ALIAS_USERNAME \
          --key-pass $CM_KEY_ALIAS_PASSWORD \
          --pattern 'build/**/outputs/**/*.aab'
  
#### Building for iOS

{{<notebox>}}
Codemagic uses the [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md) utility for generating and managing certificates and provisioning profiles and performing code signing.
{{</notebox>}}

Below is an example of building a Flutter app for iOS with automatic code signing. 

    scripts:
          - flutter packages pub get
          - flutter analyze
          - flutter test
          - find . -name "Podfile" -execdir pod install \;
          - keychain initialize
          - app-store-connect fetch-signing-files "io.codemagic.app" \  # Fetch signing files for specified bundle ID
                --type IOS_APP_DEVELOPMENT \  # Specify provisioning profile type*
                --create  # Allow creating resources if existing are not found.
          - keychain add-certificates
          - flutter build ios --debug --flavor dev --no-codesign
          - xcode-project use-profiles
          - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner

* The available provisioning profile types are described [here](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch%E2%80%91signing%E2%80%91files.md#--typeios_app_adhoc--ios_app_development--ios_app_inhouse--ios_app_store--mac_app_development--mac_app_direct--mac_app_store--tvos_app_adhoc--tvos_app_development--tvos_app_inhouse--tvos_app_store).

Below is an example of building a Flutter app for iOS with manual code signing.

    scripts:
      - flutter packages pub get
      - flutter analyze
      - flutter test
      - find . -name "Podfile" -execdir pod install \;
      - keychain initialize
      - |
        # set up provisioning profiles
        PROFILES_HOME="$HOME/Library/MobileDevice/Provisioning Profiles"
        mkdir -p "$PROFILES_HOME"
        PROFILE_PATH="$(mktemp "$PROFILES_HOME"/$(uuidgen).mobileprovision)"
        echo ${CM_PROVISIONING_PROFILE} | base64 --decode > $PROFILE_PATH
        echo "Saved provisioning profile $PROFILE_PATH"
      - |
        # set up signing certificate
        echo $CM_CERTIFICATE | base64 --decode > /tmp/certificate.p12

        # when using a password-protected certificate
        keychain add-certificates --certificate /tmp/certificate.p12 --certificate-password $CM_CERTIFICATE_PASSWORD
        # when using a certificate that is not password-protected
        keychain add-certificates --certificate /tmp/certificate.p12

      - flutter build ios --debug --flavor dev --no-codesign
      - xcode-project use-profiles
      - xcode-project build-ipa --workspace ios/Runner.xcworkspace --scheme Runner

#### Running custom scripts

You can run scripts in languages other than shell (`sh`) by defining the languge with a shebang line or by launching a script file present in your repository.

For example, you can write a build script with Dart like this:

    scripts:
        - |
          #!/usr/local/bin/dart

          void main() {
            print('Hello, World!');
          }

### Artifacts

`artifacts:` Configure the paths and names of the artifacts you would like to use in the following steps, e.g. for publishing, or have available for download on the build page. All paths are relative to the clone directory, but absolute paths are supported as well. You can also use environment variables in artifact patterns.

    artifacts:
      - build/**/outputs/**/*.apk                   # relative path for a project in root directory
      - subfolder_name/build/**/outputs/**/*.apk    # relative path for a project in subfolder
      - build/**/outputs/**/*.aab
      - build/**/outputs/**/mapping.txt
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - flutter_drive.log

* The pattern can match several files or folders. If it picks up files or folders with the same name, the top level file or folder name will be suffixed with `_{number}`.
* If one of the patterns includes another pattern, duplicate artifacts are not created.
* `apk`, `aab`, `ipa`, `aar`, `app`, proguard mapping (`mapping.txt`), `flutter_drive.log`, `jar`, `zip`, `xarchive` and `dSYM.zip` files will be available as separate items in the Artifacts section on the build page. The rest of the artifacts will be included in an archive with the following name pattern: `{project-name}_{version}_artifacts.zip`.

### Publishing

`publishing:` For every successful build, you can publish the generated artifacts to external services. The available integrations currently are email, Slack, Google Play, App Store Connect and Codemagic Static Pages.

    publishing:
      email:
        recipients:
          - name@example.com
      slack:
        channel: '#channel-name'
        notify_on_build_start: true
      google_play:                        # For Android app
        credentials: Encrypted(...)
        track: alpha
      app_store_connect:                  # For iOS app
        app_id: '...'                     # App's unique identifier in App Store Connect
        apple_id: name@example.com        # Email address used for login
        password: Encrypted(...)          # App-specific password

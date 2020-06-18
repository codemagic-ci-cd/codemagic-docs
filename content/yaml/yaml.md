---
title: Configuration as code (YAML)
description: Customize the build and configure all your workflows in a single file.
weight: 1
---

`codemagic.yaml` is an advanced option for customizing the build and configuring all your workflows in a single file. This file can be committed to version control, and when it is detected in the repository it will be referenced to configure the build (instead of using the settings in the UI).

{{<notebox>}}

**Limitations**

The YAML feature currently has the following limitations:

* Exporting configuration from UI is supported for Flutter-based Android, iOS and web apps.
* The exported configuration is not identical to the settings in UI and lacks the configuration for some features, such as **Stop build if tests fail** and publishing to Codemagic Static Pages.

{{</notebox>}}

## Exporting current configuration as YAML

You can get started with YAML easily if you have an existing project set up on Codemagic. 

1. Navigate to your app settings.
2. Click **Download configuration** on the right sidebar in the **Configuration as code (beta)** section.

Note that in order to use the file for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the repository.

## Encrypting sensitive data

During the export, Codemagic automatically encrypts the secret environment variables in your build configuration. 

If you wish to add new environment variables to the YAML file, you can encrypt them via Codemagic UI. 

1. Navigate to your app settings.
2. Click **Encrypt environment variables** on the right sidebar in the **Configuration as code (beta)** section.
3. Paste the value of the variable in the field or upload it as a file.
4. Click **Encrypt**. 
5. Copy the encrypted value and paste it to the configuration file.

The encrypted value will look something like this:

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

This is the skeleton structure of `codemagic.yaml`:

    workflows:
      my-workflow:
        name: My workflow name
        max_build_duration: 60
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
        max_build_duration: 60    # build duration in minutes (min 1, max 120)
        environment:
        cache:
        triggering:
        branch_patterns:
        scripts:
        artifacts:
        publishing:

The main sections in each workflow are described below.

### Environment

`environment:` contains all the environment variables and enables to specify the version of Flutter, Xcode, CocoaPods, Node and nmp used for building. This is also where you can add credentials and API keys required for code signing. Make sure to [encrypt the values](#encrypting-sensitive-data) of variables that hold sensitive data. 

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

        # publishing a package to pub.dev
        CREDENTIALS: Encrypted(...)

      flutter: stable   # Define the channel name or version (e.g. v1.13.4)
      xcode: latest     # Define latest, edge or version (e.g. 11.2)
      cocoapods: 1.9.1  # Define default or version
      node: 12.14.0     # Define default, latest, current, lts, carbon (or another stream), nightly or version
      npm: 6.13.7       # Define default, latest, next, lts or version

{{<notebox>}}
See the default software versions on Codemagic build machines [here](../releases-and-versions/versions/).
{{</notebox>}}


### Cache

`cache:` defines the paths to be cached and stored on Codemagic. See the recommended paths for [dependency caching](./dependency-caching).

    cache:
      cache_paths:
        - ~/.pub-cache
        - ...

### Triggering

`triggering:` defines the events for automatic build triggering and watched branches. If no events are defined, you can start builds only manually. 

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

Scripts specify what kind of application is built. Thus, this section includes all the commands to actually build an application. There are example scripts for building a [React Native application](./building-a-react-native-app/), a [native Android application](./building-a-native-android-app/) or a [native iOS application](./building-a-native-ios-app/).

### Testing

There are two types of tests that users can run when developing mobile apps, unit tests (for testing code) and instrumentation tests (for testing the UI and the application in general). These tests take place in a simulator (iOS) or emulator (android), depending on the platform. Examples of testing are available [here](./testing/).

### Artifacts

Configure the paths and names of the artifacts you would like to use in the following steps, e.g. for publishing, or have available for download on the build page. All paths are relative to the clone directory, but absolute paths are supported as well. You can also use environment variables in artifact patterns.

    artifacts:
      - build/**/outputs/**/*.apk                   # relative path for a project in root directory
      - subfolder_name/build/**/outputs/**/*.apk    # relative path for a project in subfolder
      - build/**/outputs/**/*.aab
      - build/**/outputs/**/mapping.txt
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - flutter_drive.log

There are several things to keep in mind about patterns:
* The pattern can match several files or folders. If it picks up files or folders with the same name, the top level file or folder name will be suffixed with `_{number}`.
* If one of the patterns includes another pattern, duplicate artifacts are not created.
* `apk`, `aab`, `ipa`, `aar`, `app`, proguard mapping (`mapping.txt`), `flutter_drive.log`, `jar`, `zip`, `xarchive` and `dSYM.zip` files will be available as separate items in the Artifacts section on the build page. The rest of the artifacts will be included in an archive with the following name pattern: `{project-name}_{version}_artifacts.zip`.

### Publishing

All the apps that run on iOS devices need to be signed by trusted developers with a valid certificate from Apple. This confirms the author of the code and guarantees that the code has not been tampered with since it was signed. After code signing, the generated artifacts can be easily published to external services. Both code singing and publishing is explained [here](./distribution/) in more detail.



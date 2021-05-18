---
title: Using codemagic.yaml
description: Configure all your workflows in a single file
weight: 3
aliases:
  - '../building/yaml'
  - '../yaml/yaml'
---

`codemagic.yaml` is a highly customizable configuration file for setting up your CI/CD pipeline with Codemagic. Configure all your workflows in a single file and commit the file to version control.

## Building with YAML

In order to use `codemagic.yaml` for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the repository.

When detected in repository, `codemagic.yaml` is automatically used for configuring builds that are triggered in response to the events defined in the file, provided that a [webhook](../building/webhooks) is set up. 

Builds can be also started manually by clicking **Start new build** in Codemagic and selecting the branch and workflow to build in the **Specify build configuration** popup.

## Syntax

`codemagic.yaml` follows the traditional [YAML syntax](https://yaml.org/). Here are a few tips and tricks on how to better structure the file.

{{<notebox>}}
Use the Codemagic JSON schema to validate `codemagic.yaml` in your IDE, see how to set it up [here](../knowledge-base/validate-yaml/).
{{</notebox>}}

### Section names

For easier reading of the configuration file and build logs, you can divide the scripts into meaningful sections with descriptive names.

```yaml
scripts:
  - name: Build for iOS         # Name of the section
    script: flutter build ios   # The script(s) to be run in that section
```

### Reusing sections

If a particular section would be reused multiple times in the file, e.g. in each workflow, you can avoid repetitions by using **anchors**. This is also convenient when you need to make changes to the code as you would have to edit it in just one place. 

Define the section to be reused by adding `&` in front of it.

```yaml
scripts:
  - &increment_build_number       # Defined section
    name: Increment build number
    script: agvtool new-version -all $(($PROJECT_BUILD_NUMBER +1))
```

Reuse the defined section elsewhere by adding a `*` in front of it.

```yaml
scripts:
  - script1
  - *increment_build_number       # Reused section
  - script3
```

## Template

This is the skeleton structure of `codemagic.yaml`. Each section along with the configuration options is described in more detail below.

```yaml
workflows:
  my-workflow:
    name: My workflow name
    instance_type: mac_mini
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
      cancel_previous_builds: false
    scripts:
      - ...
    artifacts:
      - build/**/outputs/**/*.aab
    publishing:
      email:
        recipients:
          - name@example.com
      scripts:
        - echo 'Post-publish script'
```

### Workflows

You can use `codemagic.yaml` to define several workflows for building a project. Each workflow describes the entire build pipeline from triggers to publishing. For example, you may want to have separate workflows for developing, testing and publishing the app.

```yaml
workflows:
  my-workflow:                # workflow ID
    name: My workflow name    # workflow name displayed in Codemagic UI
    instance_type: mac_mini   # machine instance type
    max_build_duration: 60    # build duration in minutes (min 1, max 120)
    environment:
    cache:
    triggering:
    scripts:
    artifacts:
    publishing:
```

The main sections in each workflow are described below.

### Instance Type

`instance_type:` specifies the [build machine type](../specs/machine-type) to use for the build. The supported build machines are:
| **Instance Type** | **Build Machine** |
| ------------- | ----------------- |
| `mac_mini`    | macOS standard VM |
| `mac_pro`     | macOS premium VM  |
| `linux`       | Linux standard VM |
| `linux_x2`    | Linux premium VM  |

{{<notebox>}}
Note that `mac_pro`, `linux`, and `linux_x2` are only available for teams and users with [billing enabled](../billing/billing/).
{{</notebox>}}

### Environment

`environment:` contains all the environment variables and enables to specify the version of Flutter, Xcode, CocoaPods, Node and npm used for building. This is also where you can add credentials and API keys required for [code signing](../code-signing-yaml/signing). Make sure to [encrypt the values](../building/encrypting) of variables that hold sensitive data. 

```yaml
environment:
  vars:             # Define your environment variables here
    PUBLIC_ENV_VAR: "value here"
    SECRET_ENV_VAR: Encrypted(...)

    # Android code signing
    FCI_KEYSTORE: Encrypted(...)
    FCI_KEYSTORE_PASSWORD: Encrypted(...)
    FCI_KEY_PASSWORD: Encrypted(...)
    FCI_KEY_ALIAS: Encrypted(...)

    # iOS automatic code signing
    APP_STORE_CONNECT_ISSUER_ID: Encrypted(...)
    APP_STORE_CONNECT_KEY_IDENTIFIER: Encrypted(...)
    APP_STORE_CONNECT_PRIVATE_KEY: Encrypted(...)
    CERTIFICATE_PRIVATE_KEY: Encrypted(...)

    # iOS manual code signing
    FCI_CERTIFICATE: Encrypted(...)
    FCI_CERTIFICATE_PASSWORD: Encrypted(...)
    FCI_PROVISIONING_PROFILE: Encrypted(...)

    # Firebase secrets
    ANDROID_FIREBASE_SECRET: Encrypted(...)
    IOS_FIREBASE_SECRET: Encrypted(...)

    SSH_KEY_GITHUB: Encrypted(...)     # defining an ssh key used to download private dependencies
    CREDENTIALS: Encrypted(...)        # publishing a package to pub.dev
    APP_CENTER_TOKEN: Encrypted(...)   # publishing an application to App Center

  flutter: stable   # Define the channel name or version (e.g. v1.13.4)
  xcode: latest     # Define latest, edge or version (e.g. 11.2)
  cocoapods: 1.9.1  # Define default or version
  node: 12.14.0     # Define default, latest, current, lts, carbon (or another stream), nightly or version
  npm: 6.13.7       # Define default, latest, next, lts or version
  ndk: r21d         # Define default or revision (e.g. r19c)
  java: 1.8         # Define default, or platform version (e.g. 11). The default platform version is 1.8
```

{{<notebox>}}
See the default software versions on Codemagic build machines:
- [macOS build machine specification (Xcode 11.x)](../releases-and-versions/versions/)
- [macOS build machine specification (Xcode 12.0-12.4)](../releases-and-versions/versions2/)
- [macOS build machine specification (Xcode 12.5+)](../releases-and-versions/versions3/)
- [Linux build machine specification](../releases-and-versions/versions-linux/)
{{</notebox>}}

### Cache

`cache:` defines the paths to be cached and stored on Codemagic. For example, you may consider caching the following paths:

| **Path**                                    | **Description**                                  |
| ------------------------------------------- | ------------------------------------------------ |
| `$FLUTTER_ROOT/.pub-cache`                  | Dart cache                                       |
| `$HOME/.gradle/caches`                      | Gradle cache. Note: do not cache `$HOME/.gradle` |
| `$HOME/Library/Caches/CocoaPods`            | CocoaPods cache                                  |

<br>

{{<notebox>}}

Caching `$HOME/Library/Developer/Xcode/DerivedData` won't help to speed up iOS builds with Xcode 10.2 or later.

{{</notebox>}}

```yaml
cache:
  cache_paths:
    - ~/.gradle/caches
    - ...
```

### Triggering

{{<notebox>}}
For automatic build triggering, a webhook in the repository is required. In your app settings, click **Create webhook** on the right sidebar under **Webhooks** to have Codemagic create a webhook. If you need to set up a webhook manually, refer [here](../building/webhooks) for details.
{{</notebox>}}

`triggering:` defines the events for automatic build triggering and watched branches. If no events are defined, you can start builds only manually.

A branch pattern can match the name of a particular branch, or you can use wildcard symbols to create a pattern that matches several branches. Note that for **pull request builds**, you have to specify whether the watched branch is the source or the target of the pull request.

To avoid running builds on outdated commits, you can set `cancel_previous_builds` to automatically cancel all ongoing and queued builds triggered by webhooks on push or pull request commit when a more recent build has been triggered for the same branch.

```yaml
triggering:
  events:                       # List the events that trigger builds
    - push
    - pull_request
    - tag
  branch_patterns:              # Include or exclude watched branches
    - pattern: '*'
      include: true
      source: true
    - pattern: excluded-target
      include: false
      source: false
    - pattern: included-source
      include: true
      source: true
  tag_patterns:                 # Include or exlude watched tag labels
    - pattern: '*'
      include: true
    - pattern: exluded-tag
      include: false
    - pattern: included-tag
      include: true
  cancel_previous_builds: false  # Set to `true` to automatically cancel outdated webhook builds
```

{{<notebox>}}For information about using API calls to trigger builds, look [here](../rest-api/overview/).{{</notebox>}}
### Scripts

Scripts specify what kind of application is built. This is where you can specify the commands to [test](../testing-yaml/testing/), build and code sign your project (see our documentation for [iOS code signing](../code-signing-yaml/signing-ios) and [Android code signing](../code-signing-yaml/signing-android)). You can also run shell (`sh`) scripts directly in your `.yaml` file, or run scripts in other languages by defining the language with a shebang line or by launching a script file present in your repository.

When you set `ignore_failure` to `true`, the workflow will continue to run even if the script fails.

```yaml
scripts:
  - echo "single line script"
  - name: Flutter test
    script: flutter test
    ignore_failure: true
  - |
    #!/usr/bin/env python3

    print('Multiline python script')
  - name: Build for iOS
    script: flutter build ios
```

There are example scripts available for building a [Flutter application](./building-a-flutter-app/), [React Native application](./building-a-react-native-app/), [native Android application](./building-a-native-android-app/) or a [native iOS application](./building-a-native-ios-app/).

### Artifacts

Configure the paths and names of the artifacts you would like to use in the following steps, e.g. for publishing, or have available for download on the build page. All paths are relative to the clone directory, but absolute paths are supported as well. You can also use [environment variables](../building/environment-variables) in artifact patterns.

```yaml
artifacts:
  - build/**/outputs/**/*.apk                   # relative path for a project in root directory
  - subfolder_name/build/**/outputs/**/*.apk    # relative path for a project in subfolder
  - build/**/outputs/**/*.aab
  - build/**/outputs/**/mapping.txt
  - build/ios/ipa/*.ipa
  - build/macos/**/*.pkg
  - /tmp/xcodebuild_logs/*.log
  - flutter_drive.log
```

There are several things to keep in mind about patterns:
* The pattern can match several files or folders. If it picks up files or folders with the same name, the top level file or folder name will be suffixed with `_{number}`.
* If one of the patterns includes another pattern, duplicate artifacts are not created.
* `apk`, `aab`, `aar`, `ipa`, `app`, `pkg`, proguard mapping (`mapping.txt`), `flutter_drive.log`, `jar`, `zip`, `xarchive` and `dSYM.zip` files will be available as separate items in the Artifacts section on the build page. The rest of the artifacts will be included in an archive with the following name pattern: `{project-name}_{version}_artifacts.zip`.

### Publishing

Codemagic has a number of integrations (e.g. email, Slack, Google Play, App Store Connect) for publishing but you can also publish elsewhere with custom scripts (e.g. Firebase App Distribution). See the examples [here](../publishing-yaml/distribution).

Note that by default the publishing scripts are run regardless of the build status. You can specify additional conditions with if statements.

```yaml
publishing:
  email:
    recipients:
      - name@example.com
  scripts:
    script: |
      apkPath=$(find build -name "*.apk" | head -1)
      if [[ -z ${apkPath} ]]
      then
        echo "No .apk were found"
      else
        echo "Publishing .apk artifacts"
      fi
```

You can also use the post-publishing scripts to report build status.

```yaml
scripts:
  - name: Report build start
    script: # build started

    . . .

  - name: Build finished successfully
    script: touch ~/SUCCESS
publishing:
  scripts:
    - name: Report build status
      script: |
        if [ -a "~/SUCCESS" ] ; then
           # build successful
        else
           # build failed
        fi
```

## Conditional build triggers

You can skip building particular commits or watch for changes in specific files to trigger builds. It's possible to define build conditions per workflow or specific build steps.
### Skip building a commit

If you do not wish Codemagic to build a particular commit, include `[skip ci]` or `[ci skip]` in your commit message.

### Watch for changes in files

You can avoid unnecessary builds when functional components of your repository were not modified. Use conditional workflow triggering to skip building the workflow if the watched files were not updated since the last successful build.

You should specify the files to watch in `changeset` by using the `includes` and `excludes` keys.

```yaml
workflows:
  build-app:
    name: Build App
    triggering:
      events:
        - push
    when:
      changeset:
        includes:
          - '.'
        excludes:
          - '**/*.md'
```

In this case, build would be skipped if there were changes only to Markdown files `.md`.

Note that `codemagic.yaml` is always included in the changeset by default.

Both keys `includes` and `excludes` in `changeset` are *optional*. If the `includes` key is not specified, its value would defalut to `'.'`. The `excludes` key defaults to no exlusions.

If you use a monorepo, each workflow could be responsible for building a part of your application. Use conditional workflow triggering and specify the path to the application in the changeset as in the example below.

```yaml
workflows:
  build-android:
    name: Build Android
    triggering:
      events:
        - push
    when:
      changeset:
        includes:
          - 'android/'
```

As a result, commits with changes outside of the android folder will not trigger a build.

## Conditional build step execution

You may also want to skip some specific steps when building your application. Use the same approach with scripts

```yaml
workflows:
  build-android:
    name: Build All
    scripts:
      - name: Build Android
        script: ./gradlew assembleDebug
        when:
          changeset:
            includes:
              - 'android/'
            excludes:
              - '**/*.md'
```

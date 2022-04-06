---
title: Using codemagic.yaml
description: Configure all your workflows in a single file
weight: 3
aliases:
  - '../building/yaml'
  - '../yaml/yaml'
  - /getting-started/yaml
  - /yaml-quick-start/yaml
popular: 1
---

`codemagic.yaml` is a highly customizable configuration file for setting up your CI/CD pipeline with Codemagic. Configure all your workflows in a single file and commit the file to version control.

## Building with YAML

In order to use `codemagic.yaml` for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the repository.

When detected in the repository, `codemagic.yaml` is automatically used for configuring builds triggered in response to the events defined in the file, provided that a [webhook](../building/webhooks) is set up. 

Builds can also be started manually by clicking **Start new build** in Codemagic and selecting the branch and workflow to build in the **Specify build configuration** popup.

## Syntax

You can readily commit `codemagic.yaml` with the following content to test it out:

```yaml
workflows:
  hello-world:
    name: Hello world workflow
    scripts:
        - echo "Hello World!"
```

The scripts in the `scripts` section will be run right after the repository is cloned.

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

If a particular section would be reused multiple times in the file, e.g. in each workflow, you can avoid repetitions by using **anchors**. This is also convenient when you need to make changes to the code, as you would have to edit it in just one place. 

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

You can also define the reusable section under `definitions` by adding `&` in front of the section name.

```yaml
definitions: 
  env_versions: &env_versions
    xcode: latest 
    cocoapods: default
```

Expand the defined section elsewhere by using aliased mapping (`<<`) and adding a `*` in front of the section name.

```yaml
workflows: 
  ios-release: 
    name: iOS release 
    environment: 
      << : *env_versions
```

Here's a [sample](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/yaml/yaml_anchors_aliases_sample/codemagic.yaml) `codemagic.yaml` that extensively uses anchors, aliases, and aliased mappings to reuse the sections in different workflows.

## Template

This is the skeleton structure of `codemagic.yaml`. Each section, along with the configuration options, is described in more detail 

```yaml
workflows:
  my-workflow:
    name: My workflow name
    instance_type: mac_mini
    max_build_duration: 60
    environment:
      groups:
        - group_name
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
      - build/**/outputs/bundle/**/*.aab
    publishing:
      email:
        recipients:
          - name@example.com
      scripts:
        - echo 'Post-publish script'
```

### Workflows

You can use `codemagic.yaml` to define several workflows for building a project. Each workflow describes the entire build pipeline from triggers to publishing. For example, you may want to have separate workflows for developing, testing, and publishing the app.

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
| ------------- | -----------------  |
| `mac_mini`    | macOS standard VM (default) |
| `mac_pro`     | macOS premium VM            |
| `mac_mini_m1` | macOS M1 standard VM        |
| `linux`       | Linux standard VM           |
| `linux_x2`    | Linux premium VM            |
| `windows_x2`  | Windows premium VM          |

{{<notebox>}}
Note that `mac_pro`, `linux`, `linux_x2` and `windows_x2` are only available for teams and users with [billing enabled](../billing/billing/). The `mac_mini_m1` instance type is only available for teams and users on the Pay as you go and Professional Plus plans. 
{{</notebox>}}

### Environment

`environment:` specifies the environment variables, variable groups and build machine software versions.

#### Environment variable groups

The snippet below shows how to import [environment variable groups](../building/environment-variable-groups/) defined in the team settings and application settings and also how to define them in the cofiguration file, such as credentials and API keys required for [code signing](../code-signing-yaml/signing). Click **Secure** to encrypt the values. Note that binary files have to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) locally before they can be saved to environment variables and decoded during the build.

```yaml
environment:
  groups:             # Define your environment variables groups here
    - keystore_credentials
    - app_store_credentials
    - manual_cert_credentials
    - firebase_credentials
    - other
    
    # Android code signing - Add the keystore_credentials group environment variables in Codemagic UI (either in Application/Team variables)
    # CM_KEYSTORE
    # CM_KEYSTORE_PASSWORD
    # CM_KEY_PASSWORD
    # CM_KEY_ALIAS

    # iOS automatic code signing - Add the app_store_credentials group environment variables in Codemagic UI (either in Application/Team variables)
    # APP_STORE_CONNECT_ISSUER_ID
    # APP_STORE_CONNECT_KEY_IDENTIFIER
    # APP_STORE_CONNECT_PRIVATE_KEY
    # CERTIFICATE_PRIVATE_KEY

    # iOS manual code signing - Add the manual_cert_credentials group environment variables in Codemagic UI (either in Application/Team variables)
    # CM_CERTIFICATE
    # CM_CERTIFICATE_PASSWORD
    # CM_PROVISIONING_PROFILE

    # Firebase secrets - Add the firebase_credentials group environment variables in Codemagic UI (either in Application/Team variables
    # ANDROID_FIREBASE_SECRET
    # IOS_FIREBASE_SECRET
    
    # Add the other group environment variables in Codemagic UI (either in Application/Team variables
    # SSH_KEY_GITHUB     # defining an ssh key used to download private dependencies
    # CREDENTIALS        # publishing a package to pub.dev
    # APP_CENTER_TOKEN   # publishing an application to App Center
```
{{<notebox>}}
Tip: Store all the keystore variables in the same group so they can be imported to codemagic.yaml workflow at once. 
  
If the group of variables is reusable for various applications, they can be defined in [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in **Team settings** for easier access.
{{</notebox>}}

#### Workflow environment variables

The snippet below shows how to define workflow specific public environment variables. 

```yaml
environment:
  vars:             # Define your environment variables here
    PUBLIC_ENV_VAR: "value here"
```

#### Build machine and software versions

The snippet below shows how to specify the versions of Flutter, Xcode, CocoaPods, Node, npm, ndk, Java and Ruby used in the build.

```yaml
environment:
  flutter: stable   # Define the channel name or version (e.g. v1.13.4)
  xcode: latest     # Define latest, edge or version (e.g. 11.2)
  cocoapods: 1.9.1  # Define default or version
  node: 12.14.0     # Define default, latest, current, lts, carbon (or another stream), nightly or version
  npm: 6.13.7       # Define default, latest, next, lts or version
  ndk: r21d         # Define default or revision (e.g. r19c)
  java: 1.8         # Define default, or platform version (e.g. 11)
  ruby: 2.7.2       # Define default or version
```

{{<notebox>}}
The Xcode version defines type of macOS build machine used for the build (even if you're building Android). See the default software versions on Codemagic build machines:
- [macOS build machine specification (Xcode 11.x)](../releases-and-versions/versions/)
- [macOS build machine specification (Xcode 12.0-12.4)](../releases-and-versions/versions2/)
- [macOS build machine specification (Xcode 12.5+)](../releases-and-versions/versions3/)
- [macOS build machine specification (Xcode 13.0+)](../specs/versions4/)
- [Linux build machine specification](../releases-and-versions/versions-linux/)

Using a non-default version of Ruby for macOS builds will increase the time of your `Preparing build machine` step significantly.
{{</notebox>}}

#### Environment section example

You can freely use all of the above features of environment section in conjunction.

```yaml
environment:
  vars: # Define your public environment variables here
    PUBLIC_ENV_VAR: "value here"
  groups: # Import UI defined environment variable groups(either in Application/Team variables) here
    - staging
  xcode: latest # Define latest, edge or version (e.g. 11.2)
  flutter: stable   # Define the channel name or version (e.g. v1.13.4)
```

### Cache

`cache:` defines the paths to be cached and stored on Codemagic. For example, you may consider caching the following paths:

| **Path**                                    | **Description**                                  |
| ------------------------------------------- | ------------------------------------------------ |
| `$FLUTTER_ROOT/.pub-cache`                  | Dart cache                                       |
| `$HOME/.gradle/caches`                      | Gradle cache. Note: do not cache `$HOME/.gradle` |
| `$HOME/Library/Caches/CocoaPods`            | CocoaPods cache                                  |
| `$CM_BUILD_DIR`/node_modules                | Node cache                                       |

<br>

{{<notebox>}}

Caching `$HOME/Library/Developer/Xcode/DerivedData` won't help speed up iOS builds with Xcode 10.2 or later.

{{</notebox>}}

```yaml
cache:
  cache_paths:
    - ~/.gradle/caches
    - ...
```
{{<notebox>}}
Note: Codemagic doesn't support caching symlinks.
{{</notebox>}}

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
    - pattern: excluded-tag
      include: false
    - pattern: included-tag
      include: true
  cancel_previous_builds: false  # Set to `true` to automatically cancel outdated webhook builds
```

{{<notebox>}}For information about using API calls to trigger builds, look [here](../rest-api/overview/).{{</notebox>}}

{{<notebox>}}
Read more about configuring [additional conditions to run or skip](/yaml/yaml-conditional-run) builds or build steps.
{{</notebox>}}

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
  - build/**/outputs/apk/**/*.apk                   # relative path for a project in root directory
  - subfolder_name/build/**/outputs/apk/**/*.apk    # relative path for a project in subfolder
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

Codemagic has a number of integrations for publishing but you can also publish elsewhere with custom scripts. See the options under the [Publishing section](../publishing-yaml/distribution/).

Note that by default the publishing scripts are run regardless of the build status. You can specify additional conditions with if statements.

```yaml
publishing:
  email:
    recipients:
      - name@example.com
  scripts:
    name: Check for apk
    script: |
      apkPath=$(find build -name "*.apk" | head -1)
      if [[ -z ${apkPath} ]]
      then
        echo "No .apk were found"
      else
        echo "Publishing .apk artifacts"
      fi
```

You can also use the publishing scripts to report build status.

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

## Working directory

You may select a working directory globally for the entire workflow or individual scripts only. If not specified, the global working directory defaults to the directory where the repository is cloned (`/Users/builder/clone`). You can override the global working directory by specifying the working directory in the individual steps. Consider the example below:

```yaml
workflows:
  build-apps:
    name: Build iOS and Android
    working_directory: mobile
    scripts:
      - name: Prepare
        script: pwd # current working directory is /Users/builder/clone/mobile
      - name: Build iOS
        working_directory: mobile/ios
        script: pwd # current working directory is /Users/builder/clone/mobile/ios
      - name: Build Android
        working_directory: mobile/android
        script: pwd # current working directory is /Users/builder/clone/mobile/android
      - name: Process Logs
        working_directory: /Users/builder/Library/Logs
        script: pwd # current working directory is /Users/builder/Library/Logs
```

Working directory paths are relative to the repository clone directory, e.g. if `mobile` is the working directory, then the script will be executed in `/Users/builder/clone/mobile`.

Note that you can specify an absolute path as a working directory as well.

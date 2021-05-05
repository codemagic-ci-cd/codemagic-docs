---
description: How to work with environment variables in Codemagic builds
title: Environment variables
weight: 2
---

Environment variables are useful for storing information that you do not want to store in the repository, such as your credentials or workflow-specific data. In addition, you can make use of a number of read-only environment variables that Codemagic exports to customize your builds. 

{{<notebox>}}
You can add evironment variables in the [environment](../getting-started/yaml/#environment) section of the `codemagic.yaml` confguration file or in the [Environment variables](../flutter/env-variables/) section in the Flutter workflow editor. 

See how to [encrypt sensitive information](./encrypting) in Codemagic. 
{{</notebox>}}

## Codemagic read-only environment variables

Codemagic exports several read-only environment variables during the build that you can use in scripts to customize the build process. Environment variables added by user will override Codemagic defaults. You can check which environment variables are exported by inserting the following script before or after any of the default build steps:

```bash
#!/bin/sh
set -ex
printenv
```

Here you'll find some of the read-only environment variables explained.

| **Environment variable** | **Value**                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ANDROID_SDK_ROOT         | Absolute path to Android SDK and tools                                                                                                                          |
| CI                       | true                                                                                                                                                            |
| CONTINUOUS_INTEGRATION   | true                                                                                                                                                            |
| BUILD_NUMBER             | Number of the build for this project in Codemagic for the given workflow                                                                                        |
| PROJECT_BUILD_NUMBER     | Number of the build for this project in Codemagic                                                                                                               |
| FLUTTER_ROOT             | Absolute path to Flutter SDK                                                                                                                                    |
| FCI_BRANCH               | The current branch being built, for pull requests it is the source branch                                                                                       |
| FCI_TAG                  | The tag being built if started from a tag webhook, unset otherwise
| FCI_REPO_SLUG            | The slug of the repository that is currently being built in the form `owner_name/repository_name`. Unset for repositories added from custom source              |
| FCI_COMMIT               | Commit hash that is currently being built by Codemagic, for pull request builds it is the hash of the source commit                                             |
| FCI_PREVIOUS_COMMIT      | Commit hash of the previous successful build, unset if there is no previous successful build                                                                    |
| FCI_PULL_REQUEST         | `true`, if the current build is building a pull request, `false` otherwise                                                                                      |
| FCI_PULL_REQUEST_NUMBER  | Set to Integer ID of the pull request for the Git provider (Bitbucket, Github etc) if the current build is building a pull request, unset otherwise             |
| FCI_CLONE_UNSHALLOW      | If set to `true` performs a full clone of the repository instead of top 50 commits                                                                              |
| FCI_CLONE_DEPTH          | Specifies the number of commits to be fetched from the repository when cloning, default: 50. Specifying a smaller number can decrease the default fetching time |
| FCI_PROJECT_ID           | UUID of the project that is being built                                                                                                                         |
| FCI_BUILD_ID             | UUID of the build                                                                                                                                               |
| FCI_TEST_STEP_STATUS     | Test step status, success or failure                                                                                                                            |
| FCI_BUILD_STEP_STATUS    | Build step status, success, failure or skipped                                                                                                                  |
| FCI_BUILD_DIR            | Absolute path to the cloned repository in Codemagic builders                                                                                                    |
| FCI_BUILD_OUTPUT_DIR     | Contains the artifact files generated during the build                                                                                                          |
| FCI_EXPORT_DIR           | The files added to this directory will be added to a zip file and made available as build artifacts                                                             |
| FCI_FLUTTER_SCHEME       | Name of the iOS scheme to be used                                                                                                                               |
| FCI_SYMROOT              | Directory path of files generated during Xcode build                                                                                                            |
| FCI_KEYSTORE_PASSWORD    | Password of Android keystore as configured in the UI                                                                                                            |
| FCI_KEY_PASSWORD         | Password of Android key as configured in the UI                                                                                                                 |
| FCI_KEY_ALIAS            | Alias of the key as configured in the UI                                                                                                                        |
| FCI_KEYSTORE_PATH        | Path of the file in our VM                                                                                                                                      |
| FCI_ARTIFACT_LINKS       | Information about generated build artifacts that is available in post-publishing step. Read more about it below.                                                |

`$FCI_ARTIFACT_LINKS` environment variable value is a JSON encoded list in the following form:

```json
[
  {
    "name": "Codemagic_Release.ipa",
    "type": "ipa",
    "url": "https://api.codemagic.io/artifacts/2e7564b2-9ffa-40c2-b9e0-8980436ac717/81c5a723-b162-488a-854e-3f5f7fdfb22f/Codemagic_Release.ipa",
    "md5": "d2884be6985dad3ffc4d6f85b3a3642a",
    "versionName": "1.0.2",
    "bundleId": "io.codemagic.app"
  }
]
```

## Using environment variables

To access a variable, add the `$` symbol in front of its name. For example, access `API_TOKEN` by using `$API_TOKEN`. Note that it is required to use quotation marks with multi-line variables when you are referencing them in custom scripts.

## Accessing environment variables from your application

The following examples show how to place your Google Maps API key into an Android or iOS application from an environment variable. With this approach you will not have to store your secret key in the repository.

1. Add your key as an environment variable with the name `MAPS_API_KEY`

### Android

2. Read the key from an environment variable to `build.gradle`

```gradle
defaultConfig {
    // Other values set here
    resValue "string", "maps_api_key", "$System.env.MAPS_API_KEY"
}
```

3. Read the key from the `build.gradle` value to `AndroidManifest.xml`

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="@string/maps_api_key"
/>
```

### iOS (Swift)

2. Read the key from the environment variable to `Info.plist`

```xml
<key>MAPS_API_KEY</key>
<string>$(MAPS_API_KEY)</string>
```

3. Read the key from the `Info.plist` value to `AppDelegate.swift`

```swift
GMSServices.provideAPIKey(Bundle.main.object(forInfoDictionaryKey: "MAPS_API_KEY") as? String ?? "")
```

### iOS (Objective-C)

2.  Read your key from the environemnt variable to `AppDelegate.m` as in the [example](https://github.com/flutter/plugins/blob/master/packages/google_maps_flutter/google_maps_flutter/example/ios/Runner/AppDelegate.m).

```objective-c
[GMSServices provideAPIKey:[[NSProcessInfo processInfo] environment][@"MAPS_API_KEY"]];
```

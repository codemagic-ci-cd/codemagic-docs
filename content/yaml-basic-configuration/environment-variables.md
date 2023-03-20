---
description: Useful variables exported during builds
title: Built-in environment variables in codemagic.yaml
linkTitle: Built-in environment variables
weight: 4
aliases: 
  - /building/environment-variables
  - /variables/environment-variables
---

Codemagic exports several built-in environment variables during the build that you can use in scripts to customize the build process. Environment variables added by user will override Codemagic defaults. You can check which environment variables are exported by inserting the following script before or after any of the default build steps:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set up app/build.gradle
    script: | 
      #!/bin/sh
      set -ex
      printenv
{{< /highlight >}}


Here is a list of the built-in environment variables with brief explanations:

| **Environment variable** | **Value**                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ANDROID_SDK_ROOT         | Absolute path to Android SDK and tools                                                                                                                          |
| CI                       | true                                                                                                                                                            |
| CONTINUOUS_INTEGRATION   | true                                                                                                                                                            |
| BUILD_NUMBER             | Number of the build for this project in Codemagic for the given workflow                                                                                        |
| PROJECT_BUILD_NUMBER     | Number of the build for this project in Codemagic                                                                                                               |
| FLUTTER_ROOT             | Absolute path to Flutter SDK                                                                                                                                    |
| CM_BRANCH               | The current branch being built, for pull requests it is the source branch                                                                                       |
| CM_TAG                  | The tag being built if started from a tag webhook, unset otherwise
| CM_REPO_SLUG            | The slug of the repository that is currently being built in the form `owner_name/repository_name`. Unset for repositories added from custom source              |
| CM_COMMIT               | Commit hash that is currently being built by Codemagic, for pull request builds it is the hash of the source commit                                             |
| CM_PREVIOUS_COMMIT      | Commit hash of the previous successfully built commit (current excluded), unset if there is no previous successful commit                                                                   |
| CM_PULL_REQUEST         | `true`, if the current build is building a pull request, `false` otherwise                                                                                      |
| CM_PULL_REQUEST_NUMBER  | Set to Integer ID of the pull request for the Git provider (Bitbucket, Github etc) if the current build is building a pull request, unset otherwise             |
| CM_PULL_REQUEST_DEST    | The destination branch, if the current build is building a pull request, unset otherwise                                                                         |
| CM_CLONE_DEPTH          | Number of commits to be cloned. Overwrites the following defaults: branch builds - 50, tag builds and destination branch for PR builds - 1 |
| CM_CLONE_UNSHALLOW      | Set `true` to clone full commit history |
| CM_RECURSIVE_SUBMODULE_INIT  | If set to `false`, recursive submodule cloning is disabled                                                                                                                         |
| CM_PROJECT_ID           | UUID of the project that is being built 
| CM_BUILD_ID             | UUID of the build                                                                                                                                               |
| CM_TEST_STEP_STATUS     | Test step status, success or failure                                                                                                                            |
| CM_BUILD_STEP_STATUS    | Build step status, success, failure or skipped. Only available when using Workflow Editor, unavailable with codemagic.yaml                                                                                                                |
| CM_BUILD_DIR            | Absolute path to the root directory of the cloned repository in Codemagic builders                                                                                                    |
| CM_BUILD_OUTPUT_DIR     | Contains the artifact files generated during the build                                                                                                          |
| CM_EXPORT_DIR           | The files added to this directory will be added to a zip file and made available as build artifacts                                                             |
| CM_FLUTTER_SCHEME       | Name of the iOS scheme to be used                                                                                                                               |
| CM_KEYSTORE_PASSWORD    | Password of Android keystore as configured in the UI                                                                                                            |
| CM_KEY_PASSWORD         | Password of Android key as configured in the UI                                                                                                                 |
| CM_KEY_ALIAS            | Alias of the key as configured in the UI                                                                                                                        |
| CM_KEYSTORE_PATH        | Path of the file in our VM                                                                                                                                      |
| CM_ARTIFACT_LINKS       | Information about generated build artifacts that is available in post-publishing step. Read more about it below.                                                |

### Artifact links

`$CM_ARTIFACT_LINKS` environment variable value is a JSON encoded list in the following form:

{{< highlight json >}}
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
{{< /highlight >}}

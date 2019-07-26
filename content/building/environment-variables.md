---
description:
  Environment variables are useful for storing information that you do
  not want to store in the repository. You can also use Codemagic read-only environment
  variables to customize your builds.
title: Environment variables
weight: 2
---

Environment variables are useful for storing information that you do not want to store in the repository, such as your credentials or workflow-specific data. In addition, you can make use of a number of read-only environment variables that Codemagic exports to customize your builds.

## Adding environment variables

You can add environment variables in **App settings > Environment variables**.

1. Enter the name and the value of the variable.
2. Check **Secure** if you wish to hide the value in the UI and build logs and disable editing of the variable. Such variables can be accessed only by the builder VMs during the build.
3. Click **Add**.

![](../uploads/env_vars.PNG)

To access a variable, add the `$` symbol in front of its name. For example, access `API_TOKEN` by using `$API_TOKEN`. Note that it is required to use quotation marks with multi-line variables when you are referencing them in custom scripts, as shown in the example below:

    > MY_VAR="var
    > value"
    > echo $MY_VAR
    < var value
    > echo "$MY_VAR"
    < var
    < value

## Codemagic read-only environment variables

Codemagic exports several read-only environment variables during the build that you can use in scripts to customize the build process. Environment variables added by user will override Codemagic defaults. You can check which environment variables are exported by inserting the following script before or after any of the default build steps:

    #!/bin/sh
    set -ex
    printenv

Here you'll find some of the read-only environment variables explained.

| Environment variable   | Value                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| CI                     | true                                                                                                            |
| CONTINUOUS_INTEGRATION | true                                                                                                            |
| BUILD_NUMBER           | Number of the build for this project in Codemagic                                                               |
| FCI_BRANCH             | The current branch being built, for pull requests it is the destination branch                                  |
| FCI_COMMIT             | Commit hash that is currently being built by Codemagic, for pull request builds it is hash of the source commit |
| FCI_CLONE_UNSHALLOW    | Performs a full clone of the repository instead of top 50 commits                                               |
| FCI_PROJECT_ID         | UUID of the project that is being built                                                                         |
| FCI_BUILD_ID           | UUID of the build                                                                                               |
| FCI_TEST_STEP_STATUS   | Test step status, success or failure                                                                            |
| FCI_BUILD_STEP_STATUS  | Build step status, success, failure or skipped                                                                  |
| FCI_BUILD_DIR          | Absolute path to the cloned repository in Codemagic builders                                                    |
| FCI_BUILD_OUTPUT_DIR   | Contains all the artifact files that will be included in the final artifacts zip file                           |
| FCI_EXPORT_DIR         | All the files included in this directory will be added to the artifacts zip file                                |
| FCI_FLUTTER_SCHEME     | Name of the iOS scheme to be used                                                                               |
| FCI_SYMROOT            | Directory path of files generated during Xcode build                                                            |
| FCI_KEYSTORE_PASSWORD  | Password of Android keystore as configured in the UI                                                            |
| FCI_KEY_PASSWORD       | Password of Android key as configured in the UI                                                                 |
| FCI_KEY_ALIAS          | Alias of the key as configured in the UI                                                                        |
| FCI_KEYSTORE_PATH      | Path of the file in our VM                                                                                      |

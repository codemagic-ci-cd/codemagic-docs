---
title: Emerge integration
description: How to integrate your workflows with Emerge using codemagic.yaml
weight: 11
---

**Emerge Tools** helps you monitor and reduce app size with insights for instant savings. It provides continuous monitoring to write smaller, better code by profiling binary size on every pull request. 

## Getting Started with Emerge Tools
You can get started with Emerge Tools [here](https://www.emergetools.com/) to upload the archive and analyze the binary for its size on every pull request.

## Creating the Emerge API Key
Custom integrations with Codemagic require an API Key. It can be obtained from your [profile](https://www.emergetools.com/profile) on Emerge's website by clicking the button **Create a new API Key**. 

>  Make sure to save the API key, as you cannot view it again on the site.

## Configuring access to Emerge in Codemagic

Add the API Key under the **environment variables** section in Codemagic. Name the variable as **EMERGE_API_TOKEN** and put it under the group **emerge_credentials**. Then, you can refer to the variable group in `codemagic.yaml` as: 

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    environment:
      groups:
        - emerge_credentials
```

## Fastlane plugin
Emerge has created a plugin for Fastlane that makes it easy to upload iOS builds. You can add it to your project by running:

```
fastlane add_plugin emerge
```

In the `Fastfile`, create a lane that utilizes the `emerge` plugin to upload the archive. You can refer to the complete example given below for uploading the build to Emerge:

```
fastlane_require 'git'

default_platform(:ios)

git = Git.open('..')

platform :ios do
  lane :emerge_app_upload do
    BRANCH = ENV["CM_BRANCH"]
    IS_PULL_REQUEST = ENV["CM_PULL_REQUEST"]
    PR_NUMBER = ENV["CM_PULL_REQUEST_NUMBER"]
    REPO_NAME = ENV["CM_REPO_SLUG"]
    CURRENT_BUILD_ID = ENV["CM_COMMIT"]

    FILE_PATH = "/build/ios/xcarchive/swiftly.xcarchive"

    BASE_BUILD_ID = git.log[0].parent.sha
    PARENT_BUILD_ID = git.log[0].sha
    
    if IS_PULL_REQUEST == "true"
      emerge(
        file_path: FILE_PATH,
        build_type: "pull_request",
        repo_name: REPO_NAME,
        pr_number: PR_NUMBER,
        sha: CURRENT_BUILD_ID,
        base_sha: BASE_BUILD_ID
      )
    elsif BRANCH.eql? "main"
      emerge(
        file_path: FILE_PATH, 
        build_type: "main",
        repo_name: REPO_NAME,
        sha: PARENT_BUILD_ID
      )
    end
  end
end
```

This script checks if the current build is building a pull request. If it is a pull request, it takes the source commit of the build and compares it to the build of the base commit hash. Then, it uploads it to Emerge for processing for the size comparison. Otherwise, it uploads the build to Emerge with the type "main".

To use it in your `codemagic.yaml`, use the lane that you created: 

```
- name: Upload archive to Emerge Tools
   script: bundle exec fastlane emerge_app_upload
```

> You must upload a base build so Emerge can compare the archive's size differences in subsequent pull requests.

## Codemagic.yaml
You can upload the iOS build to Emerge Tool as a part of your Codemagic CI/CD workflow to automate the process. Here is an example of the scripts you can add to your `codemagic.yaml` for building the archive and uploading it to Emerge: 

```
scripts:
      - name: Bundle install
        script: | 
          bundle install
      - name: Install Emerge Fastlane plugin
        script: |
          fastlane add_plugin emerge
      - name: Build ipa for distribution
        script: | 
          xcode-project build-ipa --project "$XCODE_PROJECT" --scheme "$XCODE_SCHEME"
      - name: Upload archive to Emerge Tools
        script: | 
          bundle exec fastlane emerge_app_upload
```
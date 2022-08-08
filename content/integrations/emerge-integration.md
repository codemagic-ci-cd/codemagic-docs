---
title: Emerge integration
description: How to integrate your workflows with Emerge using codemagic.yaml
weight: 2
---

**Emerge Tools** helps you monitor and reduce app size with insights for instant savings. It provides continuous monitoring to write smaller, better code by profiling binary size on every pull request. 

## Getting Started with Emerge Tools
You can get started with Emerge Tools [here](https://www.emergetools.com/) to upload the archive and analyze the binary for its size on every pull request.

## Creating the Emerge API Key
Custom integrations with Codemagic require an API Key. It can be obtained from your [profile](https://www.emergetools.com/profile) by clicking on the button **Create a new API Key**. 

>  Save the API key, as you cannot view it again on the site.

## Configuring access to Emerge in Codemagic

Then, add the API Key under the **environment variables** section in Codemagic. Name the variable as **EMERGE_API_TOKEN** and put it under the group **emerge_credentials**. You can refer to the variable group in the workflow configuration: 

```
workflows:
  ios-workflow:
    name: iOS Workflow
    environment:
      groups:
        - emerge_credentials
```

## Fastlane plugin
Emerge has created a plugin for Fastlane that makes it easy to upload iOS builds in your CI pipeline. You can add it to your project by running:

```
fastlane add_plugin emerge
```

In the `Fastfile`, create a lane that utilizes the `emerge` plugin. The complete example checks if the current build is building a pull request. It uses the emerge plugin to upload the archive. It also takes the source commit of the pull request and compares it to the build of the base commit hash.

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

    FILE_PATH = "/build/ios/xcarchive/emerge.xcarchive"

    BASE_BUILD_ID = git.log[0].parent.sha
    
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
        sha: git.log[0].sha
      )
    end
  end
end
```

To use it in your `codemagic.yaml`, use the lane made for it: 

```
- name: Upload archive to Emerge Tools
   script: bundle exec fastlane app_size
```

> You must upload a base build so Emerge can compare the archive's size differences in subsequent pull requests.

## Codemagic.yaml
Emerge receives the builds created in the Codemagic workflow configuration to automate the process of uploading them.

Here is an example of a `codemagic.yaml` that builds the archive and it uploads it to Emerge: 

```
scripts:
      - name: Bundle install
        script: bundle install
      - name: Install Emerge fastlan plugin
        script: fastlane add_plugin emerge
      - name: Build IPA
        script: xcodebuild build -project "emerge.xcodeproj" -scheme "emerge" CODE_SIGN_INDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO archive -archivePath "/builder/ios/xcarchiv/emerge.xcarchive"
      - name: Upload archive to Emerge Tools
        script: bundle exec fastlane emerge_app_upload
```
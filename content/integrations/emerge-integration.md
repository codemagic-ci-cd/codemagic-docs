---
title: Emerge Tools integration
description: How to integrate your workflows with Emerge using codemagic.yaml
weight: 11
---

**Emerge Tools** helps you monitor and reduce app size with insights for instant savings. It provides continuous monitoring to write smaller, better code by profiling binary size on every pull request.

A sample project that shows how to configure Emerge Tools integration is available [in our Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/emerge-tools-integration-demo-project).


## Configuring access to Emerge in Codemagic

To get started with [Emerge Tools](https://www.emergetools.com/), you need to create an API key and save it as an environment variable in Codemagic.

1. Obtain an **API key** from your [Emerge Tools profile](https://www.emergetools.com/profile) by clicking the **Create a new API Key** button. 

{{<notebox>}}
**Warning:** Make sure to save the API key, as you cannot view it again on the site.
{{</notebox>}}

2. Open your Codemagic app settings, and go to the **Environment variables** tab.
3. Enter the desired **_Variable name_**, e.g. `EMERGE_API_TOKEN`.
4. Copy and paste the API key string as **_Variable value_**.
5. Enter the variable group name, e.g. **_emergetools_credentials_**. Click the button to create the group.
6. Make sure the **Secure** option is selected.
7. Click the **Add** button to add the variable.

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - emergetools_credentials
{{< /highlight >}}


## Fastlane plugin

Emerge has created a plugin for Fastlane that makes it easy to upload iOS builds. You can add it to your project by running:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install Emerge Tools Fastlane plugin
      script: | 
        fastlane add_plugin emerge
{{< /highlight >}}

In the `Fastfile`, create a lane that utilizes the `emerge` plugin to upload the archive. You can refer to the complete example given below for uploading the build to Emerge:

{{< highlight ruby "style=paraiso-dark">}}
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
{{< /highlight >}}

This script checks if the current build is building a pull request. If it is a pull request, it takes the source commit of the build and compares it to the build of the base commit hash. Then, it uploads it to Emerge for processing for the size comparison. Otherwise, it uploads the build to Emerge with the type "main".


## Configuring `codemagic.yaml`

You can upload the iOS build to Emerge Tool as a part of your Codemagic CI/CD workflow to automate the process. Here is an example of the scripts you can add to your `codemagic.yaml` for building the archive and uploading it to Emerge. Don't forget to upload a base build so Emerge can compare the archive's size differences in subsequent pull requests.

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Bundle install
    script: | 
      bundle install
  - name: Install Emerge Tools Fastlane plugin
    script: | 
      fastlane add_plugin emerge
  - name: Build ipa for distribution
    script: | 
      xcode-project build-ipa --project "$XCODE_PROJECT" --scheme "$XCODE_SCHEME"
  - name: Upload archive to Emerge Tools
    script: | 
      bundle exec fastlane emerge_app_upload
{{< /highlight >}}
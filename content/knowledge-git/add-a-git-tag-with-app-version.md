---
title: Adding a Git tag with app version
weight: 6
aliases:
  - '../custom-scripts/add-a-git-tag-with-app-version'
  - '../knowledge-base/add-a-git-tag-with-app-version'
---

You can use Codemagic to create a Git tag and push it to your repository.

{{<notebox>}}
**Note:** Pushing Git tags from Codemagic to your repository requires **write access** to the repository. Depending on the Git service and authentication method, Codemagic may not have write access to your repository, and you may need to grant it separately in your Git service settings. We recommend that you create a dedicated app password / personal access token for Codemagic.

* For repositories hosted on Bitbucket, create an [app password](https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html) with **write** permission for repositories.
* For repositories hosted on GitHub, create a [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with **repo** scope.
* For repositories hosted on GitLab, create a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) with **write_repository** scope.
{{</notebox>}}


## Configure environment variables

To allow Codemagic to access your repository, please save the app password or the personal access token in Codemagic.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `APP_PASSWORD`.
3. Enter the value as **_Variable value_**.
4. Enter the variable group name, e.g. **_repo_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - repo_credentials
{{< /highlight >}}


## Publishing Git tags

To create and publish git tags, add the following **pre-publish script**, replacing the placeholders with your actual service details.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Push git tags
      script: | 
        #!/usr/bin/env bash
        set -e # exit on first failed command
        set -x # print all executed commands to the log

        if [ "$CM_BUILD_STEP_STATUS" = "success" ]
        then
          new_version=v1.0.$BUILD_NUMBE
          git tag $new_version
          git push "https://your-username:$APP_PASSWORD@your-git-service.com/your-repo.git" --tags
        fi
{{< /highlight >}}


  Where:

  * `BUILD_NUMBER` is the built-in environment variable that holds the total count of builds for this project in Codemagic.
  * `your-username` is your Git service username
  * `APP_PASSWORD` is the name of the environment variable that holds your app password / personal access token.
  * `your-git-service.com` is the name of your Git service, e.g. github.com, bitbucket.com, or gitlab.com.
  * `your-repo` is the name of your repository

  Before creating the tag, the script will check if the build was successful.

{{<notebox>}}
**Note:** Make sure to use the `https` repository URL for pushing. Using the `ssh` format is not supported with app passwords or personal access tokens.
{{</notebox>}}

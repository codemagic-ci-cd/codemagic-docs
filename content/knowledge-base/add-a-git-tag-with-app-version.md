---
description: Create a Git tag referencing your app version
title: Adding a Git tag with app version
weight: 2
aliases:
  - '../custom-scripts/add-a-git-tag-with-app-version'
---

You can use Codemagic to create a Git tag and push it to your repository.

{{<notebox>}}

Pushing Git tags from Codemagic to repository requires **write access** to the repository. Depending on the Git service and authentication method, Codemagic may not have write access to your repository and you may need to grant it separately in your Git service settings. We recommend that you create a dedicated app password / personal access token for Codemagic.

* For repositories hosted on Bitbucket, create an [app password](https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html) with **write** permission for repositories.
* For repositories hosted on GitHub, create a [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with **repo** scope.
* For repositories hosted on GitLab, create a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) with **write_repository** scope.

{{</notebox>}}

1. Add your app password / personal access token to Codemagic as a secure [environment variable](../building/environment-variables).

2. Add the following **pre-publish script**.  Note that you need to replace the placeholders with your actual environment variable name and Git service details.

  ```bash
  #!/usr/bin/env sh

  set -e # exit on first failed commandset
  set -x # print all executed commands to the log

  if [ "$FCI_BUILD_STEP_STATUS" == "success" ]
  then
    new_version=v1.0.$BUILD_NUMBER
    git tag $new_version
    git push "https://your-username:$APP_PASSWORD_ENV_VARIABLE@your-git-service.com/your-repo.git" --tags
  fi
  ```

  Where:

  * `BUILD_NUMBER` is the read-only environment variable that holds the total count of builds for this project in Codemagic.
  * `your-username` is your Git service username
  * `APP_PASSWORD_ENV_VARIABLE` is the name of the environment variable that holds your app password / personal access token.
  * `your-git-service.com` is the name of your Git service, e.g. github.com, bitbucket.com or gitlab.com.
  * `your-repo` is the name of your repository

  Before creating the tag, the script will check if the build was successful.

{{<notebox>}}
Make sure to use the `https` repository URL for pushing. Using the `ssh` format is not supported with app passwords or personal access tokens
{{</notebox>}}

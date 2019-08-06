---
description: Create a Git tag referencing your app version
title: Add a Git tag with app version
weight: 2
---

You can use this **pre-publish** script to create a Git tag referencing your app version and push it to your repository. Before creating the tag, the script will check if the build was successful.

1. In **App settings > Environment variables**, save your Git service username and email address as [environment variables](https://docs.codemagic.io/building/environment-variables/) (e.g. `GIT_USERNAME` and `GIT_EMAIL`).
2. Click on the + sign between **Build** and **Publish** and add the following **pre-publish** script.

```
       #!/usr/bin/env sh

       set -e # exit on first failed commandset
       set -x # print all executed commands to the log

       if [ "$FCI_BUILD_STEP_STATUS" == "success" ]
       then
         new_version=v1.0.$BUILD_NUMBER
         git config --global user.name $GIT_USERNAME
         git config --global user.email $GIT_EMAIL
         git tag $new_version
         git push --tags
       fi
```

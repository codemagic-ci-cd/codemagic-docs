---
description: 
title: Repository settings
weight: 8
aliases:
---

Navigate to **App settings > Repository settings** to update repository access settings, change the app name or icon in Codemagic, archive or delete the app.

Note that if the app is part of a team, only team admins can update repository access settings or delete the app.

## Updating access to the repository

You may need to update repository access settings if the repository has been renamed or relocated, or when you need to update the username and password or the private key used to access it.

If the repository is added **via GitHub, Bitbucket or GitLab integration**, click the **Update repository URL** button. Codemagic will attempt to automatically update the URL based on the repository ID.

If the repository is added **from a URL**, click **Change settings** under **Repository access settings**. This will allow you to modify the repository URL, change username or password or update the SSH key. You can also generate a new private key in the settings section. Once you have changed the relevant settings, click **Update access settings**. Codemagic will verify that it has access to the repository using the updated details before saving the settings.



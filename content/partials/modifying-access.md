---
description: 
title: Repository settings
weight: 8
aliases:
---

Navigate to **App settings > Repository settings** to update repository access settings, change the app name or icon in Codemagic, archive or delete the app.

Note that if the app is part of a team, only team admins can update repository access settings or delete the app.

## Updating access to the repository

If Codemagic no longer has access to your repository, you may need to update your repository access settings. This can happen for several reasons, for example:

* the repository has been renamed
* the repository has been moved to a different organization or Git provider
* the username and password used to authenticate have changed
* the private SSH key has expired, or you want to rotate keys

To update repository access settings, navigate to **App settings > Repository settings > Repository URL** and click **Change repository**. This opens a modal for reconfiguring the repository. Select a suitable authentication method and follow the steps to set up access to the repository. To confirm the changes and exit the flow, click **Change repository** in the modal.

Before saving the changes, Codemagic will verify that it has access to the repository. 

---
description: How to add an app to Codemagic from Bitbucket
title: Adding apps from Bitbucket
weight: 4
aliases:
---

For the best integration with the Git provider, it’s recommended to connect your Bitbucket repositories using the repository integration built in to Codemagic. 

Adding apps from Bitbucket requires granting access to your Bitbucket account to enable the integration and load repositories.

1. Click **Add application** in the top right corner of the Applications page.
2. If you are an admin in a team in Codemagic, you'll be asked to **Select a team**. You can only add the application to a team that has billing enabled. If you don't own any teams, this step is skipped and the application will be added to your personal account.
3. Select **Bitbucket** as the Git provider and click **Next: Authorize integration**. A new window appears for you to authorize Codemagic. Confirm the authorization by clicking **Grant access**. If you have already authorized Bitbucket, click **Next: Select repository** instead.
4. Set up the application by selecting the repository from the dropdown menu and specifying the project type. Click **Finish: Add application**. You will be then redirected to the app settings.

>See the getting started guides and [sample projects](../sample-projects/codemagic-sample-projects/) configured with [codemagic.yaml](../getting-started/yaml/) to set up your project. Alternatively, Flutter apps can be also configured using the [Flutter workflow editor](../flutter-configuration/flutter-projects/).

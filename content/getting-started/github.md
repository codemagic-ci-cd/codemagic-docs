---
description: How to add an app to Codemagic via GitHub App
title: Adding apps from GitHub
weight: 3
aliases:
  - '../getting-started/codemagic-github-app'
  - '../getting-started/github-organization-accounts'
---

For the best integration with the Git provider, it’s recommended to connect your GitHub repositories using the repository integration built in to Codemagic. 

Adding apps from GitHub requires authorizing Codemagic and installing the Codemagic CI/CD GitHub App to a GitHub account or an organization to be able to load the repositories.

1. Click **Add application** in the top right corner of the Applications page.
2. **Select a team** where to add an application. By default, the application will be added to your personal account. You can add an application only to a team with enabled billing. This step is skipped if you don’t have teams where you’re an owner, and application will be added to your personal account.
3. Select **GitHub** as the Git provider. If you have already set up the integration, click **Next: Select repository** and skip to step 4. If the GitHub integration has not been set up, you'll see click **Next: Authorize integration** instead. A new window appears for you to authorize Codemagic. Confirm the authorization by clicking **Authorize Codemagic CI/CD**.
4. In the next step, click **Install GitHub App** to set up the integration. A GitHub page opens in a new window. Select the account or an organization where to install the app and choose whether to give Codemagic access to all the repositories from this account or only selected ones. Finish the installation by clicking **Install & Authorize**.
5. Finally, set up the application by selecting the repository from the dropdown menu and specifying the project type. Click **Finish: Add application**. You will be then redirected to the app settings.

>See the getting started guides and [sample projects](../sample-projects/codemagic-sample-projects/) configured with [codemagic.yaml](../getting-started/yaml/) to set up your project. Alternatively, Flutter apps can be also configured using the [Flutter workflow editor](../flutter-configuration/flutter-projects/).

## Configuring the GitHub App integration

Codemagic uses the [Codemagic CI/CD GitHub App](https://github.com/apps/codemagic-ci-cd) to integrate with GitHub. To share your GitHub repositories with Codemagic, Codemagic GitHub App will have to be installed on the account or organization in GitHub from which you would like to build applications.

{{<notebox>}}
Note that the GitHub App integration can be connected separately for your personal account and each team. The integrations configured for your personal account apply to the apps that are not part of a team in Codemagic. While teams inherit the integrations from the team owner's personal account, it is highly recommended to set up repository integrations separately in team settings.
{{</notebox>}}

1. In your user or team settings in Codemagic, navigate to the Integrations section and locate the GitHub App integration. The next steps may vary slightly depending on whether you have already authorized Codemagic or have the Codemagic GitHub App installed.
2. Click **Connect** next to the GitHub App integration, and when redirected to GitHub, click **Authorize Codemagic**.
3. Back in the Integrations section, click **Finish installation** and then **Install app**. Note that at this stage you can also revoke your authorization of the app by clicking **Disconnect**.
4. A popup window opens for you to select the organization or account where to install the app. Pick the installation location. You can later install the app to additional accounts.
5. Then choose whether to share **All repositories** from the account or select the repositories to share by choosing **Select repositories only**.
6. Click **Install & Authorize** to finish installation (you may be asked to confirm that action by entering your password). If you do not have permission to install the app under an organization, you will see the button **Authorize & Request** instead. An approval from the organization owner or app manager is needed to authorize the installation.

## Managing connected GitHub accounts and organizations

In the Integrations section in your user or team settings, click **Manage integration > Configure**. You can then select an account to configure or install Codemagic GitHub App to additional accounts. The accounts that already have Codemagic GitHub App installed are marked with "Configure". 

![Integrations > GitHub App > Manage integration > Configure](../uploads/gh-app-conf.png)

You can also access the same settings in GitHub by going directly to [https://github.com/apps/codemagic-ci-cd](https://github.com/apps/codemagic-ci-cd) and clicking **Configure**.

These settings allow you to revisit your repository access configuration should you want to share access to additional repositories or revoke access to a previously shared repository. In addition, you can disconnect an account by clicking **Uninstall** in the danger zone.

If you revoke access to previously shared repositories, you will still see all your apps and build history but won't be able to build the apps to which Codemagic no longer has access. Such apps will be grayed out and will show up on the Applications page with the **Removed from repository** filter.

## Disconnecting Codemagic GitHub App integration

The Codemagic CI/CD GitHub App integration can be disabled by clicking **Manage integration > Disconnect** in **User settings > Integrations > GitHub App** for your personal account or in **Team settings > Team Integrations > GitHub App** to disconnect it from the team. This will delete the GitHub access token that Codemagic had stored which means we no longer interact with GitHub.

To completely remove the integration, **uninstall** the Codemagic CI/CD app and revoke the authorization in GitHub. Visit [https://github.com/settings/installations](https://github.com/settings/installations) for personal accounts or github.com/organizations/your-organization/settings/installations for organization accounts to check whether Codemagic CI/CD is listed both under installed and authorized GitHub Apps.

## Repository is unavailable

Here are some tips on what to check if you can't see your repository listed in Codemagic or it's shown as unavailable.

* If you chose to grant access to **select repositories only** as opposed to all repositories when setting up the GitHub App, make sure you have also granted access to the repository in question. Click **Manage integration > Configure** in team or user integrations to configure repository access settings.
* Your personal Codemagic account and each team have separate integrations. Make sure you have connected the GitHub App integration to the right team or in your user settings.
* If you build apps from different GitHub accounts or organizations, make sure that you have installed the GitHub App on the account that has the repository available. Click **Manage integration > Configure** to see which accounts have been connected. You can also visit [https://github.com/settings/installations](https://github.com/settings/installations) for personal accounts or github(dot)com/organizations/your-organization/settings/installations for organization accounts to check whether Codemagic CI/CD is listed both under installed and authorized GitHub Apps.
* Private GitHub repositories can be shared with Codemagic only when the GitHub App is installed on the account that owns the repository. If you are a collaborator to a private repository, please ask the repository owner to install Codemagic GitHub App in GitHub: [https://github.com/apps/codemagic-ci-cd](https://github.com/apps/codemagic-ci-cd)

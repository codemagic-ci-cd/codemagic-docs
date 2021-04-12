---
title: Migrating from GitHub OAuth to GitHub App
weight: 1
---

On April 19, 2021, Codemagic will deprecate the GitHub OAuth integration due to GitHub ending support for OAuth App integrations, you can read more about it [here](https://developer.github.com/changes/2020-02-14-deprecating-oauth-app-endpoint/). We are asking everyone currently logging in and accessing their GitHub repositories in Codemagic via the GitHub OAuth integration to switch to the GitHub App to continue building their GitHub repositories after the deprecation date.

## Who are affected?

If you signed up or log in to Codemagic via GitHub (All repositories, OAuth), then this means we are using the OAuth integration to access the repositories on your GitHub account. In the Integrations section in your user or team settings, you can see the GitHub OAuth integration enabled.

GitHub repositories accessed via OAuth are marked with a yellow warning icon in your list of applications. A warning is also displayed in the team settings if any of the apps shared in a team is accessed via the OAuth integration. Once the OAuth integration is removed, such repositories will no longer be accessible unless you switch to GitHub App.

Deprecating OAuth does not affect GitHub repositories that are added over SSH or HTTPS.

## GitHub OAuth vs GitHub App

The key difference between OAuth and GitHub App integrations is the scope of permissions. While OAuth requires you to grant Codemagic **write access** to all your repositories, the GitHub App integration requests only **read access** to your code and you can select which repositories you share with Codemagic.

In addition, the GitHub App integration will also make it possible to use [GitHub Checks](../building/github-checks).

### Deprecting GitHub releases in Flutter workflow editor

Without write access to the repository, Codemagic will no longer be able to push GitHub releases without additional configuration. Therefore, we will be removing the GitHub releases section from Flutter workflow editor. You can continue to publish GitHub releases by setting up a personal access token and using a custom script in the ... step.

...

## Switching to GitHub App

From April 19 onwards, users logging in to Codemagic with their GitHub account will be prompted to authorize and install the GitHub App if they do not already have it installed.

If you log in via email, Bitbucket or GitLab but have repositories that are accessed via the GitHub OAuth integration, you should enable the GitHub App integration in your user or team settings.

### Enabling the GitHub App intgeration in Codemagic

GitHub App can be enabled separately for your **personal account** in Codemagic user settings or for a **team** in team settings. 

{{<notebox>}}
Note that teams use team owner's integrations configured in their user settings if no integrations are connected in Team integrations. We recommend setting up the integrations for teams in Team integrations.
{{</notebox>}}

1. In your team or user settings, navigate to the integrations section.
2. Click **Connect** next to the GitHub App integration.
3. You will be redirected to GitHub to authorize Codemagic, click **Authorize Codemagic**. 
4. Back in the Integrations section, click **Finish installation** and then **Install app**. Note that at this stage you can also revoke your authorization of the app by clicking **Disconnect**.
5. A popup window opens for you to select the organization or account where to install the app. Pick the installation location.
6. Then choose whether to share **All repositories** from the account or configure the repositories to share by choosing **Select repositories only**.
7. Click **Install & Authorize** to finish installation (you may be asked to confirm that action by entering your password).

    If you do not have the permission to install the app under an organization, you will see the button **Authorize & Request** instead. An approval from the organization owner or app manager is needed to authorize the installation of the app.

Once you have successfully enabled the GitHub App integration, you can click **Manage integration** in Integrations to install the app to another account, configure the shared repositories or disconnect the integration.

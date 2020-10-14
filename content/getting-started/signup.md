---
description: Sign up to Codemagic CI/CD
title: Signing up to Codemagic
weight: 1
aliases:
  - '../getting-started/codemagic-github-app'
  - '../getting-started/github-organization-accounts'
---

You can sign up to Codemagic using a GitHub, GitLab or Bitbucket account and then add apps from any self-hosted or cloud-based Git repository, see [Adding repositories](./adding-apps-from-custom-sources).

## Sign up via OAuth

Instead of creating a separate account for Codemagic, you can use your [GitHub](https://github.com/), [GitLab](https://about.gitlab.com/) or [Bitbucket](https://bitbucket.org/) account to sign up via OAuth. On signup, Codemagic asks for **read/write** permission to access your repositories and create webhooks for automatic building. You will need to authorize Codemagic in order to connect your GitHub/GitLab/Bitbucket account to your Codemagic account.

### GitHub organization accounts

Organizations can restrict access to third-party OAuth applications. As a member, you can request that organization admins authorize the application for use in that organization.

1. In your GitHub settings, navigate to **Organization settings** > **Third-party access**.
2. If you don't see Codemagic listed there, go to **Personal settings** > **Applications** > **Authorized OAuth Apps**.
3. Click on the Codemagic app.
4. Under **Organization access**, click **Request access** > **Request approval from owners**.

Read more about [GitHub organizations and OAuth app restrictions](https://help.github.com/en/articles/authorizing-oauth-apps#oauth-apps-and-organizations).

## Sign up via Codemagic GitHub app

The GitHub app integration has several advantages over the OAuth integration as you can grant Codemagic access to select repositories and only **read** access to your code is required.

1. Click **Join using GitHub App** at [codemagic.io/signup](https://codemagic.io/signup). You will be authorized via GitHub without granting any access to your repositories. 
2. In Codemagic, go to **User settings > Integrations** and click **Install GitHub App**. You will be redirected to GitHub to select the repositories you want to grant access to and finish the installation. 

You can change repository access settings in Codemagic CI/CD app on GitHub anytime by navigating to **Settings > Applications > Installed GitHub Apps > Codemagic CI/CD**, or by going to [https://github.com/apps/codemagic-ci-cd](https://github.com/apps/codemagic-ci-cd). Note that the settings you configure in Codemagic CI/CD GitHub app prevail over the GitHub OAuth integration settings.

### Revoking access to previously shared repositories

If you revoke access to previously shared repositories, you will still see all your apps and build history but won't be able to build the apps to which Codemagic no longer has access. Such apps will be grayed out and will show up on the Applications page with the **Removed from repository** filter. Apps connected through your Bitbucket or GitLab account as well as apps added from custom sources will remain available as is.

### Team apps

The restrictions you configure in GitHub app apply to the repositories you share in your Codemagic team only if you don't have the GitHub integration enabled for your team in **Team settings > Team integrations**.

If you have enabled the GitHub integration for your team, the connected account makes use of OAuth permissions and the restrictions you configure in GitHub app do not apply.

{{<notebox>}}
Currently, Codemagic has no way of knowing whether it has access to team apps before the build is started. Due to this, team apps to which you have revoked access in the GitHub app may not appear grayed out in the UI.
{{</notebox>}}

### Disabling Codemagic CI/CD GitHub app integration

You can disable the Codemagic CI/CD GitHub app integration in Codemagic by navigating to **User settings > Integrations > GitHub App** and clicking **Disconnect**. This annuls all settings configured for the Codemagic app in GitHub but won't delete your buid history.

The GitHub app integration is also disabled when you **uninstall** the Codemagic CI/CD app in GitHub. You can still log in to Codemagic with the GitHub app and see your build history if Codemagic CI/CD remains an **authorized GitHub app** in GitHub. Please note that unless you have other active integrations (e.g. GitHub, Bitbucket or GitLab OAuth integration), your Codemagic account will be deleted in two weeks. You can cancel account deletion by navigating to **User settings > Delete account** and clicking **Cancel deletion** before the two weeks are up.

## Connecting several repository integrations

You can connect several repository accounts (GitHub, GitHub app, GitLab, Bitbucket) with one Codemagic account.

1. Log in to Codemagic with the account you signed up.
2. Click on your account avatar at the bottom left and open **User settings**.
3. In the **Integrations** section, click **Connect** next to the account you would like to connect to Codemagic.

Once you have connected another account to your Codemagic account, you can log in to Codemagic with either of these accounts. Email notifications with build status reports will be sent to the email address that's connected with the repository from which you build.

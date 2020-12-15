---
description: Sign up to Codemagic CI/CD
title: Signing up to Codemagic
weight: 1
aliases:
  - '../getting-started/codemagic-github-app'
  - '../getting-started/github-organization-accounts'
---

You can sign up to Codemagic using a GitHub, GitLab or Bitbucket account or a regular email address. After signup, you can add apps from any self-hosted or cloud-based Git repository, see [Adding repositories](./adding-apps-from-custom-sources).

## Sign up via GitHub

Codemagic offers two types of integration with GitHub.

Select **All repositories** to sign up via OAuth. This integration requires read/write access to your repositories and is the preferred integration method if you're looking to publish GitHub releases or push tags to the repository.

Select **Selected repositories only** to sign up using Codemagic GitHub app. This integration requires read access to your code and you can grant access to selected repositories only. Note that you will also need to [install the Codemagic CI/CD GitHub app](https://github.com/apps/codemagic-ci-cd) to share repositories. This is the preferred integration method if you want to use GitHub Checks. Read more about the integration [here](#sign-up-via-codemagic-github-app).

### All repositories (OAuth)

Instead of creating a separate account for Codemagic, you can use your [GitHub](https://github.com/) account to sign up to Codemagic. 

When authenticating via OAuth, Codemagic asks for **read/write** permission to access your repositories and create webhooks for automatic building. Write permission is also required for pushing tags to the repository. 

You will need to authorize Codemagic to connect the GitHub account to your Codemagic account. Once you log in to Codemagic, you will see all your GitHub repositories listed.

{{<notebox>}}
**Can't see your GitHub organization repositories?**

Organizations can restrict access to third-party OAuth applications. As a member, you can request that organization admins authorize the application for use in that organization.

1. In your GitHub settings, navigate to **Organization settings** > **Third-party access**.
2. If you don't see Codemagic listed there, go to **Personal settings** > **Applications** > **Authorized OAuth Apps**.
3. Click on the Codemagic app.
4. Under **Organization access**, click **Request access** > **Request approval from owners**.

Read more about [GitHub organizations and OAuth app restrictions](https://help.github.com/en/articles/authorizing-oauth-apps#oauth-apps-and-organizations).
{{</notebox>}}

### Selected repositories (GitHub app)

With the GitHub app integration, you have more control over the repositories you share with Codemagic, and instead of write access, only **read** access to your code is required.

1. Click **GitHub** at [codemagic.io/signup](https://codemagic.io/signup) and select **Selected repositories only** to sign up via Codemagic GitHub app. 
2. Click **Authorize Codemagic** to verify your identity. You will be authenticated via GitHub without granting access to any of your repositories.
3. In Codemagic, click **Install GitHub App** on the Applications page. If you already have another repository integration enabled for your personal account, you can find the installation button in **User settings > Integrations > Install GitHub App**. 
4. You will be then redirected to GitHub to proceed with installation. Click **Install**.
5. Next, select the GitHub account or organization where you want to install the app.
6. Select whether to grant access to **All repositories** or select the repositories to share one by one by choosing **Only select repositories**.
7. Click **Install & Authorize** (you may be asked to confirm that action by entering your password). After successful installation, you will be redirected back to Codemagic and you can see the status for the GitHub App integration as connected.

#### Configuring accounts and repository access settings

If you want to install Codemagic GitHub App to another GitHub account/organization or change repository access settings, navigate to **GitHub > Settings > Applications > Installed GitHub Apps > Codemagic CI/CD** or go directly to [https://github.com/apps/codemagic-ci-cd](https://github.com/apps/codemagic-ci-cd) and click **Configure**. Note that the settings you configure in Codemagic CI/CD GitHub app prevail over the GitHub OAuth integration settings.

If you revoke access to previously shared repositories, you will still see all your apps and build history but won't be able to build the apps to which Codemagic no longer has access. Such apps will be grayed out and will show up on the Applications page with the **Removed from repository** filter.

#### Team apps

The repository access settings configured in Codemagic GitHub app apply to the repositories you share in your Codemagic team only if:

* GitHub app integration is connected in **Team settings > Team integrations**.
* The primary team owner has connected the GitHub app integration for their personal account in **User settings > Integration** and the team has not enabled the GitHub integration. If the regular GitHub integration is enabled for the team, the connected account makes use of OAuth permissions and the restrictions you configure in GitHub app do not apply.

{{<notebox>}}
Currently, Codemagic has no way of knowing whether it has access to team apps before the build is started. Due to this, team apps to which you have revoked access in the GitHub app may not appear grayed out in the UI.
{{</notebox>}}

#### Disabling Codemagic GitHub app integration

You can disable the Codemagic CI/CD GitHub app integration in Codemagic by navigating to **User settings > Integrations > GitHub App** and clicking **Disconnect**. This annuls all settings configured for the Codemagic app in GitHub but won't delete your buid history.

The GitHub app integration is also disabled when you **uninstall** the Codemagic CI/CD app in GitHub. You can still log in to Codemagic with the GitHub app and see your build history if Codemagic CI/CD remains an **authorized GitHub app** in GitHub. Please note that unless you have other active integrations (e.g. GitHub, Bitbucket or GitLab OAuth integration), your Codemagic account will be deleted in two weeks. You can cancel account deletion by navigating to **User settings > Delete account** and clicking **Cancel deletion** before the two weeks are up.

## Sign up via Bitbucket or GitLab

Instead of creating a separate account for Codemagic, you can use your [Bitbucket](https://bitbucket.org/) or [GitLab](https://about.gitlab.com/) account to sign up to Codemagic. 

When authenticating via OAuth, Codemagic asks for **read/write** permission to access your repositories and create webhooks for automatic building. Write permission is also required for pushing tags to the repository. 

You will need to authorize Codemagic to connect the Bitbucket/GitLab account to your Codemagic account. Once you log in to Codemagic, you will see all your GitHub repositories listed.

## Sign up via email

Enter your email address and name and click **Create account** to get started. Codemagic will then send a six-character authentication key on the provided email address. Enter the authentication key and click **Continue** to verify the email address and finish signup. Note that an unused key expires in 10 minutes. 

You will be sent a new authentication key every time you need to log in again.

## Connecting several repository integrations

You can connect several repository accounts (GitHub, GitHub app, GitLab, Bitbucket) with one Codemagic account or Codemagic team (read more about managing team integrations [here](../teams/teams/#managing-team-integrations)).

1. Log in to Codemagic with the account you signed up.
2. Click on your account avatar at the bottom left and open **User settings**.
3. In the **Integrations** section, click **Connect** next to the account you would like to connect to Codemagic.

Once you have connected another account to your Codemagic account, you can log in to Codemagic with either of these accounts. Email notifications with build status reports will be sent to the email address that's connected with the repository from which you build.

{{<notebox>}}
Note that if you have connected both GitHub and GitHub App, the GitHub App integration will prevail.
{{</notebox>}}
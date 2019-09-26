---
description: Configure repository access and customize your CI flow
title: Codemagic GitHub app (beta)
weight: 6
---

Codemagic CI/CD GitHub app is an integration with GitHub which enables you to make the most out of the two services for your CI flow. The GitHub app requires less permissions than the OAuth integration and enables you to grant access to select repositories only.

## Installing Codemagic CI/CD GitHub app

There are two options for installing the Codemagic GitHub app.

**Option 1: Install Codemagic CI/CD on GitHub**

1. Log in to your GitHub account.
2. Open the [Codemagic CI/CD app on Marketplace](https://github.com/marketplace/codemagic-ci-cd).
3. Scroll down and click **Install it for free**.
4. Review your order and click **Complete order and begin installation**.
5. Next, select the repositories to which you want to give Codemagic access and click **Install & Authorize** to finish installation.

You will then be logged in and redirected to your Applications page on Codemagic so that you can start building right away. The next time you want to log in to Codemagic via the GitHub app, you can click the **Log in with GitHub App** link on the login page.

You can change repository access settings in Codemagic CI/CD app on GitHub anytime by navigating to Settings > Applications > Installed GitHub Apps > Codemagic CI/CD, or by going to [https://github.com/apps/codemagic-ci-cd](https://github.com/apps/codemagic-ci-cd).

**Option 2. Sign up to Codemagic using GitHub app**

1. Click **Join using GitHub App** at [codemagic.io/signup](codemagic.io/signup). You will be authorized via GitHub without granting any access to your repositories. 
2. In Codemagic, go to User settings > Integrations and click **Install GitHub App**. You will be redirected to GitHub to select the repositories you want to grant access to and finish the installation. **Note** that you can also proceed without installing the app. This way, you can only build apps shared with you in a team you belong to or add apps from custom sources.

## Revoking access to previously shared repositories

The settings you configure in Codemagic CI/CD GitHub app prevail over the OAuth integration settings.

If you revoke access to previously shared repositories, you will still see all your apps and build history but won’t be able to build the apps to which Codemagic no longer has access. Such apps will be grayed out and will show up on the Applications page with the **Removed from repository** filter. Apps connected through your Bitbucket or GitLab account as well as apps added from custom sources will remain available as is.

### Team apps

- The restrictions you configure in GitHub app apply to the repositories you share in your team on Codemagic only if you don't have the GitHub integration enabled for your team in Team settings > Team integrations.
- If you have enabled the GitHub integration for your team, the connected account makes use of OAuth permissions and the restrictions you configure in GitHub app do not apply.

{{% notebox %}}
Currently, Codemagic has no way of knowing whether it has access to team apps before the build is started. Due to this, team apps to which you have revoked access in the GitHub app may not appear grayed out in the UI.
{{% /notebox %}}

## Disabling Codemagic CI/CD GitHub app integration

You can disable the Codemagic CI/CD GitHub app integration in Codemagic by navigating to User settings > Integrations > GitHub App and clicking **Disconnect**. This annuls all settings configured for the Codemagic app in GitHub but won't delete your buid history.

The GitHub app integration is also disabled when you uninstall Codemagic CI/CD app in GitHub. Uninstalling the app does not delete you build history. 





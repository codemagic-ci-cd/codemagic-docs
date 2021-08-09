---
title: Signup
weight: 1
aliases:
---

You can sign up to Codemagic using a [GitHub](https://github.com/), [Bitbucket](https://bitbucket.org/) or [GitLab](https://about.gitlab.com/) account, or via email. SSO integrations for enterprises are available on request.

After signup, you can easily add repositories from the above Git providers or any self-hosted or cloud-based Git repository, see [Adding repositories](./adding-apps-from-custom-sources).
## Sign up via GitHub, Bitbucket or GitLab

When signing up via GitHub, you will be asked to authorize Codemagic to authenticate yourself without giving any access to your repositories. To add apps from GitHub, you also need to install the Codemagic CI/CD GitHub App, read more about it [here](../getting-started/adding-apps-from-custom-sources/#adding-apps-from-github).

When authenticating using a Bitbucket or GitLab account via OAuth, Codemagic asks for access to your account and repositories so they can be listed when you're adding applications. You will need to authorize Codemagic to connect the Bitbucket/GitLab account to your Codemagic account.
## Sign up via email

Enter your email address and name and click **Create your account** to get started. Codemagic will then send a six-character authentication key to the provided email address. Enter the authentication key and click **Continue** to verify the email address and finish signup. Note that an unused key expires in 10 minutes. 

You will be sent a new authentication key every time you need to log in again.
## Connecting several repository integrations

You can connect several repository accounts (GitHub, GitLab, Bitbucket) with one Codemagic account or Codemagic team (read more about managing team integrations [here](../teams/teams/#managing-team-integrations)).

1. Log in to Codemagic with the account you signed up.
2. Click on your account avatar at the bottom left and open **User settings**.
3. In the **Integrations** section, click **Connect** next to the account you would like to connect to Codemagic.

Once you have connected another account to your Codemagic account, you can log in to Codemagic with either of these accounts. Email notifications with build status reports will be sent to the email address that's connected with the repository from which you build.

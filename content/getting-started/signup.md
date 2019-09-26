---
description: Sign up for Codemagic CI/CD
title: Signup
weight: 1
---
## Sign up via OAuth

You can sign up with your [GitHub](https://github.com/), [GitLab](https://about.gitlab.com/) or [Bitbucket](https://bitbucket.org/) account via OAuth. On signup, Codemagic asks for **read/write** permission to access your repositories and create webhooks for automatic building. You will need to authorize Codemagic in order to connect your GitHub/GitLab/Bitbucket account to your Codemagic account.

{{% notebox %}}

Please be assured that Codemagic will not store any of your source code or use your data for any other purpose than providing continuous integration and delivery service to you.

{{% /notebox %}}

## Sign up via Codemagic GitHub app

You can become a Codemagic user by installing the Codemagic CI/CD app on GitHub or clicking **Join using GitHub App** at [https://codemagic.io/signup](https://codemagic.io/signup). The GitHub app has several advantages over the OAuth integration as you can grant Codemagic access to select repositories and only **read** access to your code is required. For details and installation instructions, see the [Codemagic GitHub app](./codemagic-github-app) section in our documentation.

## Connecting several repository accounts

You can connect several repository accounts (GitHub, GitHub app, GitLab, Bitbucket) with one Codemagic account.

1. Log in to Codemagic with the account you signed up.
2. Click on your account avatar at the bottom left and open **User settings**.
3. In the **Integrations** section, click **Connect** next to the account you would like to connect to Codemagic.

Once you have connected another account to your Codemagic account, you can log in to Codemagic with either of these accounts. Email notifications with build status reports will be sent to the email address that’s connected with the repository from which you build.

---
description: How to add an app to Codemagic from any private or public repository
title: Adding apps from other repositories
weight: 6
aliases: /getting-started/adding-apps-from-custom-sources

---

Apps that cannot be added via a repository integration can be cloned from a URL. Authentication for private repositories can be set up via HTTPS or SSH.

## Connecting repository via SSH

1. Click **Add application** in the top right corner of the Applications page.
2. Select **Other** and click **Next: Select repository**.
3. Enter the **Repository URL** for **cloning** the repository. You can find the URL from your repository by clicking **Clone** / **Clone or download**. Usually, the URL is in this format: `git@example.com:username/repo.git`.
4. Upload the **SSH private key** file. If your key is password-protected, enter the **Private key passphrase**.

   **Alternatively**, you can click **Generate key pair** and have Codemagic create an SSH key pair for you, read more about it [below](#generating-a-key-pair-in-codemagic).

5. Finish setting up the application by selecting the project type and clicking **Finish: Add application**. You will be then redirected to the app settings.

>See the getting started guides and [sample projects](../sample-projects/codemagic-sample-projects/) configured with [codemagic.yaml](../getting-started/yaml/) to set up your project. Alternatively, Flutter apps can be also configured using the [Flutter workflow editor](../flutter-configuration/flutter-projects/).

### Generating a key pair in Codemagic

On clicking **Generate key pair**, Codemagic creates a secure 4096 bit SSH key pair. The private key will be used in Codemagic and the public key must be added to your repository settings. Click **Copy to clipboard** to copy the public key.

- If your repository is hosted on [GitHub](https://developer.github.com/v3/guides/managing-deploy-keys/#setup-2), [GitLab](https://www.deployhq.com/support/projects/updating-your-project-repository/uploading-your-public-key-to-gitlab-manually) or [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html), add the public key to your repository's access/deployment keys.
- For self-hosted repositories, request your git server admins to allow access to the provided public key.

After you have added the public key to your repository settings, finish adding the app by clicking **Finish: Add application**.

{{<notebox>}}Don't close the module before you have finished adding the app, otherwise, you'll need to start over and generate a new SSH key.{{</notebox>}}

## Connecting repository via HTTP/HTTPS

1. Click **Add application** in the top right corner of the Applications page.
2. Select **Other** and click **Next: Select repository**.
3. Enter the **Repository URL** for **cloning** the repository. You can find the URL from your repository by clicking **Clone** / **Clone or download**. Usually, the URL is in this format: `https://example.com/path/to/repository.git`.
4. If the repository is private, then enter your **Username** and **Password**, or **Username** and [**Personal access token**](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) if it's a GitHub repository. In the case of a public repository, select **Public repository**.
5. Finish setting up the application by selecting the project type and clicking **Finish: Add application**. You will be then redirected to the app settings.

>See the getting started guides and [sample projects](../sample-projects/codemagic-sample-projects/) configured with [codemagic.yaml](../getting-started/yaml/) to set up your project. Alternatively, Flutter apps can be also configured using the [Flutter workflow editor](../flutter-configuration/flutter-projects/).

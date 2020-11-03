---
description: Add your mobile app from any private or public repository
title: Adding repositories
weight: 2
---

When you sign up via OAuth, Codemagic already has access to the repositories you have available on your Git provider account. However, you can add apps from public or private as well as from cloud-based or self-hosted Git repositories. 

{{<notebox>}}
* Note that webhooks for automatic build triggering need to be [created manually](../building/webhooks).
{{</notebox>}}

## Connecting repository via SSH

1. Click **Add app from custom source** on the Applications page.

    {{< figure size="medium" src="../uploads/add-app-from-custom-source1.png" caption="" >}}

2. Enter the **Repository URL** for **cloning** the repository. Usually, the URL is in this format: ` git@example.com:username/repo.git `.
3. Upload the **SSH private key** file. If your key is password-protected, enter the **Private key passphrase**. 

    **Alternatively**, you can click **Generate key pair** and have Codemagic create an SSH key pair for you, read more about it [below](#generating-a-key-pair-in-codemagic).
4. Click **Add application**.

You can then continue configuring your project by selecting a starter workflow.

{{<notebox>}}If you need to update the private key in Codemagic, you can upload or generate a new one in **App settings > Repository settings > Repository access settings**.{{</notebox>}}

### Generating a key pair in Codemagic

On clicking **Generate key pair**, Codemagic creates a secure 4096 bit SSH key pair. The private key will be used in Codemagic and the public key must be added to your repository settings. Click **Copy to clipboard** to copy the public key.

* If your repository is hosted on [GitHub](https://developer.github.com/v3/guides/managing-deploy-keys/#setup-2), [GitLab](https://www.deployhq.com/support/projects/updating-your-project-repository/uploading-your-public-key-to-gitlab-manually) or [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html), add the public key to your repository's access/deployment keys.
* For self-hosted repositories, request your git server admins to allow access for the provided public key.

After you have added the public key to your repository settings, finish adding the app by clicking **Add application**.

{{<notebox>}}Don't close the **Add application from custom source** module before you have finished adding the app, otherwise you'll need to start over and generate a new SSH key.{{</notebox>}}

## Connecting repository via HTTP/HTTPS

1. Click **Add repository** on the Applications page.
2. Enter the **Repository URL** for **cloning** the repository. You can find the URL from your repository on clicking **Clone** / **Clone or download**. Usually, the URL is in this format: `https://example.com/path/to/repository.git`.
3. If your repository is private then enter your **Username** and **Password**. Otherwise, check **Public repository** if your repository is public.
4. Click **Add application**.

Your app will be then listed on the Applications page and you can then continue configuring your project by clicking on **Configure for building**.

## Repositories behind firewall

To allow Codemagic access the private repository, the following IP addresses need to be whitelisted:

1. `34.74.234.56` - used by our backend for getting basic information about the repository
2. `199.7.162.128/29` - used by our build servers to download the code and build it

## Modifying repository access settings

When you have moved your repository or need to update the username/password or private key used to access it, you can change the access details in **App settings > Repository settings > Repository access settings**. Once you have changed the relevant settings, click **Update access settings**. Codemagic will verify it has access to the repository using the updated details before saving the settings.

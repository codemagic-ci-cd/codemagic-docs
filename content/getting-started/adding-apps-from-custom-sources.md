---
description: Add your Flutter app wherever it is hosted
title: Adding apps from custom sources
weight: 4
---

You can add apps from public or private Git-based repositories. 

{{<notebox>}}
* Note that webhooks for automatic build triggering need to be [set up manually](../building/automatic-build-triggering/#webhooks).
{{</notebox>}}

## Connecting repository via HTTP/HTTPS

1. Click **Add app from custom source** on the Applications page.

    {{< figure size="medium" src="../uploads/add-app-from-custom-source1.png" caption="" >}}

2. Enter the **Repository URL** for **cloning** the repository. You can find the URL from your repository on clicking **Clone** / **Clone or download**. Usually, the URL is in this format: `https://example.com/path/to/repository.git`.
3. If it's a private repository that requires username and password for authentication, check **Private repository** and enter the **Username** and **Password**. Leave this option unchecked for public repositories.
4. Click **Add app**.

Your app will be then listed on the Applications page and you can immediately start running builds.

## Connecting repository via SSH

1. Click **Add app from custom source** on the Applications page.

    {{< figure size="medium" src="../uploads/add-app-from-custom-source1.png" caption="" >}}

2. Enter the **Repository URL** for **cloning** the repository. Usually, the URL is in this format: ` git@example.com:username/repo.git `.
3. Upload the **SSH private key** file. If your key is password-protected, enter the **SSH key password**. 

    **Alternatively**, you can click **Generate SSH key** and add the public key to your repository, read more about it [below](#generating-the-ssh-key-in-codemagic).
4. Click **Add app**.

Your app will be then listed on the Applications page and you can immediately start running builds.

{{<notebox>}}If you need to update the SSH key, you can upload a new one in **App settings > Repository settings > Update SSH key**.{{</notebox>}}

### Generating the SSH key in Codemagic

On clicking **Generate SSH key**, Codemagic creates a secure 4096 bit key pair. The private key will be used in Codemagic and the public key must be added to your repository settings. Click **Copy to clipboard** to copy the public key.

* If your repository is hosted on [GitHub](https://developer.github.com/v3/guides/managing-deploy-keys/#setup-2), [GitLab](https://www.deployhq.com/support/projects/updating-your-project-repository/uploading-your-public-key-to-gitlab-manually) or [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html), add the public key to your repository's access/deployment keys.
* For self-hosted repositories, request your git server admins to allow access for the provided public key.

After you have added the public key to your repository settings, finish adding the app by clicking **Add application**.

{{<notebox>}}Don't close the **Add application from custom source** module before you have finished adding the app, otherwise you'll need to start over and generate a new SSH key.{{</notebox>}}

## Repositories behind firewall

To allow Codemagic access the private repository, the following IP addresses need to be whitelisted:

1. `34.74.32.93` - used by our backend for getting basic information about the repository
2. `192.159.66.80/28` - used by our builder servers to download the code and build it

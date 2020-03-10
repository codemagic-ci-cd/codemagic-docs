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
4. Click **Add app**.

Your app will be then listed on the Applications page and you can immediately start running builds.

{{<notebox>}}If you need to update the SSH key, you can upload a new one in **App settings > Repository settings > Update SSH key**.{{</notebox>}}

## (Optional) Generate SSH key in Codemagic 
If you don't have an SSH key at hand then Codemagic can generate secure **4096 bit** SSH key for you in-app:

1. Click **Add app from custom source** on the Applications page.
2. Enter the **Repository URL** for **cloning** the repository. Usually, the URL is in this format: ` git@example.com:username/repo.git `.
3. Click **Generate SSH key**.
4. Click **Copy to clipboard** and add this to your repositories Access Keys ([Github](https://developer.github.com/v3/guides/managing-deploy-keys/#setup-2), [Gitlab](https://www.deployhq.com/support/projects/updating-your-project-repository/uploading-your-public-key-to-gitlab-manually), [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html)). For self-hosted repository, request your git server admins to allow the access for the provided public key.
5. After key is added to the repository click **Add application**.

{{<notebox>}}For safety purposes it's important not to close the **Add application from custom source** tab, otherwise you'll need to regenerate the SSH key again.{{</notebox>}}



## Repositories behind firewall

To allow Codemagic access the private repository, the following IP addresses need to be whitelisted:

1. `34.74.32.93` - used by our backend for getting basic information about the repository
2. `192.159.66.80/28` - used by our builder servers to download the code and build it

---
description: Add your Flutter app wherever it is hosted
title: Adding apps from custom sources
weight: 4
---

You can add apps from public or private Git-based repositories. This includes repositories requiring **SSH key authentication**. 

{{<notebox>}}
Note that apps added from custom sources have some limitations.

* Webhooks for automatic build triggering need to be [set up manually](../building/automatic-build-triggering/#webhooks).
* [Automatic builds](../building/automatic-build-triggering) are available on code push and tag creation but not on pull request creation or update.   
{{</notebox>}}

To add an app from custom source:

1. Click **Add app from custom source** on the Applications page.

    {{< figure size="" src="../uploads/add-app-from-custom-source1.png" caption="" >}}

2. Then, fill in all the required fields.

    {{< figure size="" src="../uploads/add-app-from-custom-source2.png" caption="" >}}

    * Enter the **Repository URL** for **cloning** the repository. You can find the URL from your repository on clicking **Clone** / **Clone or download**. Depending on whether you're accessing a public or a private repo, choose either the HTTPS or SSH URL. The most common URL formats are as follows:
    `https://example.com/username/repo.git` or ` git@example.com:username/repo.git `. 

    * If a private key is required to access the repository or any private submodules in it, upload the **SSH private key** file.

    * If the SSH key is password-protected, you'll be also asked to enter the **SSH key password**.

3. Click **Add app**.

Your app will be then listed on the Applications page and you can immediately start running builds.

## Repositories behind firewall

To allow Codemagic access the private repository, the following IP addresses need to be whitelisted:

1. `34.74.32.93` - used by our backend for getting basic information about the repository
2. `192.159.66.80/28` - used by our builder servers to download the code and build it

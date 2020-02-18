---
description: Add your Flutter app wherever it is hosted
title: Adding apps from custom sources
weight: 4
---

You can add apps from public or private Git-based repositories. 

{{<notebox>}}
Note that apps added from custom sources have some limitations.

* Webhooks for automatic build triggering need to be [set up manually](../building/automatic-build-triggering/#webhooks).
* Using `codemagic.yaml` for build configuration is not supported yet.  

{{</notebox>}}

## Connecting repository via HTTP/HTTPS

1. Click **Add app from custom source** on the Applications page.

    {{< figure size="medium" src="../uploads/add-app-from-custom-source1.png" caption="" >}}

2. Enter the **Repository URL** for **cloning** the repository. You can find the URL from your repository on clicking **Clone** / **Clone or download**. Usually, the URL is in this format: `https://example.com/path/to/repository.git`.

    {{< figure size="medium" src="../uploads/add_app_nourl.png" caption="" >}}

3. If it's a private repository that requires username and password for authentication, check **Private repository** and enter the **Username** and **Password**. Leave this option unchecked for public repositories.

    {{< figure size="medium" src="../uploads/add_app_private.png" caption="" >}}

4. Click **Add app**.

Your app will be then listed on the Applications page and you can immediately start running builds.

## Connecting repository via SSH

1. Click **Add app from custom source** on the Applications page.

    {{< figure size="medium" src="../uploads/add-app-from-custom-source1.png" caption="" >}}

2. Enter the **Repository URL** for **cloning** the repository. Usually, the URL is in this format: ` git@example.com:username/repo.git `.

    {{< figure size="medium" src="../uploads/add_app_nourl.png" caption="" >}}

3. Upload the **SSH private key** file. If your key is password-protected, enter the **SSH key password**.

    {{< figure size="medium" src="../uploads/add-app-from-custom-source2.png" caption="" >}}

4. Click **Add app**.

Your app will be then listed on the Applications page and you can immediately start running builds.

{{<notebox>}}If you need to update the SSH key, you can upload a new one in **App settings > Repository settings > Update SSH key**.{{</notebox>}}

## Repositories behind firewall

To allow Codemagic access the private repository, the following IP addresses need to be whitelisted:

1. `34.74.32.93` - used by our backend for getting basic information about the repository
2. `192.159.66.80/28` - used by our builder servers to download the code and build it

---
categories:
  - Getting started with Codemagic CI/CD
date: '2019-03-21T17:03:45+02:00'
description: Add your Flutter app wherever it is hosted
facebook_description: ''
facebook_image: /uploads/2019/01/default-thumb.png
facebook_title: ''
menu:
  docs_sidebar:
    weight: 1
thumbnail: ''
title: Adding apps from custom sources
twitter_image: /uploads/2019/02/twitter.png
twitter_title: ''
twitterDescription: ''
weight: 4
---

You can add apps from other public or private Git-based repositories. This includes repositories requiring **SSH key authentication**. Click **Add app from custom source** on the Applications page to get started.

{{< figure size="medium" src="/uploads/2019/03/add_app_light-1.PNG" caption="" >}}

Then, fill in all the required fields.

{{< figure size="medium" src="/uploads/2019/03/app_using_ssh_authentication.PNG" caption="" >}}

1. Enter the checkout URL of the repository.
2. If a private key is required to access the repository or any private submodules in it, upload the **SSH private key** file.
3. If the SSH key is password-protected, you’ll be also asked to enter the **SSH key password**.
4. Click **Add app**.

Your app will be then listed on the Applications page and you can immediately start running builds.

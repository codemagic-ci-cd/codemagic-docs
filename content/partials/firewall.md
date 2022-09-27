---
description: Accessing private repositories
title: Repositories behind a firewall
weight: 7
aliases:
---

To allow Codemagic access a private repository, the following IP addresses need to be whitelisted:

1. `34.74.234.56` - used by our backend for getting basic information about the repository
2. `35.185.76.207` - used by our Linux and Windows build machines to download the code and build it
3. `199.7.162.128/29` - used by our macOS build machines to download the code and build it

Since Codemagic needs to access the Git service, please allow ports that your service uses - usually the default SSH or HTTPS ports.
---
description: Accessing private repositories
title: Repositories behind a firewall
weight: 7
aliases:
---

If your repositories are within an internal network/behind a firewall, which is usually the case with enterprises, the network configuration of these repositories must be configured for external access.

Codemagic requires direct access to the repositories for the following use cases:
- For retrieving the repository information such as the branches and the commits.
- For cloning the repository to the build machine during the build.

The following IP addresses must be allowed through the firewall (whitelisted):
{{< highlight Shell "style=rrt">}}
199.7.162.128/29
207.254.42.240/29
34.74.234.56/32
35.185.76.207/32
{{< /highlight >}}

Since Codemagic needs to access the Git service, please allow ports that your service uses - usually the default SSH or HTTPS ports.

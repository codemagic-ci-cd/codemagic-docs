---
description: Accessing private repositories
title: Repositories behind a firewall
weight: 7
aliases:
---

If your repositories are within an internal network / behind a firewall, which is usually the case with enterprises, the network configuration of these repositories must be configured for external access.

Codemagic requires direct access to the repositories for the following use cases:
- For retrieving the repository information such as the branches and the commits.
- For cloning the repository to the build machine during the build.

The following IP addresses must be allowed through the firewall (whitelisted):

<pre id="ip-addresses">Fetching IP addresses...</pre>

Since Codemagic needs to access the Git service, please allow ports that your service uses - usually the default SSH or HTTPS ports.

<script>
document.addEventListener('DOMContentLoaded', function() {
  fetch('https://codemagic.io/api/v3/meta')
    .then(response => response.json())
    .then(data => {
      const ipAddresses = data.data.address_prefixes
      const ipList = ipAddresses.join('\n')
      document.getElementById('ip-addresses').innerHTML = ipList
    })
    .catch(error => {
      document.getElementById('ip-addresses').innerHTML = 'Failed to fetch IP addresses.'
      console.error('Error fetching IP addresses:', error)
    })
})
</script>

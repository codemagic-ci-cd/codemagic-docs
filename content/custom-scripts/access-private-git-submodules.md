---
categories:
  - Custom script examples
date: '2019-04-09T17:40:12+03:00'
description: Access private Git submodules in Codemagic
menu:
  docs_sidebar:
    weight: 1
title: Access private Git submodules
weight: 1
---

You can access private Git submodules in Codemagic by saving the SSH key to your repository as an [environment variable](https://docs.codemagic.io/building/environment-variables/) and referencing it in a custom **post-clone** script.

1.  Save the SSH key (e.g. `SUBMODULE_SSH_KEY`) for accessing the repository as an environment variable. Make sure to check **Secure**.

        SUBMODULE_SSH_KEY = -----BEGIN OPENSSH PRIVATE KEY-----
        ...
        -----END OPENSSH PRIVATE KEY-----

1.  Add the following **post-clone** script to enable fetching sources from private Git submodules.

           #!/usr/bin/env sh

           echo "${SUBMODULE_SSH_KEY}" > /tmp/submodule.key
           chmod 600 /tmp/submodule.key
           ssh-agent bash -c 'ssh-add "/tmp/submodule.key"; git submodule update --init --recursive'

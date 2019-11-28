---
description: Access private Git submodules in Codemagic
title: Accessing private repositories
weight: 4
---

If your project requires accessing any private Git submodules or dependencies, you'll need to grant Codemagic access to them in order to build successfully. 
You can do that by saving the SSH key to your repository as a secure [environment variable](https://docs.codemagic.io/building/environment-variables/), i.e. `SSH_KEY`. All environment variables whose name has the suffix `_SSH_KEY` will be automatically added to the SSH agent and will be ready for use during the whole build process.

1.  Save the SSH key (e.g. `SSH_KEY`) for accessing the repository as an environment variable. Make sure to check **Secure**.

        SSH_KEY = -----BEGIN OPENSSH PRIVATE KEY-----
        ...
        -----END OPENSSH PRIVATE KEY-----

1.  If you wish to use a **custom** environment variable name without the suffix `_SSH_KEY`, add the following **post-clone** script to add the key to the SSH agent.

        #!/usr/bin/env sh
        echo "${CUSTOM_SSH_KEY_NAME}" > /tmp/ssh_key
        chmod 600 /tmp/ssh_key
        eval `ssh-agent -s`
        ssh-add /tmp/ssh_key

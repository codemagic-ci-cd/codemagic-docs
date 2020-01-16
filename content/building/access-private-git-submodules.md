---
description: Access any private Git submodules or dependencies in Codemagic
title: Accessing private repositories
weight: 4
---

If your project requires accessing any private Git submodules or dependencies, you'll need to grant Codemagic access to them in order to build successfully.

1. Create a SSH key pair for use with Codemagic and add the **public key** to your repository settings. Note that the SSH key **cannot** be password-protected.
2. Then in Codemagic, add the **private key** for accessing the repository as an [environment variable](https://docs.codemagic.io/building/environment-variables/). Make sure to check **Secure**. For example:

        SSH_KEY = -----BEGIN OPENSSH PRIVATE KEY-----
        ...
        -----END OPENSSH PRIVATE KEY-----

    {{% notebox %}}
The `-----END OPENSSH PRIVATE KEY-----` line needs to be followed by the new line character `\n` for the key to be usable.
{{% /notebox %}}

All environment variables whose name has the suffix `_SSH_KEY` will be automatically added to the SSH agent and will be ready for use during the whole build process. Check the `Preparing build machine` step in builds logs to verify that the key has been successfully added to the SSH agent.

If you wish to use a **custom** environment variable name without the suffix `_SSH_KEY`, add the following **post-clone** script to add the key to the SSH agent.

        #!/usr/bin/env sh
        echo "${CUSTOM_SSH_KEY_NAME}" > /tmp/ssh_key
        chmod 600 /tmp/ssh_key
        eval `ssh-agent -s`
        ssh-add /tmp/ssh_key

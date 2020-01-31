---
description: Access any private Git submodules or dependencies in Codemagic
title: Accessing private repositories
weight: 4
---

If your project requires accessing any private Git submodules or dependencies, you'll need to grant Codemagic access to them in order to build successfully.

1. [Create a SSH key pair](#generating-a-ssh-key) for use with Codemagic. Note that the SSH key **cannot** be password-protected.
2. Add the **public key** to your repository settings. See how to do that on [GitHub](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account), [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html), [GitLab](https://docs.gitlab.com/ee/ssh/README.html#adding-an-ssh-key-to-your-gitlab-account).
3. Then in Codemagic, add the **private key** for accessing the repository as an [environment variable](https://docs.codemagic.io/building/environment-variables/). Make sure to check **Secure**. For example:

        SSH_KEY = -----BEGIN OPENSSH PRIVATE KEY-----
        ...
        -----END OPENSSH PRIVATE KEY-----

    {{<notebox>}}
Note that the `-----END OPENSSH PRIVATE KEY-----` line needs to be followed by an empty line for the key to be usable.
{{</notebox>}}

All environment variables whose name has the suffix `_SSH_KEY` will be automatically added to the SSH agent and will be ready for use during the whole build process. Check the `Preparing build machine` step in build logs to verify that the key has been successfully added to the SSH agent.

If you wish to use a **custom** environment variable name without the suffix `_SSH_KEY`, add the following **post-clone** script to add the key to the SSH agent.

        #!/usr/bin/env sh
        echo "${CUSTOM_SSH_KEY_NAME}" > /tmp/ssh_key
        chmod 600 /tmp/ssh_key
        eval `ssh-agent -s`
        ssh-add /tmp/ssh_key

## Generating a SSH key

Different repository hosting services have different minimum requirements for the length of the SSH key, varying from 2048 bits to 4096 bits. We recommend creating a 4096 bit key for increased security. Run the script below in your terminal to create a 4096 bit SSH key:

        ssh-keygen -t rsa -b 4096 -f ~/Desktop/codemagic_ssh_key -q -N ""

This will create two new files on your desktop: `codemagic_ssh_key` (private key) and `codemagic_ssh_key.pub` (public key). 
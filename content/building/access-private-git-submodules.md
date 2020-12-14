---
description: If your project requires accessing any private Git submodules or dependencies, you'll need to grant Codemagic access to them in order to build successfully.
title: Accessing private dependencies and Git submodules
weight: 1
---

If your project requires accessing any private Git submodules or dependencies, you'll need to grant Codemagic access to them in order to build successfully.

1. [Create an SSH key pair](../knowledge-base/generating-an-ssh-key) for use with Codemagic. Note that the SSH key **cannot** be password-protected.
2. Add the **public key** to your repository settings. See how to do that on [GitHub](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account), [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html), [GitLab](https://docs.gitlab.com/ee/ssh/README.html#adding-an-ssh-key-to-your-gitlab-account).
3. Encrypt the contents of the **private key** file and add it as an environment variable in your Codemagic configuration configuration file. . (../building/environment-variables/). Make sure to check **Secure**. For example:

    ```
    SSH_KEY = -----BEGIN OPENSSH PRIVATE KEY-----
    ...
    -----END OPENSSH PRIVATE KEY-----
    ```

All environment variables whose name has the suffix `_SSH_KEY` will be automatically added to the SSH agent and will be ready for use during the whole build process. Check the `Preparing build machine` step in build logs to verify that the key has been successfully added to the SSH agent.

If you wish to use a **custom** environment variable name without the suffix `_SSH_KEY`, add the following **post-clone** script to add the key to the SSH agent.

```bash
#!/usr/bin/env sh
echo "${CUSTOM_KEY_NAME}" > /tmp/ssh_key
chmod 600 /tmp/ssh_key
eval `ssh-agent -s`
ssh-add /tmp/ssh_key
```

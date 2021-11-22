---
title: Accessing private dependencies and Git submodules
weight: 1
aliases: /building/access-private-git-submodules
---

If your project requires accessing any private Git submodules or dependencies, you'll need to grant Codemagic access to them in order to build successfully.

1. [Create an SSH key pair](../knowledge-base/generating-an-ssh-key) for use with Codemagic. Note that the SSH key **cannot** be password-protected.
2. Add the **public key** to your repository settings. See how to do that on [GitHub](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account), [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html), [GitLab](https://docs.gitlab.com/ee/ssh/README.html#adding-an-ssh-key-to-your-gitlab-account).
3. Copy the contents of the **private key** file add it as an [environment variable](../building/environment-variables/) in your Codemagic configuration file. Make sure to mark the Secure checkbox which will encrypt the contents of the private key file.

All environment variables whose name has the suffix `_SSH_KEY` will be automatically added to the SSH agent and will be ready for use during the whole build process. Check the `Fetching app sources` step in build logs to verify that the key has been successfully added to the SSH agent.

{{<notebox>}}
Do not add an environment variable with the `_SSH_KEY` suffix if your repository was added using a different SSH key. If you do so, the repository's key will be overwritten and it won't be possible to clone the repository.
{{</notebox>}}

### Using multiple SSH keys

When you add multiple SSH keys or need to use a different key for private dependencies apart from the one used to clone your repository, git will by default attempt to use the first key available. This may cause problems when installing private dependencies.

If you use yaml configuration, explicitly add the key to the SSH agent before invoking a command which requires it, as in the example below.

```bash
#!/usr/bin/env bash
echo "${CUSTOM_KEY_NAME}" > /tmp/ssh_key
chmod 600 /tmp/ssh_key
eval `ssh-agent -s`
ssh-add /tmp/ssh_key
... # enter the commands that require the key
```

But if you added a repository with an SSH key and want to use a different key to fetch dependencies, it's not possible to do in Workflow editor. Scripts are executed in independent shells, so the key explicitly added in a post-clone script will be lost as soon as the script finishes. The best thing to do in such a case would be to use the same key for both your repository and your private dependency. You may need to add the key to your account, not to the specific repository.

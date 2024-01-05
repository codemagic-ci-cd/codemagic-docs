---
title: Accessing private dependencies and Git submodules
description: How to enable Codemagic to access your private dependencies and Git submodules
weight: 5
aliases: 
  - /building/access-private-git-submodules
  - /configuration/access-private-git-submodules
---

If your project requires accessing any private Git submodules or dependencies, you'll need to grant Codemagic access to them in order to build successfully.

1. [Create an SSH key pair](../knowledge-git/generating-an-ssh-key) for use with Codemagic. Note that the SSH key **cannot** be password-protected.
2. Add the **public key** to your account settings. See how to do that on [GitHub](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account), [Bitbucket](https://confluence.atlassian.com/bitbucket/use-access-keys-294486051.html), [GitLab](https://docs.gitlab.com/ee/user/ssh.html).
3.  Copy the contents of the **private key** file add it as an environment variable in the Codemagic UI and import it into your **codemagic.yaml** configuration file.
{{<notebox>}}
**Note:** Make sure the environment variable name ends in `_SSH_KEY`.
{{</notebox>}}

    1. Open your Codemagic app settings, and go to the **Environment variables** tab.
    2. Enter the desired **_Variable name_**, e.g. `MODULE_SSH_KEY`.
    3. Copy and paste the key string as **_Variable value_**.
    4. Enter the variable group name, e.g. **_module_credentials_**. Click the button to create the group.
    5. Make sure the **Secure** option is selected.
    6. Click the **Add** button to add the variable.

    7. Add the variable group to your `codemagic.yaml` file
    {{< highlight yaml "style=paraiso-dark">}}
    environment:
        groups:
        - module_credentials
    {{< /highlight >}}
  
 
All environment variables whose name has the `_SSH_KEY` suffix will be automatically added to the SSH agent and will be ready for use during the whole build process. Check the **Fetching app sources** step in build logs to verify that the key has been successfully added to the SSH agent.

{{<notebox>}}
**Warning:** Do not add an environment variable with the `_SSH_KEY` suffix if your repository was added using a different SSH key. If you do so, the repository's key will be overwritten and it won't be possible to clone the repository.
{{</notebox>}}

### Using multiple SSH keys

When you add multiple SSH keys or need to use a different key for private dependencies apart from the one used to clone your repository, git will by default attempt to use the first key available. This may cause problems when installing private dependencies.

If you use yaml configuration, explicitly add the key to the SSH agent before invoking a command which requires it, as in the example below.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Script that uses an alternative SSH key
      script: | 
        #!/usr/bin/env bash
        echo "${CUSTOM_KEY_NAME}" > /tmp/ssh_key
        chmod 600 /tmp/ssh_key
        eval `ssh-agent -s`
        ssh-add /tmp/ssh_key
        # enter the commands that require the key
{{< /highlight >}}


But if you added a repository with an SSH key and want to use a different key to fetch dependencies, it's not possible to do in Workflow editor. Scripts are executed in independent shells, so the key explicitly added in a post-clone script will be lost as soon as the script finishes. The best thing to do in such a case would be to use the same key for both your repository and your private dependency. You may need to add the key to your account, not to the specific repository.

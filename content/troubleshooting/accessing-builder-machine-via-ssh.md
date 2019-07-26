---
categories:
  - Troubleshooting
description:
  'Establish SSH access to the builder virtual machine to inspect your
  build.  '
title: Accessing virtual machine via SSH
weight: 1
---

Establishing SSH access to the virtual machine running the build is a secure way for inspecting your build during runtime and for a short time after the build has finished. Building in SSH mode gives you the following advantages:

- See the processes running during the CI job
- Reproduce all commands run during the build
- Debug your custom scripts

## How SSH access works

All virtual machines are located within the private network. In order to allow users to connect to the virtual machine, Codemagic creates a temporary SSH tunnel through the public gateway. A unique SSH key is generated before each build which is valid for the duration of the build. The SSH tunnel and the unique key are revoked after the build is finished and cannot be reused.

## Setting up SSH connection to the virtual machine

Establishing an SSH connection to the virtual machine is possible only for manually triggered builds. Setting it up requires both enabling the SSH mode in UI and running an automatically generated script in your terminal.

1. In your app settings, click **Start new build**.
2. In the **Specify build configuration** popup, check **Enable SSH access** and start the build.
   {{< figure size="medium" src="../uploads/2019/07/enable_ssh_access.PNG" caption="" >}}
3. When the build has started, you will shortly see additional instructions for establishing SSH access. Run the automatically generated script in the terminal before the build finishes to establish an SSH connection to the machine running the build.
   {{< figure size="medium" src="../uploads/2019/07/ssh_access_script.PNG" caption="" >}}

If you don't run the script before the build finishes, the unique SSH key expires and can't be used anymore. A new script will be generated every time you run the build, so previous scripts cannot be reused.

{{% notebox %}}
Note that the script for establishing SSH connection works natively on Linux and MacOS, but requires additional software like Git-bash on Windows.
{{% /notebox %}}

## SSH session time limit

The SSH session remains active for a maximum of 20 minutes after all build steps are completed or until the maximum build duration limit is reached, whichever comes first. If you log out from the virtual machine during an active SSH session, the build is finished automatically and you cannot access the builder via SSH for this session. You would have to run a new build to establish a new SSH connection.

{{% notebox %}}
If you have finished debugging the build, don't forget to end the session to avoid losing build time.
{{% /notebox %}}

## Debugging via SSH

You can use the SSH session to reproduce all commands run during the build, rerun the build with a different configuration or even set up platform-specific files, e.g. CocoaPods.

To access the clone of your project on the VM, run `cd $FCI_BUILD_DIR` in the terminal. The command `printenv` prints all the environment variables exported during the build. You can see some of Codemagic read-only environment variables explained [here](https://docs.codemagic.io/building/environment-variables/#codemagic-read-only-environment-variables).

Note that the `sudo` command is available so you can execute all commands with root privileges.

---
description: How to connect to the build machine with SSH or VNC/RDP
title: Remote access to the build machine
weight: 1
---

You can establish remote access to the virtual build machine running your build via SSH or a VNC/RDP client. 

The **SSH access** allows you to access the build machine only through a terminal and run commands on it. This is an excellent option for debugging your builds. You can see the processes running during the CI job, reproduce all commands run during the build, or debug your custom scripts.

The **VNC/RDP clients** allow you to access the remote build machine graphically. For example Mac machines may have multiple versions of Xcode and iOS simulators preinstalled, so you can run and test your iOS apps or change Xcode configuration files without owning a Mac yourself. Linux and Mac machines use VNC and Windows machines use RDP for GUI remote access.

## How remote access to the build machines works

All virtual machines are located within the private network. In order to allow users to connect to the virtual machine, Codemagic allows a temporary SSH or VNC/RDP access through the public gateway using a unique SSH key or user credentials that are generated before each build. The unique key and user credentials are valid for the duration of the build only and are revoked after the build is finished.

## Setting up an SSH connection to the virtual machine

1. While the build is running, click **Explore build machine via SSH or VNC/RDP client** above the build steps to see the command and instructions for establishing SSH access. 
2. Copy the command to the clipboard manually or using the Copy button next to the command.
3. Run the generated script in the terminal before the build finishes. An SSH session to the machine running the build will be opened in your terminal.

If you don't run the script before the build finishes, the unique SSH key expires and can't be used anymore. A new script will be generated every time you run the build, so previous scripts cannot be reused.

{{<notebox>}}
Note that the script for establishing SSH connection works natively on Linux and macOS but requires additional software like Git-bash on Windows.
{{</notebox>}}

## Setting up VNC/RDP connection to the virtual machine

1. While the build is running, click **Explore build machine via SSH or VNC/RDP client** above the build steps to see the command and instructions for establishing VNC or RDP access, depending on the platform your build is running on. 
2. Use the given **Host**, **Port**, **Username** and **Password** on your VNC/RDP client to establish the connection.

{{<notebox>}}
You can download VNC Viewer for Windows [here](https://www.realvnc.com/en/connect/download/viewer/windows/). 

If you are on macOS and need to connect to a Windows machine using RDP, we recommend using the official Microsoft Remote Desktop client for macOS which can be installed from [Mac App Store](https://apps.apple.com/us/app/microsoft-remote-desktop/id1295203466)

When using VNC Viewer or Microsoft Remote Desktop, make sure to add the values for **Host** and **Port** into the address field in this format: `<Host>:<Port>` (for example,  `192.159.66.83:16543`).
{{</notebox>}}

New credentials will be generated every time you run the build, so previous credentials cannot be reused.

## Using the remote build machine

You can use the remote session to reproduce all commands run during the build, rerun the build with a different configuration, or set up platform-specific files, e.g. CocoaPods.

* To access the clone of your project on the VM, run `cd $CM_BUILD_DIR` in the terminal. 

* The command `printenv` prints all the environment variables exported during the build on Linux/macOS. Use `dir env:` on Windows to achieve the same in PowerShell. You can see some of Codemagic built-in environment variables explained [here](../building/environment-variables/#codemagic-read-only-environment-variables).

* The `sudo` command is available on Linux/macOS so you can execute all commands with root privileges. PowerShell on Windows machines is already running in privileged mode.

## Remote access session time limit

The SSH or VNC/RDP session remains active for a maximum of 20 minutes after all build steps are completed or until the maximum build duration limit is reached, whichever comes first. If you log out from the virtual machine during an active VNC or SSH/RDP session, the build is finished automatically, and you cannot access the builder for this session. You would have to run a new build to establish a new remote access connection.

{{<notebox>}}
If you have finished debugging the build, don't forget to end the session to avoid losing build time.
{{</notebox>}}

## Useful tips for debugging

* You can access your project on the builder machine by running `cd $CM_BUILD_DIR`
* If you encounter an error during the build, a good way to get started is by digging into the build logs on Codemagic and rerunning the first failed command.
* The command `printenv` prints all the environment variables exported during the build on Linux/macOS. Use `dir env:` on Windows to achieve the same in PowerShell. See [environment variables](../building/environment-variables/) for an explanation of built-in environment variables.
* The `sudo` command is available to execute any commands with root privileges on Linux/macOS. PowerShell on Windows machines is already running in privileged mode.
* During an active SSH session, you can rerun the build with a different configuration right from the terminal.
* Before terminating the connection, you may want to copy-paste the contents of the terminal window to keep a record of your actions on the builder machine.


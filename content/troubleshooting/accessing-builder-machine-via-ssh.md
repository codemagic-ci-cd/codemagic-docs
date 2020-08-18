---
description:
  'Establish SSH or VNC access to the virtual build machine'
title: Remote access to build machine
weight: 2
---

You can establish remote access to the virtual build machine running your build either via SSH or using a VNC client. 

The **SSH access** allows you to access the build machine only through a terminal and run commands on it. This is a great option for debugging your builds. You can see the processes running during the CI job, reproduce all commands run during the build or debug your custom scripts.

The **VNC client** allows you to graphically access the remote build machine. It has multiple versions of Xcode and iOS simulators preinstalled, so you can run and test your iOS apps or change Xcode configuration files without owning a Mac yourself. 

## How remote access to build machines works

All virtual machines are located within the private network. In order to allow users to connect to the virtual machine, Codemagic allows a temporary SSH or VNC access through the public gateway using a unique SSH key or user credentails that are generated before each build. The unique key and user credentials are valid for the duration of the build only and are revoked after the build is finished.

## Setting up SSH connection to the virtual machine

Establishing an SSH connection to the virtual machine is possible only for manually triggered builds.

1. Click **Start new build**.
2. In the **Specify build configuration** popup, review your build configuration and click **Start new build** once again.
3. When the build has started, click **Explore build machine** above the build steps to see the instructions for establishing SSH access. Run the automatically generated script in the terminal before the build finishes to establish an SSH connection to the machine running the build.

If you don't run the script before the build finishes, the unique SSH key expires and can't be used anymore. A new script will be generated every time you run the build, so previous scripts cannot be reused.

{{<notebox>}}
Note that the script for establishing SSH connection works natively on Linux and MacOS but requires additional software like Git-bash on Windows.
{{</notebox>}}

## Setting up VNC connection to the virtual machine

Establishing a VNC connection to the virtual machine is possible only for manually triggered builds.

1. Click **Start new build**.
2. In the **Specify build configuration** popup, review your build configuration and click **Start new build** once again.
3. When the build has started, click **Explore build machine** above the build steps to see the instructions for setting up VNC access. Use the given **Host**, **Port**, **Username** and **Password** on your VNC client to establish the connection.

{{<notebox>}}
You can download VNC Viewer for Windows [here](https://www.realvnc.com/en/connect/download/viewer/windows/). Using VNC Viewer, make sure to add the values for **Host** and **Port** into the address field in this format: `<Host>:<Port>` (for example `192.159.66.83:16543`).
{{</notebox>}}

New credentials will be generated every time you run the build, so previous credentials cannot be reused.

## Using the remote build machine

You can use the remote session to reproduce all commands run during the build, rerun the build with a different configuration or even set up platform-specific files, e.g. CocoaPods. When accessing the build machine via the VNC client, you can use the Search functionality to easily find and launch Safari or Chrome, Xcode, Simulator or any other applications on the build machine.

* To access the clone of your project on the VM, run `cd $FCI_BUILD_DIR` in the terminal. 

* The command `printenv` prints all the environment variables exported during the build. You can see some of Codemagic read-only environment variables explained [here](../building/environment-variables/#codemagic-read-only-environment-variables).

* The `sudo` command is available so you can execute all commands with root privileges.

## Remote access session time limit

The SSH or VNC session remains active for a maximum of 20 minutes after all build steps are completed or until the maximum build duration limit is reached, whichever comes first. If you log out from the virtual machine during an active VNC or SSH session, the build is finished automatically and you cannot access the builder for this session. You would have to run a new build to establish a new remote access connection.

{{<notebox>}}
If you have finished debugging the build, don't forget to end the session to avoid losing build time.
{{</notebox>}}

## Closer look

If you want to know more about setting up remote access, there is a detailed overview on both SSH and VNC connection <a href="https://blog.codemagic.io/remote-access-to-virtual-mac-build-machine/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','remote-access-to-virtual-mac-build-machine')">on our blog.</a>

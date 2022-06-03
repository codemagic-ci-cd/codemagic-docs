---
title: Common Windows issues
weight: 2
---

## Accessing environment variables from your application

**Description**:
You can't access the variable directly by using `$VAR_NAME`. 

**Solution**:
You can then reference the variable in subsequent parts of your workflow by using `$env:VAR_NAME`.

But when using a variable to set another variable in the `vars:` section directly like this:

```
environment:
      vars:
        VAR_1: ---\$VAR_2\---
```


## Use Command Prompt

The default shell on the Windows machines are `PowerShell`.
If you want to run a script using the `Command Prompt` you can do this:

```
cmd.exe \c YOUR_COMMAND_HERE
```


## Accessing the build machine with SSH or VNC/RDP

You can always access any build machine using the SSH or VNC.

But one thing to notice that if your local machine is Windows so you can't access a Windows build machine using VNC, you should use RDP to do that.

Learn more: [Remote access to the build machine](../troubleshooting/accessing-builder-machine-via-ssh/).
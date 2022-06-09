---
title: Common Windows issues
weight: 2
---

## Accessing environment variables from your application

**Description**:
You can't access the variable directly by using `$VAR_NAME`. 

**Solution**:
You can reference the variable in subsequent parts of your workflow by using `$env:VAR_NAME`.

But when using a variable to set another variable in the `vars:` section directly like this:

```
environment:
      vars:
        VAR_1: ---\$VAR_2\---
```


## Use Command Prompt

The default shell on the Windows machines is `PowerShell`.
If you want to run a script using the `Command Prompt` you can do this:

```
cmd.exe \c YOUR_COMMAND_HERE
```

## Run a script with parameters with spaces and quotes

When PowerShell sees a command starting with a string it just evaluates the string, that is, it typically echos it to the screen, for example:

```
PS> "C:\Program Files\Unity Hub\Unity Hub.exe"
Hello World
```

If you want PowerShell to interpret the string as a command name then use the call operator (&) like so:

```
& 'C:\Program Files\Unity Hub\Unity Hub.exe' ...
```

If you want to run an exe file in `PowerShell` with parameters with spaces and quotes you can use the `Start-Process` method like this:

```
Start-Process -NoNewWindow -FilePath "path-to-your-exe-file" -ArgumentList 'your-arguments-are-here' -Wait
```

## Decode a base64 encoded environment variable
 You can decode the `$VAR1` variable into the path `$PATH` using the following script:

```
[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("$env:VAR1")) | Out-File -FilePath $env:PATH
```

## Accessing the build machine with SSH or VNC/RDP

Linux and macOS machines can be accessed using SSH or VNC.

However, you can't access a Windows build machine using VNC, and you should use an RDP client instead.

Learn more: [Remote access to the build machine](../troubleshooting/accessing-builder-machine-via-ssh/).
---
title: Common Windows issues
description: How to overcome common issues building mobile apps on Codemagic with Windows
description: 
weight: 2
---

### Cannot access variables from the app

###### Description
You can't access the variable directly by using `$VAR_NAME`. 

###### Solution
You can reference the variable in subsequent parts of your workflow by using `$env:VAR_NAME`.

However, when using a variable to set another variable in the `vars:` section, use the following syntax:

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    vars:
      VAR_1: ---\$VAR_2\---
{{< /highlight >}}


### Using Command Prompt

###### Description
The default shell on the Windows machines is `PowerShell`, but you need to run scripts using `Command Prompt`.

###### Solution
Invoke the `Command Prompt` app directly and pass your script as an argument:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Run a command in Command Prompt
      script: | 
        cmd.exe \c YOUR_COMMAND_HERE
{{< /highlight >}}


### Script with spaces and quotes not behaving as expected

###### Description
When PowerShell sees a command starting with a string, it just evaluates the string. Typically, this means echoing it to the screen:

{{< highlight powershell "style=paraiso-dark">}}
PS> "C:\Program Files\Unity Hub\Unity Hub.exe"
Hello World
{{< /highlight >}}

###### Solution
If you want PowerShell to interpret the string as a command name, use the call operator **(&)**:

{{< highlight powershell "style=paraiso-dark">}}
& 'C:\Program Files\Unity Hub\Unity Hub.exe' ...
{{< /highlight >}}

If you want to use `PowerShell` to run an `.exe` file with parameters that contain spaces or quotes, use the `Start-Process` method:

{{< highlight powershell "style=paraiso-dark">}}
Start-Process -NoNewWindow -FilePath "path-to-your-exe-file" -ArgumentList 'your-arguments-are-here' -Wait
{{< /highlight >}}


### Wrong value in base64 encoded environment variables

###### Description
Scripts fail when using `base64` encoded variables or use incorrect values.

###### Solution
Encoded variables need to be decoded back into their original form before they can be used. For example, to decode a variable `$VAR1` and save the result as variable `PATH`, use the following script:

{{< highlight powershell "style=paraiso-dark">}}
[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("$env:VAR1")) | Out-File -FilePath $env:PATH
{{< /highlight >}}


### Cannot access the build machine using SSH or VNC/RDP

###### Description
Linux and macOS machines can be accessed using SSH or VNC. However, the access does not work when using a Windows build machine.

###### Solution
SSH and VNC access is not available on Windows build machines. You can access them using an RDP client instead.

Learn more: [Remote access to the build machine](../troubleshooting/accessing-builder-machine-via-ssh/).
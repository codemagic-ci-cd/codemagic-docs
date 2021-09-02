---
title: Encrypting sensitive data
description: Encrypt your credentials and key files
weight: 4
aliases: [/building/encrypting]
platform: yaml
---

If you wish to store sensitive information, such as login details or API keys, in environment variables in your configuration file, it is important to encrypt the data to not expose it. You can easily encrypt values and files using the encryption interface in Codemagic.

{{<notebox>}}
For security reasons, encrypted environment variables work only in the team where they were created. When moving an app from your personal account to a team or from one team to another, you should re-encrypt the variables.
{{</notebox>}}

1. Click open your app in Codemagic.
2. Click **Encrypt variables** on the YAML editor window.
3. A popup window appears. Paste the value of the variable in the field or upload it as a file.
4. Click **Encrypt**. 
5. Copy the encrypted value and paste it as the value of the variable.

The encrypted value will look something like this:

```
Encrypted(Z0FBQUFBQmRyY1FLWXIwVEhqdWphdjRhQ0xubkdoOGJ2bThkNmh4YmdXbFB3S2wyNTN2OERoV3c0YWU0OVBERG42d3Rfc2N0blNDX3FfblZxbUc4d2pWUHJBSVppbXNXNC04U1VqcGlnajZ2VnJVMVFWc3lZZ289)
```

If you wish to encrypt a **file** to add to your workflow, you will first have to base64 encode it and then encrypt the received string. To use the file, you will have to decode it during the build.

On macOS, in order to base64 encode a file and copy the contents to your clipboard, you can run the following command in the terminal:

  ```bash
  cat your_file_name.extension | base64 | pbcopy 
  ```
  
On Windows, in order to base64 encode a file and copy the contents to your clipboard, you can run the following command in the Powershell:
  ```bash
  [Convert]::ToBase64String([IO.File]::ReadAllBytes("your_file_name.extension")) | Set-Clipboard
  ```
For Linux, in order to encode to base64 run the command below and you can install xclip as it lets you to put the output of a command directly into the clipboard so that you don't have to copy&paste from the terminal manually:
   ```bash
  sudo apt-get install xclip
  cat your_file_name.extension | base64 | xclip -selection clipboard 
  ```

After the command has been run, you can paste the string from your clipboard to our encryption tool in the Codemagic UI and then save the encrypted string to an environment variable.

Finally, base64 decode it during build time in your scripts section using the following command:

  ```bash
  echo $YOUR_ENVIRONMENT_VARIABLE | base64 --decode > /path/to/decode/to/your_file_name.extension
  ```

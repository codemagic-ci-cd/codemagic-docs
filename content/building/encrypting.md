---
title: Encrypting sensitive data
description: Encrypt your credentials and key files
weight: 3
---

If you wish to store sensitive information, such as login details or API keys, in environment variables or in your configuration file, it is important to encrypt the data so as to not expose it. You can easily encrypt values and files using the encryption interface in Codemagic.

{{<notebox>}}
For security reasons, encrypted environment variables work only in the team where they were created. When moving an app from your personal account to a team or from one team to another, you should re-encrypt the variables.
{{</notebox>}}

1. Click open your app in Codemagic.
2. Click **Encrypt variables** on the YAML editor window (or click **Encrypt environment variables** on the right sidebar in the **Configuration as code** section if you are using the Flutter workflow editor).
3. A popup window appears. Paste the value of the variable in the field or upload it as a file.
4. Click **Encrypt**. 
5. Copy the encrypted value and paste it as the value of the variable.

The encrypted value will look something like this:

```
Encrypted(Z0FBQUFBQmRyY1FLWXIwVEhqdWphdjRhQ0xubkdoOGJ2bThkNmh4YmdXbFB3S2wyNTN2OERoV3c0YWU0OVBERG42d3Rfc2N0blNDX3FfblZxbUc4d2pWUHJBSVppbXNXNC04U1VqcGlnajZ2VnJVMVFWc3lZZ289)
```

Note that when you upload a **file** for encryption, it is encoded to `base64` and would have to be decoded during the build. If you want to encrypt a file (plaintext, JSON, plist), copy-paste the contents of it to the encryption interface and use the encrypted value in your configuration.

Writing the base64-encoded environment variable to a file can be done like this:

```yaml
scripts:
  - echo $MY_FILE | base64 --decode > my-file.json
```
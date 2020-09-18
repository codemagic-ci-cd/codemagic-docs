---
title: Encrypting sensitive data
description: Encrypt your credentials and key files
weight: 6
---

If you wish to store sensitive information, such as login details or API keys, in environment variables or in your configuration file, it is important to encrypt the data so as to not expose it. You can easily encrypt values and files using the encryption interface in Codemagic.

1. Click open your app in Codemagic.
2. Click **Encrypt environment variables** at the bottom of the page (or on the right sidebar in the **Configuration as code** section if it's a Flutter app).
3. Paste the value of the variable in the field or upload it as a file.
4. Click **Encrypt**. 
5. Copy the encrypted value and paste it to the configuration file.

The encrypted value will look something like this:

```
Encrypted(Z0FBQUFBQmRyY1FLWXIwVEhqdWphdjRhQ0xubkdoOGJ2bThkNmh4YmdXbFB3S2wyNTN2OERoV3c0YWU0OVBERG42d3Rfc2N0blNDX3FfblZxbUc4d2pWUHJBSVppbXNXNC04U1VqcGlnajZ2VnJVMVFWc3lZZ289)
```

{{<notebox>}}
Note that when you upload a file for encryption, it is encoded to `base64` and would have to be decoded during the build. If you want to encrypt a key file, copy-paste the contents of the key file to the encryption interface and use the encrypted value in your configuration.
{{</notebox>}}

Writing the base64-encoded environment variable to a file can be done like this:

```
scripts:
  - echo $MY_FILE | base64 --decode > my-file.json
```
---
description: How to define and use environment variable groups
title: Environment variable groups
weight: 3
aliases: [/building/environment-variable-groups, /variables/encrypting, /building/encrypting]
platform: yaml
popular: 3
---

You can add environment variables in the following places:

* [Application environment variables](../variables/environment-variable-groups/#application-environment-variables) in Application settings
* [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in Team settings

## Variable groups

Environment variable groups allow you to define and store related sets of variables that are reusable in your [codemagic.yaml](../getting-started/yaml/) workflows. A variable _group_ tags a set of variables that can be imported together in a codemagic.yaml file. For example, you could define a `staging` group for variables related to your staging deployment and a `production` group for variables related to your production deployment. The variable names in staging and production groups can be identical, but the values will be set depending on which group is imported in the workflow. This allows you to reference variables in reusable scripts, but assign the actual values per workflow based on the imported group.

One or more variable groups can be imported into codemagic.yaml [environment section](../getting-started/yaml/#environment). For example, variable groups named `magic_values` and `other_values` can be imported with the following syntax:

```yaml
workflows:
  workflow-name:
    environment:
      groups:
        - magic_values
        - other_values
```

Variables defined in environment variable groups work exactly as [Environment Variables](../variables/environment-variables/#using-environment-variables). The value of a variable named `API_TOKEN` can be referenced in a workflow as `$API_TOKEN`. Variables defined with the **_secure_** option will have values obfuscated in the Codemagic UI.

## Storing sensitive values/files

Entering values in the Variable value input and marking the **Secure** checkbox will automatically encrypt those values. However, note that in order to store **_binary files_** as secure environment variables, first it needs to be **_base64 encoded_** locally. To use the files, you will have to decode them during the build.

Some commonly known binary files that need to be base64 encoded. e.g.
- Android keystore (.jks or .keystore)
- Provisioning profiles when manual code signing (.mobileprovision)
- iOS distribution certificate (.p12) when manual code signing.

This can be done with the help of different OS-specific command lines':

On macOS, running the following command base64 encodes the file and copies the result to the clipboard:

```
cat your_file_name.extension | base64 | pbcopy
```

For Windows, the PowerShell command to base64 encode a file and copy it to the clipboard is:

```
[Convert]::ToBase64String([IO.File]::ReadAllBytes("your_file_name_.extension")) | Set-Clipboard
```

For Linux machines, we recommend installing xclip:

```
sudo apt-get install xclip
cat your_file_name.extension | base64 | xclip -selection clipboard
```
{{<notebox>}}
**Tip**: A convenient way to find a binary file is to try to peek into the file using `less filename.extension`. You'll be asked "**_filename maybe is a binary file.  See it anyway?_**"
{{</notebox>}}

After running these command lines, you can paste the automatically copied string into the Variable value input and check the **Secure** checkbox to store the value in encrypted form in Codemagic.

Finally, base64 decode it during build time in your scripts section using the following command:

`echo $YOUR_ENVIRONMENT_VARIABLE | base64 --decode > /path/to/decode/to/your_file_name.extension`

{{<notebox>}}
**Tip**: When copying file contents always include any tags. e.g. Don't forget to copy `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` too.
{{</notebox>}}

## Global variables and secrets

Global variable groups can be defined on the team settings page (which you can navigate to for your team on the [Teams page](https://codemagic.io/teams)).

By default, variable groups defined here can be used in any codemagic.yaml workflow in any application of the team. It is possible to limit variable groups to specific applications by clicking the edit icon next to the group you wish to manage under **Application access**.

{{<notebox>}}
Global variable groups are only available for Teams. You can read more about teams [here](https://docs.codemagic.io/teams/teams/).
{{</notebox>}}

## Application environment variables

Application variable groups can be defined in the application settings **Environment Variables** tab and can be used in any codemagic.yaml workflow in the application.

Here you'll find some of the application environment groups and variables explained.

## Example for Android builds

    environment:
      groups:
        - keystore_credentials
        - google_play_credentials
        - other 

Add the above-mentioned group environment variables in Codemagic UI (either in Application/Team variables), don't forget to click **Secure** to make sensitive data encrypted: 

**Variable name** | **Variable value** | **Group**
--- | --- | ---
FCI_KEY_ALIAS | /tmp/keystore.keystore | keystore_credentials
FCI_KEYSTORE | contents of keystore - [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) | keystore_credentials
FCI_KEYSTORE_PASSWORD | Put your keystore password here | keystore_credentials
FCI_KEY_PASSWORD | Put your key alias password here | keystore_credentials
FCI_KEY_ALIAS | Put your key alias here | keystore_credentials
GCLOUD_SERVICE_ACCOUNT_CREDENTIALS | Put your Google Play service account credentials here | google_play_credentials
GOOGLE_PLAY_TRACK | Any default or custom track that is not in ‘draft’ status | google_play_credentials
PACKAGE_NAME | Put your package name here | other

## Example for iOS builds

    environment:
      groups:
        - appstore_credentials
        - certificate_credentials
        - other

Add the above-mentioned group environment variables in Codemagic UI (either in Application/Team variables), don't forget to click **Secure** to make sensitive data encrypted:

**Variable name** | **Variable value** | **Group**
--- | --- | ---
APP_STORE_CONNECT_ISSUER_ID | Put your App Store Connect Issuer Id here  | appstore_credentials
APP_STORE_CONNECT_KEY_IDENTIFIER | Put your App Store Connect Key Identifier here | appstore_credentials
APP_STORE_CONNECT_PRIVATE_KEY | Put your App Store Connect Private Key here | appstore_credentials
CERTIFICATE_PRIVATE_KEY | Put your Certificate Private Key here | certificate_credentials
BUNDLE_ID | Put your bundle id here | other
APP_STORE_ID | Put your TestFlight Apple id number (General > App Information > Apple ID) | other
XCODE_WORKSPACE | Put the name of your workspace here | other
XCODE_SCHEME | Put the name of your scheme here | other

For more information on iOS codesigning check [here](../code-signing-yaml/signing)

To access a variable, add the `$` symbol in front of its name. 

{{<notebox>}}
**Tip**: If the group of variables is reusable among various applications, they can be defined in Global variables and secrets in Team settings for easier access.
{{</notebox>}}

## Environment variable precedence

Environment variables with the same name and group from different sources will have the following precedence:

1. API variables
1. Application variables
1. Global variables

This means variables defined in a scope of higher precedence can override those in a lower precedence with the same name. For example, if you have a global variable `API_KEY` with a value `global` that is also defined in an application variable with the value `app`, then the value `app` will be used.

If variables with the same name are defined and imported from different groups of the same level of precedence, the values from the last imported variable group will be used. For example, if two application variable groups `magic` and `wand` are defined each with a variable named `magic_number` and imported in a codemagic.yaml like so:

```yaml
environment:
  groups:
    - magic
    - wand
```

Then the variable value in the group `wand` will be used.

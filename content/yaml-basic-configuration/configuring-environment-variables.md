---
title: Adding environment variables in codemagic.yaml
linkTitle: Adding environment variables
description: How to configure environment variables and groups
weight: 2
aliases:
  - /building/environment-variable-groups
  - /variables/encrypting
  - /building/encrypting
  - /variables/environment-variable-groups
  - /yaml/configuring-environment-variables
---
<br>
{{< youtube 7pAxVFe66hI >}}

## Configuring Environment variables

Environment variables are useful for storing various pieces of data and making it available during build time. Typical use cases include credentials, configuration files or API keys that are required for successful building or integration with external services. Besides user defined environment variables, Codemagic also provides numerous useful variables already built-in. You can check the full list [here.](../yaml-basic-configuration/environment-variables).

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**.
3. Enter the **_Variable value_**.
4. Enter the variable group name, e.g. **_appstore_credentials_**. Click the button to create the group.
5. If the **Secure** option is selected, the variable will be protected by encryption. Its value will not be visible in Codemagic UI or build logs, it will be transferred securely to the build machine and made available only while the build is running. The whole build machine will be destroyed after build ends.
6. Click the **Add** button to add the variable.


## Variable groups

Environment variable groups allow you to define and store related sets of variables that are reusable in your [codemagic.yaml](../getting-started/yaml/) workflows. A variable _group_ tags a set of variables that can be imported together in a codemagic.yaml file. For example, you could define a `staging` group for variables related to your staging deployment and a `production` group for variables related to your production deployment. The variable names in staging and production groups can be identical, but the values will be set depending on which group is imported in the workflow. This allows you to reference variables in reusable scripts, but assign the actual values per workflow based on the imported group.

One or more variable groups can be imported into codemagic.yaml [environment section](../getting-started/yaml/#environment). For example, variable groups named `magic_values` and `other_values` can be imported with the following syntax:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  workflow-name:
    environment:
      groups:
        - magic_values
        - other_values
{{< /highlight >}}

Variables defined in environment variable groups work exactly as all other environment variables. E.g., the value of a variable named `API_TOKEN` can be referenced in a workflow as `$API_TOKEN`. Variables defined with the **_secure_** option will have values obfuscated in the Codemagic UI.


## Storing binary files

In order to store **_binary files_** as environment variables, they first need to be **_base64 encoded_** locally. To use the files, you will have to decode them during the build.

Commonly used binary files that need to be base64 encoded include:
- Android keystore (.jks or .keystore)
- Provisioning profiles when manual code signing (.mobileprovision)
- iOS distribution certificate (.p12) when manual code signing.

The following examples show how to save a file named `codemagic.keystore` depending on your OS:

{{< tabpane >}}

{{< tab header="Linux" >}}
{{<markdown>}}
For Linux machines, we recommend installing xclip:

{{< highlight Shell "style=rrt">}}
sudo apt-get install xclip
cat codemagic.keystore | base64 | xclip -selection clipboard
{{< /highlight >}}

Alternatively, you can run the following command and carefully copy/paste the output:
{{< highlight Shell "style=rrt">}}
openssl base64 -in codemagic.keystore
{{< /highlight >}}
{{</markdown>}}

{{<notebox>}}
**Tip**: When copying file contents always include any tags. e.g. Don't forget to copy `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` too.
{{</notebox>}}
{{< /tab >}}

{{< tab header="macOS" >}}
{{<markdown>}}
On macOS, running the following command base64 encodes the file and copies the result to the clipboard:
{{< highlight Shell "style=rrt">}}
cat codemagic.keystore | base64 | pbcopy
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="Windows" >}}
{{<markdown>}}
For Windows, the PowerShell command to base64 encode a file and copy it to the clipboard is:
{{< highlight powershell "style=rrt">}}
[Convert]::ToBase64String([IO.File]::ReadAllBytes("codemagic.keystore")) | Set-Clipboard
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


After running these command lines, you can paste the automatically copied string into the Variable value field in Codemagic UI.

{{<notebox>}}
**Tip**: A convenient way to check if a file is binary is to try to peek into the file using `less filename.extension`. If it is binary, you'll be asked "**_filename maybe is a binary file.  See it anyway?_**"
{{</notebox>}}

#### Using binary files

In order to use binary files during the build time, you need to `base64` decode them and generate the file again. This can be performed with a simple `echo` command in a script.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  workflow-name:
    environment:
    scripts:
      - name: Generate keystore file
        script: | 
          echo $YOUR_ENVIRONMENT_VARIABLE | base64 --decode > /path/to/decode/to/codemagic.keystore
{{< /highlight >}}


## Global variables and secrets

Variable groups can also be defined on the [Teams page](https://codemagic.io/teams) for both teams and personal accounts. Variable groups defined here are global and can be used in any `codemagic.yaml` workflow and in any application of the team. It is possible to limit variable groups to specific applications by clicking the edit icon next to the group you wish to manage under **Application access**.


## Environment variable precedence

Environment variables with the same name and group from different sources will have the following precedence:

1. API variables
2. Application variables
3. Global variables

This means that variables defined in a scope of higher precedence will override variables defined in a lower scope if they have the same name.

If variables with the same name are defined and imported from different variable groups of the same level of precedence, the values from the last imported variable group will be used. For example, if two application variable groups `magic` and `wand` are defined each with a variable named `magic_number` and imported in a codemagic.yaml like so:

{{< highlight yaml "style=paraiso-dark">}}
environment:
  groups:
    - magic
    - wand
{{< /highlight >}}

Then the variable value in the group `wand` will be used.


## Commonly used variable examples

#### Android builds

The following variable groups and variables are commonly used in Android builds. Add them in Codemagic UI (either as Application or as Team variables), make sure to click **Secure** to make sensitive data encrypted, and include the variable groups in your workflow.

**Variable name** | **Variable value** | **Group**
--- | --- | ---
CM_KEYSTORE_PATH | /tmp/keystore.keystore | keystore_credentials
CM_KEYSTORE | contents of keystore - [`base64 encoded`](#storing-binary-files) | keystore_credentials
CM_KEYSTORE_PASSWORD | Put your keystore password here | keystore_credentials
CM_KEY_PASSWORD | Put your key alias password here | keystore_credentials
CM_KEY_ALIAS | Put your key alias here | keystore_credentials
GCLOUD_SERVICE_ACCOUNT_CREDENTIALS | Put your Google Play service account credentials here | google_play_credentials
GOOGLE_PLAY_TRACK | Any default or custom track that is not in ‘draft’ status | google_play_credentials
PACKAGE_NAME | Put your package name here | other

{{< highlight yaml "style=paraiso-dark">}}
    environment:
      groups:
        - keystore_credentials
        - google_play_credentials
        - other 
{{< /highlight >}}



#### iOS builds

The following variable groups and variables are commonly used in iOS builds. Add them in Codemagic UI (either as Application or as Team variables), make sure to click **Secure** to make sensitive data encrypted, and include the variable groups in your workflow.


**Variable name** | **Variable value** | **Group**
--- | --- | ---
APP_STORE_CONNECT_ISSUER_ID | Put your App Store Connect Issuer Id here  | appstore_credentials
APP_STORE_CONNECT_KEY_IDENTIFIER | Put your App Store Connect Key Identifier here | appstore_credentials
APP_STORE_CONNECT_PRIVATE_KEY | Put your App Store Connect Private Key here | appstore_credentials
CERTIFICATE_PRIVATE_KEY | Put your Certificate Private Key here | appstore_credentials
BUNDLE_ID | Put your bundle id here | ios_config
APP_STORE_ID | Put your TestFlight Apple id number (General > App Information > Apple ID) | ios_config
XCODE_WORKSPACE | Put the name of your workspace here | ios_config
XCODE_SCHEME | Put the name of your scheme here | ios_config

{{< highlight yaml "style=paraiso-dark">}}
    environment:
      groups:
        - appstore_credentials
        - ios_config
{{< /highlight >}}

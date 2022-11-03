---
title: Adding environment variables in Flutter workflow editor
linkTitle: Adding environment variables
description: How to add environment variables in the Flutter workflow editor
weight: 4
aliases: /flutter/env-variables
---

Environment variables are useful for making available for Codemagic the credentials, configuration files or API keys that are required for successful building or integration with external services. For more information about the use of environment variables and a list of Codemagic read-only environment variables, refer [here](../yaml-basic-configuration/environment-variables).


## Adding environment variables

You can add environment variables to your Flutter projects in **App settings > Environment variables**.

1. Enter the name and the value of the variable.
2. Check **Secure** if you wish to hide the value both in the UI and in build logs and disable editing of the variable. Such variables can be accessed only by the build machines during the build.
3. Click **Add**.


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

Alternatively, you can run the following command and carefuly copy/paste the output:
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

{{< highlight bash "style=paraiso-dark">}}
  echo $YOUR_ENVIRONMENT_VARIABLE | base64 --decode > /path/to/decode/to/codemagic.keystore
{{< /highlight >}}



## Commonly used variable examples

#### Android builds

The following variable groups and variables are commonly used in Android builds.

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



#### iOS builds

The following variable groups and variables are commonly used in iOS builds.


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

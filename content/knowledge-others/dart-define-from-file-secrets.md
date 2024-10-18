---
title: Importing variables from JSON
description: How to import variables from a JSON file with dart-define-from-file
weight: 16
---
You can use Flutter's `dart-define-from-file` functionality to provide variables in JSON format for your app at build time. You can store your JSON configuration securely in Codemagic and make it available in your pipeline at build time. 

{{< notebox >}}
We would only recommend this approach for configuration settings and **avoid including sensitive values** such as API keys in your application whenever possible.
{{< /notebox >}}

## Configure the settings.json file 

Create the desired JSON configuration file. 

{{< highlight bash "style=paraiso-dark">}}
{
  "value_one": "abc",
  "value_two": "xyz"
}
{{< /highlight >}}

## Base64 encode your settings.json file 

Open your Terminal and Base64 encode your JSON file as follows. This will also copy it to your clipboard, making it easier for you to paste the value into Codemagic.

{{< highlight bash "style=paraiso-dark">}}
cat settings.json | base64 | pbcopy
{{< /highlight >}}


## Add your JSON as an environment variable in Codemagic

You can now add the Base64 encoded file as an environment variable in Codemagic as follows:

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**.
3. Enter the **_Variable value_**.
4. Enter the variable group name, e.g. **_json_**. Click the button to create the group.
5. If the **Secure** option is selected, the variable will be protected by encryption. Its value will not be visible in Codemagic UI or build logs, it will be transferred securely to the build machine and made available only while the build is running. The whole build machine will be destroyed after build ends.
6. Click the **Add** button to add the variable.

## Import the environment variable group in codemagic.yaml

Import your variable group in your codemagic.yaml as follows:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  workflow-name:
    environment:
      groups:
        - json_config
{{< /highlight >}}

## Using your settings.json to build your app

You will now need to save the settings.json file to disk so it can be used in your workflow. Assuming you named your variable `JSON_CONFIG` you can do this as follows:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  workflow-name:
    ...
    scripts:
      - name: Export JSON configuation
        script: echo "$JSON_CONFIG" | base64 --decode > settings.json
      ...
      - name: Flutter build for iOS
        script: |
          flutter build ipa --release \
            --build-name=1.0.0 \
            --build-number=$(($(app-store-connect get-latest-testflight-build-number "$APP_ID") + 1)) \
            --dart-define-from-file=settings.json
            --export-options-plist=/Users/builder/export_options.plist
{{< /highlight >}}

You `settings.json` file is saved to the same directory as your app and this is referenced in `dart-define-from-file`.

## Using Workflow Editor

You can add your Base64 encoded settings.json as an evironment variable in the Workflow Editor, and then script to decode the value to disk in the **Post-clone script** section.

{{< highlight yaml "style=paraiso-dark">}}
echo "$JSON_CONFIG" | base64 --decode > settings.json
{{< /highlight >}}

In the **Build section** use `dart-define-from-file` in the **Build arguments**


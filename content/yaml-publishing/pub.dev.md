---
title: pub.dev
description: How to deploy a package to pub.dev using codemagic.yaml
weight: 10
---

In order to get publishing permissions, you first need to log in to **pub.dev** locally. You can do this by running `pub publish --dry-run`.

This will create the `credentials.json` file, which you can use to log in without the need for Google confirmation through the browser. Credentials will be created in the pub cache directory (`~/.pub-cache/credentials.json` on MacOS and Linux, `%APPDATA%\Pub\Cache\credentials.json` on Windows).

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `PUB_DEV_CREDENTIALS`.
3. Enter the token value as **_Variable value_**.
4. Make sure the **Secure** option is selected.
5. Click the **Add** button to add the variable.

6. Configure publishing in `codemagic.yaml`

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    vars:
      PUB_DEV_CREDENTIALS
  
  # ...

  scripts:
    - name: Publish to pub.dev
      script: | 
        echo $PUB_DEV_CREDENTIALS | base64 --decode > "$FLUTTER_ROOT/.pub-cache/credentials.json"
        flutter pub publish --dry-run
        flutter pub publish -f
{{< /highlight >}}

---
description: How to base64 encode and decode files to use in your workflows
title: Base64 encoding and decoding files
weight: 8
aliases:
  - '../custom-scripts/base64-encode-decode'
---

In order to add files to your workflow, you will have to first base64 encode them. Once you have the base64 encoded string, you can [encrypt](../building/encrypting/) the string as usual, and later base64 decode it during build time.

With MacOS, in order to base64 encode a file and copy the contents to your clipboard, you can run the following command in the terminal:

  ```bash
  cat your_file_name.extension | base64 | pbcopy 
  ```
After the command has been run, you can paste the string from your clipboard to our [encryption tool](../building/encrypting/) and then save the encrypted string to your environment variables.
Once done, you can base64 decode it during build time in your scripts section using the following command:

  ```bash
  #!/usr/bin/env sh
  set -e # exit on first failed command

  echo $YOUR_ENVIRONMENT_VARIABLE | base64 --decode > /path/to/decode/to/your_file_name.extension
  ```

{{<notebox>}}

`post-clone script failed on base64 decode. The command could not be found`
If you received this error message when using the script above, it may be due to some invisible Unicode characters in the script after copy-pasting it. Try removing the space between the `base64` command and the `--decode` option and then adding it back.
{{</notebox>}}

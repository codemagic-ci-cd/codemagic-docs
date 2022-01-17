---
title: pub.dev
description: How to deploy a package to pub.dev using codemagic.yaml
weight: 7
---

In order to get publishing permissions, first, you will need to log in to pub.dev locally. It can be done by running `pub publish --dry-run`.
After that, `credentials.json` will be generated, which you can use to log in without the need for Google confirmation through the browser.

`credentials.json` can be found in the pub cache directory (`~/.pub-cache/credentials.json` on MacOS and Linux, `%APPDATA%\Pub\Cache\credentials.json` on Windows)

```yaml
- echo $CREDENTIALS | base64 --decode > "$FLUTTER_ROOT/.pub-cache/credentials.json"
- flutter pub publish --dry-run
- flutter pub publish -f
```
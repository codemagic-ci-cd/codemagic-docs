---
title: Signing macOS apps
description: How to set up macOS code signing in codemagic.yaml
weight: 2
aliases: /code-signing-yaml/signing-macos
---

All macOS applications have to be digitally signed before they can be installed on devices or made available to the public via the Mac App Store or outside of the Mac App Store.

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**. If your workflow is configured with **Flutter workflow editor** please go to [Signing macOS apps using the Flutter workflow editor](../code-signing/macos-code-signing).
{{</notebox>}}

{{< include "/partials/code-signing-macos.md" >}}

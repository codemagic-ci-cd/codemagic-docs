---
title: Code signing for personal accounts
description: How to set up code signing for personal accounts
weight: 4
aliases: /code-signing-yaml/code-signing-personal-accounts
---

{{<notebox>}}
**Note**: This guide is written specifically for users with `Personal accounts`. While these methods can certainly be applied to workflows in `Team accounts`, we encourage Team account users to make use of the greatly simplified [iOS Code Signing](../yaml-code-signing/signing-ios), [MacOS Code Signing](../yaml-code-signing/signing-macos) and [Android Code Signing](../yaml-code-signing/signing-android) methods.
{{</notebox>}}


All iOS, MacOS and Android applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. This document will guide you through the necessary steps to sign your app if your workflows are configured to use the `codemagic.yaml` file. If you are using our `Flutter Workflow Editor`, please consult the relevant guides for [iOS](../flutter-code-signing/ios-code-signing), [Android](../flutter-code-signing/ios-code-signing) or [MacOS](../flutter-code-signing/macos-code-signing).



{{< tabpane >}}

{{< tab header="Android" >}}
{{< include "/partials/code-signing-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/code-signing-ios.md" >}}
{{< /tab >}}

{{< tab header="MacOS" >}}
{{< include "/partials/code-signing-macos.md" >}}
{{< /tab >}}

{{< /tabpane >}}


---
title: Alternative code signing methods
description: How to set up code signing without using code signing identities
weight: 4
aliases: /code-signing-yaml/code-signing-personal-accounts
---
<br>


All iOS, macOS and Android applications have to be digitally signed before they are made available to the public to confirm their author and guarantee that the code has not been altered or corrupted since it was signed. This document will guide you through the necessary steps to sign your app if your workflows are configured to use the `codemagic.yaml` file. If you are using our `Flutter Workflow Editor`, please consult the relevant guides for [iOS](../flutter-code-signing/ios-code-signing), [Android](../flutter-code-signing/ios-code-signing) or [macOS](../flutter-code-signing/macos-code-signing).



{{< tabpane >}}

{{< tab header="Android" >}}
{{< include "/partials/code-signing-without-identities-android.md" >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< include "/partials/code-signing-without-identities-ios.md" >}}
{{< /tab >}}

{{< tab header="MacOS" >}}
{{< include "/partials/code-signing-macos.md" >}}
{{< /tab >}}

{{< /tabpane >}}


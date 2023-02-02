---
description: A list of tools available out-of-the-box on Codemagic macOS build machines.
title: macOS build machine specification
aliases:
  - "../releases-and-versions/versions-linux"
weight: 1
---

Depending on the Xcode version that you specify in **Build Settings** or in `codemagic.yaml` file, Codemagic will use a different build machine type with different versions of preinstalled software:

{{< tabpane >}}

{{< tab header="M1 Xcode 14.2 (default)" >}}
{{< include "/partials/specs/versions-macos-m1-xcode-14-2.md" >}}
{{< /tab >}}

{{< tab header="M1 Xcode 13.3 - 14.1" >}}
{{< include "/partials/specs/versions-macos-m1-xcode-13-3.md" >}}
{{< /tab >}}

{{< tab header="Xcode 14.2" >}}
{{< include "/partials/specs/versions-macos-xcode-14-2.md" >}}
{{< /tab >}}

{{< tab header="Xcode 13.3 - 14.1" >}}
{{< include "/partials/specs/versions-macos-xcode-13-3.md" >}}
{{< /tab >}}

{{< tab header="Xcode 13.0 - 13.2" >}}
{{< include "/partials/specs/versions-macos-xcode-13-0.md" >}}
{{< /tab >}}

{{< tab header="Xcode 12.5" >}}
{{< include "/partials/specs/versions-macos-xcode-12-5.md" >}}
{{< /tab >}}

{{< tab header="Xcode 12.0 - 12.4" >}}
{{< include "/partials/specs/versions-macos-xcode-12-0.md" >}}
{{< /tab >}}

{{< tab header="Xcode 11.x" >}}
{{< include "/partials/specs/versions-macos-xcode-11.md" >}}
{{< /tab >}}

{{< /tabpane >}}
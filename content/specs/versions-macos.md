---
description: A list of tools available out-of-the-box on Codemagic macOS build machines.
title: macOS build machine specification
aliases:
  - "../releases-and-versions/versions-macos"
weight: 1
---

Depending on the Xcode version that you specify in **Build Settings** or in `codemagic.yaml` file, Codemagic will use a different build machine type with different versions of preinstalled software:

## Apple silicon machines

{{< tabpane >}}

{{< tab header="Xcode 15.3 (default)" >}}
{{< include "/partials/specs/versions-macos-silicon-xcode-15-3.md" >}}
{{< /tab >}}

{{< tab header="Xcode 16.0 (edge)" >}}
{{< include "/partials/specs/versions-macos-silicon-xcode-16.md" >}}
{{< /tab >}}

{{< tab header="Xcode 15.4" >}}
{{< include "/partials/specs/versions-macos-silicon-xcode-15-4.md" >}}
{{< /tab >}}

{{< tab header="Xcode 15.2" >}}
{{< include "/partials/specs/versions-macos-silicon-xcode-15-2.md" >}}
{{< /tab >}}

{{< tab header="Xcode 15.1" >}}
{{< include "/partials/specs/versions-macos-silicon-xcode-15-1.md" >}}
{{< /tab >}}

{{< tab header="Xcode 15" >}}
{{< include "/partials/specs/versions-macos-silicon-xcode-15.md" >}}
{{< /tab >}}

{{< /tabpane >}}

&nbsp;&nbsp;
## Intel-based machines

{{< tabpane >}}

{{< tab header="Xcode 14.2" >}}
{{< include "/partials/specs/versions-macos-intel-xcode-14-2.md" >}}
{{< /tab >}}

{{< tab header="Xcode 13.3 - 14.1" >}}
{{< include "/partials/specs/versions-macos-intel-xcode-13-3.md" >}}
{{< /tab >}}

{{< tab header="Xcode 13.0 - 13.2" >}}
{{< include "/partials/specs/versions-macos-intel-xcode-13-0.md" >}}
{{< /tab >}}

{{< tab header="Xcode 12.5" >}}
{{< include "/partials/specs/versions-macos-intel-xcode-12-5.md" >}}
{{< /tab >}}

{{< /tabpane >}}

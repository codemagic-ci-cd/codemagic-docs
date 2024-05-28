---
description: How we release and deprecate Xcode versions
title: Xcode update policy
aliases:
weight: 4
---

## Overview

Codemagic macOS build machines come with a range of Xcode versions and runtimes preinstalled. 

As a minimum, the machines in our shared pool will always support the latest major Xcode version along with all of its minor versions as well as previous major versions that can be used for App Store submissions.

You can check the currently available Xcode versions [here](../specs/versions-macos). 

If you require access to older Xcode versions that are not available in the shared pool, please [contact us](https://codemagic.io/pricing/#enterprise).

## Xcode version updates

When a new beta or release version of Xcode is released, we aim to make it available to our users as soon as possible. New versions are usually rolled out over the weekend.

Patch releases will replace the previous patch version of an Xcode release. If you have specified your Xcode version with the precision of a patch version, we will automatically resolve it to the latest patch of that version. 

Codemagic uses two aliases for Xcode versions -- `latest` and `edge`. `latest` points to the latest *release* version of Xcode. When a new major release version is rolled out, we do not point `latest` to that version immediately but announce the date on our [GitHub Discussions](https://github.com/orgs/codemagic-ci-cd/discussions) page. In case of minor and patch version updates, `latest` is updated as soon as the versions are rolled out. 

`edge` always points to the latest available Xcode version (`minor.major.patch`) on our build machines and can thus point to a release or a beta version. We recommend using `latest` and `edge` in your build configuration if you want to regularly test your builds against the latest release or beta versions.

## Deprecation of Xcode versions

Our Xcode version deprecation policy for the machines in the shared pool is guided by [Apple's requirements](https://developer.apple.com/news/upcoming-requirements/). When an Xcode version is no longer supported for App Store Connect submissions, we will schedule that version for deprecation. In such cases we will post an announcement about the upcoming deprecation and the timeline in our [GitHub Discussions](https://github.com/codemagic-ci-cd/codemagic-docs/discussions) page.

Please note that in certain cases we may decide to keep Xcode versions available for a longer period of time.

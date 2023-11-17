---
description: How we release and deprecate Xcode versions
title: Xcode update policy
aliases:
weight: 4
---

## Overview

Codemagic macOS build machines come with a range of Xcode versions and runtimes preinstalled. 

As a minimum, we will always support the four latest major Xcode versions:

* The two latest major Xcode versions and all of their minor versions at the latest patch version. 
* The two previous major Xcode versions at the latest `major.minor.patch` version.

You can check the currently available Xcode versions [here](../specs/versions-macos).

## Xcode version updates

When a new beta or release version of Xcode is released, we aim to make it available to our users as soon as possible. New versions are usually rolled out over the weekend.

Patch releases will replace the previous patch version of an Xcode release. If you have specified your Xcode version with the precision of a patch version, we will automatically resolve it to the latest patch of that version. 

Codemagic uses two aliases for Xcode versions -- `latest` and `edge`. `latest` points to the latest *release* version of Xcode. When a new major release version is rolled out, we point `latest` to that version two weeks after the rollout. In case of minor and patch version updates, `latest` is updated as soon as the versions are rolled out. 

`edge` always points to the latest available Xcode version (`minor.major.patch`) on our build machines and can thus point to a release or a beta version. We recommend using `latest` and `edge` in your build configuration if you want to regularly test your builds against the latest release or beta versions.

## Deprecation of Xcode versions

When a new release version of Xcode becomes available in Codemagic, you can expect the Xcode version that is now no longer among the four latest major versions to be deprecated. For example, once Xcode 15 is released, we are bound to remove Xcode 11. In such cases we will post an announcement about the upcoming deprecation and the timeline in our [GitHub Discussions](https://github.com/codemagic-ci-cd/codemagic-docs/discussions) page.

Please note that in certain cases we may decide to keep certain Xcode versions available for a longer period of time.

## Runtimes

On every Xcode image, we aim to support the most recent simulator versions bundled with the Xcode version as well as two previous simulator versions. More sepcifically, for every Xcode major version, the image will contain the following simulator runtimes:

* The latest major simulator version and all of its minor versions.
* The two previous major simulator versions at the latest minor version.

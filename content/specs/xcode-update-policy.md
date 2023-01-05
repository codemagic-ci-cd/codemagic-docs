---
description: How we release and deprecate Xcode versions
title: Xcode update policy
aliases:
weight: 4
---

## Overview

Codemagic macOS build machines come with a range of Xcode versions and runtimes preinstalled. 

In general, we will always support the four latest major Xcode versions:

* The latest major Xcode version and all of its minor versions at the latest patch version (e.g. Xcode `14.0.1`, `14.1`, `14.2` etc)
* Three previous major Xcode versions at the latest `major.minor.patch` version (e.g. Xcode `13.4.1`, `12.5.1`, `11.7`)

You can check the currently available Xcode versions [here](../specs/versions-macos).

## Xcode version updates

When a new beta or release version of Xcode is released, we aim to make it available to our users as soon as possible. We usually schedule the rollout of new images to a time with low demand to avoid build queues. 

New versions of Xcode may be installed on an existing image, or a completely new image may be created to support a new Xcode version. Patch releases will replace the previous patch version of an Xcode release. If you have specified your Xcode version with the precision of a patch version, we will automatically resolve it to the latest patch of that version.

The latest available Xcode version (`minor.major.patch`) on our machines is aliased with `edge`. We recommend setting your Xcode version to `edge` if you want to regularly test your builds against the latest (beta) releases. 

In two weeks of rolling out a new major release of Xcode, we point `latest` to that version. In case of minor and patch version updates, `latest` is updated as soon as the versions are rolled out. The image with latest stable release of Xcode is also used by default when Xcode version is unset in build configuration.  

## Deprecation of Xcode versions

When a new release version of Xcode becomes available in Codemagic, you can expect the Xcode version that is now no longer among the four latest major versions to be deprecated. For example, once Xcode 15 is released, we are bound remove Xcode 11. In such cases we will post an announcement about the upcoming deprecation and the timeline in our [GitHub Discussions](https://github.com/codemagic-ci-cd/codemagic-docs/discussions) page.

Please note that in certain cases we may decide to keep certain Xcode versions available for a longer period of time.

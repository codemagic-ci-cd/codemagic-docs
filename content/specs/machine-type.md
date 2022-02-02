---
description: How to configure build machine type
title: Build machine type
weight: 1
aliases:
    - '../building/machine-type/'
---

## Configuring build machine type

In `codemagic.yaml`, the build machine type can be specified with [Instance type](../getting-started/yaml#instance-type).

For Flutter projects configured via the Flutter workflow editor, the build machine type can be selected in **App settings > Workflow settings > Machine**.

## Mac Mini and Mac Pro

Codemagic offers two types of macOS machines for running builds: Mac mini (macOS standard VM, default) and Mac Pro (macOS premium VM). Specifications for these machines are available for [Xcode 11.x](../specs/versions/#hardware), [Xcode 12.0 - 12.4](../specs/versions2/#hardware), [Xcode 12.5](../specs/versions3/#hardware), and [Xcode 13.0+](../specs/versions4/).

{{<notebox>}}
Mac Pro machines are only available for teams and users that have [billing enabled](../billing/billing). See the [pricing page](https://codemagic.io/pricing/) for the per minute rate.
{{</notebox>}}

## Linux Standard and Linux Premium

Codemagic offers two types of Linux machines for running builds: Linux standard VM and Linux premium VM. Linux machines support nested virtualisation, including Android emulator support with hardware acceleration. Linux machines do not support macOS specific software, such as brew and Xcode, and cannot be used to build iOS artifacts. Specifications for these machines are available [here](../specs/versions-linux/#hardware).

{{<notebox>}}
Linux Standard and Premium machines are only available for teams and users that have [enabled billing](../billing/billing). See the [pricing page](https://codemagic.io/pricing/) for the per minute rate.
{{</notebox>}}

## Windows Premium

Codemagic offers only premium Windows VMs. Windows VMs do not support nested virtualization which is required for the use of Android emulator. Additionally, Windows machines do not support macOS specific software, such as brew and Xcode, and cannot be used to build iOS artifacts. Specifications for these machines are available [here](../specs/versions-windows/).

{{<notebox>}}
Windows Premium machines are only available for teams and users that have [enabled billing](../billing/billing). See the [pricing page](https://codemagic.io/pricing/) for the per minute rate.
{{</notebox>}}

## Xcode version update policy

Codemagic macOS build machines come with a range of Xcode versions and runtimes preinstalled. In general, we will always support 3 latest major Xcode versions:

* The latest major Xcode version and all of its minor versions
* The latest minor version of two previous major Xcode versions

The currently available Xcode versions are as follows:

* [Xcode 13.3+ base image](../specs/versions-macos-xcode-13-3/): `13.3`
* [Xcode 13.0 - 13.2 base image](../specs/versions-macos-xcode-13-0/): `13.0`, `13.1`, `13.2.1`
* [Xcode 12.5 base image](../specs/versions-macos-xcode-12-5/): `12.5.1`, `12.5`, `12.4`
* [Xcode 12.0 - 12.4 base image](../specs/versions-macos-xcode-12-0/): `12.4`, `12.3`, `12.2`, `12.1.1`, `12.0.1`
* [Xcode 11.x base image](../specs/versions-macos-xcode-11/): `11.7`, `11.6`,  `11.5`. `11.4.1`,  `11.3.1`. `11.2.1`, `11.1`. `11.0` 

---
description: How to configure build machine type
title: Build machine type
weight: 1
aliases:
    - '../building/machine-type/'
    - /specs/machine-type
---

## Configuring build machine type

In `codemagic.yaml`, the build machine type can be specified with [Instance type](/yaml-basic-configuration/yaml-getting-started/#instance-type).


For Flutter projects configured via the Flutter workflow editor, the build machine type can be selected in **App settings > Workflow settings > Machine**.

## macOS Standard and macOS Premium

Codemagic offers three types of macOS machines for running builds:

* Mac minis with Apple M1 chip (macOS M1 Standard VM, default)
* Mac Pros (macOS premium VM)
* Mac minis (macOS standard VM)


Check the specific macOS build machine image for machine [specifications](../specs/versions-macos).

Xcode 13 images and above have System Integrity Protection (SIP) disabled in order to run macOS UI tests, which require accessibility permissions. Older images with Xcode 12 and below do not have SIP disabled and are unsuitable for UI testing macOS apps.

{{<notebox>}}
**Note:** Mac Pro machines and Mac minis are only available for teams and users that have [billing enabled](../billing/billing). See the [pricing page](https://codemagic.io/pricing/) for more information.
{{</notebox>}}

## Linux Standard and Linux Premium

Codemagic offers two types of Linux machines for running builds: Linux standard VM and Linux premium VM. Linux machines support nested virtualisation, including Android emulator support with hardware acceleration. Linux machines do not support macOS specific software, such as brew and Xcode, and cannot be used to build iOS artifacts. Specifications for these machines are available [here](../specs/versions-linux/#hardware).

{{<notebox>}}
**Note:** Linux Standard and Premium machines are only available for teams and users that have [billing enabled](../billing/billing). See the [pricing page](https://codemagic.io/pricing/) for more information.
{{</notebox>}}

## Windows Premium

Codemagic offers only premium Windows VMs. Windows VMs do not support nested virtualization which is required for the use of Android emulator. Additionally, Windows machines do not support macOS specific software, such as brew and Xcode, and cannot be used to build iOS artifacts. Specifications for these machines are available [here](../specs/versions-windows/).

{{<notebox>}}
**Note:** Windows Premium machines are only available for teams and users that have [billing enabled](../billing/billing). See the [pricing page](https://codemagic.io/pricing/) for more information.
{{</notebox>}}

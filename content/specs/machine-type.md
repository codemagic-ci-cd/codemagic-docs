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

Codemagic offers two types of macOS machines for running builds: Mac mini (macOS standard VM, default) and Mac Pro (macOS premium VM). Specifications for these machines are available [here](../specs/versions/#hardware). 

{{<notebox>}}
Mac Pro machines are only available for teams and users that have [billing enabled](../billing/billing). See the [pricing page](https://codemagic.io/pricing/) for the per minute rate.
{{</notebox>}}

## Linux Standard and Linux Premium

Codemagic offers two types of linux machines for running builds: Linux standard VM and Linux premium VM. Linux machines support nested virtualisation, including Android emulator support with hardware acceleration. Linux machines do not support macOS specific software, such as brew and Xcode, and cannot be used to build iOS artifacts. Specifications for these machines are available [here](../specs/versions-linux/#hardware).

{{<notebox>}}
Linux Standard and Premium machines are only available for teams and users that have [enabled billing](../billing/billing) for builds configured with [codemagic.yaml](../getting-started/yaml/). See the [pricing page](https://codemagic.io/pricing/) for the per minute rate.
{{</notebox>}}
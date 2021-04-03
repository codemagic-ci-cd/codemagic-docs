---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: Linux build machine specification
aliases:
  - '../releases-and-versions/versions-linux'
weight: 5
---

## Hardware

- Standard VM on Linux `4 vCPUs, 16 GB memory`
- Premium VM on Linux `8 vCPUs, 32 GB memory`

## System

- System version `Ubuntu 20.04.1 LTS`
- Kernel version `5.4.0-1036-gcp`
- Disk `97GB (Free Space: 60GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- aws `1.18.69`
- curl `7.68.0`
- dart `2.10.5`
- docker `20.10.2`
- firebase `9.1.0`
- flutter `2.0.4 ($HOME/programs/flutter)`
- gem `3.1.4`
- git `2.25.1`
- ionic `5.4.16`
- jq `jq-1.6`
- node `14.15.3`
- npm `6.14.9`
- python2 `2.7.18`
- python `3.8.5`
- ruby `2.7.2p137`
- ssh
- sudo
- tar
- unzip
- wget
- yarn `1.22.5`
- yq `3.3.2`
- zip

## Android emulators

- **emulator**

    - Device: `pixel_4 (Google)`
    - Path: `/home/builder/.android/avd/emulator.avd`
    - Target: `Google Play (Google Inc.)`
    - Based on: `Android 10.0 (Q)`
    - Tag/API: `google_apis_playstore/x86`
    - Skin: `pixel_4`
    - Sdcard: `512M`

## Java versions

- **15**: version `15-ea (2020-09-15)`, OpenJDK Runtime Environment
- **11**: version `11.0.10 (2021-01-19)`, OpenJDK Runtime Environment
- **1.8**: version `1.8.0_282`, OpenJDK Runtime Environment

## Android Studio 4.1.2 (201.8743.12.41.7042882)

Android Studio path: `~/programs/android-studio`

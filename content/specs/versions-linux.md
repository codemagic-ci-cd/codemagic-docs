---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: Linux build machine specification
aliases:
  - "../releases-and-versions/versions-linux"
weight: 2
---

## Hardware

- Standard VM on Linux `4 vCPUs, 16 GB memory` (instance type `linux`)
- Premium VM on Linux `8 vCPUs, 32 GB memory` (instance type `linux_x2`)

## System

- System version `Ubuntu 20.04.2 LTS`
- Kernel version `5.11.0-1029-gcp`
- Disk `97GB (Free Space: 50GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `22.0.7026061`
- aws `1.18.69`
- curl `7.68.0`
- docker `20.10.7`
- ew-cli `0.0.44`
- firebase `9.23.3`
- flutter `3.0.1 ($HOME/programs/flutter)`
- gem `3.1.4`
- gh `1.8.1`
- git `2.25.1`
- Google Cloud SDK `348.0.0`
- gradle `6.7.1`
- gsutil `4.65`
- ionic `5.4.16`
- jq `jq-1.6`
- ktlint `0.43.2`
- node `14.15.3`
- npm `6.14.9`
- python2 `2.7.18`
- python `3.8.10`
- ruby `2.7.2p137`
- ssh
- snapcraft `6.1`
- sudo
- tar / bsdtar
- unzip
- wget
- yarn `1.22.5`
- yq `4.24.2`
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

- **15-ea (2020-09-15)** JAVA_HOME: `/usr/lib/jvm/java-1.15.0-openjdk-amd64`
- **11.0.10 (2021-01-19)** (default) JAVA_HOME: `/usr/lib/jvm/java-1.11.0-openjdk-amd64`
- **1.8.0_282** JAVA_HOME: `/usr/lib/jvm/java-1.8.0-openjdk-amd64`

## Android Studio 4.1.2 (201.8743.12.41.7042882)

Android Studio path: `~/programs/android-studio`

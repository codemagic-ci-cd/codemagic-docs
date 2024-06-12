---
description: A list of tools available out-of-the-box on Codemagic Linux build machines.
title: Linux build machine specification
aliases:
  - "../releases-and-versions/versions-linux"
weight: 2
---

## Hardware

- VM on Linux `8 vCPUs, 32 GB memory`

## System

- System version `Ubuntu 20.04.2 LTS`
- Kernel version `5.11.0-1029-gcp`
- Disk `97GB (Free Space: 31GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- aws `2.8.9`
- curl `7.68.0`
- docker `24.0.2`
- ew-cli `0.9.17`
- fastlane `2.214.0`
- firebase `11.21.0`
- flutter `3.13.6 ($HOME/programs/flutter)`
- gem `3.1.4`
- gh `1.8.1`
- git `2.25.1`
- Google Cloud SDK `435.0.1`
- gradle `8.1.1`
- gsutil `5.24`
- ionic `5.4.16`
- jq `jq-1.6`
- ktlint `0.43.2`
- node `20.11.1`
- npm `10.2.4`
- python2 `2.7.18`
- python `3.8.10`
- ruby `2.7.2p137`
- ssh
- snapcraft `7.4.3`
- sudo
- tar / bsdtar
- unzip
- wget
- yarn `1.22.19`
- yq `4.34.1`
- zip

## Android emulators

- **emulator**

  - Device: `pixel_4 (Google)`
  - Path: `/home/builder/.android/avd/emulator.avd`
  - Target: `Google Play (Google Inc.)`
  - Based on: `Android 11.0 (R)`
  - Tag/API: `google_apis_playstore/x86`
  - Skin: `pixel_4`
  - Sdcard: `512M`

## Java versions

- **21.0.1** JAVA_HOME: `/usr/lib/jvm/java-1.21.0-openjdk-amd64`
- **17.0.8.1** (default) JAVA_HOME: `/usr/lib/jvm/java-1.17.0-openjdk-amd64`
- **15.0.3** JAVA_HOME: `/usr/lib/jvm/java-1.15.0-openjdk-amd64`
- **11.0.20.1** JAVA_HOME: `/usr/lib/jvm/java-1.11.0-openjdk-amd64`
- **1.8.0_382** JAVA_HOME: `/usr/lib/jvm/java-1.8.0-openjdk-amd64`

## Android Studio 2022.3

Android Studio path: `~/programs/android-studio`

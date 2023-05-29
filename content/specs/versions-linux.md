---
description: A list of tools available out-of-the-box on Codemagic Linux build machines.
title: Linux build machine specification
aliases:
  - "../releases-and-versions/versions-linux"
weight: 2
---

## Hardware

- Standard VM on Linux `4 vCPUs, 16 GB memory`
- Premium VM on Linux `8 vCPUs, 32 GB memory`

## System

- System version `Ubuntu 20.04.2 LTS`
- Kernel version `5.11.0-1029-gcp`
- Disk `97GB (Free Space: 43GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `22.0.7026061`
- aws `2.8.9`
- curl `7.68.0`
- docker `20.10.7`
- ew-cli `0.0.44`
- fastlane `2.209.1`
- firebase `11.21.0`
- flutter `3.10.2 ($HOME/programs/flutter)`
- gem `3.1.4`
- gh `1.8.1`
- git `2.25.1`
- Google Cloud SDK `423.0.0`
- gradle `7.6`
- gsutil `4.65`
- ionic `5.4.16`
- jq `jq-1.6`
- ktlint `0.43.2`
- node `16.20.0`
- npm `8.11.0`
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
  - Based on: `Android 11.0 (R)`
  - Tag/API: `google_apis_playstore/x86`
  - Skin: `pixel_4`
  - Sdcard: `512M`

## Java versions

- **17 (2021-09-14)** JAVA_HOME: `/usr/lib/jvm/java-1.17.0-openjdk-amd64`
- **15 (2020-09-15)** JAVA_HOME: `/usr/lib/jvm/java-1.15.0-openjdk-amd64`
- **11.0.10 (2021-01-19)** (default) JAVA_HOME: `/usr/lib/jvm/java-1.11.0-openjdk-amd64`
- **1.8.0_282** JAVA_HOME: `/usr/lib/jvm/java-1.8.0-openjdk-amd64`

## Android Studio 4.1.2 (201.8743.12.41.7042882)

Android Studio path: `~/programs/android-studio`

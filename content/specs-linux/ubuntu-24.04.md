---
description: A list of tools available out-of-the-box on Codemagic Linux Ubuntu 24.04
title: Ubuntu 24.04
aliases:
weight: 1
---

## Hardware

- Linux virtual machine: `8 vCPUs, 32 GB memory`

## System

- System version `Ubuntu 24.04.2 LTS`
- Kernel version `6.8.0-1026-gcp`
- Disk `150GB (Free Space: 86GB)`




## Android emulators

- **emulator**

  - Device: `pixel_4 (Google)`
  - Path: `/home/builder/.android/avd/emulator.avd`
  - Target: `Google Play (Google Inc.)`
  - Based on: `Android 14.0 (API level 34)`
  - Tag/API: `google_apis_playstore/x86`
  - Skin: `pixel_4`
  - Sdcard: `512M`

- **emulator-35**

  - Device: `pixel_4 (Google)`
  - Path: `/home/builder/.android/avd/emulator-35.avd`
  - Target: `Google Play (Google Inc.)`
  - Based on: `Android 15 (API level 35)`
  - Tag/API: `google_apis_playstore/x86`
  - Skin: `pixel_4`
  - Sdcard: `512M`

- **emulator-36**

  - Device: `pixel_6a (Google)`
  - Path: `/home/builder/.android/avd/emulator-36.avd`
  - Target: `Google Play (Google Inc.)`
  - Based on: `Android 16 (API level 36)`
  - Tag/API: `google_apis_playstore/x86`
  - Skin: `pixel_6a`
  - Sdcard: `512M`


## Android Studio 2024.3.1.13

Android Studio path: `~/programs/android-studio`

## Java versions

- **21.0.1** `/usr/lib/jvm/java-1.21.0-openjdk-amd64`
- **17.0.11** (default) JAVA_HOME: `/usr/lib/jvm/java-1.17.0-openjdk-amd64`
- **11.0.20.1** `/usr/lib/jvm/java-1.11.0-openjdk-amd64`
- **1.8.0_382** `/usr/lib/jvm/java-1.8.0-openjdk-amd64`

## Gradle versions

- **8.13** `/home/builder/programs/gradle-8.13` 
- **8.11.1** (default) `/home/builder/programs/gradle-8.11.1`
- **8.1.1** `/home/builder/programs/gradle-8.1.1`
- **7.6** `/home/builder/programs/gradle-7.6`
- **7.3.1** `/home/builder/programs/gradle-7.3.1`

## Other pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `22.0.7026061` `25.2.9519653`
- aws `2.25.7`
- curl `8.5.0`
- docker `28.0.1`
- ew-cli `0.11.1`
- fastlane `2.226.0`
- firebase `13.34.0`
- gem `3.4.2`
- gh `2.45.0`
- git `2.43.0`
- Google Cloud SDK `516.0.0`
- gsutil `5.33`
- ionic `7.2.0`
- jq `jq-1.7`
- ktlint `1.5.0`
- node `22.14.1`
- npm `11.2.0`
- python `3.12.5`
- ruby `3.4.2`
- OpenSSH `9.6p1`
- snapcraft `8.7.3`
- sudo
- tar / bsdtar
- unzip
- wget
- yarn `4.7.0`
- yq `4.44.5`
- zip


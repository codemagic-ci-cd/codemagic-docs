---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: macOS build machine specification (Xcode 13.3+)
aliases:
  - '../releases-and-versions/versions5'
  - '../specs/versions5'
weight: 8
---

## Hardware

- Standard VM on Mac mini `2.3GHz Quad Core / 8GB`
- Premium VM on Mac Pro `3.7GHz Quad Core / 32GB`

## System

- System version `macOS 12.2 (21D49)`
- Kernel version `Darwin 21.3.0`
- Disk `322GB (Free Space: 141GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `23.1.7779620`
- aws `2.4.17`
- cocoapods `1.11.2`
- cordova `11.0.0`
- curl
- docker `20.10.2`
- fastlane `2.204.2`
- firebase `9.3.0`
- flutter `2.10.2 ($HOME/programs/flutter)`
- gem `3.3.6`
- gh `2.5.0`
- git `2.35.1`
- Google Cloud SDK `327.0.0`
- gradle `7.3.1`
- gsutil `4.58`
- homebrew `3.3.14`
- ionic `6.12.4`
- jq
- ktlint `0.43.2`
- node `14.15.5`
- npm `8.3.1`
- python `3.8.7`
- python3 `3.8.7`
- ruby `2.7.2p137`
- ssh
- sudo
- tar
- unzip
- wget
- yarn `1.22.17`
- yq
- zip

## Android emulators

- **emulator**

    - Device: `pixel_3a (Google)`
    - Path: `/Users/builder/.android/avd/emulator.avd`
    - Target: `Google Play (Google Inc.)`
    - Based on: `Android 10.0 (Q)`
    - Tag/API: `google_apis_playstore/x86`
    - Skin: `pixel_3a`
    - Sdcard: `512M`

## Java versions

- **17.0.2** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
- **16.0.2** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-16.jdk/Contents/Home`
- **11.0.14** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_322** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`

## Xcode 13.3 (13E5095k)

This is the Xcode version used by default when you select `13.3` or `edge` in build settings in the workflow
editor for Flutter apps or set Xcode version to the corresponding values in your codemagic.yaml file.

Xcode path: `/Applications/Xcode-13.3.app`

With Xcode `13.3` build version `13E5095k` the following runtimes and devices are installed:

### Runtimes

- iOS 14.5
- iOS 15.0
- iOS 15.4
- tvOS 14.5
- tvOS 15.0
- tvOS 15.4
- watchOS 7.4
- watchOS 8.0
- watchOS 8.5

### Devices

- Apple TV
- Apple TV 4K
- Apple TV 4K (2nd generation)
- Apple TV 4K (at 1080p)
- Apple TV 4K (at 1080p) (2nd generation)
- Apple Watch Series 5 - 40mm
- Apple Watch Series 5 - 44mm
- Apple Watch Series 6 - 40mm
- Apple Watch Series 6 - 44mm
- Apple Watch Series 7 - 41mm
- Apple Watch Series 7 - 45mm
- iPad (8th generation)
- iPad (9th generation)
- iPad Air (4th generation)
- iPad Pro (11-inch) (2nd generation)
- iPad Pro (11-inch) (3rd generation)
- iPad Pro (12.9-inch) (4th generation)
- iPad Pro (12.9-inch) (5th generation)
- iPad Pro (9.7-inch)
- iPad mini (6th generation)
- iPhone 11
- iPhone 11 Pro
- iPhone 11 Pro Max
- iPhone 12
- iPhone 12 Pro
- iPhone 12 Pro Max
- iPhone 12 mini
- iPhone 13
- iPhone 13 Pro
- iPhone 13 Pro Max
- iPhone 13 mini
- iPhone 8
- iPhone 8 Plus
- iPhone SE (2nd generation)
- iPod touch (7th generation)


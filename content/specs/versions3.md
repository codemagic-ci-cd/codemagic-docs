---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: macOS build machine specification (Xcode 12.5)
aliases:
  - '../releases-and-versions/versions3'
weight: 3
---

## Hardware

- Standard VM on Mac mini `2.3GHz Quad Core / 8GB`
- Premium VM on Mac Pro `3.7GHz Quad Core / 32GB`

## System

- System version `macOS 11.2 (20D64)`
- Kernel version `Darwin 20.3.0`
- Disk `322GB (Free Space: 71GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `22.1.7171670`
- aws `2.2.14`
- cocoapods `1.10.1`
- cordova `10.0.0`
- curl
- docker `20.10.2`
- fastlane `2.186.0`
- firebase `9.3.0`
- flutter `2.2.3 ($HOME/programs/flutter)`
- gem `3.1.4`
- gh `1.11.0`
- git `2.32.0`
- Google Cloud SDK `327.0.0`
- gradle `6.7.1`
- gsutil `4.58`
- homebrew `3.2.0`
- ionic `6.12.4`
- jq
- node `14.15.5`
- npm `7.18.1`
- python `3.8.7`
- python3 `3.8.7`
- ruby `2.7.2p137`
- ssh
- sudo
- tar
- unzip
- wget
- yarn `1.22.10`
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

- **16.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-16.jdk/Contents/Home`
- **15.0.3** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-15.jdk/Contents/Home`
- **11.0.11** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_292** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`

## Xcode 12.5.1 (12E507)

This is the Xcode version used by default when you select `12.5.1` or `latest` in build settings in the workflow
editor for Flutter apps or set Xcode version to `12.5.1` or `latest` in your codemagic.yaml file.
Other available versions are listed [here](#other-xcode-versions).

Xcode path: `/Applications/Xcode-12.5.1.app`

With Xcode `12.5.1` build version `12E507` the following runtimes and devices are installed:

### Runtimes

- iOS 14.0
- iOS 14.1
- iOS 14.2
- iOS 14.3
- iOS 14.4
- iOS 14.5
- tvOS 14.0
- tvOS 14.2
- tvOS 14.3
- tvOS 14.4
- tvOS 14.5
- watchOS 7.0
- watchOS 7.1
- watchOS 7.2
- watchOS 7.4

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
- iPad (8th generation)
- iPad Air (4th generation)
- iPad Pro (11-inch) (2nd generation)
- iPad Pro (11-inch) (3rd generation)
- iPad Pro (12.9-inch) (4th generation)
- iPad Pro (12.9-inch) (5th generation)
- iPad Pro (9.7-inch)
- iPhone 11
- iPhone 11 Pro
- iPhone 11 Pro Max
- iPhone 12
- iPhone 12 Pro
- iPhone 12 Pro Max
- iPhone 12 mini
- iPhone 8
- iPhone 8 Plus
- iPhone SE (2nd generation)
- iPod touch (7th generation)

## Other Xcode versions

- 12.5 (12E262) `/Applications/Xcode-12.5.app`
- 12.4 (12D4e) `/Applications/Xcode-12.4.app`


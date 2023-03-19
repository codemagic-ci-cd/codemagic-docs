---
description: A list of tools available out-of-the-box on Codemagic macOS build machines using Xcode version 14.2+.
title: macOS build machine specification (Xcode 14.2+ / Unity)
aliases:

weight: 9
---

## Hardware

- Standard VM on Mac mini `2.3GHz Quad Core / 8GB`
- Premium VM on Mac Pro `3.7GHz Quad Core / 32GB`

## System

- System version `macOS 12.6.1 (21G217)`
- Kernel version `Darwin 21.6.0`
- Disk `322GB (Free Space: 81GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `23.0.7123448`
- aws `2.9.6`
- carthage `0.38.0`
- cocoapods `1.11.3`
- cordova `11.0.0`
- curl `7.79.1`
- docker `20.10.17`
- ew-cli `0.9.1`
- fastlane `2.211.0`
- firebase `11.21.0`
- flutter `3.7.7 ($HOME/programs/flutter)`
- gem `3.3.26`
- gh `2.20.2`
- git `2.39.0`
- Google Cloud SDK `404.0.0`
- gradle `7.3.1`
- gsutil `5.14`
- homebrew `4.0.6`
- ionic `6.12.4`
- jq `1.6`
- ktlint `0.47.1`
- node `19.2.0`
- npm `8.19.3`
- python `3.8.7`
- python3 `3.8.7`
- ruby `2.7.2p137`
- ssh `8.6p1`
- sudo `1.9.5p2`
- swiftgen `6.6.2`
- tar `3.5.1`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.21.3`
- yarn `1.22.19`
- yq `4.30.5`
- zip `3.0`

## Android emulators

- **emulator**

    - Device: `pixel_3a (Google)`
    - Path: `/Users/builder/.android/avd/emulator.avd`
    - Target: `Google Play (Google Inc.)`
    - Based on: `Android 11.0 (R)`
    - Tag/API: `google_apis_playstore/x86`
    - Skin: `pixel_3a`
    - Sdcard: `512M`

## Java versions

- **19.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-19.jdk/Contents/Home`
- **16.0.2** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-16.jdk/Contents/Home`
- **11.0.17** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`

## Unity 2020.3.31f1

UNITY_HOME: /Applications/Unity/Hub/Editor/2020.3.31f1/Unity.app

## Xcode versions

- 14.2 (14C18) `/Applications/Xcode-14.2.app`, also selected when specifying `latest` or `edge` in Xcode version settings

### Runtimes

- iOS 14.5
- iOS 15.0
- iOS 15.4
- iOS 16.2
- tvOS 14.5
- tvOS 15.0
- tvOS 16.0
- tvOS 16.1
- watchOS 7.4
- watchOS 8.0
- watchOS 9.0
- watchOS 9.1

### Devices

- Apple TV
- Apple TV 4K
- Apple TV 4K (2nd generation)
- Apple TV 4K (3rd generation)
- Apple TV 4K (3rd generation) (at 1080p)
- Apple TV 4K (at 1080p)
- Apple TV 4K (at 1080p) (2nd generation)
- Apple Watch SE (40mm) (2nd generation)
- Apple Watch SE (44mm) (2nd generation)
- Apple Watch Series 5 (40mm)
- Apple Watch Series 5 (44mm)
- Apple Watch Series 5 - 40mm
- Apple Watch Series 5 - 44mm
- Apple Watch Series 6 (40mm)
- Apple Watch Series 6 (44mm)
- Apple Watch Series 6 - 40mm
- Apple Watch Series 6 - 44mm
- Apple Watch Series 7 (41mm)
- Apple Watch Series 7 (45mm)
- Apple Watch Series 7 - 41mm
- Apple Watch Series 7 - 45mm
- Apple Watch Series 8 (41mm)
- Apple Watch Series 8 (45mm)
- Apple Watch Ultra (49mm)
- iPad (10th generation)
- iPad (8th generation)
- iPad (9th generation)
- iPad Air (4th generation)
- iPad Air (5th generation)
- iPad Pro (11-inch) (2nd generation)
- iPad Pro (11-inch) (3rd generation)
- iPad Pro (11-inch) (4th generation)
- iPad Pro (12.9-inch) (4th generation)
- iPad Pro (12.9-inch) (5th generation)
- iPad Pro (12.9-inch) (6th generation)
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
- iPhone 14
- iPhone 14 Plus
- iPhone 14 Pro
- iPhone 14 Pro Max
- iPhone 8
- iPhone 8 Plus
- iPhone SE (2nd generation)
- iPhone SE (3rd generation)
- iPod touch (7th generation)

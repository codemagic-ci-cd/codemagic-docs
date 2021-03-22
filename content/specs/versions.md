---
description: A list of tools available out-of-the-box on Codemagic build machines
title: macOS build machine specification (Xcode 11.x)
aliases:
  - '../releases-and-versions/versions'
weight: 4
---

## Hardware

- Standard VM on Mac mini `2.3GHz Quad Core / 8GB`
- Premium VM on Mac Pro `3.7GHz Quad Core / 32GB`

## System

- System version `macOS 10.15.4 (19E287)`
- Kernel version `Darwin 19.4.0`
- Disk `322GB (Free Space: 57GB)`

## Pre-installed tools

- Android tools `$HOME/programs/android-sdk-macosx`
- aws `1.18.105`
- cocoapods `1.10.1`
- cordova `8.1.2`
- curl
- dart `2.9.2`
- docker `19.03.8`
- fastlane `2.157.3`
- firebase `7.6.2`
- flutter `2.0.3 ($HOME/programs/flutter)`
- gem `3.0.3`
- git `2.28.0`
- gradle `6.1.1`
- homebrew `3.0.4`
- ionic `4.11.0`
- jq
- node `12.14.0`
- npm `6.14.7`
- python `2.7.17`
- python3 `3.8.5`
- ruby `2.6.5p114`
- ssh
- sudo
- tar
- unzip
- wget
- yarn `1.22.5`
- yq
- zip

## Android emulators

- **emulator**

    - Device: `pixel_2 (Google)`
    - Path: `/Users/builder/.android/avd/emulator.avd`
    - Target: `Google APIs (Google Inc.)`
    - Based on: `Android 9.0 (Pie)`
    - Tag/API: `google_apis/x86`
    - Skin: `pixel_2`
    - Sdcard: `512M`
## Java versions

- **14**: version `14.0.2`, JVM `OpenJDK 14.0.2`
- **9**: version `9.0.4`, JVM `OpenJDK 9.0.4`
- **1.8**: version `1.8.0_202`, JVM `Java SE 8`
- **1.7**: version `1.7.0_272`, JVM `Zulu 7.40.0.15`

## Xcode 11.7 (11E801a)

This is the Xcode version used by default when you select `11.7` in build settings in the workflow editor for Flutter apps or set Xcode version to `11.7` in your codemagic.yaml file. Other available versions are listed [here](#other-xcode-versions).

Xcode path: `/Applications/Xcode-11.7.app`

With Xcode `11.7` build version `11E801a` the following runtimes and devices are installed:

### Runtimes

- iOS 11.4
- iOS 12.4
- iOS 13.0
- iOS 13.1
- iOS 13.2
- iOS 13.3
- iOS 13.4
- iOS 13.5
- iOS 13.6
- iOS 13.7
- tvOS 11.3
- tvOS 11.4
- tvOS 12.0
- tvOS 13.0
- tvOS 13.2
- tvOS 13.3
- tvOS 13.4
- watchOS 6.2

### Devices

- iPhone 4s
- iPhone 5
- iPhone 5s
- iPhone 6 Plus
- iPhone 6
- iPhone 6s
- iPhone 6s Plus
- iPhone SE (1st generation)
- iPhone 7
- iPhone 7 Plus
- iPhone 8
- iPhone 8 Plus
- iPhone X
- iPhone Xs
- iPhone Xs Max
- iPhone Xʀ
- iPhone 11
- iPhone 11 Pro
- iPhone 11 Pro Max
- iPhone SE (2nd generation)
- iPad 2
- iPad Retina
- iPad Air
- iPad mini 2
- iPad mini 3
- iPad mini 4
- iPad Air 2
- iPad Pro (9.7-inch)
- iPad Pro (12.9-inch)
- iPad (5th generation)
- iPad Pro (12.9-inch) (2nd generation)
- iPad Pro (10.5-inch)
- iPad (6th generation)
- iPad (7th generation)
- iPad Pro (11-inch) (1st generation)
- iPad Pro (12.9-inch) (3rd generation)
- iPad Pro (11-inch) (2nd generation)
- iPad Pro (12.9-inch) (4th generation)
- iPad mini (5th generation)
- iPad Air (3rd generation)
- Apple TV
- Apple TV 4K
- Apple TV 4K (at 1080p)
- Apple Watch - 38mm
- Apple Watch - 42mm
- Apple Watch Series 2 - 38mm
- Apple Watch Series 2 - 42mm
- Apple Watch Series 3 - 38mm
- Apple Watch Series 3 - 42mm
- Apple Watch Series 4 - 40mm
- Apple Watch Series 4 - 44mm
- Apple Watch Series 5 - 40mm
- Apple Watch Series 5 - 44mm

## Other Xcode versions

- 11.6 (11E708) `/Applications/Xcode-11.6.app`
- 11.5 (11E608c) `/Applications/Xcode-11.5.app`
- 11.4.1 (11E503a) `/Applications/Xcode-11.4.app`
- 11.3.1 (11C505) `/Applications/Xcode-11.3.app`
- 11.2.1 (11B500) `/Applications/Xcode-11.2.1.app`
- 11.1 (11A1027) `/Applications/Xcode-11.1.app`
- 11.0 (11A420a) `/Applications/Xcode-11.app`


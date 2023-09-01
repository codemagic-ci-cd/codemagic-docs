---
description: A list of tools available out-of-the-box on Codemagic macOS Intel-based build machines using Xcode version 12.5.
title: macOS Intel-based build machine specification (Xcode 12.5)
aliases:
  - '/releases-and-versions/versions3'
  - '/specs/versions3'
  - '/specs/versions-macos-xcode-12-5'
weight: 6
---

## Hardware

- Premium VM on Mac Pro `3.7GHz Quad Core / 32GB`

## System

- System version `macOS 11.2 (20D64)`
- Kernel version `Darwin 20.3.0`
- Disk `322GB (Free Space: 68GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `22.1.7171670`
- aws `2.2.14`
- carthage `0.38.0`
- cocoapods `1.11.2`
- cordova `10.0.0`
- curl `7.64.1`
- docker `20.10.2`
- fastlane `2.186.0`
- firebase `9.3.0`
- flutter `2.10.5 ($HOME/programs/flutter)`
- gem `3.1.4`
- gh `1.11.0`
- git `2.32.0`
- Google Cloud SDK `327.0.0`
- gradle `6.7.1`
- gsutil `4.58`
- homebrew `3.2.0`
- ionic `6.12.4`
- jq `1.6`
- node `14.15.5`
- npm `7.18.1`
- python `3.8.7`
- python3 `3.8.7`
- ruby `2.7.2p137`
- ssh `8.1p1`
- sudo `1.8.31`
- tar `3.3.2`
- unzip `6.00`
- wget `1.21.1`
- yarn `1.22.10`
- yq `4.9.6`
- zip `3.0`

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

## Xcode versions

- 12.5.1 (12E507) `/Applications/Xcode-12.5.1.app`
- 12.5 (12E262) `/Applications/Xcode-12.5.app`

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

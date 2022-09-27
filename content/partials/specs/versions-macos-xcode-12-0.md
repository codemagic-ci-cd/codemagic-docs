---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: macOS build machine specification (Xcode 12.0 - 12.4)
aliases:
  - "../releases-and-versions/versions2"
  - "../specs/versions2"
  - /specs/versions-macos-xcode-12-0
weight: 5
---

## Hardware

- Standard VM on Mac mini `2.3GHz Quad Core / 8GB`
- Premium VM on Mac Pro `3.7GHz Quad Core / 32GB`

## System

- System version `macOS 10.15.5 (19F101)`
- Kernel version `Darwin 19.5.0`
- Disk `322GB (Free Space: 28GB)`

## Pre-installed tools

- Android tools `$HOME/programs/android-sdk-macosx`
- Android NDK `22.0.7026061`
- aws `2.0.50`
- cocoapods `1.11.2`
- cordova `10.0.0`
- curl
- docker `20.10.2`
- fastlane `2.172.0`
- firebase `9.3.0`
- flutter `2.10.5 ($HOME/programs/flutter)`
- gem `3.1.4`
- gh `1.8.1`
- git `2.30.0`
- Google Cloud SDK `310.0.0`
- gradle `6.7.1`
- gsutil `4.53`
- homebrew `3.1.0`
- ionic `5.4.16`
- jq
- node `12.18.4`
- npm `7.4.0`
- python `2.7.16`
- python3 `3.8.7`
- ruby `2.7.1p83`
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

  - Device: `pixel_2 (Google)`
  - Path: `/Users/builder/.android/avd/emulator.avd`
  - Target: `Google APIs (Google Inc.)`
  - Based on: `Android 10.0 (Q)`
  - Tag/API: `google_apis/x86`
  - Skin: `pixel_2`
  - Sdcard: `512M`

## Java versions

- **15.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-15.jdk/Contents/Home`
- **11.0.9.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_275** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_285** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Xcode versions

- 12.4 (12D4e) `/Applications/Xcode-12.4.app`
- 12.3 (12C33) `/Applications/Xcode-12.3.app`
- 12.2 (12B45b) `/Applications/Xcode-12.2.app`
- 12.1.1 (12A7605b) `/Applications/Xcode-12.1.1.app`
- 12.0.1 (12A7300) `/Applications/Xcode-12.app`


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
- iOS 14.4
- tvOS 11.3
- tvOS 11.4
- tvOS 12.0
- tvOS 13.0
- tvOS 13.2
- tvOS 13.3
- tvOS 13.4
- tvOS 14.3
- watchOS 6.2
- watchOS 7.0
- watchOS 7.2

### Devices

- Apple TV
- Apple TV 4K
- Apple TV 4K (at 1080p)
- Apple Watch Series 4 - 40mm
- Apple Watch Series 4 - 44mm
- Apple Watch Series 5 - 40mm
- Apple Watch Series 5 - 44mm
- Apple Watch Series 6 - 40mm
- Apple Watch Series 6 - 44mm
- iPad (5th generation)
- iPad (6th generation)
- iPad (7th generation)
- iPad (8th generation)
- iPad Air
- iPad Air (3rd generation)
- iPad Air (4th generation)
- iPad Air 2
- iPad Pro (10.5-inch)
- iPad Pro (11-inch) (1st generation)
- iPad Pro (11-inch) (2nd generation)
- iPad Pro (12.9-inch) (1st generation)
- iPad Pro (12.9-inch) (2nd generation)
- iPad Pro (12.9-inch) (3rd generation)
- iPad Pro (12.9-inch) (4th generation)
- iPad Pro (9.7-inch)
- iPhone 11
- iPhone 11 Pro
- iPhone 11 Pro Max
- iPhone 12
- iPhone 12 Pro
- iPhone 12 Pro Max
- iPhone 12 mini
- iPhone 5s
- iPhone 6
- iPhone 6 Plus
- iPhone 6s
- iPhone 6s Plus
- iPhone 7
- iPhone 7 Plus
- iPhone 8
- iPhone 8 Plus
- iPhone SE (1st generation)
- iPhone SE (2nd generation)
- iPhone X
- iPhone Xs
- iPhone Xs Max
- iPhone Xʀ
- iPod touch (7th generation)

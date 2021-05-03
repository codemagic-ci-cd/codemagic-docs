---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: macOS build machine specification (Xcode 12.5+)
aliases:
  - '../releases-and-versions/versions3'
weight: 2
---

## Hardware

- Standard VM on Mac mini `2.3GHz Quad Core / 8GB`
- Premium VM on Mac Pro `3.7GHz Quad Core / 32GB`

## System

- System version `macOS 11.2 (20D64)`
- Kernel version `Darwin 20.3.0`
- Disk `322GB (Free Space: 90GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- aws `2.1.39`
- cocoapods `1.10.1`
- cordova `10.0.0`
- curl
- docker `20.10.2`
- fastlane `2.181.0`
- firebase `9.3.0`
- flutter `2.0.5 ($HOME/programs/flutter_2_0_5)`
- gem `3.1.4`
- gh `1.9.2`
- git `2.31.1`
- gradle `6.1.1`
- homebrew `3.1.3`
- ionic `6.12.4`
- jq
- node `14.15.5`
- npm `7.10.0`
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

- **16**: version `16`, JVM `Zulu 16.28.11`
- **11**: version `11.0.11`, JVM `Zulu 11.48.21`
- **1.8**: version `1.8.0_292`, JVM `Zulu 8.54.0.21`

## Xcode 12.5 (12E262)

This is the Xcode version used by default when you select `12.5`, `latest` or `edge` in build settings in the workflow 
editor for Flutter apps or set Xcode version to `12.5`, `latest` or `edge` in your codemagic.yaml file. 
Other available versions are listed [here](#other-xcode-versions).

Xcode path: `/Applications/Xcode-12.5.app`

With Xcode `12.5` build version `12E262` the following runtimes and devices are installed:

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
- iPhone 12 mini
- iPhone 12
- iPhone 12 Pro
- iPhone 12 Pro Max
- iPod touch (7th generation)
- iPad 2
- iPad Retina
- iPad Air
- iPad mini 2
- iPad mini 3
- iPad mini 4
- iPad Air 2
- iPad Pro (9.7-inch)
- iPad Pro (12.9-inch) (1st generation)
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
- iPad (8th generation)
- iPad Air (4th generation)
- iPad Pro (11-inch) (3rd generation)
- iPad Pro (12.9-inch) (5th generation)
- Apple TV
- Apple TV 4K
- Apple TV 4K (at 1080p)
- Apple TV 4K (2nd generation)
- Apple TV 4K (at 1080p) (2nd generation)
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
- Apple Watch SE - 40mm
- Apple Watch SE - 44mm
- Apple Watch Series 6 - 40mm
- Apple Watch Series 6 - 44mm

## Other Xcode versions

- 12.4 (12D4e) `/Applications/Xcode-12.4.app`


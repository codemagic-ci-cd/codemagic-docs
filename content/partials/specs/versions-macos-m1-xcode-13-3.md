---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: macOS M1 build machine specification (Xcode 13.3+ / Unity)
aliases:
  - '/specs/versions-macos-m1-xcode-13-3'
weight: 9
---

## Hardware

- Standard VM on Mac mini M1 `3.2GHz Quad Core / 8GB`

## System

- System version `macOS 12.6 (21G115)`
- Kernel version `Darwin 21.6.0`
- Disk `294GB (Free Space: 48GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `25.1.8937393`
- aws `2.7.31`
- carthage `0.38.0`
- cocoapods `1.11.3`
- cordova `11.0.0`
- curl `7.79.1`
- docker `N/A`
- ew-cli `0.0.48`
- fastlane `2.210.1`
- firebase `11.4.2`
- flutter `3.3.3 ($HOME/programs/flutter)`
- gem `3.3.22`
- gh `2.16.1`
- git `2.37.3`
- Google Cloud SDK `404.0.0`
- gradle `7.3.1`
- gsutil `5.14`
- homebrew `3.6.3`
- ionic `5.4.16`
- jq `1.6`
- ktlint `0.47.1`
- node `18.10.0`
- npm `8.19.2`
- python `3.8.13`
- python3 `3.8.13`
- ruby `3.0.4p208`
- ssh `8.6p1`
- sudo `1.9.5p2`
- swiftgen `6.6.2`
- tar `3.5.1`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.21.3`
- yarn `1.22.19`
- yq `4.27.5`
- zip `3.0`

## Android emulators

Android emulators are not available on M1 machines. Please use a Mac Pro or a Linux instance.

## Java versions

- **19** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-19.jdk/Contents/Home`
- **11.0.16.1** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_345** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Unity 2021.3.7f1

UNITY_HOME: /Applications/Unity/Hub/Editor/2021.3.7f1/Unity.app

## Xcode versions

- 14.1 (14B5033e) `/Applications/Xcode-14.1.app`, also selected when specifying `edge` in Xcode version settings
- 14.0.1 (14A400) `/Applications/Xcode-14.0.app`, also selected when specifying `latest` or `14` in Xcode version settings
- 13.4.1 (13F100) `/Applications/Xcode-13.4.app`, also selected when specifying `13.4` in Xcode version settings
- 13.3.1 (13E500a) `/Applications/Xcode-13.3.app`, also selected when specifying `13.3` in Xcode version settings

### Runtimes

- iOS 14.5
- iOS 15.0
- iOS 15.4
- iOS 16.0
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
- Apple TV 4K (2nd generation)
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
- iPad (8th generation)
- iPad (9th generation)
- iPad Air (4th generation)
- iPad Air (5th generation)
- iPad Pro (11-inch) (3rd generation)
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
- iPhone 14
- iPhone 14 Plus
- iPhone 14 Pro
- iPhone 14 Pro Max
- iPhone 8
- iPhone 8 Plus
- iPhone SE (2nd generation)
- iPhone SE (3rd generation)
- iPod touch (7th generation)

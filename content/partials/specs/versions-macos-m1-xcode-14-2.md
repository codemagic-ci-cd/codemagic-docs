---
description: A list of tools available out-of-the-box on Codemagic macOS M1 build machines using Xcode version 14.2+.
title: macOS M1 build machine specification (Xcode 14.2+ / Unity)
aliases:

weight: 11
---

## Hardware

- Standard VM on Mac mini M1 `3.2GHz Quad Core / 8GB`

## System

- System version `macOS 13.3.1 (22E261)`
- Kernel version `Darwin 22.4.0`
- Disk `294GB (Free Space: 96GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `25.1.8937393`
- aws `2.11.6`
- carthage `0.39.0`
- cocoapods `1.12.1`
- cordova `11.0.0`
- curl `7.87.0`
- docker `N/A`
- ew-cli `0.9.13`
- fastlane `2.212.2`
- firebase `11.21.0`
- flutter `3.10.1 ($HOME/programs/flutter)`
- gem `3.4.8`
- gh `2.23.0`
- git `2.39.2`
- Google Cloud SDK `404.0.0`
- gradle `8.1.1`
- gsutil `5.14`
- homebrew `4.0.9`
- ionic `5.4.16`
- jq `1.6`
- ktlint `0.48.2`
- node `19.7.0`
- npm `9.5.0`
- python `3.8.13`
- python3 `3.8.13`
- ruby `3.0.4p208`
- ssh `9.0p1`
- sudo `1.9.5p2`
- swiftgen `6.6.2`
- tar `3.5.3`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.21.3`
- yarn `1.22.19`
- yq `4.31.1`
- zip `3.0`

## Android emulators

Android emulators are not available on M1 machines. Please use a Mac Pro or a Linux instance.

## Java versions

- **19.0.2** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-19.jdk/Contents/Home`
- **17.0.6** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
- **11.0.18** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_362** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Xcode versions

- 14.3.1 (14E300b) `/Applications/Xcode-14.3.app`, also selected when specifying `14.3`, `latest` or `edge` in Xcode version settings
- 14.2 (14C18) `/Applications/Xcode-14.2.app`

### Runtimes

- iOS 14.5
- iOS 15.0
- iOS 15.4
- iOS 16.4
- tvOS 14.5
- tvOS 15.0
- tvOS 16.0
- tvOS 16.1
- tvOS 16.4
- watchOS 7.4
- watchOS 8.0
- watchOS 9.1
- watchOS 9.4

### Devices

- Apple TV
- Apple TV 4K (2nd generation)
- Apple TV 4K (3rd generation)
- Apple TV 4K (3rd generation) (at 1080p)
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
- iPad Pro (11-inch) (3rd generation)
- iPad Pro (11-inch) (4th generation)
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

---
description: A list of tools available out-of-the-box on Codemagic macOS Apple silicon build machines using Xcode version 15.1.
title: macOS Apple silicon build machine specification (Xcode 15.1+)
aliases:

weight: 13
---

## Hardware

- Mac mini M2 `3.5GHz 8-Core / 16GB`

Available on request:
- Mac mini M2 Pro
- Mac Studio M2 Max
- Mac Studio M2 Ultra

## System

- System version `macOS 14.2 (23C64)`
- Kernel version `Darwin 23.2.0`
- Disk `294GB (Free Space: 141GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `25.1.8937393`
- aws `2.13.35`
- carthage `0.39.1`
- cocoapods `1.14.2`
- cordova `11.0.0`
- curl `8.4.0`
- docker `N/A`
- ew-cli `0.10.6`
- fastlane `2.217.0`
- firebase `11.21.0`
- flutter `3.16.3 ($HOME/programs/flutter)`
- gem `3.4.22`
- gh `2.39.1`
- git `2.42.1`
- Google Cloud SDK `404.0.0`
- gradle `8.1.1`
- gsutil `5.14`
- homebrew `4.1.20`
- ionic `5.4.16`
- jq `1.7`
- ktlint `1.0.1`
- node `19.7.0`
- npm `9.5.0`
- python `3.8.13`
- python3 `3.8.13`
- ruby `3.0.4p208`
- ssh `9.4p1`
- sudo `1.9.13p2`
- swiftgen `6.6.2`
- tar `3.5.3`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.21.4`
- yarn `1.22.21`
- yq `4.35.2`
- zip `3.0`

## Android emulators

Android emulators are unavailable on Apple silicon machines due to the Apple Virtualization Framework not supporting nested virtualization. Please use a Linux instance.

## Java versions

- **21.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home`
- **17.0.9** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
- **11.0.21** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_392** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Xcode versions

- 15.1 (15C65) `/Applications/Xcode-15.1.app`

### Runtimes


- iOS 15.4
- iOS 16.4
- iOS 17.0
- iOS 17.2
- tvOS 15.4
- tvOS 16.4
- tvOS 17.0
- tvOS 17.2
- watchOS 8.5
- watchOS 9.4
- watchOS 10.0
- watchOS 10.2

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
- Apple Watch Series 9 (41mm)
- Apple Watch Series 9 (45mm)
- Apple Watch Ultra (49mm)
- Apple Watch Ultra 2 (49mm)
- iPad (10th generation)
- iPad (9th generation)
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
- iPhone 15
- iPhone 15 Plus
- iPhone 15 Pro
- iPhone 15 Pro Max
- iPhone 8
- iPhone 8 Plus
- iPhone SE (3rd generation)
- iPod touch (7th generation)

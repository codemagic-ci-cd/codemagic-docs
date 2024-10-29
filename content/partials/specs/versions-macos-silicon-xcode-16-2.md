---
description: A list of tools available out-of-the-box on Codemagic macOS Apple silicon build machines using Xcode version 16.2.
title: macOS Apple silicon build machine specification (Xcode 16.2+)
aliases:

weight: 19
---

## Hardware

- Mac mini M2 `3.5GHz 8-Core / 16GB`

Available on request:
- Mac mini M2 Pro
- Mac Studio M2 Max
- Mac Studio M2 Ultra

## System

- System version `macOS 15.1 (24B83)`
- Kernel version `Darwin 24.1.0`
- Disk `294GB (Free Space: 146GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `25.1.8937393`
- appium `2.5.0`
- aws `2.18.15`
- carthage `0.40.0`
- cocoapods `1.15.2`
- cordova `12.0.0`
- curl `8.7.1`
- docker `N/A`
- ew-cli `0.11.1`
- fastlane `2.225.0`
- firebase `11.21.0`
- flutter `3.24.4 ($HOME/programs/flutter)`
- gem `3.5.22`
- gh `2.60.1`
- git `2.47.0`
- Google Cloud SDK `404.0.0`
- gradle `8.1.1`
- gsutil `5.14`
- homebrew `4.4.3`
- ionic `7.2.0`
- jq `1.7.1`
- ktlint `1.4.0`
- node `22.9.0`
- npm `10.8.3`
- python `3.8.13`
- python3 `3.8.13`
- ruby `3.0.4p208`
- ssh `9.8p1`
- sudo `1.9.13p2`
- swiftgen `6.6.3`
- tar `3.5.3`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.24.5`
- yarn `1.22.22`
- yq `4.44.3`
- zip `3.0`

## Android emulators

Android emulators are unavailable on Apple silicon machines due to the Apple Virtualization Framework not supporting nested virtualization. Please use a Linux instance.

## Java versions

- **23.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-23.jdk/Contents/Home`
- **21.0.5** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home`
- **17.0.13** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
- **11.0.25** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_432** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Xcode versions

- 16.2 (16B5100e) `/Applications/Xcode-16.2.app`, also selected when specifying `edge` in Xcode version settings

### Runtimes

- iOS 18.2
- tvOS 18.1
- visionOS 2.1
- watchOS 11.1

### Devices

- Apple TV
- Apple TV 4K (3rd generation)
- Apple TV 4K (3rd generation) (at 1080p)
- Apple Vision Pro
- Apple Watch SE (40mm) (2nd generation)
- Apple Watch SE (44mm) (2nd generation)
- Apple Watch Series 10 (42mm)
- Apple Watch Series 10 (46mm)
- Apple Watch Ultra 2 (49mm)
- iPad (10th generation)
- iPad Air 11-inch (M2)
- iPad Air 13-inch (M2)
- iPad Pro 11-inch (M4)
- iPad Pro 13-inch (M4)
- iPad mini (A17 Pro)
- iPhone 16
- iPhone 16 Plus
- iPhone 16 Pro
- iPhone 16 Pro Max
- iPhone SE (3rd generation)
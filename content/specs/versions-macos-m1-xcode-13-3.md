---
description: A list of tools available out-of-the-box on Codemagic build machines.
title: macOS M1 build machine specification (Xcode 13.3+ / Unity)
aliases:

weight: 9
---

## Hardware

- Standard VM on Mac mini M1 `3.2GHz Quad Core / 8GB`

## System

- System version `macOS 12.4 (21F79)`
- Kernel version `Darwin 21.5.0`
- Disk `316GB (Free Space: 131GB)`

## Pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `24.0.8215888`
- aws `2.7.10`
- cocoapods `1.11.3`
- cordova `11.0.0`
- curl `7.79.1`
- docker `N/A`
- ew-cli `0.0.47`
- fastlane `2.206.2`
- firebase `11.1.0`
- flutter `3.0.3 ($HOME/programs/flutter)`
- gem `3.3.16`
- gh `2.13.0`
- git `2.36.1`
- Google Cloud SDK `391.0.0`
- gradle `7.3.1`
- gsutil `5.10`
- homebrew `3.5.2`
- ionic `5.4.16`
- jq `1.6`
- ktlint `0.46.1`
- node `18.4.0`
- npm `8.12.1`
- python `3.8.13`
- python3 `3.8.13`
- ruby `3.0.4p208`
- ssh `8.6p1`
- sudo `1.9.5p2`
- tar `3.5.1`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.21.3`
- yarn `1.22.19`
- yq `4.25.3`
- zip `3.0`

## Android emulators

Android emulators are not available on M1 machines. Please use a Mac Pro or a Linux instance.

## Java versions

- **18.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-18.jdk/Contents/Home`
- **11.0.15** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_332** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_342** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Unity 2021.3.5f1

UNITY_HOME: /Applications/Unity/Hub/Editor/2021.3.5f1/Unity.app

## Xcode 13.4.1 (13F100)

This is the Xcode version used by default when you select `13.4`, `13.4.1` or `latest` in build settings in the workflow 
editor for Flutter apps or set Xcode version to `13.4`, `13.4.1` or `latest` in your codemagic.yaml file.
Other available versions are listed [here](#other-xcode-versions).

Xcode path: `/Applications/Xcode-13.4.app`

With Xcode `13.4.1` build version `13F100` the following runtimes and devices are installed:

### Runtimes

- iOS 15.5
- tvOS 15.4
- tvOS 16.0
- watchOS 8.5
- watchOS 9.0

### Devices

- Apple TV
- Apple TV 4K (2nd generation)
- Apple TV 4K (at 1080p) (2nd generation)
- Apple Watch Series 5 - 40mm
- Apple Watch Series 5 - 44mm
- Apple Watch Series 6 - 40mm
- Apple Watch Series 6 - 44mm
- Apple Watch Series 7 - 41mm
- Apple Watch Series 7 - 45mm
- iPad (9th generation)
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
- iPhone 8
- iPhone 8 Plus
- iPhone SE (3rd generation)
- iPod touch (7th generation)

## Other Xcode versions

- 14.0 (14A5229c) `/Applications/Xcode-14.app`
- 13.3.1 (13E500a) `/Applications/Xcode-13.3.app`

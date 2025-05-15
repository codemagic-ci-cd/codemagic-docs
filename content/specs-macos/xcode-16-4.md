---
title: Xcode 16.4.x
aliases:
- /specs/versions-macos/
weight: 96
---

Codemagic offers multiple build machines with different specifications and pre-installed tools. You can choose between them by specifying the required Xcode version.

## Hardware

- Mac mini M2 `3.5GHz 8-Core / 8GB`

{{<notebox>}}
Available on request:
- Mac mini M4 and M4 Pro
- Mac Studio M2 Max and M2 Ultra
{{</notebox>}}

## System

- System version `macOS 15.4.1 (24E263)`
- Kernel version `Darwin 24.4.0`
- Disk `294GB (Free Space: 139GB)`

## Xcode versions

- 16.4 (16F1t) `/Applications/Xcode-16.4.app`, also selected when specifying `edge` in Xcode version settings

### Runtimes

- iOS 18.5
- tvOS 18.5
- visionOS 2.5
- watchOS 11.5

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
- iPad (A16)
- iPad Air 11-inch (M3)
- iPad Air 13-inch (M3)
- iPad Pro 11-inch (M4)
- iPad Pro 13-inch (M4)
- iPad mini (A17 Pro)
- iPhone 16
- iPhone 16 Plus
- iPhone 16 Pro
- iPhone 16 Pro Max
- iPhone 16e

## Android emulators

Android emulators are unavailable on Apple silicon machines due to the Apple Virtualization Framework not supporting nested virtualization. Please use a Linux instance.

## Java versions

- **24.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-24.jdk/Contents/Home`
- **21.0.7** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home`
- **17.0.15** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
- **11.0.27** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_452** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Other pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `25.1.8937393`
- appium `2.5.0`
- aws `2.27.4`
- carthage `0.40.0`
- cocoapods `1.16.2`
- cordova `12.0.0`
- curl `8.7.1`
- ew-cli `0.12.2`
- fastlane `2.227.0`
- firebase `11.21.0`
- gem `3.6.6`
- gh `2.71.2`
- git `2.49.0`
- Google Cloud SDK `502.0.0`
- gradle `8.1.1/lib/native-platform-0.22-milestone-24.jar)`
- gsutil `5.31`
- homebrew `4.5.0`
- ionic `7.2.0`
- jq `1.7.1`
- ktlint `1.5.0`
- node `22.9.0`
- npm `10.8.3`
- python `3.12.7`
- python3 `3.12.7`
- ruby `3.3.6`
- ssh `9.9p1`
- sudo `1.9.13p2`
- swiftgen `6.6.3`
- tar `3.5.3`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.25.0`
- yarn `1.22.22`
- yq `4.45.1`
- zip `3.0`

---
title: Xcode 16.0.x
aliases:
- /specs/versions-macos/
weight: 100
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

- System version `macOS 14.7 (23H124)`
- Kernel version `Darwin 23.6.0`
- Disk `294GB (Free Space: 141GB)`

## Xcode versions

- 16.0 (16A242d) `/Applications/Xcode-16.0.app`, also selected when specifying `16` in Xcode version settings

### Runtimes

- iOS 18.0
- tvOS 18.0
- visionOS 2.0
- watchOS 11.0

### Devices

- Apple TV
- Apple TV 4K (3rd generation)
- Apple TV 4K (3rd generation) (at 1080p)
- Apple Vision Pro
- Apple Watch SE (40mm) (2nd generation)
- Apple Watch SE (44mm) (2nd generation)
- Apple Watch Series 10 (42mm)
- Apple Watch Series 10 (46mm)
- Apple Watch Series 9 (41mm)
- Apple Watch Series 9 (45mm)
- Apple Watch Ultra 2 (49mm)
- iPad (10th generation)
- iPad Air 11-inch (M2)
- iPad Air 13-inch (M2)
- iPad Pro 11-inch (M4)
- iPad Pro 13-inch (M4)
- iPad mini (6th generation)
- iPhone 15
- iPhone 15 Plus
- iPhone 15 Pro
- iPhone 15 Pro Max
- iPhone 16
- iPhone 16 Plus
- iPhone 16 Pro
- iPhone 16 Pro Max
- iPhone SE (3rd generation)

## Android emulators

Android emulators are unavailable on Apple silicon machines due to the Apple Virtualization Framework not supporting nested virtualization. Please use a Linux instance.

## Java versions

- **22.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-22.jdk/Contents/Home`
- **21.0.3** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home`
- **17.0.11** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
- **11.0.23** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_412** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Other pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `25.1.8937393`
- appium `2.5.0`
- aws `2.15.38`
- carthage `0.39.1`
- cocoapods `1.16.1`
- cordova `12.0.0`
- curl `8.7.1`
- ew-cli `0.11.1`
- fastlane `2.225.0`
- firebase `11.21.0`
- gem `3.5.22`
- gh `2.48.0`
- git `2.44.0`
- Google Cloud SDK `404.0.0`
- gradle `8.1.1`
- gsutil `5.14`
- homebrew `4.2.18`
- ionic `7.2.0`
- jq `1.7.1`
- ktlint `1.2.1`
- node `20.12.2`
- npm `10.5.0`
- python `3.8.13`
- python3 `3.8.13`
- ruby `3.0.4p208`
- ssh `9.7p1`
- sudo `1.9.13p2`
- swiftgen `6.6.3`
- tar `3.5.3`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.24.5`
- yarn `1.22.22`
- yq `4.43.1`
- zip `3.0`

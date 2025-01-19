---
title: Xcode 16.2.x (default)
aliases:

weight: 98
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

- System version `macOS 15.2 (24C101)`
- Kernel version `Darwin 24.2.0`
- Disk `294GB (Free Space: 151GB)`

## Xcode versions

- 16.2 (16C5032a) `/Applications/Xcode-16.2.app`, also selected when specifying `latest` or `edge` in Xcode version settings

### Runtimes

- iOS 18.2
- tvOS 18.2
- visionOS 2.2
- watchOS 11.2

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

## Android emulators

Android emulators are unavailable on Apple silicon machines due to the Apple Virtualization Framework not supporting nested virtualization. Please use a Linux instance.

## Java versions

- **23.0.1** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-23.jdk/Contents/Home`
- **21.0.5** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home`
- **17.0.13** (default) JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`
- **11.0.25** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home`
- **1.8.0_432** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home`
- **1.7.0_352** JAVA_HOME: `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home`

## Other pre-installed tools

- Android tools `/usr/local/share/android-sdk`
- Android NDK `25.1.8937393`
- appium `2.5.0`
- aws `2.22.15`
- carthage `0.40.0`
- cocoapods `1.16.2`
- cordova `12.0.0`
- curl `8.7.1`
- ew-cli `0.11.1`
- fastlane `2.225.0`
- firebase `11.21.0`
- gem `3.5.23`
- gh `2.60.1`
- git `2.47.0`
- Google Cloud SDK `502.0.0`
- gradle `8.1.1`
- gsutil `5.31`
- homebrew `4.4.11`
- ionic `7.2.0`
- jq `1.7.1`
- ktlint `1.5.0`
- node `22.9.0`
- npm `10.8.3`
- python `3.12.7`
- python3 `3.12.7`
- ruby `3.3.6`
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

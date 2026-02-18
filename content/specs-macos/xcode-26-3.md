---
title: Xcode 26.3.x
aliases:

weight: 92
---

Codemagic offers multiple build machines with different specifications and pre-installed tools. You can choose between them by specifying the required Xcode version.

## Hardware

- Mac mini M2 `8-Core CPU / 8GB`
- Mac mini M4 `10-Core CPU / 16GB`

{{<notebox>}}
Mac Studio M4 Max available on request.
{{</notebox>}}

## System

- System version `macOS 26.3 (25D125)`
- Kernel version `Darwin 25.3.0`
- Disk `294GB (Free Space: 142GB)`

## Xcode versions

- 26.3 (17C519) `/Applications/Xcode-26.3.app`

### Runtimes and Devices


{{< collapsible title="iOS 26.1" >}}
- iPad (A16)
- iPad Air 11-inch (M3)
- iPad Air 13-inch (M3)
- iPad Pro 11-inch (M4)
- iPad Pro 11-inch (M5)
- iPad Pro 13-inch (M4)
- iPad Pro 13-inch (M5)
- iPad mini (A17 Pro)
- iPhone 16e
- iPhone 17
- iPhone 17 Pro
- iPhone 17 Pro Max
- iPhone Air
{{< /collapsible >}}

{{< collapsible title="iOS 26.2" >}}
- iPad (A16)
- iPad Air 11-inch (M3)
- iPad Air 13-inch (M3)
- iPad Pro 11-inch (M5)
- iPad Pro 13-inch (M5)
- iPad mini (A17 Pro)
- iPhone 16e
- iPhone 17
- iPhone 17 Pro
- iPhone 17 Pro Max
- iPhone Air
{{< /collapsible >}}

{{< collapsible title="tvOS 26.2" >}}
- Apple TV
- Apple TV 4K (3rd generation)
- Apple TV 4K (3rd generation) (at 1080p)
{{< /collapsible >}}

{{< collapsible title="visionOS 26.2" >}}
- Apple Vision Pro
{{< /collapsible >}}

{{< collapsible title="watchOS 26.2" >}}
- Apple Watch SE 3 (40mm)
- Apple Watch SE 3 (44mm)
- Apple Watch Series 11 (42mm)
- Apple Watch Series 11 (46mm)
- Apple Watch Ultra 3 (49mm)
{{< /collapsible >}}


## Android Studio

> Android Studio `2025.3` installed at `~/programs/android-studio`


## Android SDK

> SDK Manager at `/usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager`

{{< collapsible title="Installed SDK packages" >}}
```
$ /usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager --list_installed
```


{{< /collapsible >}}


## Android NDK

| **Version** | **Path** |
|---------|------|
| 28.2.13676358 | `/usr/local/share/android-sdk/ndk/28.2.13676358` |
| 27.3.13750724 | `/usr/local/share/android-sdk/ndk/27.3.13750724` |
| 25.1.8937393 | `/usr/local/share/android-sdk/ndk/25.1.8937393` |
| 29.0.14206865 | `/usr/local/share/android-sdk/ndk/29.0.14206865` |


## Android emulators

Android emulators are unavailable on Apple silicon machines due to the Apple Virtualization Framework not supporting nested virtualization. Please use a Linux instance.

## Java versions

| **Version** | **Path** |
|-------------|----------|
| 25.0.2 | `/Library/Java/JavaVirtualMachines/zulu-25.jdk/Contents/Home` |
| 21.0.10 | `/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home` |
| **17.0.18** (default) | `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home` |
| 11.0.30 | `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home` |
| 1.8.0_482 | `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home` |
| 1.7.0_352 | `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home` |


## Gradle versions

| **Version** | **Path** |
|---------|------|
| 8.14.1 | `/Users/builder/programs/gradle-8.14.1` |


## Other pre-installed tools

- appium `2.19.0`
- aws `2.33.23`
- azure-cli `2.83.0`
- carthage `0.40.0`
- cocoapods `1.16.2`
- cordova `12.0.0`
- curl `8.7.1`
- ew-cli `1.1.0`
- fastlane `2.232.1`
- firebase `15.6.0`
- gem `4.0.6`
- gh `2.86.0`
- git `2.53.0`
- Google Cloud SDK `502.0.0`
- gsutil `5.31`
- homebrew `5.0.14`
- ionic `7.2.1`
- jq `1.8.1`
- ktlint `1.8.0`
- node `24.13.1`
- npm `11.8.0`
- python `3.12.7`
- python3 `3.12.7`
- ruby `3.4.8`
- ssh `10.2p1`
- sudo `1.9.17p2`
- swiftgen `6.6.3`
- tar `3.5.3`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.25.0`
- yarn `4.9.2`
- yq `4.52.4`
- zip `3.0`

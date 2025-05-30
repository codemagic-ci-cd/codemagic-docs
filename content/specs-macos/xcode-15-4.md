---
title: Xcode 15.4.x
aliases:

weight: 106
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

- System version `macOS 14.4.1 (23E224)`
- Kernel version `Darwin 23.4.0`
- Disk `294GB (Free Space: 82GB)`

## Xcode versions

- 15.4 (15F31d) `/Applications/Xcode-15.4.app`

### Runtimes

- iOS 17.0
- iOS 17.2
- iOS 17.4
- iOS 17.5
- tvOS 17.0
- tvOS 17.2
- tvOS 17.4
- tvOS 17.5
- visionOS 1.0
- visionOS 1.1
- visionOS 1.2
- watchOS 10.0
- watchOS 10.2
- watchOS 10.4
- watchOS 10.5

### Devices

- Apple TV
- Apple TV 4K (3rd generation)
- Apple TV 4K (3rd generation) (at 1080p)
- Apple Vision Pro
- Apple Watch SE (40mm) (2nd generation)
- Apple Watch SE (44mm) (2nd generation)
- Apple Watch Series 5 (40mm)
- Apple Watch Series 5 (44mm)
- Apple Watch Series 6 (40mm)
- Apple Watch Series 6 (44mm)
- Apple Watch Series 7 (41mm)
- Apple Watch Series 7 (45mm)
- Apple Watch Series 8 (41mm)
- Apple Watch Series 8 (45mm)
- Apple Watch Series 9 (41mm)
- Apple Watch Series 9 (45mm)
- Apple Watch Ultra (49mm)
- Apple Watch Ultra 2 (49mm)
- iPad (10th generation)
- iPad Air (5th generation)
- iPad Air 11-inch (M2)
- iPad Air 13-inch (M2)
- iPad Pro (11-inch) (4th generation)
- iPad Pro (12.9-inch) (6th generation)
- iPad Pro 11-inch (M4)
- iPad Pro 13-inch (M4)
- iPad mini (6th generation)
- iPhone 14
- iPhone 14 Plus
- iPhone 14 Pro
- iPhone 14 Pro Max
- iPhone 15
- iPhone 15 Plus
- iPhone 15 Pro
- iPhone 15 Pro Max
- iPhone SE (3rd generation)

## Android Studio

> Android Studio `2021.3` installed at `~/programs/android-studio`


## Android SDK

> SDK Manager at `/usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager`

{{< collapsible title="Installed SDK packages" >}}
```
$ /usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager --list_installed
```

Installed packages:
  Path                                     | Version      | Description                                 | Location
  -------                                  | -------      | -------                                     | -------
  add-ons;addon-google_apis-google-19      | 20           | Google APIs                                 | add-ons/addon-google_apis-google-19
  add-ons;addon-google_apis-google-21      | 1            | Google APIs                                 | add-ons/addon-google_apis-google-21
  add-ons;addon-google_apis-google-22      | 1            | Google APIs                                 | add-ons/addon-google_apis-google-22
  add-ons;addon-google_apis-google-23      | 1            | Google APIs                                 | add-ons/addon-google_apis-google-23
  add-ons;addon-google_apis-google-24      | 1            | Google APIs                                 | add-ons/addon-google_apis-google-24
  build-tools;19.1.0                       | 19.1.0       | Android SDK Build-Tools 19.1                | build-tools/19.1.0
  build-tools;20.0.0                       | 20.0.0       | Android SDK Build-Tools 20                  | build-tools/20.0.0
  build-tools;21.1.2                       | 21.1.2       | Android SDK Build-Tools 21.1.2              | build-tools/21.1.2
  build-tools;22.0.1                       | 22.0.1       | Android SDK Build-Tools 22.0.1              | build-tools/22.0.1
  build-tools;23.0.1                       | 23.0.1       | Android SDK Build-Tools 23.0.1              | build-tools/23.0.1
  build-tools;23.0.2                       | 23.0.2       | Android SDK Build-Tools 23.0.2              | build-tools/23.0.2
  build-tools;23.0.3                       | 23.0.3       | Android SDK Build-Tools 23.0.3              | build-tools/23.0.3
  build-tools;24.0.0                       | 24.0.0       | Android SDK Build-Tools 24                  | build-tools/24.0.0
  build-tools;24.0.1                       | 24.0.1       | Android SDK Build-Tools 24.0.1              | build-tools/24.0.1
  build-tools;24.0.2                       | 24.0.2       | Android SDK Build-Tools 24.0.2              | build-tools/24.0.2
  build-tools;24.0.3                       | 24.0.3       | Android SDK Build-Tools 24.0.3              | build-tools/24.0.3
  build-tools;25.0.0                       | 25.0.0       | Android SDK Build-Tools 25                  | build-tools/25.0.0
  build-tools;25.0.1                       | 25.0.1       | Android SDK Build-Tools 25.0.1              | build-tools/25.0.1
  build-tools;25.0.2                       | 25.0.2       | Android SDK Build-Tools 25.0.2              | build-tools/25.0.2
  build-tools;25.0.3                       | 25.0.3       | Android SDK Build-Tools 25.0.3              | build-tools/25.0.3
  build-tools;26.0.0                       | 26.0.0       | Android SDK Build-Tools 26                  | build-tools/26.0.0
  build-tools;26.0.1                       | 26.0.1       | Android SDK Build-Tools 26.0.1              | build-tools/26.0.1
  build-tools;26.0.2                       | 26.0.2       | Android SDK Build-Tools 26.0.2              | build-tools/26.0.2
  build-tools;26.0.3                       | 26.0.3       | Android SDK Build-Tools 26.0.3              | build-tools/26.0.3
  build-tools;27.0.0                       | 27.0.0       | Android SDK Build-Tools 27                  | build-tools/27.0.0
  build-tools;27.0.1                       | 27.0.1       | Android SDK Build-Tools 27.0.1              | build-tools/27.0.1
  build-tools;27.0.2                       | 27.0.2       | Android SDK Build-Tools 27.0.2              | build-tools/27.0.2
  build-tools;27.0.3                       | 27.0.3       | Android SDK Build-Tools 27.0.3              | build-tools/27.0.3
  build-tools;28.0.0                       | 28.0.0       | Android SDK Build-Tools 28                  | build-tools/28.0.0
  build-tools;28.0.1                       | 28.0.1       | Android SDK Build-Tools 28.0.1              | build-tools/28.0.1
  build-tools;28.0.2                       | 28.0.2       | Android SDK Build-Tools 28.0.2              | build-tools/28.0.2
  build-tools;28.0.3                       | 28.0.3       | Android SDK Build-Tools 28.0.3              | build-tools/28.0.3
  build-tools;29.0.0                       | 29.0.0       | Android SDK Build-Tools 29                  | build-tools/29.0.0
  build-tools;29.0.1                       | 29.0.1       | Android SDK Build-Tools 29.0.1              | build-tools/29.0.1
  build-tools;29.0.2                       | 29.0.2       | Android SDK Build-Tools 29.0.2              | build-tools/29.0.2
  build-tools;29.0.3                       | 29.0.3       | Android SDK Build-Tools 29.0.3              | build-tools/29.0.3
  build-tools;30.0.0                       | 30.0.0       | Android SDK Build-Tools 30                  | build-tools/30.0.0
  build-tools;30.0.1                       | 30.0.1       | Android SDK Build-Tools 30.0.1              | build-tools/30.0.1
  build-tools;30.0.2                       | 30.0.2       | Android SDK Build-Tools 30.0.2              | build-tools/30.0.2
  build-tools;30.0.3                       | 30.0.3       | Android SDK Build-Tools 30.0.3              | build-tools/30.0.3
  build-tools;31.0.0                       | 31.0.0       | Android SDK Build-Tools 31                  | build-tools/31.0.0
  build-tools;32.0.0                       | 32.0.0       | Android SDK Build-Tools 32                  | build-tools/32.0.0
  build-tools;32.1.0-rc1                   | 32.1.0 rc1   | Android SDK Build-Tools 32.1-rc1            | build-tools/32.1.0-rc1
  build-tools;33.0.0                       | 33.0.0       | Android SDK Build-Tools 33                  | build-tools/33.0.0
  cmake;3.10.2.4988404                     | 3.10.2       | CMake 3.10.2.4988404                        | cmake/3.10.2.4988404
  cmake;3.18.1                             | 3.18.1       | CMake 3.18.1                                | cmake/3.18.1
  cmake;3.22.1                             | 3.22.1       | CMake 3.22.1                                | cmake/3.22.1
  cmake;3.6.4111459                        | 3.6.4111459  | CMake 3.6.4111459                           | cmake/3.6.4111459
  cmdline-tools;1.0                        | 1.0          | Android SDK Command-line Tools              | cmdline-tools/1.0
  cmdline-tools;2.1                        | 2.1          | Android SDK Command-line Tools              | cmdline-tools/2.1
  cmdline-tools;3.0                        | 3.0          | Android SDK Command-line Tools              | cmdline-tools/3.0
  cmdline-tools;4.0                        | 4.0          | Android SDK Command-line Tools              | cmdline-tools/4.0
  cmdline-tools;5.0                        | 5.0          | Android SDK Command-line Tools              | cmdline-tools/5.0
  cmdline-tools;6.0                        | 6.0          | Android SDK Command-line Tools              | cmdline-tools/6.0
  cmdline-tools;7.0                        | 7.0          | Android SDK Command-line Tools              | cmdline-tools/7.0
  cmdline-tools;latest                     | 8.0          | Android SDK Command-line Tools (latest)     | cmdline-tools/latest
  extras;google;google_play_services       | 49           | Google Play services                        | extras/google/google_play_services
  extras;google;instantapps                | 1.9.0        | Google Play Instant Development SDK         | extras/google/instantapps
  extras;google;market_apk_expansion       | 1            | Google Play APK Expansion library           | extras/google/market_apk_expansion
  extras;google;market_licensing           | 1            | Google Play Licensing Library               | extras/google/market_licensing
  extras;google;webdriver                  | 2            | Google Web Driver                           | extras/google/webdriver
  ndk;25.1.8937393                         | 25.1.8937393 | NDK (Side by side) 25.1.8937393             | ndk/25.1.8937393
  patcher;v4                               | 1            | SDK Patch Applier v4                        | patcher/v4
  platform-tools                           | 33.0.3       | Android SDK Platform-Tools                  | platform-tools
  platforms;android-19                     | 4            | Android SDK Platform 19                     | platforms/android-19
  platforms;android-20                     | 2            | Android SDK Platform 20                     | platforms/android-20
  platforms;android-21                     | 2            | Android SDK Platform 21                     | platforms/android-21
  platforms;android-22                     | 2            | Android SDK Platform 22                     | platforms/android-22
  platforms;android-23                     | 3            | Android SDK Platform 23                     | platforms/android-23
  platforms;android-24                     | 2            | Android SDK Platform 24                     | platforms/android-24
  platforms;android-25                     | 3            | Android SDK Platform 25                     | platforms/android-25
  platforms;android-26                     | 2            | Android SDK Platform 26                     | platforms/android-26
  platforms;android-27                     | 3            | Android SDK Platform 27                     | platforms/android-27
  platforms;android-28                     | 6            | Android SDK Platform 28                     | platforms/android-28
  platforms;android-29                     | 5            | Android SDK Platform 29                     | platforms/android-29
  platforms;android-30                     | 3            | Android SDK Platform 30                     | platforms/android-30
  platforms;android-31                     | 1            | Android SDK Platform 31                     | platforms/android-31
  platforms;android-32                     | 1            | Android SDK Platform 32                     | platforms/android-32
  platforms;android-33                     | 2            | Android SDK Platform 33                     | platforms/android-33
  platforms;android-TiramisuPrivacySandbox | 8            | Android SDK Platform TiramisuPrivacySandbox | platforms/android-TiramisuPrivacySandbox
  sources;android-19                       | 2            | Sources for Android 19                      | sources/android-19
  sources;android-20                       | 1            | Sources for Android 20                      | sources/android-20
  sources;android-21                       | 1            | Sources for Android 21                      | sources/android-21
  sources;android-22                       | 1            | Sources for Android 22                      | sources/android-22
  sources;android-23                       | 1            | Sources for Android 23                      | sources/android-23
  sources;android-24                       | 1            | Sources for Android 24                      | sources/android-24
  sources;android-25                       | 1            | Sources for Android 25                      | sources/android-25
  sources;android-26                       | 1            | Sources for Android 26                      | sources/android-26
  sources;android-27                       | 1            | Sources for Android 27                      | sources/android-27
  sources;android-28                       | 1            | Sources for Android 28                      | sources/android-28
  sources;android-29                       | 1            | Sources for Android 29                      | sources/android-29
  sources;android-30                       | 1            | Sources for Android 30                      | sources/android-30
  sources;android-31                       | 1            | Sources for Android 31                      | sources/android-31
  sources;android-32                       | 1            | Sources for Android 32                      | sources/android-32
{{< /collapsible >}}


## Android NDK

| **Version** | **Path** |
|---------|------|
| 25.1.8937393 | `/usr/local/share/android-sdk/ndk/25.1.8937393` |


## Android emulators

Android emulators are unavailable on Apple silicon machines due to the Apple Virtualization Framework not supporting nested virtualization. Please use a Linux instance.

## Java versions

| **Version** | **Path** |
|-------------|----------|
| 22.0.1 | `/Library/Java/JavaVirtualMachines/zulu-22.jdk/Contents/Home` |
| 21.0.3 | `/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home` |
| **17.0.11** (default) | `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home` |
| 11.0.23 | `/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home` |
| 1.8.0_412 | `/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home` |
| 1.7.0_352 | `/Library/Java/JavaVirtualMachines/zulu-7.jdk/Contents/Home` |


## Gradle versions

| **Version** | **Path** |
|---------|------|
| **8.1.1** (default) | `/Users/builder/programs/gradle-8.1.1` |
| 7.6 | `/Users/builder/programs/gradle-7.6` |
| 7.3.1 | `/Users/builder/programs/gradle-7.3.1` |


## Other pre-installed tools

- appium `2.5.0`
- aws `2.15.38`
- carthage `0.39.1`
- cocoapods `1.16.1`
- cordova `12.0.0`
- curl `8.4.0`
- ew-cli `0.12.3`
- fastlane `2.225.0`
- firebase `11.21.0`
- gem `3.5.22`
- gh `2.48.0`
- git `2.44.0`
- Google Cloud SDK `404.0.0`
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
- ssh `9.6p1`
- sudo `1.9.13p2`
- swiftgen `6.6.3`
- tar `3.5.3`
- ucd `0.11.10`
- unzip `6.00`
- wget `1.24.5`
- yarn `1.22.22`
- yq `4.43.1`
- zip `3.0`

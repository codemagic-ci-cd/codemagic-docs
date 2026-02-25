---
description: A list of tools available out-of-the-box on Codemagic Linux Ubuntu 24.04
title: Ubuntu 24.04
aliases:
- /specs/versions-linux/
weight: 1
---


## Hardware

- Linux X2 virtual machine: `8 vCPUs, 32 GB memory`
- Linux X4 virtual machine: `16 vCPUs, 64 GB memory`


## System

- System version `Ubuntu 24.04.4 LTS`
- Kernel version `6.17.0-1008-gcp`
- Disk `155GB (Free Space: 93GB)`

## Android Studio

> Android Studio `2024.3.1` installed at `~/programs/android-studio`


## Android SDK

> SDK Manager at `/usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager`

{{< collapsible title="Installed SDK packages" >}}
```
$ /usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager --list_installed
```

Installed packages:
  Path                                                  | Version           | Description                                | Location
  -------                                               | -------           | -------                                    | -------
  build-tools;27.0.0                                    | 27.0.0            | Android SDK Build-Tools 27                 | build-tools/27.0.0
  build-tools;28.0.0                                    | 28.0.0            | Android SDK Build-Tools 28                 | build-tools/28.0.0
  build-tools;29.0.0                                    | 29.0.0            | Android SDK Build-Tools 29                 | build-tools/29.0.0
  build-tools;30.0.0                                    | 30.0.0            | Android SDK Build-Tools 30                 | build-tools/30.0.0
  build-tools;31.0.0                                    | 31.0.0            | Android SDK Build-Tools 31                 | build-tools/31.0.0
  build-tools;32.0.0                                    | 32.0.0            | Android SDK Build-Tools 32                 | build-tools/32.0.0
  build-tools;33.0.0                                    | 33.0.0            | Android SDK Build-Tools 33                 | build-tools/33.0.0
  build-tools;34.0.0                                    | 34.0.0            | Android SDK Build-Tools 34                 | build-tools/34.0.0
  build-tools;35.0.0                                    | 35.0.0            | Android SDK Build-Tools 35                 | build-tools/35.0.0
  build-tools;35.0.1                                    | 35.0.1            | Android SDK Build-Tools 35.0.1             | build-tools/35.0.1
  build-tools;36.0.0                                    | 36.0.0            | Android SDK Build-Tools 36                 | build-tools/36.0.0
  cmake;3.10.2.4988404                                  | 3.10.2            | CMake 3.10.2.4988404                       | cmake/3.10.2.4988404
  cmake;3.22.1                                          | 3.22.1            | CMake 3.22.1                               | cmake/3.22.1
  cmake;3.31.5                                          | 3.31.5            | CMake 3.31.5                               | cmake/3.31.5
  cmake;3.31.6                                          | 3.31.6            | CMake 3.31.6                               | cmake/3.31.6
  cmdline-tools;latest                                  | 19.0              | Android SDK Command-line Tools (latest)    | cmdline-tools/latest-2
  emulator                                              | 35.5.8            | Android Emulator                           | emulator
  extras;google;auto                                    | 2.0               | Android Auto Desktop Head Unit Emulator    | extras/google/auto
  extras;google;google_play_services                    | 49                | Google Play services                       | extras/google/google_play_services
  extras;google;instantapps                             | 1.9.0             | Google Play Instant Development SDK        | extras/google/instantapps
  extras;google;market_apk_expansion                    | 1                 | Google Play APK Expansion library          | extras/google/market_apk_expansion
  extras;google;market_licensing                        | 1                 | Google Play Licensing Library              | extras/google/market_licensing
  extras;google;simulators                              | 1                 | Android Auto API Simulators                | extras/google/simulators
  extras;google;webdriver                               | 2                 | Google Web Driver                          | extras/google/webdriver
  ndk;22.0.7026061                                      | 22.0.7026061      | NDK (Side by side) 22.0.7026061            | ndk/22.0.7026061
  ndk;25.2.9519653                                      | 25.2.9519653      | NDK (Side by side) 25.2.9519653            | ndk/25.2.9519653
  ndk;29.0.13113456                                     | 29.0.13113456 rc1 | NDK (Side by side) 29.0.13113456           | ndk/29.0.13113456
  platform-tools                                        | 35.0.2            | Android SDK Platform-Tools                 | platform-tools
  platforms;android-21                                  | 2                 | Android SDK Platform 21                    | platforms/android-21
  platforms;android-23                                  | 3                 | Android SDK Platform 23                    | platforms/android-23
  platforms;android-24                                  | 2                 | Android SDK Platform 24                    | platforms/android-24
  platforms;android-26                                  | 2                 | Android SDK Platform 26                    | platforms/android-26
  platforms;android-28                                  | 6                 | Android SDK Platform 28                    | platforms/android-28
  platforms;android-29                                  | 5                 | Android SDK Platform 29                    | platforms/android-29
  platforms;android-30                                  | 3                 | Android SDK Platform 30                    | platforms/android-30
  platforms;android-32                                  | 1                 | Android SDK Platform 32                    | platforms/android-32
  platforms;android-33                                  | 3                 | Android SDK Platform 33                    | platforms/android-33
  platforms;android-34                                  | 3                 | Android SDK Platform 34                    | platforms/android-34
  platforms;android-35                                  | 2                 | Android SDK Platform 35                    | platforms/android-35
  platforms;android-36                                  | 1                 | Android SDK Platform 36                    | platforms/android-36
  sources;android-21                                    | 1                 | Sources for Android 21                     | sources/android-21
  sources;android-23                                    | 1                 | Sources for Android 23                     | sources/android-23
  sources;android-24                                    | 1                 | Sources for Android 24                     | sources/android-24
  sources;android-26                                    | 1                 | Sources for Android 26                     | sources/android-26
  sources;android-28                                    | 1                 | Sources for Android 28                     | sources/android-28
  sources;android-29                                    | 1                 | Sources for Android 29                     | sources/android-29
  sources;android-30                                    | 1                 | Sources for Android 30                     | sources/android-30
  sources;android-32                                    | 1                 | Sources for Android 32                     | sources/android-32
  sources;android-33                                    | 1                 | Sources for Android 33                     | sources/android-33
  sources;android-34                                    | 2                 | Sources for Android 34                     | sources/android-34
  sources;android-35                                    | 1                 | Sources for Android 35                     | sources/android-35
  sources;android-36                                    | 1                 | Sources for Android 36                     | sources/android-36
  system-images;android-34;google_apis_playstore;x86_64 | 14                | Google Play Intel x86_64 Atom System Image | system-images/android-34/google_apis_playstore/x86_64
  system-images;android-35;google_apis_playstore;x86_64 | 9                 | Google Play Intel x86_64 Atom System Image | system-images/android-35/google_apis_playstore/x86_64
  system-images;android-36;google_apis;x86_64           | 5                 | Google APIs Intel x86_64 Atom System Image | system-images/android-36/google_apis/x86_64
  system-images;android-36;google_apis_playstore;x86_64 | 5                 | Google Play Intel x86_64 Atom System Image | system-images/android-36/google_apis_playstore/x86_64
{{< /collapsible >}}



## Android NDK

| **Version** | **Path** |
|---------|------|
| 22.0.7026061 | `/usr/local/share/android-sdk/ndk/22.0.7026061` |
| 29.0.13113456 | `/usr/local/share/android-sdk/ndk/29.0.13113456` |
| 25.2.9519653 | `/usr/local/share/android-sdk/ndk/25.2.9519653` |



## Android emulators

> AVD Manager at `/usr/local/share/android-sdk/cmdline-tools/latest/bin/avdmanager`

**Available emulators**

| **Name** | **Device** | **Based On** |
|------|--------|----------|
| emulator | pixel_4 (Google) | Android 14.0 ("UpsideDownCake") Tag/ABI: google_apis_playstore/x86_64 |
| emulator-35 | pixel_4 (Google) | Android API 35 Tag/ABI: google_apis_playstore/x86_64 |
| emulator-36 | pixel_6a (Google) | Android API 36 Tag/ABI: google_apis_playstore/x86_64 |


{{< collapsible title="Full details" >}}
```
$ /usr/local/share/android-sdk/cmdline-tools/latest/bin/avdmanager list avd

Available Android Virtual Devices:
    Name: emulator
  Device: pixel_4 (Google)
    Path: /home/builder/.config/.android/avd/emulator.avd
  Target: Google Play (Google Inc.)
          Based on: Android 14.0 ("UpsideDownCake") Tag/ABI: google_apis_playstore/x86_64
    Skin: pixel_4
  Sdcard: 512M
---------
    Name: emulator-35
  Device: pixel_4 (Google)
    Path: /home/builder/.config/.android/avd/emulator-35.avd
  Target: Google Play (Google Inc.)
          Based on: Android API 35 Tag/ABI: google_apis_playstore/x86_64
    Skin: pixel_4
  Sdcard: 512M
---------
    Name: emulator-36
  Device: pixel_6a (Google)
    Path: /home/builder/.config/.android/avd/emulator-36.avd
  Target: Google Play (Google Inc.)
          Based on: Android API 36 Tag/ABI: google_apis_playstore/x86_64
    Skin: pixel_6a
  Sdcard: 512M
```    
{{< /collapsible >}}


## Java versions

| **Version** | **Path** |
|-------------|----------|
| 11 | `/usr/lib/jvm/java-1.11.0-openjdk-amd64` |
| **17** (default) | `/usr/lib/jvm/java-1.17.0-openjdk-amd64` |
| 21 | `/usr/lib/jvm/java-1.21.0-openjdk-amd64` |
| 8 | `/usr/lib/jvm/java-1.8.0-openjdk-amd64` |



## Gradle versions

| **Version** | **Path** |
|---------|------|
| 8.13 | `/home/builder/programs/gradle-8.13` |
| 8.11.1 | `/home/builder/programs/gradle-8.11.1` |
| 8.1.1 | `/home/builder/programs/gradle-8.1.1` |
| 7.6 | `/home/builder/programs/gradle-7.6` |
| 7.3.1 | `/home/builder/programs/gradle-7.3.1` |



## Other pre-installed tools

- aws `2.33.29`
- azure-cli `2.83.0`
- curl `8.5.0`
- docker `29.2.1`
- ew-cli `1.2.0`
- fastlane `2.227.0`
- firebase `13.34.0`
- gem `3.6.2`
- gh `2.45.0`
- git `2.43.0`
- Google Cloud SDK `558.0.0`
- gsutil `5.35`
- ionic `7.2.0`
- jq `1.7`
- ktlint `1.5.0`
- node `22.14.0`
- npm `11.2.0`
- OpenSSH  `9.6p1`
- python `3.12.5`
- ruby `3.4.2`
- snapcraft  `8.14.1`
- sudo `1.9.15p5`
- tar `1.35`
- unzip `6.00`
- wget `1.21.4`
- yarn `4.12.0`
- yq `4.49.2`
- zip `3.0`

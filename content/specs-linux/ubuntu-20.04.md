---
description: A list of tools available out-of-the-box on Codemagic Linux Ubuntu 20.04
title: Ubuntu 20.04 (default)
aliases:
- /specs/versions-linux/
weight: 2
---


## Hardware

- Linux virtual machine: `8 vCPUs, 32 GB memory`


## System

- System version `Ubuntu 20.04.6 LTS`
- Kernel version `5.15.0-1060-gcp`
- Disk `156GB (Free Space: 86GB)`

## Android Studio

> Android Studio `2022.3` installed at `~/programs/android-studio`


## Android SDK

> SDK Manager at `/usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager`

{{< collapsible title="Installed SDK packages" >}}
```
$ /usr/local/share/android-sdk/cmdline-tools/latest/bin/sdkmanager --list_installed
```

Installed packages:
  Path                                                  | Version      | Description                                | Location
  -------                                               | -------      | -------                                    | -------
  build-tools;27.0.0                                    | 27.0.0       | Android SDK Build-Tools 27                 | build-tools/27.0.0/
  build-tools;27.0.1                                    | 27.0.1       | Android SDK Build-Tools 27.0.1             | build-tools/27.0.1/
  build-tools;27.0.2                                    | 27.0.2       | Android SDK Build-Tools 27.0.2             | build-tools/27.0.2/
  build-tools;27.0.3                                    | 27.0.3       | Android SDK Build-Tools 27.0.3             | build-tools/27.0.3/
  build-tools;28.0.0                                    | 28.0.0       | Android SDK Build-Tools 28                 | build-tools/28.0.0/
  build-tools;28.0.1                                    | 28.0.1       | Android SDK Build-Tools 28.0.1             | build-tools/28.0.1/
  build-tools;28.0.2                                    | 28.0.2       | Android SDK Build-Tools 28.0.2             | build-tools/28.0.2/
  build-tools;28.0.3                                    | 28.0.3       | Android SDK Build-Tools 28.0.3             | build-tools/28.0.3/
  build-tools;29.0.0                                    | 29.0.0       | Android SDK Build-Tools 29                 | build-tools/29.0.0/
  build-tools;29.0.1                                    | 29.0.1       | Android SDK Build-Tools 29.0.1             | build-tools/29.0.1/
  build-tools;29.0.2                                    | 29.0.2       | Android SDK Build-Tools 29.0.2             | build-tools/29.0.2/
  build-tools;29.0.3                                    | 29.0.3       | Android SDK Build-Tools 29.0.3             | build-tools/29.0.3/
  build-tools;30.0.0                                    | 30.0.0       | Android SDK Build-Tools 30                 | build-tools/30.0.0/
  build-tools;30.0.1                                    | 30.0.1       | Android SDK Build-Tools 30.0.1             | build-tools/30.0.1/
  build-tools;30.0.2                                    | 30.0.2       | Android SDK Build-Tools 30.0.2             | build-tools/30.0.2/
  build-tools;30.0.3                                    | 30.0.3       | Android SDK Build-Tools 30.0.3             | build-tools/30.0.3/
  build-tools;34.0.0                                    | 34.0.0       | Android SDK Build-Tools 34                 | build-tools/34.0.0/
  cmake;3.10.2.4988404                                  | 3.10.2       | CMake 3.10.2.4988404                       | cmake/3.10.2.4988404/
  cmake;3.22.1                                          | 3.22.1       | CMake 3.22.1                               | cmake/3.22.1/
  cmake;3.6.4111459                                     | 3.6.4111459  | CMake 3.6.4111459                          | cmake/3.6.4111459/
  cmdline-tools;1.0                                     | 1.0          | Android SDK Command-line Tools             | cmdline-tools/1.0/
  cmdline-tools;2.1                                     | 2.1          | Android SDK Command-line Tools             | cmdline-tools/2.1/
  cmdline-tools;3.0                                     | 3.0          | Android SDK Command-line Tools             | cmdline-tools/3.0/
  cmdline-tools;4.0-beta01                              | 4.0.0 rc1    | Android SDK Command-line Tools             | cmdline-tools/4.0-beta01/
  cmdline-tools;latest                                  | 11.0         | Android SDK Command-line Tools (latest)    | cmdline-tools/latest-2/
  emulator                                              | 35.2.10      | Android Emulator                           | emulator/
  extras;google;google_play_services                    | 49           | Google Play services                       | extras/google/google_play_services/
  extras;google;instantapps                             | 1.9.0        | Google Play Instant Development SDK        | extras/google/instantapps/
  extras;google;market_apk_expansion                    | 1            | Google Play APK Expansion library          | extras/google/market_apk_expansion/
  extras;google;market_licensing                        | 1            | Google Play Licensing Library              | extras/google/market_licensing/
  extras;google;simulators                              | 1            | Android Auto API Simulators                | extras/google/simulators/
  extras;google;webdriver                               | 2            | Google Web Driver                          | extras/google/webdriver/
  ndk;22.0.7026061                                      | 22.0.7026061 | NDK (Side by side) 22.0.7026061            | ndk/22.0.7026061/
  ndk;25.2.9519653                                      | 25.2.9519653 | NDK (Side by side) 25.2.9519653            | ndk/25.2.9519653/
  patcher;v4                                            | 1            | SDK Patch Applier v4                       | patcher/v4/
  platform-tools                                        | 34.0.4       | Android SDK Platform-Tools                 | platform-tools/
  platforms;android-21                                  | 2            | Android SDK Platform 21                    | platforms/android-21/
  platforms;android-22                                  | 2            | Android SDK Platform 22                    | platforms/android-22/
  platforms;android-23                                  | 3            | Android SDK Platform 23                    | platforms/android-23/
  platforms;android-24                                  | 2            | Android SDK Platform 24                    | platforms/android-24/
  platforms;android-25                                  | 3            | Android SDK Platform 25                    | platforms/android-25/
  platforms;android-26                                  | 2            | Android SDK Platform 26                    | platforms/android-26/
  platforms;android-27                                  | 3            | Android SDK Platform 27                    | platforms/android-27/
  platforms;android-28                                  | 6            | Android SDK Platform 28                    | platforms/android-28/
  platforms;android-29                                  | 5            | Android SDK Platform 29                    | platforms/android-29/
  platforms;android-30                                  | 3            | Android SDK Platform 30                    | platforms/android-30/
  platforms;android-31                                  | 1            | Android SDK Platform 31                    | platforms/android-31/
  platforms;android-32                                  | 1            | Android SDK Platform 32                    | platforms/android-32/
  platforms;android-33                                  | 3            | Android SDK Platform 33                    | platforms/android-33/
  platforms;android-33-ext4                             | 1            | Android SDK Platform 33-ext4               | platforms/android-33-ext4/
  platforms;android-33-ext5                             | 1            | Android SDK Platform 33-ext5               | platforms/android-33-ext5/
  platforms;android-34                                  | 2            | Android SDK Platform 34                    | platforms/android-34/
  sources;android-21                                    | 1            | Sources for Android 21                     | sources/android-21/
  sources;android-22                                    | 1            | Sources for Android 22                     | sources/android-22/
  sources;android-23                                    | 1            | Sources for Android 23                     | sources/android-23/
  sources;android-24                                    | 1            | Sources for Android 24                     | sources/android-24/
  sources;android-25                                    | 1            | Sources for Android 25                     | sources/android-25/
  sources;android-26                                    | 1            | Sources for Android 26                     | sources/android-26/
  sources;android-27                                    | 1            | Sources for Android 27                     | sources/android-27/
  sources;android-28                                    | 1            | Sources for Android 28                     | sources/android-28/
  sources;android-29                                    | 1            | Sources for Android 29                     | sources/android-29/
  sources;android-30                                    | 1            | Sources for Android 30                     | sources/android-30/
  sources;android-31                                    | 1            | Sources for Android 31                     | sources/android-31/
  sources;android-32                                    | 1            | Sources for Android 32                     | sources/android-32/
  sources;android-33                                    | 1            | Sources for Android 33                     | sources/android-33/
  sources;android-34                                    | 1            | Sources for Android 34                     | sources/android-34/
  system-images;android-30;google_apis_playstore;x86_64 | 10           | Google Play Intel x86 Atom_64 System Image | system-images/android-30/google_apis_playstore/x86_64/
  system-images;android-34;google_apis_playstore;x86_64 | 14           | Google Play Intel x86_64 Atom System Image | system-images/android-34/google_apis_playstore/x86_64/

{{< /collapsible >}}
            


## Android NDK

| **Version** | **Path** |
|---------|------|
| 22.0.7026061 | `/usr/local/share/android-sdk/ndk/22.0.7026061` |
| 25.2.9519653 | `/usr/local/share/android-sdk/ndk/25.2.9519653` |



## Android emulators

> AVD Manager at `/usr/local/share/android-sdk/cmdline-tools/latest/bin/avdmanager`

**Available emulators**

| **Name** | **Device** | **Based On** |
|------|--------|----------|
| emulator | pixel_4 (Google) | Android 11.0 (R) Tag/ABI: google_apis_playstore/x86_64 |
| emulator-34 | pixel_4 (Google) | Android API 34 Tag/ABI: google_apis_playstore/x86_64 |


{{< collapsible title="Full details" >}}
```
$ /usr/local/share/android-sdk/cmdline-tools/latest/bin/avdmanager list avd

Available Android Virtual Devices:
    Name: emulator
  Device: pixel_4 (Google)
    Path: /home/builder/.config/.android/avd/emulator.avd
  Target: Google Play (Google Inc.)
          Based on: Android 11.0 (R) Tag/ABI: google_apis_playstore/x86_64
    Skin: pixel_4
  Sdcard: 512M
---------
    Name: emulator-34
  Device: pixel_4 (Google)
    Path: /home/builder/.config/.android/avd/emulator-34.avd
  Target: Google Play (Google Inc.)
          Based on: Android API 34 Tag/ABI: google_apis_playstore/x86_64
    Skin: pixel_4
  Sdcard: 512M
```    
{{< /collapsible >}}


## Java versions

| **Version** | **Path** |
|-------------|----------|
| 11 | `/usr/lib/jvm/java-1.11.0-openjdk-amd64` |
| 15 | `/usr/lib/jvm/java-1.15.0-openjdk-amd64` |
| 17 | `/usr/lib/jvm/java-1.17.0-openjdk-amd64` |
| 21 | `/usr/lib/jvm/java-1.21.0-openjdk-amd64` |
| 8 | `/usr/lib/jvm/java-1.8.0-openjdk-amd64` |



## Gradle versions

| **Version** | **Path** |
|---------|------|
| **8.1.1** (default) | `/home/builder/programs/gradle-8.1.1` |
| 7.6 | `/home/builder/programs/gradle-7.6` |
| 7.3.1 | `/home/builder/programs/gradle-7.3.1` |



## Other pre-installed tools

- aws `2.8.9`
- curl `7.68.0`
- docker `26.1.4`
- ew-cli `None`
- fastlane `2.214.0`
- firebase `11.21.0`
- gem `3.1.4`
- gh `1.8.1`
- git `2.25.1`
- Google Cloud SDK `479.0.0`
- gsutil `5.29`
- ionic `5.4.16`
- jq `1.6`
- ktlint `0.43.2`
- node `20.11.1`
- npm `10.2.4`
- OpenSSH  `8.2p1`
- python `3.8.10`
- ruby `2.7.2p137`
- snapcraft  `8.9.2`
- sudo `1.8.31`
- tar `1.30`
- unzip `6.00`
- wget `1.20.3`
- yarn `1.22.22`
- yq `4.44.5`
- zip `3.0`

---
description: A list of tools available out-of-the-box on Codemagic Windows build machines.
title: Windows machines
weight: 3
---

## Hardware

- Windows virtual machine: `8 vCPUs, 32 GB memory`

## System

- System version `Microsoft Windows Server 2022 Datacenter (OS Build 20348.643)`
- Disk `150GB (Free Space: 66GB)`


## Android Studio

Android Studio Iguana `2023.2.1` installed at `C:\Program Files\Android\Android Studio\`


## Android SDK

> SDK Manager at `C:\Users\builder\programs\android-sdk\cmdline-tools\latest\bin\sdkmanager.bat`

{{< collapsible title="Installed SDK packages" >}}
```
$ C:\Users\builder\programs\android-sdk\cmdline-tools\latest\bin\sdkmanager.bat --list_installed
```

Installed packages:
Loading package information...
Loading local repository...
[=========                              ] 25% Loading local repository...
[=========                              ] 25% Fetch remote repository...
[=======================================] 100% Fetch remote repository...

Installed packages:
  Path                                                | Version       | Description                                                  | Location

  -------                                             | -------       | -------                                                      | -------

  build-tools;30.0.3                                  | 30.0.3        | Android SDK Build-Tools 30.0.3                               | build-tools\30.0.3

  build-tools;34.0.0                                  | 34.0.0        | Android SDK Build-Tools 34                                   | build-tools\34.0.0

  cmake;3.22.1                                        | 3.22.1        | CMake 3.22.1                                                 | cmake\3.22.1

  cmdline-tools;latest                                | 13.0          | Android SDK Command-line Tools (latest)                      | cmdline-tools\latest

  extras;google;Android_Emulator_Hypervisor_Driver    | 2.0.0         | Android Emulator hypervisor driver (installer)               | extras\google\Android_Emulator_Hypervisor_Driver
  extras;google;google_play_services                  | 49            | Google Play services                                         | extras\google\google_play_services
  extras;google;instantapps                           | 1.9.0         | Google Play Instant Development SDK                          | extras\google\instantapps

  extras;google;market_apk_expansion                  | 1             | Google Play APK Expansion library                            | extras\google\market_apk_expansion
  extras;google;market_licensing                      | 1             | Google Play Licensing Library                                | extras\google\market_licensing
  extras;google;usb_driver                            | 13            | Google USB Driver                                            | extras\google\usb_driver

  extras;google;webdriver                             | 2             | Google Web Driver                                            | extras\google\webdriver

  extras;intel;Hardware_Accelerated_Execution_Manager | 7.6.5         | Intel x86 Emulator Accelerator (HAXM installer) - Deprecated | extras\intel\Hardware_Accelerated_Execution_Manager
  ndk;26.2.11394342                                   | 26.2.11394342 | NDK (Side by side) 26.2.11394342                             | ndk\26.2.11394342

  platform-tools                                      | 35.0.1        | Android SDK Platform-Tools                                   | platform-tools

  platforms;android-29                                | 5             | Android SDK Platform 29                                      | platforms\android-29

  platforms;android-30                                | 3             | Android SDK Platform 30                                      | platforms\android-30

  platforms;android-31                                | 1             | Android SDK Platform 31                                      | platforms\android-31

  platforms;android-32                                | 1             | Android SDK Platform 32                                      | platforms\android-32

  platforms;android-33                                | 3             | Android SDK Platform 33                                      | platforms\android-33

  platforms;android-34                                | 3             | Android SDK Platform 34                                      | platforms\android-34

  sources;android-29                                  | 1             | Sources for Android 29                                       | sources\android-29

  sources;android-30                                  | 1             | Sources for Android 30                                       | sources\android-30

  sources;android-31                                  | 1             | Sources for Android 31                                       | sources\android-31

  sources;android-32                                  | 1             | Sources for Android 32                                       | sources\android-32

  sources;android-33                                  | 1             | Sources for Android 33                                       | sources\android-33

  sources;android-34                                  | 2             | Sources for Android 34                                       | sources\android-34

  system-images;android-34;google_apis;x86_64         | 12            | Google APIs Intel x86_64 Atom System Image                   | system-images\android-34\google_apis\x86_64
{{< /collapsible >}}



## Java versions

| **Version** | **Path** |
|---------|------|
| 1.8 | `C:\Program Files\OpenJDK\jdk-1.8.0` |
| 11 | `C:\Program Files\OpenJDK\jdk-11.0.22` |
| 17 | `C:\Program Files\OpenJDK\jdk-17` |
| 20 | `C:\Program Files\OpenJDK\jdk-20.0.1` |
| **21** (default) | `C:\Program Files\OpenJDK\jdk-21.0.2` |



## Gradle versions

| **Version** | **Path** |
|--------|------|
| 8.14.1 | `C:\Users\builder\programs\gradle-8.14.1` |



## Other pre-installed tools

- Android NDK `26.2.11394342`
- 7zip `23.1`
- chocolatey `2.2.2`
- chocolatey-core.extension `1.4.0`
- chocolatey-windowsupdate.extension `1.0.5`
- curl `8.6.0`
- DotNetFx `4.8.0.20220524`
- fastlane `2.219.0`
- firebase `13.6.0`
- gem `3.5.3`
- gh `2.46.0`
- Google Cloud SDK `468.0.0` 
- gsutil `5.27`
- git `2.44.0`
- grep `3.11`
- less `634.0`
- node `20.12.2`
- npm `10.5.0`
- openssl `1.1.1.2100`
- powershell-core `7.4.1`
- pyenv-win `3.1.1`
- python `3.9.6`
- ruby `3.3.0`
- ssh
- unzip `6.0`
- vcredist140 `14.38.33135`
- vcredist2015 `14.0.24215.20170201`
- vim `9.1.202`
- visualcpp-build-tools `15.0.26228.20170424`
- wget `1.21.4`
- yarn `1.22.19`
- zip `3.0.0`

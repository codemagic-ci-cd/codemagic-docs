---
description: Find out how to overcome frequent issues with building your Flutter app on Codemagic. 
title: Common issues
weight: 1
---

## iOS build hangs at `Xcode build done`

**Description**:
When building for iOS, the build gets stuck after showing `Xcode build done` in the log but does not finish and eventually times out.

**Log output**: 

    == Building for iOS ==

    == /usr/local/bin/flutter build ios --release --no-codesign ==
    Warning: Building for device with codesigning disabled. You will have to manually codesign before deploying to device.
    Building net.butterflyapp.trainer for device (ios-release)...
    Running pod install...                                              3.7s
    Running Xcode build...                                          
    Xcode build done.                                           203.6s

**Flutter**: 1.7.8+hotfix.3, 1.7.8+hotfix.4, 1.9.1+hotfix.2

**Xcode**: N/A

**Solution**: This is a known issue that occurs randomly and can be traced back to Flutter:
https://github.com/flutter/flutter/issues/28415
https://github.com/flutter/flutter/issues/35988

This issue is known to be fixed on the master channel.
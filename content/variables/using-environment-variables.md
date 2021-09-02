---
description: How to use environment variables in scripts
title: Referencing environment variables
weight: 2
aliases:
---

To access a variable, add the `$` symbol in front of its name. For example, access `API_TOKEN` by using `$API_TOKEN`. Note that it is required to use quotation marks with multi-line variables when you are referencing them in custom scripts.

## Accessing environment variables from your application

The following examples show how to place your Google Maps API key into an Android or iOS application from an environment variable. With this approach you will not have to store your secret key in the repository.

1. Add your key as an environment variable with the name `MAPS_API_KEY`

### Android

2. Read the key from an environment variable to `build.gradle`

```gradle
defaultConfig {
    // Other values set here
    resValue "string", "maps_api_key", "$System.env.MAPS_API_KEY"
}
```

3. Read the key from the `build.gradle` value to `AndroidManifest.xml`

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="@string/maps_api_key"
/>
```

### iOS (Swift)

2. Read the key from the environment variable to `Info.plist`

```xml
<key>MAPS_API_KEY</key>
<string>$(MAPS_API_KEY)</string>
```

3. Read the key from the `Info.plist` value to `AppDelegate.swift`

```swift
GMSServices.provideAPIKey(Bundle.main.object(forInfoDictionaryKey: "MAPS_API_KEY") as? String ?? "")
```

### iOS (Objective-C)

2.  Read your key from the environemnt variable to `AppDelegate.m` as in the [example](https://github.com/flutter/plugins/blob/master/packages/google_maps_flutter/google_maps_flutter/example/ios/Runner/AppDelegate.m).

```objective-c
[GMSServices provideAPIKey:[[NSProcessInfo processInfo] environment][@"MAPS_API_KEY"]];
```

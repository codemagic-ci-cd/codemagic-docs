---
description: How to use environment variables in scripts
title: Referencing environment variables
weight: 2
aliases:
---

To access a variable, add the `$` symbol in front of its name. For example, access `API_TOKEN` by using `$API_TOKEN`. Note that it is required to use quotation marks with multi-line variables when you are referencing them in custom scripts.

## Setting environment variables during the build

By default, if you define an environment variable inside your script, you can only use it within the script itself. However, you can make an environment variable available to any subsequent parts of your workflow by defining or updating the environment variable and writing it to the `CM_ENV` environment file.

Specifically, you can do this by writing a `"KEY=value"` pair to the `CM_ENV` environment file. `CM_ENV` can contain multiple environment variables separated by newlines. Instructions on how to write variables to the file can be found below.

### Setting an environment variable on macOS and Linux

```yaml
echo "KEY=value" >> $CM_ENV
```

You can then reference the variable in subsequent parts of your workflow by using `$KEY`.

### Setting an environment variable on Windows

```yaml
Add-Content -Path $env:CM_ENV -Value "KEY=value"
```

You can then reference the variable in subsequent parts of your workflow by using `$env:KEY`.

### Example usage

The variables that you write to the `CM_ENV` environment file work with both `codemagic.yaml` and `Flutter Workflow Editor` configurations. Note that the examples below are specific to Linux and macOS build machines. On Windows machines, the correct way to reference an environment variable is using `$env:KEY`.

#### codemagic.yaml

```yaml
scripts:
  - name: Set the value
    script: |
      echo "KEY=value" >> $CM_ENV
  - name: Use the value
    script: |
      echo $CM_ENV # This will output 'value'
```

#### Workflow Editor

In the `Flutter Workflow Editor` you can set the variable in any of the custom scripts (e.g. `Post-clone script`) by adding `echo "KEY=value" >> $CM_ENV`.

The set variable can then be used in any other subsequent custom script step or for example as an argument in any other subsequent part of the workflow. For example under iOS build arguments as `--flavor=$KEY`.

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

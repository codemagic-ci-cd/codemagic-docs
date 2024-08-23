---
description: How to use environment variables in scripts in codemagic.yaml
title: Using environment variables with codemagic.yaml
linkTitle: Using environment variables
weight: 3
aliases:
  - /variables/using-environment-variables
---

To access a variable during build time, add the `$` symbol in front of its name. For example, you can access the value of `API_TOKEN` variable by referencing it as `$API_TOKEN`.

{{<notebox>}}
**Note:** It is required to use quotation marks with multi-line variables when you are referencing them in custom scripts.
{{</notebox>}}


## Setting environment variables at build time and accessing them across shell scripts

By default, if you define an environment variable inside your script, you can only use it within that particular script itself. However, you can make an environment variable available to any subsequent step of your workflow by writing it to the `CM_ENV` environment file.

Specifically, you can do this by writing a `"KEY=value"` pair to the `CM_ENV` environment file. `CM_ENV` can contain multiple environment variables separated by newlines.

The following commands show how to write variables to the `CM_ENV` file, depending on the `instance type` of the build machine you are using:

{{< tabpane >}}

{{< tab header="macOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Save variable to ENV file
      script: | 
        echo "KEY=value" >> $CM_ENV
{{< /highlight >}}
{{<markdown>}}
You can then reference the variable in subsequent parts of your workflow by using `$KEY`.
{{</markdown>}}
{{< /tab >}}

{{< tab header="Linux" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Save variable to ENV file
      script: | 
        echo "KEY=value" >> $CM_ENV
{{< /highlight >}}
{{<markdown>}}
You can then reference the variable in subsequent parts of your workflow by using `$KEY`.
{{</markdown>}}
{{< /tab >}}

{{< tab header="Windows" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Save variable to ENV file
      script: | 
        Add-Content -Path $env:CM_ENV -Value "KEY=value"
{{< /highlight >}}
{{<markdown>}}
You can then reference the variable in subsequent parts of your workflow by using `$env:KEY`.
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


#### Setting a multiline environment variable

To add a multiline environment variable, you need to use `<<` instead of an `=` to mark the end of the key in the key-value pair. In addition, set a delimiter to mark the start and the end of the variable. 

In the following example, the `DELIMITER` keyword can be replaced by any word of your choice, however, make sure that the delimiter at the beginning and at the end match.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Save variable to ENV file
      script: | 
        echo 'MULTILINE_VAR<<DELIMITER' >> $CM_ENV
        echo 'line_one\nline_two' >> $CM_ENV
        echo 'DELIMITER' >> $CM_ENV
{{< /highlight >}}


Note that the example is specific to Linux and macOS machines but the same principles apply when building on Windows.



## Accessing environment variables from apps

Environment variables can also be accessed from within your apps. One of the great advantages is that you are able to use sensitive data such as API keys without having to store them in your repository.

The following examples show how to place your Google Maps API key into an Android or iOS application from an environment variable.

{{< tabpane >}}

{{< tab header="Android" >}}
{{<markdown>}}

1. Add your key as an environment variable with the name `MAPS_API_KEY`
2. Reference the environment variable in the `build.gradle`
{{< highlight Groovy "style=paraiso-dark">}}
defaultConfig {
    // Other values set here
    resValue "string", "maps_api_key", "$System.env.MAPS_API_KEY"
}
{{< /highlight >}}
{{</markdown>}}

3. Reference the value from `build.gradle` in the `AndroidManifest.xml`

{{< highlight xml "style=paraiso-dark">}}
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="@string/maps_api_key"
/>
{{< /highlight >}}

{{< /tab >}}

{{< tab header="Flutter" >}}
{{<markdown>}}

1. Add your key as an environment variable with the name `MAPS_API_KEY`
2. In the build step, add `--dart-define` to your build script

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Flutter build ipa
      script: | 
        flutter build ipa --release \
          --dart-define=MAPS_API_KEY=$MAPS_API_KEY
{{< /highlight >}}

3. Within your Flutter Application, use `String.fromEnvironment` to retrieve these variables in your Dart Code.

{{< highlight Dart "style=paraiso-dark">}}
void main() {
  final secret = String.fromEnvironment('MAPS_API_KEY');
  print(secret);
}
{{< /highlight >}}
{{</markdown>}}

{{< /tab >}}

{{< tab header="iOS (Swift)" >}}
{{<markdown>}}
1. Add your key as an environment variable with the name `MAPS_API_KEY`
2. Reference the environment variable in the `Info.plist`
{{< highlight xml "style=paraiso-dark">}}
<key>MAPS_API_KEY</key>
<string>$(MAPS_API_KEY)</string>
{{< /highlight >}}

3. Reference the value from `Info.plist` in the `AppDelegate.swift`

{{< highlight Swift "style=paraiso-dark">}}
GMSServices.provideAPIKey(Bundle.main.object(forInfoDictionaryKey: "MAPS_API_KEY") as? String ?? "")
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS (Objective-C)" >}}
{{<markdown>}}
1. Add your key as an environment variable with the name `MAPS_API_KEY`
2. Reference the environment variable in the `AppDelegate.m` as in the following [example](https://github.com/flutter/plugins/blob/master/packages/google_maps_flutter/google_maps_flutter/example/ios/Runner/AppDelegate.m).

{{< highlight Objective-C "style=paraiso-dark">}}
[GMSServices provideAPIKey:[[NSProcessInfo processInfo] environment][@"MAPS_API_KEY"]];
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}
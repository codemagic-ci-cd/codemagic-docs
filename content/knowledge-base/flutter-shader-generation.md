---
description: How to build Android and iOS apps with Flutter shader compilation enabled.
title: Flutter Shader Compilation
weight: 14
---

Flutter provides command line tools for app developers to collect shaders in the SkSL (Skia Shader Language) format that end users may require. The SkSL shaders can then be bundled into the app and pre-compiled when an end-user first launches the app, reducing compilation jank in subsequent animations.

You can check the official Flutter documentation for more details [here](https://docs.flutter.dev/perf/shader).

Steps to build with Flutter shader compilation.

1. Build the app in `profile` mode in your local machine with **actual device connected**. Play around with the app to trigger as many animations as you need, especially ones with compilation jank.

{{< highlight bash "style=paraiso-dark">}}
flutter run --profile --cache-sksl --purge-persistent-cache
```

2. Press M at the flutter run command line to save the captured SkSL shaders to a file called `flutter_01.sksl.json` in your root directory.

3. Commit the file to your Github Repository.

4. Build the app with SkSL warm-up with your Codemagic Workflow by passing the additional argument `--bundle-sksl-path flutter_01.sksl.json` to your build command. For e.g

```bash
flutter build ipa --bundle-sksl-path flutter_01.sksl.json
```

{{<notebox>}}

1. Please note that the flutter profile mode is only on actual iOS/Android Devices. It might not run properly on the simulator/emulator. You can check the official Flutter documentation for the flutter profile mode [here](https://github.com/flutter/flutter/wiki/Flutter%27s-modes).
2. You can refer to the FAQs related to Flutter shader compilation [here](https://docs.flutter.dev/perf/shader#frequently-asked-questions).
   {{</notebox>}}

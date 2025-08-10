---
title: Detox (E2E) test automation
description: How to run Detox tests with codemagic.yaml
weight: 5

---

Detox is a tool that helps you test your mobile apps automatically, the same way a real person would use it. Detox testing refers to end-to-end (E2E) testing for React Native apps using the Detox framework. It is especially built for React Native, however it also supports native iOS and Android apps.


## Prerequisites

1. **npm/yarn** are pre-installed
2. A ready React Native project
3. Xcode for iOS and Android Studio for Android are pre-installed
4. **homebrew** are pre-installed

{{<notebox>}}
Pre-installed means that Codemagic machines already have them ready to use, so no need to install them manually.
{{</notebox>}}

## Running Detox tests

1. Configure your project **package.json** file with Detox:

```json
  "detox": {
    "runnerConfig": "e2e/config.json",
    "configurations": {
      "ios.sim.release": {
        "type": "ios.simulator",
        "device": {
          "type": "iPhone 14"
        },
        "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/MyReactNativeApp.app",
        "build": "xcodebuild -workspace ios/YOUR_APP.xcworkspace -scheme YOUR_APP -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"

      },
    }
  }
```
2. Install **detox-cli** by running **npm install detox-cli --global**

3. Add a script to install **applesimutils** as it is required by Detox to work with iOS simulators:

```yaml
brew tap wix/brew
brew install applesimutils
```

4. To build the app, run the following command:

```yaml
detox build --configuration ios.sim.release
```

5. Once you successfully installed the necessary tools and built your app, it is time to test it:

```yaml
detox test --configuration ios.sim.release
```

Here is how your **codemagic.yaml** should look like:

```yaml
```
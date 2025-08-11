---
title: Detox (E2E) test automation
description: How to run Detox tests with codemagic.yaml
weight: 5

---

Detox testing refers to end-to-end (E2E) testing for React Native apps using the Detox framework. Detox provides a gray box testing solution, meaning it runs tests on a real device or emulator while also accessing the app's internal state for better synchronization.


## Prerequisites

1. **npm/yarn** are pre-installed
2. A ready React Native project
3. Xcode for iOS and Android Studio for Android are pre-installed
4. **homebrew** is pre-installed

{{<notebox>}}
Pre-installed means that Codemagic machines already have the software ready to use, so there is no need to install it manually.
{{</notebox>}}

## Running Detox tests

1. Configure your project's **package.json** file with Detox:

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
  workflows:
    detox-test:
        name: Deto test automation
        environment:
          node: latest
          xcode: latest
        scripts:
            - name: Install Detox CLI tools
              script: npm install detox-cli --global
            - name: Install applesimutils
              script: |
                brew tap wix/brew
                brew install applesimutils
            - name: Build Detox app
              script: detox build --configuration ios.sim.release
            - name: Execute Detox testing
              script: detox test --configuration ios.sim.release
```

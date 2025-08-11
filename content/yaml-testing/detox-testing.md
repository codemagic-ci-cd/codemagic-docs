---
title: Detox (E2E) test automation
description: How to run Detox tests with codemagic.yaml
weight: 5

---

Detox testing refers to end-to-end (E2E) testing for React Native apps using the Detox framework. Detox provides a gray box testing solution, meaning it runs tests on a real device or emulator while also accessing the app's internal state for better synchronization.


## Prerequisites

1. A React Native project
2. **npm/yarn** are pre-installed
3. Xcode for iOS and Android Studio for Android are pre-installed
4. **homebrew** is pre-installed

{{<notebox>}}
Pre-installed means that Codemagic machines already have the software ready to use, so there is no need to install it manually.
{{</notebox>}}

## Running Detox tests from codemagic.yaml

1. Adjust your project's **package.json** file with Detox before starting Codemagic configurations:

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
2. Install the required tools by running the following commands:

```bash
# install Detox CLI tools
npm install detox-cli --global

# Detox requires applesimutils to work with iOS simulators
brew tap wix/brew
brew install applesimutils
```

3. Build and run detox tests:
   
```bash
detox build --configuration ios.sim.release
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

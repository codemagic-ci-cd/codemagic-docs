---
title: Building a native iOS app
description: Building an iOS app with YAML.
weight: 4
---

With `codemagic.yaml`, you can use Codemagic to build, test and publish native iOS apps written in Swift or Objective C. You can read more about how to use codemagic.yaml and see the structure of the file [HERE](../yaml/yaml).

## Building a native iOS app

For building an iOS app with Swift, you need to run the following command in the scripts section:

    - xcode-project build-ipa --project "MyXcodeProject.xcodeproj" --scheme "MyScheme"

## Testing an iOS app

The code for testing an iOS app also goes under `scripts`. The relevant code for a native iOS app looks like this:

    xcodebuild \
    -workspace MyAwesomeApp.xcworkspace \
    -scheme MyAwesomeApp \
    -sdk iphonesimulator \
    -destination 'platform=iOS Simulator,name=iPhone 6,OS=8.1' \
    test | xcpretty (edited) 

More examples of testing with YAML can be found [HERE](../yaml/testing).

## Code signing

A full example of iOS code singing with YAML is available [HERE](../yaml/distribution).

## Publishing

All generated artifacts can be published to external services. The available integrations currently are email, Slack, Google Play, App Store Connect and Codemagic Static Pages. Script examples for all of them are available [HERE](../yaml/distribution/#publishing).
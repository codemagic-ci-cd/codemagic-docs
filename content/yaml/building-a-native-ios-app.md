---
title: Building a native iOS app
description: Building an iOS app with YAML.
weight: 4
---

With `codemagic.yaml`, you can use Codemagic to build, test and publish native iOS apps. You can read more about how to use codemagic.yaml and see the structure of the file [here](../yaml/yaml).

## Building an unsigned native iOS app (.app)

For building an unsigned iOS app (.app), you need to run the following command in the scripts section:

    - xcodebuild build -workspace "MyXcodeWorkspace.xcworkspace" -scheme "MyScheme" CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO

## Building a native iOS app archive (.ipa)

For building an archived iOS app (.ipa), you need to run the following command in the scripts section:

    - xcode-project build-ipa --project "MyXcodeProject.xcodeproj" --scheme "MyScheme"

## Testing an iOS app

The code for testing an iOS app also goes under `scripts`. The relevant code for a native iOS app looks like this:

    xcodebuild \
        -workspace MyAwesomeApp.xcworkspace \
        -scheme MyAwesomeApp \
        -sdk iphonesimulator \
        -destination 'platform=iOS Simulator,name=iPhone 6,OS=8.1' \
        test | xcpretty

More examples of testing with YAML can be found [here](../yaml/testing).

## Code signing

A full example of iOS code singing with YAML is available [here](../yaml/distribution).

## Publishing

All generated artifacts can be published to external services. The available integrations currently are email, Slack and App Store Connect. Script examples for all of them are available [here](../yaml/distribution/#publishing).
---
title: Building a native iOS app
description: Building an iOS app with YAML.
weight: 4
---

With `codemagic.yaml`, you can use Codemagic to build, test and publish native iOS apps. You can read more about how to use `codemagic.yaml` and see the structure of the file [here](../yaml/yaml).

## Building an unsigned native iOS app (.app)

For building an unsigned iOS app (.app), you need to run the following command in the scripts section:

    - xcodebuild build -workspace "MyXcodeWorkspace.xcworkspace" -scheme "MyScheme" CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO

## Building a native iOS app archive (.ipa)

For building an archived iOS app (.ipa), you need to run the following command in the scripts section:

    - xcode-project build-ipa --project "MyXcodeProject.xcodeproj" --scheme "MyScheme"

{{<notebox>}}Read more about different schemes in [Apple documentation](https://help.apple.com/xcode/mac/current/#/dev0bee46f46).{{</notebox>}} 

## Testing and publishing

To test, code sign and publish an iOS app:

* The code for testing an iOS app also goes under `scripts`, before build commands. An example for testing an iOS app can be found [here](../yaml/testing/#native-ios).
* A full example of iOS code singing with YAML is available [here](../yaml/distribution).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and App Store Connect. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../yaml/distribution/#publishing).

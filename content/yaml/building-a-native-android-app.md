---
title: Building a native Android app
description: Building an Android app with YAML.
weight: 3
---
## Building an Android app

The necessary command for building native Android application goes under `scripts` in the [overall architecture](../yaml/yaml/#template) in the `codemagic.yaml` file. For Android (built with gradle), the script looks like this:

    - ./gradlew build

## Testing, code signing and publishing an Android app

To test, code sign and publish an Android app:

* The code for testing an Android app also goes under `scripts`. A few examples of testing can be found [here](../yaml/testing).
* All Android applications need to be signed before release. For Gradle code signing configuration refer to the [documentation](../code-signing/android-code-signing/#preparing-your-flutter-project-for-code-signing). More information about code signing with YAML in general is [here](../yaml/distribution).
* All generated artifacts can be published to external services. The available integrations currently are email, Slack and Google Play. It is also possible to publish elsewhere with custom scripts (e.g. Firebase App Distribution). Script examples for all of them are available [here](../yaml/distribution/#publishing).

## Android workflow example

The following example shows how to set up a workflow that builds your app and publishes to a Google Play internal track.

    workflows:
        android-workflow:
            name: Android Workflow
            max_build_duration: 60
            instance_type: mac_pro
            environment:
                vars:
                    CM_KEYSTORE: Encrypted(...) # PUT THE ENCRYPTED KEYSTORE FILE HERE
                    CM_KEYSTORE_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED PASSWORD FOR THE KEYSTORE FILE HERE
                    CM_KEY_ALIAS_PASSWORD: Encrypted(...) # PUT THE ENCRYPTED KEYSTORE ALIAS PASSWORD HERE
                    CM_KEY_ALIAS_USERNAME: Encrypted(...) #PUT THE ENCRYPTED KEYSTORE USERNAME HERE
                node: latest
            triggering:
                events:
                    - push
                    - tag
                    - pull_request
                branch_patterns:
                    - pattern: release
                    include: true
                    source: true
            scripts:
                - name: Set up local properties
                  script: |
                    echo "sdk.dir=$HOME/programs/android-sdk-macosx" > "$FCI_BUILD_DIR/android/local.properties"
                - name: Set up keystore
                  script: |
                    echo $CM_KEYSTORE | base64 --decode > /tmp/keystore.keystore
                    cat >> "$FCI_BUILD_DIR/android/key.properties" <<EOF
                    storePassword=$CM_KEYSTORE_PASSWORD
                    keyPassword=$CM_KEY_ALIAS_PASSWORD
                    keyAlias=$CM_KEY_ALIAS_USERNAME
                    storeFile=/tmp/keystore.keystore
                    EOF
                - name: Build Android app
                  script: |
                    ./gradlew assembleRelease
            artifacts:
                - android/app/build/outputs/**/**/*.apk
            publishing:
                google_play:
                    credentials: Encrypted(...) # PUT YOUR ENCRYPTED GOOGLE PLAY JSON CREDENTIALS FILE HERE
                    track: internal

{{<notebox>}}Note that you should incremenet the versionCode in `android/app/build.gradle`. {{</notebox>}}

Incrementing the version code can be done as follows:

```
    android {
        ...
        
        def appVersionCode = Integer.valueOf(System.env.BUILD_NUMBER ?: 0)
        defaultConfig {
            ...
            versionCode appVersionCode
            ...
        }
    }
```
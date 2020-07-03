---
title: Using Codemagic CLI tools locally
description: Using Codemagic CLI tools locally or in other environments.
weight: 9
---

[codemagic-cli-tools](https://pypi.org/project/codemagic-cli-tools/) is a set of tools to simplify builds at Codemagic. They can be installed with pip (`pip3 install codemagic-cli-tools`) and run locally. For more information, review the full documentation on [CLI tools](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs#cli-tools).

{{<notebox>}}
Requires: Python ≥ 3.7
{{</notebox>}}

## Build and code sign an Xcode project

To fetch (or create and download) the provisioning profile(s) and certificate for `MY_BUNDLE_ID` app, use the [app-store-connect](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/README.md#app-store-connect) tool.

    app-store-connect fetch-signing-files --issuer-id ISSUER_ID --key-id KEY_IDENTIFIER --private-key PRIVATE_KEY --certificate-key PRIVATE_KEY MY_BUNDLE_ID

 By default, your certificate will be saved to `$HOME/Library/MobileDevice/Certificates` and the provisioning profile(s) will be saved to `$HOME/Library/MobileDevice/Provisioning Profiles`.
 Refer to [Setting up code signing for iOS](/yaml/distribution/) for more information about accessing App Store Connect.

To initialize keychain at system default keychain path with empty keychain password and add your `certificate.p12` with certificate password, use the [keychain](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/keychain/README.md#keychain) tool with the following command:

    keychain initialize
    keychain add-certificates --certificate /path/to/certificate.p12 --certificate-password CERTIFICATE_PASSWORD

To use the provisioning profile from `/path/to/profile.mobileprovision` in your Xcode project `/path/to/MyProject.xcodeproj` and generate an .ipa archive using `MyScheme` scheme, use [xcode-project](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/xcode-project/README.md#xcode-project) with the following command:

    xcode-project use-profiles --project /path/to/MyProject.xcodeproj --profile /path/to/profile.mobileprovision
    xcode-project build-ipa --project /path/to/MyProject.xcodeproj --scheme MyScheme

## Generate a universal APK with user specified keys from app bundle

To build an APK from the app bundle `/path/to/my-app.aab` with keystore `/path/to/keystore.keystore`, `KEYSTORE_PASSWORD`, `KEY_ALIAS` and `KEY_PASSWORD`, use the [android-app-bundle](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/android-app-bundle#android-app-bundle) tool:

    android-app-bundle build-universal-apk \
        --pattern 'path/to/my-app.aab' \
        --ks /path/to/keystore.keystore \
        --ks-pass KEYSTORE_PASSWORD \
        --ks-key-alias KEY_ALIAS \
        --key-pass KEY_PASSWORD

{{<notebox>}}
Alternatively to entering `ISSUER_ID`, `KEY_IDENTIFIER`, `PRIVATE_KEY`, `CERTIFICATE_PASSWORD`,  `KEYSTORE_PASSWORD`, `KEY_PASSWORD` in plaintext, it may also be specified using an `@env:` prefix followed by an environment variable name, or `@file:` prefix followed by a path to the file containing the value. Example: `@env:<variable>` uses the value in the environment variable named `<variable>`, and `@file:<file_path>` uses the value from file at `<file_path>`.

Please refer to [documentation](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs#cli-tools) for more details.
{{</notebox>}}

## Generate a changelog text from Git history

To generate a changelog text from Git history, use the [git-changelog](https://github.com/codemagic-ci-cd/cli-tools/tree/master/docs/git-changelog#git-changelog) tool. For example, to generate a changelog to `CHANGELOG` file starting from the previous tag, use:

    git-changelog generate --previous-commit `git rev-list --tags --skip=1  --max-count=1` > CHANGELOG

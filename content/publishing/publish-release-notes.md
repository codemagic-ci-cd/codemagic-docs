---
description: How to publish build release notes using the Flutter workflow editor
title: Passing release notes
weight: 9
---

Create custom release notes file(s) to notify users of the changes as you publish a new version of your app.

Release notes can be published to:

* **email**. The release notes will be included in the publishing email of a successful build if you have the publishing configured in **App settings > Notifications > Email**.
* **Slack**. The release notes will be included in the Slack notification of a successful build if you have the publishing configured in **App settings > Notifications > Slack**.
* **App Store Connect**. The release notes will be published to App Store Connect if you have the publishing configured in **App settings > Distribution > App Store Connect**.
* **Google Play**. The release notes will be published to Google Play Console if you have the publishing configured in **App settings > Distribution > Google Play**.

## Setting up release notes

There are three supported options to set up release notes:

1. Create a `release_notes.txt` file and add it to the project working directory, which is either the repository root directory or the **Project path** specified in the **Build** section in your workflow settings. Codemagic will fetch the content of that file and publish it with the build.
    * For email and Slack it will be published as is.
    * For Google Play it will be published under `en-US` language localization code.

{{<notebox>}}
For App Store Connect, supported languages and codes are listed [here](https://developer.apple.com/documentation/appstoreconnectapi/betabuildlocalizationcreaterequest/data/attributes). For Google Play Console, supported languages and codes are listed [here](https://support.google.com/googleplay/android-developer/table/4419860?hl=en).
{{</notebox>}}

2. Create a `release_notes_<language_localization_code>.txt` file for every language used, e.g. `release_notes_en-GB.txt`, `release_notes_it.txt`, and add them to the project working directory, which is either the repository root directory or the **Project path** specified in the **Build** section in your workflow settings.
    * Release notes with `en-US` language code will be published to email and Slack in case file with `en-US` language code exists. If not, the first found release notes will be published.
    * For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.

3. Create a `release_notes.json` file with the following content:

    ```json
    [
        {
            "language": "en-GB",
            "text": "British English release notes text"
        },
        {
            "language": "en-US",
            "text": "The US English release notes text"
        }
    ]
    ```

    Add this file to the project working directory, which is either the repository root directory or the **Project path** specified in the **Build** section in your workflow settings. Notes with missing `language` or `text` fields will not be taken into account.

    * Release notes with `en-US` language code will be published to email and Slack, given that a file with `en-US` language code exists. If not, the first release notes will be published.
    * For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.

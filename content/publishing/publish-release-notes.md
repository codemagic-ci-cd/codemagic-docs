---
description: How to publish build release notes using the Flutter workflow editor
title: Publish release notes
weight: 9
---

Create custom release notes file(s) to notify users of the changes as you publish a new version of your app.

Release notes can be published to:

* **email**. The release notes will be included in the publishing email of a successful build if you have the publishing configured in **App settings > Publish > Email**.
* **Slack**. The release notes will be included in the Slack notification of a successful build if you have the publishing configured in **App settings > Publish > Slack**.
* **GitHub Releases**. The release notes will be published to a release if you have the publishing configured in **App settings > Publish > GitHub releases**.
* **Google Play**. The release notes will be published to Google Play Console if you have the publishing configured in **App settings > Publish > Google Play**.

## Setting up release notes

There are three supported options to set up release notes:

1. Create a `release_notes.txt` file and add it to the root of your project. When it's present, Codemagic will fetch the content of that file and publish it with the build.
    * For email, Slack and GitHub releases, it will be published as is.
    * For Google Play it will be published under `en-US` language localization code.

{{<notebox>}}
Language localization code is referred to a BCP-47 language tag as used in Google Play Services.
{{</notebox>}}

2. Create a `release_notes_<language_localization_code>.txt` file for every language used, e.g. `release_notes_en-GB.txt`, `release_notes_it.txt`, and add them to the root of your project.
    * Release notes with `en-US` language code will be published to email, Slack and GitHub releases in case file with `en-US` language code exists. If not, the first found release notes will be published.
    * For Google Play, all the release notes will be published with corresponding language codes.

3. Create a `release_notes.json` file with the following content:

    ```json
    [
        {
            "language": string, # Language localization code (a BCP-47 language tag)
            "text": string      # The text in the given language
        },
        ...
    ]
    ```

    Add this file to the root of your project. Notes with missing `language` or `text` fields will not be taken into account. Please refer to the [list of supported languages](https://support.google.com/googleplay/android-developer/table/4419860?hl=en).

    * Release notes with `en-US` language code will be published to email, Slack and GitHub releases, given that a file with `en-US` language code exists. If not, the first release notes will be published.
    * For Google Play, all the found release notes will be published with corresponding language codes.

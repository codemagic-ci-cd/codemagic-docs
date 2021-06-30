---
description: How to pass release notes with successful builds
title: Passing release notes
weight: 2
---

Create custom release notes file(s) to notify users of the changes as you publish a new version of your app.

Release notes can be published to:

* **email**. The release notes will be included in the publishing email of a successful build if you have publishing to email configured in the `publishing` section of your workflow.
* **Slack**. The release notes will be included in the Slack notification of a successful build if you have publishing to Slack configured in the `publishing` section of your workflow.
* **App Store Connect**. The release notes will be published to the What to Test field in TestFlight if you have publishing to App Store Connect configured in the `publishing` section of your workflow.
* **Google Play**. The release notes will be published to Google Play Console if you have publishing to Google Play configured in the `publishing` section of your workflow.

## Setting up release notes

There are three supported options to set up release notes:

1. Create a `release_notes.txt` file and add it to the root of your project. When it's present, Codemagic will fetch the content of that file and publish it with the build.
    * For email and Slack it will be published as is.
    * For Google Play it will be published under `en-US` language localization code.

{{<notebox>}}
For App Store Connect supported languages and codes are listed [here](https://developer.apple.com/documentation/appstoreconnectapi/betabuildlocalizationcreaterequest/data/attributes). For Google Play Console supported languages and codes are listed [here](https://support.google.com/googleplay/android-developer/table/4419860?hl=en).
{{</notebox>}}

2. Create a `release_notes_<language_localization_code>.txt` file for every language used, e.g. `release_notes_en-GB.txt`, `release_notes_it.txt`, and add them to the root of your project.
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
            "text": "The US Engish release notes text"
        }
    ]
    ```

    Add this file to the root of your project. Notes with missing `language` or `text` fields will not be taken into account.

    * Release notes with `en-US` language code will be published to email and Slack, given that a file with `en-US` language code exists. If not, the first release notes will be published.
    * For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.

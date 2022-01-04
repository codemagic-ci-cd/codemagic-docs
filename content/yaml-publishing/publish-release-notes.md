---
description: How to pass release notes with successful builds
title: Passing release notes
weight: 2
aliases: /publishing-yaml/publish-release-notes
---

Create custom release notes file(s) to notify users of the changes as you publish a new version of your app.

Release notes can be published to:

* **email**. The release notes will be included in the publishing email of a successful build if you have publishing to email configured in the `publishing` section of your workflow.
* **Slack**. The release notes will be included in the Slack notification of a successful build if you have publishing to Slack configured in the `publishing` section of your workflow.
* **App Store Connect**. The release notes will be published to the "What to Test" field in the Test Details section in TestFlight if you have publishing to App Store Connect configured in the `publishing` section of your workflow. In case App Store review submission is enabled, then the release notes will be also used to fill in the "What's New" field in the Version Information section in App Store.
Note that release notes are uploaded in the [post-processing step](/yaml-publishing/distribution#post-processing-of-app-store-connect-distribution).
* **Google Play**. The release notes will be published to Google Play Console if you have publishing to Google Play configured in the `publishing` section of your workflow.
* **Firebase App Distribution**. The release notes will be published to Firebase console if you have publishing to Firebase App Distribution configured in the `publishing` section of your workflow.

## Setting up release notes

There are three supported options to set up release notes:

1. Create a `release_notes.txt` or `release_notes.json` file for Play Store and a `release_notes.json` file for App Store Connect. If your workflow is publishing to both the Play Store and the App Store then it is recommended that you use JSON. You should then add it to your project working directory, which is either the repository root directory or the `working_directory` specified in the root of your workflow configuration. Codemagic will fetch the content of that file and publish it with the build.
    * For email, Slack and Firebase it will be published as is.
    * For Google Play it will be published under `en-US` language localization code.

{{<notebox>}}
For App Store Connect supported languages and codes are listed [here](https://developer.apple.com/documentation/appstoreconnectapi/betabuildlocalizationcreaterequest/data/attributes). For Google Play Console supported languages and codes are listed [here](https://support.google.com/googleplay/android-developer/table/4419860?hl=en).
{{</notebox>}}

2. Create a `release_notes_<language_localization_code>.txt` file for every language used, e.g. `release_notes_en-GB.txt`, `release_notes_it.txt`, and add them to your project working directory, which is either the repository root directory or the `working_directory` specified in the root of your workflow configuration.
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

   Add this file to your project working directory, which is either the repository root directory or the `working_directory` specified in the root of your workflow configuration. Notes with missing `language` or `text` fields will not be taken into account.

    * Release notes with `en-US` language code will be published to email, Slack and Firebase, given that a file with `en-US` language code exists. If not, the first release notes will be published.
    * For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.
    * For App Store review submission it is possible to also configure Promotional Text, Description, Keywords, Support URL and Marketing URL in addition to What's New notes via `release_notes.json` file. In order to do so, those fields need to be defined as follows:
    ```json
    [
        {
            "language": "en-GB",
            "text": "British English release notes text",
            "description": "Updated app description", // Optional for App Store review submission
            "keywords": "keyword, other keyword", // Optional for App Store review submission
            "promotional_text": "Promotional text", // Optional for App Store review submission
            "marketing_url": "https://example.com", // Optional for App Store review submission
            "support_url": "https://example.com" // Optional for App Store review submission
        }
    ]
    ```

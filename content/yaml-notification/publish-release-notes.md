---
description: How to publish release notes with successful builds
title: Release notes
weight: 4
aliases: 
  - /publishing-yaml/publish-release-notes
  - /yaml-publishin/publish-release-notes
---

Create custom release notes file(s) to notify users of the changes as you publish a new version of your app.

Release notes can be published to:

* **email**. The release notes will be included in the publishing email of a successful build if you have publishing to email configured in the `publishing` section of your workflow.
* **Slack**. The release notes will be included in the Slack notification of a successful build if you have publishing to Slack configured in the `publishing` section of your workflow.
* **App Store Connect**. The release notes will be published to the _"What to Test"_ field in the Test Details section in TestFlight if you have publishing to App Store Connect configured in the `publishing` section of your workflow. In case App Store review submission is enabled, then the release notes will be also used to fill in the _"What's New"_ field in the _Version Information_ section in App Store.

  Note that release notes are uploaded in the [post-processing step](/yaml-publishing/app-store-connect/#post-processing-of-app-store-connect-distribution-magic-actions).

* **Google Play**. The release notes will be published to Google Play Console if you have publishing to Google Play configured in the `publishing` section of your workflow.
* **Firebase App Distribution**. The release notes will be published to Firebase console if you have publishing to Firebase App Distribution configured in the `publishing` section of your workflow.



## Setting up release notes

{{<notebox>}}
**Warning**:
 Apple does not support `<` and `>` symbols in `release_notes` file. Uploading a file with such symbols will cause the App Store Connect API to return `409` error and description that text contains invalid characters.
{{</notebox>}}

There are three supported options to set up release notes:

#### Single file

1. Create a `release_notes.txt` or `release_notes.json` file for **Play Store** and a `release_notes.json` file for **App Store Connect**. If your workflow is publishing to both the Play Store and the App Store then it is recommended that you use JSON.

2. Add the file to your project working directory, which is either the repository root directory or the `working_directory` specified in the root of your workflow configuration. Codemagic will fetch the content of that file and publish it with the build.

    * For email, Slack and Firebase it will be published as is.
    * For Google Play it will be published under `en-US` language localization code.

#### One file per language used

{{<notebox>}}
**App Store Connect** supported languages and codes are listed [here](https://developer.apple.com/documentation/appstoreconnectapi/betabuildlocalizationcreaterequest/data/attributes). 

**Google Play Console** supported languages and codes are listed [here](https://support.google.com/googleplay/android-developer/table/4419860?hl=en).
{{</notebox>}}

1. Create a `release_notes_<language_localization_code>.txt` file for every language used, e.g. `release_notes_en-GB.txt`, `release_notes_it.txt`.

2. Add all of the files to your project working directory, which is either the repository root directory or the `working_directory` specified in the root of your workflow configuration.

   * Release notes with `en-US` language code will be published to email and Slack in case file with `en-US` language code exists. If not, the first found release notes file will be published.
   * For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.

#### Single file for multiple lanuguages

1. Create a `release_notes.json` file containing the release notes in all supported lanuguages:

{{< highlight json "style=paraiso-dark">}}
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
{{< /highlight >}}


2. Add this file to your project working directory, which is either the repository root directory or the `working_directory` specified in the root of your workflow configuration. Notes with missing `language` or `text` fields will not be taken into account.

    * Release notes with `en-US` language code will be published to email, Slack and Firebase, given that an entry with `en-US` language code exists. If not, the first release notes will be published.
    
    * For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.
    
    * For App Store review submission it is possible to also configure _Promotional Text, Description, Keywords, Support URL_ and _Marketing URL- in addition to _What's New_ notes via `release_notes.json` file. In order to do so, those fields need to be defined as follows:

{{< highlight json "style=paraiso-dark">}}
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
{{< /highlight >}}


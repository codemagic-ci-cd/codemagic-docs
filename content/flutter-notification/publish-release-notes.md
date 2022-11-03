---
description: How to publish build release notes using the Flutter workflow editor
title: Release notes publishing with Flutter workflow editor
linkTitle: Release notes
weight: 12
aliases: 
  - /publishing/publish-release-notes
  - /flutter-publishing/publish-release-notes
---

Create custom release notes to notify users of the changes as you publish a new version of your app.

Release notes can be published to:

- **email**. The release notes will be included in the publishing email of a successful build if you have publishing to email configured in **App settings > Notifications > Email**.
- **Slack**. The release notes will be included in the Slack notification of a successful build if you have publishing to Slack configured in **App settings > Notifications > Slack**.
- **App Store Connect**. The release notes will be published to App Store Connect if you have publishing to App Store Connect configured in **App settings > Distribution > App Store Connect**.
- **Google Play**. The release notes will be published to Google Play Console if you have publishing to Google Play configured in **App settings > Distribution > Google Play**.
- **Firebase App Distribution**. The release notes will be published to Firebase console if you have publishing to Firebase App Distribution configured in **App settings > Distribution > Firebase App Distribution**.

## Setting up release notes

There are three supported options to set up release notes:

1. Create a `release_notes.txt` file and add it to the project working directory, which is either the repository root directory or the **Project path** specified in the **Build** section in your workflow settings. Codemagic will fetch the content of that file and publish it with the build when it's present.
   - For email, Slack and Firebase App Distribution, the release notes will be published as is.
   - For Google Play, the release notes will be published under the `en-US` language localization code.

{{<notebox>}}
**Note:** For App Store Connect, supported languages and codes are listed [here](https://developer.apple.com/documentation/appstoreconnectapi/betabuildlocalizationcreaterequest/data/attributes). For Google Play Console, supported languages and codes are listed [here](https://support.google.com/googleplay/android-developer/table/4419860?hl=en).
{{</notebox>}}

2. Create a `release_notes_<language_localization_code>.txt` file for every language used, e.g. `release_notes_en-GB.txt`, `release_notes_it.txt`, and add them to the project working directory, which is either the repository root directory or the **Project path** specified in the **Build** section in your workflow settings.

   - Release notes with the `en-US` language code will be published to email, Slack and Firebase App Distribution in case a file with the `en-US` language code exists. If not, the first found release notes will be published.
   - For Google Play, all the release notes will be published with corresponding language codes.
   - For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.

3. Create a `release_notes.json` file with the following content:

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

   Add this file to the project working directory, which is either the repository root directory or the **Project path** specified in the **Build** section in your workflow settings. Notes with missing `language` or `text` fields will not be taken into account.

   - Release notes with the `en-US` language code will be published to email, Slack and Firebase App Distribution, given that a file with the `en-US` language code exists. If not, the first found release notes will be published.
   - For both App Store Connect and Google Play, only the release notes with the supported language codes will be published, omitting language codes that are not supported.

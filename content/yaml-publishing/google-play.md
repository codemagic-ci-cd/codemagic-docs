---
title: Google Play
description: How to deploy an app to Google Play using codemagic.yaml
weight: 2
---


{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**. If your workflow is configured with **Flutter workflow editor** please go to [Publishing to Google Play using Flutter workflow editor](../publishing/publishing-to-google-play).
{{</notebox>}}

### Distribution to Google Play

Codemagic enables you to automatically publish your app either to one of the predefined tracks (`internal`- publish for internal testing and QA, `alpha`- publish for testing with a small group of trusted users, `beta`- publish for testing to a wider set of users and `production`- release the app to production) on Google Play or to your custom closed testing tracks. In order to do so, you will need to [set up a service account in Google Play Console](../knowledge-base/google-play-api/) and save the contents of the `JSON` key file as a [secure environment variable](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) in application or team settings.

If your application supports [in-app updates](https://developer.android.com/guide/playcore/in-app-updates), Codemagic allows setting the update priority. Otherwise, `in_app_update_priority` can be omitted or set to `0`.

In addition, Codemagic supports [staged releases](https://support.google.com/googleplay/android-developer/answer/6346149?hl=en), allowing users to choose which fraction of the testers or users get access to the application. To release to everyone, omit `rollout_fraction` from codemagic.yaml.

```yaml
publishing:
  google_play: # For Android app
    credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS # Contents of the JSON key file for Google Play service account saved as a secure environment variable
    track: alpha # Name of the track: internal, alpha, beta, production, internal app sharing, or your custom track name
    in_app_update_priority: 3 # Optional. Priority of the release (only set if in-app updates are supported): integer in range [0, 5]
    rollout_fraction: 0.25 # Optional. Rollout fraction (set only if releasing to a fraction of users): value between (0, 1)
    changes_not_sent_for_review: true # Optional boolean. To be used ONLY if your app cannot be sent for review automatically *
    submit_as_draft: true # Optional boolean. Publish artifacts under a draft release. Can not be used together with rollout_fraction. Defaults to false
```

{{<notebox>}} \* The field `changes_not_sent_for_review` is required if you are getting the next error:

`Changes cannot be sent for review automatically. Please set the query parameter changesNotSentForReview to true. Once committed, the changes in this edit can be sent for review from the Google Play Console UI.`

If your changes are sent to review automatically, but the field is still set to `true`, you will get the next error:

`Changes are sent for review automatically. The query parameter changesNotSentForReview must not be set.`
{{</notebox>}}

If you are getting a 400 error related to the app being in draft status, either enable publishing to draft by setting the value of **submit_as_draft** to **true** or promote the draft build up by a level to one of the testing tracks. Play Console will show you how to do this. You'll need to go through the steps, fill out questionnaires, upload various screenshots, and then after approval, you can move to the Alpha testing track, and Codemagic will successfully publish.

If you are getting an error related to permissions, then it is likely an issue related to the service account that has been created. Go through the steps of creating a service account once more carefully see how to [set up a service account](../knowledge-base/google-play-api/).

{{<notebox>}}
You can override the publishing track specified in the configuration file using the environment variable `GOOGLE_PLAY_TRACK`. This is useful if you're starting your builds via [Codemagic API](../rest-api/overview/) and want to build different configurations without editing the configuration file.
{{</notebox>}}

{{<notebox>}}
To use different Google Play Console accounts for publishing your Android apps, set up separate workflows. 
{{</notebox>}}

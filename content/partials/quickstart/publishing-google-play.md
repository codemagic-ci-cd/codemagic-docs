---
title: Publishing to Google Play
---

Publishing apps to Google Play requires you to set up a service account in Google Play Console and save the content of the `JSON` key file to a secure environment variable as explained above in **Android Build Versioning** steps 1-5.
Configuring Google Play publishing is simple as you only need to provide credentials and choose the desired track. If the app is in `draft` status, please also include the `submit_as_draft: true` or promote the app status in Google Play.
{{< highlight yaml "style=paraiso-dark">}}
react-native-android:
  # ... 
  publishing:
    # ...
    google_play:
      credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
      track: internal
      submit_as_draft: true
{{< /highlight >}}

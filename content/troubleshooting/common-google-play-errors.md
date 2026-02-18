---
title: Common Google Play errors
description: Troubleshooting common Google Play errors
weight: 4
---

Codemagic enables you to automatically publish your app to the internal, alpha, beta, production or custom tracks on Google Play. While publishing to Google play you may encounter errors if the application does not meet the release criteria. You can see the explanations of some of the common errors:

### Code: 403, The caller does not have permission. status: PERMISSION_DENIED

###### Description
This could be due to an invalid JSON file or permission issues with the service account.

{{<collapsible title="Solution" id="permission-denied-403-solution" >}}
###### Solution
Please make sure you have done the following:
   1. Created a service account in the Google Play console
   2. Set the service account access to **Service Account User**
   3. Created a JSON private key
   4. Added the JSON key to Codemagic
   5. Navigated to your Google Play Console API access and granted access to the service account
   6. Given the service account access to your application
   7. Invited users to the service account
   
   Checkout [this guide](https://docs.codemagic.io/yaml-publishing/google-play/) for codemagic.yaml or this guide for [Workflow editor](../flutter-publishing/publishing-to-google-play).

{{< /collapsible >}}

### The current user has insufficient permissions to perform the requested operation. status: PERMISSION_DENIED

###### Description
This error may have caused due to Account permission issues.

{{<collapsible title="Solution" id="insufficient-permissions-solution" >}}
###### Solution
- Try setting admin access for Account permissions on google play console. 
- After granting access, Google may take 24-48 hours to propagate all access rights for all APIs or new users.

{{< /collapsible >}}

### Google Play failed to upload artifacts. This Edit has been deleted.

###### Description
This error usually occurs when there are parallel builds running, as in 2 builds triggered at the same time.

{{<collapsible title="Solution" id="edit-deleted-solution" >}}
###### Solution
Use set `cancel_previous_builds: true` in your triggers, but it doesn't work when builds are triggered using API.

{{< /collapsible >}}

### Cannot replace a bundle of version code X with an APK.

###### Description
This usually indicates that you have already published a .aab with version code 'x', and now you are trying to publish the .aab with the same version code.

{{<collapsible title="Solution" id="cannot-replace-bundle-solution" >}}
###### Solution
Try to upload .aab by incrementing the version code.

{{< /collapsible >}}

### APK specifies a version code that has already been used

###### Description
This error is possible when your version code is the same as the `.aab` already uploaded on google play.

{{<collapsible title="Solution" id="version-code-already-used-solution" >}}
###### Solution
Check version and version code.

{{< /collapsible >}}

### Cannot update a published APK

###### Description
If an app has already been sent to a specific track, you cannot re-upload it. This error is possible when your version or version code is the same as the apk/aab already uploaded on google play.

{{<collapsible title="Solution" id="cannot-update-published-apk-solution" >}}
###### Solution
You can change its track or increment the version code.

{{< /collapsible >}}

### Your scoped storage permission declaration needs to be updated

###### Description
Google requires you to declare your [storage permissions](https://developer.android.com/about/versions/11/privacy/storage).

{{<collapsible title="Solution" id="scoped-storage-permission-solution" >}}
###### Solution
You will have to update your app accordingly to be able to publish to Google Play Store.

{{< /collapsible >}}

### You cannot rollout this release because it does not allow any existing users to upgrade to the newly added APKs

###### Description
The error message is because your new APK has a lower version code than the previous APK. Newer APKs must always have a higher version code than the previous version.

{{<collapsible title="Solution" id="cannot-rollout-release-solution" >}}
###### Solution
Check your version code and upgrade it to a higher version code.

{{< /collapsible >}}

### Package not found: com.xxxxx.app

###### Description
The error 'Package not found' means that an application with the package name from the artifact generated during the builds doesn't exist in your Google Play account.

{{<collapsible title="Causes and solutions" id="package-not-found-solution" >}}
###### Cause
This happens when either, you haven't uploaded the first artifact to your Google Play application manually, or the generated artifact package name has some suffixes or changes and doesn't correspond to the one in Google Play.
###### Solution
Ensure the package name matches exactly with the one in Google Play, or upload the first artifact manually to create the application.

{{< /collapsible >}}

### APK has not been signed with the upload certificate

###### Description
The APK was not signed with the correct upload certificate.

{{<collapsible title="Solution" id="apk-not-signed-solution" >}}
###### Solution
Check code signing. Use the same keystore while uploading your artifacts.

{{< /collapsible >}}

### For uploading an AppBundle you must be enrolled in Play Signing

###### Description
As per the error, you need to upload your keystore to [Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756?visit_id=637769761748201384-2647523405&rd=1).

{{<collapsible title="Solution" id="play-signing-enrollment-solution" >}}
###### Solution
Enroll your app into app signing by Google Play to have Google sign the .aab that are generated from the app bundle during installation.

{{< /collapsible >}}

### You uploaded an APK or Android App Bundle that was signed in debug mode

###### Description
You need to sign your APK or Android App Bundle in **release mode** instead of debug mode.

{{<collapsible title="Solution" id="debug-mode-signing-solution" >}}
###### Solution
Set your signing configuration in `build.gradle` in release mode. Refer to [this](../code-signing/android-code-signing/#option-2-configure-signing-using-environment-variables) for more information.

{{< /collapsible >}}

### APKs are not allowed for this application

###### Description
It is no longer possible to submit new apps to Google Play using the APK format. Instead, generate Android App Bundles(.aab). Check [this](https://android-developers.googleblog.com/2021/06/the-future-of-android-app-bundles-is.html) out.

{{<collapsible title="Solution" id="apks-not-allowed-solution" >}}
###### Solution
You should use `./gradlew bundleRelease` to generate .aab file. And don't forget to mention the artifact path `app/build/outputs/bundle/**/*.aab` in the `artifacts:` section in your codemagic.yaml.

{{< /collapsible >}}

### Only releases with status draft may be created on draft app

###### Description
`400` error is related to the app being in draft status. The very first version of the app must be added to Google Play manually.

{{<collapsible title="Solution" id="draft-app-solution" >}}
###### Solution
In case you want to upload the artifacts generated in the build to Google Play as a draft release, select **Submit release as draft** in the workflow editor or `submit_as_draft: true` in your yaml configuration.

{{< /collapsible >}}

### changesNotSentForReview Errors

###### Description
changesNotSentForReview means (from Google Play API docs): Indicates that the changes in this edit will not be reviewed until they are explicitly sent for review from the Google Play Console UI. These changes will be added to any other changes that are not yet sent for review.

{{<collapsible title="Solution" id="changes-not-sent-for-review-solution" >}}
###### Solution
- Beware, this parameter should not always be true.
- If an app/track is in a "rejected" state, then you need to submit the app with changesNotSentForReview: true, otherwise, you should send without specifying changesNotSentForReview(or setting it to false). 

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  google_play:
    credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
    track: internal
    # Optional boolean To be used ONLY if your app cannot be sent for review automatically
    changes_not_sent_for_review: true
{{< /highlight >}}

- If you are getting a **400 error** related to the app being in draft status, either enable publishing to draft by setting the value of **submit_as_draft** to **true** or promote the draft build up by a level to one of the testing tracks. Play Console will show you how to do this. You'll need to go through the steps, fill out questionnaires, upload various screenshots, and then after approval, you can move to the Alpha testing track, and Codemagic will successfully publish.
- Depending on your app's update status, it may not be sent for review automatically. 
- If your changes are sent to review automatically, but the field is still set to `true`, you may get the error _**Changes are sent for review automatically. The query parameter changesNotSentForReview must not be set.**_
- Also, it might be that the actual cause of the error is getting swallowed and is surfaced by changesNotSentForReview error. In that case, try to re-run it by adding `--stacktrace` that will print out a full stack trace.
- Check [this](https://docs.codemagic.io/yaml-publishing/google-play/) out.

{{< /collapsible >}}

### Error 502 (Server Error)

###### Description
`5xx` errors are from the Google Play servers.

{{<collapsible title="Solution" id="error-502-solution" >}}
###### Solution
The solution is to try again after some time.

{{< /collapsible >}}


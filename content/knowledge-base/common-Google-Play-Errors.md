---
title: Common Google Play Errors
weight: 2
---


## Troubleshooting Common Google Play Upload Errors

Codemagic enables you to automatically publish your app to the internal, alpha, beta and production tracks on Google Play. While publishing to Google play you may encounter errors if the application does not meet the release criteria. You can see the explanations of some of the common errors:

- `Invalid JSON content from response: "code": 403, "message": "The caller does not have permission", "status": "PERMISSION_DENIED"`
   - This could be due to Invalid JSON File or permission issues with service account. Please make sure you have properly set the following:
   1. Create Service Account
   2. Set access to the editor
   3. Create JSON key
   4. Add the JSON key to Codemagic
   5. Navigate to your Google Play Console API access and grant access to the service account
   6. Give the service account access to your application
   7. Invite users to the Service account
   Checkout [this guide](../knowledge-base/google-services-authentication/#google-play) for detailed explanation.

- `The current user has insufficient permissions to perform the requested operation. "status": "PERMISSION_DENIED"`
   - This error may have caused due to Account permission issues. Try setting admin access for Account permissions on google play console. 
   - After granting access, Google may take 24-48 hours to propagate all access rights for all APIs or new users.

- `Google Play failed to upload artefacts. This Edit has been deleted.`
   - This error usually occurs when there are parallel builds running, as in 2 builds triggered at the same time. 
   - Solution is to use set `cancel_previous_builds: true` in your triggers, but it doesn't work when builds are triggered using API.

- `Cannot replace a bundle of version code X with an APK.`
   - Probably it means that you have already published an aab with version code X, and now you are trying to publish an apk artifact with the same version code.
   - Try to upload .aab by incrementing the version code.

- `APK specifies a version code that has already been used`
   - Check version and version code. This error is possible when your version code is the same as the apk/aab already uploaded on google play.

- `Cannot update a published APK`
   - If an app has already been sent to a specific track, you cannot re-upload it. - You can change its track or increment the version code.
   - This error is possible when your version or version code is the same as the apk/aab already uploaded on google play.

- `Your scoped storage permission declaration needs to be updated`
   - It looks like Google has made updates that required you to declare your [storage permissions](https://developer.android.com/about/versions/11/privacy/storagehttps://www.xda-developers.com/android-11-all-files-access-permission-form/)
   - You will have to update your app accordingly to be able to publish to Google Play Store.

- `Package not found: com.xxxxx.app.`
   - The error Package not found means that an application with the package name from the artifact generated during the builds doesn't exist in your Google Play account.
   - This happens when either, you haven't uploaded the first artifact to your Google Play application manually, or the generated artifact package name has some suffixes or changes and doesn't correspond to the one in Google Play.

- `APK has not been signed with the upload certificate`
  - Check code signing. Use the same keystore while uploading your artifacts.

- `For uploading an AppBundle you must be enrolled in Play Signing`
  - As per the error, You need to upload your keystore to [Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756?visit_id=637769761748201384-2647523405&rd=1)
  - Enroll your app into app signing by Google Play to have Google sign the .aab that are generated from the app bundle during installation.

- `You uploaded an APK or Android App Bundle that was signed in debug mode`
  - You need to sign your APK or Android App Bundle in release mode instead of debug mode.
  - Set your signing configuration in `build.gradle` in release mode. Refer [this](../code-signing/android-code-signing/#option-2-configure-signing-using-environment-variables) for more information.

- `APKs are not allowed for this application`
   - APK is not allowed by Google anymore. Instead generate Android App Bundles(.aab). Check [this](https://android-developers.googleblog.com/2021/06/the-future-of-android-app-bundles-is.html) out.
   - You should use `./gradlew bundleRelease` to generate .aab file. And don't forget to mention the artifact path `app/build/outputs/bundle/**/*.aab` in the `artifacts:` sention in your yaml.

- `Only releases with status draft may be created on draft app` 
   - `400` error related to the app being in draft status.
   - The very first version of the app must be added to Google Play manually. 
   - In case you want to upload the artifacts generated in the build to Google Play as a draft release, select Submit release as draft in workflow editor or `submit_as_draft: true` in yaml configuration.

- `changesNotSentForReview` Errors
  - changesNotSentForReview means (from Google Play API docs): Indicates that the changes in this edit will not be reviewed until they are explicitly sent for review from the Google Play Console UI. These changes will be added to any other changes that are not yet sent for review.
  - Beware, this parameter should not always be true.
  - If an app/track is in a "rejected" state, then you need to submit the app with changesNotSentForReview: true, otherwise, you should send without specifying changesNotSentForReview(or setting it to false)Changes are sent for review automatically. 
  - Usually, If you are getting a 400 error related to the app being in draft status, either enable publishing to draft by setting the value of `submit_as_draft` to true or promote the draft build up by a level to one of the testing tracks.
  - Depending on your app's update status, it may not be sent for review automatically. 
  - Also, it might be that the actual cause of the error is getting swallowed and is surfaced by changesNotSentForReview error. In that case, try to re-run it by adding `--stacktrace` that will print out a full stack trace.
  - Check [this](https://docs.codemagic.io/yaml-publishing/distribution/#google-play) out.

- `Error 502 (Server Error)`
  - Well `5xx` errors are server errors that Codemagic/or the user don’t really have control over in most cases.
  - This error seems to be an issue on Google Play side. 
  - Here the solution is to try again after sometime.


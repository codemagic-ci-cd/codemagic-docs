---
---

One very useful method of calculating the code version is to use Codemagic command line tools to get the latest build number from Google Play and increment it by one.

You can find the full sample project with the instructions on alternative ways to perform Android build versioning [in our repository](https://github.com/codemagic-ci-cd/android-versioning-example).


The prerequisite is a valid **Google Cloud Service Account**. Plese follow these steps:
1. Go to [this guide](../knowledge-base/google-services-authentication.md) and complete the steps in the **Google Play** section.
2. Skip to the **Creating a service account** section in the same guide and complete those steps also.
3. You now have a `JSON` file with the credentials.
4. Open Codemagic UI and create a new Environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`.
5. Paste the content of the downloaded `JSON` file in the **_Value_** field, set the group name (e.g. **google_play**) and make sure the **Secure** option is checked.
---
6. Add the **google_play** variable group to the `codemagic.yaml`
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-ios:
    # ....
    environment:
      groups:
        - keystore_credentials
        - google_play
{{< /highlight >}}
7. Modify the build script to calculate the build number and use it as gradlew arguments.
{{< highlight yaml "style=paraiso-dark">}}
scripts:
    # ....
  - name: Build Android release
    script: | 
      LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name '$PACKAGE_NAME')
      if [ -z LATEST_BUILD_NUMBER ]; then
        # fallback in case no build number was found from Google Play.
        # Alternatively, you can `exit 1` to fail the build
        # BUILD_NUMBER is a Codemagic built-in variable tracking the number of times this workflow has been built
          UPDATED_BUILD_NUMBER=$BUILD_NUMBER
      else
          UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
      fi
      cd android && ./gradlew bundleRelease -PversionCode=$UPDATED_BUILD_NUMBER -PversionName=1.0.$UPDATED_BUILD_NUMBER
{{< /highlight >}}
8. Modify the `android/app/build.gradle` file to get the build number values and apply them:
{{< highlight kotlin "style=paraiso-dark">}}

// get version code from the specified property argument `-PversionCode` during the build call
def getMyVersionCode = { ->
    return project.hasProperty('versionCode') ? versionCode.toInteger() : -1
}

// get version name from the specified property argument `-PversionName` during the build call
def getMyVersionName = { ->
    return project.hasProperty('versionName') ? versionName : "1.0"
}

....
android {
    ....
    defaultConfig {
        ...
        versionCode getMyVersionCode()
        versionName getMyVersionName()
{{< /highlight >}}

One very useful method of calculating the code version is to use Codemagic command line tools to get the latest build number from Google Play and increment it by one.

You can find the full sample project with the instructions on alternative ways to perform Android build versioning [in our repository](https://github.com/codemagic-ci-cd/android-versioning-example).


The prerequisite is a valid **Google Cloud Service Account**. Please follow these steps:
1. Go to [this guide](https://docs.codemagic.io/yaml-publishing/google-play/) and complete the steps in the **Google Play** section.
2. Skip to the **Creating a service account** section in the same guide and complete those steps also.
3. You now have a `JSON` file with the credentials.
4. Open Codemagic UI and create a new Environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`.
5. Paste the content of the downloaded `JSON` file in the **_Value_** field, set the group name (e.g. **google_play**) and make sure the **Secure** option is checked.
---
6. Add the **google_play** variable group to the `codemagic.yaml`
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow-id:
    # ....
    environment:
      groups:
        - google_play
{{< /highlight >}}
7. Modify the build script to calculate the build number and use it as gradlew arguments.
{{< highlight yaml "style=paraiso-dark">}}
scripts:
    # ....
  - name: Build Android release
    script: | 
      LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")
      if [ -z $LATEST_GOOGLE_PLAY_BUILD_NUMBER ]; then
        # fallback in case no build number was found from Google Play.
        # Alternatively, you can `exit 1` to fail the build
        # BUILD_NUMBER is a Codemagic built-in variable tracking the number
        # of times this workflow has been built
          UPDATED_BUILD_NUMBER=$BUILD_NUMBER
      else
          UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))
      fi
      ./gradlew bundleRelease \
          -PversionCode=$UPDATED_BUILD_NUMBER \
          -PversionName=1.0.$UPDATED_BUILD_NUMBER
{{< /highlight >}}
8. Modify the `androidApp/build.gradle.kts` file to get the build number values and apply them:
{{< highlight kotlin "style=paraiso-dark">}}

val latestGooglePlayBuildNumber = Integer.valueOf(System.getenv("LATEST_GOOGLE_PLAY_BUILD_NUMBER") ?: System.getenv("BUILD_NUMBER") ?: "0")

....
android {
    ....
    defaultConfig {
        ...
        versionCode = latestGooglePlayBuildNumber + 1
        versionName = "1.0.${latestGooglePlayBuildNumber + 1}"
{{< /highlight >}}

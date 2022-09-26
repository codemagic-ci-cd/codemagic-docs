---
title: BrowserStack integration
description: How to integrate your workflows with BrowserStack using codemagic.yaml
weight: 5
---

**BrowserStack** is a cloud-based mobile testing platform that provides the ability to test your applications on real mobile devices. BrowserStack can be used as a part of your Codemagic CI/CD pipeline to test your applications.

BrowserStack offers two testing environments: **App Live** and **App Automate**. You can submit your applications to both testing environments via Codemagic using `cURL` requests. 

You can find sample projects both for the [App Live](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/browserstack_app_live_demo_project) and the [App Automate](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/browserstack_app_automate_demo_project) options of BrowserStack in our Sample projects repository.

## Configuring BrowserStack in Codemagic
Signing up with BrowserStack is required in order to be able to get the **username** and **access token**. You can sign up for free [here](https://www.browserstack.com/).

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `BROWSERSTACK_USERNAME`.
3. Enter the required value as **_Variable value_**.
4. Enter the variable group name, e.g. **_browserstack_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the process to add the token as `BROWSERSTACK_ACCESS_TOKEN`

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - browserstack_credentials
{{< /highlight >}}



## App Live

To use **App Live** and test your **.ipa** and **.apk** artifacts directly on real devices rather than simulators, add the following script to your `codemagic.yaml file:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Submitting app to Browserstack:
      script: | 
        curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_TOKEN" -X POST "https://api-cloud.browserstack.com/app-live/upload" -F "file=@build/ios/ipa/your_app_release.ipa"
{{< /highlight >}}

{{<notebox>}}
**Note:** Make sure that you add this cURL request after building the **.ipa** and **.apk**, otherwise you cannot attach their paths to the cURL request.
{{</notebox>}}
 

## App Automate

In order to use BrowserStack **App Automate** service through Codemagic, you need to add scripts to your `codemagic.yaml` file to perform these three steps using REST API endpoints:
1. Upload your app
2. Upload test suite
3. Start testing

In order to upload test suites for android apps, you need to run `./gradlew assembleAndroidTest` in your build script. Make sure that your **app/build.gradle** file includes **Instrumentation Runner**:

{{< highlight Groovy "style=paraiso-dark">}}
  defaultConfig {
     testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
}
{{< /highlight >}}


If you are building your app in **release mode**, then you also need to build your test suite .apk in release mode by adding the following in app/build.gradle:

{{< highlight Groovy "style=paraiso-dark">}}
    testBuildType "release"
{{< /highlight >}}

Your `codemagic.yaml` file will look similar to this:
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build Android Test release
      script: | 
        cd android # change folder if necessary 
        ./gradlew assembleAndroidTest
    - name: BrowserStack upload
      script: | 
        APP_URL=$(curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_TOKEN" \
          -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
          -F "file=@android/app/build/outputs/apk/release/app-release.apk" \ 
          | jq -r '.app_url') 
    
        TEST_URL=$(curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_TOKEN" \
          -X POST "https://api-cloud.browserstack.com/app-automate/espresso/test-suite" \
          -F "file=@android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk" \
           | jq -r '.test_url')
     
        curl -X POST "https://api-cloud.browserstack.com/app-automate/espresso/build" \
          -d '{"devices": ["Google Pixel 3-9.0"], "app": "'"$APP_URL"'", "deviceLogs" : true, "testSuite": "'"$TEST_URL"'"}' \
           -H "Content-Type: application/json" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_TOKEN" 
{{< /highlight >}}



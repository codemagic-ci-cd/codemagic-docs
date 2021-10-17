---
title: BrowserStack integration
description: How to integrate your workflows with BrowserStack using codemagic.yaml
weight: 5
---

**BrowserStack** is a cloud web and mobile testing platform that provides the ability to test websites and mobile applications across on-demand browsers, operating systems and real mobile devices.BrowserStack can be used as part of CI/CD pipeline and test applications.


## Create a BrowserStack account:

Signing up with BrowserStack is required in order to be able to get the username and access token. You can sign up for free [here](https://www.browserstack.com/).

## Configuring **App Live** and **App Automat** with Codemagic:

BrowseStack offers two testing environments, **App Live** and **App Automate**. You can submit your applications to both testing environments via Codemagic using curl commands. In order to configure them correctly, you will need two environment variables: **username** and **access token**. They can be found in the BrowserStack UI with your account. Environment variables can be added in the Codemagic web app using the ‘Environment variables’ tab. You can then and import your variable groups into your codemagic.yaml. For example, if you named your variable group ‘browserstack_credentials’, you would import it as follows:

```
workflows:
  workflow-name:
    environment:
      groups:
        - browserstack_credentials

```

For further information about using variable groups please click [here](https://docs.codemagic.io/variables/environment-variable-groups/).

## App Live:
You can test your **.ipa** and **.apk** directly on real devices rather than simulators. For that, after building **.ipa** and **.apk**, the below curl command needs to be in your yaml file:

```
- Scripts:
-    name: Submitting app to Browserstack:
     script: |
     curl -u "USERNAME:ACCESS_KEY" -X POST "https://api-cloud.browserstack.com/app-live/upload" -F "file=@/path/to/app/file/you_application-debug_or_release.ipa”

```

P.S Make sure that you add this curl command after building **.ipa** and **.apk**, otherwise you cannot attach their paths to the curl command.

## App Automate:

You can test your native and hybrid apps on BrowserStack through Codemagic. For that purpose, you need to go through three steps using REST API endpoints:
1. Upload your app
2. Upload Test Suite
3. Start testing

In order to upload test Suites for android apps, you need to run ./gradlew assembleAndroidTest. Make sure that **app/build.gradle** file includes **Instrumentation Runner**:

```
  defaultConfig {
     testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
}
```

If you are building your app in release mode, then you also need to build your test Suite .apk in release mode by adding the following in app/build.gradle:
```
    testBuildType "release"
```

## Sample projects:

A sample project that shows how to configure BrowserStack integration for **App Live** is available [here](https://github.com/icarusdust/app_live_browserstack_integration)
A sample project that shows how to configure BrowserStack integration for **App Automate** is available [here](https://github.com/icarusdust/app_automate_browserstack_integration)



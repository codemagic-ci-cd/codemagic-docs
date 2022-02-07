---
title: LambdaTest integration
description: How to integrate your workflows with LambdaTest using codemagic.yaml
weight: 6
---

**LambdaTest** is a cloud-based mobile testing platform that provides the ability to test your applications on real mobile devices. LambdaTest can be used as part of your Codemagic CI/CD pipeline to test your applications.

## Create a LambdaTest account

Registering with LambdaTest is required in order to be able to get the username and access token. You can sign up for free [here](https://www.lambdatest.com/).

## Configuring Real Time and App Automation with Codemagic

**LambdaTest** offers two testing environments, **Real Time** and **App Automation**. Applications can be submitted to both testing environments through Codemagic using a cURL request. In order to configure them correctly, you will need two pieces of data: **username** and **access token**. They can be found in the **LambdaTest UI** with your account. 

## Real Time and App Automation

You can test your **.ipa** and **.apk** directly on real devices by submitting them to the **LambdaTest** environment via a cURL request:

```
-Scripts:
    - name: Submitting app to LambdaTest:
    script: |
        curl --location --request POST 'https://manual-api.lambdatest.com/app/upload/realDevice' --header 'Authorization: Basic $LAMBDATEST' --form 'name="lambda1"' --form 'appFile=@"app/build/outputs/apk/release/app-release.apk"'
```


Base64 encoding the username and token [here](https://mixedanalytics.com/knowledge-base/api-connector-encode-credentials-to-base-64/) with the **username:accessToken** format is needed, then save the encoded string to Codemagic as an environment variable. So the steps would be as follow:

1.Encode and save the username and access token into an env var.
2.Run the scripts in yaml referencing that env var.

**$LAMBDATEST** environment variable is a custom name and can be named to anything preferred. More info can be found [here](https://docs.codemagic.io/variables/environment-variable-groups/) about how to set up variable groups with Codemagic.

As soon as your **.ipa** and **.apk** are successfully built, they will appear in the **LambdatTest UI** under **Real Device => Real Time**. Any preferred devices can be selected for testing with **Real Time**. 

In order to see your tests being uploaded to the **App Automation**, tests need to be included in your project. As soon as tests are detected, they will be automatically uploaded to the **App Automation** section and all the results can be viewed there. However, in order to enable it, some capabilities must be injected into your project tests:

```
DesiredCapabilities capabilities = new DesiredCapabilities(); capabilities.setCapability("platformName", "Android"); capabilities.setCapability("deviceName", "Google Pixel 3"); capabilities.setCapability("isRealMobile", true); capabilities.setCapability("platformVersion","10"); capabilities.setCapability("app","lt://APP100202151634649275590734"); capabilities.setCapability("deviceOrientation", "PORTRAIT"); capabilities.setCapability("console",true); capabilities.setCapability("network",true); capabilities.setCapability("visual",true);
```

In these capabilities, the main part is **app URL** which is generated in the response of the cURL request:

```
{"app_id":"APP10020171164383758036593","name":"lambda1","type":"android","app_url":"lt://APP10020171444643838005433352"}
```

## Sample project

A sample project that shows how to configure LambdaTes integration is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/lambdatest_integration_demo_project/lambdatest_integration_demo_project).



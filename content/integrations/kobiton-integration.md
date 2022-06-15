---
title: Kobiton integration
description: How to integrate your workflows with Kobiton using codemagic.yaml
weight: 9
---

**Kobiton** is a mobile testing platform that accelerates delivery and testing of mobile apps by offering manual and automated testing on real devices, in the cloud & on-premises.

## Signing up with Kobiton

In order to get username and API key that are used when uploading applications to the Kobiton envrionment, it is mandatory to register with Kobiton. You can sign up free [here](https://kobiton.com/).


**Kobiton** offers to test your generated binaries **(.ipa, .apk, .aab and zip)** on real devices by automating them. To start with, desired capabilities must be set. The following capabilities  must be injected into your project’s test scripts for iOS:

```
String kobitonServerUrl = "https://nihalnevercode:c0eb5ab4-3f3f-43c0-9325-1ea473349ca8@api.kobiton.com/wd/hub";
DesiredCapabilities capabilities = new DesiredCapabilities();
// The generated session will be visible to you only. 
capabilities.setCapability("sessionName", "Automation test session");
capabilities.setCapability("sessionDescription", "");
capabilities.setCapability("deviceOrientation", "portrait");
capabilities.setCapability("browserName", "safari");
capabilities.setCapability("deviceGroup", "KOBITON");
// For deviceName, platformVersion Kobiton supports wildcard
// character *, with 3 formats: *text, text* and *text*
// If there is no *, Kobiton will match the exact text provided
capabilities.setCapability("deviceName", "iPad Air 2 (Wi-Fi)");
capabilities.setCapability("platformVersion", "15.3.1");
capabilities.setCapability("platformName", "iOS"); 
```

**For Android**:

```
String kobitonServerUrl = "https://nihalnevercode:c0eb5ab4-3f3f-43c0-9325-1ea473349ca8@api.kobiton.com/wd/hub";
DesiredCapabilities capabilities = new DesiredCapabilities();
// The generated session will be visible to you only. 
capabilities.setCapability("sessionName", "Automation test session");
capabilities.setCapability("sessionDescription", "");
capabilities.setCapability("deviceOrientation", "portrait");
capabilities.setCapability("captureScreenshots", true);
capabilities.setCapability("useConfiguration", "");
capabilities.setCapability("autoWebview", true);
capabilities.setCapability("browserName", "chrome");
capabilities.setCapability("deviceGroup", "KOBITON");
// For deviceName, platformVersion Kobiton supports wildcard
// character *, with 3 formats: *text, text* and *text*
// If there is no *, Kobiton will match the exact text provided
capabilities.setCapability("deviceName", "Galaxy S21 Ultra 5G");
capabilities.setCapability("platformVersion", "12");
capabilities.setCapability("platformName", "Android");
```

If you need screenshots to be taken while executing your tests, then the filling capability is a must:

```
capabilities.setCapability("captureScreenshots", true);
```

These capabitlies will allow Kobiton to detect which platform you want to you execute your test scripts with. Each device specific capabilities for Java can be found in the Kobiton devices list by clicking device settings and then Automation Settings.

HOW TO UPLOAD APPS TO THE KOBITON ENVIRONMENT ? 

**Step 1: **url** and **appPath** need to created to upload binaries to AWS S3 bucket by running the following cURL script:

```
CURL_RESULT=$(curl -X POST https://api.kobiton.com/v1/apps/uploadUrl \
-H 'Authorization: Basic $KOBITON_CREDENTIALS) \
-H 'Content-Type: application/json' \
-d '{"filename": "your_desired_binary_name.ipa"}' | jq -r)

APP_URL=$(jq -r '.url' <<<"$CURL_RESULT")

APP_PATH=$(jq -r '.appPath' <<<"$CURL_RESULT") 
```

**Step 2: Upload to S3**:

```
curl -X PUT “$APP_URL” \
-H 'content-type: application/octet-stream' \
-H 'x-amz-tagging: unsaved=true' \
-T "build/ios/ipa/kobition_integration.ipa"
```

**Step 3: Upload to the Kobiton environment**:

```
curl -X POST https://api.kobiton.com/v1/apps \
-H 'Authorization:  Basic $KOBITON_CREDENTIALS' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"appPath": “’”$APP_PATH”’”}’
```

The last step is optional to get a URL in the Codemagic logs to be directed to test details:

```
curl -X POST https://api.kobiton.com/v1/revisitPlans/create \
-H 'Authorization: Basic $KOBITON_CREDENTIALS' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
```

The response message should be like the following for the above-mentioned cURL:

```
{"testRunId":123168,"testRunDetailLink":"https://portal.kobiton.com/plans/123168/executions"}
```

Base64 encoding the username and token [here](https://mixedanalytics.com/knowledge-base/api-connector-encode-credentials-to-base-64/) with the **username:accessToken** format is needed, then save the encoded string to Codemagic as an environment variable. So the steps would be as follow:

1. Encode and save the username and access token into an environment variable.
2. Run the scripts in YAML referencing that environment variable.

**$KOBITON_CREDENTIALS** environment variable is a custom name and can be named to anything preferred. More info can be found [here](/variables/environment-variable-groups/) about how to set up environment variable groups with Codemagic.

After a successful upload, you should get appId and versionId in the Codemagic logs. After the whole process, check your App section in the Kobiton UI and you should see your uploaded binary there.

## Sample projects

A sample project that shows how to configure Kobiton integration is available [here]()




---
description: How to build iOS apps with Codemagic
title: Step by step guide for iOS apps
weight: 15
---

In order to have an iOS app built and distributed successfully with **Codemagic** the following steps must be followed.

1. Register with Apple Developer Account 
2. In your App Store Connect, create an API key (.p8) by going to Users and Access > Keys and choose App Manager access rights when generating one and download the api key to your local machine
3. Go to your Codemagic UI and create **APP_STORE_CONNECT_PRIVATE_KEY** environment variable under the Environment variables tab
4. Run cat your_file_name.p8 | pbcopy on your local machine terminal, it will copy the entire content of that file and then paste it in the value input of the generated **APP_STORE_CONNECT_PRIVATE_KEY** env var above. 
5. Add a group name, mark the Secure checkbox and click Add.
6. Likewise, follow the same environment variables creation steps for **APP_STORE_CONNECT_ISSUER_ID** and **APP_STORE_CONNECT_KEY_IDENTIFIER** separately which are your Api key identifier and issuer id in the App Store Connect account. Key identifier can be found in front of your newly generated API key and issuer id is static for all the api keys.
7. One more environment variable is required and that is **CERTIFICATE_PRIVATE_KEY**. This is an **RSA 2048** bit private key to be included in the signing certificate.  The best practice is to generate one iOS distribution certificate in your Apple Developer Account, install it on your local machine and then run: **openssl pkcs12 -in IOS_DISTRIBUTION.p12 -nodes -nocerts | openssl rsa -out ios_distribution_private_key** to fetch its private **RSA key**. Running this command in your terminal will create private and public key. What you need to do is to run **cat iOS_DISTRIBUTION.p12 | pbcopy** which will copy its content to clipboard and then, paste it in the value input of **CERTIFICATE_PRIVATE_KEY**. Check it [here](../yaml-code-signing/signing-ios/#saving-the-api-key-to-environment-variables) for more information about how to create and install a distribution certificate

The above mentioned-steps will build an **.ipa** file successfully. If you need to distribute your app to TestFlight or App Store for production, you need to follow the steps below:

1. Under the publishing section of **codemagic.yaml** add **app_store_connect** which needs to hold your **APP_STORE_CONNECT_PRIVATE_KEY**, **APP_STORE_CONNECT_PRIVATE_KEY** and **APP_STORE_CONNECT_ISSUER_ID** and their values would have already been set by following the steps above. 
2. Set **submit_to_testflight** to **true** if you need to submit your app to internal tester groups 
3. Set **submit_to_app_store** to **true** if you need to submit your app to external tester groups and it will also submit your app for review by Apple. For example:

```
publishing:
 app_store_connect:              
    api_key: $APP_STORE_CONNECT_PRIVATE_KEY         
    key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER       
    issuer_id: $APP_STORE_CONNECT_ISSUER_ID         
    submit_to_testflight: true                     
    beta_groups:  
      - group name 1
      - group name 2
    submit_to_app_store: true # Optional boolean, defaults to false. Whether or not to submit the uploaded build to App Store review. Note: This action is performed during post-processing.
    release_type: SCHEDULED # Optional, defaults to MANUAL. Supported values: MANUAL, AFTER_APPROVAL or SCHEDULED
    earliest_release_date: 2021-12-01T14:00:00+00:00 # Optional. Timezone-aware ISO8601 timestamp with hour precision when scheduling the release. This can be only used when release type is set to SCHEDULED. It cannot be set to a date in the past.
    copyright: 2021 Nevercode Ltd # Optional. The name of the person or entity that owns the exclusive rights to your app, preceded by the year the rights were obtained.
```

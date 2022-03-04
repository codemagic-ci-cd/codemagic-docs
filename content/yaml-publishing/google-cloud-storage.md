---
title: Google Cloud Storage
description: How to publish build artifacts to Google Cloud Storage using codemagic.yaml
weight: 14
---

In order to publish your generated artifacts to Google Cloud Storage:

1. Get an authorization access token from the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/). Configure the playground to use your own OAuth credentials and choose Cloud Storage API at step . 

2. After getting your Autherization Code, click the "Exchange authorization code for access token" button and it will generate an Access Token and save it as an enviornment variable More information can be found [here](https://docs.codemagic.io/variables/environment-variable-groups/) about how to set up environment variable groups with Codemagic.

3. Use the following cURL request in your post-publishing script:

```
curl -X POST --data-binary @YOUR_ARTIFACT_PATH \
     -H "Authorization: Bearer ACCESS_TOKEN" \
     "https://storage.googleapis.com/upload/storage/v1/b/YOUR_BUCKET_NAME/o?uploadType=media&name=DESIRED_OBJECT_NAME"
```

4. Go to your Google Cloud Platfrom console and open Cloud Storage, create a new bucket and use the exact same name in the above-mentioned cURL request as a query parameter.

P.S If you get the following error message, it means that you need to link a billing address to that exact project in the Google Cloud Platform console:

```The billing account for the owning project is disabled in state absent```


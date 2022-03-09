---
title: Google Cloud Storage
description: How to publish build artifacts to Google Cloud Storage using codemagic.yaml
weight: 14
---

In order to publish your generated artifacts to Google Cloud Storage:

1. Log in to your Google Cloud platform [console](https://console.cloud.google.com/). Create a new service account under **IAM & Admin > Service Accounts**.Find more information about how to create a service account [here](https://docs.codemagic.io/knowledge-base/google-services-authentication/#creating-a-service-account). Give **Storage Object Admin** access to the newly created service account which needs to be followed by generating a key as JSON for the service account. This will cause a JSON key file to be downloaded. As the last step in the process, you should create an environment variable called **GCLOUD_STORAGE_KEY** and save the contents of the Service Account JSON to the the variable. More information about environment variable groups can be found [here](https://docs.codemagic.io/variables/environment-variable-groups/). 

2. Go to your Google Cloud Platform console and open Cloud Storage. Make a note of the name of the bucket you want to upload to or create a new bucket.

3. Use the following script in your post-publishing script or create a new script step if you are using codemagic.yaml:

```
echo $GCLOUD_STORAGE_KEY > $FCI_BUILD_DIR/gcloud_storage_key.json
gcloud auth activate-service-account --key-file $FCI_BUILD_DIR/gcloud_storage_key.json
gsutil cp $FCI_BUILD_DIR/app/build/outputs/**/*.apk gs://YOUR_BUCKET_NAME
```

After completing steps above, you can go to your Cloud Storage account and check if the object is uploaded. 

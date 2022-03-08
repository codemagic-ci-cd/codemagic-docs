---
title: Google Cloud Storage
description: How to publish build artifacts to Google Cloud Storage using codemagic.yaml
weight: 14
---

In order to publish your generated artifacts to Google Cloud Storage:

1. Create a new Service Account and generate a JSON file with **Storage Object Creator** role. Save your JSON file to [environment variable](https://docs.codemagic.io/variables/environment-variable-groups/). 

2. Go to your Google Cloud Platfrom console and open Cloud Storage, create a new bucket and use the exact same bucket name in the following request.

3. Use the following request in your post-publishing script:

```
echo $GCLOUD_STORAGE_KEY > $FCI_BUILD_DIR/gcloud.json
gcloud auth activate-service-account --key-file $FCI_BUILD_DIR/gcloud.json
gsutil cp $FCI_BUILD_DIR/app/build/outputs/**/*.apk gs://YOUR_BUCKET_NAME
```

After completing steps above, you can go to your Cloud Storage account and check if the object is uploaded. 

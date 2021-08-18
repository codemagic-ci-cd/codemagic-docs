---
description: How to use custom scripts to publish to external services
title: Publish build artifacts to Amazon S3
weight: 6
aliases: [/publishing/publish-build-artifacts-to-amazon-s3, /flutter-publishing/publish-build-artifacts-to-amazon-s3]
---

You can use custom scripts to publish your app artifacts to external sources. Here's an example for publishing to [Amazon S3](https://aws.amazon.com/s3/).

1.  You will first need to provide Codemagic access to your Amazon S3 account for publishing. Add your credentials as environment variables named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively. Select **Secure** when adding the key in Codemagic UI, or encrypt the key when adding it to the codemagic.yaml file.
2.  Add the script to update the S3 bucket. `<FOLDER OR FILE>` refers to a specific folder or file to be synced. Replace `<BUCKET_NAME>` with your actual bucket name. Note that all the artifact files that Codemagic generates during the build are located in `FCI_BUILD_OUTPUT_DIR`.
    
    * In Flutter workflow editor, click on the **+** sign before the Build section to expand the step and add the script to the **pre-build script** field.
    * In codemagic.yaml, add the script to the `scripts` section right before build commands.

```bash
sudo pip3 install awscli --upgrade
aws s3 sync <FOLDER OR FILE> s3://<BUCKET_NAME>
```

Now, each time you build the workflow, the app artifact will be published to your Amazon S3 bucket.

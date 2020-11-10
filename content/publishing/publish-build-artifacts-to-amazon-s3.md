---
description: You can use custom scripts to publish app artifacts to external services.
title: Publish build artifacts to Amazon S3
weight: 5
---

You can use custom scripts to publish your app artifacts to external sources. Here's an example for publishing to [Amazon S3](https://aws.amazon.com/s3/).

1.  You will first need to provide Codemagic access to your Amazon S3 account for publishing. In **App settings >** **Environment variables**, add your credentials as [environment variables](../building/environment-variables/) named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively. Make sure to check **Secure**.
2.  Click on the **+** sign before the Build section to expand the step and add the following **pre-build script**. `<FOLDER OR FILE>` refers to a specific folder or file to be synced. Replace `<BUCKET_NAME>` with your actual bucket name. Note that all the artifact files that Codemagic generates during the build are located in `FCI_BUILD_OUTPUT_DIR`.

```bash
#!/bin/sh

set -e
set -x

sudo pip3 install awscli --upgrade
aws s3 sync <FOLDER OR FILE> s3://<BUCKET_NAME>
```

Now, each time you build the app, the app artifact will be published to your Amazon S3 bucket.

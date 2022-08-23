---
title: Amazon S3
description: How to publish build artifacts to Amazon S3 using codemagic.yaml
weight: 7
aliases: [/publishing/publish-build-artifacts-to-amazon-s3, /flutter-publishing/publish-build-artifacts-to-amazon-s3, /knowledge-base/publish-build-artifacts-to-amazon-s3]
---

In order to publish your web application to AWS S3:

1.  You will first need to provide Codemagic access to your Amazon S3 account for publishing. In the Codemagic UI, add your credentials as [environment variables](../variables/environment-variable-groups) named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively (make sure to select **Secure** when adding them) and save them to a group that you can reference in your `codemagic.yaml` file. In the below example, we have created a group called `aws_credentials`.

You can follow the [instructions](https://aws.amazon.com/getting-started/hands-on/backup-to-s3-cli/) provided by Amazon to create your account and get the necessary details.

2.  Add the script below to your `scripts` section before your build script to update the S3 bucket. `<FOLDER OR FILE>` refers to a specific folder or file to be synced. Replace `<BUCKET_NAME>` with your actual bucket name. Note that all the artifact files that Codemagic generates during the build are located in `CM_BUILD_OUTPUT_DIR`.

```yaml
environment:
    groups:
      - aws_credentials
scripts:
  - name: Update S3 bucket
    script: |
        sudo pip3 install awscli --upgrade
        aws s3 sync <FOLDER OR FILE> s3://<BUCKET_NAME>
```

Now, each time you build the workflow, the app artifact will be published to your Amazon S3 bucket.

Note that the minimal required permission policy attached to the AWS IAM is as follows:

```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::<bucket-name>/*"
        }
    ]
}
```

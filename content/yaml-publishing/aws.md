---
title: Amazon S3 publishing using codemagic.yaml
linkTitle: Amazon S3
description: How to publish build artifacts to Amazon S3 using codemagic.yaml
weight: 11
aliases: 
  - /publishing/publish-build-artifacts-to-amazon-s3
  - /flutter-publishing/publish-build-artifacts-to-amazon-s3
  - /knowledge-base/publish-build-artifacts-to-amazon-s3
  - /custom-scripts/publish-build-artifacts-to-amazon-s3
  - /testing/aws
---

In order to publish your web application to AWS S3, you need to configure your access credentials in Codemagic. You can follow the [instructions](https://aws.amazon.com/getting-started/hands-on/backup-to-s3-cli/) provided by Amazon to create your account and get the necessary details.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `AWS_ACCESS_KEY_ID`.
3. Enter the required value as **_Variable value_**.
4. Enter the variable group name, e.g. **_aws_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the process to also add the `AWS_SECRET_ACCESS_KEY` variable.


8.  Add the script below to your `scripts` section before your build script to update the S3 bucket. `<FOLDER OR FILE>` refers to a specific folder or file to be synced. Replace `<BUCKET_NAME>` with your actual bucket name. Note that all the artifact files that Codemagic generates during the build are located in `CM_BUILD_OUTPUT_DIR`.

{{< highlight yaml "style=paraiso-dark">}}
environment:
  groups:
    - aws_credentials
scripts:
  - name: Update S3 bucket
    script: | 
      sudo pip3 install awscli --upgrade
      aws s3 sync <FOLDER OR FILE> s3://<BUCKET_NAME>
{{< /highlight >}}


Now, each time you build the workflow, the app artifact will be published to your Amazon S3 bucket.

Note that the minimal required permission policy attached to the AWS IAM is as follows:

{{< highlight json "style=paraiso-dark">}}
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
{{< /highlight >}}


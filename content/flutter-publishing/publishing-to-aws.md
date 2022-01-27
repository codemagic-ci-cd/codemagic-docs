---
description: How to publish a web app to Amazon S3 using Flutter workflow editor
title: Amazon S3
weight: 7
---

You can use custom scripts to publish your app artifacts to external sources. Here's an example for publishing to [Amazon S3](https://aws.amazon.com/s3/).

In order to publish your web application to AWS S3, you simply need to navigate to your workflows **Distribution** section and provide the values for `AWS access key ID`, `AWS secret access Key` and `Bucket name`. In addition, make sure to select `Enable AWS S3 bucket publishing`.

You can follow the [instructions](https://aws.amazon.com/getting-started/hands-on/backup-to-s3-cli/) provided by Amazon to create your account and get the necessary details.

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

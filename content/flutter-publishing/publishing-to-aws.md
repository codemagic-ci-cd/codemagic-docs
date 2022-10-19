---
description: How to publish a web app to Amazon S3 using Flutter workflow editor
title: Amazon S3
weight: 7
---

In order to publish your web application to AWS S3:

1. Navigate to your workflow's **Distribution** section.
2. Select `Enable AWS S3 bucket publishing`.
3. Provide the values for `AWS access key ID`, `AWS secret access Key` and `Bucket name`.

You can follow the [instructions](https://aws.amazon.com/getting-started/hands-on/backup-to-s3-cli/) provided by Amazon to create your account and get the necessary details.

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

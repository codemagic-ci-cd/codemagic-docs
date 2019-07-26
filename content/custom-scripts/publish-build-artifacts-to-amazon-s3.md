+++
categories = ["Custom script examples"]
description = "You can use custom scripts to publish app artifacts to external services."
facebook_description = ""
facebook_image = "/uploads/2019/01/default-thumb.png"
facebook_title = ""
thumbnail = ""
title = "Publish build artifacts to Amazon S3"
twitterDescription = ""
twitter_image = "/uploads/2019/02/twitter.png"
twitter_title = ""
weight = 3
[menu.docs_sidebar]
weight = 1

+++
You can use custom scripts to publish your app artifacts to external sources. Here's an example for publishing to [Amazon S3](https://aws.amazon.com/s3/).

1. You will first need to provide Codemagic access to your Amazon S3 account for publishing. In **App settings >** **Environment variables**, add your credentials as  [environment variables](https://docs.codemagic.io/building/environment-variables/) named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively. Make sure to check **Secure**.
2. Click on the **+** sign before the Build section to expand the step and add the following **pre-build script**.  `<FOLDER OR FILE>` refers to a specific folder or file to be synced. Replace `<BUCKET_NAME>` with your actual bucket name.

        #!/bin/sh
        
        set -e
        set -x
        
        cd $FCI_BUILD_DIR
        sudo pip3 install awscli --upgrade
        aws s3 sync <FOLDER OR FILE> s3://<BUCKET_NAME>

Now, each time you build the app, the app artifact will be published to your Amazon S3 bucket.
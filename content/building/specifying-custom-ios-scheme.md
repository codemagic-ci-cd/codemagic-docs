+++
categories = ["Build configuration"]
description = "Build "
facebook_description = ""
facebook_image = "/uploads/2019/01/default-thumb.png"
facebook_title = ""
thumbnail = ""
title = "Specifying custom iOS scheme"
twitterDescription = ""
twitter_image = "/uploads/2019/02/twitter.png"
twitter_title = ""
weight = 4
[menu.docs_sidebar]
weight = 1

+++
By default, Codemagic builds the iOS app using the `Runner` scheme. You can specify a custom iOS scheme for the `xcodebuild` command with the `FCI_FLUTTER_SCHEME` environment variable. A different iOS scheme can be specified for each workflow.

You can read more about environment variables and how to use them in the [Environment variables](https://docs.codemagic.io/building/environment-variables/) section.
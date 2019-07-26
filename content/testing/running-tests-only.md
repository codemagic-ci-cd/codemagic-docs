+++
categories = ["Testing"]
description = "Run tests only without building the app."
facebook_description = ""
facebook_image = "/uploads/2019/01/default-thumb.png"
facebook_title = ""
thumbnail = ""
title = "Running tests only"
twitterDescription = ""
twitter_image = "/uploads/2019/02/twitter.png"
twitter_title = ""
weight = 4
[menu.docs_sidebar]
weight = 1

+++
You can have a workflow to run tests without building the app. In App settings > Build > Build for platforms, select **Run tests only**. Codemagic will then build the workflow until the testing step and skip building for Android or iOS.

![](/uploads/2019/05/doc_run_tests_only_new.PNG)

If tests fail, the status of the build will be "failed" and you'll receive an email about failing tests. If you have publishing to Slack configured, you'll receive notifications on build status updates.
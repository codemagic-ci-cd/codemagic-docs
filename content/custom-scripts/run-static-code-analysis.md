---
categories:
  - Custom script examples
date: '2019-03-31T15:25:27+03:00'
description: ''
draft: true
facebook_description: ''
facebook_image: /uploads/2019/01/default-thumb.png
facebook_title: ''
menu:
  docs_sidebar:
    weight: 1
thumbnail: ''
title: Run static code analysis
twitter_image: /uploads/2019/02/twitter.png
twitter_title: ''
twitterDescription: ''
weight: ''
---

You can use this **pre-test** script to run static code analysis with `flutter analyze`.

    #!/usr/bin/env sh

    set -e # exit on first failed command
    set -x # print all executed commands to the log

    flutter analyze

---
categories:
  - Custom script examples
date: '2019-03-31T15:25:27+03:00'
draft: true
title: Run static code analysis
weight: ''
---

You can use this **pre-test** script to run static code analysis with `flutter analyze`.

    #!/usr/bin/env sh

    set -e # exit on first failed command
    set -x # print all executed commands to the log

    flutter analyze

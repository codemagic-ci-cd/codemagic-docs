---
draft: true
title: Run static code analysis
weight: 3
---

You can use this **pre-test** script to run static code analysis with `flutter analyze`.

    #!/usr/bin/env sh

    set -e # exit on first failed command
    set -x # print all executed commands to the log

    flutter analyze

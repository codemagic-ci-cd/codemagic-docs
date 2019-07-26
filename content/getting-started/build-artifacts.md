---
categories:
  - Getting started with Codemagic CI/CD
description: What kind of artifacts are generated for Flutter apps on Codemagic CI/CD
draft: true
title: Build artifacts
weight: 3
---

With every build, Codemagic creates the relevant build artifacts that are available for download in the app and can be also published to **email**, **Slack** and **Google Play Store** / **App Store Connect (TestFlight)**. The list of artifacts may vary depending on several factors, such as the chosen platform(s) and build mode, whether code signing was enabled, if there were tests present, and so on.

|                                           | <b>Android</b>               | <b>iOS</b>                                                          |
| ----------------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| <b>Without code signing (debug mode)</b>: | app.apk <br> app-debug.apk   | Runner.app                                                          |
| <b>With code signing (release mode)</b>:  | app.apk <br> app-release.apk | app_name.ipa<br>Runner.app<br>Runner.app.dSYM.zip<br>xcodebuild.log |

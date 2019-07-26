---
categories:
  - Getting started with Codemagic CI/CD
date: '2019-03-21T17:06:39+02:00'
description: ''
facebook_description: ''
facebook_image: /uploads/2019/01/default-thumb.png
facebook_title: ''
menu:
  docs_sidebar:
    weight: 1
thumbnail: ''
title: Multiple projects in one repository
twitter_image: /uploads/2019/02/twitter.png
twitter_title: ''
twitterDescription: ''
weight: 5
---

Codemagic is able to detect multiple projects in a repository provided that each project has its `pubspec.yaml` file.

The first build is run for the project whose `pubspec.yaml` file was found first. After the first build, you can select the project for building from the **Project file path** dropdown in the Build section of app settings.

{{< figure size="medium" src="/uploads/2019/03/multiple_projects_dark.png" caption="Select which project to build" >}}

---
categories:
  - Getting started with Codemagic CI/CD
title: Multiple projects in one repository
weight: 5
---

Codemagic is able to detect multiple projects in a repository provided that each project has its `pubspec.yaml` file.

The first build is run for the project whose `pubspec.yaml` file was found first. After the first build, you can select the project for building from the **Project file path** dropdown in the Build section of app settings.

{{< figure size="medium" src="../uploads/2019/03/multiple_projects_dark.png" caption="Select which project to build" >}}

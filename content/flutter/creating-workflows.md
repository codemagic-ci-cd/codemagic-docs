---
description: How to configure workflows in the Flutter workflow editor
title: Workflows
weight: 2
aliases:
    - '../getting-started/creating-workflows'
---

Have full control over your CI/CD pipeline with workflows. A workflow is a set of settings that determines how your app is to be built, tested and published. 

You can create several workflows for building different configurations of your app. For example, you can use workflows to build different branches of the project, separate your debug and release builds, run builds for different projects or flavors in the repository, test your app with different software versions, and so on.

## Creating workflows

New workflows can be created by duplicating existing ones. Navigate to **App settings > Right sidebar > Workflow settings** and click **Duplicate workflow**.

This creates a new workflow with the exact same settings as you had configured for the original workflow. All your environment variables and scripts, build settings and signing files will be duplicated into the new workflow.

You can then click on the name of the workflow to edit it and configure the workflow settings as you like. Now that you have more than one workflow, you can also delete workflows.

To switch between workflows, click on the workflow name below the app name in app settings.

{{<notebox>}}
Note that while your workflows started out as duplicates, they become separate entities once created. Any changes made to one workflow won't affect any of the others.
{{</notebox>}}

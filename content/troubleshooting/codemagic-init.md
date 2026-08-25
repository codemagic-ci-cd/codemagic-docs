---
description: Give your AI agent Codemagic skills to answer questions, debug builds, and suggest fixes
title: Codemagic Knowledge for AI Agents
meta_title: Access Codemagic Knowledge and Skills with Local AI Agents
meta_description: Equip local AI coding agents with Codemagic documentation and knowledge so they can configure CI/CD, troubleshoot build failures, and suggest Codemagic-specific fixes.
weight: 9
---

## What is codemagic-init ?

`codemagic-init` is a CLI tool that brings Codemagic knowledge directly into AI agents running locally on a developer's machine.

The goal is to equip AI agents with the context, skills, and knowledge they need to work effectively with Codemagic. Once installed, these capabilities enable the agent to:

* Understand Codemagic configuration and workflows.
* Create and modify codemagic.yaml files.
* Answer questions about Codemagic.
* Troubleshoot build and configuration issues.
* Follow Codemagic best practices.
* Help developers set up and maintain CI/CD pipelines.


## How it works

1. Install the package by running `pip install codemagic-init` in your local terminal.
2. Once installed, run `codemagic init`. This detects the supported AI agents installed on your machine and automatically sets up the Codemagic skills for them.

Once initialized, the AI agent can leverage Codemagic-specific knowledge and skills to provide informed assistance across a wide range of Codemagic-related tasks and questions.

The skills and their references to the Codemagic knowledge base are refreshed every 6 hours by a cron job. This keeps the information available to the AI agent aligned with the latest Codemagic documentation and knowledge. 

You can also refresh the knowledge manually with:

{{< highlight bash "style=paraiso-dark">}}
codemagic update
{{< /highlight >}}

To remove the installed Codemagic skills, run:

{{< highlight bash "style=paraiso-dark">}}
codemagic uninstall
{{< /highlight >}}

## Project Setup

`codemagic init` can also help configure Codemagic for a project by detecting project-specific information and using it during the setup process.

Project detection is only available when `codemagic init` is run from within the project directory. In this case, the CLI can inspect the project's files and identify relevant information such as the project type, supported platforms, and application configuration.

When `codemagic init` is run outside a project directory, the CLI cannot perform this project-specific detection. The Codemagic skills can still be installed for supported AI agents, however.

Once the skills are installed, the AI agent can work with projects independently. For example, you can open a project in your AI agent and ask it to create or configure a `codemagic.yaml`, drawing on the Codemagic knowledge provided by `codemagic init`.

In other words, the project-directory requirement applies only to project detection performed by the CLI, not to the use of Codemagic skills by the AI agent.

## Summary

`codemagic-init` makes Codemagic readily available to the AI agents you already use locally, giving them the context and capabilities needed to assist with Codemagic throughout your development workflow.

The source repository is available [here](https://github.com/codemagic-ci-cd/codemagic-init).
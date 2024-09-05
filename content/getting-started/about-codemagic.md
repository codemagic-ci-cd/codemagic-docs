---
title: Welcome to Codemagic
linkTitle: Welcome
description: Introduction to Codemagic CI/CD
weight: 2 
aliases:
  - /notes/release-notes/ 
---

Codemagic is a cloud-based Continuous Integration/Continuous Delivery (CI/CD) product specifically designed for mobile developers building apps with Flutter, React Native, native iOS, native Android, Unity, Kotlin Multiplatform Mobile,.NET MAUI and Ionic. Codemagic's API and versatile workflow configurations also provide a great platform for mobile development teams who are White labeling their apps.

## Automatic build and deployment
Codemagic automates the process of app building, testing, and deployment to app stores such as the Apple App Store, Google Play, Microsoft Store, and Huawei App Gallery. New builds can be triggered when code is pushed to your repository, tags are added, or pull requests are merged. You can configure multiple workflows to make the app available to your dev team, distribute the latest build to your test team, or publish your app to production. 

## Repository Access
To build your apps, Codemagic needs read-only access to your cloud-based GitHub, GitLab, or Bitbucket repository. It’s also possible to connect to self-hosted repositories using an SSH key pair and configuring the appropriate rules in your firewall. 

## Security
At the beginning of each build, your source code is cloned to a new virtual machine instance where the build is run. It is destroyed immediately after the build has completed, leaving no trace of your source code or secret variables. To access API keys, certificates, tokens, and other sensitive values during your build, an unlimited number of encrypted secrets can easily be added to the Codemagic dashboard. Only the build history log and build artifacts will be available in the Codemagic dashboard after the build finishes.

Codemagic employees do not have access to your source code or any encrypted secrets you have added to the dashboard. Please see our [Security statement](https://codemagic.io/security-statement/) for more information.

## Integrations
Application workflows can also be configured to run unit and integration tests as well as integrate with services that test your apps on real devices, check the quality of your code and scan for vulnerabilities, or update your development progress in your project management system. Your team can be notified by email or Slack notifications when new builds are available. 

## Configuration as code
Workflows are configured in code using a YAML configuration file which can be checked into version control to track changes made by your team. If you need to add a new workflow, simply copy and paste an existing workflow and modify it as required. Configurations can be easily extended with Bash or Python scripts in addition to Codemagic’s open-source CLI tools that make tasks such as build versioning, publishing, and code signing much simpler. You can find out more about working with the `codemagic.yaml` configuration file [here](https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/).

Flutter developers can also choose to set up their workflows using a graphical user interface called the “Workflow Editor”.

## Infrastructure
Codemagic’s infrastructure is centered around the powerful Apple silicon M1 and M2(arm64) machines allowing for faster builds than the previous generation of macOS machines. Linux and Windows machines are also available for all customers. 

The following documentation pages show the hardware specifications for each instance type:

- [Linux hardware specifications](https://docs.codemagic.io/specs/versions-linux/)
- [macOS hardware specifications](https://docs.codemagic.io/specs/versions-macos/)
- [Windows hardware specifications](https://docs.codemagic.io/specs/versions-windows/)


Our data centers are located in the US but it is possible to set up dedicated macOS hosts in the EU on request.

## Pre-installed software
All the virtual machines come preloaded with the most common software you would need for building mobile apps such as Xcode, Android Studio, and a variety of CLI tools and frameworks. Codemagic’s engineers continuously monitor system availability and take care of updating software like Xcode and checking everything works when building with new versions so you don’t have to worry about running and maintaining your own systems. 

Please refer to the following documentation to see the software pre-installed on each instance type:
- [Linux pre-installed software](https://docs.codemagic.io/specs/versions-linux/#pre-installed-tools)
- [macOS pre-installed software](https://docs.codemagic.io/specs/versions-macos/&#35;:~:text=Free%20Space%3A%2048GB&#41;-,Pre%2Dinstalled%20tools,-Android%20tools%20/usr)
- [Windows pre-installed software](https://docs.codemagic.io/specs/versions-windows/#pre-installed-tools)

## Scalability
If you need to run parallel builds you can add additional concurrencies as your needs grow. The free tier and pay-as-you-go plan includes one concurrency to begin with but can be increased to a total of three. The Annual plan and Enterprise plans start with three concurrencies and an unlimited number of concurrencies can be added at any time during your subscription period. 

## Pricing
Individuals and hobbyists can get started with Codemagic using its free tier which offers 500 free build minutes per month and lets you build on Apple silicon M1 machines. This quota is reset at the beginning of each month. 

For development teams with limited budgets, the Codemagic pay-as-you-go plan offers an affordable way to get started with CI/CD. You only pay for the minutes you consume and the additional concurrencies you add. 

An annual subscription with access to Mac mini M2 VMs comes with 2 months of free usage.

Enterprise plans are also available for customers who require additional services such as SSO Login (OpenID, OAuth2 or SAML 2.0), registration with procurement systems, invoicing and payment by bank transfer, signed NDA, DPA, and other account management services such as collaborating with infosec teams.

Full pricing details can be found on our pricing page [here](https://docs.codemagic.io/billing/pricing/).

## Blog

The [Codemagic blog](https://blog.codemagic.io/) is a great resource that covers a multitude of technical subjects related to CI/CD ranging from code signing and publishing to general application development.

## Newsletter

To stay updated with the latest news and updates about the Codemagic product, subscribe to our Newsletter. You can do this by clicking on the "Sign me up for newsletter" checkbox on your User Preferences page.

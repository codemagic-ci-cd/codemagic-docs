---
description: Information about Codemagic feature releases
title: Release notes
weight: 1
---

## October 2019

### Concurrent builds for teams

Teams on Codemagic now have Magic seats available in addition to regular team seats. Purchasing a Magic seat increases your team's build concurrency by 1, allowing to run several builds in parallel. Read more about Magic seats on our [blog](https://blog.codemagic.io/get-additional-build-concurrency-with-magic-seats/) and check out the pricing details [here](https://codemagic.io/pricing/).

## September 2019

### Codemagic CI/CD GitHub app (beta)

In addition to GitHub OAuth integration, you can now use Codemagic via the GitHub app. The [Codemagic CI/CD GitHub app](https://github.com/marketplace/codemagic-ci-cd) requires less permissions than the GitHub OAuth integration and enables you to configure which repositories Codemagic can access. Read more about the benefits of Codemagic GitHub app on our [blog](https://blog.codemagic.io/codemagic-github-app/) and see our [documentation](../getting-started/codemagic-github-app) for details about the integration. 

### Testing on real devices with AWS Device Farm and Sylph

We have added the option to run Flutter Driver tests on physical Android and iOS devices on AWS Device Farm. This is done thanks to integration with [Sylph](https://github.com/mmcc007/sylph) which makes it possible to configure the test run using a `sylph.yaml` file. See more details in [Testing on AWS Device Farm](../testing/aws).

### Support for macOS and Linux apps

Building Flutter desktop apps for macOS and Linux is now supported on Codemagic, see instructions [here](../building/building-for-desktop). You can also watch a [demo](https://blog.codemagic.io/codemagic-ci-cd-releases-support-for-flutter-desktop/) of building a desktop app on Codemagic and installing and running it on macOS.

## August 2019

### Codemagic community documentation

We made Codemagic documentation public! Codemagic users are now welcome to contribute on [GitHub](https://github.com/codemagic-ci-cd/codemagic-docs/).

The improved documentation site includes:

* [Release notes](./release-notes) for an overview of latest Codemagic feature releases

* [Common issues](../troubleshooting/common-issues) together with solutions to overcome them

* [Software and versions](./versions) page containing a list of software that is available out-of-the-box

### Automatic builds on tag creation -- GitLab and Bitbucket

In addition to GitHub apps, we now support automatic builds on tag creation also for GitLab and Bitbucket apps. Whenever you create a tag via UI or using command line, Codemagic will automatically pick up and build the tagged commit. Read more about it [here](../building/automatic-build-triggering/#build-triggers).
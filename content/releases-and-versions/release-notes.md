---
description: Information about Codemagic feature releases
title: Release notes
weight: 1
---

## January 2020

### GitHub releases

The Publish section in app settings now contains an integration with GitHub for publishing Android artifacts to a GitHub release. Publishing to GitHub happens only for successful builds triggered on tag creation and is unavailable for manual builds. Read more about GitHub releases here: https://help.github.com/en/github/administering-a-repository/about-releases.

### Codemagic API key

We have made Codemagic API key available from the UI, which will make integrating Codemagic to your workflows even easier. The key is available in **User settings > Integrations > Codemagic API**. Currently, the API key can be used to set up custom build triggers, read more about it [here](../building/automatic-build-triggering/#custom-build-triggers).

### Transfer personal paid minutes to team

You can now transfer all personal paid build minutes to your team account from user settings and team settings.
Note that you will see the **Transfer** button only if you have any minutes to transfer and are part of a team.

## December 2019

### Mac Pro trial

Codemagic now has Mac Pro build machines available for business plan users. To test out Mac Pros, all users and teams get 3 Mac Pro builds without any additional cost as a one-time offer. You can choose to run a build on a Mac Pro when starting build manually. 

## November 2019

### Make builds public

You can now share your Codemagic builds publicly via a **direct link** to the build or by displaying a **build status badge** in your repository. Anyone accessing the link will be able to see the build logs and download build artifacts. This is a great option for sharing your open-source projects and getting feedback from fellow Flutter developers.

This feature is workflow-specific. In your Workflow settings, click the **Make builds public** toggle to make all existing and future build logs and artifacts of the workflow publicly accessible. Your app and its settings will remain private. Note that direct links to build artifacts and log files will remain accessible even when you disable the feature.

### Download build step logs

We have added the option to download the log of each build step. This makes it easier to view very large log files, search inside them or compare the logs of successful and failed builds.

## October 2019

### SMS verification for two-factor authentication

Codemagic supports receiving verification codes for two-factor authentication via SMS. This is a good option for those who don’t have their Apple device at hand but have registered a trusted phone number to receive verification codes. If you have multiple trusted phone numbers available, you can choose the number to which the verification code will be sent.

### Apple Developer Portal integration

With the Apple Developer Portal integration, users can use the same credentials for automatic iOS code signing across all apps on user's personal account or in a team without having to enter them in app settings. Read more about [automatic code signing with Apple Developer Portal integration](../code-signing/ios-code-sining/#automatic-code-signing). 

### Changing the app icon

We have added the option to change the app icon displayed on Codemagic. This can be done under Repository settings via the **Change application icon** option which enables you to upload a new image. The image must be in `png` format and can be up to 1MB in size. 

### Codemagic YAML configuration *beta*

You can now export your Codemagic configuration from app settings as a `codemagic.yaml` file and keep it in your repository for build configuration. Exporting build configuration is currently supported for Android and web apps only. We invite our users to try it out and share the feedback with us.

### Concurrent builds for teams

Teams on Codemagic now have Magic seats available in addition to regular team seats. Purchasing a Magic seat increases your team's build concurrency by 1, allowing to run several builds in parallel. Read more about Magic seats on our [blog](https://blog.codemagic.io/get-additional-build-concurrency-with-magic-seats/) and check out the pricing details [here](https://codemagic.io/pricing/).

## September 2019

### Codemagic CI/CD GitHub app *beta*

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
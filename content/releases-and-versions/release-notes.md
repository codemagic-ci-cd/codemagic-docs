---
description: Information about Codemagic feature releases
title: Release notes
weight: 1
---

## August 2020

### Using App Store Connect API for Apple Developer Portal integration

Instead of creating a session with Apple Developer Portal, we are now using App Store Connect API keys for authentication. This means there will be no more expiring sessions or hassle with two-factor authentication when using automatic code signing. It is possible to set up several keys for code signing and select the right key in workflow settings. See how to [set up the Apple Developer Portal in Codemagic app](../code-signing/ios-code-signing/#automatic-code-signing) for builds that are configured in the UI. When building with `codemagic.yaml`, the API keys are added in the configuration file, see the instructions [here](../code-signing-yaml/signing-ios).

### Support for multiple team owners

Codemagic teams can now have multiple team owners. Team owners can manage team integrations, add or remove team members and set up billing. Team owners can also upgrade members to owners or downgrade other owners to member. Read more about how teams work [here](../teams/teams).

## July 2020

### New project setup guide

Codemagic launches a new project setup guide that makes building and configuring your **Flutter, native iOS, Android** and **React Native** projects even easier.

To give all mobile projects an even smoother and faster lift-off, we have updated our first build flow. Instead of having a default workflow without any configuration, you can just click **Set up build** when starting your first build, select the project type that you’re about to build, update it based on your needs and start building!

If you are not building a Flutter project, you still need to use the `codemagic.yaml` file to configure the workflow, but with a click of a button, you will get a template that suits your selected project type that you can modify according to your needs. You can read step-by-step examples of using the `codemagic.yaml` file to configure [native Android](https://blog.codemagic.io/native-android-getting-started-guide-with-codemagic-cicd/), [native iOS](https://blog.codemagic.io/native-ios-getting-started-guide-with-codemagic/) and [React Native](https://blog.codemagic.io/react-native-getting-started-guide-with-codemagic/) apps on our blog.

### Cancel pending builds

We have added a much-requested feature to cancel ongoing and queued webhook-triggered builds on push and pull request commit when a new build has been triggered for the same branch. This is convenient when you’re making several commits and don’t want to wait for the previous builds to finish while you’re only interested in the build for the most recent commit. 

You can enable this feature in the UI by navigating to **App settings > Build triggers > Automatic build triggering** and selecting **Cancel outdated webhook builds**, or by setting `cancel_previous_builds: true` in the [triggering section](../getting-started/yaml/#triggering) of the YAML file.

> If you’re interested in running builds in parallel, get in touch with our sales team through the [Codemagic business page](https://codemagic.io/enterprise/).

## June 2020

### New billing model

We have moved to a post-paid billing model that comes with a more consistent billing experience and premium features, such as Mac Pro builds. Read more about what changed, who wins from this and how to take advantage of the new billing model on [our blog](https://blog.codemagic.io/codemagic-new-billing/). If you are interested in numbers, check out our updated [pricing page](https://codemagic.io/pricing/) for a quick overview of free and paid features. A short guide for selecting Mac Pro as the machine type is available in our [documentation](../building/machine-type/).

The new billing model will apply to all new users and teams signing up after 1st of June, 2020 as well as to existing users that have not purchased any paid build minutes or team seats. However, all existing users will be able to opt in for the improved billing model.
If you have any questions or concerns, do not hesitate to reach out in our [#pricing channel](https://codemagicio.slack.com/archives/CHWC14F17).

### Adding company details to the invoice

We are continuing to improve our new billing model, and the first improvement is here!
You can now provide your company details, such as company name, address or VAT number, in order to see them on the invoice and specify a billing email for receiving invoices. You can enter the company details in team or user settings when enabling billing and adding a new credit card, or by clicking **Update billing details** on the right sidebar when you have already enabled billing.

## May 2020

### Increase or decrease maximum build duration

You can now have control over the maximum build duration and set a different value per each workflow. If the build reaches the set limit, it will end with a timeout. The default value is 60 minutes and the maximum value is 120 minutes.
Note that timeouts do not consume any build minutes. See the relevant documentation [here](../building/timeout/).

## April 2020

### Dynamic workflows with Codemagic API

You can now configure your build and Flutter/Xcode/Cocoapods versions dynamically using API. If you have several similar workflows, you can now combine them into one and create parametrized API calls. This way you can run your workflows without having to change the settings in UI or in `codemagic.yaml`.

See [our documentation](../rest-api/builds/) or the <a href="https://blog.codemagic.io/dynamic-workflows-with-codemagic-api/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','dynamic-workflows-with-codemagic-api')">article about dynamic workflows</a> for more information.

## March 2020

### More options to configure your build environment

We recently updated the UI in the Build section of app settings with a dropdown field for `CocoaPods` version selection to make it easier to build with the versions required by your app. With `codemagic.yaml`, you have even more options available and can define which `Flutter`, `Xcode`, `CocoaPods`, `Node` and `npm` version to use for the build. See how to define software versions in YAML file [here](../building/yaml#environment).

### Remote access to build machine via VNC

We have good news to everyone developing on Windows or Linux. You can now launch and interact with graphical applications on the remote macOS machine running your build and perform actions you can only do on mac hardware:

* Configure Xcode project settings

* Create a developer certificate for iOS code signing

* Launch iOS app on simulator

* Set up CocoaPods, etc.

Your project is already available on the machine, so it’s easy to run your iOS app on simulator. To find out more, see the [documentation](../troubleshooting/accessing-builder-machine-via-ssh) or <a href="https://blog.codemagic.io/remote-access-to-virtual-mac-build-machine/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','remote-access-to-virtual-mac-build-machine')">our detailed blog post about remote access.</a> 

### Toggles for enabling/disabling publishing options

We have improved Codemagic UI for publishing options and added the **Enabled** checkbox to the settings that allows to easily enable or disable an option. This way you no longer have to delete the configuration in order to turn off the feature for a workflow. In addition, the enabled/disabled status is displayed for each publishing option when you open the Publish section, so you can have a better overview of what the workflow is configured to do.

## February 2020

### Codemagic CLI tools

We have developed a variety of CLI utilities to assist with building, code signing and publishing apps, collectively known as Codemagic CLI tools: https://github.com/codemagic-ci-cd/cli-tools. The CLI tools are open source, so you are welcome to install them locally as well as share feedback and contribute.

### YAML for iOS

In addition to using `codemagic.yaml` for building Android and web projects, you can now use it to build, code sign and publish iOS apps. If you are interested in getting started with YAML, check out our [documentation](../building/yaml) or <a href="https://blog.codemagic.io/how-to-add-flutter-modules-to-native-ios-project-and-test-it-on-codemagic/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','how-to-add-flutter-modules-to-native-ios-project-and-test-it-on-codemagic')">this article</a> about using YAML when building a Native iOS project.

## January 2020

### Rescan application

Rescanning the application updates the repository settings in Codemagic. This is useful when you have moved or renamed your repository, moved the Flutter project inside the repository or renamed the folder containing the project. The **Rescan application** option is available in **App settings > Repository settings**. Additionally, you can now see the path of the `pubspec.yaml` file that is used for building in **App settings > Build > Project file path**.

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

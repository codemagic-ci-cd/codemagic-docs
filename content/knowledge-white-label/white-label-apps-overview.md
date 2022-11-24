---
description: An overview of white labeling with Codemagic
title: White labeling overview
weight: 1
aliases:
  - /getting-started/white-label-apps
  - /knowledge-others/white-label-apps
---

In the context of CI/CD, “white labeling” refers to automating the process of rebranding your core app for each customer and then publishing the app to stores or other distribution channels. 

A white labeling pipeline will run scripts to change colours, logos, images, fonts and update other app settings such as bundle identifiers, provisioning profiles, certificates, API endpoints, and other configuration settings unique to each customer. 

These workflows can also be configured to run unit and integration tests, code quality analysis, update release notes, and automatically distribute app builds to your testers. 

Builds can be configured to start as soon code is pushed to your repository, tags are added, or a pull request is merged. Using different workflows on different branches allows you to carry out actions such as producing a build for devs only to try on their own device, or creating a build that is sent directly to your QA testers.

## Pre-requisites for white labeling

If you are building white label apps for multiple customers, you will need access to the appropriate Apple API keys or Google Service Accounts for publishing to their store accounts. 

You will also need to make sure that distribution certificates, bundle ids, provisioning profiles, APNS certificates, analytics configurations etc. are available for each version of the app you are going to build. 

In order to write your white labeling scripts, familiarity with shell scripting will also be an advantage. You can find some samples for common tasks [here](./white-label-scripts/).

## Flavors versus a white labeling workflow

With flavors you create different versions of your app within the same project. They are typically used when you would like to create a handful of different versions of your app so you can create a “development” build, a “qa” build and a “production” build. Each version might be configured to point to a different API endpoint, or have a different icon to show which version it is so it’s clear which app is being used when testing the app.

In Xcode you add different build schemes which can be used to customise the project output. Similarly, in Android Studio you can create product build variants and create a separate folder for each flavor’s resources.

If you only needed to white label a few versions of your app then you could use this approach to build different versions of your app. However, it’s not very scalable and creates an unnecessarily large project and makes it harder to automate the white label process.

An automated white label workflow, on the other hand, doesn’t require that your app has multiple schemes or flavors configured in your Xcode or Android project. When the app is built, a series of scripts are run which change the project’s properties and change things like icons, images, fonts, and values in xml and plist files. In this way, a single base app can be used to create as many different versions as you need without having to add the customisations directly to the project.



## Limitations of white label workflows

Neither Apple nor Google provide APIs that allow you to add a new application programmatically in their stores. This means you have to manually add the first version of a new application in the App Store or Google Play. Once this has been done it’s possible to automatically publish updated app builds to the stores. Tasks such as updating screenshots and descriptions or other meta data can be updated using third party tools such as Fastlane.

## Pricing for building white label apps

There is no extra charge for setting up white label workflows with Codemagic. However, if you are white labeling many versions of your app you might want to add additional concurrencies so multiple versions can be built in parallel. 

Codemagic’s **pay-as-you-go plan** lets you use up to three concurrencies, whereas **Annual** and **Enterprise** plans have three concurrencies by default and you can add additional concurrencies as your needs grow. 

You can find detailed pricing information [here](https://docs.codemagic.io/billing/pricing/).

## Parallel white label builds

If you have a large number of white label apps, it can take many hours to build and publish them all. Fortunately, with Codemagic it is possible to use multiple concurrencies to run builds in parallel. 

This means that if you have 40 white label app versions to build and you have 3 concurrencies available, the first 3 builds will start immediately and the remaining 37 builds will be queued for building. As soon as one of the first builds completes, the next build in the queue will start and so on until all the builds are complete.

## Testing your white label apps

Running automated static code analysis, unit tests, or integration tests as part of a white label workflow is one way to ensure that all code meets expected standards before it is deployed to production. This is particularly important on `dev` or `qa` branches before any PR requests are merged into the production branch. 

In a Flutter project, for example, unit tests can be run using the following script:

{{< highlight yaml "style=paraiso-dark">}}
  name: Unit tests
  script: | 
    mkdir -p test-results
    flutter test --machine > test-results/flutter.json
{{< /highlight >}}

For more information on running tests for native iOS and Android, React Native please find more information [here](../yaml-testing/testing/).

Integration tests can be run on the simulators or emulators on Codemagic’s machines, but it’s also possible to integrate your workflows with external testing services where your iOS and Android apps can be tested on a variety of device configurations and real devices. 

There are many services to choose from, but here are some popular choices:

- [Firebase Test Lab](https://docs.codemagic.io/yaml-testing/firebase-test-lab/)
- [Emulator.wtf](https://docs.codemagic.io/yaml-testing/emulator-wtf/)
- [LamdaTest](https://docs.codemagic.io/integrations/lambdatest-integration/)

## Distributing builds to developers or QA testers

In addition to unit and integration testing, developers and QA teams still want to get hands on with their apps to test bug fixes and new functionality. Pre-release apps can be distributed in any of the following ways:

- Install the app directly from Codemagic notification emails.
- Configure Codemagic’s Slack integration and install build artifacts directly from notification messages.
- Use the QR code in the Codemagic web app to install the app directly to your device.
- Use the public build dashboards feature to make builds available for download.
- Configure your workflows to upload your app to Firebase App Distribution or other third party distribution services.
- Publishing development builds to TestFlight for internal or external test groups.
- Publish your pre-release to a testing track in Google Play Console.

## Optimizing build speed

It’s possible to build both iOS and Android apps on macOS machines, but we would recommend building iOS apps on macOS and Android apps on Linux machines to get the fastest possible builds. You should, therefore, create separate workflows for iOS and Android builds and set the `instance_type` property in your codemagic.yaml. 

- For iOS, use the latest Apple Silicon M1 machine where possible. Set the instance type to `mac_mini_m1` in the `codemagic.yaml` configuration file.
- For Android builds, use premium Linux machines. Set the instance type to `linux_x2` in the codemagic.yaml configuration file.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-dev-release:
    name: iOS dev release
    instance_type: mac_mini_m1
  ....

  android-dev-release:
    name: Android dev release
    instance_type: linux_x2
  ....
  {{< /highlight >}}

## Getting started with white labeling on Codemagic

We would recommend getting familiar with setting up a single version of your app to begin with. Set up your workflow using a codemagic.yaml configuration file and consult the documentation to understand core concepts, such as using environment variables, build triggers, script steps, code signing and publishing. Once you have successfully built and published a version of your app to the stores, continue by adding additional versions to your configuration file. 

For more information about getting started with the **codemagic.yaml** configuration file, please refer to the documentation [here](../yaml/yaml-getting-started/).

Once you are familiar with how Codemagic works, you should try your automation scripts on your local machine to test things like authenticating with your own CMS system, or running scripts that change application assets, such as icons or images. You can even use Codemagic's open-source [CLI tools](https://github.com/codemagic-ci-cd/cli-tools) to test features such as code signing and publishing. Once you are confident that your scripts work as expected, you can then set up your workflow on Codemagic.

## Next steps

Check out some sample white labeling script examples [here](./white-label-scripts/).
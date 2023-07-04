---
title: Migrating from GitHub Actions
description: How to Migrate your Projects from GitHub Actions to Codemagic
weight: 1
aliases:
  - /migration-guides/migrating-from-github-actions/
---

If you're considering switching from GitHub Actions to Codemagic for a more streamlined CI/CD workflow for your mobile-focused apps, particularly for Flutter apps, this guide will help you understand Codemagic's key features and how you can quickly transition from your GitHub Actions setup.

## Why consider migrating?
GitHub Actions is a powerful automation tool that allows you to build, test, and deploy your applications right from GitHub. However, if you're working on Flutter or mobile-focused applications, you could find Codemagic more beneficial. As a dedicated CI/CD for Flutter and mobile apps, Codemagic provides a set of predefined workflows and out-of-the-box configurations tailored for Flutter, Native iOS/Android and React Native app development.

By moving to Codemagic, you benefit from:

- Streamlined Flutter-specific workflows.
- No need to manually script CI/CD workflows.
- Pre-configured testing, building, and deployment workflows.
- Automated code signing and app store distribution.

Codemagic offers a straightforward YAML configuration and an up-to-date tech stack including the latest Xcode, macOS and Flutter versions making your CI/CD process smooth and efficient.

Codemagic makes use of [`codemagic.yaml`](../yaml/yaml-getting-started/) for configuring your workflow. As Codemagic supports any Git-based cloud or self-hosted repository, there is no need to migrate your code - simply add a `codemagic.yaml` file to your repository root folder.

In Codemagic, there is also a web-based GUI [Flutter workflow editor](../flutter-configuration/flutter-projects/) for Flutter applications, which simplifies the setup but removes some flexibility.

## Managing builds on GitHub Actions and on Codemagic

A build on Codemagic is defined by the a workflow, specified in the `codemagic.yaml` file. It comprises a series of sequential steps defined in a workflow executed by Codemagic on a clean virtual machine. 

You can monitor your app's builds on the Codemagic dashboard or look through the build logs on your app's individual 'Builds' page.

## Triggering builds on GitHub Actions and Codemagic

In this section, we illustrate how you can trigger builds on Codemagic.

The 'Run Workflow' feature in GitHub Actions corresponds with manually starting a build on Codemagic. To start a build manually on Codemagic, click the 'Start new build' button on [your apps page](https://codemagic.io/apps).

The 'Scheduled Workflows' function in GitHub Actions is similar to the 'Scheduled Builds' function on Codemagic. You can schedule builds in Codemagic by clicking on the "cog icon" [your apps page](https://codemagic.io/apps) and then selecting the "Scheduled builds" tab for options for scheduling builds.

A significant advantage of Codemagic is that you don't have to manually set up a cron job, as you would in GitHub Actions, to schedule a specific time. Instead, select a day/s from the timeline and specify an hour and month.

For any Git-related events, such as pushing commits, pull requests, and creating Git tags, you can configure triggers that automatically initiate a build on Codemagic.

The 'Dependent Jobs' feature of GitHub Actions is analogous to chaining workflows together on Codemagic, where workflows are executed sequentially. It's quite straightforward to chain workflows together on Codemagic.

You can also trigger builds by from any other remote system using webhooks. Codemagic has existing integrations with GitHub as well as other Git hosting providers: GitLab and Bitbucket.

You can also push back build status reports to GitHub and the other supported Git providers (GitLab & Bitbucket).

## Migrating Actions to Codemagic

### Setting up Ruby 

The GitHub Actions [`setup-ruby`](https://github.com/ruby/setup-ruby) workflow runs tasks on a virtual machine with the specified version of Ruby. In Codemagic, you would accomplish the equivalent tasks using the environment and scripts sections of the workflow.

GitHub Actions Example:

{{< highlight Shell "style=rrt">}}
name: My workflow
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.0' # Not needed with a .ruby-version file
        bundler-cache: true # runs 'bundle install' and caches installed gems automatically
    - run: bundle exec rake
{{< /highlight >}}

Codemagic's environment section allows you to specify the Ruby version to use with a single line:

{{< highlight Shell "style=rrt">}}
workflows:
  workflow-name:
    name: My workflow
    environment:
      vars:
      ruby: '3.0'
    scripts:
      - name: Check out code
        script: git clone https://github.com/user/repo.git .
      - name: Bundle Install
        script: bundle install --path vendor/bundle
      - name: Run Tests
        script: bundle exec rake
{{< /highlight >}}

In the Codemagic example, the environment section manages the Ruby versioning. This is simpler and more straightforward than the GitHub Actions setup. Once again, replace https://github.com/user/repo.git with the URL of your actual repository.

### Setting up Xcode 

The GitHub Actions `setup-xcode` workflow sets the Xcode version on a macOS virtual machine. Codemagic, being geared towards mobile application builds, handles Xcode versioning in a more straightforward manner.

GitHub Actions Example:

{{< highlight Shell "style=rrt">}}
jobs:
  build:
    runs-on: macos-latest
    steps:
    - uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: latest-stable
{{< /highlight >}}

Codemagic Example:

{{< highlight Shell "style=rrt">}}
workflows:
  workflow-name:
    environment:
      vars:
        xcode: latest 
{{< /highlight >}}
        
In the above Codemagic yaml, the Xcode version is set in the environment variables section with `xcode: latest`. This will use the latest stable version of Xcode for the build. Codemagic takes care of the rest, simplifying the setup process.

## GitHub Actions Examples

When you create a new native iOS project, GitHub Actions provides you with three templates. The simplest one is for setting up a Swift Package: 

{{< highlight Shell "style=rrt">}}
name: Swift

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v3
    - name: Build
      run: swift build -v
    - name: Run tests
      run: swift test -v
{{< /highlight >}}

Let's convert the above workflow to a Codemagic workflow with similar functionality:

{{< highlight Shell "style=rrt">}}
workflows:
  swift-workflow:
    name: Swift
    triggering:
      events:
        - push
        - pull_request
      branch_patterns:
        - pattern: main
          include: true
          source: true
    scripts:
      - name: Build
        script: swift build -v
      - name: Run tests
        script: swift test -v
{{< /highlight >}}

We can now go through the example line by line to explain the differences between the workflow yaml  configurations. 

`workflows` is the root key for defining workflows in `codemagic.yaml`. `swift-workflow` is the unique identifier for the workflow. and `Swift` is the name of the workflow, similar to how it is named in GitHub Actions.

{{< highlight Shell "style=rrt">}}
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
{{< /highlight >}}

The next part is about triggering the workflow on the `main` branch for push and pull requests.

In Codemagic, we do this by defining a section called as `triggering` for the triggering conditions for the workflow. Then, we have the `events` on which we trigger the workflow. In this case, the workflow is triggered by `push` and `pull_request` events. 

Finally, the `branch_patterns` defines the branches that trigger the workflow. In this case, the workflow is triggered on the `main` branch. `include: true` means that the workflow will be triggered for the branches that match the pattern. and `source: true` means that the workflow will be triggered for source events that match the pattern (i.e. when the source, normally a Pull Request, is a branch that matches the pattern).

{{< highlight Shell "style=rrt">}}
triggering:
  events:
    - push
    - pull_request
   branch_patterns:
     - pattern: main
     - include: true
     - source: true
{{< /highlight >}}

Then, similar to how you have `steps` on GitHub Actions, you have a similar property named `scripts` on Codemagic. You provide the name of the script and then the script for it.

So, the `steps` of GitHub Actions: 
{{< highlight Shell "style=rrt">}}
steps:
  - uses: actions/checkout@v3
  - name: Build
     run: swift build -v
  - name: Run tests
     run: swift test -v
{{< /highlight >}}

Becomes `scripts` in Codemagic: 

{{< highlight Shell "style=rrt">}}
scripts:
  - name: Build
    script: swift build -v
  - name: Run tests
    script: swift test -v
{{< /highlight >}}

This `codemagic.yaml` will only trigger builds on pushes and pull requests to the main branch, matching the original GitHub Actions workflow.

## Real-World Examples: MusadoraKit

[MusadoraKit](https://github.com/rryam/MusadoraKit) is an open source s a Swift framework that uses the latest MusicKit and Apple Music API. It makes a good example for building and testing on all Apple Platforms as well as for a sample native iOS app to send to TestFlight. Here we procvi for moving its configuration from Github Actions to Codemagic.

GitHub Actions workflow configuration: 

{{< highlight Shell "style=rrt">}}
name: CI/CD

on:
  push:
    paths:
      - 'Sources/**'
      - 'Tests/**'
      - 'Musadora/**'
  pull_request:
    paths:
      - 'Sources/**'
      - 'Tests/**'
      - 'Musadora/**'

jobs:
  musadorakit:
    name: MusadoraKit Workflow
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up environment
        run: |
          echo "XCODE_SCHEME=MusadoraKit" >> $GITHUB_ENV
          echo "APP_ID=Musadora" >> $GITHUB_ENV
      - name: Build Framework
        run: |
          #!/bin/zsh

          declare -a DESTINATIONS=("platform=iOS Simulator,name=iPhone 14" "platform=watchOS Simulator,name=Apple Watch Series 8 (45mm)" "platform=tvOS Simulator,name=Apple TV 4K (3rd generation)" "platform=macOS")
          for DESTINATION in "${DESTINATIONS[@]}"
            do
              xcodebuild clean build \
                -scheme "$XCODE_SCHEME" \
                -destination "$DESTINATION" \
                -skipPackagePluginValidation
          done
      - name: Test Framework
        run: |
          #!/bin/zsh
          
          declare -a DESTINATIONS=("platform=iOS Simulator,name=iPhone 14" "platform=watchOS Simulator,name=Apple Watch Series 8 (45mm)" "platform=tvOS Simulator,name=Apple TV 4K (3rd generation)" "platform=macOS")
          for DESTINATION in "${DESTINATIONS[@]}"
            do
              set -o pipefail
              xcodebuild clean test \
                -scheme "$XCODE_SCHEME" \
                -destination "$DESTINATION" \
                -skipPackagePluginValidation | xcpretty --report junit
          done
        # The following step is required to create and upload a test report
        # You need to install the actions/upload-artifact action if not installed
        #- name: Upload test report
        #  uses: actions/upload-artifact@v2
        #  with:
        #    name: test-report
        #    path: build/reports/junit.xml

  musadorakit-update-docs:
    name: MusadoraKit Docs Update Workflow
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update DocC Documentation
        run: |
          #!/bin/zsh

          swift package --allow-writing-to-directory ./docs \
          generate-documentation --target MusadoraKit \
          --disable-indexing \
          --transform-for-static-hosting \
          --hosting-base-path MusadoraKit \
          --output-path ./docs

          git add .
          git commit -m "[skip ci] Update DocC Documentation"
          git pull --ff-only
          git push origin ${{ github.ref }}
{{< /highlight >}}

Codemagic example: 

{{< highlight Shell "style=rrt">}}
definitions:
  triggering:
    push: &events
      events:
        - push
        - pull_request
  email: &email
    email:
      recipients:
        - example@gmail.com
      notify:
        success: true
        failure: true
workflows:
  musadorakit:
    name: MusadoraKit Workflow
    instance_type: mac_mini_m1
    environment:
      vars:
        XCODE_SCHEME: "MusadoraKit"
        APP_ID: "Musadora"
    when:
      changeset:
        includes:
          - 'Sources'
          - 'Tests'
    triggering:
      <<: *events
    scripts:
      - name: Build Framework
        script: |
          #!/bin/zsh

          declare -a DESTINATIONS=("platform=iOS Simulator,name=iPhone 14" "platform=watchOS Simulator,name=Apple Watch Series 8 (45mm)" "platform=tvOS Simulator,name=Apple TV 4K (3rd generation)" "platform=macOS")
          for DESTINATION in "${DESTINATIONS[@]}"
            do
              xcodebuild clean build \
                -scheme "$XCODE_SCHEME" \
                -destination "$DESTINATION" \
                -skipPackagePluginValidation
          done
      - name: Test Framework
        script: |
          #!/bin/zsh
          
          declare -a DESTINATIONS=("platform=iOS Simulator,name=iPhone 14" "platform=watchOS Simulator,name=Apple Watch Series 8 (45mm)" "platform=tvOS Simulator,name=Apple TV 4K (3rd generation)" "platform=macOS")
          for DESTINATION in "${DESTINATIONS[@]}"
            do
              set -o pipefail
              xcodebuild clean test \
                -scheme "$XCODE_SCHEME" \
                -destination "$DESTINATION" \
                -skipPackagePluginValidation | xcpretty --report junit
          done
        test_report: build/reports/junit.xml
    publishing:
      <<: *email

  musadorakit-update-docs:
    name: MusadoraKit Docs Update Workflow
    instance_type: mac_mini_m1
    environment:
      groups:
        - GitHub
    when:
      changeset:
        includes:
          - 'Sources'
          - 'Musadora'
        excludes: 
          - '**/*.md'
    scripts:
      - name: Update DocC Documentation
        script: |
          #!/bin/zsh

          swift package --allow-writing-to-directory ./docs \
          generate-documentation --target MusadoraKit \
          --disable-indexing \
          --transform-for-static-hosting \
          --hosting-base-path MusadoraKit \
          --output-path ./docs

          git add .
          git commit -m "[skip ci] Update DocC Documentation"
          git remote set-url origin https://rudrankriyam:$token@github.com/rryam/MusadoraKit.git
          git pull --ff-only
          git push origin main

  musadora: 
    name: Musadora TestFlight Workflow
    working_directory: Musadora
    instance_type: mac_mini_m1
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.rudrankriyam.musadora
      vars:
        XCODE_PROJECT: "Musadora.xcodeproj"
        XCODE_SCHEME: "Musadora"
        APP_ID: "1578765152"
    integrations:
      app_store_connect: Rudrank ASC API Key
    triggering:
      <<: *events
    when:
      changeset:
        includes:
          - 'Sources'
          - 'Musadora'
        excludes: 
          - '**/*.md'
    scripts:
      - name: Set up provisioning profiles settings on Xcode project
        script: xcode-project use-profiles
      - name: Increment build number
        script: |
          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-testflight-build-number "$APP_ID")
          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa \
            --project "$XCODE_PROJECT" \
            --scheme "$XCODE_SCHEME" \
            --archive-flags "-destination 'generic/platform=iOS' -skipPackagePluginValidation"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
    publishing:
      <<: *email
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        beta_groups:
          - Testers
        submit_to_app_store: false
{{< /highlight >}}

Note how Codemagic has native integration for sending to TestFlight and App Store.

## 3rd Party Integrations

There are many Actions in the marketplace that you usually use with GitHub Actions workflow. One of the popular collections is the [Apple GitHub Actions](https://github.com/Apple-Actions), which is a collection of GitHub Actions for building CI/CD pipelines for apps on Apple operating systems.

These help with importing code-signing certificates into the keychain, downloading provisioning profiles from Apple AppStore Connect, uploading the build to Apple TestFlight and App Store, etc.

Being a mobile-focused CI provider, Codemagic has built-in integrations for all the above cases to make it easier to work with them.

### Import Code Signing 

On GitHub Actions, the `apple-actions/import-codesign-certs@v2` action is used for importing code signing certificates for an iOS application. This action takes the base64-encoded p12 file and password as secrets and uses them to set up the environment for code signing.

{{< highlight Shell "style=rrt">}}
uses: apple-actions/import-codesign-certs@v2
with: 
  p12-file-base64: ${{ secrets.CERTIFICATES_P12 }}
  p12-password: ${{ secrets.CERTIFICATES_P12_PASSWORD }}
{{< /highlight >}}

In Codemagic, manual code signing for iOS applications is handled differently. It requires you to upload the certificate (.p12) and provisioning profile (.mobileprovision) directly to the Codemagic dashboard. After uploading, Codemagic assigns an ID to these files, which you can then reference in your codemagic.yaml file if you want.

### Downloading Profiles 

In GitHub Actions, the `apple-actions/download-provisioning-profiles@v1` action is used for downloading the provisioning profiles from App Store Connect.

In Codemagic, you usually upload the provisioning profile directly to the Codemagic dashboard, which then assigns an ID that can be used in the codemagic.yaml file.

{{< highlight Shell "style=rrt">}}
jobs:
  build:
    runs-on: macOS-latest
    steps:
    - name: 'Download Provisioning Profiles'
      id: provisioning
      uses: apple-actions/download-provisioning-profiles@v1
      with: 
        bundle-id: 'com.example.App'
        profile-type: 'IOS_APP_STORE'
        issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
        api-key-id: ${{ secrets.APPSTORE_KEY_ID }}
        api-private-key: ${{ secrets.APPSTORE_PRIVATE_KEY }}
  
    - name: 'Another example step'
      run: echo ${{ steps.provisioning.outputs.profiles }}
{{< /highlight >}}

{{< highlight Shell "style=rrt">}}
scripts:
  - name: Set up provisioning profiles settings on Xcode project
    script: xcode-project use-profiles
{{< /highlight >}}

### Uploading to TestFlight 

In GitHub Actions, you can use the `apple-actions/upload-testflight-build@v1` action to upload the app to TestFlight.

{{< highlight Shell "style=rrt">}}
- name: 'Upload app to TestFlight'
  uses: apple-actions/upload-testflight-build@v1
  with: 
    app-path: 'path/to/application.ipa' 
    issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
    api-key-id: ${{ secrets.APPSTORE_API_KEY_ID }}
    api-private-key: ${{ secrets.APPSTORE_API_PRIVATE_KEY }}
{{< /highlight >}}

In Codemagic, however, you would set up the TestFlight publishing under the publishing key in the `codemagic.yaml` that has built in support for uploading to TestFlight and to different beta groups.

{{< highlight Shell "style=rrt">}}
publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        beta_groups:
          - Testers
        submit_to_app_store: false
{{< /highlight >}}

## Environment Variables 

Both providers allow you to set environment variables in your workflows. Environment variables are used to adjust the execution environment, for example, by pointing to different file locations, specifying a build version, or managing secret data like API keys.

In GitHub Actions, environment variables are set up within the GitHub Actions workflow configuration file or through the repository settings under **Secrets**. They can be used directly within your workflow file or in scripts. 

Codemagic provides a similar way to manage environment variables. You can set them up in your Codemagic app settings or directly in the `codemagic.yaml` file. It offers additional security for sensitive data through the **encryption** feature for environment variables.

Moving from GitHub Actions to Codemagic involves transferring these environment variables from GitHub Actions to Codemagic. This process includes identifying the variables in your GitHub workflows and then adding them to Codemagic while handling any sensitive data.

### In GitHub Actions

Identify the environment variables in your GitHub Actions workflows. These are typically defined in the env section of a job, step, or at the workflow level. For example:

{{< highlight Shell "style=rrt">}}
env:
  MY_SECRET: ${{ secrets.MY_SECRET }}
  MY_PUBLIC_VARIABLE: 'Hello, world!'
{{< /highlight >}}

In Codemagic:
- Open your app settings in Codemagic and navigate to the Environment variables section.
- Click on **Add new** to add a new environment variable. Enter the variable name (for example, MY_SECRET) and its corresponding value. Repeat this step for all the environment variables that you want to migrate.
- Click on **Save** to save your changes.

### In Codemagic

In your `codemagic.yaml`, you can now reference these environment variables using the $ notation, for example:

{{< highlight Shell "style=rrt">}}
workflows:
  my-workflow:
    environment:
      vars:
        MY_SECRET: $MY_SECRET
        MY_PUBLIC_VARIABLE: 'Hello, world!'
{{< /highlight >}}

> Note: Make sure to respect any sensitive information and encrypt the variable in the Codemagic UI.


## Scheduling Builds

Both GitHub Actions and Codemagic provide features for scheduling your builds. This can be particularly useful for automating regular tasks such as nightly builds or regular checks against your codebase.

In GitHub Actions, scheduling is done through the `on.schedule` syntax in your workflow file. For example:

{{< highlight Shell "style=rrt">}}
on:
  schedule:
    - cron:  '0 0 * * *'
{{< /highlight >}}

This example triggers the workflow to run every day at midnight.

### Migrating Scheduled Builds to Codemagic

In Codemagic, scheduled builds can be set up using the UI in your application settings.

- Log in to Codemagic and select the project you wish to work on. In your project settings, go to **Scheduled Builds**, and click on **Add new schedule**
- You can now select a branch and set the build trigger time by specifying the build frequency and time.
- Click on **Save** to apply the scheduled build setting.

Note: Codemagic does not provide the ability to configure scheduled builds directly in the `codemagic.yaml` configuration file. It is supposed to be done through the user-friendly interface as described above.

## Webhooks

Webhooks provide a way for applications to be notified when specific events occur. GitHub Actions and Codemagic both support the use of webhooks, though the setup and configuration are a bit different for each. In GitHub, webhooks are set up at the repository level. You can configure a webhook to be triggered on specific events, such as a push to the repository, a pull request, or a new issue.

### Migrating Webhooks to Codemagic

In Codemagic, webhooks can be used to trigger builds automatically. Here is how you can set up a webhook in Codemagic:

- Log in to Codemagic and go to your app settings and choose **Webhook** option.
- Copy the provided URL, the Payload URL for this specific webhook.
- Use this webhook URL in your external services or systems to trigger builds in Codemagic. For instance, you might want to set it up in your repository to start a build in Codemagic whenever a push is made.
- Check for successful delivery by clicking on the **Refresh List** button. 
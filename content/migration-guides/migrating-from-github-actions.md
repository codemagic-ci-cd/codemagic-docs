---
title: Migrating from GitHub Actions
description: How to Migrate your Projects from GitHub Actions to Codemagic
weight: 1
aliases:
  - /migration-guides/migrating-from-github-actions/
---

If you're considering switching from GitHub Actions to Codemagic for a more streamlined CI/CD workflow for your mobile-focused apps, particularly for Flutter apps, this guide will help you understand Codemagic's key features and how you can quickly transition from your GitHub Actions setup.

## Why consider migrating?
GitHub Actions is a powerful automation tool that allows you to build, test, and deploy your applications right from GitHub. However, if you're working on Flutter or mobile-focused applications, you should find Codemagic more beneficial. As a dedicated CI/CD for Flutter and Mobile, Codemagic provides a set of predefined workflows and out-of-the-box configurations tailored for Flutter, Native iOS/Android and React Native app development.

By moving to Codemagic, you benefit from:
- No need to manually script CI/CD workflows.
- Streamlined Flutter-specific workflows.
- Pre-configured testing, building, and deployment workflows.
- Automated code signing and app store distribution.

Codemagic offers a straightforward YAML configuration and an up-to-date tech stack including the latest Xcode, macOS and Flutter versions making your CI/CD process smooth and efficient.

Codemagic makes use of [`codemagic.yaml`](../yaml/yaml-getting-started/) for configuring your workflow. As Codemagic supports any Git-based cloud or self-hosted repository, there is no need to migrate your code - simply add a `codemagic.yaml` file to your repository root folder.

In Codemagic, there is also a [Flutter workflow editor](../flutter-configuration/flutter-projects/) for Flutter applications, which simplifies the setup but removes some flexibility.

## Managing builds on GitHub Actions and on Codemagic
A build on Codemagic is defined by the app's workflow, specified in the `codemagic.yaml` file. It comprises a series of scripts delineated in a workflow executed by Codemagic on a clean virtual machine. 

You can monitor your app's builds on the Codemagic dashboard or delve into your build logs on your app's individual Builds page.

## Triggering builds on GitHub Actions and Codemagic
In this section, we illustrate how you can trigger builds on Codemagic:

The 'Run Workflow' feature in GitHub Actions corresponds with manually starting a build on Codemagic: click the 'Start new build' button on your builds page and either simply initiate a new build or modify the Advanced configuration options for starting/scheduling builds.

The 'Scheduled Workflows' function in GitHub Actions is akin to the 'Scheduled Builds' function on Codemagic. 

A significant advantage of Codemagic is that you don't have to manually set up a cron job, as you would in GitHub Actions, to schedule a specific time. Instead, select a day/s from the timeline and specify an hour and month.

For any Git-related events, such as code push, pull requests, and Git tags, you can configure triggers that automatically initiate a build on Codemagic.

The 'Dependent Jobs' feature of GitHub Actions is analogous to chaining workflows together on Codemagic, where workflows are executed sequentially. It's surprisingly straightforward to chain workflows together on Codemagic.

You can trigger builds by any other remote system: use Webhooks. Codemagic has integrations with GitHub, GitLab, and Bitbucket.

You can also push back build status reports to your Git provider (GitHub/GitLab/Bitbucket).

## Migrating Actions to Codemagic

### Setting up Ruby 
The GitHub Actions [`setup-ruby`](https://github.com/ruby/setup-ruby) workflow runs tasks on a virtual machine with a specified version of Ruby. In Codemagic, you would accomplish the equivalent tasks using the environment and scripts sections of the workflow.

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

Codemagic's environment section can handle the Ruby versioning, making it much simpler.

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
The GitHub Actions `setup-xcode` workflow sets the Xcode version on a macOS virtual machine. Codemagic, being geared towards mobile application builds, handles Xcode versioning in a very straightforward manner.

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
        
In this Codemagic example, the Xcode version is set in the environment variables section with `xcode: latest`. This will use the latest stable version of Xcode for the build. Codemagic takes care of the rest, simplifying the setup process.

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

Let's convert the Swift GitHub Actions workflow to a Codemagic workflow with similar functionality:

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

This `codemagic.yaml` will only trigger builds on pushes and pull requests to the main branch, matching the original GitHub Actions workflow.

## Real-World Examples: MusadoraKit
Here's a Swift Package for building and testing on all Apple Platforms as well as a sample native iOS app to send to TestFlight. Here is the migration for it.

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
        - rudrankriyam@gmail.com
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

Notice how Codemagic has native integration for sending to TestFlight and App Store.
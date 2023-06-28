---
title: FAQ
description: Frequently Asked Questions
weight: 6
aliases:
---

## Where are the build servers located?
Codemagic build servers are based in:
- South Carolina, North America for Linux and Windows machines
- Atlanta, Georgia for macOS machines

## Will Codemagic make permanent changes to my project?
Codemagic uses your source control system, such as GitHub, Bitbucket, or Gitlab, to get read-only access to the CI/CD features, such as list branches, set webhooks, get the latest commit information, update commit/PR statuses, etc. 

Codemagic protects the integrity of your source code and doesn’t alter the code unless you have explicitly specified so in the build scripts. The only exceptions here are some platform-specific files that would have to be modified for successful building. For example, Codemagic modifies the project files for iOS to specify code signing settings during the build and injects a Gradle plugin to the Android component to gather build information and information about the artifacts to be generated. However, all of these changes are temporary and do not alter the source code in your repository. The source code checked out during the build is deleted from the virtual machine after the build and never stored on Codemagic.

For a more detailed description, please refer to the [Security statement](https://codemagic.io/security-statement/).

## Is Codemagic really magic or just a clever trick of technology?
We can neither confirm nor deny that magic is involved.

## Can I trigger my builds to run automatically?
Codemagic offers several options for automating your CI/CD workflow. Builds can be [scheduled](https://docs.codemagic.io/yaml-running-builds/scheduling/) to start at specific times, configured to [trigger automatically](https://docs.codemagic.io/yaml-running-builds/starting-builds-automatically/) on repository events such as Pull requests or tag creation, and they can even be started externally through [REST API](https://docs.codemagic.io/rest-api/builds/) calls.

## Can workflows be scheduled to run at specific times?
Yes. To schedule workflows, follow [this guide](https://docs.codemagic.io/yaml-running-builds/scheduling/).

## How many builds can I run concurrently?
If you need to run parallel builds you can add additional concurrencies as your needs grow. The [pay-as-you-go](https://docs.codemagic.io/billing/pricing/#pricing-for-teams) plan includes one concurrency to begin with but can be increased to a total of three. The [Annual](https://docs.codemagic.io/billing/pricing/#annual-plan-with-20-discount) plan and [Enterprise](https://docs.codemagic.io/billing/pricing/#enterprise-plan) plans start with three concurrencies and an unlimited number of concurrencies can be added at any time during your subscription period.

## Can I build only the parts of my project that changed?
There are multiple ways to fine-tune and customize exactly how and when Codemagic builds are run. Follow [this guide](https://docs.codemagic.io/yaml-running-builds/starting-builds-automatically/#using-when-to-run-or-skip-builds) to configure a workflow to build only when watched files or folders have changed since the last successful build. This is particularly useful if your apps are kept in a mono repo and you want to limit a workflow to build only a single project folder.

## My project needs a specific version of Xcode or dependencies. Can I use non-default versions of these tools?
Codemagic allows you a lot of freedom and flexibility in choosing your tools and dependencies. You can check the exact software and hardware specifications of our [Linux](https://docs.codemagic.io/specs/versions-linux/), [macOS](https://docs.codemagic.io/specs/versions-macos/), and [Windows](https://docs.codemagic.io/specs/versions-windows/) build machines. If your project requires a different version of Xcode or some other tool, you can specify that in the [environment](https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/#environment) section of your `codemagic.yaml` file.

If you are building a Flutter project using Codemagic Workflow Editor, you can select the required versions for Flutter, Xcode, and CocoaPods directly from a dropdown list within the **Build** section.

## Does the $299 monthly cap on the pay-as-you-go plan mean my builds will stop working when I reach that amount?
Although it might seem a bit counterintuitive, Codemagic offers you an unlimited number of apps, build minutes, and team members while keeping the total price capped at $299 per month. You can use the service as little or as much as you need, and pay accordingly, but should you ever reach this upper cap, the rest of the month is on us - you can continue using the service for free.

## Why is my build shown as ‘queued’ and when will it start?
Depending on your concurrency settings, you may be able to run up to 3 builds in parallel on the standard plan. If any additional builds are triggered, they will wait in queue for one of the active builds to finish. If you need more than 3 parallel builds, additional concurrencies are available for purchase.
	
Builds can also be queued if there is a temporary spike in network traffic or a hardware issue in one of the data centers. However, these issues are normally resolved in a matter of minutes. Should you experience a longer delay, please contact our support team.

## I have used up my 500 free build minutes. How can I continue using the service?
The free build minutes are renewed at the start of each month. However, you can [enable billing](https://docs.codemagic.io/billing/billing/#enabling-billing) at any point and continue using the service at our standard prices in the meantime.

## Our company policy requires that Codemagic register as a vendor with third parties, sign an NDA, or fill out a security questionnaire. Is this possible?
If you require any of the listed advanced account services, they are available as part of our Enterprise plan. Find out more about [Enterprise plan benefits](https://codemagic.io/enterprise/).

## Do Teams get 500 free build minutes?
Free build minutes are reserved for personal and hobby projects.

## Does it cost extra to build white-label apps?
Because of the great freedom it offers in customizing your CI/CD workflows, Codemagic is a great choice for building white-label apps. Whether you want to utilize our REST API or the possibility to configure advanced Bash or Python scripts, Codemagic has you covered out of the box and without any extra costs.

## Can I pay annually and get a discount?
Most definitely. The annual subscription grants you a 20% discount for the whole plan, including any extra concurrencies.

## What’s an Enterprise plan?
The Enterprise plan offers the same superb quality service you have come to expect from Codemagic but enhanced with additional customization options. This plan is recommended if you need to go through a security compliance process, vendor registration or have special requirements such as an NDA, DPA, dedicated hosts, custom base images, or other account management services. Enterprise customers are also able to authenticate using SSO.

## How to Delete a Codemagic account?
If you need to delete your Codemagic account, navigate to **Teams** > **Personal Account** > **Danger zone** > **Delete account**
---
title: Previewing apps in the browser
description: Test your iOS or Android app in the browser with Stellar App Preview
weight: 4
aliases:
---

Stellar is our iOS simulator and Android emulator running in your browser. Launch and interact with your iOS or Android app right in the browser, regardless of the operating system you are using. Test your app against different device and OS configurations, emulate GPS location or demo the latest app version without needing access to a physical device. 

{{< youtube vb_pSHy9PG0 >}}

**Tip:** The following sections describe creating previewable artifacts using Flutter Workflow Editor. If you're using codemagic.yaml, follow the instructions [here](../yaml-testing/app-preview).

## Enabling App Preview and Free Trial

{{<notebox>}}
This feature is available for **teams** only. 
{{</notebox>}}

Teams on the **Pay as you go** plan can enable the feature via the **App Preview** page on the left sidebar and will get 100 free trial minutes. Once used up, further app preview minutes will be billed at the rate of $0.095/min and included in your monthly invoice.

Teams on annual plans can try out App Preview by [contacting us](https://codemagic.io/contact/).

## Creating iOS .app binaries for previewing on the simulator

You can preview any `.app` artifact built in Codemagic that targets the `iPhoneSimulator`. 

1. In the **Build** section of the Workflow Editor, set the **Mode** to **Debug**.
2. In the **Build arguments** field, add `--simulator` next to the iOS `--debug` section.
3. On a successful build, you will see the **Quick Launch** button available next to the `.app` artifact in the build overview.

## Creating Android .apk binaries for previewing on the emulator

You can preview any `.apk` artifact built in Codemagic. 

In the **Build** section of the Workflow Editor, select an Android build format that outputs an `.apk` file. On a successful build, you will see the **Quick Launch** button available next to the `.app` artifact in the build overview.

## Previewing apps 

Clicking **Quick Launch** next to a suitable artifact launches an iOS simulator or an Android emulator respectively with your app installed on it, right in your browser. 

To use a different device and OS combination, click the three dots on the controls menu and select **Change device**.

The preview session remains active for a maximum of **20 minutes** and is limited to one concurrent session by default. To end the ongoing session, select **Stop session** from the menu.

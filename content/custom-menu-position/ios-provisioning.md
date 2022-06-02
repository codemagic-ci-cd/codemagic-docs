---
title: Registering iOS test devices
description: Automatically add new test devices to Apple Developer Portal
weight: 4
slug: ../testing/ios-provisioning
menuCategories:
  - flutter-testing
  - yaml-testing
---

To be able to test iOS builds on physical devices outside TestFlight, e.g. by downloading the app artifact from Slack or a [public link](/yaml-publishing/build-dashboards), the test devices have to be registered in Apple Developer Portal and included in the provisioning profile used for code signing the app. Codemagic enables you to send your trusted testers a device registration link to obtain their device UDIDs and automatically add them to the list of devices in Apple Developer Portal.

{{<notebox>}}
This feature is available for [teams](../teams/teams) only. But if you are not using teams this has to be done manually by [Registering your devices using your Developer Account](https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices#Register-Devices-in-Your-Developer-Account).

You can also check the [Register Devices](https://help.apple.com/developer-account/#/dev40df0d9fa) section using Your Developer Account.
{{</notebox>}}

## Requirements

* You have to be a team owner to manage iOS test devices. 
* The **Apple Developer Portal integration** must be connected in **Team integrations** to be able to register new devices. This requires creating an App Store Connect API key with **Developer** permissions, see how to create one [here](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api).

## Creating a tester group

1. Navigate to **Teams > Your team > iOS test devices**.
2. Click **Create tester group**. A popup window appears with details about the tester group.
3. Enter the **Tester group name**. All the devices registered from this invitation will be added to this group in Codemagic.
4. Select the **Developer Portal API key**. The API key determines under which Apple Developer Portal account the devices will be registered.
5. Then enter the **Tester email addresses** that will receive the device registration link. Note that you can later send new invitations to add more devices to this group.
6. Finally, click **Send registration link**. 

To add devices to an existing group, find the group in the **Tester groups** section and click **Add new devices**. 

{{<notebox>}}
It is important to choose the actual bundle identifier when building an app instead of XC Wildcard, otherwise, the tester group will be unable to install the app and get the error "This app cannot be installed because its integrity could not be verified"
{{</notebox>}}

## Device registration

Your testers will receive an email with instructions to register a device. The registration link in email invitation is valid for 7 days.

The email contains a QR code and the **Register device** button to download a configuration profile that must be installed on the device. The configuration profile collects the device UDID and forwards it to Codemagic for registration. On successful registration, the device will be added to Apple Developer Portal and listed in the tester group in Codemagic.

## Deleting test devices and groups

To delete devices from a tester group, click the pencil icon next to the group to edit it and select the devices to be removed. 

To delete a tester group, click the bin icon next to the tester group. Deleting the group will also delete all registered devices in the group from Codemagic.

Note that deleting a device or a tester group from Codemagic does not remove the devices from Apple Developer Portal.

To remove devices from [Apple Developer Portal](https://developer.apple.com/), navigate to **Certificates, Identifiers & Profiles > Devices**, select a device and click **Disable**.

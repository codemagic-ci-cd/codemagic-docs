---
---

Codemagic allows you to preview your `.app` artifact on an iOS simulator and interact with the simulator via a web browser. You can easily test the functionalities of your app as well as system notifications and flows that require location data on different simulator devices without requiring a physical device.

{{<notebox>}}
Note that this feature is available for **teams** on request. Please [contact us](https://codemagic.io/contact/) for more information.
{{</notebox>}}

## Running preview builds

You can preview any `.app` artifact built in Codemagic that targets the iOS simulator. For such artifacts, there is a **Quick Launch** button available next to the artifact name on the build overview page.

Clicking **Quick Launch** displays a configuration popup for selecting the simulator device and runtime. Once you click **Start**, Codemagic starts a preview build during which the simulator is booted and the app is installed on the simulator. 

When the simulator is ready for use, you'll see the URL to access the simulator printed in the logs under the "Running iOS simulator" step as well as a link to open the simulator on the left panel of the build overview page. The simulator session remains active for a maximum of **20 minutes** or until you cancel the build. 

Once the session ends, you can start a new one if needed.

## Build minutes usage

Preview builds run on a macOS machine and consume build minutes at the same per-minute rate as regular builds. If your team is on the Pay as you go plan, the minutes used for app previews will be added to your macOS minutes count.

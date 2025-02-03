---
---

Codemagic allows you to preview your `.app` artifact on an iOS simulator and interact with the simulator via a web browser. You can easily test the functionalities of your app as well as system notifications and flows that require location data on different simulator devices without requiring a physical device.

{{<notebox>}}
Note that this feature is available for **teams** on request. Please [contact us](https://codemagic.io/contact/) for more information.
{{</notebox>}}

## Running preview builds

You can preview any `.app` artifact built in Codemagic that targets the `iPhoneSimulator`. For such artifacts, there is a **Quick Launch** button available next to the artifact name on the build overview page.

Clicking **Quick Launch** displays a configuration popup for selecting the simulator device and runtime. Once you click **Start**, Codemagic opens a simulator in a new tab and installs your application. The simulator session remains active for a maximum of **20 minutes**.

Once the session ends, you can start a new one if needed.

---
title: Adding the provisioning profile
---

Codemagic allows you to upload a provisioning profile to be used for the application or to fetch a profile from the Apple Developer Portal.

The profile's type, team, bundle id, and expiration date are displayed for each profile added to Code signing identities. Furthermore, Codemagic will let you know whether a matching code signing certificate is available in Code signing identities (a green checkmark in the **Certificate** field) or not.

{{< tabpane >}}

{{< tab header="Upload a profile" >}}
{{<markdown>}}
You can upload provisioning profiles with the `.mobileprovision` extension, providing a unique **Reference name** is required for each uploaded profile.

1. Open your Codemagic Team settings, go to  **codemagic.yaml settings** > **Code signing identities**.
2. Open **iOS provisioning profiles** tab.
3. Upload the provisioning profile file by clicking on **Choose a .mobileprovision file** or by dragging it into the indicated frame.
4. Enter the **Reference name** for the profile.
5. Click **Add profile**.
{{</markdown>}}
{{< /tab >}}

{{< tab header="Fetch from Developer Portal" >}}
{{<markdown>}}
You can automatically fetch the provisioning profiles from the Apple Developer Portal based on your team's App Store Connect API key. The bundle identifier is listed for every available profile along with it's name.

The profiles are displayed grouped by category: `Development profiles`, `Ad Hoc profiles`, `App Store profiles`, and `Enterprise profiles`. For each selected profile, it is necessary to provide a unique **Reference name**, which can be later used in `codemagic.yaml` to fetch the profile.

1. Open your Codemagic Team settings, go to  **codemagic.yaml settings** > **Code signing identities**.
2. Open **iOS provisioning profiles** tab.
3. Click **Fetch profiles**
4. Select the desired profile(s) and enter a **Reference name** for each one.
5. Click **Download selected**. (scroll down if necessary)

{{</markdown>}}
{{< /tab >}}


{{< /tabpane >}}
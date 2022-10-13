---
title: Reference certificate and profile in codemagic.yaml
---

To fetch all uploaded signing files matching a specific distribution type and bundle identifier during the build, define the `distribution_type` and `bundle_identifier` fields in your `codemagic.yaml` configuration. Note that it is necessary to configure **both** of the fields.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow 
    # ....
    environment:
      ios_signing:
        distribution_type: app_store # or: ad_hoc | development | enterprise
        bundle_identifier: com.example.id
{{< /highlight >}}

{{<notebox>}}
**Note:** If you are publishing to the **App Store** or you are using **TestFlight**  to distribute your app to test users, set the `distribution_type` to `app_store`. 

When using a **third party app distribution service** such as Firebase App Distribution, set the `distribution_type` to `ad_hoc`
{{</notebox>}}

When defining the bundle identifier `com.example.id`, Codemagic will fetch any uploaded certificates and profiles matching the extensions as well (e.g. `com.example.id.NotificationService`).

##### Using provisioning profiles

To apply the profiles to your project during the build, add the following script before your build scripts:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    # ... your dependencies installation
    
    - name: Set up code signing settings on Xcode project
      script: xcode-project use-profiles
    
    # ... your build commands
{{< /highlight >}}
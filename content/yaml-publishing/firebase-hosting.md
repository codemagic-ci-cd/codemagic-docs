---
title: Firebase Hosting
description: How to deploy an app to Firebase Hosting using codemagic.yaml
weight: 7
---

</p>
{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **codemagic.yaml**.
{{</notebox>}}

Publishing to Firebase Hosting with Codemagic is a straightforward process as the Firebase CLI is already pre-installed on our virtual machines. Please note that you will have to set it up for your project locally before publishing it to Firebase Hosting. You can find more information in the official [Firebase documentation](https://firebase.google.com/docs/hosting/quickstart).

1. To get started with adding Firebase Hosting to Codemagic, you will need to obtain your Firebase token. In order to do that, run the following in your local terminal:
{{< highlight bash "style=paraiso-dark">}}
firebase login:ci
{{< /highlight >}}

2. After running the command, your default browser should prompt for authorization to your Firebase project. When access is granted, the necessary token will appear in your terminal.
3. Open your Codemagic app settings, and go to the **Environment variables** tab.
4. Enter the desired **_Variable name_**, e.g. `FIREBASE_TOKEN`.
5. Copy and paste the content of the token displayed in your terminal as **_Variable value_**.
6. Enter the variable group name, e.g. **_firebase_credentials_**. Click the button to create the group.
7. Make sure the **Secure** option is selected.
8. Click the **Add** button to add the variable.

5. Create a new script for publishing to Firebase Hosting in your scripts section of the .yaml file and add it right after the build step

{{< highlight yaml "style=paraiso-dark">}}
environment:
  groups:
    -firebase_credentials

scripts:
  - name: Publish to Firebase Hosting
    script: | 
      firebase deploy --token "$FIREBASE_TOKEN"
{{< /highlight >}}


When the build is successful, you can see your application published to Firebase Hosting. You can find the direct URL to the deployed build also from the log output in Codemagic UI:

{{< highlight "style=paraiso-dark">}}

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
{{< /highlight >}}


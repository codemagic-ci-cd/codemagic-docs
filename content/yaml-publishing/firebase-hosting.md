---
title: Firebase Hosting
description: How to deploy an app to Firebase Hosting using codemagic.yaml
weight: 5
---

Codemagic allows you to deploy your web application to Firebase Hosting.

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**.
{{</notebox>}}

## Distribution to Firebase Hosting

With Codemagic, publishing to Firebase Hosting is a straightforward process as the Firebase CLI is already pre-installed on our virtual machines. Please note that you will have to set it up for your project locally before publishing it to Firebase Hosting. You can find more information in the official [documentation](https://firebase.google.com/docs/hosting/quickstart) for Firebase.

1. To get started with adding Firebase Hosting to Codemagic, you will need to obtain your Firebase token. In order to do that, run `firebase login:ci` in your local terminal.
2. After running the command, your default browser should prompt for authorization to your Firebase project - when access is granted, the necessary token will appear in your terminal.
3. Copy and [encrypt](../building/encrypting/) the token using the Codemagic UI.
4. Add your encrypted token to your .yaml file by setting it under your environment variables with the name `FIREBASE_TOKEN`.
5. Create a new script for publishing to Firebase Hosting in your scripts section of the .yaml file and add it right after the build step

```yaml
- name: Publish to Firebase Hosting
  script: |
    firebase deploy --token "$FIREBASE_TOKEN"
```

When the build is successful, you can see your application published to Firebase Hosting. You can find the direct URL to the deployed build also from the log output in Codemagic UI:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

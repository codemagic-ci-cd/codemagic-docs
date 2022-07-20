---
title: Firebase iOS setup
description: How to add Firebase to your iOS App using Codemagic Build Machines.
weight: 7
# aliases: /knowledge-base/google-play-API
---

## Requirements

1. Add an iOS App to your Firebase Project. Make sure to add the correct bundle identifier from your project. Next, register the App and download the GoogleService-info.plist file. Complete the rest of the setup with default settings.

   ![Add iOS App Firebase](../uploads/add-firebase-ios.png)

2. Create a new GitHub Personal Access Token by following [here](https://github.com/settings/tokens). You can select repo scope permission, as seen below. Then, add it as Environment Variable in Codemagic as GITHUB_PAT_TOKEN.

   ![Github Scopes](../uploads/github-pat-scopes.png)

## Adding Firebase to iOS Project.

1. While the build is running, initiate a VNC or RDP session depending on your build's platform. You can find more details on how to remote access the build machine [here](https://docs.codemagic.io/troubleshooting/accessing-builder-machine-via-ssh/#setting-up-vncrdp-connection-to-the-virtual-machine).

2. Open the iOS folder in Xcode and move the GoogleService-info.plist file within the `Runner` folder. Make sure to click on copy items if needed, as shown below. ![Firebase Xcode](../uploads/firebase-xcode.png)

3. Open Terminal and push the code back to the repo. You should see file changes to the iOS folder after adding the GoogleService-info.plist file.

```yaml
cd /path/to/repo
git add .
git commit -m "adding-ios-firebase"
https://your-username:$GITHUB_PAT_TOKEN@your-git-service.com/your-repo.git
```

4. Firebase has been now added to your iOS project. You can exit the remote session.

5. Make sure you delete the GitHub access token once the integration is completed.

---
title: Common issues
description: How to overcome common issues building mobile apps on Codemagic
weight: 8
---

### Repository is failing to be cloned from AWS CodeCommit

###### Description
Repositories can be added to Codemagic from multiple sources such as Github, Gitlab, Bitbucket, and others. When connecting repositories from AWS CodeCommit via HTTPS, you may get the following error at the fetching app sources step:

```
Cloning into '/home/builder/clone'...
fatal: unable to access 'https://git-codecommit.us-west-2.amazonaws.com/v1/repos/my_repo/': The requested URL returned error: 403

Build failed :|
Failed to clone repository
```

###### Solution

It is a known issue with repositories coming from AWS CodeCommit through HTTPS. In order to solve it, try an SSH connection instead, and when adding the repo URL, it needs to look like this:

```
ssh://XXXXXXXX@git-codecommit.us-west-2.amazonaws.com/v1/repos/my_repo.git
```

Please note that the ***XXXXXXXXX** refers to your **SSH-Key-ID**


### GitHub Integration - Repositories not showing up in the dropdown

###### Description

GitHub repositories won't show up in the dropdown while trying to add an app to Codemagic.

###### Solution
Try disconnecting the GitHub/Bitbucket integration and then connecting it again.

1. Go to your Team settings.
2. Expand Team Integrations
3. Disconnect your GitHub/Bitbucket Integration and then reconnect. 


### MacOS publishing failed

```
The product archive is invalid. The Info.plist must contain a LSApplicationCategoryType key, whose value is the UTI for a valid category. For more details, see "Submitting your Mac apps to the App Store"
```

###### Solution
Add the <key> and its <string> value in Info.plist file accordingly. 

```
<key>LSApplicationCategoryType</key>
<string>public.app-category.education</string>
```

### Changing repository for an application

###### Description
When migrating from one repository to another, whether from the same provider or not, you may want to preserve the build history, environment variables etc. instead of adding the application again, and potentially losing valuable information.

###### Solution
Add your new repository as an application to Codemagic, then retrieve both old and new application IDs. You can find these IDs in the browser URL after ``app/`` when you open the app in your Codemagic account: ``https://codemagic.io/app/<appId>``. Then contact our support team by providing both IDs by specifying which one is which, and we will make the appropriate changes for you.




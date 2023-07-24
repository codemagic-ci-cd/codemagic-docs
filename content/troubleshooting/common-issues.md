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
Try disconnecting the GitHub integration and then connecting it again.

### Changing repository for an application

###### Description
When migrating from one repository to another, whether from the same provider or not, you may want to preserve the build history, environment variables etc instead of adding the application again, potentially losing valuable information.

###### Solution
Add your new repository as an application to Codemagic. Retrieve both the old and new application id-s, make sure to note which is which. You can find your app ID in the browser URL after ``app/`` when you open the app on Codemagic: ``https://codemagic.io/app/<appId>``. After you have both of the app id-s, contact and provide us the application id-s, which of them you would like to change, and we will make the change for you.



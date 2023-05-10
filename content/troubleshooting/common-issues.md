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


### Github Integration - Repositories not showing up in the dropdown

###### Description

GitHub repositories won't show up in the dropdown while trying to add an app to Codemagic.

###### Solution
This will be solved by disconnecting and connecting to the github integration again.

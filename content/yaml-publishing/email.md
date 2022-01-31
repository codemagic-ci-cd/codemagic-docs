---
description: How to configure build status updates to email with links to artifacts in codemagic.yaml
title: Email
weight: 10
---

If the build finishes successfully, release notes (if passed), and the generated artifacts will be published to the provided email address(es). If the build fails, an email with a link to build logs will be sent.

If you don't want to receive an email notification on build success or failure, you can set `success` to `false` or `failure` to `false` accordingly.

```yaml
publishing:
  email:
    recipients:
      - name@example.com
    notify:
      success: false # To not receive a notification when a build succeeds
      failure: false # To not receive a notification when a build fails
```

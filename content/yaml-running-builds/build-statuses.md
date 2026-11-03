---
description: What each build status means, from initializing to finished
title: Build statuses
linkTitle: Build statuses
weight: 6
---

Every build has a `status` field. While a build is in progress, its status moves through the following values, in this order. A build that does not need to wait skips `queued`.

| Status         | Meaning                                                                                                                           |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `initializing` | The build has been created and Codemagic is preparing its configuration                                                           |
| `queued`       | Your team is already running as many builds as its concurrency allows. The build starts when one of your running builds finishes  |
| `waiting`      | The build has a concurrency slot and Codemagic is getting a build machine for it                                                  |
| `preparing`    | The build machine is being prepared                                                                                               |
| `fetching`     | The source code is being fetched from the repository                                                                              |
| `testing`      | Tests are running                                                                                                                 |
| `building`     | The build is running                                                                                                              |
| `publishing`   | Artifacts are being published                                                                                                     |
| `finishing`    | The build steps are done and Codemagic is wrapping up the build                                                                   |

A build ends in one of the following statuses. These do not change anymore.

| Status     | Meaning                                                                             |
|------------|-------------------------------------------------------------------------------------|
| `finished` | The build completed successfully                                                    |
| `failed`   | The build failed                                                                    |
| `canceled` | The build was canceled                                                              |
| `timeout`  | The build ran longer than its maximum build duration                                |
| `skipped`  | The build did not run, for example because a `when` condition evaluated to `false`  |

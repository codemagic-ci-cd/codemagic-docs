---
description: Limit the maximum duration of builds using codemagic.yaml
title: Build timeout settings in codemagic.yaml
linkTitle: Build timeout settings
weight: 2
aliases: 
  - /building/timeout
  - /configuration/timeout
---

By default, Codemagic builds are set to time out after 60 minutes. You can decrease or increase the maximum build duration **per workflow**.

* In `codemagic.yaml`, the build timeout limit can be defined in the [workflow section](../getting-started/yaml#workflows). 
* For Flutter projects configured via the workflow editor, you can adjust the maximum build duration in **App settings > Workflow settings > Max build duration**. Move the slider right or left to increase or decrease the maximum build duration. The minimum build duration is 30 min and the maximum is 120 min.


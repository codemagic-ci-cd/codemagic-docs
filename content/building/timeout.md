---
description: Limit the maximum duration of builds
title: Build timeout settings
weight: 11
---

By default, Codemagic builds are set to time out after 60 minutes. You can decrease or increase the maximum build duration **per workflow**.

* If you're building via UI, you can adjust the maximum build duration in **App settings > Workflow settings > Max build duration**. Move the slider right or left to increase or decrease the maximum build duration. The minimum build duration is 30 min and the maximum is 120 min.
* If you're using `codemagic.yaml`, you can change the respective setting in the [workflow section](./yaml#workflows).

{{<notebox>}}
Note that builds that end with timeout do not consume any build minutes.
{{</notebox>}}




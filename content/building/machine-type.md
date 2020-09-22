---
description: Choose between Mac Mini or Mac Pro
title: Build machine type
weight: 11
---

Codemagic currently offers two types of machines for running builds: Mac mini (macOS standard VM, default) and Mac Pro (macOS premium VM). Specifications for these machines are available [here](../releases-and-versions/versions/#hardware). 

{{<notebox>}}
Mac Pro machines are available for teams and users that have enabled [billing](../billing/billing) in team or user settings respectively.
{{</notebox>}}

* In `codemagic.yaml`, the build machine type can be specified in [workflow section](../getting-started/yaml#workflows). 
* For Flutter projects configured via UI, the build machine type can be selected in **App settings > Workflow settings > Machine**.
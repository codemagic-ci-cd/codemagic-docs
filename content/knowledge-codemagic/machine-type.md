---
description: How to configure build machine type
title: Build machine type
weight: 1
aliases:
    - '../building/machine-type/'
    - /specs/machine-type
---

## Configuring build machine types

To switch between build machines, **instance_type** needs to be configured when working with **codemagic.yaml**:

```
workflows:
  default-workflow:
    name: Default Workflow
    instance_type: mac_mini_m2
```

{{<notebox>}}
If builds are triggered through Codemagic REST API and **instance_type** parameter is specified in the cURL request, it will override **instance_type** value in **codemagic.yaml**
{{</notebox>}}

Keywords for instance types can be found [here](https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/#instance-type).

For Flutter projects configured via the Flutter workflow editor, the build machine type can be selected in Workflow settings > Change instance.

The following build machine types are provided by Codemagic:

1. macOS with Apple M2, M2 Pro, Max and Ultra chips
2. Linux (x64 and arm64)
3. Windows
   
{{<notebox>}}
Contact us [here](https://codemagic.io/contact/) to have access to macOS with Apple M2 Pro, Max, Ultra chips and Linux with arm64.
{{</notebox>}}

For more information about the machine specifications, please check [this page](https://docs.codemagic.io/specs/versions-macos/).

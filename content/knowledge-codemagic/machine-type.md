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

1. Apple silicon M1 Mac mini
2. Apple silicon M2 Mac mini
3. Linux
4. Windows

For more information about the machine specifications, please check [this page](https://docs.codemagic.io/specs/versions-macos/).

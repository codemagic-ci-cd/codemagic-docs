---
description: How to configure build machine type
title: Build machine type
weight: 1
aliases:
    - '../building/machine-type/'
    - /specs/machine-type
---

## Configuring build machines

To switch between build machines, **instance_type** needs to be configured when working with **codemagic.yaml**:

```
workflows:
  default-workflow:
    name: Default Workflow
    instance_type: mac_mini_m2
```
For Flutter projects configured via the Flutter workflow editor, the build machine type can be selected in App settings > Workflow settings > Machine.

Codemagic allows you to build your applications using the following machine types:

1. Apple silicon M1 Mac mini
2. Apple silicon M2 Mac mini
3. Linux
4. Windows

For more information about the machine specifications, please check [this page](https://docs.codemagic.io/specs/versions-macos/).

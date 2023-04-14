---
title: Creating codemagic.yaml
---


In order to use `codemagic.yaml` for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the repository. Detailed explanation can be found [here](../yaml/yaml-getting-started).

{{<notebox>}}
**Tip**
You can find codemagic.yaml examples in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/) repository.
{{</notebox>}}

If you prefer to write your `codemagic.yaml` file from scratch, you can start with this minimal configuration.

{{< highlight-editable yaml "style=paraiso-dark">}}
workflows:
    sample-workflow:
        name: Codemagic Sample Workflow
        max_build_duration: 120
        instance_type: $$$mac_mini_m1$$$mac_mini_m1$$$
{{< /highlight-editable >}}


{{<notebox>}}
**Tip**
You can have more than one workflow in the same `codemagic.yaml` file. If you are building for both the Android and iOS, simply enter both workflows as:
{{</notebox>}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
    android-workflow-id:
        name: Android Sample Workflow
        # .......    
        # .......
        # .......  
    ios-workflow-id:
        name: iOS Sample Workflow
        # ......
{{< /highlight >}}


Scan for the `codemagic.yaml` file by selecting a branch to scan and clicking the **Check for configuration** file button at the top of the page. Note that you can have different configuration files in different branches.

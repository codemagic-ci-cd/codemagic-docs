---
description: How to create a local .env file
title: Creating a local .env file
weight: 13
aliases:
 - /knowledge-base/create-local-env-file
---

You can create a `.env` file during the build process by adding a script in the pre-build phase of the Workflow editor or within your `yaml` file. This script will generate a local `.env` file and populate it with the necessary variables during the build.

{{< highlight yaml "style=paraiso-dark">}}
scripts:
    - name: Create local .env file
      script: | 
        echo "MY_VAR=$MY_VAR" > .env
        echo "ANOTHER_VAR=$MY_ANOTHER_VAR" >> .env
        echo "AND_ANOTHER_VAR=$AND_ANOTHER_VAR" >> .env
{{< /highlight >}}

{{<notebox >}}
NOTE: using `>>` after the first line appends lines to the file
{{</notebox>}}

The variables with $ in the above script can be imported from Codemagic UI. For more details, refer to this [document](../yaml-basic-configuration/using-environment-variables/).

`For Windows`, Powershell requires a different command for this case:

{{< highlight powershell "style=rrt">}}
cmd.exe /c "echo "BLA_BLA=$env:VAR_NAME" > .env"
{{< /highlight >}}


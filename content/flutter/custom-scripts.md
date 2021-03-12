---
title: Custom build steps
description: How to execute custom scripts in builds configured with the Flutter workflow editor
weight: 5
aliases: 
  - '../building/custom-scripts'
---

You can customize the Codemagic workflow by running custom scripts before and after the default build steps.

In the Flutter workflow editor, the spots for injecting custom scripts are marked by **'+'** signs between the sections. Click on **'+'** to expand the section and add your script in the appropriate section. You can run custom scripts in post-clone, pre-test, post-test, pre-build, post-build, pre-publish and post-publish phases. The scripts can be run in any language, simply define the language with a shebang line. For example, `#!/usr/bin/env python`.

{{<notebox>}}
Please note that custom scripts are always executed from the absolute path to the cloned repository which is located at `/Users/builder/clone` and can also be accessed using the environment variable `FCI_BUILD_DIR`. If your project is not in the repository root and you want to access it from a script, you will need to move to the needed directory inside the script.
{{</notebox>}}

Using `codemagic.yaml` for build configuration allows for even greater customization of builds, read more about it [here](../getting-started/yaml).

{{<notebox>}}
You can find some useful scripts in the **Knowledge base** category.
{{</notebox>}}



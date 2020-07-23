---
title: Running custom scripts
weight: 3
---

You can customize the Codemagic workflow by running custom scripts before and after the default build steps.

In the UI, the spots for injecting custom scripts are marked by **'+'** signs between the sections. Click on **'+'** to expand the section and add your script in the appropriate section. You can run custom scripts in post-clone, pre-test, post-test, pre-build, post-build, pre-publish and post-publish phases. The scripts can be run in any language, simply define the language with a shebang line. For example, `#!/usr/bin/env python`.

{{<notebox>}}
Please note that custom scripts are always executed from the absolute path to the cloned repository which is located at `/Users/builder/clone` and can also be accessed using the environment variable `FCI_BUILD_DIR`. If your project is not in the repository root and you want to access it from a script, you will need to move to the needed directory inside the script.
{{</notebox>}}

Using `codemagic.yaml` for build configuration allows for even greater customization of builds. Read more about it in [Configuration as code (YAML)](./yaml/).

{{<notebox>}}
You can see some sample scripts in the **Custom scripts examples** category.
{{</notebox>}}



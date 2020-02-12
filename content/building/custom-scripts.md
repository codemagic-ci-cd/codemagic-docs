---
title: Running custom scripts
weight: 3
---

You can customize the Codemagic workflow by running custom scripts before and after the default build steps.

In the UI, the spots for injecting custom scripts are marked by **'+'** signs between the sections. Click on **'+'** to expand the section and add your script in the appropriate section. You can run custom scripts in post-clone, pre-test, post-test, pre-build, post-build, pre-publish and post-publish phases. The scripts can be run in any language, simply define the language with a shebang line. For example, `#!/usr/bin/env python`.

Using `codemagic.yaml` for build configuration allows for even greater customization of builds. Read more about it in [Advanced configuration with YAML](./yaml/).

{{<notebox>}}
You can see some sample scripts in the **Custom scripts examples** category.
{{</notebox>}}



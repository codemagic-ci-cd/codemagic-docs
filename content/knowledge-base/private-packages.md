---
description: How to use Github packages for private dependencies 
title: Using private packages / dependencies
weight: 12
---

Accessing GitHub pasckages for private dependencies requires the following steps:

1. Create a personal access token in [GitHub](https://github.com/settings/tokens)
2. Encrypt the Personal access token in Codemagic by creating an envioronment variable group and marking the "Secure" checkbox. More information [here](https://docs.codemagic.io/variables/environment-variable-groups/)
3. Add the environment variable group to the **codemagic.yaml** file.
4. Create a **.npmrc** file with the following contents (where @owner is your github username)
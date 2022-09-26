---
description: How to use Github packages for private dependencies 
title: Using private packages / dependencies
weight: 11
---

Accessing GitHub packages for private dependencies requires the following steps:

1. Create a personal access token in [GitHub](https://github.com/settings/tokens)
2. Open your Codemagic app settings, and go to the **Environment variables** tab.
3. Enter the desired **_Variable name_**, e.g. `GITHUB_TOKEN`.
4. Copy and paste the token as **_Variable value_**.
5. Enter the variable group name, e.g. **_github_credentials_**. Click the button to create the group.
6. Make sure the **Secure** option is selected.
7. Click the **Add** button to add the variable.


8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - github_credentials
{{< /highlight >}}


9. Create a **.npmrc** file with the following contents (where @owner is your github username):
{{< highlight INI "style=paraiso-dark">}}
  registry=https://registry.npmjs.org/
  @owner:registry=https://npm.pkg.github.com/
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
{{< /highlight >}}


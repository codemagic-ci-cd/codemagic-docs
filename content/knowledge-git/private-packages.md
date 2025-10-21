---
description: How to use Github packages for private dependencies 
title: Using private packages / dependencies
weight: 11
aliases:
  - /knowledge-base/private-packages
---

Accessing GitHub packages for private dependencies requires the following steps:

1. Create a personal access token in [GitHub](https://github.com/settings/tokens)
2. Open your Codemagic app settings, and go to the **Environment variables** tab.
3. Enter the desired **_Variable name_**, e.g. `GITHUB_TOKEN`.
4. Copy and paste the token as **_Variable value_**.
5. Enter the variable group name, e.g. **_github_credentials_**. Click the button to create the group.
6. Make sure the **Secret** option is selected.
7. Click the **Add** button to add the variable.


8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - github_credentials
{{< /highlight >}}


9. Create a **.npmrc** file with the following contents (where @owner is your GitHub username):
{{< highlight INI "style=paraiso-dark">}}
  registry=https://registry.npmjs.org/
  @owner:registry=https://npm.pkg.github.com/
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
{{< /highlight >}}

     or the code below for private registries:

    {{< highlight INI "style=paraiso-dark">}}
      registry=https://my-private-registry.example.com/
      //my-private-registry.example.com/:_authToken=YOUR_AUTH_TOKEN
    {{< /highlight >}}

###### Debugging issues

It is important to note that the Yarn ecosystem behaves differently depending on which version you use. As Yarn 2+ uses Plug'n'Play (PnP) system, it might check `yarnrc.yml` by ignoring `.npmrc`, so it needs to be configured instead:


{{< highlight INI "style=paraiso-dark">}}
npmScopes:
 package_name:
  npmRegistryServer: "REGISTRY_URL"
  npmAuthToken: "${NPM_TOKEN}"
 {{< /highlight >}}

You can check if you are authorized successfully by running `npm whoami --registry=https://REGISTRY_URL` and if the private package has been published to the registry by running `npm view @PACKAGE_NAME`. The easiest way to debug private registry-related issues is at runtime by [enabling remote access to the builder machines](https://docs.codemagic.io/troubleshooting/accessing-builder-machine-via-ssh/).

{{<notebox>}}

**Note:** If your builds work fine locally when running `yarn install`, then double-check if you are using the same yarn version with your Codemagic builds. You can downgrade or upgrade it at runtime if necessary:

```yaml
 - name: Change Yarn version
   script: |
       corepack disable
       npm uninstall -g yarn
       npm install -g yarn@1.22.19
```

{{</notebox>}}







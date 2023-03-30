---
title: Linux Snap packages
description: How to build and release a snap package with codemagic.yaml
weight: 11
aliases:
  - '../yaml/building-a-snap-package'
  - /getting-started/building-a-snap-package
---

This guide will illustrate the basic steps necessary for building and publishing your app as a Snap package.

You can find a complete project showcasing these steps in our [Sample projects repository](https://github.com/codemagic-ci-cd/flutter-snapcraft-example/).

{{<notebox>}}
**Note**: Snap is only available on Linux instances. Make sure to have `instance_type: linux` or `instance_type: linux_x2` in your `codemagic.yaml`. See the build machine specification [here](../specs/versions-linux/).
{{</notebox>}}

## Adding the app to Codemagic
{{< include "/partials/quickstart/add-app-to-codemagic.md" >}}
## Creating codemagic.yaml
{{< include "/partials/quickstart/create-yaml-intro.md" >}}

## Configure Snap

To set up Snap packaging, create a `snapcraft.yaml` file with the necessary configurations according to [Snapcraft guide for Flutter](https://snapcraft.io/docs/flutter-applications) or follow the general [`snapcraft.yaml` guide](https://snapcraft.io/docs/creating-snapcraft-yaml).

Optionally, run the `snapcraft snap` command locally to ensure that everything is set up.

You should store the `snapcraft.yaml` file in the repository root. Another option is to store `snapcraft.yaml` in the `.snap` folder that is located in repository root.


## Building snap packages

Include the `snapcraft snap` command in the `scripts` section of your `codemagic.yaml` file as in the example below. The output of this command is a `.snap` artifact that can later be used for publishing to the Snapcraft Snap Store.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  snap-build:
    name: Snapcraft Build
    instance_type: linux
    environment:
      vars:
        SNAPCRAFT_BUILD_ENVIRONMENT: host
    scripts:
      - name: Create a snap
        script: | 
          snapcraft snap --output flutter-codemagic-example.snap
    artifacts:
        - '**/*.snap'
{{< /highlight >}}


Additionally, you may want to install the generated `.snap` package onto your machine for testing. The package will not be code signed unless you publish it to Snap Store, so you would need to use the `--dangerous` flag to install the package without code signing:

{{< highlight bash "style=paraiso-dark">}}
    snap install your-package.snap --dangerous
{{< /highlight >}}

{{<notebox>}}
**Note**: In case you are packaging a **Flutter application**, be sure to set `SNAPCRAFT_BUILD_ENVIRONMENT` environment variable to `host`. It is required to avoid virtualization. Read more about virtualization options [here](https://flutter.dev/docs/deployment/linux). Additionally, Snapcraft manages all the dependencies according to `snapcraft.yaml` configuration. There is no need to include the Flutter version in `codemagic.yaml`.
{{</notebox>}}


## Publishing to Snap Store

Snap packages can be published to the [Snap Store](https://snapcraft.io/).

1. Generate your Snapcraft credentials file by running the following command locally and providing your Snapcraft account username and password:
{{< highlight bash "style=paraiso-dark">}}
snapcraft export-login snapcraft-login-credentials
{{< /highlight >}}

2. Run the following command and carefully copy/paste the output:
{{< highlight Shell "style=rrt">}}
cat  snapcraft-login-credentials | base64
{{< /highlight >}}

3. Open your Codemagic app settings, and go to the **Environment variables** tab.
4. Enter the desired **_Variable name_**, e.g. `SNAPCRAFT_LOGIN_CREDENTIALS`.
5. Paste the `base64` encoded credentials from Step 2. as **_Variable value_**.
6. Enter the variable group name, e.g. **_snapcraft_credentials_**. Click the button to create the group.
7. Make sure the **Secure** option is selected.
8. Click the **Add** button to add the variable.

9. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - snapcraft_credentials
{{< /highlight >}}


10. In the `scripts` section, add steps to base64 decode the credentials file, log in to Snapcraft via CLI, build the snap package and release it to the desired channel.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Authenticate with Snap Store
      script: | 
        echo $SNAPCRAFT_LOGIN_CREDENTIALS | base64 \
          --decode > /home/builder/snapcraft-login-credentials
        snapcraft login --with /home/builder/snapcraft-login-credentials
    - name: Create a Snap package
      script: | 
        snapcraft snap --output flutter-codemagic-example.snap
    - name: Publish to Snap Store
      script: | 
        snapcraft upload flutter-codemagic-example.snap --release stable
{{< /highlight >}}


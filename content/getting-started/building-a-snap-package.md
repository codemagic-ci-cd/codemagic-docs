---
title: Building a snap package
description: How to build and release a snap package with codemagic.yaml
weight: 11
aliases:
  - '../yaml/building-a-snap-package'
---

## Setting up snap packaging

To set up snap packaging, create a `snapcraft.yaml` file with the necessary configurations according to [Snapcraft guide for Flutter](https://snapcraft.io/docs/flutter-applications) or follow the general [`snapcraft.yaml` guide](https://snapcraft.io/docs/creating-snapcraft-yaml).

Optionally, run the `snapcraft snap` command locally to ensure that everything is set up.

You should store the `snapcraft.yaml` file in the repository root. Another option is to store `snapcraft.yaml` in the `.snap` folder that is located in repository root.

{{<notebox>}}
See a sample application along with a `codemagic.yaml` configuration file that builds and releases a snap package in [GitHub](https://github.com/codemagic-ci-cd/flutter-snapcraft-example/).
{{</notebox>}}

## Building snap packages

Include the `snapcraft snap` command in the `scripts` section of your `codemagic.yaml` file as in the example below. The output of this command is a `.snap` artifact. It can later be used for [publishing to the Snapcraft Snap Store](#publishing-snap-packages).

```yaml
workflows:
  snap-build:
    name: Snapcraft Build
    instance_type: linux
    environment:
        SNAPCRAFT_BUILD_ENVIRONMENT: host
    scripts:
      - name: Create a snap
        script: snapcraft snap --output flutter-codemagic-example.snap
    artifacts:
        - '**/*.snap'
```

Additionally, you may want to install the generated `.snap` package onto your machine for testing. The package will not be code signed unless you publish it to Snapcraft, so you would need to use the `--dangerous` flag to install the package without code signing:

    snap install your-package.snap --dangerous

In case you are packaging a **Flutter application**, be sure to set `SNAPCRAFT_BUILD_ENVIRONMENT` environment variable to `host`. It is required to avoid virtualization. Read more about virtualization options [here](https://flutter.dev/docs/deployment/linux). Additionally, Snapcraft manages all the dependencies according to `snapcraft.yaml` configuration. There is no need to include the Flutter version in `codemagic.yaml`.

{{<notebox>}}
**Note**: Snap is only available on Linux instances. Make sure to have `instance_type: linux` or `instance_type: linux_x2` in your `codemagic.yaml`. See the build machine specification [here](../specs/versions-linux/).
{{</notebox>}}

## Publishing snap packages

Snap packages can be published to the [Snapcraft Snap Store](https://snapcraft.io/).

1. Generate your Snapcraft credentials file by running the following command locally.

```
snapcraft export-login snapcraft-login-credentials
```

  You will be asked to enter your Snapcraft account username and password.

2. Base64 encode and encrypt the credentials file. Read more about encrypting sensitive info in Codemagic [here](../building/encrypting/). 
3. Add the encrypted value to `codemagic.yaml` as an environment variable with the name `SNAPCRAFT_LOGIN_CREDENTIALS`.

```yaml
SNAPCRAFT_LOGIN_CREDENTIALS: Encrypted(...)
```
4. In the `scripts` section, add steps to base64 decode the credentials file, log in to Snapcraft via CLI, build the snap package and release it to the desired channel.

```yaml
scripts:
  - name: Authenticate
    script: |
      echo $SNAPCRAFT_LOGIN_CREDENTIALS | base64 --decode > /home/builder/snapcraft-login-credentials
      snapcraft login --with /home/builder/snapcraft-login-credentials
  - name: Create a snap
    script: snapcraft snap --output flutter-codemagic-example.snap
  - name: Upload and release
    script: snapcraft upload flutter-codemagic-example.snap --release stable
```

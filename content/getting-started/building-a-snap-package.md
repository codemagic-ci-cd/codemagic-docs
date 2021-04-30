---
title: Building a Snap package
description: How to build a Snap package with codemagic.yaml
weight: 7
aliases:
  - '../yaml/building-a-snap-package'
---

## Setting up Snap packaging

To set up Snap packaging create `snapcraft.yaml` file with necessary configurations according to [Snapcraft guide for Flutter](https://snapcraft.io/docs/flutter-applications) or general [`snapcraft.yaml` guide](https://snapcraft.io/docs/creating-snapcraft-yaml).

Optionally, run `snapcraft snap` command locally to ensure that everything is set up.

{{<notebox>}}
**Note**

You should store `snapcraft.yaml` in the repository root. Another option is to store `snapcraft.yaml` in `.snap` folder that is located in repository root.

{{</notebox>}}

## Building Snap packages

Include `snapcraft snap` command in `codemagic.yaml` file scripts section as in the example below. The output of this command is `.snap` artifact. It could later be used for [publishing to Snapcraft store](../publishing-yaml/distribution/).

Additionally, you may want to install the generated `.snap` package onto your machine. Package would not be code signed unless you publish it to Snapcraft store. You would need to use `--dangerous` flag to install package without code signing:

    snap install your-package.snap --dangerous

**Note**: Snap is only available on Linux instances. Make sure to have `instance_type: linux` in your `codemagic.yaml`.

## Sample `codemagic.yaml`

In case you are packaging Flutter application, be sure to set `SNAPCRAFT_BUILD_ENVIRONMENT` environmet variable to be `host`. It is required to avoid virtualization. Read more about virtualization options [here](https://flutter.dev/docs/deployment/linux).

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

**Note**: Snapcraft manages all the dependencies according to `snapcraft.yaml` configuration. There is no need to include Flutter version in `codemagic.yaml`.

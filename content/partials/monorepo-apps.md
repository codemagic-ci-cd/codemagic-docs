---
description: How to build monorepo apps with Codemagic
title: Monorepo apps
weight: 11
---

A **Monorepo** is a version-controlled code repository that holds many projects in a single repository. Codemagic supports working with monorepo apps. The very first step is creating a Codemagic account and adding your monorepo app from its codebase such as GitHub, Gitlab, Bitbucket, or self-hosted repositories. More information about how to sign up can be found here.

To begin with, **codemagic.yaml** file must be created in the root directory of the repository. By default, the working directory is the root of the repository. The basic structure looks like this:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  default-workflow:
    name: Default workflow
    instance_type: mac_mini
    max_build_duration: 60
    environment:
      flutter: stable
      xcode: latest
      cocoapods: default
    scripts:
      # Add scripts here
    artifacts:
      - build/**/outputs/**/*.apk
      - build/ios/ipa/*.ipa
    publishing:
      email:
        recipients:
          - name@example.com
{{< /highlight >}}

In order to target apps inside your monorepo app, **working_directory** key is used. For example, the following sample snippet shows how it works:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  default-workflow:
    name: Default workflow
    # Specify path to the app folder like this
    working_directory: my_first_app
{{< /highlight >}}

By defining **working_directory**, every command that is defined in the scripts section will run inside that particular directory which is "my_first_app" in our sample above.

In order to manage your working directories easily, it is recommended to create multiple workflows and configure them accordingly:

{{< highlight yaml "style=paraiso-dark">}}

workflows:
  my-first-app-workflow:
    name: Drivers app workflow
    working_directory: my_first_app
    # ...

  my-second-app-workflow:
    name: Passengers app workflow
    working_directory: my_second_app
{{< /highlight >}}


A sample project can be found [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/codemagic.yaml). You can also checkout the blog article [How to mange your Flutter monorepo](https://blog.codemagic.io/flutter-monorepos/).

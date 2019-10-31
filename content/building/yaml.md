---
title: Advanced configuration with YAML
weight: 1
---

`Codemagic.yaml` is an advanced option for customizing the build and configuring all your workflows in a single file. The file can be committed to version control, and when detected in repository, will be used to configure the build instead of the settings in the UI.

{{% notebox %}}

**Limitations**

The YAML feature is currently in *beta* and has the following limitations:

* Only Android and web app configuration can be exported. The commands for building and code signing iOS apps are currently not generated and you cannot configure iOS publishing in YAML yet.
* The exported configuration is not identical to the settings in UI and lacks the configuration for features such as **Stop build if tests fail**.

{{% /notebox %}}

## Exporting current configuration as YAML

You can get started with YAML easily if you have an existing project set up on Codemagic. 

1. Navigate to your app settings.
2. Expand the **Advanced configuration (beta)** tab.
3. Click **Download configuration** and save the generated `codemagic.yaml` file to a suitable location. 

Note that in order to use the file for build configuration on Codemagic, it has to be committed to your repository.

## Encrypting sensitive data

During the export, Codemagic automatically encrypts the secret environment variables in your build configuration. 

If you wish to add new environment variables to the YAML file, you can encrypt them via Codemagic UI. 

1. In your app settings > Advanced configuration (beta), click **Encrypt environment variables**.
2. Paste the value of the variable in the field or upload it as a file.
3. Click **Encrypt**. 
4. Copy the encrypted value and paste it to the configuration file.

An example of an encryp†ed value:

```Encrypted(Z0FBQUFBQmRyY1FLWXIwVEhqdWphdjRhQ0xubkdoOGJ2bThkNmh4YmdXbFB3S2wyNTN2OERoV3c0YWU0OVBERG42d3Rfc2N0blNDX3FfblZxbUc4d2pWUHJBSVppbXNXNC04U1VqcGlnajZ2VnJVMVFWc3lZZ289)```

## Template

This is the default template of `codemagic.yaml`.

    workflows:
      my-workflow:
        name: My workflow name
        environment:
          vars:
            PUBLIC_ENV_VAR: value here
            SECRET_ENV_VAR: Encrypted(...)
            CM_KEYSTORE: Encrypted(...)
            CM_KEYSTORE_PASSWORD: Encrypted(...)
            CM_KEY_ALIAS_PASSWORD: Encrypted(...)
            CM_KEY_ALIAS_USERNAME: Encrypted(...)
          flutter: stable
        cache:
          cache_paths:
            - $FCI_BUILD_DIR/build
            - $FCI_BUILD_DIR/build/dir/to/cache
        triggering:
          events:
            - push
            - pull_request
            - tag
          branch_patterns:
            - pattern: '*'
              include: true
              source: true
            - pattern: excluded-target
              include: false
              source: false
            - pattern: included-source
              include: true
              source: true
        scripts:
          - ...
        publishing:
          email:
            recipients:
              - name@example.com
          slack:
            channel: '#madis-test'
            notify_on_build_start: true
          google_play:
            credentials: Encrypted(...)
            track: alpha
        artifacts:
          - build/**/outputs/**/*.apk
          - build/**/outputs/**/*.aab
          - build/**/outputs/**/mapping.txt
          - flutter_drive.log

`Codemagic.yaml` is divided into workflows. Each workflow describes the entire build pipeline from start to finish. Define all your workflows for a project under `workflows`. 

    workflows:
      my-workflow:                # workflow name
        name: My workflow name    # workflow name displayed in UI
        environment:
        cache:
        triggering:
        branch_patterns:
        scripts:
        publishing:
        artifacts:

The main sections in each workflow are as follows:

* **environment**: Contains the list of environment variables and enables to specify the version of Flutter used for building. Make sure to [encrypt the values](#encrypting-sensitive-data) of variables that hold sensitive data. 

        environment:
          vars:                 # Define your environment variables here
            PUBLIC_ENV_VAR: value here
            SECRET_ENV_VAR: Encrypted(...)
            CM_KEYSTORE: Encrypted(...)
            CM_KEYSTORE_PASSWORD: Encrypted(...)
            CM_KEY_ALIAS_PASSWORD: Encrypted(...)
            CM_KEY_ALIAS_USERNAME: Encrypted(...)
          flutter: stable       # Define the channel name or version

* **cache**: Enables to define the paths to be cached on Codemagic. See the recommended paths for [dependency caching](./dependency-caching).

        cache:
          cache_paths:
            - $FCI_BUILD_DIR/build
            - $FCI_BUILD_DIR/build/dir/to/cache

* **triggering**: Define the events for automatic build triggering and the watched branches. If no events are defined, you can start builds only manually. 

  >Note that for **pull request builds**, it is required to specify whether the watched branch is the source or the target of pull request.

  >A branch pattern can match the name of a particular branch, or you can use wildcard symbols to create a pattern that matches several branches. 


        triggering:
          events:                # List the events that trigger builds
            - push
            - pull_request
            - tag
          branch_patterns:       # Include or exclude watched branches
            - pattern: '*'
              include: true
              source: true
            - pattern: excluded-target
              include: false
              source: false
            - pattern: included-source
              include: true
              source: true

* **scripts**: Define the scripts to be run during the build. 

        scripts:
          - ...

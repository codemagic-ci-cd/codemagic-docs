---
title: Advanced configuration with YAML
weight: 1
---

`Codemagic.yaml` is an advanced option for customizing the build and configuring all your workflows in a single file. The file can be committed to version control, and when detected in repository, will be used to configure the build instead of the settings in the UI.

{{% notebox %}}

**Limitations**

The YAML feature is currently in *beta* and has the following limitations:

* Only Android and web app configuration can be exported. The commands for building and code signing iOS apps are currently not generated and you cannot configure iOS publishing in YAML yet.
* The exported configuration is not identical to the settings in UI and lacks the configuration for some features, such as **Stop build if tests fail**.
* YAML configuration cannot be used with apps from custom sources.

{{% /notebox %}}

## Exporting current configuration as YAML

You can get started with YAML easily if you have an existing project set up on Codemagic. 

1. Navigate to your app settings.
2. Expand the **Advanced configuration (beta)** tab.
3. Click **Download configuration** and save the generated `codemagic.yaml` file to a suitable location. 

Note that in order to use the file for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the project. 

## Encrypting sensitive data

During the export, Codemagic automatically encrypts the secret environment variables in your build configuration. 

If you wish to add new environment variables to the YAML file, you can encrypt them via Codemagic UI. 

1. In your app settings > Advanced configuration (beta), click **Encrypt environment variables**.
2. Paste the value of the variable in the field or upload it as a file.
3. Click **Encrypt**. 
4. Copy the encrypted value and paste it to the configuration file.

An example of an encrypted value:

```Encrypted(Z0FBQUFBQmRyY1FLWXIwVEhqdWphdjRhQ0xubkdoOGJ2bThkNmh4YmdXbFB3S2wyNTN2OERoV3c0YWU0OVBERG42d3Rfc2N0blNDX3FfblZxbUc4d2pWUHJBSVppbXNXNC04U1VqcGlnajZ2VnJVMVFWc3lZZ289)```

## Building with YAML

When detected in repository, `codemagic.yaml` is automatically used for configuring builds that are triggered in response to the events defined in the file. Any configuration in the UI is ignored.

You can also use `codemagic.yaml` for manual builds.

1. In your app settings, click **Start new build**.
2. In the **Specify build configuration** popup, click **Select workflow from codemagic.yaml**.
3. Depending on what you have configured in the YAML file, select the **branch** and the **workflow** to be run.
4. Finally, click **Start new build** to run the build.

## Template

This is the skeleton structure of `codemagic.yaml`.

    workflows:
      my-workflow:
        name: My workflow name
        environment:
          vars:
            PUBLIC_ENV_VAR: value here
          flutter: stable
        cache:
          cache_paths:
            - $FCI_BUILD_DIR/build
        triggering:
          events:
            - push
          branch_patterns:
            - pattern: '*'
              include: true
              source: true
        scripts:
          - ...
        artifacts:
          - build/**/outputs/**/*.aab
        publishing:
          email:
            recipients:
              - name@example.com

You can use`Codemagic.yaml` to define several workflows for building a project. Each workflow describes the entire build pipeline from triggers to publishing.

    workflows:
      my-workflow:                # workflow ID
        name: My workflow name    # workflow name displayed in UI
        environment:
        cache:
        triggering:
        branch_patterns:
        scripts:
        publishing:
        artifacts:

The main sections in each workflow are as follows:

* **environment**: Contains your environment variables and enables to specify the version of Flutter used for building. Make sure to [encrypt the values](#encrypting-sensitive-data) of variables that hold sensitive data. 

        environment:
          vars:                 # Define your environment variables here
            PUBLIC_ENV_VAR: value here
            SECRET_ENV_VAR: Encrypted(...)
            CM_KEYSTORE: Encrypted(...)
            CM_KEYSTORE_PASSWORD: Encrypted(...)
            CM_KEY_ALIAS_PASSWORD: Encrypted(...)
            CM_KEY_ALIAS_USERNAME: Encrypted(...)
          flutter: stable       # Define the channel name or version

* **cache**: Enables to define the paths to be cached and stored on Codemagic. See the recommended paths for [dependency caching](./dependency-caching).

        cache:
          cache_paths:
            - $FCI_BUILD_DIR/build
            - $FCI_BUILD_DIR/build/dir/to/cache

* **triggering**: Defines the events for automatic build triggering and the watched branches. If no events are defined, you can start builds only manually. 

    A branch pattern can match the name of a particular branch, or you can use wildcard symbols to create a pattern that matches several branches. Note that for **pull request builds**, it is required to specify whether the watched branch is the source or the target of pull request.

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

* **scripts**: Contains the scripts and commands to be run during the build. This is where you can specify the commands to test, build and code sign your project. Below is an example for building a Flutter app in debug mode for Android.

        scripts:
          - |
            # set up debug key.properties
            keytool -genkeypair \
              -alias androiddebugkey \
              -keypass android \
              -keystore ~/.android/debug.keystore \
              -storepass android \
              -dname 'CN=Android Debug,O=Android,C=US' \
              -keyalg 'RSA' \
              -keysize 2048 \
              -validity 10000
          - |
            # set up local properties
            echo "flutter.sdk=$HOME/programs/flutter" > "$FCI_BUILD_DIR/android/local.properties"
          - flutter packages pub get
          - flutter test
          - flutter build apk --release


    You can run scripts in languages other than shell (`sh`) by defining the languge with a shebang line or by launching a script file present in your repository.

    For example, you can specify a different scripting language like this:

        scripts:
        - |
          #!/usr/local/bin/dart

          void main() {

* **artifacts**: Configure the paths and names of the artifacts you would like to use in the following steps, e.g. for publishing, or have available for download on the build page. All paths are relative to the clone directory, but absolute paths are supported as well. You can also use environment variables in artifact patterns.


        artifacts:
          - build/**/outputs/**/*.apk                   # relative path for a project in root directory
          - build/**/outputs/**/*.aab
          - build/**/outputs/**/mapping.txt
          - flutter_drive.log
          - {project_root}/build/**/outputs/**/*.apk    # relative path for a project in a subfolder

  * The pattern can point to a single file or a folder.
  * If one of the patterns includes another pattern, duplicate artifacts are not created.
  * `apk`, `aab`, `ipa`, `aar`, `app`, proguard mapping (`mapping.txt`), `flutter_drive.log`, `jar`, `zip`, `xarchive` and `dSYM.zip` files will be available as separate items in the Artifacts section on the build page. The rest of the artifacts will be included in an archive with the following name pattern: `{project-name}_{version}_artifacts.zip`.

* **publishing**: For every successful build, you can publish the generated artifacts to external services. The available integrations currently are email, Slack, Google Play and Codemagic Static Pages.

        publishing:
          email:
            recipients:
              - name@example.com
          slack:
            channel: '#slack-test'
            notify_on_build_start: true
          google_play:                        # For Android app
            credentials: Encrypted(...)
            track: alpha
          static_page:                        # For web app
            subdomain: my-subdomain


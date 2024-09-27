---
title: Build inputs
description: Specify optional inputs that are passed to the workflow when starting a build
weight: 3
---
<p>
{{<notebox>}}
The Build inputs feature is only available for workflows configured using `codemagic.yaml`.
{{</notebox>}}

## Overview

Build inputs are customizable parameters you can define within your workflow to make it more adaptable to different scenarios. With build inputs, you can create a single workflow and run it with different configurations by providing the values for inputs when starting a build for the workflow. For example, you can use build inputs to determine whether to build the workflow for test or release purposes or which app flavor to build. This eliminates the need to create multiple similar workflows with specific hardcoded values, making the workflow more reusable and dynamic.

Inputs are workflow-specific and are defined in `codemagic.yaml` under the `inputs` mapping (see the [example](#minimal-example) below). The started workflow receives specified input values in the `inputs` context, i.e. `${{ inputs.inputId }}` is replaced with the value passed to input with identifier `inputId`.

### Minimal example

This example configures one input with the ID `name`. Unless given another value when starting a build, `name` defaults to `Codemagic`.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  my-workflow:
    inputs:
      name: # input ID
        description: Who is greeted?
        default: Codemagic
    scripts:
      - echo "Hello, ${{ inputs.name }}"
{{< /highlight >}}

## Starting builds with Inputs manually

When starting a build for a workflow that contains inputs via the Codemagic UI, you will be prompted to enter the inputs. Inputs that have predefined default values will be prefilled with those values from configuration file. All other inputs must be manually entered before the build can be started.

{{<notebox>}}
Not entering anything for a string input will result in an empty string, i.e. `""`.
{{</notebox>}}

## Starting builds with Inputs automatically

Only workflows that do not require user input for values can be started with webhook events. If you want to use Git events or scheduled builds to automatically trigger builds for workflows with inputs, ensure that all inputs in those workflows have default values. Otherwise, the build will fail due to undefined inputs.

## YAML schema for inputs

Build inputs are defined in `codemagic.yaml` as a mapping `workflows.<workflow_id>.inputs` where keys are input IDs and values are inputs that have the following fields.

If `default` is omitted, value for input must be specified when starting the build.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  my-workflow:
    inputs:
      number_input:
        description: Number input
        type: number
        default: 1        # Optional
      string_input:
        description: String input
        type: string
        default: "hello"  # Optional  
      boolean_input:
        description: Boolean input
        type: boolean
        default: true     # Optional
      choice_input:
        description: Choice input
        type: choice
        default: option 2 # Optional. If set, must be one of defined options.
        options:          # Required for choice input
          - option 1
          - option 2
          - option 3
{{< /highlight >}}

### `description`

**Required**. A **string** description for this build input. Description is displayed in Codemagic when manually starting a build for this workflow and user is prompted to provide values for the inputs.

### `type`

**This must be one of: `boolean`, `choice`, `number` or `string`. By default, `string` is assumed.**

Defines the data type of the input parameter. Input values for the `choice` type are resolved to strings and must be defined in the `options` field. Values for inputs with types `boolean` and `number` are persisted as booleans and integers or floating point numbers respectively, instead of converting them to strings as long as they are not directly used in string interpolations.

### `options`

Provide a list of values as options for the `choice` input. Values are all implicitly cast to strings. Inputs with type `choice` must define additional field `options` where valid choices are listed. **Required if type is `choice` and prohibited otherwise**.

### `default`

Provide a default value for the input parameter. If type is `choice`, then it must be one of the defined `options`, otherwise value type must match with the `type` definition.

## Examples

Below are some example use cases for leveraging different types of build inputs in your workflows.

### Using input values in scripts

You can use inputs in scripts by referencing the ID of the input.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  my-workflow:
    inputs:
      name:
        description: Who is greeted?
    scripts:
      - echo "Hello, ${{ inputs.name }}"
{{< /highlight >}}

As no `default` value is provided in the above example, then name must be specified when starting builds for this workflow, or otherwise it will be left blank.

### Using inputs to conditionally run scripts

 Boolean inputs can be useful to control whether some build steps are enabled or disabled, or they can be used to turn some features on or off. When given boolean values are substituted into the workflow, then their type is kept as boolean as long as they are not directly used within other values that are already strings (such as scripts). 

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios:
    inputs:
      submitToTestFlight:
        description: Enable testflight submission
        type: boolean
        default: false
      runTests:
        description: Run tests before build
        type: boolean
        default: true
    integrations:
      app_store_connect: MY_ASC_KEY
    scripts:
      - name: Run tests
        script: xcode-project run-tests --project "project.xcodeproj" --scheme "App"
        test_report: build/ios/test/*.xml
        when:
          condition: ${{ inputs.runTests }}
      - ./setup_code_signing.sh
      - xcode-project build-ipa --project "project.xcodeproj" --scheme "app"
    artifacts:
      - build/**/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: ${{ inputs.submitToTestFlight }}
{{< /highlight >}}

In the above workflow user is prompted with two options when starting a build:
1. whether to run tests before build, which controls the first script step using `when` condition,
2. whether to submit the built ipa to TestFlight as part of App Store Connect publishing.

Defaults are provided for both inputs and a standard build can be started without choosing anything. 

{{<notebox>}}
**Note**: When using booleans in textual context, such as in scripts, truthy and falsy values are interpolated as strings `"true"` and `"false"` respectively. For example,
```
echo "My boolean: ${{ inputs.myTruthValue }}"
```
would be resolved to
```
echo: "My boolean: true"
```
if build is started with `myTruthValue: true`.
{{</notebox>}}

### Using inputs for publishing

You can use number inputs for build versioning or to control other release parameters, such as rollout fraction or in-app update priority. As with booleans, number types are also persisted when substitutions are being made to workflows unless the value is not directly used within a string. Both integers and floating point numbers are accepted as valid values.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios:
    inputs:
      googlePlayInAppUpdatePriority:
        description: Google Play publisher priority
        type: number
        default: 4
      buildNumber:
        description: Build number for artifact versioning
        type: number
      rolloutFraction:
        description: Rollout fraction for Google Play release promotion
        type: number
        default: 0.25
    environment:
      groups: 
        - google_credentials  
    scripts:
      - flutter build apk --build-number="${{ inputs.buildNumber }}" --release
    publishing:
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        in_app_update_priority: ${{ inputs.googlePlayInAppUpdatePriority }}
        release_promotion:
          track: alpha
          rollout_fraction: ${{ inputs.rolloutFraction }}
{{< /highlight >}}

### Using inputs for determining build distribution type

Inputs with type `choice` provide a way to limit the user to choose only specific predefined values for inputs, such as distribution type.

Choice options are shown to user in a dropdown.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios:
    inputs:
      distributionType:
        description: iOS distribution type 
        type: choice
        options: ["ad_hoc", "app_store", "development", "invalid"]
        default: development
    integrations:
      app_store_connect: MY_ASC_KEY
    environment:
      ios_signing:
        distribution_type: ${{ inputs.distributionType }}
        bundle_identifier: com.example.app
    scripts:
      - xcode-project use-profiles
      - flutter build ipa --debug --export-options-plist "${HOME:?}/export_options.plist"
{{< /highlight >}}

## Viewing inputs values

To better distinguish builds based on their input values, you can display the chosen value in the Build overview or on the builds page by using [labels](https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/#labels). The following sample snippet can be referenced to achieve it:

{{< highlight yaml "style=paraiso-dark">}}
    inputs:
      xcode_version:
        description: Set Xcode version
        type: number
      publish_to_appstore:
        description: App Store publishing
        type: boolean
{{< /highlight >}}

Then, assign the input to a label:

{{< highlight yaml "style=paraiso-dark">}}
labels:
   - Xcode_version ${{ inputs.xcode_version }}
   - App_Store_Publishing ${{ inputs.publish_to_appstore }}
{{< /highlight >}}


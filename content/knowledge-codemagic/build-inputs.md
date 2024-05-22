---
title: Build inputs
description: Specify optional inputs that are passed to the workflow when starting a build
weight: 3
---

## Overview

Build inputs are customizable parameters you can define within your workflow to make it more adaptable to different scenarios. With build inputs, you can create a single workflow and run it with different configurations by providing the values for inputs when starting a build for the workflow. For example, you can use build inputs to determine whether to build the workflow for test or release purposes or which app flavor to build. This eliminates the need to create multiple similar workflows with specific hardcoded values, making the workflow more reusable and dynamic.

Inputs are workflow-specific and are defined in `codemagic.yaml` under the `inputs` mapping (see the [example](#minimal-example) below). The started workflow receives specified input values in the `inputs` context, i.e. `${{ inputs.inputId }}` is replaced with the value passed to input with identifier `inputId`.

### Minimal example

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  greetings:
    inputs:
      name:
        description: Who is greeted?
        default: Codemagic
    scripts:
      - echo "Hello, ${{ inputs.name }}"
{{< /highlight >}}

## Starting builds with Inputs

All inputs must be specified to successfully start a build, either by providing a `default` value in the YAML configuration, or giving a one-off value when starting the build. 

{{<notebox>}}
**Note**: Builds will fail if invalid values are provided (strings for numbers inputs, undefined choice options, etc.) or values are missing.
{{</notebox>}}

### Starting builds manually via Codemagic UI

When starting a build via the Codemagic UI, you will automatically be prompted to enter the inputs. Inputs that have predefined default values will be pre-filled with those values from configuration file. All other inputs must be manually entered before the build can be started.

Not entering anything for a string input will result in an empty string, i.e. `""`. For other input types an actual value which matches the requested type must be entered. 

### Starting builds using REST API

To start a build using the REST API, values for inputs that do not define `default` must be included in the `POST` request payload. The inputs which have default value declared in YAML configuration can be omitted from request payload, in that case the specified default will be used.  

Given values must be in accordance with the input definitions, that is:
- type of the value must match with the input type (numeric values for number inputs, truth values for boolean inputs and textual values for string inputs),
- value for choice input must be included in the options list. 

For more detailed information on starting builds with inputs using the REST API, refer to the section [below](#specify-inputs-when-starting-builds-with-api). Optional inputs can be omitted from the request payload; their default values will be used instead.

### Starting builds using webhook events

Only builds that do not rely on inputs can be started with webhook events. If you want to use Git events to automatically trigger builds for workflows with inputs, ensure that all inputs for those workflows have default values.

## YAML schema for inputs

Build inputs are defined in `codemagic.yaml` as a mapping `workflow.<workflow_id>.inputs` where keys are input IDs and values are inputs that have the following fields.

### `description`

**Required**. A **string** description for this build input. Description is displayed in Codemagic when manually starting a build for this workflow and user is prompted to provide values for the inputs.

### `type`

**This must be one of: `boolean`, `choice`, `number` or `string`. By default, `string` is assumed.**

Defines the data type of the input parameter. Input values for the `choice` type are resolved to strings and must be defined in the `options` field. Values for inputs with types `boolean` and `number` are persisted as booleans and integers or floating point numbers respectively, instead of converting them to strings as long as they are not directly used in string interpolations.

### `options`

Provide a list of values as options for the `choice` input. Values are all implicitly cast to strings. **Required if type is `choice` and prohibited otherwise**.

### `default`

Provide a default value for the input parameter. If `type` is choice, then it must be one of the defined `options`, otherwise value type must match with the `type` definition.

## Examples

### String inputs

Default type for inputs is `string`. So, when declaring an input whose values are strings we can omit the `type` field. 

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  greetings:
    inputs:
      name:
        description: Who is greeted?
    scripts:
      - echo "Hello, ${{ inputs.name }}"
{{< /highlight >}}

As in the above example no `default` value is provided, then name must be specified when starting builds for this workflow, or otherwise it will be left blank.

### Boolean inputs

When given boolean values are substituted into the workflow, then their type is kept as boolean as long as they are not directly used within other values that are already strings (such as scripts). Consequently, boolean inputs can be useful to control whether some build steps are enabled or disabled, or they can be used to turn some features on or off. Such as:

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
      - echo "Hello, ${{ inputs.name }}"
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

Defaults are provided for both inputs and standard build can be started without choosing anything. 

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

### Choice inputs

Inputs with type choice provide a way to limit the user to choose only specific predefined values for inputs. Choice options are shown to user as a dropdowns. Choices can be useful to prevent typos or other human errors, and to easily present only the values that are relevant to use-case.

Inputs with type `choice` must define additional field `options` where valid choices are listed.

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

### Number inputs

As with booleans, number types are also persisted when substitutions are being made to workflows unless the value is not directly used within a string. Both integers and floating point numbers are accepted as valid values.

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

## Specify inputs when starting builds with API

Builds for workflows which have inputs without default values cannot be started unless values for those inputs are specified. This also applies when starting builds using [API](/rest-api/builds/#start-a-new-build).

Build input values can be specified via API using the `inputs` field in the start build request payload, where the `inputs` value is an JSON `object` whose keys correspond to input IDs. 

For example, builds for the following workflow

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build-inputs:
    inputs:
      stringInput:
        description: String value
        type: string
      booleanInput:
        description: Boolean value
        type: boolean
      numberInput:
        description: Numeric value
        type: number
        default: 0
    scripts:
      - ...
{{< /highlight >}}

can be started with HTTP request

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <token>" \
     -d '{
       "appId": "<app-id>",
       "workflowId": "build-inputs",
       "inputs": {
         "stringInput": "string value",
         "booleanInput": true,
         "numberInput": 5
       }
     }' \
     -X POST https://api.codemagic.io/builds
{{< /highlight >}}

Note that in the above HTTP request `inputs.numberInput` is actually optional and could have been omitted from request payload as `numberInput` has a default value. In case of omission, the default value `0` would be used.
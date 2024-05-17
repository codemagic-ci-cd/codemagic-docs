---
title: Build inputs
description: Specify optional inputs that are passed to the workflow when starting a build
weight: 6
---

## Overview

Build inputs are customizable parameters that you can define within your workflow. These parameters allow users to provide specific values when starting a build for the workflow, making it more flexible and adaptable to different scenarios.

By using inputs, you can tailor your workflow's behavior based on user-provided values. This eliminates the need to hardcode specific values within the workflow itself, making it more reusable and dynamic.

Inputs are workflow specific and are defined in `codemagic.yaml` under `inputs` mapping (see the [example](#minimal-example) below). Started workflow receives specified input values in the `inputs` context, i.e. `${{ inputs.inputId }}` is replaced with value passed to input with identifier `inputId`.

When starting a build for a workflow that has inputs, Codemagic will show a form where user can enter desired values before starting the build.

#### Minimal example

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  greetings:
    inputs:
      name:
        description: Who is greeted?
        required: false
        default: Codemagic
    scripts:
      - echo "Hello, ${{ inputs.name }}"
{{< /highlight >}}

## YAML schema for inputs

Build inputs are defined in `codemagic.yaml` as a mapping `workflow.<workflow_id>.inputs` where keys are input IDs and values are inputs that have the following fields.

### `required`

A **boolean** value determining whether the input must be specified when starting a build. If `false`, then a default value must be defined. **Must be defined**.

### `description`

A **string** description for this build input. Description is displayed in Codemagic when manually starting a build for this workflow and user is prompted to provide values for the inputs. **Must be defined**.

### `type`

**This must be one of: `boolean`, `choice`, `number` or `string`. By default, `string` is assumed.**

Defines the data type of the input parameter. Input values for the `choice` type are resolved to strings and must be defined in the `options` field. Values for inputs with types `boolean` and `number` are persisted as booleans and integers or floating point numbers respectively, instead of converting them to strings as long as they are not directly used in string interpolations.

### `options`

Provide a list of values as options for the `choice` input. Values are all implicitly cast to strings. **Required if type is `choice` and prohibited otherwise**.

### `default`

Provide a default value for the input parameter. If `type` is choice, then it must be one of the defined `options`, otherwise value type must match with the `type` definition.  **Must be specified if the input is not required and prohibited otherwise**.

## Examples

### String inputs

Default type for inputs is `string`. So, when declaring an input whose values are strings we can omit the `type` field. 

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  greetings:
    inputs:
      name:
        description: Who is greeted?
        required: true
    scripts:
      - echo "Hello, ${{ inputs.name }}"
{{< /highlight >}}

As in the above example input is marked as required, then builds for this workflow can only be started if value is provided for this input.

### Boolean inputs

When given boolean values are substituted into the workflow, then their type is kept as boolean as long as they are not directly used within other values that are already strings (such as scripts). Consequently, boolean inputs can be useful to control whether some build steps are enabled or disabled, or they can be used to turn some features on or off. Such as:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios:
    inputs:
      submitToTestFlight:
        description: Enable testflight submission
        required: false
        type: boolean
        default: false
      runTests:
        description: Run tests before build
        required: false
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
2. whether to submit the build ipa to TestFlight as part of App Store Connect publishing.

Defaults are provided for both inputs and standard build can be started without choosing anything. 

### Choice inputs

Inputs with type choice provide a way to limit the user to choose only specific predefined values for inputs. Choice options are shows to user as a dropdowns. Choices can be useful to prevent typos or other human errors, and to easily present only the values that are relevant to use-case.

Inputs with type `choice` must define additional field `options` where valid choices are listed.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios:
    inputs:
      distributionType:
        description: iOS distribution type 
        required: false
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
        required: false
        type: number
        default: 4
      buildNumber:
        description: Build number for artifact versioning
        required: true
        type: number
      rolloutFraction:
        description: Rollout fraction for Google Play release promotion
        required: false
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

Builds for workflows which have **required inputs** (i.e. inputs without default values) cannot be started without specifying values for those inputs. This also applies when starting builds using [API](/rest-api/builds/#start-a-new-build).

Build input values can be specified via API using the `inputs` field in the start build request payload, where the `inputs` value is an JSON `object` whose keys correspond to input IDs. 

For example, builds for the following workflow

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build-inputs:
    inputs:
      stringInput:
        description: String value
        required: true
        type: string
      booleanInput:
        description: Boolean value
        required: true
        type: boolean
      numberInput:
        description: Numeric value
        required: false
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
         "numberInput": 5,
       }
     }' \
     -X POST https://api.codemagic.io/builds
{{< /highlight >}}

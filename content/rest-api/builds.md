---
title: Builds API
description: API for starting and managing app builds
weight: 3
---

APIs for managing builds are currently available for developers to preview. During the preview period, the API may change without advance notice.
{{<notebox>}}
**Note:** Using REST API will not fetch information about workflows when configuring with **codemagic.yaml**. It is because only workflows from the Workflow Editor are defaulted as no accessible data is present from **codemagic.yaml** until a repository is cloned, which means that there is no way to retrieve workflow IDs from **codemagic.yaml** before triggering a build.
{{</notebox>}}

## Start a new build

`POST /builds`

{{<notebox>}}
**Note:** The workflow and branch information is passed with the curl request when starting builds from an API request. Any configuration related to triggers or branches in Flutter workflow editor or codemagic.yaml is ignored.
{{</notebox>}}

#### Parameters

| **Name**      | **Type** | **Description**                                                                                                                                         |
|---------------| -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `appId`       | `string` | **Required.** The application identifier.                                                                                                               |
| `workflowId`  | `string` | **Required.** The workflow identifier as specified in YAML file.                                                                                        |
| `branch`      | `string` | Optional. The branch name. Either `branch` or `tag` is **required**.                                                                                    |
| `tag`         | `string` | Optional. The tag name. Either `branch` or `tag` is **required**.                                                                                       |
| `environment` | `object` | Optional. Specify environment variables, variable groups, and software versions to override or define in workflow settings.                             |
| `labels`      | `list`   | Optional. Specify labels to be included for the build in addition to existing labels.                                                                   |


#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: <API Token>" \
       --data '{
         "appId": "<app_id>",
         "workflowId": "<workflow_id>",
         "branch": "<git_branch_name>"
       }' \
       -X POST https://api.codemagic.io/builds
{{< /highlight >}}

#### Pass custom build parameters

{{< highlight json "style=paraiso-dark">}}
{
  "appId": "5c9c064185dd2310123b8e96",
  "workflowId": "release",
  "branch": "master",
  "labels": ["foo", "bar"],
  "environment": {
    "variables": {
      "ENVIRONMENT_VARIABLE_1": "...",
      "ENVIRONMENT_VARIABLE_2": "..."
    },
    "groups": [
      "variable_group_1",
      "variable_group_2"
    ],
    "softwareVersions": {
      "xcode": "11.4.1",
      "flutter": "v1.12.13+hotfix.9"
    }
  },
  "instanceType": "mac_mini_m2"
}
{{< /highlight >}}

#### Response

{{< highlight json "style=paraiso-dark">}}
  {
    "buildId":"5fabc6414c483700143f4f92"
  }
{{< /highlight >}}


## Cancel build

`POST /builds/:id/cancel`

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: <API Token>" \
       --request POST https://api.codemagic.io/builds/<build_id>/cancel
{{< /highlight >}}

The request will return `208 Already Reported` if the build has already finished.

{{<notebox>}}
**Note:** If you have multiple similar workflows for the same project, you can configure your workflows dynamically using API calls, read more about it <a href="https://blog.codemagic.io/dynamic-workflows-with-codemagic-api/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','dynamic-workflows-with-codemagic-api')">here</a>.
{{</notebox>}}

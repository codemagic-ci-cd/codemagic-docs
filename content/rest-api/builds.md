---
title: Builds API
description: API for starting and managing app builds
weight: 3
---

APIs for managing builds are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Start a new build

`POST /builds`

{{<notebox>}}
**Note:** The workflow and branch information is passed with the curl request when starting builds from an API request. Any configuration related to triggers or branches in Flutter workflow editor or codemagic.yaml is ignored.
{{</notebox>}}

#### Parameters

| **Name**      | **Type** | **Description** |
| ------------- | -------- | --------------- |
| `appId`       | `string` | **Required.** The application identifier. |
| `workflowId`  | `string` | **Required.** The workflow identifier as specified in YAML file. |
| `branch`      | `string` | Optional. The branch name. Either `branch` or `tag` is **required**. |
| `tag`         | `string` | Optional. The tag name. Either `branch` or `tag` is **required**. |
| `environment` | `object` | Optional. Specify environment variables, variable groups, and software versions to override or define in workflow settings. | 
| `labels`      | `list`   | Optional. Specify labels to be included for the build in addition to existing labels. |


#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: <API Token>" \
       --data '{
         "appId": "<app_id>",
         "workflowId": "<workflow_id>",
         "branch": "<git_branch_name>"
       }' \
       https://api.codemagic.io/builds
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
  }
}
{{< /highlight >}}

#### Response

{{< highlight json "style=paraiso-dark">}}
  {
    "buildId":"5fabc6414c483700143f4f92"
  }
{{< /highlight >}}


## Get a list of builds

`GET /builds`

Returns information about builds from the Codemagic build history. Filters are applicable.

#### Parameters

| **Name**      | **Type** | **Description** |
| ------------- | -------- | --------------- |
| `appId`       | `string` | **Optional.** The application identifier. |
| `workflowId`  | `string` | **Optional.** The workflow identifier as specified in YAML file. |
| `branch`      | `string` | **Optional.** The branch name. |
| `tag`         | `string` | **Optional.** The tag name. |

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: <API Token>" \
       --request GET https://api.codemagic.io/builds?appId=<app_id>&workflowId=<workflow_id>&branch=<branch_name>&tag=<tag_name>
{{< /highlight >}}

#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "applications": [
    {
      "_id": "5d85eaa0e941e00019e81bc2",
      "appName": "counter_flutter",
      ...
    }
  ],
  "builds": [
    {
      "_id": "5ec8eea2261f342603f4d0bc",
      "appId": "5d85eaa0e941e00019e81bc2",
      "workflowId": "5d85f242e941e00019e81bd2",
      "branch": "develop",
      "tag": null,
      "status": "finished",
      "startedAt": "2020-09-08T07:18:02.203+0000",
      "finishedAt": "2020-09-08T07:20:13.040+0000",
      "artefacts": [
        {
          "md5": "81298e2f39a0e2d401b583f4f32d88d1",
          "name": "app-debug.apk",
          "packageName": "io.codemagic.counter-flutter",
          "size": 59325441,
          "type": "apk",
          "url": "https://static.codemagic.io/files/2667d83f-a05b-44a5-8839-51fd4b05e7ce/d44b59f6-ebe9-4ca5-80ee-86ce372790ee/app-debug.apk",
          "versionName": "1.0.2"
        },
        {
          "md5": "d34bf9732ef125bd761d76b2cf3017bc",
          "name": "Runner.app",
          "size": 96849493,
          "type": "app",
          "url": "https://static.codemagic.io/files/5020d900-14c2-4e96-9c95-93869e1e2d2f/0ec3367c-704e-4d36-895b-6b3944e43113/Runner.app"
        }
      ],
      ...
    },
    ...
  ]
}
{{< /highlight >}}

## Get build status

`GET /builds/:id`

Returns the build information of an already running build on Codemagic. **Status** will be one of:

`building`, `canceled`, `finishing`, `finished`, `failed`, `fetching`, `preparing`, `publishing`, `queued`, `skipped`, `testing`, `timeout`, `warning`

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: <API Token>" \
       --request GET https://api.codemagic.io/builds/<build_id>
{{< /highlight >}}

#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "application": {
    "_id": "5d85eaa0e941e00019e81bc2",
    "appName": "counter_flutter"
  },
  "build": {
    "_id": "5ec8eea2261f342603f4d0bc",
    "startedAt": "2020-05-23T09:36:39.028+0000",
    "status": "building",
    "workflowId": "5d85f242e941e00019e81bd2"
  }
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

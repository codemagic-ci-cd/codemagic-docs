---
title: Applications API
description: API for managing apps added to Codemagic
weight: 2
---

APIs for managing applications are currently available for developers to preview. During the preview period, the API may change without advance notice.

{{<notebox>}}
**Using the API with apps configured with codemagic.yaml:**<br>
Unlike with Workflow Editor, information about workflows in **codemagic.yaml** is not stored in Codemagic and is therefore not available before starting a build and cloning the repository. Therefore, the API does not return workflow information such as `workflowId` for **codemagic.yaml** workflows.
{{</notebox>}}

## Retrieve all applications

`GET /apps`

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     --request GET https://api.codemagic.io/apps
{{< /highlight >}}


#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "applications": [{
    "_id": "6172cc7d57278d06d4e915f1",
	"appName": "Foobar-App",
	"workflowIds": [
	  "5d85f242e941e00019e81bd2"
	],
	"workflows": {
	  "5d85f242e941e00019e81bd2": {
	    "name": "Android Workflow"
	   }
	}
  }]
}
{{< /highlight >}}


## Retrieve an application

`GET /apps/:id`

Based on the application id provided, returns the applications information.

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     --request GET https://api.codemagic.io/apps/<app_id>
{{< /highlight >}}


#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "application": {
    "_id": "5d85eaa0e941e00019e81bc2",
    "appName": "counter_flutter",
    "branches": [
      "master"
    ],
    "workflowIds": [
      "5d85f242e941e00019e81bd2"
    ],
    "workflows": {
      "5d85f242e941e00019e81bd2": {
        "name": "Android Workflow"
      }
    }
  }
}
{{< /highlight >}}


## Add a new application

`POST /apps`

Adds a Git repository to the applications list.

#### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `repositoryUrl` | `string` | **Required.** SSH or HTTPS URL for cloning the repository. |
| `teamId` | `string` | **Optional.** Team ID, if you wish to add an app directly to one of your teams. You must be an admin in the team specified. |

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -d '{
       "repositoryUrl": "git@github.com:my-organization/my-repo.git"
     }' \
     -X POST https://api.codemagic.io/apps  
{{< /highlight >}}


#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "_id": "5c9c064185dd2310123b8e96",
  "appName": "my-repo"
}
{{< /highlight >}}


## Add a new application from a private repository

`POST /apps/new`

Creates an application from a private repository with an SSH key

#### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `repositoryUrl` | `string` | **Required.** SSH or HTTPS URL for cloning the repository. |
| `sshKey` | `JSON` | **Required.** |
| `projectType` | `string` | `flutter-app` when adding Flutter application. | 
| `teamId` | `string` | **Optional.** Team ID, if you wish to add an app directly to one of your teams. You must be an admin of the team specified. |

#### `sshKey` parameter

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `data` | `string` | **Required.** `base64`-encoded private key file. |
| `passphrase` | `string` | **Required.** SSH key passphrase or `null` if it SSH key is without a passphrase. | 

To encode private key file and paste result to clipboard

{{< highlight bash "style=paraiso-dark">}}
base64 id_rsa | pbcopy
{{< /highlight >}}


#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: <API Token>" \
       -d '{
         "repositoryUrl": "git@github.com:my-organization/my-repo.git",
         "sshKey": {
           "data": "St89hgb-BASE64-ENCODED-SSH-KEY-FILE-H4ga7jgf==", 
           "passphrase": null
         }
       }' \
       -X POST https://api.codemagic.io/apps 
{{< /highlight >}}


#### Response

{{< highlight json "style=paraiso-dark">}}
{"application" : {
  "_id": "5c9c064185dd2310123b8e96",
  "appName": "my-repo"
}}
{{< /highlight >}}


## Modify application variables and secrets

For up-to-date information on managing environment variables and secrets, please refer to the **Secrets and Environment Vars** endpoints in [Codemagic REST API documentation](https://codemagic.io/api/v3/schema).


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



## Encrypting base64 encoded values

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: $CM_API_TOKEN" \
       -d '{
         "appId": "YOUR_APP_ID", 
         "value": "BASE64_ENCODED_VALUE"
       }' \
       -X POST https://api.codemagic.io/apps/YOUR_APP_ID/encrypt-environment-variable
{{< /highlight >}}


#### Response

{{< highlight json "style=paraiso-dark">}}
  {
    "encrypted": "Encrypted(Z0FBQUFBQmZMVkhwb3Q3QlJtRlVOeVFJcEJvTTRtWnZablpqMS0xN2V6dllTell1ODZSd2FUcnNqMUlZT09QY1paV0pjbVRfUlVJeDUxRWIzX1paOEZlc1dSdi1XMXlkUFVIdjNIZ2VqcE5Ja0tpMjlPWjhlSTQ9)"
  }
{{< /highlight >}}


## Modify application variables and secrets

Codemagic allows you to fetch and modify application variables and secrets using the REST API. Note that the API works slightly differently depending on whether your application is configured to use the `Workflow Editor` or `YAML configuration`.

For yaml, variables and secrets are manually configured on the **Environment variables** tab in your application settings. These variables and secrets can be accessed in your configuration file across all workflows with the use of [groups](../building/environment-variable-groups). Variables configured for the `Workflow Editor` are specific to one workflow.

### Fetch variables

`GET /apps/:id/variables`

Based on the application id provided, returns the configured variables.

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -XGET \
       -H 'x-auth-token: <API Token>' \
       -H "Content-type: application/json" \
       'https://api.codemagic.io/apps/<app_id>/variables'
{{< /highlight >}}


#### Response

##### Response for applications using codemagic.yaml
{{< highlight json "style=paraiso-dark">}}
[
  {
    "group": "production",
    "id": "619e329e0ca5fe19c3780c74",
    "key": "FOO",
    "secure": true,
    "value": "[HIDDEN]"
  }
]
{{< /highlight >}}


##### Response for applications using Workflow Editor
{{< highlight json "style=paraiso-dark">}}
[
  {
    "id": "61b06dbe72d7ad0017679014", 
    "key": "FOO", 
    "secure": true, 
    "value": "[HIDDEN]", 
    "workflowId": "60f0520c4c8734015080d401", 
    "workflowName": "Default Workflow"
  }
]
{{< /highlight >}}


### Add new variable

`POST /apps/:id/variables/`

#### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `key` | `string` | **Required.** Name of the variable. |
| `value` | `string` | **Required.** Value of the variable. For binary data use base64 to encode the contents. |
| `group` | `string` | **Optional.** Required for applications using yaml configuration. Name of the `group` that the variable should be added to. If the group does not exist, it will be created. | 
| `workflowId` | `string` | **Optional.** Required for applications using Workflow Editor. ID of the `workflow` that the variable should be added to. | 
| `secure` | `boolean` | **Optional.** By default, the variable is encrypted. Set to `false` to not encrypt the newly added variable. |

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -XPOST \
       -H 'x-auth-token: <API TOKEN>' \
       -H "Content-type: application/json" \
       -d '{
         "key": "FOO",
         "value": "foobar",
         "group": "production",
         "secure": true
        }' \
       'https://api.codemagic.io/apps/<app_id>/variables'
{{< /highlight >}}


#### Example of adding file variables

It is possible to pass text-based files to the `cURL` command with the help of CLI tools, such as `sed` or `awk` (which is used in the example below).
These tools provide options to properly retain newlines, which are essential for some files (e.g. private keys) to function correctly.


{{< highlight bash "style=paraiso-dark">}}
  FILE=$(awk 1 ORS='\\n' file_path)
  curl -XPOST -H 'x-auth-token: <API TOKEN>' \
       -H 'Content-Type: application/json;charset=utf-8' \
       -d "{
       \"key\":\"FOO\",
       \"value\":\"$FILE\", 
       \"group\":\"production\", 
       \"secure\": true
       }" \
       'https://api.codemagic.io/apps/<app_id>/variables'
{{< /highlight >}}


To add binary-based files (e.g. images), they need to be [`base64 encoded`](../variables/environment-variable-groups/#storing-sensitive-valuesfiles) first before passing them to the value parameter as strings. Note that the values will have to be `base64 decoded` during the build in order to be used.


#### Response

##### Response for applications using codemagic.yaml
{{< highlight json "style=paraiso-dark">}}
{
  "group": "production",
  "id": "619e329e0ca5fe19c3780c74",
  "key": "FOO",
  "secure": true,
  "value": "[HIDDEN]"
}
{{< /highlight >}}


##### Response for applications using Workflow Editor
{{< highlight json "style=paraiso-dark">}}
{
  "id": "61b06dbe72d7ad0017679014", 
  "key": "FOO", 
  "secure": true, 
  "value": "[HIDDEN]", 
  "workflowId": "60f0520c4c8734015080d401", 
  "workflowName": "Default Workflow"
}
{{< /highlight >}}


### Update existing variable

`POST /apps/:id/variables/:variable_id`

#### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `value` | `string` | **Required.** New value for the updated variable. |
| `secure` | `boolean` | **Optional.** By default, the variable is encrypted. Set to `false` to not encrypt the newly added variable. |


#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -XPOST \
       -H 'x-auth-token: <API Token>' \
       -H "Content-type: application/json" \
       -d '{
         "value": "foobar2",
         "secure": false
       }' \
       'https://api.codemagic.io/apps/<app_id>/variables/<variable_id>'
{{< /highlight >}}


#### Response

##### Response for applications using codemagic.yaml
{{< highlight json "style=paraiso-dark">}}
{
  "group": "production",
  "id": "619e329e0ca5fe19c3780c74",
  "key": "FOO",
  "secure": false,
  "value": "foobar2"
}
{{< /highlight >}}


##### Response for applications using Workflow Editor
{{< highlight json "style=paraiso-dark">}}
{
  "id": "61b06dbe72d7ad0017679014", 
  "key": "FOO", 
  "secure": false, 
  "value": "foobar2",
  "workflowId": "60f0520c4c8734015080d401", 
  "workflowName": "Default Workflow"
}
{{< /highlight >}}


### Remove variable

`DELETE /apps/:id/variables/:variable_id`

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -XDELETE \
       -H 'X-Auth-Token: <API Token>' \
       -H "Content-type: application/json" \
       'https://api.codemagic.io/apps/<app_id>/variables/<variable_id>'
{{< /highlight >}}


#### Response

The response status code of a successful deletion is `204`.

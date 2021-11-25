---
title: Applications
weight: 2
---

APIs for managing applications are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Retrieve all applications

`GET /apps`

### Example

```bash
curl -H "Content-Type: application/json" -H "x-auth-token: <API Token>" --request GET https://api.codemagic.io/apps
```

### Response

```json
{
  "applications": [{
    "_id": "6172cc7d57278d06d4e915f1",
    "appName": "Foobar-App"
   }]
}
```

## Retrieve an application

`GET /apps/:id`

Based on the application id provided, returns the applications information.

### Example

```bash
curl -H "Content-Type: application/json" -H "x-auth-token: <API Token>" --request GET https://api.codemagic.io/apps/<app_id>
```

### Response

```yaml
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
```

## Add a new application

`POST /apps`

Adds a Git repository to the applications list.

### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `repositoryUrl` | `string` | **Required.** SSH or HTTPS URL for cloning the repository. |
| `teamId` | `string` | **Optional.** ID of a team if you wish to add an app directly to one of your teams. You must be an owner of the team specified. |

### Example

```yaml
{
  "repositoryUrl": "git@github.com:my-organization/my-repo.git"
}
```

### Response

```yaml
{
  "_id": "5c9c064185dd2310123b8e96",
  "appName": "my-repo"
}
```

## Add a new application from private repository

`POST /apps/new`

Creates an application from a private repository with SSH key

### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `repositoryUrl` | `string` | **Required.** SSH or HTTPS URL for cloning the repository. |
| `sshKey` | `JSON` | **Required.** |
| `projectType` | `string` | `flutter-app` when adding Flutter application. | 
| `teamId` | `string` | **Optional.** ID of a team if you wish to add an app directly to one of your teams. You must be an owner of the team specified. |

#### `sshKey` parameter

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `data` | `string` | **Required.** `base64`-encoded private key file. |
| `passphrase` | `string` | **Required.** SSH key passphrase or `null` if it SSH key is without passphrase. | 

To encode private key file and paste result to clipboard

```bash
base64 id_rsa | pbcopy
```

### Example

```json
{
  "repositoryUrl": "git@github.com:my-organization/my-repo.git",
  "sshKey": {"data": "St89hgb-BASE64-ENCODED-SSH-KEY-FILE-H4ga7jgf==", "passphrase": null}
}
```

### Response

```json
{"application" : {
  "_id": "5c9c064185dd2310123b8e96",
  "appName": "my-repo"
}}
```

## Encrypt an environment variable

`POST /apps/:id/encrypt-environment-variable`

Generates an encrypted string that will be decrypted inside our machines when building the app. It can be used in YAML environment variables without exposing the plain text content in version control.

Note that the variables will need to be re-generated when moving the app to a different team.

### CURL example

```
curl 'https://api.codemagic.io/apps/your-app-id/encrypt-environment-variable' \
 -H 'X-Auth-Token: your-token' \
 -H 'Content-Type: application/json;charset=utf-8' \
 --data '{"value": "your value"}'
```

### Response

```yaml
{"encrypted": "Encrypted(Z0FBQUFBQmZMVkhwb3Q3QlJtRlVOeVFJcEJvTTRtWnZablpqMS0xN2V6dllTell1ODZSd2FUcnNqMUlZT09QY1paV0pjbVRfUlVJeDUxRWIzX1paOEZlc1dSdi1XMXlkUFVIdjNIZ2VqcE5Ja0tpMjlPWjhlSTQ9)"}
```

## Modify application variables and secrets

Codemagic allows you to fetch and modify application variables and secrets using the REST API. Note that these variables are available only for the applications that are configured using the `codemagic.yaml` file. For such applications, variables and secrets are manually configured on the **Environment variables** tab in your application settings. These variables and secrets can be accessed in your configuration file with the use of [groups](../building/environment-variable-groups).

### Fetch variables

`GET /apps/:id/variables`

Based on the application id provided, returns the configured variables.

#### Example

```bash
curl -XGET -H 'x-auth-token: <API Token>' -H "Content-type: application/json" 'https://api.codemagic.io/apps/<app_id>/variables'
```

#### Response

```json
[
  {
    "group": "production",
    "id": "619e329e0ca5fe19c3780c74",
    "key": "FOO",
    "secure": true,
    "value": "[HIDDEN]"
  }
]
```

### Add new variable

`POST /apps/:id/variables/`

#### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `key` | `string` | **Required.** Name of the variable. |
| `value` | `string` | **Required.** Value of the variable. For binary data use base64 to encode the contents. |
| `group` | `string` | **Required.** Name of the `group` that the variable should be added to. If the group does not exist, it will be created. | 
| `secure` | `boolean` | **Optional.** By default, the variable is encrypted. Set to `false` to not encrypt the newly added variable. |

#### Example

```bash
curl -XPOST -H 'x-auth-token: <API TOKEN>' -H "Content-type: application/json" -d '{
    "key": "FOO",
    "value": "foobar",
    "group": "production",
    "secure": true
  }' 'https://api.codemagic.io/apps/<app_id>/variables'
```

#### Response

```json
{
  "group": "production",
  "id": "619e329e0ca5fe19c3780c74",
  "key": "FOO",
  "secure": true,
  "value": "[HIDDEN]"
}
```

### Update existing variable

`POST /apps/:id/variables/:variable_id`

#### Parameters

| **Name**        | **Type** | **Description** |
| --------------- | -------- | --------------- |
| `value` | `string` | **Required.** New value for the updated variable. |
| `secure` | `boolean` | **Optional.** By default, the variable is encrypted. Set to `false` to not encrypt the newly added variable. |


#### Example

```bash
curl -XPOST -H 'x-auth-token: <API Token>' -H "Content-type: application/json" -d '{
    "value": "foobar2",
    "secure": false
  }' 'https://api.codemagic.io/apps/<app_id>/variables/<variable_id>'
```

#### Response

```json
{
  "group": "production",
  "id": "619e329e0ca5fe19c3780c74",
  "key": "FOO",
  "secure": false,
  "value": "foobar2"
}
```

### Remove variable

`DELETE /apps/:id/variables/:variable_id`

#### Example

```bash
curl -XDELETE -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" 'https://api.codemagic.io/apps/<app_id>/variables/<variable_id>'
```

#### Response

The response status code of a successful deletion is `204`.

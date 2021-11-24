---
title: Applications
weight: 2
---

APIs for managing applications are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Retrieve an application

`GET /apps/:id`

Based on the application id provided, returns the applications information.

### Curl request

```bash
curl -H "Content-Type: application/json" -H "x-auth-token: <API Token>" --request GET https://api.codemagic.io/apps/<app_id>
```

### Response

```yaml
{
  'application':
    {
      '_id': '5d85eaa0e941e00019e81bc2',
      'appName': 'counter_flutter',
      'branches': ['master'],
      'workflowIds': ['5d85f242e941e00019e81bd2'],
      'workflows': { '5d85f242e941e00019e81bd2': { 'name': 'Android Workflow' } },
    },
}
```

## Add a new application

`POST /apps`

Adds a Git repository to the applications list.

### Parameters

| **Name**        | **Type** | **Description**                                                                                                                 |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `repositoryUrl` | `string` | **Required.** SSH or HTTPS URL for cloning the repository.                                                                      |
| `teamId`        | `string` | **Optional.** ID of a team if you wish to add an app directly to one of your teams. You must be an owner of the team specified. |

### Example

```yaml
{ 'repositoryUrl': 'git@github.com:my-organization/my-repo.git' }
```

### Response

```yaml
{ '_id': '5c9c064185dd2310123b8e96', 'appName': 'my-repo' }
```

## Add a new application from private repository

`POST /apps/new`

Creates an application from a private repository with SSH key

### Parameters

| **Name**        | **Type** | **Description**                                                                                                                 |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `repositoryUrl` | `string` | **Required.** SSH or HTTPS URL for cloning the repository.                                                                      |
| `sshKey`        | `JSON`   | **Required.**                                                                                                                   |
| `projectType`   | `string` | `flutter-app` when adding Flutter application.                                                                                  |
| `teamId`        | `string` | **Optional.** ID of a team if you wish to add an app directly to one of your teams. You must be an owner of the team specified. |

#### `sshKey` parameter

| **Name**     | **Type** | **Description**                                                                 |
| ------------ | -------- | ------------------------------------------------------------------------------- |
| `data`       | `string` | **Required.** `base64`-encoded private key file.                                |
| `passphrase` | `string` | **Required.** SSH key passphrase or `null` if it SSH key is without passphrase. |

To encode private key file and paste result to clipboard

```bash
base64 id_rsa | pbcopy
```

### Example

```json
{
  "repositoryUrl": "git@github.com:my-organization/my-repo.git",
  "sshKey": { "data": "St89hgb-BASE64-ENCODED-SSH-KEY-FILE-H4ga7jgf==", "passphrase": null }
}
```

### Response

```json
{
  "application": {
    "_id": "5c9c064185dd2310123b8e96",
    "appName": "my-repo"
  }
}
```

## Encrypt an environment variable

`POST /apps/:id/encrypt-environment-variable`

Generates an encrypted string that will be decrypted inside our machines when building the app. It can be used in YAML environment variables without exposing the plain text content in version control.

Note that the variables will need to be re-generated when moving the app to a different team.

### CURL example

```bash
curl 'https://api.codemagic.io/apps/your-app-id/encrypt-environment-variable' \
 -H 'X-Auth-Token: <API Token>' \
 -H 'Content-Type: application/json;charset=utf-8' \
 --data '{"value": "your value"}'
```

### Response

```yaml
{
  'encrypted': 'Encrypted(Z0FBQUFBQmZMVkhwb3Q3QlJtRlVOeVFJcEJvTTRtWnZablpqMS0xN2V6dllTell1ODZSd2FUcnNqMUlZT09QY1paV0pjbVRfUlVJeDUxRWIzX1paOEZlc1dSdi1XMXlkUFVIdjNIZ2VqcE5Ja0tpMjlPWjhlSTQ9)',
}
```

## Modify application variables and secrets

Codemagic allows you to fetch and modify application variables and secrets using the REST API. Note that these variables are available only for applications using the `codemagic.yaml` file for configuration. They can be manually configured under **Your application > Environment variables**.

### Fetch variables

`GET /apps/:id/variables`

#### CURL request

```bash
curl -XGET -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" 'https://api.codemagic.io/apps/<app_id>/variables'
```

#### Response

```json
{
  [
      {
          "key": "your variable name",
          "value": "your variable value",
          "group": "your variable group",
          "secure": false
      },
  ]
}
```

### Add new variable

`POST /apps/:id/variables/`

#### Payload

To successfully add a new variable, it is necessary to provide the values for `key`, `value` and `group` as JSON data. By default, the variable is encrypted. Set the value of `secure` to `false` to not encrypt the newly added variable. An example payload:


```json
{
  "key": "your variable name",
  "value": "your variable value",
  "group": "your variable group",
  "secure": true
}
```

Note that the `key` and `group` values have to be strings with a length greater than zero. Furthermore, if the group does not exist, it will be created.

#### CURL request

```bash
curl -XPOST -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" -d '{
    "key": "your variable name",
    "value": "your variable value",
    "group": "your variable group",
    "secure": true
  }' 'https://api.codemagic.io/apps/<app_id>/variables'
```

#### Response

```json
{
  [
      {
          "key": "your variable name",
          "value": "Encrypted(...)",
          "group": "your variable group",
          "secure": true
      },
  ]
}
```

### Update existing variable

`POST /apps/:id/variables/:variable_id`

#### Payload

To successfully update a variable, it is necessary to provide the value for `value` as JSON data. It is not possible to update the value of the `secure` key on its own.

Note that by default all updated values are encrypted. In order to not encrypt the updated variable, set the value of `secure` to `false`.

An example payload:

```json
{
  "value": "your new variable value",
  "secure": false
}
```

#### CURL request

```bash
curl -XPOST -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" -d '{
    "value": "your new variable value",
    "secure": false
  }' 'https://api.codemagic.io/apps/<app_id>/variables/<variable_id>'
```

#### Response

```json
{
  [
      {
          "key": "your variable name",
          "value": "your new variable value",
          "group": "your variable group",
          "secure": false
      },
  ]
}
```

### Remove variable

`DELETE /apps/:id/variables/:variable_id`

#### CURL request

```bash
curl -XDELETE -H 'X-Auth-Token: <API Token>' -H "Content-type: application/json" 'https://api.codemagic.io/apps/<app_id>/variables/<variable_id>'
```

#### Response

The response status code of a successful deletion is `204`.

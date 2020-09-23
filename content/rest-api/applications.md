---
title: Applications
weight: 2
---

APIs for managing applications are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Retrieve an application

`GET /apps/:id`

Returns an application information based upon the application id supplied.

### Curl request

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
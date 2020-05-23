---
title: Builds
weight: 3
---

APIs for managing builds are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Start a new build

`POST /builds`

### Parameters

| **Name**      | **Type** | **Description** |
| ------------- | -------- | --------------- |
| `appId`       | `string` | **Required.** The application identifier. |
| `workflowId`  | `string` | **Required.** The workflow identifier as specified in YAML file. |
| `branch`      | `string` | **Required.** The branch name. |
| `environment` | `object` | Optional. Specify environment variables and software versions to override values defined in workflow settings. | 

### Curl request

```bash
curl -H "Content-Type: application/json" -H "x-auth-token: <API Token>" --data '{"appId": "<app_id>","workflowId": "<workflow_id>","branch": "<git_branch_name>"}' https://api.codemagic.io/builds
```

### Example

```javascript
{
    "appId": "5c9c064185dd2310123b8e96",
    "workflowId": "release",
    "branch": "master",
    "environment": {
        "variables": {
            "ENVIRONMENT_VARIABLE_1": "...",
            "ENVIRONMENT_VARIABLE_2": "..."
        },
        "softwareVersions": {
            "xcode": "11.4.1",
            "flutter": "v1.12.13+hotfix.9"
        }
    }
}
```

### Response

```javascript
{
    "application": {
        "_id": "5c9c064185dd2310123b8e96",
        "appName": "my-repo"
    },
    "build": {
        "_id": "5c9c025185ed4300133b2a17",
        "appId": "5c9c064185dd2310123b8e96",
        "branch": "master",
        "index": 1,
        "status": "queued"
    }
}
```

## Cancel build

`POST /builds/:id/cancel`

The request will return `208 Already Reported` if the build has already finished.

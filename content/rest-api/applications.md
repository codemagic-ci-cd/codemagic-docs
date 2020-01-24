---
title: Applications
weight: 2
---

APIs for managing applications are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Add a new application

`POST /apps/new`

Adds git repository to application list.

### Parameters

| **Name**     | **Type** | **Description** |
| ------------ | -------- | --------------- |
| `repositoryUrl` | `string` | **Required.** SSH or HTTPS url to the repository. |

### Example

```javascript
{
    "repositoryUrl": "git@github.com:my-organization/my-repo.git"
}
```

### Response

```javascript
{
    "_id": "5c9c064185dd2310123b8e96",
    "appName": "my-repo"
}
```

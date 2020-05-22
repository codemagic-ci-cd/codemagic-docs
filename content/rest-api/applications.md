---
title: Applications
weight: 2
---

APIs for managing applications are currently available for developers to preview. During the preview period, the API may change without advance notice.

## Retrieve applications list

`GET /apps`

Returns the full applications list present on your Codemagic account.

### Curl request

```bash
curl -H "Content-Type: application/json" -H "x-auth-token: <API Token>" --request GET https://api.codemagic.io/apps
```

### Response

```javascript
{
   "applications":[
      {
         "_id":"5d85eaa0e941e00019e81bc2",
         "appName":"counter_flutter",
         "branches":[
            "master"
         ],
         "lastBuildId":"5ec3890aa954c221d5acbb79",
         "workflowIds":[
            "5d85f242e941e00019e81bd2"
         ],
         "workflows":{
            "5d85f242e941e00019e81bd2":{
               "_id":"5d85f242e941e00019e81bd2",
               "name":"Android Workflow"
            }
         }
      }
   ],
   "builds":[
      {
         "_id":"5ec3890aa954c221d5acbb79",
         "buildActions":[
            {
               "finishedAt":"2020-05-19T07:21:55.873+0000",
               "name":"Preparing build machine",
               "startedAt":"2020-05-19T07:21:50.015+0000",
               "status":"canceled",
               "type":"preparing"
            }
         ],
         "finishedAt":"2020-05-19T07:21:55.873+0000",
         "startedAt":"2020-05-19T07:21:50.015+0000",
         "status":"canceled",
         "workflowId":"5d85f242e941e00019e81bd2"
      }
   ]
}
```

## Retrieve an application

`GET /apps/:id`

Returns an application information based upon the application id supplied.

### Curl request

```bash
curl -H "Content-Type: application/json" -H "x-auth-token: <API Token>" --request GET https://api.codemagic.io/apps/<app_id>
```

### Response

```javascript
{
   "application":{
      "_id":"5d85eaa0e941e00019e81bc2",
      "appName":"counter_flutter",
      "branches":[
         "master"
      ],
      "workflowIds":[
         "5d85f242e941e00019e81bd2"
      ],
      "workflows":{
         "5d85f242e941e00019e81bd2":{
            "name":"Android Workflow"
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

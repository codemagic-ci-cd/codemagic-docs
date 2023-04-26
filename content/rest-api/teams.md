---
title: Teams API
description: API for managing team members

weight: 5
---

This document describes the API endpoints for managing teams. To use this API, you must be a **team owner**.


>Read more about the [Teams](../getting-started/teams/) feature, the available user roles and permissions.



## Invite a new team member
Invite a new team member to your team.

`POST /:team_id/invitation`

#### Parameters


| **Name** | **Type** | **Description**                               |
|----------| -------- |-----------------------------------------------|
| `email`  | `string` | **Required.** User email                    |
| `role`   | `string` | **Required.** Could be `owner` or `developer` |

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -d '{
        "email": "your_user@domain.com",
        "role": "developer"
     }' \
     -X POST https://api.codemagic.io/<team_id>/invitation
{{< /highlight >}}


#### Response

A full team object is returned. You can see that your invitation has been created
in the `invitations` section.
Also, you can see your current active team members in the `collaborators` section,
 where you can locate their `user_ids`.


{{< highlight json "style=paraiso-dark">}}
{
  "team":{
    "_id":"<team_id>",
    "applicationIds":[...],
    "billing":{...},
    "buildTimes": {...},
    "collaborators":[                       // <--- current team members
        {
            "createdAt": "<date>",
            "addedBy": "<creator_user_id>",
            "activatedAt":"<date>",
            "updatedAt":"<date>",
            "user":
                {
                    "id": <user_id>,        // <--- <user_id> of your team member
                    "name": <user_name>,
                    "email": <user_email>
                },
        },
        ...
    ],
    "invitations": [                        // <--- you can see your invitation here

        {
            "invitedFrom": "email",
            "isPendingRemoved": false,
            "role": "developer",
            "addedBy": "<user_id>",
            "updatedAt": "<update_date>",
            "createdAt": "<create_date>",
            "email": "your_user@domain.com",
            "permissions": [...],
            "inviteCode": "<invite_code>"}
        ],
        ...
        ...
    }
}
{{< /highlight >}}


## Change a team member role


Change the role of your team members. The available roles are `owner` and `developer` (corresponds to "member" in the UI).

`PUT /:team_id/collaborator/:user_id`

#### Parameters


| **Name** | **Type** | **Description**                                            |
|----------| -------- |------------------------------------------------------------|
| `role`   | `string` | **Required.** Could be `owner` or `developer`              |


#### Example

How to upgrade a current member of your team to team owner:

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -d '{
        "role": "owner"
     }' \
     -X PUT https://api.codemagic.io/<team_id>/collaborator/<user_id>
{{< /highlight >}}


#### Response

A collaborator object is returned. You can see that the role has changed:


{{< highlight json "style=paraiso-dark">}}

{
    "collaborator":
        {
            "updatedAt":"<date>",
            "updatedBy":"<your_user_id>",
            "createdAt":"<date>",
            "permissions":
                [
                    "apps_delete",
                    "apps_edit",
                    ...
                ],
            "isActiveRemoved":false,
            "isExpiring":false,
            "role":"owner",
            "user":{<user_info>},
            "addedBy":"<user_id>",
            "activatedAt":"<date>"
        }
}

{{< /highlight >}}



## Delete a team member


`DELETE /:team_id/collaborator/:user_id`

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -X DELETE https://api.codemagic.io/<team_id>/collaborator/<user_id>
{{< /highlight >}}


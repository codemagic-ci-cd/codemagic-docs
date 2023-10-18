---
title: Teams API
description: API for managing team members

weight: 5
---

This document describes the API endpoints for managing teams. To use this API, you must be a **team admin**.

>Read more about the [Teams](../getting-started/teams/) feature, the available user roles and permissions.

## Invite a new team member
Invite a new team member to your team.

`POST /team/:team_id/invitation`

#### Parameters

| **Name** | **Type** | **Description**                               |
|----------| -------- |-----------------------------------------------|
| `email`  | `string` | **Required.** User email                    |
| `role`   | `string` | **Required.** Could be `owner` or `developer` |

<br>

>`developer` role corresponds to the **Member** role and `owner` role corresponds to the **Admin** role in Codemagic UI.


#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -d '{
        "email": "your_user@domain.com",
        "role": "developer"
     }' \
     -X POST https://api.codemagic.io/team/<team_id>/invitation
{{< /highlight >}}

#### Response

A full team object is returned.

## Delete a team member
Remove a team member from the team.

`DELETE /team/:team_id/collaborator/:user_id`

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -X DELETE https://api.codemagic.io/team/<team_id>/collaborator/<user_id>
{{< /highlight >}}


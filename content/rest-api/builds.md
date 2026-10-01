---
title: Builds API
description: API for starting and managing app builds
weight: 3
---

Use the Codemagic REST API to start builds, check their status, and list builds for your team. For the full list of endpoints, request parameters, and response formats, see the **Builds** section of the [Codemagic REST API documentation](https://codemagic.io/api/v3/schema#tag/builds).

## Available endpoints

| **Endpoint**                                   | **Description**                                               |
|------------------------------------------------|---------------------------------------------------------------|
| `POST /api/v3/apps/{app_id}/builds`            | Start a new build for an application.                         |
| `GET /api/v3/builds/{build_id}`                | Get information about a build, including its status.          |
| `GET /api/v3/builds/{build_id}/actions`        | Get the actions (steps) of a build.                           |
| `GET /api/v3/builds/{build_id}/remote-access`  | Get remote access information for a build.                    |
| `GET /api/v3/teams/{team_id}/builds`           | List builds for a team.                                       |

Requests are authenticated with the `x-auth-token` header. See [Codemagic REST API](/rest-api/codemagic-rest-api/) for how to get your API token.

## Start a new build

`workflow_id` can be either the ID of a workflow in your `codemagic.yaml` file (as in `workflows.<workflow_id>`) or the ID of a Workflow Editor workflow. Exactly one of `branch` or `tag` is required.

{{<notebox>}}
**Note:** The workflow and branch information is passed with the request when starting builds from the API. Any configuration related to triggers or branches in the Flutter Workflow Editor or `codemagic.yaml` is ignored.
{{</notebox>}}

You can also pass labels, an instance type, workflow inputs, and environment overrides in the request body. See the [Codemagic REST API documentation](https://codemagic.io/api/v3/schema#tag/builds) for all available parameters.

## Cancel build

Cancelling builds is not yet available in the new API. Use the following endpoint to cancel a build:

`POST /builds/:id/cancel`

#### Example

{{< highlight bash "style=paraiso-dark">}}
  curl -H "Content-Type: application/json" \
       -H "x-auth-token: <API Token>" \
       --request POST https://api.codemagic.io/builds/<build_id>/cancel
{{< /highlight >}}

The request will return `208 Already Reported` if the build has already finished.

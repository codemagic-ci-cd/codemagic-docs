---
title: API Overview
weight: 1
aliases: /rest-api/overview
---

Codemagic REST API gives you numerous possibilities for integrating your CI/CD builds with other tools or for managing advanced workflow chains. 

Codemagic API can be accessed at `https://api.codemagic.io`.

API uses the HTTPS protocol and all data is sent and received in JSON format.


## Authentication

All API methods require that access token be included in HTTP headers in every call.

{{< highlight bash "style=paraiso-dark">}}
x-auth-token: <API Token>
{{< /highlight >}}

The access token is available in the Codemagic UI under **Team settings > Personal Account > Integrations > Codemagic API > Show**.


## Rate Limiting

All API requests are limited to 5,000 requests per hour and per authenticated user.

## Checking your rate limit status

The response’s HTTP headers are authoritative sources for the current number of API calls available to you or your app at any given time.

| **Header** | **Description** |
| ---    | ---         |
| X-RateLimit-Limit | The maximum number of requests you're permitted to make per hour. |
| X-RateLimit-Remaining | The number of requests remaining in the current rate limit window. |
| X-RateLimit-Reset | The time at which the current rate limit window resets in UTC epoch seconds. |

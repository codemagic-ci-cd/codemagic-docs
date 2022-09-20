---
title: API Overview
weight: 1
aliases: /rest-api/overview
---

## Overview

Users can make calls to Codemagic REST API for better integration with other tools. Codemagic API can be accessed from `https://api.codemagic.io`. Any communication with it takes place over HTTPS. All data is sent and received as JSON.

## Authentication

When making calls to REST API methods, an access token must be included as an HTTP header in every call for the call to be successful.

```
x-auth-token: <API Token>
```

The access token is available via the Codemagic UI in **User settings > Integrations > Codemagic API > Show**.

## Rate Limiting

All API requests are limited to 5,000 requests per hour and per authenticated user.

## Checking your rate limit status

The response’s HTTP headers are authoritative sources for the current number of API calls available to you or your app at any given time.

| Header | Description |
| ---    | ---         |
| X-RateLimit-Limit | The maximum number of requests you're permitted to make per hour. |
| X-RateLimit-Remaining | The number of requests remaining in the current rate limit window. |
| X-RateLimit-Reset | The time at which the current rate limit window resets in UTC epoch seconds. |

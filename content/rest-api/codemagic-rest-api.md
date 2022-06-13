---
title: Codemagic REST API
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

All API requests are limited to `5,000 requests per hour and per authenticated user`.

## Checking your rate limit status

The response’s HTTP headers are authoritative sources for the current number of API calls available to you or your app at any given time.

`X-RateLimit-Limit:` The total number of requests allowed for the active window.  
`X-RateLimit-Remaining:` The number of requests remaining in the active window.  
`X-RateLimit-Reset:` UTC seconds since epoch when the window will be reset.  
`Retry-After:` Seconds to retry after or the http date when the Rate Limit will be reset. The way the value is presented depends on the configuration value set in RATELIMIT_HEADER_RETRY_AFTER_VALUE and defaults to delta-seconds.

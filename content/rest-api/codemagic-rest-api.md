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

Authenticated user will be able to make a max in total of 5000 requests in total per hour. After the quota exceeded the users will see 429 errors and "Unathorized" message if the page refresh.

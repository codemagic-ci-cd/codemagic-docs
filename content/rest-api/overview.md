---
title: Overview
weight: 1
---

All API access is over HTTPS, and accessed from `https://api.codemagic.io`. All data is sent and received as JSON.

## Authentication

When making calls to REST API methods, an access token must be included as an HTTP header in every call in order for the call to be successful.

```
x-auth-token: my-secret-token
```

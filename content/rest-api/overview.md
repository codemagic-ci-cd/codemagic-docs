---
title: Overview
weight: 1
---

Users can make calls to Codemagic REST API for better integration with other tools. Codemagic API can be accessed from `https://api.codemagic.io`. Any communication with it takes place over HTTPS. All data is sent and received as JSON.

## Authentication

When making calls to REST API methods, an access token must be included as an HTTP header in every call for the call to be successful.

```
x-auth-token: <API Token>
```

The access token is available via the Codemagic UI in **User settings > Integrations > Codemagic API > Show**.

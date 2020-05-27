---
title: Overview
description: Overview of Codemagic API.
weight: 1
---

Users can make calls to Codemagic REST API for better integration with other tools. Codemagic API can be accessed from `https://api.codemagic.io`. Any communication with it takes place over HTTPS. All data is sent and received as JSON.

You can also use <a href="https://blog.codemagic.io/dynamic-workflows-with-codemagic-api/" target="_blank" onclick="sendGtag('Link_in_docs_clicked','dynamic-workflows-with-codemagic-api')">Dynamic Workflows</a> with the Codemagic REST API. It is especially useful when you are dealing with multiple similar workflows in the same project.

## Authentication

When making calls to REST API methods, an access token must be included as an HTTP header in every call in order for the call to be successful.

```
x-auth-token: my-secret-token
```

The access token is available via UI in **User settings > Integrations > Codemagic API > Show**.
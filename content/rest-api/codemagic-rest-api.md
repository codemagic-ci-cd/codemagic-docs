---
title: API Overview
description: REST API enabling programmatic access to Codemagic service
weight: 1
aliases: /rest-api/overview
---

The Codemagic REST API provides numerous possibilities for integrating your CI/CD builds with other tools or for managing advanced workflow chains. 

{{<notebox>}}
⚠️ Note: We are transitioning to our new API. For up-to-date information, please refer to the [Codemagic REST API documentation](https://codemagic.io/api/v3/schema).
{{</notebox>}}

## Authentication

Authentication with Codemagic APIs is performed using a **Codemagic API token**. 

The Codemagic API token is a personal token that is unique to each Codemagic user. The actions permitted by the token are determined by the user’s role within the team.

You can find your API token by navigating to **Teams > Personal Account > Integrations > Codemagic API > Show**. In API calls, use it as the value for the `x-auth-token` header:

{{< highlight bash "style=paraiso-dark">}}
x-auth-token: H6WbPlu0UjiH…ASVCVJKSEB4
{{< /highlight>}}

### Regenerating an API token

If you need to rotate your Codemagic API token, click **Revoke** next to the token in your account settings. This will disable the existing API token. Clicking **Show** afterward will automatically generate a new token.

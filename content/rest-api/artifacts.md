---
title: Artifacts API
description: Authenticated and public access to build artifacts
weight: 3
---

## Step 1: Get authenticated download URL

`GET /artifacts/:secureFilename`

This URL can be obtained using the [Builds API](/rest-api/builds) or copied directly from the Codemagic UI.

A typical URL looks like this:

`https://api.codemagic.io/artifacts/ef45fb91-4c89-4395-8f7d-9368b97490de/2dd0b3d6-ae58-4894-b470-8bc2b24e259a/mayapp.ipa`

## Step 2: Create a public download URL using the URL obtained in step 1

{{<notebox>}}
**Important!** Please take extra care when sharing public download URLs so as to not expose them. Anyone with access to a public download URL will be able to download your build artifact.
{{</notebox>}}

`POST /artifacts/:secureFilename/public-url`

#### Parameters

| **Name**    | **Type**  | **Description**                          |
| ----------- | --------- | ---------------------------------------- |
| `expiresAt` | `integer` | URL expiration UNIX timestamp. |

The response contains the public artifact download URL under the `url` key.

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
  -H "x-auth-token: <API Token>" \
  -d '{"expiresAt": 1675419345}'
  -X POST https://api.codemagic.io/artifacts/ef45fb91-4c89-4395-8f7d-9368b97490de/2dd0b3d6-ae58-4894-b470-8bc2b24e259a/mayapp.ipa/public-url
{{< /highlight >}}

#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "url": "https://api.codemagic.io/artifacts/.eJwVwcmSQ0AAANB_yV2VpTGOhC5b0GJLX5Ql1WFoa9Li66fmvQvR_xm9qPqQHYO_lvuDnFxjObE6lmuYcQTxAFwZP2ph5ryPBzSnvDfSuiCsHKNm_GLDj9tWeg9phO7RzqitqMdNEoKRwAkNWxcru_HKZ3nOAMMzoY5S8e0mFSY9Kad7VKBfzQy8Z2SXHHAdIdWT71K6ORUPFP76t2XQ7vB51VnRVARBY_NeFgv3I127U_yoddsTBM7VxURG25lXmLqT48tDBekA8L55ccObEEiBa0lyh2weJbhbPqBiipskoKZ9inCh_lz-AAvOWp0.TtMPNvwHXeoH3yrFr6JvuT8NMRQ",
  "expiresAt": "2023-02-03T10:15:45+00:00"
}
{{< /highlight >}}


---
title: Artifacts API
description: Authenticated and public access to build artifacts
weight: 3
---

## Authenticated download URL

`GET /artifacts/:uuid1/:uuid2/:artifactName`

This URL can be obtained using the [Builds API](/rest-api/builds) or copied directly from the Codemagic UI.

## Retrieve public download URL

`POST /artifacts/:uuid1/:uuid2/:artifactName/public-url`

#### Parameters

| **Name**    | **Type**  | **Description**                          |
| ----------- | --------- | ---------------------------------------- |
| `expiresAt` | `integer` | Optional. URL expiration UNIX timestamp. |

The response contains the public artifact download URL under the `url` key.

This URL can be shared with trusted people who don't have a Codemagic account to download artifacts directly.

{{<notebox>}}
**Note:** URLs generated without providing an `expiresAt` UNIX timestamp expire in 24 hours.
{{</notebox>}}

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl https://api.codemagic.io/artifacts/12c0b167-b33c-4761-88c4-f3ac2478aeee/bc35a099-3ab9-41b2-b42f-f45ef59b5bac/Kefir.ipa/public-url \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: <API Token>" \
  -d '{"expiresAt": 1675419345}'
{{< /highlight >}}

#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "url": "https://api.codemagic.io/artifacts/.eJwVwcmSQ0AAANB_yV2VpTGOhC5b0GJLX5Ql1WFoa9Li66fmvQvR_xm9qPqQHYO_lvuDnFxjObE6lmuYcQTxAFwZP2ph5ryPBzSnvDfSuiCsHKNm_GLDj9tWeg9phO7RzqitqMdNEoKRwAkNWxcru_HKZ3nOAMMzoY5S8e0mFSY9Kad7VKBfzQy8Z2SXHHAdIdWT71K6ORUPFP76t2XQ7vB51VnRVARBY_NeFgv3I127U_yoddsTBM7VxURG25lXmLqT48tDBekA8L55ccObEEiBa0lyh2weJbhbPqBiipskoKZ9inCh_lz-AAvOWp0.TtMPNvwHXeoH3yrFr6JvuT8NMRQ",
  "expiresAt": "2023-02-03T10:15:45+00:00"
}
{{< /highlight >}}


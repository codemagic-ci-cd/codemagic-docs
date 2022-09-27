---
title: Caches API
weight: 4
---

## Retrieve a list of caches for an application

`GET /apps/:id/caches`

List caches information for the specified application.

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -X GET https://api.codemagic.io/apps/<app_id>/caches
{{< /highlight >}}

#### Response

{{< highlight json "style=paraiso-dark">}}
{
  "caches": [
    {
      "_id": "620f9f218ab90da6b1b22e0e",
      "appId": "60ddd0b747960e00124747cb",
      "lastUsed": "2022-02-18T13:29:05.541+0000",
      "size": 127793163,
      "workflowId": "build-ipa"
    },
    {
      "_id": "620f9e948ab90da6b1b2217d",
      "appId": "60ddd0b747960e00124747cb",
      "lastUsed": "2022-02-18T13:26:44.676+0000",
      "size": 59377366,
      "workflowId": "build-apk"
    }
  ]
}
{{< /highlight >}}

## Delete all application caches

`DELETE /apps/:id/caches`

Remove all stored caches for the specified application.

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -X DELETE https://api.codemagic.io/apps/<app_id>/caches
{{< /highlight >}}

#### Response

Response for successful cache deletion request is `202 Accepted` and contains identifiers of the caches that are to be deleted. Actual deletion is completed asynchronously. 

{{< highlight json "style=paraiso-dark">}}
{
  "caches": [
    "620f9f218ab90da6b1b22e0e",
    "620f9e948ab90da6b1b2217d"
  ],
  "message": "Cache deletion was started asynchronously, it will be completed in a moment"
}
{{< /highlight >}}

## Delete a specific cache from an application

`DELETE /apps/:id/caches/:cacheId`

Remove stored cache from the specified application for a single workflow.

#### Example

{{< highlight bash "style=paraiso-dark">}}
curl -H "Content-Type: application/json" \
     -H "x-auth-token: <API Token>" \
     -X DELETE https://api.codemagic.io/apps/<app_id>/caches/<cache_id>
{{< /highlight >}}

#### Response

Response for successful cache deletion request is `202 Accepted` and contains identifier of the cache that is to be deleted. Actual deletion is completed asynchronously. 

{{< highlight json "style=paraiso-dark">}}
{
  "caches": ["620f9f218ab90da6b1b22e0e"],
  "message": "Cache deletion was started asynchronously, it will be completed in a moment"
}
{{< /highlight >}}


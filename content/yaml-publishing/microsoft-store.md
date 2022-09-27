---
title: Microsoft Store
description: How to deploy an app to Microsoft Store using codemagic.yaml
weight: 4
---

Codemagic enables you to automatically publish your Windows desktop apps to the Microsoft Store.

{{<notebox>}}
**Note:** This guide only applies to workflows configured with the `codemagic.yaml`. If your workflow is configured with **Flutter workflow editor** please go to [Publishing to Microsoft Store using Flutter workflow editor](../publishing/publishing-to-microsoft-store).
{{</notebox>}}

For publishing, Codemagic makes use of the [Microsoft Store submission API](https://docs.microsoft.com/en-us/windows/uwp/monetize/create-and-manage-submissions-using-windows-store-services). This requires linking your Partner Center account to the Azure AD application and providing Codemagic with information that can be used to generate temporary Azure AD access tokens for managing submissions.

{{<notebox>}}
**Note:** The very first version of the app must be submitted to the Partner Center manually. You can download the **MSIX** package from the build artifacts.
{{</notebox>}}

To link your Microsoft Partner Center account with the Azure AD application and get the necessary details (`tenant_id`, `client_id`, `client_secret`), follow the instructions [here](../knowledge-base/partner-center-authentication).

It is also necessary for you to provide your `store_id`, which can be found when you open the application in the [Partner Center apps dashboard](https://partner.microsoft.com/en-us/dashboard/apps).

To safely store and use the `client_secret`, save it as an [environment variable](/variables/environment-variable-groups/#storing-sensitive-valuesfiles) in the Codemagic UI. Click **Secure** to encrypt the value.

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  partner_center:
    store_id: 1D4VKTPG38SA
    tenant_id: ab80a389-41e3-55a8-ae12-bb7430667e04
    client_id: 52da6186-abce-14f4-b2e1-00018c16f3d1
    client_secret: $CLIENT_SECRET
{{< /highlight >}}


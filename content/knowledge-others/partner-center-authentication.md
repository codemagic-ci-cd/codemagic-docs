---
title: Authenticating with Microsoft services using an Azure AD tenant
description: Setting up authentication to Microsoft services
weight: 11
aliases:
 - /knowledge-base/partner-center-authentication
---

An Azure Active Directory (Azure AD) tenant is required when setting up publishing to Microsoft Store. The tenant is used to access Azure AD to set up the necessary credentials to allow Codemagic to generate temporary access tokens for managing application submissions.

## Setting up the tenant

1. To get started, go to the [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/home), open **Account settings** from the settings menu, and then select **Tenants** under the **Organization profile**.

2. If you already have an existing tenant, you can choose to associate it with your Partner Center account, but we recommend creating a new tenant for use with Codemagic. Click **Create** and fill in all the required information to create a new tenant.

3. The newly created tenant can now be used to access [Azure AD](https://portal.azure.com/) by logging in with the email and password that you created for your tenant.

4. When logged in, navigate to **App registrations** and select **+ New registration**. Give the registration a name, and limit the access to a single tenant under **Supported account types**. For our usecase, the **Redirect URI** can be left blank. Proceed by clicking **Register**.

5. Under **Essentials** you can copy and store the values of the **Directory (tenant) ID** and **Application (client) ID** for later use. Proceed to **Certificates & secrets** on the left-side menu to create your **client secret** by clicking **+ New client secret**. Give the secret a name, and if you do not wish to recreate the secret after a certain time period, set the expiry to **custom** with a long expiry date. Copy and store the **Value** of the newly created secret.

6. As the last step, navigate back to the [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/home) while logged in as the tenant. Navigate to **Account settings > User management > Azure Ad applications** and click **Create Azure Ad application**. In the window that opens, select the application you created in the **Azure AD** portal, click **Next**, and give the application the **developer** role.

You have now successfully linked your Azure AD and Microsoft Partner Center accounts and gotten the values for the Tenant ID, Client ID and client secret parameters that have to be used when connecting the Partner Center integration or setting up publishing in `codemagic.yaml`.

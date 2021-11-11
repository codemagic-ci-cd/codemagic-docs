---
title: Authenticating with Microsoft services using an Azure AD tenant
description: How to set up a service account for authentication with Google Play and Firebase
weight: 8
aliases: /knowledge-base/partner-center-authentication
---

An Azure AD tenant is required when setting up publishing to Microsoft Store. The tenant is used to access Azure AD to set up the necessary credentials to allow Codemagic to generate temporary access tokens for managing application submissions.

## Setting up the tenant

1. To get started, go to the [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/home) and from the settings menu navigate to **Account settings** and then under **Organization profile** select **Tenants**.

2. If you have an already existing tenant, you can choose to associate it with your Partner Center account, but we recommend creating a new tenant for use with Codemagic by clicking **Create** and filling in all the required information.

3. The newly created tenant can now be used to access [Azure AD](https://azure.microsoft.com/en-us/services/active-directory/) by logging in with the email and password that you created for your tenant.

4. When logged in, navigate to **App registrations** and select **+ New registration**. Give the registration a name, and limit the access to a single tenant under **Supported account types**. For our usecase, the **Redirect URI** can be left blank. Proceed by clicking **Register**.

5. Under **Essentials** you can copy and store the values of the **Directory (tenant) ID** and **Application (client) ID** for later use. Proceed to **Certificates & secrets** on the left-side menu to create your **client secret** by clicking **+ New client secret**. Give the secret a name and if you wish to not recreate the secret after a certain time period, set the expiry to custom with a long expiry date. Copy and store the **Value** of the newly created secret.

6. As the last step, navigate back to the [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/home), logged in as the tenant and navigate to **Account settings > User management -> Azure Ad applications** and select **Create Azure add application** and select the application you created in the **Azure AD** portal. Click next, and give the application the **developer** role.

You have now successfully linked your Azure AD and Microsoft Partner Center and gotten the values for tenant Id, client Id and client secret parameters for use under team/user settings integrations or `yaml` configurations.

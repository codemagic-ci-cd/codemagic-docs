---
description: Deploy a Flutter desktop app to Microsoft Store using the Flutter workflow editor
title: Microsoft Store
weight: 3
aliases: /publishing/publishing-to-microsoft-store
---

Codemagic enables you to automatically publish your desktop app to the Microsoft Store. The application submission is automatically submitted to the review/certification process in the Partner Center.

{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **Flutter workflow editor**. If your workflow is configured with **codemagic.yaml** please go to [Publishing to Microsoft Store using codemagic.yaml](../yaml-publishing/microsoft-store).
{{</notebox>}}

## Requirements

To publish your Windows desktop app to Microsoft Store, you will have to have the application set up on Partner Center and have a prior successful submission to the Microsoft Store.

It is also essential that your application is packaged as a [MSIX package](../building/building-for-desktop/#building-msix-packages).

Codemagic uses the [Microsoft Store submission API](https://docs.microsoft.com/en-us/windows/uwp/monetize/create-and-manage-submissions-using-windows-store-services) to handle publishing to the Microsoft Store. Thus details for generating temporary Azure AD access tokens on the user's behalf are required.

To fetch these details, the application has to be set up in Azure AD and linked to the users' Partner Center account.

## Setting up publishing to Microsoft Store on Codemagic

This section gives step-by-step instructions on how to configure publishing to Microsoft Store using Flutter workflow editor.

### Step 1. Setting up Azure AD with your Partner Center account

Follow the instructions [here](../knowledge-base/partner-center-authentication) to get your tenant ID, client ID, and client secret which are required for generating temporary access tokens to manage submissions in the Partner Center.

### Step 2. Connecting the Microsoft Partner Center integration for your team/account

The Microsoft Partner Center integration can be enabled in **Teams > Personal Account > Integrations** for personal projects and in **Teams > Your Team Name > Team integrations** for projects shared in the team (if you're the team owner). This allows you to conveniently use the same access credentials for publishing across different apps and workflows.

1. In the list of available integrations, click the **Connect** button for **Partner Center**.
2. In the **Tenant name** field, provide a name for the set of credentials you are going to set up the integration with. This is for identifying the set of credentials in Codemagic.
3. Enter the **Tenant ID** related to your Azure AD account.
4. Enter the **Client ID** related to your application in Azure AD.
5. Enter the the value of your **Client secret** from your Certificates & secrets section under your application in Azure AD.
6. Click **Save** to finish the setup.

You can add additional sets of credentials by clicking **Add another tenant** right after adding the first tenant and repeating the steps described above. You can delete existing tenants or add new ones when you click **Manage tenants** next to the Partner Center integration in user or team settings.

### Step 3. Enabling Microsoft Store publishing for workflow

Once you configure publishing to Microsoft Store, Codemagic will automatically distribute the app to Microsoft Store every time you build the workflow.

{{<notebox>}}
**Note:** The very first version of the app must be submitted in the Partner Center manually. You can download the **MSIX** package from the build artifacts.
{{</notebox>}}

1. Navigate to the Distribution section in app settings.
2. Click **Microsoft Partner Center** to expand the option.
3. Choose the **tenant** you have configured in your team settings.
4. Provide the **Store ID** of the application that has been set up in the Partner Center.
5. Provide the necessary package arguments for publishing (**Package name**, **Publisher ID**, **Publisher name**)
   These values can be found in [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/home) when navigating to **Apps and games > [Your application] > Product Identity**.
6. Set a version for your package by configuring the **Package version** field, to see how to increment this number automatically check the **Version your package** section below.
7. If you want to publish the .msix even when one or more tests fail, mark the **Publish even if tests fail** checkbox.
8. Select **Enable publishing to Microsoft Store** at the top of the section to enable publishing.

#### Version your package

Check out how to version your package in the [Microsoft documentation](https://docs.microsoft.com/en-us/windows/uwp/publish/package-version-numbering). Note that per Microsoft Store requirements applications are not allowed to have a version with a revision number (last digit of the version) other than zero.

To version your `MSIX package` for Microsoft Store Submission with Codemagic, you can either set the value as a string, such as `1.0.0.0`, or use Codemagic's read-only environment variables (`$PROJECT_BUILD_NUMBER`, `$BUILD_NUMBER`) to automatically increment versions on every release.

In order to do so, you can simply set the `Package version` field as `1.0.$BUILD_NUMBER.0`, for example, which will use the Codemagic build number for the given workflow to set the package version. Note that this is one of many possible approaches to versioning your application and is used only as an example.

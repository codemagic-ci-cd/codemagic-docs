---
description: 
title: How to authenticate with Firebase using Google service account
aliases:
---

Service accounts are useful for setting up App Distribution in a CI environment. Authenticating with a [service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts) allows you to use client libraries (e.g., the Firebase CLI or fastlane) to distribute your builds. When you use a service account to authenticate, Firebase uses [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication/production) to locate your app's credentials, which you can provide by setting the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

1. On the Firebase project page, navigate to **Project settings** by clicking on the cog button. Select the **Service accounts** tab. Click on the **X service accounts** button as shown on the screenshot. <br><br>
![Firebase service accounts](../uploads/firebase_service_accounts_button.png)

2. This will lead you to the Google Cloud Platform. In step 1, fill in the **Service account details** and click **Create**. The name of the service account will allow you to identify it among other service accounts you may have created.

3. In step 2, click the **Select a role** dropdown menu and choose the role. Note that **Editor** role is required for Firebase Test Lab and **Firebase App Distribution Admin** for Firebase App Distribution.

4. In step 3, you can leave the fields blank and click **Done**.

5. In the list of created service accounts, identify the account you have just created and click on the menu in the **Actions** column, then click **Manage keys**.<br><br>
![Google cloud key](../uploads/google_cloud_three.png)

6. In the Keys section, click **Add Key > Create new key**. Make sure that the key type is set to `JSON` and click **Create**. Save the key file in a secure location to have it available.<br><br>
![Google cloud json](../uploads/google_cloud_four.png)

7. Configure variables in codemagic.yaml:
    {{<notebox>}}**Note:** If you are using the same service account for both the Firebase and the Google Play publishing, we recommend using `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` as the name for the variable holding the service account JSON content as this is the default name used throught the docs and sample projects.
    {{</notebox>}}

    1. Open your Codemagic app settings, and go to the **Environment variables** tab.
    2. Enter the desired **_Variable name_**, e.g. `FIREBASE_SERVICE_ACCOUNT`.
    3. Copy and paste the content of the service account JSON file as **_Variable value_**.
    4. Enter the variable group name, e.g. **_firebase_credentials_**. Click the button to create the group.
    5. Make sure the **Secure** option is selected.
    6. Click the **Add** button to add the variable.
    7. Repeat the steps to add a variable named `GOOGLE_APPLICATION_CREDENTIALS` and set its value to a path where the credentials file will be placed during build. Suggested value is "$CM_BUILD_DIR/firebase_credentials.json"

8. Add variables in your `codemagic.yaml`
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - firebase_credentials
{{</ highlight >}}
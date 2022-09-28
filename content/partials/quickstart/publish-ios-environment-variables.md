---
title: Configuring environment variables for iOS build versioning and publishing
---

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter `APP_STORE_CONNECT_PRIVATE_KEY` as the **_Variable name_**.
3. Run the following command on the **App Store Connect API key** file that you downloaded earlier (in our example saved as `codemagic_api_key.p8`) to copy its content to clipboard:
{{< highlight bash "style=rrt">}}
cat codemagic_api_key.p8 | pbcopy
{{< /highlight >}}
4. Paste into the **_Variable value_** field.
5. Enter a variable group name, e.g. **_appstore_credentials_**. Click the button to create the group.
6. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
7. Click the **Add** button to add the variable.
8. Create variable `APP_STORE_CONNECT_KEY_IDENTIFIER`. The value is the **Key ID** field from **App Store Connect > Users and Access > Keys**.
9. Create variable `APP_STORE_CONNECT_ISSUER_ID`. The value is the **Issuer ID** field from **App Store Connect > Users and Access > Keys**.

{{<notebox>}}
**Tip**: Store all the of these variables in the same group so they can be imported to codemagic.yaml workflow at once. 
{{</notebox>}}

Environment variables have to be added to the workflow either individually or as a group. Modify your `codemagic.yaml` file by adding the following:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    environment:
        groups:
            - appstore_credentials
{{< /highlight >}}
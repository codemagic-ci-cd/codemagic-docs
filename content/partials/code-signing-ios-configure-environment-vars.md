---
---

#### Configuring environment variables

Provisioning profiles and code signing certificates are obtained from Apple Developer portal with the command [`app-store-connect fetch-signing-files`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#fetch-signing-files). App Store Connect API key information can be passed to it via environment variables [`APP_STORE_CONNECT_KEY_IDENTIFIER`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--key-idkey_identifier), [`APP_STORE_CONNECT_ISSUER_ID`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--issuer-idissuer_id), [`APP_STORE_CONNECT_PRIVATE_KEY`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--private-keyprivate_key).

{{< tabpane >}}

{{< tab header="Use App Store Connect integration" >}}
{{<markdown>}}

{{< include "/partials/integrations-setup-app-store-connect.md" >}}

Integration will take care of the App Store Connect API authentication part, but additionally the certificate private key has to be exported too. For this additional environment variable [`CERTIFICATE_PRIVATE_KEY`](https://github.com/codemagic-ci-cd/cli-tools/blob/master/docs/app-store-connect/fetch-signing-files.md#--certificate-keyprivate_key) has to be defined.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter `CERTIFICATE_PRIVATE_KEY` as the **_Variable name_**.
3. Open the file `ios_distribution_private_key` with a text editor and copy the **entire contents** of the file, including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` tags. Alternatively, you can run the following command on the file:

{{< highlight Shell "style=rrt">}}
cat ios_distribution_private_key | pbcopy
{{< /highlight >}}

4. Paste into the **_Variable value_** field.
5. Enter a variable group name, e.g. **_code-signing_**. Click the button to create the group.
6. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
7. Click the **Add** button to add the variable.

In your workflow you can now simply use the following to ensure that all variables are readily available during build:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    environment:
        groups:
            - code-signing
    integrations:
        app_store_connect: <App Store Connect API key name>
{{< /highlight >}}

This will expose necessary environment variables during the build.

{{</markdown>}}
{{< /tab >}}

{{< tab header="Define environment variables by yourself" >}}
{{<markdown>}}

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter `CERTIFICATE_PRIVATE_KEY` as the **_Variable name_**.
3. Open the file `ios_distribution_private_key` with a text editor and copy the **entire contents** of the file, including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` tags. Alternatively, you can run the following command on the file:

{{< highlight Shell "style=rrt">}}
cat ios_distribution_private_key | pbcopy
{{< /highlight >}}

4. Paste into the **_Variable value_** field.
5. Enter a variable group name, e.g. **_appstore_credentials_**. Click the button to create the group.
6. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
7. Click the **Add** button to add the variable.

---

8. Run the following command on the **App Store Connect API key** file that you downloaded earlier (in our example saved as `codemagic_api_key.p8`) to copy its content to clipboard:
{{< highlight Shell "style=rrt">}}
cat codemagic_api_key.p8 | pbcopy
{{< /highlight >}}

9. Create a new Environment variable `APP_STORE_CONNECT_PRIVATE_KEY` and paste the value from clipboard.

---

10. Create variable `APP_STORE_CONNECT_KEY_IDENTIFIER`. The value is the **Key ID** field from **App Store Connect > Users and Access > Keys**.
11. Create variable `APP_STORE_CONNECT_ISSUER_ID`. The value is the **Issuer ID** field from **App Store Connect > Users and Access > Keys**.

{{<notebox>}}
**Tip**: Store all the of these variables in the same group so they can be imported to codemagic.yaml workflow at once. 
{{</notebox>}}

Environment variables have to be added to the workflow either individually or as a group. Modify your `codemagic.yaml` file by adding the following:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    # ....
    environment:
        groups:
            - appstore_credentials
{{< /highlight >}}

{{<markdown>}}
{{< /tab >}}

{{< /tabpane >}}

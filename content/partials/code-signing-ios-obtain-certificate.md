---
---

#### Obtaining the Certificate private key

To sign iOS apps, you can use the private key of an iOS Distribution certificate that has already been created in your Apple Developer Program account.

Alternatively, you can create a new private key on your Mac and the Codemagic CLI will create a new iOS Distribution certificate in your Apple Developer Program account for you.

{{< tabpane >}}

{{< tab header="Create a new key" >}}
{{<markdown>}}
You can create a new 2048 bit RSA key by running the command below in your terminal:

{{< highlight Shell "style=rrt">}}
ssh-keygen -t rsa -b 2048 -m PEM -f ~/Desktop/ios_distribution_private_key -q -N ""
{{< /highlight >}}


This new private key will be used to create a new iOS Distribution certificate in your Apple Developer Program account if there isn't one that already matches this private key.

{{</markdown>}}
{{< /tab >}}

{{% tab header="Use an existing key"%}}

{{<markdown>}}

1. On the Mac which created the iOS distribution certificate, open the **Keychain Access**, located in the **Applications and Utilities** folder.
2. Select the certificate entry which should be listed as `iPhone Distribution: company_name (team_id)`.
3. Right-click on it to select "Export."
4. In the export prompt window that appears, make sure the file format is set to **Personal Information Exchange (.p12)**"**.
5. Give the file a name such as "IOS_DISTRIBUTION", choose a location and click **Save**.
6. On the next prompt, leave the password empty and click **OK**.
7. Use the following `openssl` command to export the private key:

{{< highlight Shell "style=rrt">}}
openssl pkcs12 -in IOS_DISTRIBUTION.p12 -nodes -nocerts | openssl rsa -out ios_distribution_private_key
{{< /highlight >}}

8. When prompted for the import password, just press enter. The private key will be written to a file called **ios_distribution_private_key** in the directory where you ran the command.
{{</markdown>}}

{{% /tab %}}

{{< /tabpane >}}

The Apple Developer Portal integration can be enabled in **Teams > Personal Account > Integrations** for personal projects and in **Teams > Your Team Name > Team integrations** for projects shared in the team (if you're a team admin). This allows you to conveniently use the same access credentials for automatic code signing and publishing across different apps and workflows.

1. In the list of available integrations, click the **Connect** button for **Developer Portal**.
2. In the **App Store Connect API key name**, provide a name for the key you are going to set up the integration with. This is for identifying the key in Codemagic.
3. Enter the **Issuer ID** related to your Apple Developer account. You can find it above the table of active keys on the Integrations tab of the [Users and Access](https://appstoreconnect.apple.com/access/api) page.
4. Enter the **Key ID** of the key to be used for code signing.
5. In the **API key** field, upload the private API key downloaded from App Store Connect.
6. Click **Save** to finish the setup.

If you work with multiple Apple Developer teams, you can add additional keys by clicking **Add another key** right after adding the first key and repeating the steps described above. You can delete existing keys or add new ones when you click **Manage keys** next to the Developer Portal integration in user or team settings.

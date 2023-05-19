---
title: Cloudflare Pages
description: How to deploy a website to Cloudflare Pages using codemagic.yaml
weight: 14
---

[**Cloudflare Pages**](https://pages.cloudflare.com/) is a JAMstack platform for frontend developers to collaborate and deploy websites.


## Configure Cloudflare access

Before getting started you will need to create a **Cloudflare API token** and get your **Account ID**.

### Create a Cloudflare API token
To create a token:

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Select the user icon on the top right of your dashboard > My Profile.
3. Select [API Tokens](https://dash.cloudflare.com/profile/api-tokens) > Create Token.
4. Select **Use template** next to **Edit Cloudflare Workers**. All templates are prefilled with a token name and permissions. You also need to modify the account and zone resources you want assigned to the token.
5. After editing your token, select **Continue to summary** and review the permissions before selecting create token.
6. Save the generated token for later to store it in Codemagic.

### Get the Account ID
From [Cloudflare dashboard](https://dash.cloudflare.com/) select your website and copy the `Account ID` under the **API** section at the right section from the `Overview` page.

{{<notebox>}}
If there is only one account associated with the API token, then the account ID is inferred automatically.
{{</notebox>}}

See the official [docs](https://developers.cloudflare.com/workers/wrangler/ci-cd/).

### Configure environment variables

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `CLOUDFLARE_API_TOKEN`.
3. Enter the desired variable value as **_Variable value_**.
4. Enter the variable group name, e.g. **_cloudflare_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to add the `CLOUDFLARE_ACCOUNT_ID`.

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - cloudflare_credentials # <-- (Includes CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
{{< /highlight >}}


## Publish to Cloudflare Pages

After you have created your page from the [Cloudflare dashboard](https://dash.cloudflare.com/) and given it a name, you can configure automatic publishing in your `codemagic.yaml`.

First, we need to install `wrangler`, which is a command-line tool for building with Cloudflare developer products, and then publish our website.


Add the following script to your `publishing` section:
{{< highlight yaml "style=paraiso-dark">}}
publishing:
    scripts:
    - name: Install wrangler
        script: npm install -g wrangler    
    - name: Deploy to Cloudflare Pages
        script: | 
        wrangler pages publish <path/to/your/build/folder/> --project-name <your-project-name> --branch <branch-name>
{{< /highlight >}}

{{<notebox>}}
You can change the default commit message which is your current git commit message by using `--commit-message "Your commit message"`
{{</notebox>}}

If the deployment is complete then you should be able to browse your website using the URL at the last line of the log.

## Flutter web sample workflow
Here's a workflow for building a Flutter web application and then publish it to Cloudflare Pages.
{{< highlight yaml "style=paraiso-dark">}}
  web-workflow:
    name: Web Workflow
    instance_type: linux_x2
    environment:
      groups:
        - cloudflare # <-- (Includes CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
      flutter: stable
    scripts:
      - name: Get Flutter packages
        script: flutter packages pub get
      - flutter config --enable-web
      - name: Build Web
        script: | 
          flutter build web --release
      - name: Gather the web files
        script: | 
          cd build/web
          7z a -r ../web.zip ./*
    artifacts:
      - build/web.zip
    publishing:
      scripts:
        - name: Install wrangler
          script: npm install -g wrangler
        - name: Deploy to Cloudflare Pages
          script: | 
            wrangler pages publish build/web/ --project-name my-flutter-pages --branch production
      slack:
        channel: "#builds"
        notify_on_build_start: true
{{< /highlight >}}
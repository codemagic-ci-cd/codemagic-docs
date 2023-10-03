---
description: How to publish a web app to a custom subdomain using the Flutter workflow editor
title: Codemagic Static Pages
weight: 6
aliases: /publishing/publishing-to-codemagic-static-pages
---

You can publish your web app to a custom subdomain of `codemagic.app` for easy access.

{{<notebox>}}
⚠️ **Note**: This feature is intended for **testing purposes only**. Production apps should be deployed to prodcution-grade web hosting services such as Firebase Hosting or Cloudflare pages.
{{</notebox>}}

1. Go to **App settings > Distribution > Codemagic Static Pages** to configure publishing to Codemagic Static Pages.
2. Choose a subdomain name, make sure to enter only one level, such as **test.codemagic.app**, and enter it in the **Web page subdomain** field. By default, we suggest your app name as the subdomain name.
3. Check **Publish artifacts even if tests fail** to publish the build even when one or more tests fail. Leaving this option unchecked will publish only successful builds that pass the tests, if any.
4. Select **Enable Codemagic Static Pages publishing** at the top of the section to enable publishing.

Now each time you run a build of your web app on Codemagic, you'll see the web app artifact being published to the web page in Codemagic logs and can immediately access the app at the specified URL.

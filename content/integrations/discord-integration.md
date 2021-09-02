---
title: Discord integration
description: How to integrate your workflows with Discord using codemagic.yaml
weight: 3
---

**Discord** is a free voice, video and text chat application originally built for gamers, but has since become a general use platform for many different communities. If your development team uses Discord it can be used as part of your CI/CD to notify your development team when a build is complete and include information about the build and links to download build artifacts. 

## Create a Discord account

You will need access to a Discord account and can [sign up](https://discord.com/) for free.

## Create a Server and channel in Discord

A Server is a dedicated space for your community. A server is required for you to create text channels to talk with people you invite to the server. 

1. Log into Discord [here](https://discord.com/login)
2. Click on the '+' button on the left hand menu to create a Server and give it a name and click the 'Create' button. 
3. Click on the '+' button next to Text Channels. Make sure the channel type is set to 'Text channel' and give your channel a name e.g. codemagic-builds and then click 'Create channel'.
4. Once the channel has been created click on the channel name to highlight it and then click on the channel's settings icon.
5. Click on 'Integrations' and then click 'Create webhook' and change the name if you want.
6. Click the 'Copy webhook URL'
7. Add the webhook URL as an environment variable to your **codemagic.yaml** as desribed below.


## Configuring access to Discord in Codemagic

One **environment variable**  needs to be added to your workflow for the Discord integration: `WEBHOOK_URL` which is the webhook URL you created in the steps above.

Environment variables can be added in the Codemagic web app using the 'Environment variables' tab. You can then and import your variable groups into your codemagic.yaml. For example, if you named your variable group 'discord' you would import is as follows:

```
workflows:
  workflow-name:
    environment:
      groups:
        - discord
```

For further information about using variable groups please click [here](https://docs.codemagic.io/variables/environment-variable-groups/).


## Android sample project

An Android sample project that shows how to configure Discord integration is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/discord_integration_demo_project)

Please refer to the **readme.md** and **codemagic.yaml** in the sample project for configuration instructions for your Android project.








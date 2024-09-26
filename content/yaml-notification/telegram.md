---
description: Automate sending a notification message to Telegram with APK, AAB, or IPA download links using its HTTP API via cURL
title: Sending Build Notifications to Telegram
weight: 2
aliases:
  - /yaml-publishing/telegram
---

This guide shows you how to automate the process of sending APK, AAB, or IPA download links to Telegram using Codemagic's CI/CD pipeline.

### Prerequisites

To set up Telegram notifications, you'll need:

- A **Telegram Bot Token**, obtained by creating a bot.
- The **Chat ID** where the bot will send the messages.

Check [Telegram documentation](https://core.telegram.org/bots#how-do-i-create-a-bot) for instructions on creating a bot.


### Add Environment Variables in Codemagic

Add the following environment variables to your project settings in Codemagic:

- **TELEGRAM_BOT_TOKEN**: Your Telegram bot token
- **TELEGRAM_CHAT_ID**: The ID of the chat where the bot will send notifications
- **CODEMAGIC_API_TOKEN**: Your Codemagic API tokenYour Codemagic API token (found under Teams > Personal Account > Integrations > Codemagic API)

### Setup Codemagic Configuration

To publish the binary to Telegram, you first need to create a public download URL for the .aab file and set an expiration timestamp. Then, this URL will be sent via the Telegram bot.

Add the following configuration to your codemagic.yaml file:

{{< highlight yaml "style=paraiso-dark">}}
android-workflow:
  name: Android Workflow
  instance_type: mac_mini_m2
  environment:
    vars:
      TELEGRAM_BOT_TOKEN: "telegram-bot-token"
      TELEGRAM_CHAT_ID: "telegram-chat-id"
      CODEMAGIC_API_TOKEN: "codemagic-api-token"
  scripts:
      # Your existing build scripts here
  artifacts:
    - build/**/outputs/**/*.aab
  publishing:
    scripts:
      - name: Publish to Telegram
        script: | 
          # Fetch the artifact URL for the .aab file
          ARTIFACT_URL=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith(".aab")) | .url')

          # Set the expiration timestamp for the public URL (3 days from now)
          expiration_timestamp=$(date -v+3d +%s)

          # Create a public download URL for the artifact
          response=$(curl -s -H "Content-Type: application/json" \
                              -H "x-auth-token: $CODEMAGIC_API_TOKEN" \
                              -d "{\"expiresAt\": $expiration_timestamp}" \
                              -X POST $ARTIFACT_URL/public-url)

          public_url=$(echo $response | jq -r '.url')

          # Send the public URL to Telegram
          curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
                -d chat_id="$TELEGRAM_CHAT_ID" \
                -d text="Here is the public URL for the .aab file: $public_url"
{{< /highlight >}}
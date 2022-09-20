---
title: Discord integration
description: How to integrate your workflows with Discord using codemagic.yaml
weight: 3
---

**Discord** is a free voice, video and text chat application originally built for gamers, but has since become a general use platform for many different communities. If your development team uses Discord, it can be used as part of your CI/CD to notify your development team when a build is complete and include information about the build and links to download build artifacts. 

A sample project that shows how to configure Discord integration is available [in our sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/discord_integration_demo_project).

## Create a Discord account

You will need access to a Discord account and can [sign up](https://discord.com/) for free.

## Create a Server and channel in Discord

A Server is a dedicated space for your community. A server is required for you to create text channels to talk with people you invite to the server. 

1. Log into Discord [here](https://discord.com/login)
2. Click on the **+** button on the left hand menu to create a Server and give it a name and click the **Create** button. 
3. Click on the **+** button next to Text Channels. Make sure the channel type is set to **Text channel** and give your channel a name e.g. `codemagic-builds` and then click **Create channel**.
4. Once the channel has been created, click on the channel name to highlight it and then click on the channel's settings icon.
5. Click on **Integrations** and then click **Create webhook** and change the name if you want.
6. Click the **Copy webhook URL**


## Configuring access to Discord in Codemagic

One **environment variable**  needs to be added to your workflow for the Discord integration: `WEBHOOK_URL` which is the webhook URL you created in the steps above.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `WEBHOOK_URL`.
3. Enter the required value as **_Variable value_**.
4. Enter the variable group name, e.g. **_discord_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - discord_credentials
{{< /highlight >}}


## Post a message to Discord

A cURL request can be used to send a message to your Discord channel with information anout your Codemagic builds.

The following is an example of how to perform a cURL request that uses your Discord webhook to send a message with a commit number, commit message, branch name, Git commit author and a link to the build artifact. It also adds a file attachment that contains the Git changelog.

{{< highlight bash "style=paraiso-dark">}}

curl -H "Content-Type: multipart/form-data" \
  -F 'payload_json={"username" : "codemagic-builds", "content": "**Commit:** `'"$COMMIT"'`\n\n**Commit message:** '"$COMMIT_MESSAGE"'\n\n**Branch:** '"$FCI_BRANCH"'\n\n**Author:** '"$AUTHOR"'\n\n**Artifacts: **\n\n'"$APP_LINK"'\n\n"}' \
  -F "file1=@release_notes.txt" \
  $WEBHOOK_URL
{{< /highlight >}}

The below example shows how you can generate a **Changelog** and publish a notification to Discord using scripts in the `codemagic.yaml` file:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    
    # ... first perform the steps required to build your project

    - name: Create a changelog
      script: | 
        if [[ -z ${CM_PREVIOUS_COMMIT} ]]
          then
            echo "No finished builds found to generate changelog" | tee release_notes.txt
          else
            echo "$(git-changelog generate --previous-commit $CM_PREVIOUS_COMMIT)" | tee release_notes.txt
        fi
  artifacts:
    # ...
  publishing:
    scripts:
      - name: Discord notification
        script: | 
          set -ex
          APP_LINK=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name=="app.apk") | .url')
        
          # Get first 7 digits of commit number
          COMMIT=$(echo "${CM_COMMIT}" | sed 's/^\(........\).*/\1/;q')

          # Get commit message
          COMMIT_MESSAGE=$(git log --format=%B -n 1 $CM_COMMIT)
          
          # Get commit author
          AUTHOR=$(git show -s --format='%ae' $CM_COMMIT)
          
          # Publish the notification
          curl -H "Content-Type: multipart/form-data" \
          -F 'payload_json={"username" : "codemagic-bot", "content": "**Commit:** `'"$COMMIT"'`\n\n**Commit message:** '"$COMMIT_MESSAGE"'\n\n**Branch:** '"$CM_BRANCH"'\n\n**Author:** '"$AUTHOR"'\n\n**Artifacts: **\n\n'"$APP_LINK"'\n\n"}' \
          -F "file1=@release_notes.txt" \
          $WEBHOOK_URL

{{< /highlight >}}

The result will look similar to this:
![A formatted Jira issue comment](https://github.com/codemagic-ci-cd/codemagic-sample-projects/raw/main/integrations/discord_integration_demo_project/discord-message.png)

## Environment variables in JSON

If you want to use an environment variable within your message use single quotes and double quotes within the JSON value as follows (note that the addtional backticks will format it as code in Discord):

{{< highlight json "style=paraiso-dark">}}

  "content": "**Commit:** `'"$COMMIT"'`"
{{< /highlight >}}
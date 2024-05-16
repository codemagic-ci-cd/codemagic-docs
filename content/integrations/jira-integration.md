---
title: Jira integration
description: How to integrate your workflows with Jira using codemagic.yaml
weight: 1
---

**Jira** is an issue tracking and project management product developed by Atlassian. Many software development teams use it to maintain the visibility of their projects. 

It offers a REST API that can be used in conjunction with your **Codemagic** workflows to add comments, upload attachments, or transition the status of an issue, story, or epic.

{{<notebox>}}
**Note:** You can find a complete example project showcasing Jira integration in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/jira_integration_demo_project).
{{</notebox>}}

## Configure environment variables

To get started, you will need a Jira account (you can [sign up](https://www.atlassian.com/software/jira) for free) and a [Jira API Token](https://id.atlassian.com/manage-profile/security/api-tokens).


There are four **environment variables** that need to be configured for the Jira integration: `JIRA_AUTH`, `JIRA_BASE_URL`, `JIRA_ISSUE` and `JIRA_TRANSITION_ID`. To add a variable, follow these steps:

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `JIRA_AUTH`.
3. Enter the required value as **_Variable value_**.
4. Enter the variable group name, e.g. **_jira_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the process to add all of the required variables.


#### JIRA_AUTH environment variable

The `JIRA_AUTH` environment variable is a `base64` encoded string which consists of the email address you log into Jira with and the Jira API token you created: 

`email@example.com:<api_token>`

You can encode these credentials in the **macOS Terminal** using:

{{< highlight bash "style=paraiso-dark">}}
echo -n 'email@example.com:<api_token>' | openssl base64
{{< /highlight >}}

Alternatively, use an online tool to base64 encode this string. 

This value is used in the Authorization header used in cURL requests to the Jira API.

#### JIRA_BASE_URL environment variable

This is the subdomain you chose when you set up your Jira account e.g. "YOUR_SUBDOMAIN.atlassian.net". Put the subdomain including "atlassian.net" in the `JIRA_BASE_URL` environment variable. 


#### JIRA_ISSUE environment variable

Issues, epics, and stories have a unique id, usually in the format **'projectKey-id'**, and is visible on your issues either in the bottom right or top left when looking at an issue. Put this value in the `JIRA_ISSUE` environment variable. 

#### JIRA_TRANSITION_ID environment variable

If you want to transition your issue to another status, you will need to know what transition ids are available. You can obtain the available transition ids using a cURL request as documented in the [Jira API documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-get). Once you know the transition id then put this value in the `JIRA_TRANSITION_ID` environment variable.



## Adding formatted comments to a Jira issue

Create a **.templates** folder in the root of your project. In this folder, create a template file called **jira.json**, which adds formatted comments to a Jira issue. An example **jira.json** file can be found in our [Sample project](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/integrations/jira_integration_demo_project/.templates/jira.json).

The Atlassian Document Format (ADF) is used to format the comment layout and style. Click [here](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/) for more information about ADF and how to modify this template. 

![A formatted Jira issue comment](../uploads/jira_issue_comment.png)

**Note** that it contains strings beginning with `$`, which the scripts use to replace values in the JSON using `sed` before it is added as JSON payload to the `cURL` requests.



## Publishing to Jira

Publishing to Jira is performed by a script in the `publishing:` section in the `codemagic.yaml`. The example script shown below contains several actions which set environment variables, update the comment template, and then use cURL requests to add a comment and upload files to a specific Jira issue.

### Using jq to parse $CM_ARTIFACT_LINKS

First, it uses **jq** (a command-line tool for parsing JSON) to parse the contents of the Codemagic built-in environment variable `$CM_ARTIFACT_LINKS` to find information such as the artifact URL, filename, bundle id, and version name and store the values in environment variables.

See this link about the JSON data that [$CM_ARTIFACT_LINKS](../yaml-basic-configuration/environment-variables#artifact-links) contains.

### Setting additional environment variables

Additional environment variables are then set, such as the build number, build date, and commit number. These environment variables are used to replace values in the **jira.json** comment template using **sed**, a stream editor for parsing and transforming text.

### Making cURL requests to the Jira API 

1. The script performs a request to add a comment to the Jira issue specified using the jira.json as the payload.
2. Another request is used to transition the issue to a different status.
3. The script checks to see if XML test results have been generated. See [here](../testing-yaml/testing/) for information about using `test_report` to generate a test report .xml output. If **xml test results** are available, then they will be uploaded to the Jira issue.
4. If **release notes** have been created, then these are uploaded to the Jira issue.

{{< highlight yaml "style=paraiso-dark">}}
publishing:
  scripts:
    - name: Post to JIRA
      script: | 
        #!/bin/sh
        set -e
        set -x
        
        ARTIFACT_TYPE=".ipa" 
              
        # Get URL, Name, Bundle Id and Version name from $CM_ARTIFACT_LINKS
        ARTIFACT_URL=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .url')
        ARTIFACT_NAME=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .name')
        TYPE=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .type')
        BUNDLE=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .bundleId')
        VERSION_NAME=$(echo $CM_ARTIFACT_LINKS | jq -r '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .versionName')
              
        BUILD_VERSION=$(( ${BUILD_NUMBER} + 1 ))
              
        # Set the build date
        BUILD_DATE=$(date +"%Y-%m-%d")
              
        # Escape forward slash characters in URL to prevent errors when using sed
        # to replace the template value
        TEST_URL=$(echo "${IPA_URL}" | sed 's#/#\\/#g')
              
        # Get first 7 digits of commit number
        COMMIT=$(echo "${CM_COMMIT}" | sed 's/^\(........\).*/\1/;q')
              
        # Get the name of the test .xml file so we can attach it to a Jira issue
        if [ $ARTIFACT_TYPE == ".ipa" ]
          then
            XML_TEST_RESULTS=$(find -f build/ios/test/*.xml)
          else
            XML_TEST_RESULTS=$(find -f app/build/test-results/**/*.xml)
        fi  
        
        # Get the Git commit message for this build
        GIT_COMMIT_MESSAGE=$(git log --format=%B -n 1 $CM_COMMIT)
              
        # Populate the values in the .json template which will be used as the 
        # JSON payload that will be set as a comment in Jira.               
        sed -i.bak "s/\$BUILD_DATE/$BUILD_DATE/" .templates/jira.json
        sed -i.bak "s/\$ARTIFACT_NAME/$ARTIFACT_NAME/" .templates/jira.json
        sed -i.bak "s/\$ARTIFACT_URL/$TEST_URL/" .templates/jira.json
        sed -i.bak "s/\$CM_COMMIT/$COMMIT/" .templates/jira.json
        sed -i.bak "s/\$GIT_COMMIT_MESSAGE/$GIT_COMMIT_MESSAGE/" .templates/jira.json
        sed -i.bak "s/\$VERSION_NAME/$VERSION_NAME/" .templates/jira.json
        sed -i.bak "s/\$BUILD_VERSION/$BUILD_VERSION/" .templates/jira.json
        sed -i.bak "s/\$BUNDLE/$BUNDLE/" .templates/jira.json
        sed -i.bak "s/\$TYPE/$TYPE/" .templates/jira.json
        
        # Add a comment to Jira 
        # See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-comment-list-post for details
        curl -X POST https://$JIRA_BASE_URL/rest/api/3/issue/$JIRA_ISSUE/comment -H "Authorization: Basic $JIRA_AUTH" -H "X-Atlassian-Token: nocheck" -H "Content-Type: application/json" --data @.templates/jira.json | jq "."
              
        # Transition Jira issue to another status 
        # See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post for details
        curl -X POST https://$JIRA_BASE_URL/rest/api/3/issue/$JIRA_ISSUE/transitions -H "Authorization: Basic $JIRA_AUTH" -H "X-Atlassian-Token: nocheck" -H "Content-Type: application/json" --data '{"transition":{"id":"'"$JIRA_TRANSITION_ID"'"}}' | jq "."
              
        # Attach XML test results to the Jira issue 
        # See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post for details
              
        if [[ -z ${XML_TEST_RESULTS} ]]
          then
            echo "No test results available to upload to JIRA"
          else  
            curl -X POST https://$JIRA_BASE_URL/rest/api/3/issue/$JIRA_ISSUE/attachments -H "Authorization: Basic $JIRA_AUTH" -H "X-Atlassian-Token: nocheck" -F "file=@$XML_TEST_RESULTS"  | jq "."
        fi
        
        # Attach Release Notes to the Jira issue 
        # See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-attachments/#api-rest-api-3-issue-issueidorkey-attachments-post for details
              
        if [[ -e release_notes.txt ]]
          then 
            curl -X POST https://$JIRA_BASE_URL/rest/api/3/issue/$JIRA_ISSUE/attachments -H "Authorization: Basic $JIRA_AUTH" -H "X-Atlassian-Token: nocheck" -F "file=@release_notes.txt"  | jq "."
          else
            echo "No release_notes.txt available to upload to JIRA"
        fi  

{{< /highlight >}}

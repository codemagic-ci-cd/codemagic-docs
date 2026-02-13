---
title: Jenkins integration
description: How to integrate Codemagic into your Jenkins workflows using the Codemagic REST API
weight: 11
---

**Jenkins** is a popular open source automation server used to set up CI/CD pipelines for mobile and web apps. If your development team uses Jenkins, you can trigger Codemagic builds from Jenkins jobs using the Codemagic REST API. 

## Create a Codemagic API key

You need a Codemagic API key to authenticate REST API requests from Jenkins. Every Codemagic account has an API key available.
1. Log into Codemagic.
2. Go to Teams → Personal account → Integrations → Codemagic API
3. Click **Show** and copy the Codemagic API key.
4. Note your Application ID from the app URL (e.g., https://codemagic.io/app/xxxxxxxxxxxxxxxxxxxxxxxx).

## Configuring access to Codemagic in Jenkins

One credential needs to be added to Jenkins for the Codemagic integration: `codemagic-api-key`.

1. Go to Manage Jenkins → Credentials → System → Global credentials.
2. Click Add Credentials.
3. Set Kind to **Secret text**
4. Set Scope to **Global**
4. Set Secret to `your-codemagic-api-key`
5. Set ID to **codemagic-api-key**.
6. Click OK.

## Trigger a Codemagic build
A Pipeline job can be used to send a request to Codemagic with information about which app, workflow, and branch to build.

The following is an example of how to perform a request that triggers a Codemagic build:

{{< highlight groovy "style=paraiso-dark" >}}
pipeline {
    agent any

    environment {
        CODEMAGIC_APP_ID   = 'YOUR_APP_ID' // change to your AppID
        CODEMAGIC_WORKFLOW = 'YOUR_WORKFLOW_NAME'  // change to your Workflow Name
        CODEMAGIC_BRANCH   = 'YOUR_BRANCH_NAME' // change to your branch name
    }

    stages {
        stage('Trigger Codemagic build') {
            steps {
                withCredentials([string(credentialsId: 'codemagic-api-key', variable: 'CODEMAGIC_API_KEY')]) {
                    script {
                        def response = sh(
                            script: """
                                curl -s -o /dev/null -w "%{http_code}" \
                                    -X POST \
                                    -H "Content-Type: application/json" \
                                    -H "x-auth-token: \$CODEMAGIC_API_KEY" \
                                    -d '{
                                        \"appId\": \"${CODEMAGIC_APP_ID}\",
                                        \"branch\": \"${CODEMAGIC_BRANCH}\",
                                        \"workflowId\": \"${CODEMAGIC_WORKFLOW}\"
                                    }' \
                                    https://api.codemagic.io/builds
                            """,
                            returnStdout: true
                        ).trim()

                        if (response == '200') {
                            echo "Codemagic build triggered for branch ${CODMAGIC_BRANCH}."
                        } else {
                            error "Codemagic API returned HTTP ${response}"
                        }
                    }
                }
            }
        }
    }
}

{{< /highlight >}}

Replace:

1. `YOUR_APP_ID` with your Codemagic app ID.
2. `YOUR_WORKFLOW_NAME` with your workflow name
3. `YOUR_BRANCH_NAME` with your branch name

## Security best practices
Store **API keys** as Jenkins credentials and use `withCredentials` to mask them in logs.

Rotate your **Codemagic API key** regularly.
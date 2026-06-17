---
title: Jenkins integration
description: How to integrate Codemagic into your Jenkins workflows using the Codemagic REST API
weight: 11
---

Trigger Codemagic builds from Jenkins pipeline stages using the [REST API](/rest-api/builds/), then report build status and artifacts back to Jenkins from `codemagic.yaml` publishing scripts.

Use **callbacks** when Jenkins should fire-and-forget the mobile build and continue when Codemagic notifies you. Use **polling** (or wait on a downstream job triggered by the callback) when later Jenkins stages must block on Codemagic finishing. For the latest API surface, see the [Codemagic REST API v3 schema](https://codemagic.io/api/v3/schema); the examples below use `POST https://api.codemagic.io/builds`.

## Create a Codemagic API key

You need a Codemagic API key to authenticate REST API requests from Jenkins. The token is **per Codemagic user**; permitted actions follow that user's role on the team. Use a dedicated service account if Jenkins is shared infrastructure. See [API overview](/rest-api/codemagic-rest-api/) for authentication details.

1. Log into Codemagic.
2. Make sure that you have **Personal account** selected from the left navigation bar team selection, then click **Settings > Integrations > Codemagic API**
3. Click **Show** and copy the `codemagic-api-key`.

## Find your Application ID
The Application ID uniquely identifies your app in Codemagic API calls.
1. Navigate to your app in Codemagic
2. Look at the app URL: https://codemagic.io/app/xxxxxxxxxxxxxxxxxxxxxxxx
3. Copy the UUID at the end - this is your `AppID`.

## Find your workflow name
The workflow name specifies which workflow to trigger in API calls.
1. Navigate to your `codemagic.yaml` file (in Codemagic or in your repository)
2. Copy the **workflow key** under `workflows:` (e.g., `sample-workflow`). This is the value for `workflowId` in API calls—not the optional display `name:` field.
3. Use this key as `WORKFLOW_NAME` in API calls

{{< highlight yaml "style=paraiso-dark" >}}
workflows:
  sample-workflow:
    name: Codemagic Sample Workflow
{{< /highlight >}}

## Configuring access to Codemagic in Jenkins

One credential needs to be added to Jenkins for the Codemagic integration: `codemagic-api-key`.

1. Go to Manage Jenkins → Credentials → System → Global credentials.
2. Click Add Credentials.
3. Set Kind to **Secret text**
4. Set Scope to **Global**
5. Set Secret to `your-codemagic-api-key`
6. Set ID to **codemagic-api-key**.
7. Click OK.

## Trigger a Codemagic build
A Pipeline job can send a request to Codemagic with the app, workflow, and branch or tag to build.

Learn more about required parameters: [Builds API documentation](/rest-api/builds/#start-a-new-build)

{{<notebox>}}
**Note:** When you start a build through the API, `appId`, `workflowId`, and `branch` or `tag` in the request determine what runs. Trigger and branch filters in `codemagic.yaml` are **not** applied to API-started builds.
{{</notebox>}}

The following example triggers a Codemagic build, passes Jenkins metadata as environment variables, and stores the returned `buildId`:

{{< highlight groovy "style=paraiso-dark" >}}
pipeline {
    agent any

    environment {
        CODEMAGIC_APP_ID   = 'YOUR_APP_ID' // change to your AppID
        CODEMAGIC_WORKFLOW = 'YOUR_WORKFLOW_NAME'  // workflow key from codemagic.yaml
        CODEMAGIC_BRANCH   = 'YOUR_BRANCH_NAME' // change to your branch name
    }

    stages {
        stage('Trigger Codemagic build') {
            steps {
                withCredentials([string(credentialsId: 'codemagic-api-key', variable: 'CODEMAGIC_API_KEY')]) {
                    script {
                        def result = sh(
                            script: """
                                curl -s -w "\\nHTTP_CODE:%{http_code}" \
                                    -X POST \
                                    -H "Content-Type: application/json" \
                                    -H "x-auth-token: \$CODEMAGIC_API_KEY" \
                                    -d '{
                                        \"appId\": \"${CODEMAGIC_APP_ID}\",
                                        \"branch\": \"${CODEMAGIC_BRANCH}\",
                                        \"workflowId\": \"${CODEMAGIC_WORKFLOW}\",
                                        \"environment\": {
                                            \"variables\": {
                                                \"BUILD_NUMBER\": \"${env.BUILD_NUMBER}\",
                                                \"TRIGGERED_BY\": \"jenkins\"
                                            },
                                            \"groups\": [
                                                \"YOUR_VARIABLE_GROUP\"
                                            ]
                                        }
                                    }' \
                                    https://api.codemagic.io/builds
                            """,
                            returnStdout: true
                        ).trim()

                        def parts = result.split('HTTP_CODE:')
                        def body = parts[0].trim()
                        def httpCode = parts[1].trim()

                        if (httpCode == '200') {
                            def build = readJSON text: body
                            env.CODEMAGIC_BUILD_ID = build.buildId
                            echo "Codemagic build triggered: https://codemagic.io/app/${CODEMAGIC_APP_ID}/build/${build.buildId}"
                        } else {
                            error "Codemagic API returned HTTP ${httpCode}: ${body}"
                        }
                    }
                }
            }
        }
    }
}

{{< /highlight >}}

For release pipelines that build from a Git tag, send `tag` instead of `branch` in the JSON body.

You can also pass software version overrides and `instanceType` in the `environment` object. See [Pass custom build parameters](/rest-api/builds/#pass-custom-build-parameters). Variables you pass from Jenkins are available in Codemagic build scripts alongside [built-in environment variables](/yaml-basic-configuration/environment-variables/) (`CM_TRIGGER_SOURCE` is `api` for API-started builds).

If a Jenkins run is aborted while a Codemagic build is in flight, call [Cancel build](/rest-api/builds/#cancel-build) with the stored `buildId`.

To poll build status instead of using callbacks, call `GET https://codemagic.io/api/v3/builds/{buildId}` with the same `x-auth-token` header ([v3 API schema](https://codemagic.io/api/v3/schema)); the [Builds API](/rest-api/builds/) documents start and cancel only.

## Report results back to Jenkins

To close the loop without polling, add a `publishing` script in `codemagic.yaml` that notifies Jenkins when the Codemagic build finishes. Store Jenkins callback credentials (`JENKINS_CALLBACK_URL`, `JENKINS_USER`, `JENKINS_API_TOKEN`) in a Codemagic environment variable group—not in the repository.

The example below uses `buildWithParameters` to trigger a **parameterized downstream Jenkins job** that receives the Codemagic result. Adjust the URL, parameters, and authentication for webhooks or other patterns you already use.

The example marks a successful build during the build phase, then reports success or failure to Jenkins. Publishing scripts run regardless of build status unless you add conditions—see [Publishing](/yaml-basic-configuration/yaml-getting-started/#publishing).

{{< highlight yaml "style=paraiso-dark" >}}
workflows:
  sample-workflow:
    scripts:
      - name: Mark build successful
        script: touch ~/SUCCESS
    publishing:
      scripts:
        - name: Notify Jenkins
          script: |
            if [ -f "$HOME/SUCCESS" ]; then
              STATUS=success
            else
              STATUS=failure
            fi
            curl -s -X POST "$JENKINS_CALLBACK_URL/buildWithParameters" \
              --user "$JENKINS_USER:$JENKINS_API_TOKEN" \
              --data-urlencode "CM_BUILD_ID=$CM_BUILD_ID" \
              --data-urlencode "CM_BUILD_STATUS=$STATUS" \
              --data-urlencode "CM_ARTIFACT_LINKS=$CM_ARTIFACT_LINKS"
{{< /highlight >}}

`CM_BUILD_ID` and `CM_ARTIFACT_LINKS` are [built-in Codemagic environment variables](/yaml-basic-configuration/environment-variables/). `CM_ARTIFACT_LINKS` is a JSON-encoded list of artifact names and download URLs.

If pull request gating runs on GitHub rather than Jenkins, you can report build status with [GitHub Checks](/yaml-notification/github-checks/) instead of—or in addition to—a Jenkins callback.

## Configuring Fastlane

Codemagic has Fastlane preinstalled, you can define lanes in `codemagic.yaml` and trigger that workflow from Jenkins with the API steps above.

For Match, App Store Connect API keys, and sample `codemagic.yaml` snippets, see [Fastlane integration](/integrations/fastlane-integration/).

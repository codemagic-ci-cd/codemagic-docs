---
title: Jenkins integration
description: How to integrate Codemagic into your Jenkins workflows using the Codemagic REST API
weight: 11
---

Trigger Codemagic builds from Jenkins pipeline stages using the [REST API](/rest-api/builds/). Poll build status from Jenkins, or report results back from `codemagic.yaml` publishing scripts.

Codemagic uses two API base URLs with the same `x-auth-token` header:

| Action | URL |
| ------ | --- |
| Start build | `POST https://api.codemagic.io/builds` |
| Cancel build | `POST https://api.codemagic.io/builds/{buildId}/cancel` |
| Get build status | `GET https://codemagic.io/api/v3/builds/{buildId}` |

For the full v3 surface, see the [Codemagic REST API v3 schema](https://codemagic.io/api/v3/schema). Start and cancel are documented in the [Builds API](/rest-api/builds/).

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

The following example triggers a Codemagic build, passes Jenkins metadata as environment variables, and stores the returned `buildId`. JSON is parsed with Groovy's built-in `JsonSlurper` (no extra Jenkins plugin required). If you already use [Pipeline Utility Steps](https://plugins.jenkins.io/pipeline-utility-steps/), `readJSON text: body` is equivalent. For API-only pipelines that do not use the repository on the agent, add `options { skipDefaultCheckout(true) }` to skip an unnecessary SCM checkout.

{{< highlight groovy "style=paraiso-dark" >}}
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

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
                            def build = new groovy.json.JsonSlurper().parseText(body)
                            env.CODEMAGIC_BUILD_ID = build.buildId as String
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

You can pass software version overrides in the `environment` object, and `instanceType` at the **top level** of the request body (not inside `environment`). See [Pass custom build parameters](/rest-api/builds/#pass-custom-build-parameters). Variables you pass from Jenkins are available in Codemagic build scripts alongside [built-in environment variables](/yaml-basic-configuration/environment-variables/) (`CM_TRIGGER_SOURCE` is `api` for API-started builds). That includes Jenkins callback variables for the [publishing script](#report-results-back-to-jenkins) when you want per-build URLs without editing Codemagic settings:

{{< highlight json "style=paraiso-dark" >}}
"environment": {
  "variables": {
    "BUILD_NUMBER": "42",
    "JENKINS_CALLBACK_URL": "https://jenkins.example.com/job/codemagic-callback",
    "JENKINS_USER": "ci-bot",
    "JENKINS_API_TOKEN": "…",
    "JENKINS_TRIGGER_BUILD": "42"
  }
}
{{< /highlight >}}

Store secrets in a Codemagic [environment variable group](/yaml-basic-configuration/environment-variables/) when the values are fixed across builds.

If a Jenkins run is aborted while a Codemagic build is in flight, call [Cancel build](/rest-api/builds/#cancel-build) with the stored `buildId`.

## Poll build status

Poll `GET https://codemagic.io/api/v3/builds/{buildId}` until the build reaches a terminal status. The v3 response wraps the build under `data`; read **`data.status`**, not a top-level `status` field.

| Status | Meaning |
| ------ | ------- |
| `initializing`, `queued`, `preparing`, `fetching`, `testing`, `building`, `publishing`, `finishing` | In progress — keep polling |
| `finished` | Build completed successfully |
| `failed`, `canceled`, `timeout`, `skipped` | Build did not complete successfully |

There is no separate `success` status — treat `finished` as success.

The example below adds a wait stage after the trigger. `codemagicBuildStatus` is marked `@NonCPS` and returns a plain `String` so Jenkins can safely call `sleep()` between polls (parsed JSON objects cannot be held across `sleep()` in Declarative Pipelines).

{{< highlight groovy "style=paraiso-dark" >}}
@NonCPS
String codemagicBuildStatus(String jsonBody) {
    def parsed = new groovy.json.JsonSlurper().parseText(jsonBody)
    return parsed.data.status as String
}

pipeline {
    agent any

    environment {
        CODEMAGIC_APP_ID   = 'YOUR_APP_ID'
        CODEMAGIC_WORKFLOW = 'YOUR_WORKFLOW_NAME'
        CODEMAGIC_BRANCH   = 'YOUR_BRANCH_NAME'
    }

    stages {
        stage('Trigger Codemagic build') {
            steps {
                withCredentials([string(credentialsId: 'codemagic-api-key', variable: 'CODEMAGIC_API_KEY')]) {
                    script {
                        // ... same trigger script as above ...
                    }
                }
            }
        }

        stage('Wait for Codemagic build') {
            steps {
                withCredentials([string(credentialsId: 'codemagic-api-key', variable: 'CODEMAGIC_API_KEY')]) {
                    script {
                        def terminalStatuses = ['finished', 'failed', 'canceled', 'timeout', 'skipped']
                        def status = ''

                        while (!terminalStatuses.contains(status)) {
                            def body = sh(
                                script: """
                                    curl -s \
                                        -H "x-auth-token: \$CODEMAGIC_API_KEY" \
                                        https://codemagic.io/api/v3/builds/${env.CODEMAGIC_BUILD_ID}
                                """,
                                returnStdout: true
                            ).trim()

                            status = codemagicBuildStatus(body)
                            echo "Codemagic build status: ${status}"

                            if (!terminalStatuses.contains(status)) {
                                sleep(time: 30, unit: 'SECONDS')
                            }
                        }

                        if (status != 'finished') {
                            error "Codemagic build ${env.CODEMAGIC_BUILD_ID} ended with status: ${status}"
                        }
                    }
                }
            }
        }
    }
}

{{< /highlight >}}

## Report results back to Jenkins

Codemagic runs builds in the cloud. The publishing script POSTs to Jenkins when the build finishes, so Jenkins must be reachable at a **public HTTPS URL** (reverse proxy, ingress, and so on). A `localhost` Jenkins URL will not work.

### Create the callback job

Create a parameterized Pipeline job that receives the Codemagic result—for example, `codemagic-callback` at `https://jenkins.example.com/job/codemagic-callback`. Define these **string parameters**:

| Parameter | Description |
| --------- | ----------- |
| `CM_BUILD_ID` | Codemagic build ID |
| `CM_BUILD_STATUS` | `success` or `failure` |
| `CM_ARTIFACT_LINKS` | JSON list of artifact names and URLs ([built-in variable](/yaml-basic-configuration/environment-variables/)) |
| `JENKINS_TRIGGER_BUILD` | Optional. Jenkins build number that triggered the Codemagic build |

{{< highlight groovy "style=paraiso-dark" >}}
pipeline {
    agent any

    parameters {
        string(name: 'CM_BUILD_ID', defaultValue: '')
        string(name: 'CM_BUILD_STATUS', defaultValue: '')
        string(name: 'CM_ARTIFACT_LINKS', defaultValue: '')
        string(name: 'JENKINS_TRIGGER_BUILD', defaultValue: '')
    }

    stages {
        stage('Handle Codemagic result') {
            steps {
                echo "Codemagic build ${params.CM_BUILD_ID}: ${params.CM_BUILD_STATUS}"
                if (params.CM_BUILD_STATUS != 'success') {
                    error "Codemagic build failed"
                }
            }
        }
    }
}
{{< /highlight >}}

### Configure callback credentials

Store `JENKINS_CALLBACK_URL`, `JENKINS_USER`, and `JENKINS_API_TOKEN` in a Codemagic environment variable group, or pass them in the [start-build request](#trigger-a-codemagic-build) `environment.variables` object.

- **`JENKINS_CALLBACK_URL`** — Job URL **without** `/buildWithParameters`. Example: `https://jenkins.example.com/job/codemagic-callback`. The publishing script appends `/buildWithParameters`.
- **`JENKINS_USER`** — Jenkins username for API access.
- **`JENKINS_API_TOKEN`** — A [Jenkins API token](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/) for that user (**not** the account password). Generate one under the user's profile (for example, click the username → **Security** → **API Token** → **Add new Token**). API token authentication bypasses CSRF protection on `buildWithParameters`; using a password often returns `403` unless CSRF is disabled (not recommended for production).

### Notify Jenkins from codemagic.yaml

Add a `publishing` script that runs when the Codemagic build finishes. [Publishing scripts](/yaml-basic-configuration/yaml-getting-started/#publishing) run regardless of build status unless you add conditions.

The example below runs build steps first, then creates `~/SUCCESS` only if they all pass. If a script step fails, `~/SUCCESS` is not created and the publishing script reports `failure` to Jenkins.

{{< highlight yaml "style=paraiso-dark" >}}
workflows:
  sample-workflow:
    scripts:
      - name: Build app
        script: |
          # ... your build steps ...
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
            HTTP_CODE=$(curl -s -o /tmp/jenkins-response.txt -w "%{http_code}" \
              -X POST "$JENKINS_CALLBACK_URL/buildWithParameters" \
              --user "$JENKINS_USER:$JENKINS_API_TOKEN" \
              --data-urlencode "CM_BUILD_ID=$CM_BUILD_ID" \
              --data-urlencode "CM_BUILD_STATUS=$STATUS" \
              --data-urlencode "CM_ARTIFACT_LINKS=$CM_ARTIFACT_LINKS" \
              --data-urlencode "JENKINS_TRIGGER_BUILD=$JENKINS_TRIGGER_BUILD")
            if [ "$HTTP_CODE" -lt 200 ] || [ "$HTTP_CODE" -ge 300 ]; then
              cat /tmp/jenkins-response.txt
              exit 1
            fi
{{< /highlight >}}

`CM_BUILD_ID` and `CM_ARTIFACT_LINKS` are [built-in Codemagic environment variables](/yaml-basic-configuration/environment-variables/). `CM_ARTIFACT_LINKS` is a JSON-encoded list of artifact names and download URLs.

If pull request gating runs on GitHub rather than Jenkins, you can report build status with [GitHub Checks](/yaml-notification/github-checks/) instead of—or in addition to—a Jenkins callback.

## Configuring Fastlane

Codemagic has Fastlane preinstalled, you can define lanes in `codemagic.yaml` and trigger that workflow from Jenkins with the API steps above.

For Match, App Store Connect API keys, and sample `codemagic.yaml` snippets, see [Fastlane integration](/integrations/fastlane-integration/).

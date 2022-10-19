---
title: Katalon integration
description: How to integrate your workflows with Katalon using codemagic.yaml
weight: 10
---

**Katalon** is designed to create and reuse automated test scripts for UI without coding.

A sample project that shows how to configure Katalon integration is available in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/katalon_integration_demo_project).


## Configure Katalon access

In order to create a project and retrive API key that are used when uploading test to the Katalon testing environment, you need to [sign up](https://katalon.com/) with Katalon.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `KATALON_API_KEY`.
3. Enter the API key string as **_Variable value_**.
4. Enter the variable group name, e.g. **_katalon_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to add the `KATALON_PROJECT_ID`.

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - katalon_credentials
{{< /highlight >}}

9. Katalon requires that you create a `testops-config.json` file in your project root. In order to avoid exposing your API key in the repository, add a script to create the required file during build time.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Create testops-config for Katalon
      script: | 
        cat >> "testops-config.json" << EOF 
          {                                 
            "apiKey": "$KATALON_API_KEY",   
            "projectId": "$KATALON_PROJECT_ID", 
            "reportFolder": "testops-report"    
          }
EOF
{{< /highlight >}}


## Jest, Mocha and Jasmine testing

In order to execute **jest**, **mocha** and **jasmine** tests and upload the test results to **Katalon**, you need to go through the following steps:

#### Install Katalon TestOps plugin

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Create testops-config for Katalon
      script: | 
        npm i -s @katalon/testops-jest
{{< /highlight >}}


#### Create files for Jest

For Jest, add the following to the `testops-config.json` file created earlier (add these lines to the **Create testops-config for Katalon** script):

{{< highlight json "style=paraiso-dark">}}
  module.exports = {
    "reporters": ["default", "@katalon/testops-jest"]
  }
{{< /highlight >}}


For Jest, also create a file named `./tests/setup.js` with the following content:

{{< highlight javascript "style=paraiso-dark">}}
  import TestOpsJasmineReporter from "@katalon/testops-jasmine";
  const reporter = new TestOpsJasmineReporter();
  jasmine.getEnv().addReporter(reporter);
{{< /highlight >}}


#### Run the appropriate command

{{< tabpane >}}

{{< tab header="Jest" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Run Katalon command
      script: npx jest
{{< /highlight >}}
{{< /tab >}}

{{< tab header="Jasmine" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Run Katalon command
      script: npx jasmine
{{< /highlight >}}
{{< /tab >}}

{{< tab header="Mocha" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Run Katalon command
      script: npx mocha --reporter @katalon/testops-mocha
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}


## Junit reports

In order to collect Junit XML reports and submit them to **Katalon**, add the following steps to your scripts section of `codemagic.yaml`:

1. Execute and save test reports to a file by using **test_report** flag. More info about **test_report** flag can be found [here](../yaml-testing/testing/):
 
2. Install Katalon Report Uploader docker image and complete the upload process

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Generate test report
      script: | 
        ./gradlew test
      test_report: app/build/test-results/**/*.xml
    - name: Upload to Katalon
      script: | 
        docker run -t --rm \
          -v $CM_BUILD_DIR/app/build/test-results/testReleaseUnitTest/:/katalon/report \
          -e PASSWORD=$KATALON_API_KEY \
          -e PROJECT_ID=$KATALON_PROJECT_ID\
          -e TYPE=junit \
          -e REPORT_PATH=/katalon/report katalonstudio/report-uploader:0.0.8
{{< /highlight >}}

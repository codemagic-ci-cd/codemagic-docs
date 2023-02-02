---
title: SonarCloud integration
description: How to integrate your workflows with SonarCloud using codemagic.yaml
weight: 2
---

**SonarCloud** is SonarQube's cloud-based code quality and code security service for projects hosted in cloud-based Git repositories such as GitHub, Bitbucket, GitLab and Azure DevOps. It can be used as part of your CI/CD workflow to analyse your code each time you commit new code.

Sample projects that show how to configure SonarQube / SonarCloud integration are available in our sample projects repository for [Android](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/sonarqube_integration_demo_project/Android) and [iOS](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/sonarqube_integration_demo_project/Sonar).

## Create a SonarCloud account

You will need access to a SonarCloud account and can [sign up](https://sonarcloud.io/) for free. This will allow you to work with public repositories.

## Add your app to SonarCloud

1. Log into SonarCloud [here](https://sonarcloud.io/sessions/new)
2. Enter an organization key and click on **Continue**.
3. Choose the Free plan and click on **Create Organization**.
4. Click on **My Account**.
5. Under the Security tab, generate a token by entering a name and clicking on **Generate**.
6. Copy the token so you can use it as an environment variable in your Codemagic workflow.
7. Click on the “+” button in the top-right corner, and select **Analyze a new project** to add a new project.
8. Select the project and click on **Set Up**.
9. Wait for the initial analysis to complete, then modify the **Last analysis method**.
10. **Turn off** the SonarCloud Automatic Analysis.

You can now upload code analysis reports to SonarCloud from your CI/CD pipeline.


## Configuring access to SonarCloud in Codemagic

There are three **environment variables** that need to be added to your workflow for the SonarCloud integration: `SONAR_TOKEN`, `SONAR_PROJECT_KEY`, and `SONAR_ORG_KEY`.

- `SONAR_TOKEN` is the token you created when setting up your account
- `SONAR_PROJECT_KEY` can be obtained from your project settings once it has been added to SonarCloud
- `SONAR_ORG_KEY` is also obtained from your SonarCloud project settings

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `SONAR_TOKEN`.
3. Enter the required value as **_Variable value_**.
4. Enter the variable group name, e.g. **_sonarcloud_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the process to add all of the required variables.

8. Add the **sonarcloud_credentials** group in your `codemagic.yaml` file

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - sonarcloud_credentials
{{< /highlight >}}


## Platform specific configuration

{{< tabpane >}}

{{% tab header="Android" %}}
To use SonarCloud with Android projects, you need to add the **sonarqube plugin** to the `app/build.gradle` file:
{{< highlight Groovy "style=paraiso-dark">}}
plugins {
    ...
    id "org.sonarqube" version "3.3"
    ...
}
{{< /highlight >}}

You also need to set Sonarcloud properties in the same `app/build.gradle` file
{{< highlight Groovy "style=paraiso-dark">}}
sonarqube {
    properties {
        property "sonar.host.url", "https://sonarcloud.io"
        property "sonar.branch", System.getenv("CM_BRANCH")
        property "sonar.projectKey", System.getenv("SONAR_PROJECT_KEY")
        property "sonar.organization", System.getenv("SONAR_ORG_KEY")
        property "sonar.branch.name", System.getenv("CM_BRANCH")
        property "sonar.branch.target", System.getenv("CM_PULL_REQUEST_DEST")
        property "sonar.login", System.getenv("SONAR_TOKEN")
    }
}
{{< /highlight >}}

Finally, add the scripts to build the debug version and generate the analysis report to your `codemagic.yaml` file

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Generate debug build
      script: | 
        ./gradlew assembleDebug        
    - name: Generate and upload code analysis report
      script: | 
        ./gradlew sonarqube
{{< /highlight >}}

An Android sample project that shows how to configure SonarCloud integration is available [here](https://github.com/codemagic-ci-cd/android-sonarcloud-sample-project)
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
To use SonarCloud with iOS projects, you need to:

1. install the [Sonar Scanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
2. generate a debug build of your project
3. convert the coverage report to Sonarqube format
4. generate and upload code analysis report

To convert the coverage report to Sonarqube format, create a bash script in your project's root folder named `xccov-to-sonarqube-generic.sh` with the following content:

{{< highlight bash "style=paraiso-dark">}}
#!/usr/bin/env bash
set -euo pipefail

function convert_file {
  local xccovarchive_file="$1"
  local file_name="$2"
  local xccov_options="$3"
  echo "  <file path=\"$file_name\">"
  xcrun xccov view $xccov_options --file "$file_name" "$xccovarchive_file" | \
    sed -n '
    s/^ *\([0-9][0-9]*\): 0.*$/    <lineToCover lineNumber="\1" covered="false"\/>/p;
    s/^ *\([0-9][0-9]*\): [1-9].*$/    <lineToCover lineNumber="\1" covered="true"\/>/p
    '
  echo '  </file>'
}

function xccov_to_generic {
  echo '<coverage version="1">'
  for xccovarchive_file in "$@"; do
    if [[ ! -d $xccovarchive_file ]]
    then
      echo "Coverage FILE NOT FOUND AT PATH: $xccovarchive_file" 1>&2;
      exit 1
    fi
    local xccov_options=""
    if [[ $xccovarchive_file == *".xcresult"* ]]; then
      xccov_options="--archive"
    fi
    xcrun xccov view $xccov_options --file-list "$xccovarchive_file" | while read -r file_name; do
      convert_file "$xccovarchive_file" "$file_name" "$xccov_options"
    done
  done
  echo '</coverage>'
}

xccov_to_generic "$@"
{{< /highlight >}}

All of the other steps will be performed using scripts in your `codemagic.yaml` file:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install Sonar Scanner
      script: | 
        brew install sonar-scanner
    - name: Generate debug build
      script: | 
        xcodebuild \
          -project "$XCODE_PROJECT" \
          -scheme "$XCODE_SCHEME" \
          -sdk iphonesimulator \
          -destination 'platform=iOS Simulator,name=iPhone 12 Pro,OS=14.5' \
          -derivedDataPath Build/ \
          -enableCodeCoverage YES \
          clean build test CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
    - name: Convert coverage report to Sonarqube format
      script: | 
        bash xccov-to-sonarqube-generic.sh Build/Logs/Test/*.xcresult/ > sonarqube-generic-coverage.xml
    - name: Generate and upload code analysis report
      script: | 
        export PATH=$PATH:$CM_BUILD_DIR/sonar-scanner/bin    
        sonar-scanner \
          -Dsonar.projectKey=$SONAR_PROJECT_KEY \
          -Dsonar.organization=$SONAR_ORG_KEY \
          -Dsonar.host.url=https://sonarcloud.io \
          -Dsonar.login=$SONAR_TOKEN \
          -Dsonar.projectVersion=1.0.0 \
          -Dsonar.sources=. \
          -Dsonar.cfamily.build-wrapper-output.bypass=true \
          -Dsonar.coverageReportPaths=sonarqube-generic-coverage.xml \
          -Dsonar.c.file.suffixes=- \
          -Dsonar.cpp.file.suffixes=- \
          -Dsonar.objc.file.suffixes=-
{{< /highlight >}}

An iOS sample project that shows how to configure SonarCloud integration is available [here](https://github.com/codemagic-ci-cd/ios-sonarcloud-sample-project)
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}






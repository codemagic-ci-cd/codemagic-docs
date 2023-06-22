---
title: Codecov integration
description: How to integrate your workflows with Codecov using codemagic.yaml
weight: 7
---

[**Codecov**](https://about.codecov.io/) is a dedicated code analysis tool and one of the leading code coverage solutions for mobile applications. It can be used as a part of the Codemagic CI/CD pipeline for code coverage.


A sample project that shows how to configure Codecov integration is available in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/codecov_integration_demo_project).


## Configure Codecov access

1. In order to get a dedicated Codecov token, signing up is required. You can sign up for free [here](https://about.codecov.io/).
1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `CODECOV_TOKEN`.
3. Copy and paste the Capgo token string as **_Variable value_**.
4. Enter the variable group name, e.g. **_codecov_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - codecov_credentials
{{< /highlight >}}


## Collecting test results

After writing tests with your test suite you can generate a coverage report using **lcov** and upload that coverage report to **Codecov** directly via **codemagic.yaml**. It is also possible to exit the script if code coverage is lower or higher than the expected treshold. Refer to the sample script below:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Create coverage report
      script: | 
        HOMEBREW_NO_AUTO_UPDATE=1 brew install lcov
        mkdir -p test-results 
        flutter test --coverage --machine > test-results/flutter.json  
        
        code_coverage=$(lcov --list $CM_BUILD_DIR/coverage/lcov.info | sed -n "s/.*Total:|\(.*\)%.*/\1/p")
        
        echo "Code Coverage: ${code_coverage}% "
        if (( $(echo "$code_coverage < $CODE_COVERAGE_TARGET" | bc) ))
          then { echo "code coverage is less than expected" && exit 1; }
        fi  
  
        test_report: test-results/flutter.json
{{< /highlight >}}


Codecov accepts **.xml** **.json** and **.txt** coverage report formats. You can display test results visually in the build overview by adding them to a path. Just include the **test_report** field with a glob pattern matching the test result file location. More information can be found [here](https://docs.codemagic.io/yaml-testing/testing/).


## Submitting to Codecov

Code coverages can be submitted to the Codecov environment through Codemagic using a **cURL** request.

Codecov uses a separate upload tool to make it easy to upload coverage reports to Codecov for processing. Depending on the build machine type, add the corresponding script to your `codemagic.yaml` file: 

{{< tabpane >}}
{{< tab header="macOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Codecov upload
      script: | 
        curl -Os https://uploader.codecov.io/latest/macos/codecov
        chmod +x codecov
        ./codecov -t ${CODECOV_TOKEN}
{{< /highlight >}}
{{< /tab >}}

{{< tab header="Linux" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Codecov upload
      script: | 
        curl -Os https://uploader.codecov.io/latest/linux/codecov
        chmod +x codecov
        ./codecov -t ${CODECOV_TOKEN}
{{< /highlight >}}
{{< /tab >}}

{{< tab header="Windows" >}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Codecov upload
      script: | 
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri https://uploader.codecov.io/latest/windows/codecov.exe -Outfile codecov.exe
        .\codecov.exe -t ${CODECOV_TOKEN}
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}



After successfully uploading code coverage to **Codecov**, line-by-line coverage will be displayed on your GitHub pull requests via GitHub Checks. More information can be found [here](https://about.codecov.io/blog/announcing-line-by-line-coverage-via-github-checks/#:~:text=On%20a%20pull%20request%2C%20simply,right%20side%20of%20the%20annotation).

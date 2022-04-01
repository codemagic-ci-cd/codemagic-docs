---
title: Codecov integration
description: How to integrate your workflows with Codecov using codemagic.yaml
weight: 7
---

**Codecov** is a dedicated code analysis tool and one of the leading code coverage solutions for mobile applications. **Codecov** can be used as part of the Codemagic CI/CD pipeline for code coverage. 

## Collecting test results

After writing tests with your test suite you can generate a coverage report using **lcov** and upload that coverage report to **Codecov** directly via **codemagic.yaml**. It is also possible to exit the script if code coverage is less or more than expected rates. Refer to the sample script below:

```
- name: Coverage report
  script: |
     HOMEBREW_NO_AUTO_UPDATE=1 brew install lcov
     mkdir -p test-results 
     flutter test --coverage --machine > test-results/flutter.json  
     code_coverage=$(lcov --list $FCI_BUILD_DIR/coverage/lcov.info | sed -n "s/.*Total:|\(.*\)%.*/\1/p")
     echo "Code Coverage: ${code_coverage}% "
     if (( $(echo "$code_coverage < $CODE_COVERAGE_TARGET" | bc) )); then { echo "code coverage is less than expected" && exit 1; }; fi  
  test_report: test-results/flutter.json
```

In order to store test results in a location after collecting them, just include the **test_report** field with a glob pattern matching the test result file location.


## Create a Codecov account

In order to get a dedicated Codecov token, signing up is required. You can sign up for free [here](https://about.codecov.io/): 

## Configuring Codecov Code Coverage Upload:

Code coverages can be submitted to the Codecov environment through Codemagic using a **cURL** request. In order to configure it correctly, a codecov token is required which can be found in your Codecov account after signing up. After getting the necessary token, it can be assigned to an environment variable. Environment variables can be added in the Codemagic web app using the ‘Environment variables’ tab. You can then and import your variable groups into your codemagic.yaml. For example, if you named your variable group ‘codecov_credentials’, you would import it as follows:

```
workflows:
  workflow-name:
    environment:
      groups:
        - codecov_token

```

For further information about using variable groups please click [here](https://docs.codemagic.io/variables/environment-variable-groups/).


Codecov uses a separate upload tool to make it easy to upload coverage reports to Codecov for processing. cURL request changes depending on what build machine is used:

**Mac**:
```
curl -Os https://uploader.codecov.io/latest/macos/codecov
chmod +x codecov
./codecov -t ${CODECOV_TOKEN}
```
**Windows**:
```
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri https://uploader.codecov.io/latest/windows/codecov.exe 
-Outfile codecov.exe
 .\codecov.exe -t ${CODECOV_TOKEN}
```
**Linux**
```
curl -Os https://uploader.codecov.io/latest/linux/codecov
chmod +x codecov
./codecov -t ${CODECOV_TOKEN}
```

Codecov accepts **.xml** **.json** and **.txt** coverage report formats. You can display test results visually in the build overview by adding them to a path. Just include the **test_report** field with a glob pattern matching the test result file location. More information can be found [here](https://docs.codemagic.io/yaml-testing/testing/) along with its samples.

After successfully uploading code coverage to **Codecov**, line-by-line coverage will be displayed on your GitHub pull requests via GitHub Checks. More information can be found [here](https://about.codecov.io/blog/announcing-line-by-line-coverage-via-github-checks/#:~:text=On%20a%20pull%20request%2C%20simply,right%20side%20of%20the%20annotation)


## Sample Projects

A sample project that shows how to configure Codecov integration is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/codecov_integration_demo_project).

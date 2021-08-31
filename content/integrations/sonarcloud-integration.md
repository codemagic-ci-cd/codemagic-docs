---
title: SonarCloud integration
description: How to integrate your workflows with SonarCloud using codemagic.yaml
weight: 2
---
**SonarCloud** is a cloud based code quality and code security service for projects hosted in cloud based Git repositories such as GitHub, Bitbucket, GitLab and Azure DevOps. It can be used as part of your CI/CD workflow to analyse your code each time you commit new code. 

## Create a SonarCloud account

You will need access to a SonarCloud account and can [sign up](https://sonarcloud.io/) for free. This will allow you to work with public repositories.

## Add your app to SonarCloud

1. Log into SonarCloud [here](https://sonarcloud.io/sessions/new)
2. Enter an organization key and click on Continue.
3. Choose the Free plan and click on Create Organization.
4. Click on 'My Account'.
5. Under the Security tab, generate a token by entering a name and clicking on Generate.
6. Copy the token so you can use it as an environment variable in your Codemagic workflow.
7. Click on the “+” button in the top-right corner, and select Analyze a new project to add a new project.
8. Select the project and click on Set Up.
9. Wait for the initial analysis to complete, then modify the Last analysis method.
10. **Turn off** the SonarCloud Automatic Analysis.

You can now upload code analysis reports to SonarCloud from your CI/CD pipeline.

## Android sample project

An Android sample project that shows how to configure SonarCloud integration is available [here](https://github.com/codemagic-ci-cd/android-sonarcloud-sample-project)

Please refer to the **README.md** in the sample project for configuration instructions for your Android project.

## iOS sample project

An iOS sample project that shows how to configure SonarCloud integration is available [here](https://github.com/codemagic-ci-cd/ios-sonarcloud-sample-project)

Please refer to the **README.md** in the sample project for configuration instructions for your iOS project.






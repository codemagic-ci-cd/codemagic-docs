---
description: How to white label apps with Codemagic
title: White label apps
weight: 10
---

White labeling is the practice of building multiple versions of the same application. This can range from one or two up to thousands of different versions. 

This documentation page should be considered as a minimum viable page to help answer most common questions developers have specifically about setting up CI/CD for their white label product in order to understand if they can achieve their desired use case with Codemagic.

The documentation is open-sourced and we encourage you to provide feedback and contributions in the documentation GitHub repository [here](https://github.com/codemagic-ci-cd/codemagic-docs). If you are looking for general documentation about Codemagic, please use the search function or browse other parts of the documentation. 

## How to get started with Codemagic when white labeling ~10 different versions

We would recommend getting familiar with setting up a single version of your app to begin with. Set up your workflow using a codemagic.yaml configuration file and consult the documentation to understand core concepts, such as using environment variables, build triggers, script steps, code signing and publishing. Once you have successfully built and published a version of your app to the stores, continue by adding additional versions to your configuration file. 

## How to set up Codemagic with ~10 different versions

If you have around 10 different versions of your application that you are trying to set up CI/CD for, consider separating each version into a unique workflow. 

For example, for each version of your app you could create a workflow for it in the codemagic.yaml configuration file. 

```yaml
workflows:
  version-one:
    name: Version one
    instance_type: mac_mini
    environment:
      groups:
        ...
      vars:
        ...
    scripts:
      ...
    artifacts:
      ...
    publishing:
      ...
  version-two:
    name: Version two
    instance_type: mac_mini
    environment:
      groups:
        ...
      vars:
        ...
    scripts:
      ...
    artifacts:
      ...
    publishing:
      ...
```
## How to set up Codemagic with tens or hundreds of different versions

Users can start new builds using [Codemagic REST API](../rest-api/codemagic-rest-api.md). All data is sent and received as JSON. The REST API supports an optional parameter for environment variables. 

If your application has a content management system for your customers, you can leverage the API to trigger your builds and pass the client ID as an environment variable. 

An example of calling the Codemagic REST API might look something like this where you pass the `CLIENT_ID` variable to run a build for a specific client version. 


```bash
curl -H "Content-Type: application/json" -H "x-auth-token: ${CM_API_KEY}" \
--data '{
    "appId": "60c8a0dd628c3e293b8bc001", 
    "workflowId": "ios-production",
    "branch": "main", 
    "environment": { 
        "variables": { 
            "APP_STORE_ID": "1589804869",
            "BUNDLE_ID": "com.domain.appname",
            “CLIENT_ID”: “109”
        }
    }
}' \
https://api.codemagic.io/builds
```

Having passed a specific `CLIENT_ID` in the API call, you can then use the value to specifiy script steps in the codemagic.yaml configuration which authenticate with your CMS system and fetch the assets for that particular client ID and run the build for a specific client. 

An example of this might look like the following:

```yaml
scripts:
  - name: Download client assets
    script: |
      set -ex
      curl -0 -v https://assets.dommain.com/api/v1/assets/"${CLIENT_ID}"/ -H "Content-Type: application/zip" -H "Authorization: Bearer ${BEARER_TOKEN}" -o assets.zip
      unzip assets.zip
```

## How to get started with Codemagic when white labeling tens or hundreds of different versions

You should try any scripts on your local machine to test things like authenticating with your own CMS system, or running scripts that change application assets, such as icons or images. You can even use Codemagic's open-source [CLI tools](https://github.com/codemagic-ci-cd/cli-tools) to test features such as code signing and publishing. Once you are confident that your scripts work as expected, you can then set up your workflow on Codemagic.  
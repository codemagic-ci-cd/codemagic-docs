---
description: How to define and use environment variable groups
title: Environment variable groups
weight: 3
aliases: [/building/environment-variable-groups, /variables/encrypting, /building/encrypting]
platform: yaml
popular: 3
---

You can add environment variables in the following places:

* [Application environment variables](../variables/environment-variable-groups/#application-environment-variables) in Application settings
* [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in Team settings

## Variable groups

Environment variable groups allow you to define and store related sets of variables that are reusable in your [codemagic.yaml](../getting-started/yaml/) workflows. A variable _group_ tags a set of variables that can be imported together in a codemagic.yaml file. For example, you could define a `staging` group for variables related to your staging deployment and a `production` group for variables related to your production deployment. The variable names in staging and production groups can be identical, but the values will be set depending on which group is imported in the workflow. This allows you to reference variables in reusable scripts, but assign the actual values per workflow based on the imported group.

One or more variable groups can be imported into codemagic.yaml [environment section](../getting-started/yaml/#environment). For example, variable groups named `magic_values` and `other_values` can be imported with the following syntax:

```yaml
workflows:
  workflow-name:
    environment:
      groups:
        - magic_values
        - other_values
```

Variables defined in environment variable groups work exactly as [Environment Variables](../variables/environment-variables/#using-environment-variables). The value of a variable named `API_TOKEN` can be referenced in a workflow as `$API_TOKEN`. Variables defined with the **_secure_** option will have values obfuscated in the Codemagic UI.

## Global variables and secrets

Global variable groups can be defined on the team settings page (which you can navigate to for your team on the [Teams page](https://codemagic.io/teams)).

By default, variable groups defined here can be used in any codemagic.yaml workflow in any application of the team. It is possible to limit variable groups to specific applications by clicking the edit icon next to the group you wish to manage under **Application access**.

{{<notebox>}}
Global variable groups are only available for Teams. You can read more about teams [here](https://docs.codemagic.io/teams/teams/).
{{</notebox>}}

## Application environment variables

Application variable groups can be defined in the application settings **Environment Variables** tab and can be used in any codemagic.yaml workflow in the application.

Here you'll find some of the application environment groups and variables explained.

## Example for Android builds

    environment:
      groups:
        - keystore_credentials  # <-- (Includes: FCI_KEYSTORE_PATH, FCI_KEYSTORE, FCI_KEYSTORE_PASSWORD, FCI_KEY_PASSWORD, FCI_KEY_ALIAS)
        - google_play_credentials # <-- (GCLOUD_SERVICE_ACCOUNT_CREDENTIALS, GOOGLE_PLAY_TRACK)
        - other # <-- (PACKAGE_NAME, etc) 

The above groups contain the following variables: 

        GCLOUD_SERVICE_ACCOUNT_CREDENTIALS: Encrypted(...) # <-- Put your encrypted Google Play service account credentials here.
        FCI_KEYSTORE_PATH: /tmp/keystore.keystore
        FCI_KEYSTORE: # <-- Put your encrypted keystore here
        FCI_KEYSTORE_PASSWORD: # <-- Put your encrypted keystore password here
        FCI_KEY_PASSWORD:  # <-- Put your encrypted key alias password here
        FCI_KEY_ALIAS: # <-- Put your encrypted key alias here
        PACKAGE_NAME: "io.codemagic.flutteryaml" # <-- Put your package name here
        GOOGLE_PLAY_TRACK: "alpha" # <-- This must be "alpha" or above.  

## Example for iOS builds

    environment:
      groups:
        - appstore_credentials  # <-- (Includes: APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_IDENTIFIER, APP_STORE_CONNECT_PRIVATE_KEY, APP_STORE_ID)
        - certificate_credentials # <-- (CERTIFICATE_PRIVATE_KEY)
        - other # <-- (BUNDLE_ID, XCODE_WORKSPACE, XCODE_SCHEME)
        
The above groups contain the following variables: 

        XCODE_WORKSPACE: "Runner.xcworkspace"
        XCODE_SCHEME: "Runner"                
        # https://docs.codemagic.io/code-signing-yaml/signing-ios/
        APP_STORE_CONNECT_ISSUER_ID:  # <-- Put your encrypted App Store Connect Issuer Id here 
        APP_STORE_CONNECT_KEY_IDENTIFIER: # <-- Put your encrypted App Store Connect Key Identifier here 
        APP_STORE_CONNECT_PRIVATE_KEY: # <-- Put your encrypted App Store Connect Private Key here 
        CERTIFICATE_PRIVATE_KEY: # <-- Put your encrypted Certificate Private Key here 
        BUNDLE_ID: "io.codemagic.flutteryaml" # <-- Put your bundle id here
        APP_STORE_ID: 1111111111 # <-- Use the TestFlight Apple id number (An automatically generated ID assigned to your app) found under General > App Information > Apple ID. 

To access a variable, add the `$` symbol in front of its name. 

## Environment variable precedence

Environment variables with the same name and group from different sources will have the following precedence:

1. API variables
1. Application variables
1. Global variables

This means variables defined in a scope of higher precedence can override those in a lower precedence with the same name. For example, if you have a global variable `API_KEY` with a value `global` that is also defined in an application variable with the value `app`, then the value `app` will be used.

If variables with the same name are defined and imported from different groups of the same level of precedence, the values from the last imported variable group will be used. For example, if two application variable groups `magic` and `wand` are defined each with a variable named `magic_number` and imported in a codemagic.yaml like so:

```yaml
environment:
  groups:
    - magic
    - wand
```

Then the variable value in the group `wand` will be used.

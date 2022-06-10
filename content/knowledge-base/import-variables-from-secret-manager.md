---
title: Import Variables from a Secret Manager
weight: 2
---

Codemagic allows you to add encrypted secrets and variables in the UI which can be used during your workflow. You can find our more about storing sensitive values in Codemagic here.

However, it is possible to use third party secret managers in your pipelines. In order to do this, you will need to override environment variables defined in your codemagic.yaml configuration file during the build as explained here.

## AWS Secrets Manager


The following documentation shows how to do this using AWS Secrets Manager.

### Add AWS Environment variables in Codemagic
You will need to configure the environment variables `AWS_DEFAULT_REGION`, `AWS_SECRET_ACCESS_KEY`, and `AWS_ACCESS_KEY_ID` in the Codemagic UI.

Environment variables can be added at application level, or if you are using a Team, they can be added in the **Global variables and secrets** section of you Team settings.

Add these variables to a group called `aws_credentials`.

### Storing a secret in AWS Secrets Manager
Make sure that any secrets you store are in the same region as your AWS config file.

1. Log into your AWS account and search for **Secrets Manager**
2. Use the drop list at the top right to select the region that corresponds with Default region you set in your environment variables.
3. Click on the **Store a new secret** button.
4. Set the secret type to **Other type of secret**.
5. In the *Key/value* pairs section select **Plain text** and delete any placeholder text.
6. Paste in the secret you would like to store, this can be an RSA certificate or simple string value.
7. Click the **Next** button.
8. In the **Secret name and description** section enter a name for your secret in the **Secret name** field. For example, if you are storing your App Store Connect API key, you might want to name it using the same naming convention as Codemagic, e.g. `APP_STORE_CONNECT_PRIVATE_KEY`.
9. Click the **Next** button.
10. The is no need to configure any secret rotation, so click the **Next** button again.
11. On the Review screen, click on the **Store** button to store your secret.
12. Repeat this process for other values you would like to store.

### Retrieving secrets using the AWS CLI
Secrets can be retrieved using the AWS CLI.

Secrets stored as plain text values can be retrieved as follows, where the retrieved JSON result is parsed using `jq`. Note the use of the `-r` flag to strip the quotes from the JSON property value returned.

The following example shows how to retrieve a secret called `APP_STORE_CONNECT_ISSUER_ID` that was stored as plain text.

```
aws secretsmanager get-secret-value --secret-id APP_STORE_CONNECT_ISSUER_ID | jq -r '.SecretString'
```

If you have stored your secret using a *key/pair* value you can use the following syntax:

```
aws secretsmanager get-secret-value --secret-id APP_STORE_CONNECT_ISSUER_ID | jq -r '.SecretString' | jq -r '.APP_STORE_CONNECT_ISSUER_ID'
```

### Configure AWS authentication
In your codemagic.yaml import your `aws_credentials` group:

```
environment:
  groups:
    ...
    - aws_credentials
    ...
```

### Configuring an iOS build using AWS secrets
Add the following variables in the codemagic.yaml

```
environment:
  groups:
    ...
  vars:
    APP_STORE_CONNECT_PRIVATE_KEY: $APP_STORE_CONNECT_PRIVATE_KEY
    APP_STORE_CONNECT_KEY_IDENTIFIER: $APP_STORE_CONNECT_KEY_IDENTIFIER
    APP_STORE_CONNECT_ISSUER_ID: $APP_STORE_CONNECT_ISSUER_ID
    CERTIFICATE_PRIVATE_KEY: $CERTIFICATE_PRIVATE_KEY
```


In your first script step, retrieve the secrets from AWS and add them to **CM_ENV** as follows:

```
scripts:
  - name: Set iOS credentials from AWS secrets
    script: |
      echo "APP_STORE_CONNECT_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
      echo "$(aws secretsmanager get-secret-value --secret-id ASC_PRIVATE_KEY | jq -r '.SecretString')" >> $CM_ENV
      echo "DELIMITER" >> $CM_ENV

      echo "CERTIFICATE_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
      echo "$(aws secretsmanager get-secret-value --secret-id CERTIFICATE_PRIVATE_KEY | jq -r '.SecretString')" >> $CM_ENV
      echo "DELIMITER" >> $CM_ENV
        
      echo "APP_STORE_CONNECT_KEY_IDENTIFIER=$(aws secretsmanager get-secret-value --secret-id APP_STORE_CONNECT_KEY_IDENTIFIER | jq -r '.SecretString')" >> $CM_ENV

      echo "APP_STORE_CONNECT_ISSUER_ID=$(aws secretsmanager get-secret-value --secret-id APP_STORE_CONNECT_ISSUER_ID | jq -r '.SecretString')" >> $CM_ENV
```

Reference the variables for iOS publishing as usual:

```
publishing:
  app_store_connect:              
  api_key: $APP_STORE_CONNECT_PRIVATE_KEY      
  key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER     
  issuer_id: $APP_STORE_CONNECT_ISSUER_ID
```

### Configuring an Android build using AWS secrets
The environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` must be provided with a valid Service Account JSON key, even if you will overwrite it with a different key later. Add this variable to a group called `service_account` and then import it into you workflow as follows:

```
environment:
  groups:
    ...
    - service_account
    ...
```

Add the following environment variable in your codemagic.yaml:

```
environment:
  groups:
    ...
  vars:
    GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
```

In your first script step, retrieve the Service Account JSON from AWS and add it to **CM_ENV** as follows:

```
- name: Set Service Account JSON from AWS
  script: |
    echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
    echo "$(aws secretsmanager get-secret-value --secret-id GCLOUD_SERVICE_ACCOUNT_CREDENTIALS | jq -r '.SecretString')" >> $CM_ENV
          echo "DELIMITER" >> $CM_ENV
```

Reference the variable for publishing to Google Play as follows:

```
google_play:
  credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER
  track: $GOOGLE_PLAY_TRACK
```



## Doppler Secrets Manager


The following documentation shows how to do this using AWS Secrets Manager.

### Add Doppler token to the Environment variables in Codemagic

You will need to configure the environment variables `DOPPLER_TOKEN` in the Codemagic UI.

Environment variables can be added at application level, or if you are using a Team, they can be added in the **Global variables and secrets** section of you Team settings.
 

Add these variables to a group called `doopler_credentials`.

### Storing a secret in Doppler Secrets 

1. Log into your Doppler account and go to your workspace then your project.
2. Navigate to the **SECRETS** tab,
3. Click on the **Add Secret** button.
4. Paste in the secret you would like to store, this can be an RSA certificate or simple string value.
5. In the **NAME** section enter a name for your secret field. For example, if you are storing your App Store Connect API key, you might want to name it using the same naming convention as Codemagic, e.g. `APP_STORE_CONNECT_PRIVATE_KEY`.
6. Repeat this process for other values you would like to store.


### Generating a new Doppler Service Token 


1. After logging in navigate to the **ACCESS** tab in you project and tab on Generate.
2. Enter a token name and give it the *read access* and click **Generate Service Token**.
3. Copy the generated token.
4. Add the token to your Codemagic environment variable under the name `DOPPLER_TOKEN` in the Codemagic UI.


### Install the Doppler CLI

The Codemagic base build image doesn't has the Doppler CLI by default, so we need to install it first.

The following example shows how to install the Doppler CLI using brew.

```
- name: Install the Doppler CLI
        script: |
          brew install gnupg
          brew install dopplerhq/cli/doppler
```

After installing the CLI, you should export the `DOPPLER_TOKEN` so the other doppler commands will be authorized.

```
- name: Add the Doppler token to CM_ENV
        script: |
          echo "DOPPLER_TOKEN=$DOPPLER_TOKEN" >> $CM_ENV
```

### Retrieving secrets using the Doppler CLI

Secrets can be retrieved using the Doppler CLI.

The following example shows how to retrieve a secret called `APP_STORE_CONNECT_ISSUER_ID` as plain text.

```
- name: Set vars from Doppler
        script: |
          echo "APP_STORE_CONNECT_ISSUER_ID=$(doppler secrets get APP_STORE_CONNECT_ISSUER_ID --plain)" >> $CM_ENV
```

If you want to retrieve a secret with multiline variable, like the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` you can do it like this:

```
    echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
    echo "$(doppler secrets get GCLOUD_SERVICE_ACCOUNT_CREDENTIALS --plain)" >> $CM_ENV
          echo "DELIMITER" >> $CM_ENV
```

Notice that if you add the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` make sure you choose **No** when it asks you to replace `\n` with new lines.
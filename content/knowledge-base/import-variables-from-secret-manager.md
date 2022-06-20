---
title: Importing variables from a secret manager
weight: 2
---

Codemagic allows you to add encrypted secrets and variables in the UI which can be used during your workflow. You can find out more about storing sensitive values in Codemagic [here](https://docs.codemagic.io/variables/environment-variable-groups/#storing-sensitive-valuesfiles)

However, it is possible to use third-party secret managers in your pipelines. In order to do this, you will need to override environment variables defined in your codemagic.yaml configuration file during the build as explained [here](https://docs.codemagic.io/variables/using-environment-variables/#setting-environment-variables-during-the-build)

## AWS Secrets Manager
The following documentation shows how to do this using AWS Secrets Manager.

### Add AWS Environment variables in Codemagic
You will need to configure the environment variables `AWS_DEFAULT_REGION` , `AWS_SECRET_ACCESS_KEY` , and `AWS_ACCESS_KEY_ID` in the Codemagic UI.

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



## Doppler
The following documentation shows how to do this using Doppler.

### Add Doppler token to the Environment variables in Codemagic
You will need to configure the environment variables `DOPPLER_TOKEN` in the Codemagic UI.

Environment variables can be added at application level, or if you are using a Team, they can be added in the **Global variables and secrets** section of you Team settings.
 

Add these variables to a group called `doppler_credentials`.

### Storing a secret in Doppler 
To store a secret in Doppler, do the following:

1. Log into your Doppler account and go to your workspace then your project.
2. Navigate to the **SECRETS** tab,
3. Click on the **Add Secret** button.
4. Paste in the secret you would like to store, this can be an RSA certificate or simple string value.
5. In the **NAME** section enter a name for your secret field. For example, if you are storing your App Store Connect API key, you might want to name it using the same naming convention as Codemagic, e.g. `APP_STORE_CONNECT_PRIVATE_KEY`.
6. Repeat this process for other values you would like to store.


### Generating a new Doppler Service Token 
You can create a new Doppler service token as follows:

1. After logging in navigate to the **ACCESS** tab in your project and tab on Generate.
2. Enter a token name and give it the *read access* and click **Generate Service Token**.
3. Copy the generated token.
4. Add the token to your Codemagic environment variable under the name `DOPPLER_TOKEN` in the Codemagic UI.


### Install the Doppler CLI
The Codemagic base build image doesn't have the Doppler CLI by default, so we need to install it first.

The following example shows how to install the Doppler CLI:

`MacOS`:
```
      - name: Install doppler on Mac
        script: |
          brew install gnupg
          brew install dopplerhq/cli/doppler
```
`Linux`:
```
      - name: Install doppler on Linux
        script: |
          (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sudo sh
```
`Windows`:
```
      - name: Install doppler on Windows
        script: |
          Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
          iex "& {$(irm get.scoop.sh)} -RunAsAdmin"
          scoop bucket add doppler https://github.com/DopplerHQ/scoop-doppler.git
          scoop install doppler
```
See the official docs in [here](https://docs.doppler.com/docs/cli#installation).

### Retrieving secrets using the Doppler CLI
Secrets can be retrieved from Doppler using the Doppler CLI.

The following example shows how to retrieve a secret called `APP_STORE_CONNECT_ISSUER_ID` as plain text and add it to the System Environment directly.

```
- name: Retrieve vars from Doppler
        script: |
          echo "APP_STORE_CONNECT_ISSUER_ID=$(doppler secrets get APP_STORE_CONNECT_ISSUER_ID --plain)" >> $CM_ENV
```

If you want to retrieve a secret with multiline variable, like the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` you can do it like this:

```
    echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
    echo "$(doppler secrets get GCLOUD_SERVICE_ACCOUNT_CREDENTIALS --plain)" >> $CM_ENV
    echo "DELIMITER" >> $CM_ENV
```
{{</notebox>}}
Notice that if you add the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` make sure you choose **No** when it asks you to replace `\n` with new lines.
{{</notebox>}}

You can download all of your secrets and add them at once to your environment:
```
doppler secrets download --no-read-env --no-file --format env-no-quotes --config $DOPPLER_ENV --token $DOPPLER_TOKEN >> $CM_ENV
```
Make sure to set the `$DOPPLER_ENV` variable in the **vars** section.
```
environment:
      groups:
        - doppler_credentials # <-- (Includes the $DOPPLER_TOKEN)
      vars:
        DOPPLER_ENV: dev
```

{{</notebox>}}
1. If you are using a `windows_x2` machine notice that you should add the doppler path to the system path at the beginning of each script like this:
```
$env:Path += ";C:\Users\builder\scoop\shims"
```
2. When accessing the environment variables on the windows you can do so like this: `$env:VAR_NAME`, see more [here](../troubleshooting/common-windows-issues/).
{{</notebox>}}

## Hashicorp Vault
The following documentation shows how to use secrets stored in Hashicorp Vault.


### Add Hashicorp Vault Environment variables in Codemagic
In this example, we will use token authentication. To authenticate with other methods provided by Hashicorp Vault, please consult their documentation.

You will need to configure the environment variables `VAULT_NAMESPACE` , `VAULT_ADDR` , and `VAULT_TOKEN` in the Codemagic UI.

Environment variables can be added at application level, or if you are using a Team, they can be added in the **Global variables and secrets** section of you Team settings.

Add these variables to a group called `vault_credentials`.

### Storing a secret in Hashicorp Vault
Install the Hashicorp Vault CLI on your local machine:

```
brew tap hashicorp/tap
brew install hashicorp/tap/vault
```

To set a simple string value, you can add a single secret to a group as follows:

```
vault kv put secret/greetings message=hello
```

Retrieve the secret as follows:

```
vault kv get -field=message secret/greetings
```

To add a secret from file such as an RSA key or JSON key, you can add the contents of a file as follows:

```
vault kv put secret/gcloud GCLOUD_SERVICE_ACCOUNT_CREDENTIALS=@gcloud.json
```

To retrieve the secret you would do the following:

```
vault kv get -field=GCLOUD_SERVICE_ACCOUNT_CREDENTIALS secret/gcloud
```

### Retrieving secrets using the Hashicorp Vault CLI
Secrets can be retrieved using the Hashicorp Vault CLI.

Secrets stored as plain text values on specified paths in the vault

The following example shows how to retrieve a secret called ‘message’ that was stored in the vault path secret/greetings.

```
vault kv get -field=message secret/greetings
```

### Configure Hashicorp Vault authentication
In your codemagic.yaml import your `vault_credentials` group:

```
environment:
  groups:
    ...
    - vault_credentials
    ...
```

### Configuring an iOS build using Hashicorp Vault
Add your App Store credentials as follows:

```
vault kv put secret/appstore \\
APP_STORE_CONNECT_PRIVATE_KEY=@/path/to/app_store_connect_api_key_file
APP_STORE_CONNECT_KEY_IDENTIFIER=XXXXXXXXXX
APP_STORE_CONNECT_ISSUER_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
CERTIFICATE_PRIVATE_KEY=@/path/to/ios_distribution_cert_private_key_file
```

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

In your first script step, retrieve the secrets from Hashicorp Vault and add them to *CM_ENV* as follows:

```
scripts:
  - name: Set iOS credentials from AWS secrets
    script: |
      echo "APP_STORE_CONNECT_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
      echo "$(vault kv get -field=APP_STORE_CONNECT_PRIVATE_KEY secret/appstore)" >> $CM_ENV
      echo "DELIMITER" >> $CM_ENV

      echo "CERTIFICATE_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
      echo "$(vault kv get -field=CERTIFICATE_PRIVATE_KEY secret/appstore)" >> $CM_ENV
      echo "DELIMITER" >> $CM_ENV
        
      echo "APP_STORE_CONNECT_KEY_IDENTIFIER=$(vault kv get -field=APP_STORE_CONNECT_KEY_IDENTIFIER secret/appstore)" >> $CM_ENV

      echo "APP_STORE_CONNECT_ISSUER_ID=$(vault kv get -field=APP_STORE_CONNECT_ISSUER_ID secret/appstore)" >> $CM_ENV
```

Reference the variables for iOS publishing as usual:

```
publishing:
  app_store_connect:              
  api_key: $APP_STORE_CONNECT_PRIVATE_KEY      
  key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER     
  issuer_id: $APP_STORE_CONNECT_ISSUER_ID
```

### Configuring an Android build using Hashicorp Vault
The environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` must be provided with a valid Service Account JSON key, even if you will overwrite it with a different key later. Add this variable to a group called `service_account` and then import it into you workflow as follows:

```
environment:
  groups:
    ...
    - service_account
    ...
```

Add the secret for your Google Console Service Account to Hashicorp Vault as follows:

```
vault kv put secret/google \\
GCLOUD_SERVICE_ACCOUNT_CREDENTIALS=@/path/to/service_account.json
```

Add the following environment variable in your codemagic.yaml:

```
environment:
  groups:
    ...
  vars:
    GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
```

In your first script step, retrieve the Service Account JSON from Hashicorp Vault and add it to *CM_ENV* as follows:

```
- name: Set Service Account JSON from Hashicorp Vault
  script: |
    echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
    echo "$(vault kv get -field=GCLOUD_SERVICE_ACCOUNT_CREDENTIALS secret/google)" >> $CM_ENV
          echo "DELIMITER" >> $CM_ENV
```

Reference the variable for publishing to Google Play as follows:

```
google_play:
  credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER
  track: $GOOGLE_PLAY_TRACK
```
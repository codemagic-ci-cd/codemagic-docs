---
title: Importing variables from a secret manager
weight: 8
aliases:
 - /knowledge-base/import-variables-from-secret-manager
---

Codemagic allows you to add encrypted secrets and variables in the UI which can be used during your workflow. You can find out more about storing sensitive values in Codemagic [here](https://docs.codemagic.io/variables/environment-variable-groups/#storing-sensitive-valuesfiles)

However, it is possible to use third-party secret managers in your pipelines. In order to do this, you will need to override environment variables defined in your `codemagic.yaml` configuration file during the build as explained [here](https://docs.codemagic.io/variables/using-environment-variables/#setting-environment-variables-during-the-build)


## AWS Secrets Manager
The following steps illustrate how to use AWS Secrets Manager with Codemagic.

#### Configure AWS Environment access

You will need to configure the environment variables `AWS_DEFAULT_REGION` , `AWS_SECRET_ACCESS_KEY` , and `AWS_ACCESS_KEY_ID` in the Codemagic UI.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `AWS_DEFAULT_REGION`.
3. Enter the variable value as **_Variable value_**.
4. Enter the variable group name, e.g. **_aws_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to also add `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID` variables.

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - aws_credentials
{{< /highlight >}}


#### Storing a secret in AWS Secrets Manager

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


#### Retrieving secrets

Secrets can be retrieved using the **AWS CLI**.

Secrets stored as plain text values can be retrieved as JSON text and parsed using `jq` command. Note the use of the `-r` flag to strip the quotes from the JSON property value returned.

The following example shows how to retrieve a secret called `APP_STORE_CONNECT_ISSUER_ID` that was stored as plain text.

{{< highlight bash "style=paraiso-dark">}}
aws secretsmanager get-secret-value --secret-id APP_STORE_CONNECT_ISSUER_ID | jq -r '.SecretString'
{{< /highlight >}}

If you have stored your secret using a *key/pair* value you can use the following syntax:

{{< highlight bash "style=paraiso-dark">}}
aws secretsmanager get-secret-value \
  --secret-id APP_STORE_CONNECT_ISSUER_ID | \
  jq -r '.SecretString' | \
  jq -r '.APP_STORE_CONNECT_ISSUER_ID'
{{< /highlight >}}


#### Use secrets in `codemagic.yaml`

{{< tabpane >}}
{{< tab header="Android" >}}
{{<markdown>}}

1. The environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` must be provided with a valid Service Account JSON key, even if you will overwrite it with a different key later. Add this variable to a group called `service_account` and then import it into you workflow as follows:

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - service_account
      - aws_credentials
  vars:
    GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
{{< /highlight >}}

2. In your first script step, retrieve the Service Account JSON from AWS and add it to **CM_ENV**.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set Service Account JSON from AWS
      script: | 
        echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
        echo "$(aws secretsmanager get-secret-value \
          --secret-id GCLOUD_SERVICE_ACCOUNT_CREDENTIALS | jq -r '.SecretString')" >> $CM_ENV
        echo "DELIMITER" >> $CM_ENV
{{< /highlight >}}

3. Reference the variable for publishing to Google Play as follows:

{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    google_play:
      credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER
      track: $GOOGLE_PLAY_TRACK
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
1. Add the following variables in the codemagic.yaml
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - aws_credentials
    vars:
      APP_STORE_CONNECT_PRIVATE_KEY: $APP_STORE_CONNECT_PRIVATE_KEY
      APP_STORE_CONNECT_KEY_IDENTIFIER: $APP_STORE_CONNECT_KEY_IDENTIFIER
      APP_STORE_CONNECT_ISSUER_ID: $APP_STORE_CONNECT_ISSUER_ID
      CERTIFICATE_PRIVATE_KEY: $CERTIFICATE_PRIVATE_KEY
{{< /highlight >}}

2. In your first script step, retrieve the secrets from AWS and add them to **CM_ENV**.
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set iOS credentials from AWS secrets
      script: | 
        echo "APP_STORE_CONNECT_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
        echo "$(aws secretsmanager get-secret-value \
          --secret-id ASC_PRIVATE_KEY | jq -r '.SecretString')" >> $CM_ENV
        echo "DELIMITER" >> $CM_ENV
        #
        echo "CERTIFICATE_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
        echo "$(aws secretsmanager get-secret-value \
          --secret-id CERTIFICATE_PRIVATE_KEY | jq -r '.SecretString')" >> $CM_ENV
        echo "DELIMITER" >> $CM_ENV
        #
        echo "APP_STORE_CONNECT_KEY_IDENTIFIER=$(aws secretsmanager get-secret-value \
          --secret-id APP_STORE_CONNECT_KEY_IDENTIFIER | jq -r '.SecretString')" >> $CM_ENV
        #
        echo "APP_STORE_CONNECT_ISSUER_ID=$(aws secretsmanager get-secret-value \
          --secret-id APP_STORE_CONNECT_ISSUER_ID | jq -r '.SecretString')" >> $CM_ENV
{{< /highlight >}}

3. Reference the variables for iOS publishing as usual:

{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    app_store_connect:              
      api_key: $APP_STORE_CONNECT_PRIVATE_KEY      
      key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER     
      issuer_id: $APP_STORE_CONNECT_ISSUER_ID
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}


<br><br>



## Doppler

The following steps illustrate how to use Doppler Secrets Manager with Codemagic.

#### Configure Doppler access

You will need to configure the `DOPPLER_TOKEN` environment variable  in Codemagic UI. To create the token, login to Doppler, navigate to the **ACCESS** tab in your project click on **Generate**. Enter a token name, give it *read access* and click **Generate Service Token**.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `DOPPLER_TOKEN`.
3. Enter the tokan value as **_Variable value_**.
4. Enter the variable group name, e.g. **_doppler_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - doppler_credentials
{{< /highlight >}}


#### Storing a secret in Doppler 

To store a secret in Doppler, do the following:

1. Log into your Doppler account and go to your workspace then your project.
2. Navigate to the **SECRETS** tab,
3. Click on the **Add Secret** button.
4. Paste in the secret you would like to store, this can be an RSA certificate or simple string value.
5. In the **NAME** section enter a name for your secret field. For example, if you are storing your App Store Connect API key, you might want to name it using the same naming convention as Codemagic, e.g. `APP_STORE_CONNECT_PRIVATE_KEY`.
6. Repeat this process for other values you would like to store.


#### Install the Doppler CLI

The Codemagic base build image doesn't have the **Doppler CLI** by default, so we need to install it first.

The following example shows how to install the Doppler CLI on various build instance types:

{{< tabpane >}}
{{% tab header="MacOS" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install Doppler on MacOS
      script: | 
        brew install gnupg
        brew install dopplerhq/cli/doppler
{{< /highlight >}}

{{% /tab %}}

{{% tab header="Linux" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install Doppler on Linux
      script: | 
        (curl -Ls --tlsv1.2 --proto "=https" \
          --retry 3 https://cli.doppler.com/install.sh || \
          wget -t 3 -qO- https://cli.doppler.com/install.sh) | \
          sudo sh
{{< /highlight >}}

{{% /tab %}}

{{% tab header="Windows" %}}
{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Install Doppler on Windows
      script: | 
        Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
        iex "& {$(irm get.scoop.sh)} -RunAsAdmin"
        scoop bucket add doppler https://github.com/DopplerHQ/scoop-doppler.git
        scoop install doppler
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}

For more information, see the official [Doppler docs](https://docs.doppler.com/docs/cli#installation).


#### Retrieving secrets

The following example shows how to retrieve a secret called `APP_STORE_CONNECT_ISSUER_ID` as plain text and add it to the System Environment directly.

{{< highlight bash "style=paraiso-dark">}}
echo "APP_STORE_CONNECT_ISSUER_ID=$(doppler secrets get APP_STORE_CONNECT_ISSUER_ID --plain)" >> $CM_ENV
{{< /highlight >}}

If you want to retrieve a secret with multiline variable, like the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` you can do it like this:

{{< highlight bash "style=paraiso-dark">}}
echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV    
echo "$(doppler secrets get GCLOUD_SERVICE_ACCOUNT_CREDENTIALS --plain)" >> $CM_ENV
echo "DELIMITER" >> $CM_ENV
{{< /highlight >}}

{{<notebox>}}
**Note:** If you add the `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` make sure you choose **No** when it asks you to replace `\n` with new lines.
{{</notebox>}}

You can download all of your secrets and add them to your environment in a single step.

Make sure to set the `$DOPPLER_ENV` variable in the **vars** section.

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - doppler_credentials # <-- (Includes the $DOPPLER_TOKEN)
    vars:
      DOPPLER_ENV: dev
  
  scripts:
    - name: Import Dopler secrets
      script: | 
        doppler secrets download --no-read-env \
          --no-file \
          --format env-no-quotes \
          --config $DOPPLER_ENV \
          --token $DOPPLER_TOKEN >> $CM_ENV
{{< /highlight >}}


#### For Windows Users

1. You should add the doppler path to the system path at the beginning of each script like this:

{{< highlight bash "style=paraiso-dark">}}
$env:Path += ";C:\Users\builder\scoop\shims"
{{< /highlight >}}

2. When accessing the environment variables on the Windows, reference them as `$env:VAR_NAME`. See more [here](../troubleshooting/common-windows-issues/).

<br><br>





## Hashicorp Vault

The following steps illustrate how to use Hashicorp Vault with Codemagic.

#### Configure HAshicorp Vault access

This example uses token authentication. To authenticate with other methods provided by Hashicorp Vault, please consult their documentation.

You will need to configure the `VAULT_NAMESPACE`, `VAULT_ADDRESS`, and `VAULT_TOKEN` environment variables in the Codemagic UI.

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `VAULT_NAMESPACE`.
3. Enter the variable value as **_Variable value_**.
4. Enter the variable group name, e.g. **_vault_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.
7. Repeat the steps to also add `VAULT_ADDRESS` and `VAULT_TOKEN` variables.

8. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - vault_credentials
{{< /highlight >}}

#### Storing a secret in Hashicorp Vault

Install the Hashicorp Vault CLI on your local machine:

{{< highlight bash "style=paraiso-dark">}}
brew tap hashicorp/tap
brew install hashicorp/tap/vault
{{< /highlight >}}

To set a simple string value, you can add a single secret to a group as follows:

{{< highlight bash "style=paraiso-dark">}}
vault kv put secret/greetings message=hello
{{< /highlight >}}

Retrieve the secret as follows:

{{< highlight bash "style=paraiso-dark">}}
vault kv get -field=message secret/greetings
{{< /highlight >}}

To add a secret from file such as an RSA key or JSON key, you can add the contents of a file as follows:

{{< highlight bash "style=paraiso-dark">}}
vault kv put secret/gcloud GCLOUD_SERVICE_ACCOUNT_CREDENTIALS=@gcloud.json
{{< /highlight >}}

To retrieve the secret you would do the following:

{{< highlight bash "style=paraiso-dark">}}
vault kv get -field=GCLOUD_SERVICE_ACCOUNT_CREDENTIALS secret/gcloud
{{< /highlight >}}


#### Retrieving secrets
Secrets can be retrieved using the **Hashicorp Vault CLI**.

To retrieve a secret (e.g. 'message') stored as plain text value on a specified path (e.g. 'secret/greetings'):

{{< highlight bash "style=paraiso-dark">}}
vault kv get -field=message secret/greetings
{{< /highlight >}}


{{< tabpane >}}
{{< tab header="Android" >}}
{{<markdown>}}

1. The environment variable `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` must be provided with a valid Service Account JSON key, even if you will overwrite it with a different key later. Add this variable to a group called `service_account` and then import it into you workflow.

2. Add the secret for your **Google Console Service Account** to Hashicorp Vault as follows:

{{< highlight bash "style=paraiso-dark">}}
vault kv put secret/google \\
GCLOUD_SERVICE_ACCOUNT_CREDENTIALS=@/path/to/service_account.json
{{< /highlight >}}

3. Add the following environment variables and groups in your `codemagic.yaml`

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - service_account
      - vault_credentials
    vars:
      GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
{{< /highlight >}}

4. In your first script step, retrieve the Service Account JSON from Hashicorp Vault and add it to *CM_ENV*.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set Service Account JSON from Hashicorp Vault
      script: | 
        echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
        echo "$(vault kv get -field=GCLOUD_SERVICE_ACCOUNT_CREDENTIALS secret/google)" >> $CM_ENV
        echo "DELIMITER" >> $CM_ENV
{{< /highlight >}}


5. Reference the variable for publishing to Google Play.

{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    google_play:
      credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER
      track: $GOOGLE_PLAY_TRACK
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}

1. Add your App Store credentials to vault.

{{< highlight bash "style=paraiso-dark">}}
vault kv put secret/appstore \\
APP_STORE_CONNECT_PRIVATE_KEY=@/path/to/app_store_connect_api_key_file
APP_STORE_CONNECT_KEY_IDENTIFIER=XXXXXXXXXX
APP_STORE_CONNECT_ISSUER_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
CERTIFICATE_PRIVATE_KEY=@/path/to/ios_distribution_cert_private_key_file
{{< /highlight >}}

2. Add the following environment variables and groups in your `codemagic.yaml`
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - vault_credentials
    vars:
      APP_STORE_CONNECT_PRIVATE_KEY: $APP_STORE_CONNECT_PRIVATE_KEY
      APP_STORE_CONNECT_KEY_IDENTIFIER: $APP_STORE_CONNECT_KEY_IDENTIFIER
      APP_STORE_CONNECT_ISSUER_ID: $APP_STORE_CONNECT_ISSUER_ID
      CERTIFICATE_PRIVATE_KEY: $CERTIFICATE_PRIVATE_KEY
{{< /highlight >}}

3. In your first script step, retrieve the secrets from Hashicorp Vault and add them to *CM_ENV*.

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Set iOS credentials from AWS secrets
      script: | 
        echo "APP_STORE_CONNECT_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
        echo "$(vault kv get -field=APP_STORE_CONNECT_PRIVATE_KEY secret/appstore)" >> $CM_ENV
        echo "DELIMITER" >> $CM_ENV
        #
        echo "CERTIFICATE_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
        echo "$(vault kv get -field=CERTIFICATE_PRIVATE_KEY secret/appstore)" >> $CM_ENV
        echo "DELIMITER" >> $CM_ENV
        #
        echo "APP_STORE_CONNECT_KEY_IDENTIFIER=$(vault kv get -field=APP_STORE_CONNECT_KEY_IDENTIFIER secret/appstore)" >> $CM_ENV
        #
        echo "APP_STORE_CONNECT_ISSUER_ID=$(vault kv get -field=APP_STORE_CONNECT_ISSUER_ID secret/appstore)" >> $CM_ENV
{{< /highlight >}}

4. Reference the variables for iOS publishing as usual.
{{< highlight yaml "style=paraiso-dark">}}
  publishing:
    app_store_connect:              
      api_key: $APP_STORE_CONNECT_PRIVATE_KEY      
      key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER     
      issuer_id: $APP_STORE_CONNECT_ISSUER_ID
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}

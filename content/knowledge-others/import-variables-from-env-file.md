---
title: Importing variables from a .env file
description: How to import variables and secrets from a settings.env file
weight: 9
---
If you are white labelling apps for different customers, you might want to store the credentials for each customer in a settings.env in a secure S3 or GCP bucket. You can then download the settings.env for the specific customer to run the build and write the values to the `CM_ENV` environment variable. 

To learn more about setting environment variables at build time, please see [here](../yaml-basic-configuration/using-environment-variables/).

## Configure the settings.env file 

Make sure that if you include any RSA keys that you add them to the file and preserve the line breaks as follows.

{{< highlight bash "style=paraiso-dark">}}
APP_STORE_CONNECT_KEY_IDENTIFIER=XXXXXXXXXX
APP_STORE_CONNECT_ISSUER_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

APP_STORE_CONNECT_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----
xxxx
xxxx
xxxx
xxxx
-----END PRIVATE KEY-----'

CERTIFICATE_PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----
xxxx
xxxx
xxxx
xxxx
-----END RSA PRIVATE KEY-----'

GCLOUD_SERVICE_ACCOUNT_CREDENTIALS='{
  "type": "service_account",
  "project_id": "xxxx",
  "private_key_id": "xxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n",
  "client_email": "xxxxx-xxxx@pxxxx.iam.gserviceaccount.com",
  "client_id": "xxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/xxxx-xxxx%40pc-api-xxxx-xxxx.iam.gserviceaccount.com"
}'
{{< /highlight >}}

## Add environment variables to codemagic.yaml

In your codemagic.yaml you’ll need to define the variables so you don’t get yaml validation errors.

{{< highlight yaml "style=paraiso-dark">}}
    vars:
      ...
      APP_STORE_CONNECT_PRIVATE_KEY: $APP_STORE_CONNECT_PRIVATE_KEY
      APP_STORE_CONNECT_KEY_IDENTIFIER: $APP_STORE_CONNECT_KEY_IDENTIFIER
      APP_STORE_CONNECT_ISSUER_ID: $APP_STORE_CONNECT_ISSUER_ID
      CERTIFICATE_PRIVATE_KEY: $CERTIFICATE_PRIVATE_KEY
      GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
      ...
{{< /highlight >}}

## Add a valid Service Account JSON in the UI

{{<notebox>}}
**Note:** it is important that a valid service account is configured in the UI before overriding with another.  
{{</notebox>}}

In the Codemagic UI you should create an environment variable called `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` and set its value to a valid Service Account JSON, even if this will be overwritten by another key when white labelling.

## Writing values to CM_ENV

The following script first loads the **settings.env** file so you can read its values, and then writes the values to **CM_ENV**. Note that writing RSA keys requires using a delimiter to write a multi-line variable.


{{< highlight yaml "style=paraiso-dark">}}
  - name: Set value from settings.env
    script: | 

    source settings.env

    echo "APP_STORE_CONNECT_KEY_IDENTIFIER=$APP_STORE_CONNECT_KEY_IDENTIFIER" >> $CM_ENV
    echo "APP_STORE_CONNECT_ISSUER_ID=$APP_STORE_CONNECT_ISSUER_ID" >> $CM_ENV

    echo "APP_STORE_CONNECT_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
    echo "$APP_STORE_CONNECT_PRIVATE_KEY" >> $CM_ENV
    echo "DELIMITER" >> $CM_ENV

    echo "CERTIFICATE_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
    echo "$CERTIFICATE_PRIVATE_KEY" >> $CM_ENV
    echo "DELIMITER" >> $CM_ENV

    echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
    echo "$GCLOUD_SERVICE_ACCOUNT_CREDENTIALS" >> $CM_ENV
    echo "DELIMITER" >> $CM_ENV
{{< /highlight >}}

## A basic sample of using a settings.env file

{{< highlight yaml "style=paraiso-dark">}}
workflow-name:
  name: Workflow name
  instance_type: mac_pro
    max_build_duration: 120
    environment:
      groups:
        - group_name
      vars:
        ...
        APP_STORE_CONNECT_PRIVATE_KEY: $APP_STORE_CONNECT_PRIVATE_KEY
        APP_STORE_CONNECT_KEY_IDENTIFIER: $APP_STORE_CONNECT_KEY_IDENTIFIER
        APP_STORE_CONNECT_ISSUER_ID: $APP_STORE_CONNECT_ISSUER_ID
        CERTIFICATE_PRIVATE_KEY: $CERTIFICATE_PRIVATE_KEY
        GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        ...


      scripts:
        - name: Set value from settings.env
          script: | 

            source settings.env

            echo "APP_STORE_CONNECT_KEY_IDENTIFIER=$APP_STORE_CONNECT_KEY_IDENTIFIER" >> $CM_ENV
            echo "APP_STORE_CONNECT_ISSUER_ID=$APP_STORE_CONNECT_ISSUER_ID" >> $CM_ENV

            echo "APP_STORE_CONNECT_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
            echo "$APP_STORE_CONNECT_PRIVATE_KEY" >> $CM_ENV
            echo "DELIMITER" >> $CM_ENV

            echo "CERTIFICATE_PRIVATE_KEY<<DELIMITER" >> $CM_ENV
            echo "$CERTIFICATE_PRIVATE_KEY" >> $CM_ENV
            echo "DELIMITER" >> $CM_ENV

            echo "GCLOUD_SERVICE_ACCOUNT_CREDENTIALS<<DELIMITER" >> $CM_ENV
            echo "$GCLOUD_SERVICE_ACCOUNT_CREDENTIALS" >> $CM_ENV
            echo "DELIMITER" >> $CM_ENV
         ...
         publishing:
           app_store_connect:              
             api_key: $APP_STORE_CONNECT_PRIVATE_KEY      
             key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER     
             issuer_id: $APP_STORE_CONNECT_ISSUER_ID
           google_play:
             credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS_HOLDER
             track: $GOOGLE_PLAY_TRACK
             in_app_update_priority: 0
{{< /highlight >}}

## Troubleshooting writing variables to CM_ENV

On the Codemagic build machine the environment variables written to `CM_ENV` are written to the file `~/.codemagic`

In order to see how values get written to $CM_ENV, you can test it on your local machine by setting up a cm.env file as follows:

{{< highlight bash "style=paraiso-dark">}}
export CM_ENV=/tmp/cm.env
{{< /highlight >}}

Then run commands to test writing to $CM_ENV.

Open `/tmp/cm.env` to see what has been written to the file. 
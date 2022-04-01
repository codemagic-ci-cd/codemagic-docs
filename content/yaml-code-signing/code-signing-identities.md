---
title: Code signing identities
description: How to set up code signing identities
weight: 4
aliases: /code-signing-yaml/code-signing-identities
---

Teams can use code signing identities to manage their code signing files in **Team settings > codemagic.yaml settings > Code signing identities** and reference them from their `codemagic.yaml` configuration.

## Managing and uploading files

Team owner permissions are required to upload and edit uploaded files under the **Code signing identities** section. However, all team members can view the file info for the uploaded files.

### iOS certificates

It is possible to upload certificates with the `.p12` or `.pem` extension. When uploading, Codemagic will ask you to provide the certificate password as long as with a **Reference name**, which can then be used in the `codemagic.yaml` configuration to fetch the specific file.

The reference name and certificate type, team, and expiration date are displayed for each uploaded certificate.

In addition, Codemagic provides the option to generate a new `iOS Development` or `iOS Distribution` certificate. To do so, click on **Generate certificate** and provide a reference name and choose the certificate type and matching bundle identifier. Once the certificate has been created, Codemagic will allow you to download the certificate and provides the password for it. The download is available only once.

Note that Apple limits the number of `iOS Distribution` certificates to 3. If you already have reached the maximum number of certificates, the following error will be displayed:

```
You already have a current iOS Distribution certificate or a pending certificate request.
```

In the case of existing certificates, it is possible to fetch them from the Apple Developer Portal based on the bundle identifier.

### iOS profiles


### Android keystores

## Referencing files in codemagic.yaml

After uploading code signing files to Codemagic, these files can be fetched and used during the build by providing the file references in the `codemagic.yaml` configuration.

### iOS certificates and profiles

#### Fetching files by distribution type and bundle identifier

To fetch all uploaded signing files matching a specific distribution type and bundle identifier during the build, define the `distribution_type` and `bundle_identifier` fields in your `codemagic.yaml` configuration. Note that it is necessary to configure both of the fields.

```yaml
environment:
    ios_signing:
        distribution_type: ad_hoc  # app_store | development | enterprise
        bundle_identifier: com.example.id
```

When defining the bundle identifier `com.example.id`, Codemagic will fetch any uploaded certificates and profiles matching the extensions as well (e.g., `com.example.id.NotificationService`).

#### Fetching specific files by reference names

For a more advanced configuration, it is possible to pick out specific uploaded profiles and certificates for Codemagic to fetch during the build. To do so, list the references of the uploaded files under the `provisioning_profiles` and `certificates` fields, respectively.

```yaml
environment:
    ios_signing:
        provisioning_profiles:
            - profile_reference
            - ...
        certificates:
            - certificate_reference
            - ...
```

By default, Codemagic saves the files to the following locations on the builder machine:
- Profiles: `"~/Library/MobileDevice/Provisioning Profiles"`
- Certificates: `"~/Library/MobileDevice/Certificates"`

It is also possible to include names for environment variables that will point to the file paths on the builder machine.

```yaml
environment:
    ios_signing:
        provisioning_profiles:
            - profile: profile_reference
              environment_variable: THIS_PROFILE_PATH_ON_DISK
            - ...
        certificates:
            - certificate: certificate_reference
              environment_variable: THIS_CERTIFICATE_PATH_ON_DISK
            - ...
```

### Android keystores

To tell Codemagic to fetch the uploaded keystores from the **Code signing identities** section during the build, list the reference of the uploaded keystore under the `android_signing` field.

#### Fetching a single keystore file

```yaml
environment:
    android_signing:
        - keystore_reference
```

Default environment variables are assigned by Codemagic for the values on the builder machine:
- Keystore path: `CM_KEYSTORE_PATH`
- Keystore password: `CM_KEYSTORE_PASSWORD`
- Key alias: `CM_KEY_ALIAS`
- Key alias password: `CM_KEY_PASSWORD`

#### Fetching multiple keystore files

When fetching multiple keystores during a build, it is necessary to include names for environment variables that will point to the file paths on the builder machine.

```yaml
environment:
    android_signing:
        - keystore: keystore_reference_1
          keystore_environment_variable: THIS_KEYSTORE_PATH_ON_DISK_1
          keystore_password_environment_variable: THIS_KEYSTORE_PASSWORD_1
          key_alias_environment_variable: THIS_KEY_ALIAS_1
          key_password_environment_variable: THIS_KEY_PASSWORD_1
        - keystore: keystore_reference_2
          keystore_environment_variable: THIS_KEYSTORE_PATH_ON_DISK_2
          keystore_password_environment_variable: THIS_KEYSTORE_PASSWORD_2
          key_alias_environment_variable: THIS_KEY_ALIAS_2
          key_password_environment_variable: THIS_KEY_PASSWORD_2
```
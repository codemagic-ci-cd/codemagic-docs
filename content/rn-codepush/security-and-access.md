---
title: Security and access
description: Authentication and signing for OTA updates
meta_title: CodePush Security, Access Keys, and OTA Package Signing
meta_description: Secure CodePush OTA updates with access keys, authentication, signed bundles, key hygiene, and safe secrets handling in CI pipelines.
weight: 5
---

CodePush includes several security mechanisms to control who can publish updates and to ensure that apps only install trusted packages.

Security is handled in two main areas:

- authentication for developers and CI systems
- cryptographic signing of OTA update packages

These features help protect the update pipeline from unauthorized releases and tampered bundles.

---

## Authentication and access keys

Access to the CodePush server is controlled using **access keys**. These keys authenticate the CodePush CLI and any automation that publishes updates.

Access keys are typically used in two contexts:

- developer machines running the CLI
- CI systems that publish updates automatically

The CLI authenticates using an access key generated manually by the Codemagic team. Request access [here](https://codemagic.io/contact-sales/).

Example login:

{{< highlight bash "style=paraiso-dark">}}
code-push login "https://codepush.pro/" --access-key $ACCESS_TOKEN
{{< /highlight >}}

Once authenticated, the CLI can:

* Create and manage apps
* Manage deployments
* Publish updates
* Promote releases between deployments

Access keys can be used to authenticate the CLI in automated environments such as CI/CD pipelines. For example, by adding an authentication step in your CI pipeline, the CLI can log in using an access key and then execute subsequent commands automatically:

{{< highlight bash "style=paraiso-dark">}}
code-push login "https://codepush.pro" --accessKey $CODEPUSH_TOKEN
code-push release-react <app_name> <platform> --deploymentName Production --rollout 10
{{< /highlight >}}

In this setup:

* The CLI authenticates using the access key stored in $CODEPUSH_TOKEN
* All following CLI commands run in the authenticated context
* No manual login is required

This allows automated pipelines to publish updates without requiring an interactive login.

For configuring tokens in CI workflows, see [CI integration](/rn-codepush/ci-integration/). For initial setup and CLI authentication, see [Setup](/rn-codepush/setup/).

## Signing OTA updates

In addition to server authentication, CodePush supports **cryptographic signing of update packages**.

Signing allows the mobile app to verify that an update was created by a trusted source before installing it.

This protects against scenarios where a malicious server or network attack attempts to deliver a modified update.

The signing process involves three components:

- an RSA key pair
- signed update packages
- a public key embedded in the mobile app

### How signing works

The signing process is based on an RSA key pair and involves three components:

* An RSA key pair (private + public key)
* Signed update packages generated during release
* A public key embedded in the mobile app for verification

### Generate an RSA key pair

Before you can sign updates, you must generate an RSA key pair.

This produces:

* A private key used to sign update packages during the release process
* A public key embedded in the mobile application to verify updates at runtime

You can generate an RSA key pair using OpenSSL:

{{< highlight bash "style=paraiso-dark">}}
# Generate a private key
openssl genrsa -out codepush_private.key 2048

# Extract the public key from the private key
openssl rsa -in codepush_private.key -pubout -out codepush_public.key
{{< /highlight >}}

- The **private key** is kept securely on your build or CI system
  - Used to sign update packages during release
  - Must never be exposed or committed to source control
- The **public key** is embedded in the mobile app
  - Used to verify that updates were signed by a trusted source
  - Can be safely distributed with the application


### Sign update packages

Once the RSA key pair is generated, the next step is to configure your build and release process so updates are automatically signed and verified.

**1. Store the private key securely**

The private key should never be included in the mobile app or committed to source control.

Typical secure storage options:

* CI/CD secret variables (recommended)
* Secure file storage in build pipelines
* Dedicated secret managers (e.g., Vault, cloud secrets services)

**2. Embed the public key in the mobile app**

The public key must be bundled into the app so it can verify updates at runtime.

This is usually done by:

* Adding it to a configuration file
* Embedding it in native code (Android/iOS)
* Loading it during app initialization

Example:

{{< highlight bash "style=paraiso-dark">}}
const codePushConfig = {
  publicKey: "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
};
{{< /highlight >}}

**3. Signing updates during release**

When you release an update, the CLI uses the **private key** to generate a cryptographic signature for the update package.

{{< highlight bash "style=paraiso-dark">}}
code-push release-react MyApp-Android android \
  --privateKeyPath ./codepush_private.key
{{< /highlight >}}

This produces a signed update bundle that includes:

* JavaScript bundle
* Assets (if any)
* Signature generated using the private key

### Verification on the device

When the app downloads an update:

* The update package is received
* The app verifies the signature using the embedded **public key**
* If verification succeeds → update is installed
* If verification fails → update is rejected

## Security considerations

In production environments it is recommended to:

- restrict access keys to trusted developers and CI systems
- store CI tokens securely using secret management
- rotate access keys periodically
- protect the private signing key
- enable update signing for sensitive applications

These practices help ensure that only authorized updates are delivered to users.

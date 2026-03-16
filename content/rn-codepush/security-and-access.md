---
title: Security and access
description: Authentication and signing for OTA updates
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

The CLI authenticates using an access key generated in the Codemagic UI.

Example login:

```
code-push login
```

When prompted, paste the access key provided by Codemagic.

Once authenticated, the CLI can:

- create apps
- manage deployments
- publish updates
- promote releases

Access keys can also be used directly in CI environments.

Example:

```
code-push login --accessKey $CODEPUSH_TOKEN
```

This allows automated pipelines to publish updates without manual login.

For configuring tokens in CI workflows, see [CI integration](/rn-codepush/ci-integration/). For initial setup and CLI authentication, see [Setup](/rn-codepush/setup/).

### Session management

CodePush allows multiple authenticated sessions.

You can list active sessions:

```
code-push session list
```

If a key or session is compromised, it can be revoked:

```
code-push session remove <session-id>
```

Revoking a session immediately prevents further access from that environment.

## Signing OTA updates

In addition to server authentication, CodePush supports **cryptographic signing of update packages**.

Signing allows the mobile app to verify that an update was created by a trusted source before installing it.

This protects against scenarios where a malicious server or network attack attempts to deliver a modified update.

The signing process involves three components:

- an RSA key pair
- signed update packages
- a public key embedded in the mobile app

### Generate an RSA key pair

A signing key pair must first be created.

The **private key** is used to sign update packages during release.

The **public key** is embedded in the mobile application and used to verify updates.

Only systems with the private key can create valid update packages.

### Sign update packages

When signing is enabled, the release process signs each update package using the private key.

The signature is included in the update package and uploaded to the server alongside the bundle contents.

During installation, the app verifies that the package signature matches the embedded public key.

If the verification fails, the update is rejected.

### Embed the public key in the app

The public key must be included in the mobile app so the client can verify update packages.

This is typically configured when initializing the CodePush SDK.

The app will only accept update packages that match the embedded key.

### Client-side verification

When the app downloads an update:

```
download update package
→ verify signature using public key
→ install update if verification succeeds
```

If verification fails, the update is discarded.

This ensures that even if the update server is compromised, the client will refuse to install unsigned or tampered bundles.

## Security considerations

In production environments it is recommended to:

- restrict access keys to trusted developers and CI systems
- store CI tokens securely using secret management
- rotate access keys periodically
- protect the private signing key
- enable update signing for sensitive applications

These practices help ensure that only authorized updates are delivered to users.

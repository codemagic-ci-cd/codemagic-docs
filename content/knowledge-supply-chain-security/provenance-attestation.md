---
description: How to sign your app binaries with Sigstore Cosign and verify them in the Rekor transparency log
title: Provenance attestation
weight: 1
---

Signing your build artifacts lets you, your users and auditors confirm that a binary was produced by your Codemagic pipeline and has not been changed since. This guide shows how to sign an iOS `.ipa` or Android `.aab` and `.apk` files with [Sigstore Cosign](https://docs.sigstore.dev/cosign/) during a Codemagic build, and how to look up the signature in a [Rekor](https://docs.sigstore.dev/logging/overview/) transparency log, either the public Rekor log or your own private, self-hosted instance.

The steps are:

1. Generate a Cosign key pair on your local machine.
2. Store the private key and its password in Codemagic as secret team-level environment variables.
3. Sign the binary in your workflow and save the signature bundle as a build artifact.
4. Verify the signature and check the entry in the public Rekor log or your private instance.

{{<notebox>}}
**Note:** Cosign signing does not replace the code signing required by Apple and Google. Your app still needs to be signed with your iOS distribution certificate and provisioning profile, or your Android keystore, before it can be installed or published to the stores. Cosign adds a separate signature on top of the finished binary, so you and your auditors can verify where it came from. See [Signing iOS apps](../yaml-code-signing/signing-ios) and [Signing Android apps](../yaml-code-signing/signing-android) for how to set up platform code signing.
{{</notebox>}}

## Generate a key pair

Install Cosign on your local machine and generate a key pair. You will be asked to set a password for the private key.

{{< highlight bash "style=paraiso-dark">}}
brew install cosign
cosign generate-key-pair
{{< /highlight >}}

This creates two files:

- `cosign.key`: the encrypted private key. Keep it secret and never commit it to your repository.
- `cosign.pub`: the public key. It is not secret. Commit it to your repository or publish it somewhere your users and auditors can fetch it to verify signatures.

Base64 encode the private key so it can be stored as a single-line environment variable. On macOS, this copies the result to your clipboard:

{{< highlight bash "style=paraiso-dark">}}
base64 -i cosign.key | pbcopy
{{< /highlight >}}

## Add the environment variables in Codemagic

Store the key and password as team-level variables in **Global variables and secrets**. This lets every app in your team sign with the same key, so you only have to manage and rotate it in one place.

1. In Codemagic, open **Team settings** and go to **Global variables and secrets**.
2. Create a variable group named, e.g. **_cosign_credentials_**.
3. Add a variable named `COSIGN_KEY_B64` and paste the base64 encoded private key as the value. Mark it as **Secret**.
4. Add a variable named `COSIGN_PASSWORD` with the password you set for the key. Mark it as **Secret**.
5. In the variable group settings, choose which applications can access the group. Select only the apps that should sign builds, or **All applications** to give all present and future apps access.

Variables marked **Secret** are encrypted and hidden in the Codemagic UI and build logs. They are only made available to the build machine while the build is running. Cosign reads `COSIGN_PASSWORD` automatically, so you don't need to pass it to any command.

To learn more, see [Global variables and secrets](../yaml-basic-configuration/configuring-environment-variables#global-variables-and-secrets).

{{<notebox>}}
**Note:** If only one app needs to sign builds, you can add the same variables and group in the app's own **Environment variables** tab instead. The workflow configuration below is the same either way.
{{</notebox>}}

## Sign the binary in your workflow

Import the variable group in your workflow, then add a script step after the step that builds your app. The step decodes the private key, signs the binary and writes a Sigstore bundle next to it. Add both files to `artifacts` so they are available after the build.

{{< tabpane >}}

{{< tab header="iOS" >}}
{{<markdown>}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  ios-workflow:
    name: iOS Workflow
    environment:
      groups:
        - cosign_credentials
    scripts:
      # ... your build steps that produce build/ios/ipa/*.ipa
      - name: Install cosign
        script: |
          brew install cosign
      - name: Sign IPA with cosign
        script: |
          export COSIGN_PRIVATE_KEY=$(echo "$COSIGN_KEY_B64" | base64 --decode)
          IPA=$(find build/ios/ipa -name "*.ipa" | head -1)
          cosign sign-blob --yes \
            --key env://COSIGN_PRIVATE_KEY \
            --bundle "$IPA.sigstore.json" \
            "$IPA"
    artifacts:
      - build/ios/ipa/*.ipa
      - build/ios/ipa/*.sigstore.json
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="Android" >}}
{{<markdown>}}
Android builds often produce more than one file, for example an `.aab` and one or more `.apk` files, so the script signs each of them. The example uses the Flutter output path `build/app/outputs`. For native Android and React Native apps, use `android/app/build/outputs` instead.

The example installs Cosign from its GitHub releases, which works on Linux machines. On macOS machines, you can use `brew install cosign` instead.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-workflow:
    name: Android Workflow
    environment:
      groups:
        - cosign_credentials
    scripts:
      # ... your build steps that produce .aab and .apk files
      - name: Install cosign
        script: |
          curl -sSfL -o cosign https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64
          chmod +x cosign
          sudo mv cosign /usr/local/bin/cosign
      - name: Sign AAB and APK files with cosign
        script: |
          export COSIGN_PRIVATE_KEY=$(echo "$COSIGN_KEY_B64" | base64 --decode)
          find build/app/outputs -name "*.aab" -o -name "*.apk" | while read -r FILE; do
            cosign sign-blob --yes \
              --key env://COSIGN_PRIVATE_KEY \
              --bundle "$FILE.sigstore.json" \
              "$FILE"
          done
    artifacts:
      - build/app/outputs/**/*.aab
      - build/app/outputs/**/*.apk
      - build/app/outputs/**/*.sigstore.json
{{< /highlight >}}

{{<notebox>}}
**Note:** If you use Google Play App Signing, Google Play generates and re-signs the APKs that users install from your `.aab`. Those APKs have different hashes from the files you signed, so the Cosign signature proves which `.aab` your pipeline produced, but it can't be used to verify an APK installed from Google Play. APKs you distribute outside Google Play can be verified as described below.
{{</notebox>}}
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}

The `--yes` flag skips the interactive confirmation, and `--key env://COSIGN_PRIVATE_KEY` tells Cosign to read the key from the environment variable instead of a file, so the decoded key is never written to disk.

Cosign uploads a record of the signature to the public Rekor transparency log by default. The `.sigstore.json` bundle contains the signature together with proof that it was recorded in the log, so it can be verified later without querying the log.

{{<notebox>}}
**Note:** Anyone can read the public Rekor log. Each entry includes the SHA-256 hash of your binary, the signature and your public key. The binary itself is never uploaded.
{{</notebox>}}

### Using a self-hosted Rekor log

If you don't want your entries in the public log, you can run your own Rekor instance, as Rekor is open source. Entries in a private log are only visible to people who can access your instance.

To use it, you need two files that describe your instance. Create them with `cosign signing-config create` and `cosign trusted-root create`, and commit them to your repository. See `cosign signing-config create --help` and `cosign trusted-root create --help` for the options.

- `signing-config.json` tells Cosign where to upload the signature. Pass it when signing by adding `--signing-config signing-config.json` to the `cosign sign-blob` command.
- `trusted_root.json` contains your Rekor instance's public key. Pass it when verifying by adding `--trusted-root trusted_root.json` to the `cosign verify-blob` command.

## Verify the signature

Download the binary and its `.sigstore.json` bundle from the build page and run the following command. For Android, replace `app.ipa` with your `.aab` or `.apk` file.

{{< highlight bash "style=paraiso-dark">}}
cosign verify-blob \
  --key cosign.pub \
  --bundle app.ipa.sigstore.json \
  app.ipa
{{< /highlight >}}

Cosign prints `Verified OK` if the file matches the signature, was signed with the private key that belongs to `cosign.pub`, and the signature was recorded in the transparency log. Any change to the file makes the verification fail.

If you use a self-hosted Rekor log, add `--trusted-root trusted_root.json` to the command. Without it, Cosign expects the entry to be in the public Rekor log, so verification fails.

## Check the hash in Rekor

You can also look up the signature's entry in the transparency log yourself. The quickest way is to search by the hash of the binary.

1. Calculate the SHA-256 hash of the file:

{{< highlight bash "style=paraiso-dark">}}
shasum -a 256 app.ipa
{{< /highlight >}}

2. If using the public Rekor log, open [search.sigstore.dev](https://search.sigstore.dev/), select **Hash** as the search attribute and paste the hash. If you have a self-hosted Rekor log, search your own log instead, for example with `rekor-cli search --rekor_server https://rekor.example.com --sha <hash>`.
3. Open the matching entry to see when it was logged and which public key signed it. Compare the public key with your `cosign.pub`.

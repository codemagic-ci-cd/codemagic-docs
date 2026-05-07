---
title: AppDome integration
description: How to integrate your workflows with AppDome using codemagic.yaml
weight: 1
---



[Appdome](https://www.appdome.com/) is a no-code mobile app security platform used by enterprise banking, fintech, and government teams to harden Android and iOS apps post-build — injecting RASP, obfuscation, certificate pinning, root/jailbreak detection, anti-tampering, and dozens of other defences without touching source code. You upload a finished APK, AAB, or IPA; Appdome returns a hardened, signed binary along with a tamper-proof Certified Secure™ audit certificate.
 
This guide shows how to integrate Appdome as a post-build step in Codemagic using [Appdome's official Python client library](https://github.com/Appdome/appdome-api-python). The full pipeline looks like this:
 
{{< highlight python "style=paraiso-dark">}}
Build app  →  Install Appdome client  →  Fuse (harden)  →  Sign  →  Download  →  Publish
{{< /highlight >}}

{{< spacer >}}

---
 
## Prerequisites
 
| **Requirement** | **Notes** |
|---|---|
| Appdome account (IDEAL DEV tier) | Must have DEV-API access enabled — verify with `support@appdome.com` |
| Appdome API token | Found under **Account & API** in the Appdome platform sidebar |
| Fusion Set ID | A *shared* (non-playground) Fusion Set configured with your required defences |
| Team ID *(optional)* | Required when working in a Team workspace — found under **Team Management** |
| Python 3.6+ | Pre-installed on all Codemagic macOS and Linux instances |
| Android keystore | Added via **Codemagic UI → Code signing identities → Android keystores** |
| iOS distribution certificate | Added via **Codemagic UI → Code signing identities → iOS certificates** |
| iOS provisioning profile | Added via **Codemagic UI → Code signing identities → iOS provisioning profiles** |

{{< spacer >}}

{{<notebox>}}
**What is a Fusion Set?** A Fusion Set is a saved template of all the security features you want Appdome to inject — code obfuscation, root/jailbreak detection, MitM prevention, and so on. You configure it once in the Appdome UI and reference its ID in every CI run. Lock the set after configuration to prevent accidental changes. The ID must come from a *shared* Fusion Set, not a personal playground set — the API will return an error if you provide a playground ID.

{{</notebox>}}

---
 
## Step 1 — Store credentials as Codemagic environment variables
 
Create an environment variable group named `appdome_credentials` in the Codemagic UI under **Teams → Environment variable groups**. Code signing assets are handled separately by Codemagic's native signing integrations and do not belong here.
 
| **Variable name** | **Value** |
|---|---|
| `APPDOME_API_TOKEN` | Your Appdome API token |
| `APPDOME_FUSION_SET_ID` | The ID of your Android Fusion Set |
| `APPDOME_FUSION_SET_ID_IOS` | The ID of your iOS Fusion Set |
| `APPDOME_TEAM_ID` | Your Appdome Team ID (omit or leave blank for a personal account) |
| `IOS_P12_PASSWORD` | Password for your iOS distribution certificate |
 
 {{< spacer >}}

{{<notebox>}} **Why is `IOS_P12_PASSWORD` here and not managed by Codemagic?** Codemagic uses the certificate password internally when installing to the system keychain for Xcode signing. Appdome reads the raw `.p12` file directly and needs the password supplied explicitly. Everything else — the certificate file itself, the provisioning profile — is fetched and placed on disk by Codemagic's native `ios_signing` integration.

{{</notebox>}}

---

## Step 2 — Add signing assets via the Codemagic UI

{{< tabpane >}}
{{< tab header="Android" >}}
{{<markdown>}}

#### Android keystore
1. Go to **Team settings → codemagic.yaml settings → Code signing identities → Android keystores**.
2. Upload your `.jks` or `.keystore` file and give it a **Reference name** (e.g. `production_keystore`).
3. Codemagic will automatically populate `CM_KEYSTORE_PATH`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, and `CM_KEY_PASSWORD` at build time when this keystore is referenced in the workflow.

{{</markdown>}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{<markdown>}}
 

#### iOS certificate
 
1. Go to **Team settings → codemagic.yaml settings → Code signing identities → iOS certificates**.
2. Upload your distribution `.p12` file or generate/fetch one using your App Store Connect API key.
3. Give it a **Reference name** (e.g. `distribution_cert`).

#### iOS provisioning profile
 
1. Go to **Team settings → codemagic.yaml settings → Code signing identities → iOS provisioning profiles**.
2. Upload a `.mobileprovision` file or fetch one from the Apple Developer Portal using your App Store Connect API key.
3. Give it a **Reference name** (e.g. `distribution_profile`).
For apps with extensions (Share Extension, Notification Service, etc.), upload a separate profile for each target and give each its own reference name.
 
{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}

---
 
## Step 3 — create `codemagic.yaml`

{{< tabpane >}}
{{< tab header="Android" >}}

{{< highlight yaml "style=paraiso-dark">}}
 
  # ─────────────────────────────────────────────────────────────────────────────
  # Android: build → Appdome harden & sign → publish to Google Play
  # ─────────────────────────────────────────────────────────────────────────────

workflows:
  android-appdome-release:
    name: Android — Appdome Release
    max_build_duration: 90
    instance_type: mac_mini_m2   # or linux_x2
 
    environment:
      groups:
        - appdome_credentials    # APPDOME_API_TOKEN, APPDOME_FUSION_SET_ID, APPDOME_TEAM_ID
      android_signing:
        - production_keystore    # reference name set in Codemagic UI
                                 # populates CM_KEYSTORE_PATH, CM_KEYSTORE_PASSWORD,
                                 # CM_KEY_ALIAS, CM_KEY_PASSWORD
      vars:
        APP_MODULE: app
        BUILD_FLAVOR: production
        APPDOME_CLIENT_VERSION: "1.5.0"   # pin to a specific release tag
      java: 17 # required by Gradle/AGP 8.x — not an Appdome dependency
 
    scripts:
      # ── 1. Set version from Git tag ──────────────────────────────────────────
      - name: Set version from tag
        script: | 
          TAG="${CM_TAG:-$(git describe --tags --abbrev=0)}"
          echo "VERSION_NAME=${TAG#release-}" >> "$CM_ENV"
          echo "VERSION_CODE=$BUILD_NUMBER"   >> "$CM_ENV"
 
      # ── 2. Build the release AAB ─────────────────────────────────────────────
      - name: Build release AAB
        script: | 
          ./gradlew ":${APP_MODULE}:bundle${BUILD_FLAVOR^}Release" \
            -PversionName="$VERSION_NAME" \
            -PversionCode="$VERSION_CODE"
 
      # ── 3. Install the Appdome Python client ─────────────────────────────────
      - name: Install Appdome client library
        script: | 
          pip3 install requests --quiet
          git clone --depth 1 --branch "$APPDOME_CLIENT_VERSION" \
            https://github.com/Appdome/appdome-api-python \
            "$CM_BUILD_DIR/appdome-client"
 
      # ── 4. Appdome: fuse → sign → download ───────────────────────────────────
      #
      #  Gradle writes the AAB to a predictable path inside the module's build
      #  directory. The hardened output is written directly to CM_BUILD_OUTPUT_DIR
      #  so it is immediately available as a build artifact without additional
      #  glob patterns.
      #
      #  CM_KEYSTORE_PATH, CM_KEYSTORE_PASSWORD, CM_KEY_ALIAS, and CM_KEY_PASSWORD
      #  are populated automatically by Codemagic from the android_signing block.
      #
      - name: Appdome — harden and sign
        script: | 
          AAB_INPUT="$CM_BUILD_DIR/$APP_MODULE/build/outputs/bundle/${BUILD_FLAVOR}Release/app-${BUILD_FLAVOR}-release.aab"

          python3 "$CM_BUILD_DIR/appdome-client/appdome-api-python/appdome_api.py" \
            --api_key            "$APPDOME_API_TOKEN"                              \
            --fusion_set_id      "$APPDOME_FUSION_SET_ID"                          \
            --team_id            "$APPDOME_TEAM_ID"                                \
            --app                "$AAB_INPUT"                                      \
            --sign_on_appdome                                                      \
            --keystore           "$CM_KEYSTORE_PATH"                               \
            --keystore_pass      "$CM_KEYSTORE_PASSWORD"                           \
            --keystore_alias     "$CM_KEY_ALIAS"                                   \
            --key_pass           "$CM_KEY_PASSWORD"                                \
            --output             "$CM_BUILD_OUTPUT_DIR/app-hardened.aab"           \
            --certificate_output "$CM_BUILD_OUTPUT_DIR/certified_secure.pdf"
 
    artifacts:
      - $CM_BUILD_OUTPUT_DIR/app-hardened.aab
      - $CM_BUILD_OUTPUT_DIR/certified_secure.pdf
 
    publishing:
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
        submit_as_draft: true
      email:
        recipients:
          - mobile-security@yourbank.com
        notify:
          success: true
          failure: true

{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}
{{< highlight yaml "style=paraiso-dark">}}
 
  # ─────────────────────────────────────────────────────────────────────────────
  # iOS: build → Appdome harden & sign → publish to TestFlight
  # ─────────────────────────────────────────────────────────────────────────────

workflows:  
  ios-appdome-release:
    name: iOS — Appdome Release
    max_build_duration: 120
    instance_type: mac_mini_m2
 
    environment:
      groups:
        - appdome_credentials    # APPDOME_API_TOKEN, APPDOME_FUSION_SET_ID_IOS,
                                 # APPDOME_TEAM_ID, IOS_P12_PASSWORD
      ios_signing:
        provisioning_profiles:
          - profile: distribution_profile    # reference name set in Codemagic UI
            environment_variable: PROVISIONING_PROFILE_PATH
        certificates:
          - certificate: distribution_cert   # reference name set in Codemagic UI
            environment_variable: CERTIFICATE_PATH
      vars:
        XCODE_WORKSPACE: YourApp.xcworkspace
        XCODE_SCHEME: YourApp
        APPDOME_CLIENT_VERSION: "1.5.0"
      xcode: latest
      cocoapods: default
 
    scripts:
      # ── 1. Set version from tag ──────────────────────────────────────────────
      - name: Set version from tag
        script: | 
          TAG="${CM_TAG:-$(git describe --tags --abbrev=0)}"
          agvtool new-marketing-version "${TAG#release-}"
          agvtool new-version -all "$BUILD_NUMBER"
 
      # ── 2. Install CocoaPods dependencies ────────────────────────────────────
      - name: Install CocoaPods
        script: pod install
 
      # ── 3. Build and export unsigned IPA ─────────────────────────────────────
      #
      #  Appdome handles re-signing, so the Xcode archive is built without
      #  code signing. The ios_signing block above places the certificate and
      #  profile on disk solely for the Appdome step — they are not used by
      #  Xcode here, and xcode-project use-profiles is not needed.
      #
      - name: Build unsigned IPA
        script: | 
          xcodebuild archive \
            -workspace "$XCODE_WORKSPACE" \
            -scheme     "$XCODE_SCHEME" \
            -configuration Release \
            -archivePath "$CM_BUILD_DIR/build/YourApp.xcarchive" \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO \
            CODE_SIGNING_ALLOWED=NO \
            DEVELOPMENT_TEAM="" \
            -destination "generic/platform=iOS"
 
          xcodebuild -exportArchive \
            -archivePath        "$CM_BUILD_DIR/build/YourApp.xcarchive" \
            -exportOptionsPlist ios/ExportOptions.plist \
            -exportPath         "$CM_BUILD_DIR/build/output/"
  
      # ── 4. Install the Appdome Python client ─────────────────────────────────
      - name: Install Appdome client library
        script: | 
          pip3 install requests --quiet
          git clone --depth 1 --branch "$APPDOME_CLIENT_VERSION" \
            https://github.com/Appdome/appdome-api-python \
            "$CM_BUILD_DIR/appdome-client"
 
      # ── 5. Appdome: fuse → sign → download ───────────────────────────────────
      #
      #  xcodebuild -exportArchive writes the IPA to the exportPath specified
      #  above. The hardened output is written directly to CM_BUILD_OUTPUT_DIR.
      #
      #  CERTIFICATE_PATH and PROVISIONING_PROFILE_PATH are populated by
      #  Codemagic from the ios_signing block. IOS_P12_PASSWORD is the only
      #  credential stored manually, as Codemagic does not expose the certificate
      #  password for use outside its own keychain.
      #
      - name: Appdome — harden and sign
        script: | 
          IPA_INPUT="$CM_BUILD_DIR/build/output/YourApp.ipa"

          python3 "$CM_BUILD_DIR/appdome-client/appdome-api-python/appdome_api.py"  \
            --api_key               "$APPDOME_API_TOKEN"                            \
            --fusion_set_id         "$APPDOME_FUSION_SET_ID_IOS"                    \
            --team_id               "$APPDOME_TEAM_ID"                              \
            --app                   "$IPA_INPUT"                                    \
            --sign_on_appdome                                                       \
            --keystore              "$CERTIFICATE_PATH"                             \
            --keystore_pass         "$IOS_P12_PASSWORD"                             \
            --provisioning_profiles "$PROVISIONING_PROFILE_PATH"                    \
            --output                "$CM_BUILD_OUTPUT_DIR/app-hardened.ipa"         \
            --certificate_output    "$CM_BUILD_OUTPUT_DIR/certified_secure.pdf"
 
    artifacts:
      - $CM_BUILD_OUTPUT_DIR/app-hardened.ipa
      - $CM_BUILD_OUTPUT_DIR/certified_secure.pdf
 
    publishing:
      app_store_connect:
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID
        submit_to_testflight: true
      email:
        recipients:
          - mobile-security@yourbank.com

{{< /highlight >}}
{{< /tab >}}
{{< /tabpane >}}

---

## Post-publish notifications

### Slack

Codemagic has a native Slack integration that automatically posts build status and artifact download links (valid 24 hours by default) to a channel when a build completes. Connect your workspace once under **Team integrations → Slack**, then add the channel to each workflow's `publishing` block:

{{< highlight yaml "style=paraiso-dark">}}
    publishing:
      google_play:       # or app_store_connect for iOS
        # ... store config

      slack:
        channel: '#mobile-security'
        notify_on_build_start: true
        notify:
          success: true
          failure: true
{{< /highlight >}}

The hardened binary and the Certified Secure™ PDF will appear as download links in the Slack message automatically, because they are declared in the workflow's `artifacts:` section.

### Custom webhooks and other destinations

For destinations other than Slack, or when you need a fully custom message format, use `$CM_ARTIFACT_LINKS` in a post-publish script. It is a JSON array available only after publishing completes, containing the name, type, download URL, MD5, version name, and bundle ID for every published artifact.

{{< highlight yaml "style=paraiso-dark">}}
    publishing:
      scripts:
        - name: Notify security team via webhook
          script: | 
            ARTIFACT_TYPE=".aab"   # or ".ipa" for iOS
            ARTIFACT_URL=$(echo $CM_ARTIFACT_LINKS | jq -r \
              '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .url')
            ARTIFACT_NAME=$(echo $CM_ARTIFACT_LINKS | jq -r \
              '.[] | select(.name | endswith("'"$ARTIFACT_TYPE"'")) | .name')

            curl -s -X POST "$SECURITY_WEBHOOK_URL" \
              -H "Content-Type: application/json" \
              -d "{ \"text\": \"Hardened build ready — v${CM_TAG}\",
                    \"attachments\": [{
                    \"text\": \"<${ARTIFACT_URL}|${ARTIFACT_NAME}>\",
                    \"color\": \"good\" }] }"
{{< /highlight >}}

{{< spacer >}}

---
 
## Signing modes
 
The Python client supports three signing modes. For most Codemagic workflows, `--sign_on_appdome` is the correct choice.
 
| **Flag** | **Mode** | **How it works** |
|---|---|---|
| <span style="display: inline-block; min-width: 180px;">`--sign_on_appdome`</span> |  Automatic | Your keystore is managed by Codemagic (`CM_KEYSTORE_PATH`). Credentials are passed to Appdome, which returns a signed, ready-to-install binary. |
| `--private_sign` | Private signing | Your signing key lives in an on-premises HSM or internal signing service and must never be transmitted to any external platform — including Codemagic. Appdome returns an unsigned hardened binary for you to sign within your own infrastructure. |
| `--auto_dev_sign` | Auto-DEV private | Same key-custody intent as private signing, but Appdome wraps a signing script in the output package which can be run locally against your key. |

If your workflow uses the `android_signing` block to store the keystore in Codemagic, use `--sign_on_appdome`. Combining `--private_sign` with `CM_KEYSTORE_PATH` adds no security benefit — the key is already held by a third party.
 
{{< spacer >}}
 
---
 
## Advanced options
 
### Apps with multiple targets (iOS)
 
Apps that include extensions — Share Extension, Notification Service Extension, and so on — require a separate provisioning profile for each target. Upload each profile in the Codemagic UI with its own reference name, assign a distinct environment variable to each, and list all paths on the `--provisioning_profiles` flag:
 
{{< highlight yaml "style=paraiso-dark">}}
      ios_signing:
        provisioning_profiles:
          - profile: main_app_profile
            environment_variable: PROFILE_MAIN
          - profile: share_ext_profile
            environment_variable: PROFILE_SHARE_EXT
          - profile: notification_ext_profile
            environment_variable: PROFILE_NOTIFICATION_EXT
        certificates:
          - certificate: distribution_cert
            environment_variable: CERTIFICATE_PATH
    
    # ....

    scripts:
      
      # ....

      - name: Appdome — harden and sign
        script: | 
          python3 "$CM_BUILD_DIR/appdome-client/appdome-api-python/appdome_api.py" \
                  --provisioning_profiles "$PROFILE_MAIN"             \
                                          "$PROFILE_SHARE_EXT"        \
                                          "$PROFILE_NOTIFICATION_EXT" \
  # ... other flags
{{< /highlight >}}
 



 
### Build overrides
 
Override individual Fusion Set parameters on a per-build basis — without editing the saved set — by passing a JSON file to `--build_overrides`. Useful for stamping the build version, environment name, or backend URL at CI time:
 
{{< highlight json >}}
// overrides/build_overrides.json
{
  "plugin_good_app_version": "2.4.1",
  "user_agent_value": "BankApp/2.4.1 (prod)"
}
{{< /highlight >}}
 
{{< highlight yaml "style=paraiso-dark">}}
- name: Appdome — harden with overrides
  script: | 
    AAB_INPUT="$CM_BUILD_DIR/$APP_MODULE/build/outputs/bundle/${BUILD_FLAVOR}Release/app-${BUILD_FLAVOR}-release.aab"

    python3 "$CM_BUILD_DIR/appdome-client/appdome-api-python/appdome_api.py" \
      --api_key         "$APPDOME_API_TOKEN"                        \
      --fusion_set_id   "$APPDOME_FUSION_SET_ID"                    \
      --team_id         "$APPDOME_TEAM_ID"                          \
      --app             "$AAB_INPUT"                                \
      --sign_on_appdome                                             \
      --keystore        "$CM_KEYSTORE_PATH"                         \
      --keystore_pass   "$CM_KEYSTORE_PASSWORD"                     \
      --keystore_alias  "$CM_KEY_ALIAS"                             \
      --key_pass        "$CM_KEY_PASSWORD"                          \
      --build_overrides overrides/build_overrides.json              \
      --output          "$CM_BUILD_OUTPUT_DIR/app-hardened.aab"     \
      --certificate_output "$CM_BUILD_OUTPUT_DIR/certified_secure.pdf"
{{< /highlight >}}
 
### Dynamic certificate pinning
 
When pinned certificates rotate independently of the Fusion Set, bundle them into a ZIP and pass it via `--cert_pinning_zip`. The ZIP must contain a `pinning.json` mapping file alongside the certificate files:
 
{{< highlight json >}}
// certs/pinning.json
{
  "api.yourbank.com":  "api_cert.pem",
  "auth.yourbank.com": "auth_cert.crt"
}
{{< /highlight >}}
 
{{< highlight yaml "style=paraiso-dark">}}
- name: Assemble the bundle — in a CI step or as part of your certificate rotation process
  script:
    zip -j certs/pinning_bundle.zip \
    certs/pinning.json \
    certs/api_cert.pem \
    certs/auth_cert.crt

- name: Appdome — harden with dynamic cert pinning
  script: | 
    AAB_INPUT="$CM_BUILD_DIR/$APP_MODULE/build/outputs/bundle/${BUILD_FLAVOR}Release/app-${BUILD_FLAVOR}-release.aab"

    python3 "$CM_BUILD_DIR/appdome-client/appdome-api-python/appdome_api.py" \
      --api_key          "$APPDOME_API_TOKEN"                        \
      --fusion_set_id    "$APPDOME_FUSION_SET_ID"                    \
      --team_id          "$APPDOME_TEAM_ID"                          \
      --app              "$AAB_INPUT"                                \
      --sign_on_appdome                                              \
      --keystore         "$CM_KEYSTORE_PATH"                         \
      --keystore_pass    "$CM_KEYSTORE_PASSWORD"                     \
      --keystore_alias   "$CM_KEY_ALIAS"                             \
      --key_pass         "$CM_KEY_PASSWORD"                          \
      --cert_pinning_zip certs/pinning_bundle.zip                    \
      --output           "$CM_BUILD_OUTPUT_DIR/app-hardened.aab"     \
      --certificate_output "$CM_BUILD_OUTPUT_DIR/certified_secure.pdf"
{{< /highlight >}}
 
### Deobfuscation mapping for crash reporting
 
If your Fusion Set includes code obfuscation, download the mapping bundle and forward it to your crash reporting provider. The Python client handles both in one command:
 
{{< highlight yaml "style=paraiso-dark">}}
# Firebase Crashlytics
- name: Appdome — harden, sign, and upload mapping to Firebase
  script: | 
   AAB_INPUT="$CM_BUILD_DIR/$APP_MODULE/build/outputs/bundle/${BUILD_FLAVOR}Release/app-${BUILD_FLAVOR}-release.aab"

    python3 "$CM_BUILD_DIR/appdome-client/appdome-api-python/appdome_api.py" \
      --api_key                     "$APPDOME_API_TOKEN"                        \
      --fusion_set_id               "$APPDOME_FUSION_SET_ID"                    \
      --team_id                     "$APPDOME_TEAM_ID"                          \
      --app                         "$AAB_INPUT"                                \
      --sign_on_appdome                                                         \
      --keystore                    "$CM_KEYSTORE_PATH"                         \
      --keystore_pass               "$CM_KEYSTORE_PASSWORD"                     \
      --keystore_alias              "$CM_KEY_ALIAS"                             \
      --key_pass                    "$CM_KEY_PASSWORD"                          \
      --output                      "$CM_BUILD_OUTPUT_DIR/app-hardened.aab"     \
      --certificate_output          "$CM_BUILD_OUTPUT_DIR/certified_secure.pdf" \
      --deobfuscation_script_output "$CM_BUILD_OUTPUT_DIR/deobfuscation.zip"    \
      --firebase_app_id             "$FIREBASE_APP_ID"
{{< /highlight >}}
 
Replace `--firebase_app_id "$FIREBASE_APP_ID"` with `--datadog_api_key "$DATADOG_API_KEY"` to forward the mapping to Datadog instead.
 
---
 
## Pinning the client version
 
Always pin `APPDOME_CLIENT_VERSION` to a specific release tag rather than pulling from `main`. This ensures deterministic builds and prevents unexpected behaviour if Appdome ships a breaking change.
 
{{< highlight yaml "style=paraiso-dark">}}
  vars:
    APPDOME_CLIENT_VERSION: "1.5.0"   # check github.com/Appdome/appdome-api-python/releases
{{< /highlight >}}
 
To upgrade, change the version string, test in a feature branch, then merge to your release workflow once verified.
 
---
 
## Troubleshooting
 
| **Symptom** | **Likely cause** | **Fix** |
|---|---|---|
| `401 Unauthorized` | Invalid or expired API token | Re-copy the token from **Account & API** in the Appdome platform |
| `Invalid fusion set ID` | Using a playground (non-shared) Fusion Set | In the Appdome UI, click **Copy** on any playground set to create a shared set, then use that ID |
| Fuse task ends in an `error` state | App framework incompatibility or unsupported entitlement | Check the error message printed by the client; contact `support@appdome.com` with the task ID |
| Sign task fails with a certificate error | Wrong alias, bad password, or profile/bundle ID mismatch | Verify that the provisioning profile's bundle ID matches the app and that `IOS_P12_PASSWORD` is correct |
| `CM_KEYSTORE_PATH` is empty | Keystore reference name in `android_signing` doesn't match the Codemagic UI | Confirm the reference name under **Code signing identities → Android keystores** matches exactly |
| `CERTIFICATE_PATH` or `PROVISIONING_PROFILE_PATH` is empty | Profile or certificate reference name in `ios_signing` doesn't match the Codemagic UI | Confirm the reference names under **Code signing identities** match exactly |
| AAB not found at expected path | Module name or flavor differs from the `vars` values | Check the actual Gradle output path in the build log and adjust `APP_MODULE` and `BUILD_FLAVOR` accordingly |
| `ModuleNotFoundError: No module named 'requests'` | `pip3 install requests` step was skipped or failed | Confirm the install step runs before the Appdome step and that `pip3` resolves to Python 3 |
| Git clone fails at build time | Outbound access to `github.com` is restricted | Contact your Codemagic organisation owner to review network settings, or vendor the library into your own repository |

---
 
## Further reading
 
- [Appdome Python client library — GitHub](https://github.com/Appdome/appdome-api-python)
- [Appdome DEV-API documentation](https://apis.appdome.com/docs/introduction)
- [Appdome Fusion Sets — getting started](https://apis.appdome.com/docs/getting-started)
- [Codemagic — Built-in environment variables](https://docs.codemagic.io/yaml-basic-configuration/environment-variables/)
- [Codemagic — Signing iOS apps](https://docs.codemagic.io/yaml-code-signing/signing-ios/)
- [Codemagic — Signing Android apps](https://docs.codemagic.io/yaml-code-signing/signing-android/)
- [Codemagic — Environment variable groups](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/)
- [Codemagic — Publishing to Google Play](https://docs.codemagic.io/yaml-publishing/google-play/)
- [Codemagic — Publishing to App Store Connect](https://docs.codemagic.io/yaml-publishing/app-store-connect/)
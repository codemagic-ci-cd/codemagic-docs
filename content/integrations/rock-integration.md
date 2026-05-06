---
title: Rock (formerly RNEF) integration
description: How to integrate your workflows with Rock using codemagic.yaml
weight: 20
---


Rock (formerly published as RNEF — React Native Enterprise Framework) is a modular CLI toolkit from [Callstack](https://www.callstack.com/) designed for enterprise React Native teams. Its headline feature for CI is a **remote build cache**: native artifacts (APK, AAB, APP, IPA) are fingerprinted, stored in S3-compatible storage, and automatically reused across machines and CI runs, skipping full native builds for commits that only touch JavaScript. Callstack reports cache hits of up to 96% of builds on large codebases.

Rock's default CI templates target GitHub Actions (the `callstackincubator/ios` and `callstackincubator/android` actions). On Codemagic, you install the Rock CLI via npm and invoke its commands directly in your `codemagic.yaml` scripts — no GitHub Actions wrapper required. The remote cache is pointed at AWS S3 or Cloudflare R2, both of which Codemagic can reach via encrypted environment variables.

This guide covers:

- [Configuring `rock.config.mjs` for S3 or R2](#step-1--configure-rockconfigmjs-for-s3)
- [Setting up signing assets and environment variables in Codemagic](#step-2--add-signing-assets-and-environment-variables-in-codemagic)
- [Workflows in codemagic.yaml](#step-3--create-codemagicyaml)
- [Code signing using Codemagic's built-in signing management](#step-2--add-signing-assets-and-environment-variables-in-codemagic)
- [Monorepo layout notes](#monorepo-layout)
- [Re.Pack and Brownfield packaging](#optional-repack-and-super-app-builds)


---

## Prerequisites

- A React Native project already configured with Rock. If you are migrating from Community CLI, follow the [migration guide](https://www.rockjs.dev/docs/getting-started/migrating-from-community-cli) to initialise `rock.config.mjs` before proceeding.
- An AWS S3 bucket (or Cloudflare R2 bucket) accessible with static credentials. For S3, the IAM user needs `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, and `s3:ListBucket` permissions on the target bucket.
- For Android release builds: a keystore file uploaded to Codemagic (see Step 2 below).
- For iOS device/distribution builds: an Apple Developer certificate and provisioning profile uploaded to Codemagic (see Step 2 below).

---

## How the Remote Cache Works

Rock computes a **fingerprint** of your native project using `@expo/fingerprint`. This hash captures everything that would require a native rebuild — native dependencies, `Podfile.lock`, build configuration, Gradle files, and so on. Pure JavaScript changes do not affect the fingerprint.

On each CI run, Rock:

1. Computes the current native fingerprint.
2. Looks for a cached artifact in your S3 bucket matching that fingerprint.
3. If found, downloads and uses it — skipping the native build entirely.
4. If not found, performs a full native build and uploads the resulting artifact to S3 for future use.

Only the first build after a native dependency change pays the full build-time cost. All subsequent runs on the same native state — including builds across branches and pull requests — reuse the cached artifact.

---

## Step 1 — Configure `rock.config.mjs` for S3

Rock's S3 provider is a separate package:

{{< highlight bash "style=paraiso-dark">}}
npm install @rock-js/provider-s3
{{< /highlight >}}

Open (or create) your `rock.config.mjs` and add the `remoteCacheProvider` field. Reference credentials from environment variables so they remain out of source control:

{{< highlight js "style=paraiso-dark">}}
// rock.config.mjs
import { platformIOS } from '@rock-js/platform-ios';
import { platformAndroid } from '@rock-js/platform-android';
import { pluginMetro } from '@rock-js/plugin-metro';
import { providerS3 } from '@rock-js/provider-s3';

export default {
  platforms: {
    ios: platformIOS(),
    android: platformAndroid(),
  },
  bundler: pluginMetro(),
  remoteCacheProvider: providerS3({
    bucket: process.env.ROCK_S3_BUCKET,
    region: process.env.ROCK_S3_REGION,
    accessKeyId: process.env.ROCK_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.ROCK_S3_SECRET_ACCESS_KEY,
  }),
};
{{< /highlight >}}

### Using Cloudflare R2 Instead of S3

R2 exposes an S3-compatible API. Add an `endpoint` option pointing to your R2 account and set `region` to `auto`:

{{< highlight js "style=paraiso-dark">}}
remoteCacheProvider: providerS3({
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  bucket: process.env.ROCK_S3_BUCKET,
  region: 'auto',
  accessKeyId: process.env.ROCK_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.ROCK_S3_SECRET_ACCESS_KEY,
}),
{{< /highlight >}}

---

## Step 2 — Add Signing Assets and Environment Variables in Codemagic

### Remote Cache Credentials

In the Codemagic UI, navigate to **Teams → your team → Global variables and secrets** (or per-application under **App settings → Environment variables**). Create a group called `rock_s3_cache` and add the following variables, marking each as **Secret**:

| **Variable** | **Description** |
|---|---|
| `ROCK_S3_BUCKET` | S3 or R2 bucket name |
| `ROCK_S3_REGION` | AWS region (e.g. `eu-west-1`; use `auto` for R2) |
| `ROCK_S3_ACCESS_KEY_ID` | IAM or R2 access key ID |
| `ROCK_S3_SECRET_ACCESS_KEY` | IAM or R2 secret access key |
| `CF_ACCOUNT_ID` | Cloudflare account ID (R2 only) |

### Android Keystore

Upload your release keystore to Codemagic once and reference it by name in every workflow — no manual base64 encoding or decode steps required.

In the Codemagic UI, go to **Teams → your team → Code signing identities → Android keystores** and upload your `.jks` or `.keystore` file. Give it a reference name, for example `rock_release_keystore`. Codemagic will prompt for the store password, key alias, and key password at upload time and store them encrypted.

When the `android_signing` block references this keystore by name in `codemagic.yaml`, Codemagic automatically injects four environment variables at build time:

| Variable | Content |
|---|---|
| `CM_KEYSTORE_PATH` | Absolute path to the keystore file on the build machine |
| `CM_KEYSTORE_PASSWORD` | Keystore store password |
| `CM_KEY_ALIAS` | Key alias |
| `CM_KEY_PASSWORD` | Key password |

### iOS Certificate and Provisioning Profile

In the Codemagic UI, go to **Teams → your team → Code signing identities → iOS certificates** and upload your `.p12` distribution certificate. Give it a reference name, for example `distribution_cert`. Then go to **iOS provisioning profiles** and upload your `.mobileprovision` file with a reference name such as `distribution_profile`.

When the `ios_signing` block references these by name in `codemagic.yaml`, Codemagic places the files on the build machine, installs the certificate into a temporary keychain automatically, and exposes the file paths via whatever `environment_variable` names you specify in the YAML.

### App Store Connect API Key
In the Codemagic UI, go to **Teams → your team → Team integrations → Developer Portal** and click **Connect**. Upload your .p8 API key file and provide the associated Key ID and Issuer ID. Give the integration a name, for example `app_store_connect_key`.
Once connected, reference it in your workflow with the integrations: block — no API key environment variables are needed in the 

{{< highlight yaml "style=paraiso-dark">}}
  integrations:
    app_store_connect: app_store_connect_key
{{< /highlight >}}

This single reference covers both publishing to TestFlight/App Store and any Codemagic CLI tooling that needs to communicate with Apple's APIs (such as automatic build number incrementing).

---

## Step 3 — create codemagic.yaml

{{< tabpane >}}
{{< tab header="Android" >}}


The following workflow installs Rock, checks for a cached native artifact in S3, runs a full build only on a cache miss, and produces a signed AAB ready for Google Play.


{{< highlight yaml "style=paraiso-dark">}}
workflows:
  rock-android-release:
    name: Rock — Android Release
    max_build_duration: 60
    instance_type: linux_x2

    environment:
      groups:
        - rock_s3_cache        # ROCK_S3_BUCKET, ROCK_S3_REGION,
                               # ROCK_S3_ACCESS_KEY_ID, ROCK_S3_SECRET_ACCESS_KEY
      android_signing:
        - rock_release_keystore  # reference name set in Codemagic UI
                                 # injects: CM_KEYSTORE_PATH, CM_KEYSTORE_PASSWORD,
                                 #          CM_KEY_ALIAS, CM_KEY_PASSWORD
      vars:
        APP_MODULE: app
        BUILD_FLAVOR: ""         # leave empty if your project has no product flavors
      node: latest
      java: 17

    cache:
      cache_paths:
        - $HOME/.gradle/caches
        - $CM_BUILD_DIR/node_modules

    scripts:
      - name: Install Node dependencies
        script: npm ci

      - name: Install Rock CLI
        script: npm install -g @rock-js/cli

      # Rock checks the S3 cache before building. A cache hit skips Gradle
      # compilation entirely; a miss builds from source and uploads the artifact.
      # CM_KEYSTORE_PATH and related variables are injected automatically by
      # Codemagic from the android_signing block above.
      - name: Build Android (with remote cache)
        script: | 
          rock remote-cache download --platform android --variant release || true

          if rock remote-cache is-cached --platform android --variant release; then
            echo "Cache hit — skipping native build"
          else
            echo "No cache hit — building from source"
            rock build:android \
              --variant release \
              --aab \
              -P ROCK_UPLOAD_STORE_FILE="$CM_KEYSTORE_PATH" \
              -P ROCK_UPLOAD_STORE_PASSWORD="$CM_KEYSTORE_PASSWORD" \
              -P ROCK_UPLOAD_KEY_ALIAS="$CM_KEY_ALIAS" \
              -P ROCK_UPLOAD_KEY_PASSWORD="$CM_KEY_PASSWORD"

            rock remote-cache upload --platform android --variant release
          fi

    artifacts:
      - android/app/build/outputs/**/*.aab
      - android/app/build/outputs/**/*.apk

    publishing:
      google_play:
        credentials: $GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal
      email:
        recipients:
          - mobile@yourcompany.com
        notify:
          success: true
          failure: true
{{< /highlight >}}
{{< /tab >}}

{{< tab header="iOS" >}}


iOS builds must run on a macOS instance. The workflow below uses Codemagic's built-in signing management: the certificate is installed into a temporary keychain automatically and the paths to the certificate and provisioning profile are injected as environment variables — no manual `security import` or keychain setup required.



{{< highlight yaml "style=paraiso-dark">}}
workflows:
  rock-ios-release:
    name: Rock — iOS Release
    max_build_duration: 90
    instance_type: mac_mini_m2

    integrations:
      app_store_connect: app_store_connect_key # name given when connecting in Team UI
    environment:
      groups:
        - rock_s3_cache        # ROCK_S3_BUCKET, ROCK_S3_REGION,
                               # ROCK_S3_ACCESS_KEY_ID, ROCK_S3_SECRET_ACCESS_KEY
      ios_signing:
        provisioning_profiles:
          - profile: distribution_profile   # reference name set in Codemagic UI
            environment_variable: PROVISIONING_PROFILE_PATH
        certificates:
          - certificate: distribution_cert  # reference name set in Codemagic UI
            environment_variable: CERTIFICATE_PATH
      vars:
        XCODE_WORKSPACE: YourApp.xcworkspace
        XCODE_SCHEME: YourApp
        BUNDLE_ID: com.example.yourapp
      node: latest
      xcode: latest
      cocoapods: default

    cache:
      cache_paths:
        - $HOME/Library/Caches/CocoaPods
        - $CM_BUILD_DIR/node_modules

    scripts:
      - name: Install Node dependencies
        script: npm ci

      - name: Install Rock CLI
        script: npm install -g @rock-js/cli

      - name: Install CocoaPods dependencies
        script: cd ios && pod install

      # Rock checks the S3 cache before building. A cache hit skips Xcode
      # compilation entirely; a miss builds from source and uploads the artifact.
      # CERTIFICATE_PATH and PROVISIONING_PROFILE_PATH are injected automatically
      # by Codemagic from the ios_signing block above.
      - name: Build iOS (with remote cache)
        script: | 
          rock remote-cache download \
            --platform ios \
            --destination device \
            --configuration Release || true

          if rock remote-cache is-cached \
            --platform ios \
            --destination device \
            --configuration Release; then
            echo "Cache hit — skipping native build"
          else
            echo "No cache hit — building from source"
            rock build:ios \
              --destination device \
              --configuration Release \
              --extra-params "CODE_SIGN_IDENTITY='iPhone Distribution' \
                 PROVISIONING_PROFILE_SPECIFIER='$BUNDLE_ID'"

            rock remote-cache upload \
              --platform ios \
              --destination device \
              --configuration Release
          fi

    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM

    publishing:
      app_store_connect:
        # Use referenced App Store Connect API key to authenticate binary upload
        auth: integration 
        submit_to_testflight: true
      email:
        recipients:
          - mobile@yourcompany.com
        notify:
          success: true
          failure: true
{{< /highlight >}}

{{% /tab %}}
{{< /tabpane >}}


---

## Caching Behaviour and Cache Management

Rock stores each artifact under a key derived from the native fingerprint, platform, variant/configuration, and destination. The `.rock/` directory in your project root holds locally downloaded cache entries; you do not need to include this in Codemagic's `cache_paths` since remote artifacts are fetched fresh on every run.

Cache entries in S3 accumulate over time. If bucket size becomes a concern, apply an S3 lifecycle policy to expire objects older than 30–60 days. Because fingerprints are deterministic, expiring old entries only means the next CI run on that native state pays the full build cost once before re-populating the cache.

---

## Monorepo Layout

If your React Native app lives inside a monorepo sub-directory (e.g. `packages/mobile`), run all Rock commands from that directory:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Install dependencies
    script: cd packages/mobile && npm ci

  - name: Build Android
    script: | 
      cd packages/mobile
      rock remote-cache download --platform android --variant release || true
      rock build:android --variant release --aab
      rock remote-cache upload --platform android --variant release
{{< /highlight >}}

The `rock.config.mjs` file must live in the sub-package root alongside `package.json`, not at the repository root.

---

## Optional: Re.Pack and Super App Builds

Rock supports [Re.Pack](https://re.pack.dev/) as an alternative bundler, enabling Module Federation–based Super App and microfrontend architectures. To switch from Metro to Re.Pack:

{{< highlight bash "style=paraiso-dark">}}
npm install @rock-js/plugin-repack
{{< /highlight >}}

{{< highlight js "style=paraiso-dark">}}
// rock.config.mjs
import { pluginRepack } from '@rock-js/plugin-repack';

export default {
  // ...
  bundler: pluginRepack(),
};
{{< /highlight >}}

No changes to the `codemagic.yaml` build scripts are required — `rock build:android` and `rock build:ios` invoke Re.Pack automatically once the bundler plugin is configured.

---

## Optional: Brownfield — Packaging React Native as a Native Library

Rock can package your React Native app as a native library (`.xcframework` for iOS, `.aar` for Android) for embedding into an existing native host application, using the `@rock-js/plugin-brownfield-ios` and `@rock-js/plugin-brownfield-android` plugins.

Add the plugins to your config:

{{< highlight js "style=paraiso-dark">}}
import { pluginBrownfieldIos } from '@rock-js/plugin-brownfield-ios';
import { pluginBrownfieldAndroid } from '@rock-js/plugin-brownfield-android';

export default {
  plugins: [
    pluginBrownfieldIos(),
    pluginBrownfieldAndroid(),
  ],
  // ...
};
{{< /highlight >}}

Then add packaging steps to your Codemagic build:

{{< highlight yaml "style=paraiso-dark">}}
scripts:
  - name: Package React Native as iOS framework
    script: rock package:ios --configuration Release

  - name: Package React Native as Android AAR
    script: rock package:android --variant release
{{< /highlight >}}

Outputs are placed under `.rock/cache/ios/package/` (`.xcframework`) and `.rock/cache/android/package/` (`.aar`) respectively. Include these paths in your `artifacts:` block to make them available as Codemagic build artifacts.

---

## Environment Variable Reference

| **Variable** | **Set in** | **Required for** | **Description** |
|---|---|---|---|
| `ROCK_S3_BUCKET` | env group | Remote cache | S3 or R2 bucket name |
| `ROCK_S3_REGION` | env group | Remote cache | AWS region (`auto` for R2) |
| `ROCK_S3_ACCESS_KEY_ID` | env group | Remote cache | S3/R2 access key ID |
| `ROCK_S3_SECRET_ACCESS_KEY` | env group | Remote cache | S3/R2 secret key |
| `CF_ACCOUNT_ID` | env group | Remote cache (R2) | Cloudflare account ID |
| `CM_KEYSTORE_PATH` | auto (android_signing) | Android release | Path to keystore on build machine |
| `CM_KEYSTORE_PASSWORD` | auto (android_signing) | Android release | Keystore store password |
| `CM_KEY_ALIAS` | auto (android_signing) | Android release | Key alias |
| `CM_KEY_PASSWORD` | auto (android_signing) | Android release | Key password |
| `CERTIFICATE_PATH` | auto (ios_signing) | iOS release | Path to `.p12` on build machine |
| `PROVISIONING_PROFILE_PATH` | auto (ios_signing) | iOS release | Path to `.mobileprovision` |
| `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` | env group | Android publishing | Google Play service account JSON |

---

## Further Reading

- [Rock documentation](https://www.rockjs.dev/docs/introduction)
- [Rock configuration reference](https://www.rockjs.dev/docs/configuration)
- [S3 / R2 remote cache setup](https://www.rockjs.dev/docs/configuration#s3-provider)
- [Callstack blog: Caching React Native builds on S3 and R2 with Rock](https://www.callstack.com/blog/caching-react-native-builds-on-s3-and-r2)
- [Codemagic — Android code signing](https://docs.codemagic.io/yaml-code-signing/signing-android/)
- [Codemagic — iOS code signing](https://docs.codemagic.io/yaml-code-signing/signing-ios/)
- [Codemagic — Environment variable groups](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/)
- [Codemagic — Publishing to Google Play](https://docs.codemagic.io/yaml-publishing/google-play/)
- [Codemagic — Publishing to App Store Connect](https://docs.codemagic.io/yaml-publishing/app-store-connect/)
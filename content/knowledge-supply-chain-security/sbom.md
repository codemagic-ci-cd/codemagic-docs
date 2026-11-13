---
description: How to generate a Software Bill of Materials (SBOM) for Flutter, iOS, Android and React Native apps in Codemagic
title: Software Bill of Materials (SBOM)
weight: 2
---

A Software Bill of Materials (SBOM) is a machine-readable list of the third-party packages your app is built from, with their versions and licences. You can use it to check your dependencies for known vulnerabilities, review licences, or hand it to customers and auditors who ask what your app contains.

This guide shows how to generate an SBOM during a Codemagic build for Swift, Kotlin, Flutter and React Native apps. Every example writes a [CycloneDX](https://cyclonedx.org/) JSON file named `sbom.cdx.json` and saves it as a build artifact, so you can download it from the build page.

The recommended tool depends on the type of app:

| App type | Tool | Reads dependencies from |
|---|---|---|
| Swift (Swift Package Manager) | [Syft](https://github.com/anchore/syft) | `Package.resolved` |
| Kotlin (Android) | [CycloneDX Gradle plugin](https://github.com/CycloneDX/cyclonedx-gradle-plugin) | Gradle's resolved dependencies |
| Flutter | Syft | `pubspec.lock` |
| React Native | Syft | `package-lock.json` |

Syft is an open source tool from Anchore that reads lockfiles and other package manifests. It doesn't resolve dependencies itself, so the lockfile it reads must be committed to your repository or created earlier in the build. Gradle doesn't write a lockfile by default, which is why Android apps use the CycloneDX Gradle plugin instead.

{{<notebox>}}
**Note:** The examples install Syft with Homebrew, which is available on Codemagic macOS machines. `HOMEBREW_NO_AUTO_UPDATE=1` skips Homebrew's self-update to save time. Homebrew always installs the latest version of Syft; see [Pin the tool versions](#pin-the-tool-versions) if you need reproducible SBOMs.
{{</notebox>}}

## Swift (Swift Package Manager)

For iOS apps that use Swift Package Manager, Syft reads `Package.resolved`. Xcode stores it at `MyApp.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved`.

Add the SBOM step after the step that builds your app, and add `sbom.cdx.json` to `artifacts`:

{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      # ... your other build steps
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa \
            --project "$XCODE_PROJECT" \
            --scheme "$XCODE_SCHEME" \
            --archive-flags "-clonedSourcePackagesDirPath $CM_BUILD_DIR/SourcePackages"
      - name: Generate SBOM
        script: |
          HOMEBREW_NO_AUTO_UPDATE=1 brew install syft
          syft dir:. --source-name "$XCODE_SCHEME" -o cyclonedx-json=sbom.cdx.json
    artifacts:
      - build/ios/ipa/*.ipa
      - sbom.cdx.json
{{< /highlight >}}

Each Swift package is listed with its version and package URL, for example `pkg:swift/github.com/SwiftyJSON/swiftyjson@5.0.2`. The `--source-name` option sets the name of the app in the SBOM. Without it, the app is listed as `.`.

Where you place the step depends on whether `Package.resolved` is committed:

- **If `Package.resolved` is committed**, Syft can read it at any point in the workflow, even before the build.
- **If it isn't committed**, Syft finds no packages until Xcode resolves them. Run the SBOM step after the build, as in the example above, so the SBOM matches the packages in the `.ipa`. Alternatively, resolve the packages explicitly before generating the SBOM:

{{< highlight bash "style=paraiso-dark">}}
xcodebuild -resolvePackageDependencies \
  -project "$XCODE_PROJECT" \
  -clonedSourcePackagesDirPath "$CM_BUILD_DIR/SourcePackages"
{{< /highlight >}}

Using the same `-clonedSourcePackagesDirPath` as the build lets both steps share the downloaded packages.

{{<notebox>}}
**Tip:** Commit `Package.resolved`. Without it, package versions can float within the ranges set in your project, for example "up to next major version", so two builds of the same commit can contain different versions. Adding `-disableAutomaticPackageResolution` to the build flags makes the build fail instead of using versions other than the committed ones.
{{</notebox>}}

- The SBOM entries for Swift packages don't include hashes, and Apple system frameworks are not listed.
- For a standalone Swift package without an Xcode project, run `swift package resolve` first and add `--exclude './.build/**'` to the Syft command.

## Kotlin (Android)

Syft only reads Gradle dependencies from `gradle.lockfile`, which Gradle doesn't create by default, so it finds almost nothing in a typical Android project. Use the CycloneDX Gradle plugin instead, which reads the dependencies Gradle resolves for your build.

The workflow below applies the plugin with a Gradle init script created during the build, so you don't need to change your project:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  android-sbom:
    name: Android SBOM
    environment:
      java: 21
    scripts:
      - name: Generate SBOM
        script: |
          #!/usr/bin/env bash
          set -euo pipefail

          # Adds the CycloneDX plugin for this run only; the project is not changed.
          INIT_SCRIPT="$(mktemp -d)/cyclonedx.init.gradle"
          cat > "$INIT_SCRIPT" <<'EOF'
          initscript {
              repositories { gradlePluginPortal() }
              dependencies { classpath "org.cyclonedx:cyclonedx-gradle-plugin:3.5.1" }
          }
          allprojects {
              if (path == ":app") {
                  apply plugin: org.cyclonedx.gradle.CyclonedxPlugin
                  tasks.named("cyclonedxDirectBom") {
                      includeConfigs = ["releaseRuntimeClasspath"]
                      jsonOutput = rootProject.file("sbom.cdx.json")
                  }
              }
          }
          EOF

          ./gradlew --init-script "$INIT_SCRIPT" :app:cyclonedxDirectBom -q
    artifacts:
      - sbom.cdx.json
{{< /highlight >}}

The SBOM lists the libraries in your release build, such as AndroidX, Jetpack Compose and the Kotlin standard library, with their licences and, for most of them, hashes. Debug-only libraries such as `ui-tooling`, test libraries and build tools are not included.

- `:app` is the app module. If your app module has a different name, change it in `path == ":app"` and in the Gradle command.
- `releaseRuntimeClasspath` is the set of libraries that ship in the release build.
- In an init script, the plugin has to be applied by its class name, `org.cyclonedx.gradle.CyclonedxPlugin`. Applying it by the plugin ID `org.cyclonedx.bom` doesn't work there.
- Android Gradle Plugin 9 requires Java 17 or later.
- On a fresh build machine, Gradle first downloads the Android Gradle Plugin and your dependencies. Running the step after your existing Android build avoids downloading them twice.

If you prefer to add the plugin to your project, add `id("org.cyclonedx.bom") version "3.5.1"` to the `plugins` block in `app/build.gradle.kts` and run `./gradlew :app:cyclonedxDirectBom` in your workflow instead.

## Flutter

Syft reads the Dart and Flutter packages from `pubspec.lock`. Commit `pubspec.lock` to your repository, as is normal for apps. Running `flutter pub get` first keeps it in sync with `pubspec.yaml`.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  flutter-sbom:
    name: Flutter SBOM
    scripts:
      - name: Generate SBOM
        script: |
          flutter pub get
          HOMEBREW_NO_AUTO_UPDATE=1 brew install syft
          syft dir:. \
            --exclude './build/**' \
            --exclude './android/**' \
            -o cyclonedx-json=sbom.cdx.json
    artifacts:
      - sbom.cdx.json
{{< /highlight >}}

The SBOM lists every package in `pubspec.lock`, an entry for the app itself, and file entries for `pubspec.lock` and `pubspec.yaml`.

- Excluding `android/` loses nothing useful. Without the exclusion, Syft only adds the Gradle wrapper jar, which is a build tool and not part of the app.
- Keep `ios/` included. If your project uses CocoaPods (`Podfile.lock`) or remote Swift packages, the native iOS libraries they bring in ship in your app, and Syft lists them.
- `pubspec.lock` contains the packages for every platform, for example both `url_launcher_android` and `url_launcher_ios`, so the list is not specific to iOS or Android.

{{<notebox>}}
**Note:** This SBOM covers the Dart and Flutter packages. It doesn't include the native Android libraries that plugins depend on, or the Flutter engine. See [Native dependencies in Flutter and React Native apps](#native-dependencies-in-flutter-and-react-native-apps) for how to include them.
{{</notebox>}}

## React Native

Syft reads the JavaScript dependencies from `package-lock.json`. Add the SBOM step after the step that installs your npm dependencies, and add `sbom.cdx.json` to `artifacts`:

{{< highlight yaml "style=paraiso-dark">}}
    scripts:
      - name: Install npm dependencies
        script: |
          npm ci
      - name: Generate SBOM
        script: |
          HOMEBREW_NO_AUTO_UPDATE=1 brew install syft
          syft dir:. \
            --exclude './node_modules/**' \
            --exclude './ios/**' \
            --exclude './android/**' \
            --exclude './vendor/**' \
            --exclude './Gemfile.lock' \
            --source-name MyApp \
            -o cyclonedx-json=sbom.cdx.json
      # ... your other build steps
    artifacts:
      - sbom.cdx.json
{{< /highlight >}}

The SBOM lists the production packages from `package-lock.json`, with their licences. Dev dependencies, such as Jest and ESLint, are excluded. Replace `MyApp` with the name of your app.

- Exclude `node_modules`. Otherwise Syft also reads the `package.json` of every installed package and lists them twice.
- Use `npm ci` rather than `npm install` in CI, so the installed packages match the committed `package-lock.json`.
- Syft should only read the lockfile of the package manager your build uses. If your repository also contains a lockfile from another package manager, for example a leftover `yarn.lock`, remove it or exclude it with `--exclude './yarn.lock'`.
- The `ios/`, `android/`, `vendor/` and `Gemfile.lock` exclusions keep the SBOM to JavaScript dependencies. To also list the native iOS libraries from `ios/Podfile.lock`, remove the `ios/` exclusion and run the step after `pod install`.

{{<notebox>}}
**Note:** npm has a built-in `npm sbom` command, but in our testing on a React Native project it listed far fewer production packages than `package-lock.json` contains, so we recommend Syft.
{{</notebox>}}

## Native dependencies in Flutter and React Native apps

The Flutter and React Native examples above list the Dart or JavaScript packages. A cross-platform app also ships native libraries: the iOS libraries that plugins and modules add through CocoaPods or Swift Package Manager, and the Android libraries they add through Gradle. If you need these in your SBOM too, you can cover them in one of two ways.

### Generate a separate SBOM for each part

Generate the native SBOMs in the platform directories with the same tools as for native apps:

- **iOS**: run Syft in the `ios/` directory after `pod install` or after the iOS build, so it can read `Podfile.lock` or `Package.resolved`, as described in [Swift (Swift Package Manager)](#swift-swift-package-manager).
- **Android**: run the CycloneDX Gradle plugin in the `android/` directory, as described in [Kotlin (Android)](#kotlin-android).

Together with the Dart or JavaScript SBOM, this gives you up to three files. Each one is simple to generate and is created by the workflow that builds that platform, so your iOS build can save the Dart or JavaScript SBOM and the iOS SBOM, and your Android build the Dart or JavaScript SBOM and the Android SBOM. This is the easiest approach and works well for most teams.

### Combine everything into one SBOM

If your customers or tools expect a single file per app, write a script that generates each part and then merges them into one CycloneDX document, for example with the [CycloneDX CLI](https://github.com/CycloneDX/cyclonedx-cli). The script has to keep the app as the single top-level component and remove packages that appear in more than one part.

This takes more work to set up and maintain. In Flutter projects, for example, iOS plugins are often added as local Swift packages that have no `Package.resolved` file, so Syft doesn't find them, and the script has to read them from the Swift package that Flutter generates in `ios/Flutter/ephemeral/` during `flutter pub get`.

## Going further

### CycloneDX and SPDX

CycloneDX and SPDX are the two standard SBOM formats. CycloneDX, from OWASP, focuses on security and is supported by most vulnerability scanners. SPDX, from the Linux Foundation, is an ISO standard (ISO/IEC 5962) that is often requested for licence compliance.

If you need SPDX, convert the CycloneDX file with Syft. Some details, such as hashes and custom properties, are lost in the conversion, so keep CycloneDX as your main format.

{{< highlight bash "style=paraiso-dark">}}
syft convert sbom.cdx.json -o spdx-json=sbom.spdx.json
{{< /highlight >}}

### Scan for vulnerabilities

You can scan the SBOM for known vulnerabilities with [Grype](https://github.com/anchore/grype), also from Anchore. The following step fails the build if any vulnerability of high or critical severity is found:

{{< highlight yaml "style=paraiso-dark">}}
      - name: Scan SBOM for vulnerabilities
        script: |
          HOMEBREW_NO_AUTO_UPDATE=1 brew install grype
          grype sbom:sbom.cdx.json --fail-on high
{{< /highlight >}}

### Pin the tool versions

Homebrew always installs the latest version of Syft, so the same commit can produce a slightly different SBOM over time. To pin a version, install Syft with its install script instead:

{{< highlight bash "style=paraiso-dark">}}
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin v1.57.0
{{< /highlight >}}

The CycloneDX Gradle plugin is already pinned by the version in the init script.

### View the SBOM

SBOM files are large JSON documents. To browse one, open it in [CycloneDX Sunshine](https://cyclonedx.github.io/Sunshine/), or upload it to [OWASP Dependency-Track](https://dependencytrack.org/) to track your dependencies and their vulnerabilities across builds.

### What Syft can read

Syft reads Dart (`pubspec.lock`), Swift (`Package.resolved`), CocoaPods (`Podfile.lock`), Gradle (`gradle.lockfile` only), Maven (`pom.xml` and jar files), JavaScript (npm, Yarn and pnpm lockfiles) and .NET projects. It doesn't read the contents of built `.ipa` or `.apk` files, so generate the SBOM from your source code and lockfiles as shown above.

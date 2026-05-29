---
title: Fan-out / fan-in builds
linkTitle: Fan-out / fan-in builds
description: Run parallel module builds across multiple VMs and assemble the results in a single host app build
draft: true
weight: 5
aliases:
  - /yaml-running-builds/fan-out-fan-in
keywords:
  - fan-out fan-in
  - parallel builds
  - distributed builds
  - monorepo CI/CD
  - super-app build
  - Nx Cloud DTE
  - Turborepo Codemagic
  - modular build pipeline
  - codemagic.yaml parallel workflows
  - Codemagic REST API orchestration
---


## Overview

Fan-out/fan-in is a build orchestration pattern where independent components are built in parallel (the fan-out), and a subsequent step waits for all of them to complete before proceeding (the fan-in). It is the natural shape of any modular build pipeline: compile the pieces independently, then assemble the whole.

The pattern is most common in super-app and monorepo architectures. A typical example: a host application is assembled from several independently-built miniapps or feature modules. Each module can be compiled on a separate machine simultaneously. The host app build only starts once every module artifact is available — and it fails fast if any module fails.

{{< mermaid >}}
flowchart TD
    trigger([Git push to main]) --> coordinator

    subgraph coordinator[Coordinator build]
        coord_step[Trigger module builds via REST API]
    end

    coordinator --> moduleA & moduleB & moduleC

    subgraph parallel[Parallel module builds]
        moduleA[Module A]
        moduleB[Module B]
        moduleC[Module C]
    end

    moduleA & moduleB & moduleC --> fanin{All succeeded?}

    fanin -->|Yes| host[Host app build\nassembles module artifacts]
    fanin -->|No| fail([Build failed])
{{< /mermaid >}}

Codemagic does not have a built-in DAG (directed acyclic graph) UI for declaring these dependencies. Instead, you implement fan-out/fan-in through one of the approaches described below. The right choice depends on your stack, your team's existing tooling, and how much orchestration complexity you are willing to own.

---

## Prerequisites

| **Item** | **Where to get it** |
|---|---|
| Codemagic account (Team plan or higher) | [Sign up for free](https://codemagic.io/signup) |
| Codemagic API token | **Account settings → API token** |
| App ID for your app | From the browser address bar (e.g. `https://codemagic.io/app/<APP_ID>/settings`) after selecting **Applications** → **Open app settings (cogwheel icon)** |
| Sufficient concurrencies | **Team Settings → Concurrencies** — you need enough concurrent slots for the main workflow plus parallel build branches |

{{< spacer >}}

{{<notebox>}}
 ⚠️ **Note:** If your team plan has 4 concurrencies and you fan out to 5 modules, the first 3 builds start immediately and the remaining 2 queue. Additional concurrencies can be added to your plan at any time.
{{</notebox>}}

---

## Approach 1: Coordinator workflow with REST API

This approach uses a dedicated `coordinator` workflow in `codemagic.yaml` that fans out to module workflows via the Codemagic REST API, polls each one until it finishes, collects artifact URLs, and triggers the host app build — all without any external tooling.

**Best for:** teams that want everything inside Codemagic with no external dependencies, or teams whose module builds span different platforms (Android, iOS, or both).

### How it works

1. A push to your main branch triggers the `coordinator` workflow.
2. The coordinator calls `POST /builds` for each module workflow simultaneously, capturing each returned `buildId`.
3. It polls `GET /builds/:buildId` at a regular interval until every module build reaches a terminal status (`finished`, `failed`, `canceled`, or `timeout`).
4. If all modules succeed, it extracts the artifact URL from each build's response and triggers the host app build via `POST /builds`, injecting the artifact URLs as environment variables.
5. If any module fails, the coordinator exits with a non-zero code, failing the coordinator build and blocking the host app.

### Instance type

The examples below use `mac_mini_m2` for module builds. Codemagic's Mac mini M2 machines run macOS and have the full Android SDK, Xcode, and all mobile toolchains pre-installed, making them suitable for any platform — Android, iOS, Flutter, or React Native — without reconfiguration. If you are building Android-only modules, you can substitute `linux_x2` for any workflow that does not require Xcode. The coordinator workflow itself does nothing except run a Python script, so it always uses `linux_x2`.

### Step 1: Define module workflows

Each module workflow is a standard build workflow. The only requirement is that its `id` — the key in `codemagic.yaml` — is stable, because the coordinator references it by name.

The three examples below illustrate common real-world variation between modules: a dedicated Android workflow, a dedicated iOS workflow, and a universal parameterised workflow that a single workflow definition can serve many different modules.

Workflow-level `when` parameters (such as `changeset` or `condition`) are bypassed by Codemagic when a build is initiated manually or programmatically via the REST API (POST /builds). To achieve change-aware builds when using an API coordinator, you must place the `when: changeset` filter directly inside individual build steps (scripts).

Under this configuration, the coordinator triggers all module workflows unconditionally. Each worker VM provisions, clones the repository, and checks the changeset rules at the specific step level. If no changes are detected within the tracked path, that build step is skipped. The worker workflow will then finish with a successful (finished) terminal state, but it will not produce an artifact. The coordinator script detects this absence of an artifact to deduce that a module was skipped.

Each workflow's `when: changeset` block watches its own directory. Module A watches `modules/module-a/**`, Module B watches `modules/module-b/**`, and so on. If any file in that path changed, the build runs. If nothing changed, it skips.

#### Module A — Android native (Kotlin)

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build-module-a:
    name: Build Module A (Android)
    instance_type: linux_x2
    environment:
      groups:
        - orchestration_credentials
      android_signing:
        - module_a_keystore   # reference name from Team Settings → Code signing identities
    scripts:
      - name: Build release AAR
        script: | 
          # Codemagic has already placed the keystore on disk and exported
          # CM_KEYSTORE_PATH, CM_KEYSTORE_PASSWORD, CM_KEY_ALIAS, CM_KEY_PASSWORD.
          # Gradle reads these via signingConfigs.release in build.gradle — no flags needed.
          ./gradlew :module-a:assembleRelease
        when:
          changeset:
            includes:
              - 'modules/module-a/**'
    artifacts:
      - modules/module-a/build/outputs/**/*.aar
{{< /highlight >}}


#### Module B — iOS native (Swift)

Module B is an iOS framework with a distinct signing configuration and an Xcode version requirement. Note the different instance configuration, signing setup, and artifact path.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build-module-b:
    name: Build Module B (iOS framework)
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: YOUR_API_KEY_NAME   # configured in Team Settings → Integrations
    environment:
      groups:
        - orchestration_credentials
      ios_signing:
        distribution_type: development
        bundle_identifier: io.codemagic.moduleB
      vars:
        XCODE_SCHEME: "ModuleB"
      xcode: latest
    
    scripts:
      - name: Set up code signing
        script: xcode-project use-profiles
    
      - name: Build XCFramework
        script: | 
          xcodebuild archive                          \
            -scheme "$XCODE_SCHEME"                   \
            -destination "generic/platform=iOS"       \
            -archivePath build/ModuleB-iOS.xcarchive  \
            SKIP_INSTALL=NO                           \
            BUILD_LIBRARY_FOR_DISTRIBUTION=YES
        
          xcodebuild -create-xcframework \
            -framework build/ModuleB-iOS.xcarchive/Products/Library/Frameworks/ModuleB.framework \
            -output build/ModuleB.xcframework
        when:
          changeset:
            includes:
              - 'modules/module-b/**'
    
    artifacts:
      - build/ModuleB.xcframework/**
{{< /highlight >}}


#### Module C — Universal parameterised workflow

For teams with many structurally identical modules, maintaining a separate workflow definition for each one is impractical. A single parameterised workflow accepts `MODULE_NAME` and `MODULE_PATH` as environment variables, which the coordinator injects at trigger time via the REST API. One workflow definition serves any number of modules.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  build-module-generic:
    name: Build Module (parameterised)
    instance_type: mac_mini_m2
    environment:
      groups:
        - orchestration_credentials
      android_signing:
        - module_keystore_reference
      vars:
        # These are overridden at trigger time by the coordinator script.
        # Defaults here allow manual test runs from the Codemagic UI.
        MODULE_NAME: "module-c"
        MODULE_PATH: "modules/module-c"
    scripts:
      - name: Build module
        script: | 
          echo "Building $MODULE_NAME from $MODULE_PATH"
          ./gradlew :${MODULE_NAME}:assembleRelease

          # Copy artifact to a fixed path so the artifacts glob below can find it
          mkdir -p build/module-output
          find "$MODULE_PATH/build/outputs" -name "*.aar" \
            -exec cp {} build/module-output/ \;
        when:
          changeset:
            includes:
              - 'modules/**'
    artifacts:
      - build/module-output/*.aar
{{< /highlight >}}

{{<notebox>}}
**Note:** The step-level `when: changeset` condition for the parameterised workflow watches the entire `modules/` directory since the specific path is only known at runtime. This means it will evaluate as changed if any module changes. For precise per-module changeset filtering, use dedicated workflows (as in Module A and Module B) rather than a parameterised one.
{{</notebox>}}


{{< spacer >}}

{{<notebox>}}
**Note:** When using a parameterised workflow, the coordinator passes `MODULE_NAME` and `MODULE_PATH` as `environment.variables` in each API call. The same `build-module-generic` workflow ID is reused for every generic module — each triggered build simply receives different variable values. See Step 2 for how this is handled in the coordinator script.
{{</notebox>}}

{{< spacer >}}

{{<notebox>}}
**Note:** The build scripts above are platform-specific examples. An Android module uses Gradle and produces an `.aar`; an iOS module uses `xcodebuild` and produces an `.xcframework` or `.framework`. Adjust the script and artifact glob to match your module's build system and output format.
{{</notebox>}}

### Step 2: Write the coordinator script

Save this as `ci/orchestrate.py` in your repository. Python 3 is pre-installed on all Codemagic instance types.

{{< highlight python "style=paraiso-dark">}}
#!/usr/bin/env python3
"""
Fan-out / fan-in coordinator for Codemagic.

Triggers module builds in parallel via the REST API, waits for all to
complete, collects artifact URLs, and triggers the host app build with
those URLs injected as environment variables.

Required environment variables:
  CM_API_TOKEN   - Codemagic API token (mark as Secret)
  CM_APP_ID      - Codemagic App ID for this repository
  CM_TEAM_ID     - Codemagic team ID
  CM_BRANCH      - Branch to build (set automatically by Codemagic)
"""

import os, sys, json, time, urllib.request, urllib.error

# --- CONFIGURATION ---
# Each entry is either:
#   - A plain workflow ID string (uses no extra variables), or
#   - A dict with 'workflow_id', 'env' (extra variables), and 'artifact_ext'
#     for workflows that require runtime parameters or produce different artifact types.
MODULE_BUILDS = [
    # Module A: dedicated Android workflow, no extra parameters needed
    {
        "workflow_id":    "build-module-a",
        "artifact_ext":   ".aar",
    },
    # Module B: dedicated iOS workflow, no extra parameters needed
    {
        "workflow_id":    "build-module-b",
        "artifact_ext":   ".xcframework",
    },
    # Module C: generic parameterised workflow — pass module identity at runtime
    {
        "workflow_id":    "build-module-generic",
        "artifact_ext":   ".aar",
        "env": {
            "MODULE_NAME": "module-c",
            "MODULE_PATH": "modules/module-c",
        },
    },
    # Add more modules here. For additional generic modules, duplicate the
    # last entry and change MODULE_NAME / MODULE_PATH. The same
    # build-module-generic workflow ID is reused each time.
]

HOST_WORKFLOW_ID  = "build-host-app"
POLL_INTERVAL     = 30       # seconds between status checks
TIMEOUT_SECONDS   = 7200     # 2 hours maximum wait
TERMINAL_STATUSES = {"finished", "failed", "canceled", "timeout", "skipped"}

API_BASE    = "https://api.codemagic.io"
API_V3_BASE = "https://codemagic.io/api/v3"

def get_env(name):
    value = os.environ.get(name)
    if not value:
        print(f"ERROR: Required environment variable '{name}' is not set.")
        sys.exit(1)
    return value

def api_request(method, url, data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["x-auth-token"] = token
    body = json.dumps(data).encode() if data else None
    req  = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} for {method} {url}: {e.read().decode()}")
        raise

def trigger_build(app_id, workflow_id, branch, token, extra_env=None):
    payload = {"appId": app_id, "workflowId": workflow_id, "branch": branch}
    if extra_env:
        payload["environment"] = {"variables": extra_env}
    result   = api_request("POST", f"{API_BASE}/builds", data=payload, token=token)
    build_id = result.get("buildId")
    if not build_id:
        print(f"ERROR: No buildId returned for {workflow_id}. Response: {result}")
        sys.exit(1)
    print(f"  Triggered {workflow_id} → {build_id}")
    return build_id

def get_build(build_id, token):
    url = f"{API_BASE}/builds/{build_id}"
    return api_request("GET", url, token=token) # Returns the single build dictionary directly

def wait_for_builds(build_ids, team_id, token):
    """Poll until all builds reach a terminal status. Abort on any failure."""
    pending = set(build_ids)
    results = {}
    elapsed = 0
    while pending:
        if elapsed >= TIMEOUT_SECONDS:
            print(f"ERROR: Timed out after {TIMEOUT_SECONDS}s. Still pending: {pending}")
            sys.exit(1)
        time.sleep(POLL_INTERVAL)
        elapsed += POLL_INTERVAL
        for bid in list(pending):
            build  = get_build(bid, team_id, token)
            status = build.get("status", "unknown")
            if status in TERMINAL_STATUSES:
                pending.discard(bid)
                results[bid] = build
                print(f"  Build {bid} → {status}")
                if status not in {"finished", "skipped"}:
                    print(f"ERROR: Build {bid} ended with '{status}'. Aborting.")
                    sys.exit(1)
        if pending:
            print(f"  Waiting ({elapsed}s elapsed, {len(pending)} build(s) still running)...")
    return results

def extract_artifact_url(build_result, ext):
    for artifact in build_result.get("artifacts", []):
        if artifact.get("name", "").endswith(ext):
            return artifact.get("short_lived_download_url")
    return None

def main():
    token   = get_env("CM_API_TOKEN")
    app_id  = get_env("CM_APP_ID")
    branch  = get_env("CM_BRANCH")
    team_id = get_env("CM_TEAM_ID")

    # FAN OUT: trigger all module builds simultaneously
    print(f"\n=== Fanning out to {len(MODULE_BUILDS)} module build(s) on '{branch}' ===")
    triggered = []  # list of (build_id, module_config)
    for module in MODULE_BUILDS:
        wf_id    = module["workflow_id"]
        extra    = module.get("env")
        build_id = trigger_build(app_id, wf_id, branch, token, extra_env=extra)
        triggered.append((build_id, module))

    # WAIT: poll until every module build is done
    print("\n=== Waiting for all module builds ===")
    build_id_map = {build_id: module for build_id, module in triggered}
    results      = wait_for_builds(list(build_id_map.keys()), team_id, token)

    # COLLECT artifacts — one URL per module, keyed by workflow ID.
    # If a step-level changeset condition was skipped, no artifact is generated.
    print("\n=== Collecting artifact URLs ===")
    artifact_env = {}
    for build_id, result in results.items():
        module = build_id_map[build_id]
        wf_id  = module["workflow_id"]
        
        ext = module.get("artifact_ext", ".aar")
        url = extract_artifact_url(result, ext)
        
        if not url:
            # Because the API build status returns "finished" even if internal steps skip,
            # a successful build without an artifact signals that the module had no source changes.
            print(f"  {wf_id} produced no {ext} artifact — assuming step skipped (no changes)")
            continue
            
        # Derive a clean env var name, e.g. "build-module-a" → "MODULE_A_ARTIFACT_URL"
        key = wf_id.upper().replace("-", "_").replace("BUILD_", "") + "_ARTIFACT_URL"
        artifact_env[key] = url
        print(f"  {key} = {url[:60]}...")

    # FAN IN: trigger host app build with all artifact URLs
    print(f"\n=== Fanning in: triggering {HOST_WORKFLOW_ID} ===")
    trigger_build(app_id, HOST_WORKFLOW_ID, branch, token, extra_env=artifact_env)
    print("\n=== Done. All module builds succeeded. Host build triggered. ===")

if __name__ == "__main__":
    main()
{{< /highlight >}}

### Step 3: Define coordinator and host app workflows

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  # --- COORDINATOR ---
  # Triggered by git push. Runs no builds itself — orchestrates everything via API.
  # Uses linux_x2 because it only runs a Python script; no mobile toolchain needed.
  coordinator:
    name: Coordinator (fan-out / fan-in)
    instance_type: linux_x2
    max_build_duration: 120   # Must exceed the longest expected full-run time
    environment:
      groups:
        - orchestration_credentials   # CM_API_TOKEN, CM_APP_ID, CM_TEAM_ID
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
          include: true
      cancel_previous_builds: true
    scripts:
      - name: Run fan-out / fan-in orchestration
        script: python3 ci/orchestrate.py

  # --- HOST APP ---
  # API-triggered only — no triggering block.
  # Receives module artifact URLs as environment variables from the coordinator.
  build-host-app:
    name: Build Host App
    instance_type: mac_mini_m2
    max_build_duration: 120
    environment:
      groups:
        - orchestration_credentials
      vars:
        # Defaults allow manual test runs; coordinator overrides these at runtime
        MODULE_A_ARTIFACT_URL: ""
        MODULE_B_ARTIFACT_URL: ""
        MODULE_GENERIC_ARTIFACT_URL: ""
    scripts:
      - name: Download module artifacts
        script: | 
          mkdir -p artifacts/modules
          for VAR in MODULE_A_ARTIFACT_URL MODULE_B_ARTIFACT_URL MODULE_GENERIC_ARTIFACT_URL; do
            URL="${!VAR}" 
            [ -z "$URL" ] && echo "WARNING: $VAR is empty, skipping" && continue
            FILENAME=$(basename "$URL" | cut -d'?' -f1)
            echo "Downloading $FILENAME..."
            curl -fsSL "$URL" -o "artifacts/modules/$FILENAME"
          done

      - name: Assemble host app
        script: | 
          ./gradlew :host-app:assembleRelease \
            -PmoduleAarDir=artifacts/modules

    artifacts:
      - host-app/build/outputs/**/*.aab
      - host-app/build/outputs/**/*.apk
{{< /highlight >}}

{{<notebox>}}
**Note:** The `short_lived_download_url` returned by the v3 API expires after a limited period. If your host app build may be delayed — for example, due to concurrency queuing — upload module artifacts to a stable external store (S3, Artifactory, or Nexus) in each module workflow and pass a stable URL or version identifier to the host build instead.
{{</notebox>}}

---

## Approach 2: Nx Cloud Distributed Task Execution

If your monorepo uses [Nx](https://nx.dev/), you can replace the coordinator script and manual polling entirely with [Nx Cloud's Distributed Task Execution (DTE)](https://nx.dev/docs/features/ci-features/distribute-task-execution). Nx Cloud acts as a task coordinator: it receives the full task graph from the main job, holds tasks in a server-side queue, and dispatches them to agent VMs as they come online — respecting dependency order automatically.

**Best for:** JS/TypeScript monorepos (React Native, hybrid apps, or mobile teams with Node-based tooling) that need change-aware builds — only building modules affected by a given commit — combined with cross-machine parallelism.

### How it works

1. A push triggers the `nx-coordinator` workflow. The coordinator immediately fans out to N agent workflows via the Codemagic REST API.
2. All VMs check out the repository and install dependencies in parallel.
3. Each agent VM calls `npx nx-cloud start-agent`, which registers it with Nx Cloud and enters a polling loop waiting for task assignments.
4. The coordinator VM calls `npx nx-cloud start-ci-run` and then `npx nx affected --target=build`. Nx sends the full task graph to Nx Cloud.
5. Nx Cloud dispatches tasks to agents greedily, respecting dependency order. An agent that connects after tasks have already started picks up whatever remains in the queue — late-arriving agents are fully supported.
6. When all tasks complete, Nx Cloud streams results and artifacts back to the coordinator VM, which calls `npx nx-cloud complete-ci-run`.

The coordinator VM never executes build tasks itself. It triggers the agents, submits the task graph, and blocks until Nx Cloud reports the run complete.

### Key properties of Nx Cloud task scheduling

**Tasks queue server-side.** The coordinator can call `start-ci-run` before any agent has connected. Tasks wait in the Nx Cloud queue until an agent claims them.

**Late agents receive remaining work.** If agent VMs have a slow cold start, they will pick up whichever tasks have not yet been claimed when they connect. Distribution improves progressively as agents come online.

**Dependency order is enforced automatically.** If module C depends on module B, Nx Cloud will not assign the module C build to any agent until module B's build is confirmed complete and its outputs are available in the remote cache.

**No hardcoded module list.** Unlike the REST API coordinator, Nx computes the affected project list from the commit diff at runtime. Add a new module to your repo and it is automatically included in the next affected run — no changes to `codemagic.yaml` required.

### Connecting agents to the correct run: NX_CI_EXECUTION_ID

Nx Cloud uses the `NX_CI_EXECUTION_ID` environment variable to group the coordinator and all agent VMs into a single CI pipeline execution. You must set it explicitly and pass it to every agent workflow you trigger via the REST API.

Use `CM_BUILD_ID` (Codemagic's unique identifier for the current build) as the execution ID. It is guaranteed unique per run and available automatically as a built-in environment variable.

### Step 1: Install Nx and connect to Nx Cloud

Nx and `nx-cloud` are npm packages. Add them as dev dependencies — they install as part of your normal `npm ci` step. No system-level installation is required.

{{< highlight json "style=paraiso-dark">}}
// package.json (root of your monorepo)
{
  "devDependencies": {
    "nx": "^20.0.0",
    "nx-cloud": "latest"
  }
}
{{< /highlight >}}

Connect your workspace to Nx Cloud by running `npx nx connect` locally and following the prompts. This writes your `NX_CLOUD_ACCESS_TOKEN` into `nx.json`. Store the token as a secret environment variable in Codemagic rather than committing it to source control.

### Step 2: Define all workflows in codemagic.yaml

The coordinator triggers agent builds with three `curl` calls directly in a script step — no external script file needed. Each call passes `NX_CI_EXECUTION_ID` (set to `CM_BUILD_ID`) so Nx Cloud can group all VMs into the same run. After triggering the agents the coordinator runs the Nx commands, which submit the task graph to Nx Cloud and block until all tasks complete.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  # --- COORDINATOR ---
  # Triggered by git push. Starts agent VMs via the REST API, then submits
  # the task graph to Nx Cloud. Does not execute any build tasks itself.
  # Uses linux_x2 — no mobile toolchain needed for orchestration.
  nx-coordinator:
    name: Nx Cloud Coordinator
    instance_type: linux_x2
    max_build_duration: 120
    environment:
      groups:
        - orchestration_credentials   # CM_API_TOKEN, CM_APP_ID
        - nx_cloud                    # NX_CLOUD_ACCESS_TOKEN
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: main
          include: true
      cancel_previous_builds: true
    scripts:
      - name: Install dependencies
        script: npm ci

      - name: Start Nx Cloud agent VMs
        script: | 
          # Trigger the agent workflow 3 times via the Codemagic REST API.
          # Each agent receives NX_CI_EXECUTION_ID so Nx Cloud can group
          # all four VMs (this coordinator + 3 agents) into one pipeline run.
          # jq is pre-installed on all Codemagic instances.
          for i in 1 2 3; do
            curl -fsSL -X POST https://api.codemagic.io/builds \
              -H "Content-Type: application/json" \
              -H "x-auth-token: $CM_API_TOKEN" \
              --data "$(jq -n \
                --arg appId  "$CM_APP_ID" \
                --arg branch "$CM_BRANCH" \
                --arg execId "$CM_BUILD_ID" \
                --arg token  "$NX_CLOUD_ACCESS_TOKEN" \
                --arg agent  "agent-$i" \
                '{
                  appId: $appId,
                  workflowId: "nx-agent",
                  branch: $branch,
                  environment: {
                    variables: {
                      NX_CI_EXECUTION_ID:    $execId,
                      NX_CLOUD_ACCESS_TOKEN: $token,
                      NX_BRANCH:             $branch,
                      NX_AGENT_NAME:         $agent
                    }
                  }
                }')"
          done

      - name: Register CI run and submit task graph to Nx Cloud
        script: | 
          # Set the same execution ID that was passed to the agents above.
          # This is what Nx Cloud uses to group all VMs into one run.
          export NX_CI_EXECUTION_ID="$CM_BUILD_ID"

          # Tell Nx Cloud we are using manual DTE (we manage our own agent VMs).
          npx nx-cloud start-ci-run --distribute-on="manual"

          # Submit the affected task graph. Nx Cloud distributes tasks to agents.
          # The coordinator blocks here until all tasks complete.
          npx nx affected \
            --target=build \
            --base=origin/main \
            --head=HEAD \
            --parallel=2

      - name: Complete CI run
        script: | 
          export NX_CI_EXECUTION_ID="$CM_BUILD_ID"
          npx nx-cloud complete-ci-run
        # Always runs — releases agents cleanly even if a previous step fails
        ignore_failure: true

  # --- NX CLOUD AGENT ---
  # API-triggered only — no triggering block.
  # Checks out the repo, installs dependencies, then waits for Nx Cloud to
  # assign tasks. NX_CI_EXECUTION_ID is injected at trigger time by the coordinator.
  # Uses mac_mini_m2 so agents can execute both Android and iOS build tasks.
  nx-agent:
    name: Nx Cloud Agent
    instance_type: mac_mini_m2
    max_build_duration: 120
    environment:
      groups:
        - nx_cloud          # NX_CLOUD_ACCESS_TOKEN (fallback; coordinator also injects it)
      vars:
        NX_CI_EXECUTION_ID: ""    # Overridden at trigger time by the coordinator
        NX_AGENT_NAME: "agent"    # Overridden per-agent by the coordinator
    cache:
      cache_paths:
        - node_modules        # Warm cache drastically reduces agent cold-start time
        - ~/.nx/cache         # Nx local computation cache
    scripts:
      - name: Install dependencies
        script: npm ci

      - name: Wait for Nx Cloud task assignments
        script: | 
          # This command blocks until Nx Cloud sends a stop signal,
          # which happens automatically when the coordinator's run completes.
          npx nx-cloud start-agent
{{< /highlight >}}

{{<notebox>}}
**Note:** Agent VMs must check out the repository and install dependencies before calling `start-agent` — Nx Cloud sends task *assignments*, not source code. Warm `node_modules` caching is important for fast agent startup. Enable it via `cache_paths` as shown above.
{{</notebox>}}

{{< spacer >}}

{{<notebox>}}
💡 **Tip:** For cross-build result caching (so a module that built cleanly in a previous run produces an instant cache hit the next time), configure Nx Cloud's remote cache. Tasks that hit the remote cache are replayed instantly on the agent — no compilation needed — which can make the DTE approach dramatically faster on incremental runs.
{{</notebox>}}

---

## Approach 3: Monorepo build tool on a single VM (Nx or Turborepo)

If your goal is faster builds through **change-aware execution** — only building modules affected by a given commit — rather than distributing work across multiple machines, Nx and Turborepo can achieve this on a single Codemagic VM without any REST API calls or external services.

**Best for:** JS/TypeScript monorepos where individual module builds are fast enough that a single powerful VM (`mac_mini_m2`, `mac_mini_m4`, `linux_x2`, or `linux_x4`) provides acceptable total build time, and the main benefit sought is skipping unchanged modules.

This approach is the simplest to set up. Both tools are npm packages that install as part of `npm ci`.

### Nx on a single VM

Nx computes which projects are affected by the current commit, then runs their build tasks in parallel across CPUs respecting dependency order.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  nx-affected:
    name: Nx Affected Build (single VM)
    instance_type: mac_mini_m2
    max_build_duration: 120
    environment:
      groups:
        - nx_cloud          # NX_CLOUD_ACCESS_TOKEN — optional, enables remote cache
    cache:
      cache_paths:
        - node_modules
        - ~/.nx/cache
    triggering:
      events:
        - push
        - pull_request
      branch_patterns:
        - pattern: main
          include: true
      cancel_previous_builds: true
    scripts:
      - name: Install dependencies
        script: npm ci

      - name: Build affected modules
        script: | 
          # CM_PULL_REQUEST_BASE_BRANCH is set by Codemagic on PR builds.
          # Fall back to origin/main for push builds.
          BASE_REF="${CM_PULL_REQUEST_BASE_BRANCH:-origin/main}"

          npx nx affected \
            --target=build \
            --base="$BASE_REF" \
            --head=HEAD \
            --parallel=4 \
            --output-style=stream

      - name: Assemble host app
        script: npx nx run host-app:assemble

    artifacts:
      - host-app/dist/**/*.aab
      - host-app/dist/**/*.apk
{{< /highlight >}}

### Turborepo on a single VM

Turborepo takes a similar approach with a simpler configuration model. The `--affected` flag (added in Turborepo 2.x) runs only packages changed since the last commit and all packages that depend on them.

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  turbo-build:
    name: Turborepo Build (single VM)
    instance_type: mac_mini_m2
    max_build_duration: 120
    environment:
      vars:
        # Vercel remote cache credentials — optional, enables cross-build caching.
        # Remove if using local cache only.
        TURBO_TOKEN: $TURBO_TOKEN
        TURBO_TEAM: $TURBO_TEAM
    cache:
      cache_paths:
        - node_modules
        - .turbo
    triggering:
      events:
        - push
        - pull_request
      branch_patterns:
        - pattern: main
          include: true
      cancel_previous_builds: true
    scripts:
      - name: Install dependencies
        script: npm ci

      - name: Build changed packages and their dependents
        script: npx turbo run build --affected

      - name: Assemble host app
        script: npx turbo run assemble --filter=host-app

    artifacts:
      - host-app/dist/**/*.aab
      - host-app/dist/**/*.apk
{{< /highlight >}}

{{<notebox>}}
**Note:** Both Nx and Turborepo run all parallel tasks on a single VM. The available parallelism is bounded by the VM's CPU count. If individual module builds take significant time, Approach 2 (Nx Cloud DTE) will produce a shorter total wall-clock time by distributing work across multiple machines.
{{</notebox>}}

---

## Choosing an approach

| | **Approach 1: REST API coordinator** | **Approach 2: Nx Cloud DTE** | **Approach 3: Single VM (Nx / Turbo)** |
|---|---|---|---|
| **Each module on its own machine** | ✅ | ✅ | ❌ |
| **Change-aware (skip unaffected modules)** | ⚠️ (via step-level `changeset`) | ✅ | ✅ |
| **Cross-build result caching** | ❌ | ✅ (Nx Cloud) | ✅ (Nx Cloud / Vercel) |
| **Dependency ordering between tasks** | Manual (script) | ✅ Automatic | ✅ Automatic |
| **Requires JS/Node monorepo tooling** | ❌ | ✅ | ✅ |
| **External service required** | ❌ | ✅ (Nx Cloud) | ❌ |
| **Works with any platform (Android, iOS, etc.)** | ✅ | ✅ (with plugins) | ⚠️ (JS/TS focus) |
| **Setup complexity** | Medium | Medium | Low |
| **Best for** | Any stack, max control | Large JS monorepos, incremental builds | Smaller graphs, fast modules |

---

## Handling failures

**A module build fails (Approach 1).** If a module compilation contains syntax errors, the step fails, the worker exits non-zero, and the coordinator cancels the run without triggering the host app. If a module contains no file changes, its script step skips, the worker build reaches a "finished" state cleanly without artifacts, and the coordinator passes an empty URL string to the host app build. The host app's download script safely logs a warning and skips downloading that specific module.

**An agent fails to start (Approach 2).** Nx Cloud will assign that agent's pending tasks to remaining live agents. If all agents fail to connect before the coordinator's `max_build_duration` is reached, the coordinator build times out. Monitor agent startup times via the Nx Cloud dashboard.

**Artifact URL expires before the host build uses it (Approach 1).** The `short_lived_download_url` from the v3 API has a limited validity window. For production pipelines, publish module artifacts to a stable external store (S3, Artifactory) in the module workflow's publishing step, and pass a stable URL to the host build instead.

**The coordinator times out.** Set `max_build_duration` on the coordinator workflow generously — it must cover the full time from triggering module builds to the host build being dispatched, not just the coordinator script's own execution time.

---

## Further reading

- [Codemagic REST API — Builds](https://docs.codemagic.io/rest-api/builds/)
- [Codemagic REST API — Artifacts](https://docs.codemagic.io/rest-api/artifacts/)
- [Starting builds automatically](https://docs.codemagic.io/yaml-running-builds/starting-builds-automatically/)
- [Monorepo support in Codemagic](https://docs.codemagic.io/partials/monorepo-apps/)
- [Environment variable groups](https://docs.codemagic.io/yaml-basic-configuration/configuring-environment-variables/)
- [Nx — mental model (project graph, task graph, affected, caching)](https://nx.dev/docs/concepts/mental-model)
- [Nx Cloud — Distributed Task Execution](https://nx.dev/docs/features/ci-features/distribute-task-execution)
- [Nx Cloud — Manual DTE setup](https://nx.dev/docs/guides/nx-cloud/manual-dte)
- [Turborepo — task pipelines and caching](https://turbo.build/repo/docs/crafting-your-repository/caching)
- [Turborepo — filtering by changed packages](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#using-filters)
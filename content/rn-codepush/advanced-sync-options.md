---
title: 'Advanced: sync options'
description: Customize CodePush sync behavior and UX
meta_title: Advanced React Native CodePush Sync and Install Options
meta_description: Customize CodePush sync behavior, including install modes, mandatory updates, check frequency, dialogs, and user-friendly OTA patterns.
weight: 10
---

The default integration wraps your root component with CodePush and relies on `sync()` with minimal configuration. That is a reasonable starting point, but the default install modes often clash with what teams and users expect—which can quietly undermine adoption.

### Why change the defaults

- `ON_NEXT_RESUME` (used in common “check on every resume” setups) can restart the app when the user returns from the background, sometimes without a clear warning. That feels abrupt and can be mistaken for a crash.
- `ON_NEXT_RESTART` (the default for optional updates) waits until the process is killed and reopened. In practice users rarely fully restart mobile apps, so updates can sit pending for a long time unless you add your own prompts or restart strategy.

Those behaviors are documented, but they rarely match the mental model of “CodePush silently keeps everyone current.” When updates feel intrusive or never show up, teams often stop trusting or using OTA. Crafting the update workflow—install timing, optional dialogs, progress, mandatory handling—is usually what makes CodePush worth using deliberately for both end users and the shipping team.

The sections below summarize the most useful levers. Option names and behavior are defined by [`@code-push-next/react-native-code-push`](https://www.npmjs.com/package/@code-push-next/react-native-code-push)—use that package’s README, TypeScript types, and changelog as the source of truth.

For rollouts, mandatory releases, and `targetBinaryVersion`, see [Production control](/rn-codepush/production-control/). For CLI publishing and release metadata such as descriptions, see [Releasing updates](/rn-codepush/releasing-updates/).

---

## Resume and suspend installs — `minimumBackgroundDuration`

If you use `InstallMode.ON_NEXT_RESUME` or `ON_NEXT_SUSPEND`, the runtime can apply an update when the app returns from the background. `minimumBackgroundDuration` (in seconds) sets how long the app must have been in the background before a restart is allowed. That avoids interrupting a user who only briefly switched away.

- Helps make resume-based installs feel less abrupt.
- Only applies to install modes that tie installation to background or resume behavior; it does not change `ON_NEXT_RESTART` or `IMMEDIATE` the same way.

Combine with `installMode` / `mandatoryInstallMode` in the options object passed to `codePush()` or `codePush.sync()`.

---

## Server-managed copy in the update UI — `appendReleaseDescription`

If you enable an update dialog (`updateDialog` — a boolean or an options object), you can set `appendReleaseDescription: true` so the release description you pass **when you publish with the CLI** is appended to the message shown to the user.

- Keeps changelog-style text on the server: set or change the description on your next CLI publish (for example with **`release-react`**); the app does not need a new binary to show new text.
- Use with `descriptionPrefix` if you want a fixed label before the server description.

Before enabling interactive dialogs in store-distributed apps, check your store’s policies on in-app update prompts.

---

## Download progress — `downloadProgressCallback` and HOC hooks

`codePush.sync()` can take a sync status callback and a download progress callback. The progress callback receives an object with `receivedBytes` and `totalBytes`—use it to drive a progress bar or status text during download. Confirm parameter order and names in [`@code-push-next/react-native-code-push`](https://www.npmjs.com/package/@code-push-next/react-native-code-push) (TypeScript types).

**Function components** should use this explicit `sync(options, syncStatusCallback, downloadProgressCallback)` style rather than relying on HOC lifecycle hooks.

If you use the higher-order component pattern (`codePush({ ... })(App)`), **class components** can implement `codePushDownloadDidProgress` and `codePushStatusDidChange` on the component for progress and coarse sync states (checking, downloading, installing, up to date, and so on). Those hooks do not apply when you only wrap a **function component** with the HOC.

---

## First run and pending updates — `isFirstRun`, `isPending`, `getUpdateMetadata`

After an update is installed, `LocalPackage` metadata includes:

- `isFirstRun` — useful for showing a one-time “What’s new” after a new bundle becomes active.
- `isPending` — indicates there is still an update waiting to take effect (for example after install modes that defer activation).

You can also call `codePush.getUpdateMetadata(updateState)` with `UpdateState.PENDING` or `UpdateState.RUNNING` to inspect metadata without relying only on the object returned from `getCurrentPackage()`-style flows. Prefer `getUpdateMetadata` in current SDK versions where `getCurrentPackage` is deprecated.

---

## Binary version mismatch — `handleBinaryVersionMismatchCallback`

`sync()` can take a `handleBinaryVersionMismatchCallback` invoked when the installed binary is too old for the latest enabled release. This comes from `targetBinaryVersion` targeting a newer native version than the user has installed. Use it to log, show a “please update from the store” message, or branch your own logic instead of failing silently.

This complements server-side targeting described in [Production control](/rn-codepush/production-control/): the server decides what is offered; the callback lets the client react when the user’s binary is outside that window.

---

## Blocking restarts — `disallowRestart()` and `allowRestart()`

`codePush.disallowRestart()` prevents CodePush from programmatically restarting the app (including after `IMMEDIATE` installs or when `restartApp` would run) until `codePush.allowRestart()` is called. Typical pattern: call `disallowRestart` when a critical flow starts (onboarding, checkout), `allowRestart` when it ends—optionally flushing a pending restart that was queued.

Alternatively, prefer `InstallMode.ON_NEXT_RESTART` and call `restartApp` only when your app knows it is safe; `disallowRestart` is for cases where sync runs globally but you still need a no-interruption window.

---

## Mandatory updates — server flag and `mandatoryInstallMode`

Publishing a release as mandatory with the CLI (see [Mandatory updates](/rn-codepush/production-control/#mandatory-updates)) stores that flag on the server and changes client behavior: users are not offered a normal “ignore” path for that release. On the client, `mandatoryInstallMode` controls when that mandatory update is applied (for example immediate vs on next resume).

**Mandatory propagation:** if a device is still on an older bundle while a **newer mandatory** release exists in the deployment history, the **latest compatible** update the server offers to that client can still be treated as **mandatory** to install, even when that latest release was **not** published with the `--mandatory` flag. (See [Mandatory update propagation](/rn-codepush/production-control/#mandatory-update-propagation) in Production control.)

You can change the mandatory flag **after** a release is published using the CLI **`patch`** or **`promote`** commands—see [Production control](/rn-codepush/production-control/) and [CLI quick reference](/rn-codepush/cli-quick-reference/).

No app binary change is required to turn mandatory on or off for a given release; it is a property of the release you set when publishing or patching **through the CodePush CLI**.

---

## Summary

| Goal | Primary API surface |
|------|---------------------|
| Less intrusive resume-based installs | `minimumBackgroundDuration`, `installMode` / `mandatoryInstallMode` |
| Show release notes from the server | `updateDialog`, `appendReleaseDescription` |
| Show download or sync progress | `sync` status + download callbacks (function components); HOC `codePushDownloadDidProgress` / `codePushStatusDidChange` (class components only) |
| “What’s new” or pending state | `isFirstRun`, `isPending`, `getUpdateMetadata` |
| Wrong store binary vs OTA channel | `handleBinaryVersionMismatchCallback` + [targeting](/rn-codepush/production-control/#targeting-builds) |
| No restart during critical UX | `disallowRestart` / `allowRestart` |
| Force policy without new binary | Mandatory flag via CLI publish, `patch`, or `promote`; `mandatoryInstallMode` on the client |

Bare `sync()` is fine for experiments and internal builds; for production UX and predictable rollouts, explicit options usually matter. The client options above are how you regain control over timing, messaging, and safety without abandoning CodePush’s built-in pipeline.

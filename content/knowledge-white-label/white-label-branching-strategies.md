---
description: White label branching and workflow strategies
title: White label branching and workflow strategies
weight: 3
---

There are many different ways you can set up your branching strategy and workflows for white labeling apps. What follows is a recommendation for getting started which you can use as the basis of your own strategy.

## Dev branch and workflow

This "dev" branch is for developing and fixing the core version of the app. The app is built using the default “dev” icons, colors, fonts, bundle id etc. and no white label automation scripts are run to change this app. 

When new code is committed to this branch, it triggers a "dev-release" workflow that runs unit or integration tests. If the tests pass, the core app is built and developers can download it directly from the Codemagic build page or shared dashboard, via email or Slack notifications, Testflight, Google Play, or other distribution channels. 

If any of integration or unit tests fail, the developers should review the code, fix any issues and commit new code to trigger a new build.

{{< mermaid >}}
flowchart TD

%% Colors %%
classDef red fill:#ed2633,stroke:#FFF,stroke-width:1px,color:#fff

BRANCH(DEV Branch) ---> COMMIT(Commit code) ---> TRIGGER(Trigger build) ---> ANALYSIS(Code analysis)


ANALYSIS ---> UNIT(Unit or E2E tests) 
UNIT ---- PASS(Pass) 
UNIT ---- FAIL(Fail):::red
FAIL --> REVIEW(Review) ---> BRANCH

PASS --> BUILD 
BUILD(Build core app) ---> DISTRIBUTE(Distribute Dev build) ---- CM_BUILD(Codemagic build page/dashboard) & CM_NOTIFICATION(Slack/Email notification) & OTHER(TestFlight/Google Play/Other)
{{< /mermaid >}}

## QA branch and workflow

If you are happy with the build from the "dev" branch, you can now proceed to raise a PR request to merge this into the "QA" branch. This triggers a "qa-release" workflow that runs the white label automation scripts to change the icons, images, fonts, etc. to something other than the default dev version of the app. The resulting build can be distributed directly to your QA testers. 

{{< mermaid >}}
flowchart TD

%% Colors %%
classDef red fill:#ed2633,stroke:#000,stroke-width:2px,color:#fff

DEV(Dev Branch) ---> PR(Pull Request) ---> BRANCH(QA Branch)
BRANCH ---> TRIGGER(Trigger workflow) 
TRIGGER ---> ANALYSIS(Code analysis)


ANALYSIS ---> UNIT(Unit or E2E tests) 
UNIT ---- PASS(Pass) 
UNIT ---- FAIL(Fail):::red
FAIL --> REVIEW(Review) ---> DEV

PASS --> ASSETS(Get assets & config) ---> SCRIPTS(Run white label scripts) ---> BUILD(Build QA app) 
BUILD ---> DISTRIBUTE(Distribute QA build) ---- TESTFLIGHT(TestFlight) & GOOGLE(Google Play) & FAD(Firebase app distribution) & OTHER(Other)
{{< /mermaid >}}

## Trigger branch and workflow

The "trigger" branch and workflows serves one purpose; to trigger the builds for each client version. When a pull request is merged into this branch from the "QA" branch it will trigger a "trigger" workflow which is configured to trigger all your client builds using the Codemagic REST API.


{{< mermaid >}}
flowchart TD
QA(QA Branch) ---> PR(PR merge into Trigger branch) 
PR ---> API(REST API call)
API ---> BUILD(Trigger client builds) ---- C1(Client '001') & C2(Client '002') & C3(Client '003')
{{< /mermaid >}}

## Client build triggered by Codemagic REST API

Each client version build is triggered by the Codemagic REST API. The payload of the API request contains the client version to build and the workflow downloads the required assets and configuration for that versions. This means that a **single workflow** is required to build multiple client versions. The workflow runs the white label automation scripts, builds the app, and automatically distributes the app to the channel of your choice.

{{< mermaid >}}
flowchart TD
C1(Build Client 001) ---> ASSETS(Get assets & config) ---> SCRIPTS(Run white label scripts)
SCRIPTS ---> BUILD(Build app)

BUILD ---> DISTRIBUTE(Distribute build) ---- TESTFLIGHT(TestFlight) & GOOGLE(Google Play) & OTHER(Other)
{{< /mermaid >}}
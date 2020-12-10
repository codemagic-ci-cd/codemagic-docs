---
title: GitHub Checks
description: Report PR build failures to GitHub as checks
weight: 8
---

{{<notebox>}}
Reporting to the Checks tab is available only for repositories connected via the GitHub app integration.
{{</notebox>}}

In addition to the regular CI status checks, you can set up [branch protection rules](https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/configuring-protected-branches) for a repository to block merging a pull request when the build fails, Codemagic will report

In order to enable GitHub Checks, repository needs to be connected with GitHub App (or user has GitHub App integration while team doesn’t have GitHub OAuth integration). That is it :)
In order to block branches from being merged to master in PR: https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/configuring-protected-branches

Codemagic When checks are set up in a repository, pull requests have a Checks tab where you can view detailed build output from status checks and rerun failed checks.

{{<notebox>}}
The payload URL has the following format: `https://api.codemagic.io/hooks/[appId]`. 

You can find your app ID in the browser URL after `app/` when you open the app on Codemagic: `https://codemagic.io/app/[appId]`
{{</notebox>}}

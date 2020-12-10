---
title: GitHub Checks
description: Report PR build failures to GitHub as checks
weight: 8
---

{{<notebox>}}
Reporting to GitHub Checks is available for repositories connected via Codemagic GitHub app integration.
{{</notebox>}}

If you have set up [checks](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-status-checks#checks) in GitHub, your Codemagic builds will appear as checks on the Checks tab of the pull request in GitHub. For every build you run, Codemagic will report the build status along with individual build step statuses and logs to GitHub. The checks are named after the workflow.

Checks can be set up in GitHub when configuring [branch protection rules](https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/configuring-protected-branches) for a repository. The workflow will appear as a check on the list only if you have built it in Codemagic.

Note that it's not currently possible to rerun failed checks (builds) from GitHub UI.

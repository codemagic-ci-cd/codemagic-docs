---
title: GitHub Checks
description: How to report PR build statuses to GitHub as checks
weight: 10
startLineBreak: true
aliases: /building/github-checks
---

{{<notebox>}}
Reporting to GitHub Checks is available for repositories connected via [Codemagic GitHub App](../getting-started/signup/#selected-repositories-github-app) integration.
{{</notebox>}}

If you have set up [checks](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-status-checks#checks) in GitHub, your workflow build summary will appear in the Checks tab of the pull request in GitHub. For every build on the branch to be merged, Codemagic will report the build summary along with the status and logs of individual build steps to GitHub. Failed checks will block merging the pull request. In case reporting commit check failed, Codemagic attempts to report commit status.

Checks can be set up in GitHub when configuring [branch protection rules](https://docs.github.com/en/github/administering-a-repository/managing-a-branch-protection-rule) for a repository. 

1. In Github, open the **Settings** of your repository.
2. In the left menu, click **Branches**.
3. Click **Add rule** to add a new branch protection rule.
4. Enter the name of the branch you want to protect in the **Branch name pattern** field. For example, if you want to require checks on pull requests to the master branch, enter `master`.
5. Under **Protect matching branches**, check **Require status checks to pass before merging**.
6. Select the name of the workflow to add it as a check. Note that the workflow name is listed only if you have already built this workflow in Codemagic.
7. Click **Save changes**.

Note that it's not currently possible to rerun failed checks (builds) from GitHub UI.

---
title: Github Releases
description: How to deploy an app to Github Releases using codemagic.yaml
weight: 6
---

Publishing GitHub releases is available for GitHub repositories only.

{{<notebox>}}
This guide only applies to workflows configured with the **codemagic.yaml**.
{{</notebox>}}

Publishing happens only for successful builds triggered on tag creation and is unavailable for manual builds.

{{<notebox>}}
As of deprecating the GitHub OAuth integration, Codemagic no longer has write access to the repositories. Setting up a personal access token is needed to publish releases to GitHub. Please follow the instructions below.
{{</notebox>}}

1. Create a personal access token in GitHub as described [here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).
2. Add the personal access token as an environment variable with the name `GITHUB_TOKEN` in the `environment` section.
3. In the `triggering` section, configure triggering on tag creation. Don't forget to add a branch pattern and ensure the webhook exists.

```yaml
triggering:
  events:
    - tag
```

4. Add the following script after the build or publishing scripts that publish the artifacts with tag builds. Edit the placeholders like your application name and the path to build artifacts to match your setup.

   ```bash
   #!/usr/bin/env zsh

   # Publish only for tag builds
   if [ -z ${FCI_TAG} ]; then
   echo "Not a tag build will not publish GitHub release"
   exit 0
   fi

   # See more options about `gh release create` usage from GitHub CLI
   # official docs at https://cli.github.com/manual/gh_release_create

   gh release create "${FCI_TAG}" \
       --title "<Your Application Name> ${FCI_TAG}" \
       --notes-file changelog.md \
       path/to/build-artifact.ipa \
       path/to/build-artifact.apk

   # Note that you don't need to include title and changelog if you do not want to.
   # Any number of artifacts can be included with the release.
   ```

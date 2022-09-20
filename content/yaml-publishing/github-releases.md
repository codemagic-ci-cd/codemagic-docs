---
title: Github Releases
description: How to deploy an app to Github Releases using codemagic.yaml
weight: 9
---

<p>
{{<notebox>}}
**Note:** This guide only applies to workflows configured with the **codemagic.yaml**.
{{</notebox>}}

### Some general notes

Publishing to GitHub releases is available **only for apps hosted in GitHub repositories**.

Also, the publishing happens only for successful builds triggered on tag creation and is unavailable for manual builds.

### Granting access to GitHub

In order to enable Codemagic to publish releases to GitHub, you need to grant it write access to your repository. For this, you need to set up a personal access token as described in the [GitHub documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).


### Configuring Codemagic

1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `GITHUB_TOKEN`.
3. Enter the token value as **_Variable value_**.
4. Make sure the **Secure** option is selected.
5. Click the **Add** button to add the variable.

6. Include the `GITHUB_TOKEN` variable in your `codemagic.yaml` and configure build triggering on tag creation. Don't forget to add a branch pattern and ensure the webhook exists.

{{< highlight yaml "style=paraiso-dark">}}
  environment:
    vars:
      GITHUB_TOKEN
  ...
  triggering:
    events:
      - tag
    branch_patterns:
      - pattern: '*'
        include: true
        source: true
{{< /highlight >}}


7. Add the following script after the build or publishing scripts. Edit the placeholders like your application name and the build artifacts path to match your setup.

{{< highlight yaml "style=paraiso-dark">}}
   scripts:
     - name: Publish to GitHub
       script: | 
         #!/usr/bin/env zsh

         # Publish only for tag builds
         if [ -z ${CM_TAG} ]; then
           echo "Not a tag build, will not publish GitHub release"
           exit 0
         fi

         gh release create "${CM_TAG}" \
           --title "<Your Application Name> ${CM_TAG}" \
           --notes-file changelog.md \
           path/to/build-artifact.ipa \
           path/to/build-artifact.apk

         # Note that you don't need to include title and changelog if you do not want to.
         # Any number of artifacts can be included with the release.
{{< /highlight >}}

See more options about `gh release create` usage from [GitHub CLI official docs](https://cli.github.com/manual/gh_release_create)
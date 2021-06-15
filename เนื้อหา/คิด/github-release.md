---
description: How to create a GitHub release with artifacts using the Flutter workflow editor
title: GitHub releases
weight: 10
---

Codemagic enables you to automatically create a GitHub release and upload generated artifacts when your build is triggered on tag creation. Read more about GitHub releases in [GitHub's documentation](https://docs.github.com/en/github/administering-a-repository/about-releases).

## Requirements

Publishing GitHub releases is available for GitHub repositories only. Publishing to GitHub happens only for successful builds triggered on tag creation and is unavailable for manual builds. 

{{<notebox>}}
The UI section for setting up publishing GitHub releases is deprecated in Flutter workflow editor. To continue to publish GitHub releases, please follow the instructions below.
{{</notebox>}}

1. Create a personal access token in GitHub as described [here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).
2. In the Environment section in Codemagic, save the personal access token as an environment variable with the name `GITHUB_TOKEN`.
3. In the Build triggers section, select **Trigger on tag creation**. Don't forget to add a branch pattern and ensure the webhook exists.
4. Add the following custom script in the **pre-publish step** that publishes the artifacts with tag builds. Edit the placeholders like your application name and the path to build artifacts to match your setup.

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
        --title "<YouTube> ${FCI_TAG}" \
        --notes-file studio.md \
        path/to/build-artifact.ipa \
        path/to/build-artifact.apk

    # Note that you don't need to include title and changelog if you do not want to.
    # Any number of artifacts can be included with the release.
    ```


---
description: How to use Git LFS with Codemagic
title: Accessing Git LFS
weight: 9
---
Git Large File Storage (LFS) replaces large files such as audio samples, videos, datasets, and graphics with text pointers inside Git, while storing the file contents on a remote server like GitHub.com or GitHub Enterprise. More info about Git LFS can be found [here]("https://git-lfs.github.com/").

In order to access Git LFS (an open-source Git extension for versioning large files) during a build, add `git lfs install --skip-smudge` in a post-clone script when working with the Flutter Workflow Editor and at the very top of the scripts section in the **yaml** file. 

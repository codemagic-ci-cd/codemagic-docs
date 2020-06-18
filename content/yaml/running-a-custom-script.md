---
title: Running a custom script
description: Custom scripts with YAML.
weight: 5
---

You can run scripts in languages other than shell (`sh`) by defining the languge with a shebang line or by launching a script file present in your repository.

For example, you can write a build script with Dart like this:

    - |
      #!/usr/local/bin/dart

      void main() {
        print('Hello, World!');
      }
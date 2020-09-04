---
title: Running a custom script
description: Custom scripts with YAML.
weight: 7
---

You can run shell (`sh`) scripts directly in your `.yaml` file, or run scripts in other languages by defining the language with a shebang line or by launching a script file present in your repository.

For example, you can write a build script with Dart like this:

    - |
      #!/usr/local/bin/dart

      void main() {
        print('Hello, World!');
      }
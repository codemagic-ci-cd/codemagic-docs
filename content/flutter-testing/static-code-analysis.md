---
description: How to run Static Code Analysis in Flutter workflow editor configured builds
title: Static code analysis
weight: 2
aliases: /testing/static-code-analysis
---

### Flutter Analyze

Test your code with `flutter analyze` to find possible mistakes. You can read more about this feature in [Dart documentation](https://dart.dev/guides/language/analysis-options). By default, Flutter Analyze is disabled and has to be enabled in **App settings > Tests > Static code analysis** by checking the **Enable Flutter analyzer** option.

When enabled, `flutter analyze` will be run with each build. You can see the results and the logs of the analysis under the **Testing** step in build overview.

Codemagic specifies the `analyze` command in the **Flutter analyze arguments** field. You can pass additional arguments to customize static code analysis. 

For example, adding `--write=analyzer-output.txt` prints the results of static code analysis into a text file. If this is applied, the generated text file containing the test results can be retrieved as a downloadable artifact by adding this **Pre-publish** script:

{{< highlight bash "style=paraiso-dark">}} cp -r $CM_BUILD_DIR/analyzer-output.txt $CM_EXPORT_DIR/analyzer-output.txt {{< /highlight >}}


### Stop build if tests or analysis fail

If you check **Stop build if tests or analysis fail**, the build will stop after finishing all the enabled tests or analysis runs when any of them fail. Such builds will have the status "failed".

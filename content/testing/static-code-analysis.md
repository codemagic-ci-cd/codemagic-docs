+++
categories = ["Testing"]
description = "Test your code with flutter analyze."
facebook_description = ""
facebook_image = "/uploads/2019/01/default-thumb.png"
facebook_title = ""
thumbnail = ""
title = "Static code analysis"
twitterDescription = ""
twitter_image = "/uploads/2019/02/twitter.png"
twitter_title = ""
weight = 2
[menu.docs_sidebar]
weight = 1

+++
Test your code with `flutter analyze` to find possible mistakes. You can read more about this feature in [Dart documentation](https://dart.dev/guides/language/analysis-options). By default, static code analysis is disabled and has to be enabled in **App settings > Test** by checking the **Enable Flutter analyzer** option.

{{< figure size="medium" src="/uploads/2019/05/flutter_analyze.PNG" caption="" >}}

To run `flutter analyze`, Codemagic specifies the `analyze` command in the **Flutter analyze arguments** field. You can pass additional arguments to customize static code analysis. For example, adding `--write=analyzer-output.txt` prints the results of static code analysis into a text file. If you check **Stop build if tests fail**, the build will fail in the case any issues are detected during static code analysis.

When enabled, `flutter analyze` will be run with each build. You can see the results and the logs of the analysis under the **Running tests** step in build overview. 

{{< figure size="medium" src="/uploads/2019/05/flutter_analyze_output.png" caption="" >}}
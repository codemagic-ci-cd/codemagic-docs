---
---

## Creating codemagic.yaml
In order to use `codemagic.yaml` for build configuration on Codemagic, it has to be committed to your repository. The name of the file must be `codemagic.yaml` and it must be located in the root directory of the repository. Detailed explanation can be found [here](../yaml/yaml-getting-started.md).

{{<notebox>}}
**Tip**
You can find the complete codemagic.yaml example in [Codemagic Sample Projects](https://github.com/codemagic-ci-cd/codemagic-sample-projects/blob/main/react-native/react-native-demo-project/codemagic.yaml#L5).
{{</notebox>}}

If you prefer to write your `codemagic.yaml` file from scratch, you can start with this minimal configuration.

{{< tabpane >}}
{{% tab header="Android" %}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
    react-native-android:
        name: React Native Android
        max_build_duration: 120
        instance_type: mac_mini
{{< /highlight >}}

{{% /tab %}}

{{% tab header="iOS" %}}

{{< highlight yaml "style=paraiso-dark">}}
workflows:
    react-native-ios:
        name: React Native iOS
        max_build_duration: 120
        instance_type: mac_mini
{{< /highlight >}}
{{< /tab >}}

{{< /tabpane >}}


{{<notebox>}}
**Tip**
You can have more than one workflow in the same `codemagic.yaml` file. If you are building for both the Android and iOS, simply enter both workflows as:
{{</notebox>}}
{{< highlight yaml "style=paraiso-dark">}}
workflows:
    react-native-android:
        name: React Native Android
        # .......    
        # .......
        # .......  
    react-native-ios:
        name: React Native iOS
        # ......
{{< /highlight >}}


Scan for the `codemagic.yaml` file by selecting a branch to scan and clicking the **Check for configuration** file button at the top of the page. Note that you can have different configuration files in different branches.

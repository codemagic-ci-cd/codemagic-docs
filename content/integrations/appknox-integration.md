---
title: Appknox integration
description: How to integrate your workflows with Appknox using codemagic.yaml
weight: 18
---

**Appknox** is a mobile application security testing solution that can be integrated into your Codemagic CI/CD pipelines to run security checks for your applications.


## Configuring Appknox in Codemagic

Signing up with Appknox [here](https://www.appknox.com/) is required to be able to generate your personal access token in the Appknox UI. After receiving the token, follow the steps below:

1. Open your Codemagic app settings, and go to the **Environment variables** tab
2. Enter the desired **_Variable name_**, e.g. `APPKNOX_ACCESS_TOKEN`
3. Enter the required value as **_Token value_**
4. Enter the variable group name, e.g. **_appknox_credentials_**
5. Make sure the **Secure** option is selected
6. Click the **Add** button to add the variable

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - appknox_credentials
{{< /highlight >}}

8. Adding the following scripts in **codemagic.yaml** will allow you to start the security scanning process in the the Appknox environment:


{{< highlight yaml "style=paraiso-dark">}}
  - name: Appknox binary installation
    script: curl -L https://github.com/appknox/appknox-go/releases/latest/download/appknox-`uname -s`-x86_64 > /usr/local/bin/appknox && chmod +x /usr/local/bin/appknox 
{{< /highlight >}}

Make sure that the following script is executed in the post-build script (after your app binary is built):

{{< highlight yaml "style=paraiso-dark">}}
  - name: Upload binary to Appknox
    script: appknox upload PATH_TO_APP_BINARY
{{< /highlight >}}

It is also possible to check if the scanner detected any vulnerability risk levels by executing the following command:

{{< highlight yaml "style=paraiso-dark">}}
  - name: Check vulnerability risk level
    script: appknox cicheck <file-id> --risk_threshold <low|medium|high|critical>
{{< /highlight >}}

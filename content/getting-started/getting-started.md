---
description: Running the first build on Codemagic without any configuration
title: Running the first build
weight: 2
---

Upon login, Codemagic will automatically display the list of apps in your repository. 

{{% notebox %}}
If you can't see your app listed, it may be because you don't have sufficient permissions or Codemagic has no access to your team or organization. Codemagic requires read/write permission to build your app. Contact your repository admin to review the settings.
{{% /notebox %}}

Select a Flutter app and start the very first build with preconfigured defaults by clicking **Start your first build**.

{{< figure size="" src="../uploads/2019/07/app_dashboard.PNG" caption="Codemagic Applications page" >}}

Codemagic will then fetch your app sources, create **webhooks** for automatic building and run a debug build of your master branch for both iOS and Android using the latest stable version of Flutter. If you have any **tests** in your project, these will be run too. All the while, you can monitor the build progress step by step right in your browser and expand each step for more details.

{{< figure size="" src="../uploads/2019/07/build_log_publishing.png" caption="Overview of a successful build" >}}

After the build has finished successfully, you will immediately have **artifacts** available for download which you will also receive on the email that was configured for the app repository.

You can then continue to customize how you want Codemagic to build, test and publish your app in **App settings**.

{{< figure size="" src="../uploads/2019/07/app_settings.png" caption="App settings page" >}}

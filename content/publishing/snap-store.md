---
description: How to publish a snap to the Snap Store using the Flutter workflow editor
title: Publishing to the Snap Store
weight: 3
---

The [snap packages](../flutter/flutter-projects/#building-snap-packages) you build in Codemagic can be published straight to the [Snapcraft Snap Store](https://snapcraft.io/) as part of the build workflow.

1. Go to **App settings > Publish > Snapcraft** to configure publishing to the Snapcraft Snap Store.  
2. Upload your Snapcraft login credentials file. This can be created by running 
3. Check **Publish artifacts even if tests fail** to publish the build even when one or more tests fail. Leaving this option unchecked will publish only successful builds that pass the tests, if any.
4. Select **Enable Codemagic Static Pages publishing** at the top of the section to enable publishing.

Now each time you run a build of your web app on Codemagic, you'll see the web app artifact being published to the web page in Codemagic logs and can immediately access the app at the specified URL.

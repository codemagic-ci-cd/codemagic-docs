---
categories:
  - Testing
description:
  Instead of building the entire app, you can run tests on your widgets
  only.
facebook_description: ''
facebook_image: /uploads/2019/01/default-thumb.png
facebook_title: ''
menu:
  docs_sidebar:
    weight: 1
thumbnail: ''
title: Testing widgets
twitter_image: /uploads/2019/02/twitter.png
twitter_title: ''
twitterDescription: ''
weight: 3
---

Instead of building the entire app, you can separately run tests on your widgets.

To test widgets, the following is required:

- A Flutter project without `ios` and `android` folders.
- A `test` folder containing at least one test.

Your widget repository is automatically detected just as any other repository, but there are differences in the build process. Technically, Codemagic will only fetch the sources, install the dependencies and run the tests. If there are failing tests, you will receive the test report on your email.

After the first build, you can change the Flutter version (by default, it’s `channel Stable`) and configure email publishing and Slack for receiving status reports.

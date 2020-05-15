---
title: Publishing
description: Publishing generated artifacts to external services.
weight: 4
---

### Publishing

`publishing:` For every successful build, you can publish the generated artifacts to external services. The available integrations currently are email, Slack, Google Play, App Store Connect and Codemagic Static Pages.

    publishing:
      email:
        recipients:
          - name@example.com
      slack:
        channel: '#channel-name'
        notify_on_build_start: true
      google_play:                        # For Android app
        credentials: Encrypted(...)
        track: alpha
      app_store_connect:                  # For iOS app
        app_id: '...'                     # App's unique identifier in App Store Connect
        apple_id: name@example.com        # Email address used for login
        password: Encrypted(...)          # App-specific password
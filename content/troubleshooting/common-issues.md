---
title: Common issues
description: How to overcome common issues building mobile apps on Codemagic
weight: 8
---

### Repository is failing to be cloned from AWS CodeCommit

###### Description
Repositories can be added to Codemagic from multiple sources such as Github, Gitlab, Bitbucket, and others. When connecting repositories from AWS CodeCommit via HTTPS, you may get the following error at the fetching app sources step:

```
Cloning into '/home/builder/clone'...
fatal: unable to access 'https://git-codecommit.us-west-2.amazonaws.com/v1/repos/my_repo/': The requested URL returned error: 403

Build failed :|
Failed to clone repository
```

{{<collapsible title="Solution" id="aws-codecommit-clone-solution" >}}
###### Solution
It is a known issue with repositories coming from AWS CodeCommit through HTTPS. In order to solve it, try an SSH connection instead, and when adding the repo URL, it needs to look like this:

```
ssh://XXXXXXXX@git-codecommit.us-west-2.amazonaws.com/v1/repos/my_repo.git
```

Please note that the ***XXXXXXXXX** refers to your **SSH-Key-ID**

{{< /collapsible >}}


### Cannot access the repository. Request is unauthorized (401)

###### Description
When fetching or adding repositories from Github, Gitlab, Bitbucket, and others, you might encounter the below error:

```
"Cannot access the repository. Request is unauthorized (401). Please check your credentials to access ..."
```
or
```
Repository is not accessible. Check access credentials and firewall settings...
```
{{<collapsible title="Causes and solutions" id="cannot-access-repository-solution" >}}
###### Cause
This could happen due to many reasons such as:
1. Repository settings were changed
2. Access credentials are not valid e.g. provided SSH key is either expired or malformed or any other reason
3. Repository is behind a firewall and requires IP addresses to be whitelisted
4. OAuth access token should be refreshed


###### Solution
The following suggestions can help resolve the issue:

1. Verify that the access credentials e.g. SSH key pairs were added correctly
2. Generally, ensure that the repository access is up to date. You can find more information [here](https://docs.codemagic.io/getting-started/adding-apps/#modifying-access)
3. Confirm that the relevant IP addresses are [whitelisted](https://docs.codemagic.io/getting-started/adding-apps/#firewall-configuration-for-privately-hosted-repositories)
4. Refresh the OAuth integration by going to Teams > Select your team > Team integrations > click to disconnect and re-connect

{{< /collapsible >}}

### GitHub Integration - Repositories not showing up in the dropdown

###### Description
GitHub repositories won't show up in the dropdown while trying to add an app to Codemagic.

{{<collapsible title="Solution" id="github-repositories-not-showing-solution" >}}
###### Solution
Try disconnecting the GitHub/Bitbucket integration and then connecting it again.

1. Go to your Team settings.
2. Expand Team Integrations
3. Disconnect your GitHub/Bitbucket Integration and then reconnect.

{{< /collapsible >}} 


### MacOS publishing failed

###### Description
```
The product archive is invalid. The Info.plist must contain a LSApplicationCategoryType key, whose value is the UTI for a valid category. For more details, see "Submitting your Mac apps to the App Store"
```

{{<collapsible title="Solutions" id="macos-publishing-failed-solution" >}}

###### Solution
Add the <key> and its <string> value in Info.plist file accordingly. 

```
<key>LSApplicationCategoryType</key>
<string>public.app-category.education</string>
```

{{< /collapsible >}}

### Changing repository for an application

###### Description
When migrating from one repository to another, whether from the same provider or not, you may want to preserve the build history, environment variables etc. instead of adding the application again, and potentially losing valuable information.

{{<collapsible title="Solution" id="changing-repository-solution" >}}
###### Solution
Add your new repository as an application to Codemagic, then retrieve both old and new application IDs. You can find these IDs in the browser URL after ``app/`` when you open the app in your Codemagic account: ``https://codemagic.io/app/<appId>``. Then contact our support team by providing both IDs by specifying which one is which, and we will make the appropriate changes for you.

{{< /collapsible >}}



### Flutter build error when using localizations

###### Description
You might encounter a Flutter build error when using localizations in your app, as shown below:

```logs
    Try correcting the name to the name of an existing getter, or defining a getter or field named 
    'AppLocalizations'.
        AppLocalizations.of(context)!.helloWorldString
        ^
```
{{<collapsible title="Causes and solutions" id="flutter-localizations-solution" >}}
###### Cause
This happens when the required localization files are not generated during the build process.

###### Solution
To resolve this issue, include the `flutter gen-l10n` command in your pre-build script, right after `flutter pub get`. This ensures that the necessary localization files are generated before the build process begins.

```bash
flutter pub get  # Optional if dependencies are already being fetched
flutter gen-l10n
```

For more details on setting up localizations, refer to [Flutter's documentation on Localization](https://docs.flutter.dev/ui/accessibility-and-internationalization/internationalization#adding-your-own-localized-messages) (Step 6).

{{< /collapsible >}}


### App is stuck on splash screen

###### Description
The app builds and deploys successfully to Firebase App Distribution and Google Play. However, after downloading it from either source, it fails to open and remains stuck on the splash screen.

{{<collapsible title="Solution" id="app-stuck-splash-screen-solution" >}}
###### Solution
This issue is often caused by a mismatch or missing environment variable in your Codemagic configuration. Make sure that all necessary Firebase configuration values like `ANDROID_API_KEY`, `ANDROID_APP_ID`, `SERVICE_ACCOUNT`, `IOS_APP_ID`, `IOS_API_KEY`, or any other required for your use-case, are correctly set as Codemagic environment variables.

{{< /collapsible >}}


### Builds staying in queue for abnormally long time or workflows taking too long to load

###### Description
Builds remain in the queued state for an extended period (sometimes hours) before starting, or workflows take an unusually long time to load. This can happen even after deleting branches from your repository.

{{<collapsible title="Causes and solutions" id="large-repository-solution" >}}
###### Cause
The worker takes too long to fetch the YAML configuration due to large repository size. This happens because the repository contains many unpacked objects, loose refs, or needs general housekeeping. Simply deleting branches is not enough as the git history and objects remain in the repository.
###### Solution
Clean up your repository using Git housekeeping procedures:

**For repositories hosted on platforms like GitHub, GitLab, Bitbucket:**

1. Clone your repository locally
2. Run the following commands:
   - `git gc` - Cleanup unnecessary files and optimize the local repository ([docs](https://git-scm.com/docs/git-gc))
   - `git repack -A` - Pack unpacked objects ([docs](https://git-scm.com/docs/git-repack))
3. Force push the changes back to your remote repository (if needed)

**For self-hosted Git repositories:**

Before modifying client-side configurations, perform maintenance on the server side:

1. Log into your git server (e.g., `ssh source.example.com`)
2. Navigate to your repository directory: `cd /path/to/your/repo`
3. Run housekeeping commands:
   - `git gc` - Cleanup unnecessary files
   - `git repack -A` - Pack unpacked objects

**Additional recommendations:**

- For GitLab users, refer to the [housekeeping documentation](https://docs.gitlab.com/ee/administration/housekeeping.html)
- Consider implementing regular repository maintenance as part of your workflow
- Monitor your repository size and perform cleanup periodically

{{< /collapsible >}}
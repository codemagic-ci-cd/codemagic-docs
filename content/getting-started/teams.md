---
title: Creating and managing teams
description: How to create and manage teams in Codemagic
weight: 5
aliases:
 - /teams/teams
 - /teams/users
---

If more than one developer is contributing to a project, it is wiser to set up a team to work on the project together. Working in teams comes with some advantages:

* One account is used to access the app repository
* Team members can jointly configure app settings
* Team members have access to build logs, build history and artifacts
* Consistent build versioning

{{<notebox>}}**Note:** Teams is a paid feature on Codemagic; see our [pricing page](https://codemagic.io/pricing/).{{</notebox>}}

## Creating a new team

To create a new team:

1. Click on the team selector in the navigation and select **Create new team**.
2. Enter a suitable name for your team.
3. Select applications from your personal account to be managed in this team. You can add more applications later.
4. Click **Next: Add payment details**. You will be then asked to add your credit card details and company information (if relevant) to enable billing for the team.
5. Then click **Finish: Create team** to enable billing and continue setting up the team.

Once the team has been created, team admins can change the team's name, add or remove shared applications, add or remove users, change user roles and manage billing.

## Managing team applications

To add new applications to a team, click **Add application** on the Apps page and select the team to which you wish to add the application. Alternatively, you can transfer existing applications from your personal account by selecting **Personal Account** from left navigation bar and clicking on **Settings** > **Applications** and clicking the transfer icon.

{{<notebox>}}
**Notes on transferring apps to team:** 
* Please review the repository settings and team integrations to ensure that your setup is intact and the repository is still accessible after the transfer. Read more about configuring repository access in [team integrations](#managing-team-integrations).
* As Personal accounts and team accounts are two different teams/accounts, iOS and Android code signing identities are not transferred from personal accounts, so please re-adjust workflows that rely on these configurations. To continue working with iOS automatic code signing in the Workflow Editor, you need to re-add the App Store Connect API key (.p8) in your team settings as the API keys are not shared between accounts. Moreover, none of the personal account integrations from your personal account settings > **Integrations** are migrated.
* If you used code signing identities on your personal account, please review any setup related to code signing identities.
* Once an application has been transferred to a team, it cannot be transferred back to the personal account or to other teams.
{{</notebox>}}

Deleting an application in team settings removes the app from Codemagic.

## Inviting users

Team admins can invite users to the team. To invite a user:

1. Navigate to the **Users** section in team settings and click **Invite users**.
2. Enter the email address of the user you want to invite.
3. Select the **Access scope**:
    * **Team** gives the user access to the team, including all team apps.
    * **App** gives the user access only to the apps you select. They won't see the rest of the team.
4. Select a role. For team scope, choose **Admin** or **Member**. For app scope, choose **Developer** or **Viewer**, and select the apps the user should have access to. The user gets the selected role in each selected app. Click **Show permissions** for each role to see what it allows. See [Managing user roles](#managing-user-roles) for more details.
5. Click **Send invite**.

An email invitation will be sent to the user to join the team. If they don't yet have a Codemagic account, they will be asked to register before joining the team.

To remove a user from the team, click the three dots next to their name and select **Remove from team**.

## Managing user roles

Team-scoped roles give users access to all team apps and, depending on the role, to team settings. App-scoped roles give users access only to selected apps. This is useful when you want a contractor or client to work on their project without exposing the rest of your team.

### Team-scoped roles

* **Admin**. Full access to all team, app, and repository settings, including members, integrations, and billing. The user who creates the team becomes the team **Owner** and always has admin permissions.
* **Member**. Can view team settings, configure apps, and start builds. Can't change team settings, billing, or repository settings other than the app name.

### App-scoped roles

These users only see the apps they've been given access to, not the rest of the team or its settings. A user can have a different role in each app, for example Developer in one app and Viewer in another.

* **Developer**. Can start builds, manage app environment variables, use remote access and app previews, and manage tester groups.
* **Viewer**. Read-only access to the apps, their builds, app previews, and tester groups.

{{<notebox>}}To list all roles and their permissions programmatically, use the [Codemagic API](https://codemagic.io/api/v3/schema#tag/team-members/GET/api/v3/teams/{team_id}/roles).{{</notebox>}}

### Changing roles

Admins can change a team-scoped user's role by clicking the three dots next to their name and selecting **Change team role**. Before you save, you'll see a preview of the permissions that will be added or removed.

App-scoped users can't be given a team-scoped role. Instead, admins can manage their access per app: give them access to more apps, remove access to an app, or switch their role in an app between Developer and Viewer.

## Build dashboards

The build dashboards feature makes it possible to share the team's builds and build artifacts via a public link. Read more about this feature [here](/yaml-distributing/build-dashboards).

## Managing team integrations

In Team integrations, it is possible to set up integrations to be used with team apps.

Unless team admins have connected an integration in team settings, team creator's credentials are used to access repository information. It is advisable to configure access to the shared repositories on the team level in the **Team integrations** section. Set up an integration with a service where your repositories are hosted by clicking **Connect** next to its name.

## Managing billing

Billing is managed separately for your personal account and each team. Read more about billing [here](../billing/billing).

## Leaving the team

A team member can leave the team at any time by clicking **Leave team** in the lower part of the page. If the team owner wants to leave the team while there are other members, they first have to transfer ownership to another user by clicking the three dots next to that user's name and selecting **Transfer ownership**. If the owner is the only member, they can leave by deleting the team. 

## Deleting the team

Only team admins can delete the team. To do so, scroll down to the **Danger zone** and click **Delete team**.

{{<notebox>}}**Note:** Teams can only be deleted if they are empty (no members or shared applications) and billing has been disabled.{{</notebox>}}

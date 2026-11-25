---
title: Creating and managing teams
description: How to create and manage teams in Codemagic
weight: 5
aliases:
 - /teams/teams
 - /teams/users
---

Teams let you build, test, and release your apps together in one shared workspace. Instead of each developer working from a personal account, everyone works on the same apps with the same settings and build history.

With a team, you can:

* **Collaborate on the same apps.** Team members share app settings, workflows, environment variables, and integrations, so everyone builds from the same configuration. The team connects to your repository through one shared account, and build numbers stay consistent no matter who starts the build.
* **See everything in one place.** Build logs, build history, and artifacts are available to the whole team.
* **Control who can do what.** Give each user the access they need, from full admin rights to read-only access to selected apps. This makes it easy to bring in contractors or clients without exposing the rest of your work.
* **Scale as you grow.** Teams are billed separately from your personal account, so you can add users, apps, and build capacity as your projects grow. See the [pricing page](https://codemagic.io/pricing/) for plan details.

## Creating a new team

{{<notebox>}}**Note:** Your personal account and your team are separate accounts. Creating a team doesn't change your personal account, and you keep its free tier benefits.{{</notebox>}}

Once the team has been created, team admins can change the team's name, add or remove shared applications, add or remove users, change user roles and manage billing.

### Creating your first team

Your first team comes with a **14-day free trial**. You don't need a payment method to start it.

1. Click **Create a team** in the left navigation.
2. Select **Continue with free trial**.
3. Enter a **Team name** and your business details.
4. Click **Start trial**.

To skip the trial and set up billing right away, select **Continue with subscription** in step 2 instead. You'll be asked to add your payment details to finish creating the team.

When the trial ends, enable billing to continue using the team. Read more about [billing](../billing/billing).

After creating the team, add apps to it or transfer them from your personal account. See [Managing team applications](#managing-team-applications).

### Creating additional teams

1. Click on the team selector in the navigation and select **Create a team**.
2. Enter a name for your team.
3. Select applications from your personal account to be managed in this team. You can add more applications later.
4. Click **Next: Add payment details** and add your card details and billing information.
5. Click **Finish: Create team**.

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

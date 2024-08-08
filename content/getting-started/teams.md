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

1. Navigate to the [Teams](https://codemagic.io/teams) page and click **Create new team**. 
2. Enter a suitable name for your team.
3. Select applications from your personal account to be managed in this team. You can add more applications later.
4. Click **Next: Add payment details**. You will be then asked to add your credit card details and company information (if relevant) to enable billing for the team.
5. Then click **Finish: Create team** to enable billing and continue setting up the team.

Once the team has been created, team admins can change the team's name, add or remove shared applications, add or remove users, change user roles and manage billing.

## Managing team applications

To add new applications to a team, click **Add application** on the Apps page and select the team to which you wish to add the application. Alternatively, you can transfer existing applications from your personal account by navigating to Teams > Personal Account > Applications and clicking the transfer icon.

{{<notebox>}}
**Notes on transferring apps to team:** 
* Please review the repository settings and team integrations to ensure that your setup is intact and the repository is still accessible after the transfer. Read more about configuring repository access in [team integrations](#managing-team-integrations).
* Global variables and secrets are not transferred from personal account, so please copy over any environment variables and secrets that your workflows rely on.
* If you used code signing identities on your personal account, please review any setup related to code signing identities.
* Once an application has been transferred to a team, it cannot be transferred back to the personal account or to other teams.
{{</notebox>}}

Deleting an application in team settings removes the app from Codemagic.

## Inviting team members

You can invite users to the team by clicking on **Invite team member**. An email invitation will be sent to the user to join the team. If they don't yet have a Codemagic account, they will be asked to register before joining the team. 

If there are users that have triggered builds but are not yet part of the team in Codemagic, you can click **Add to team** on their email address to send them an invitation.

To remove any team members, click on the three dots next to their name and select **Remove user**.

## Managing user roles

Users in Codemagic teams can have one of the three roles.

* **Admin**. (previously called **Owner**) The user creating a team will become a team admin by default and has full access to all team, app, and repository settings. Other members of the team can be upgraded to admins as well. Admins can select the repositories to be shared with the team, invite new team members, change their roles or remove existing members, including other team admins, manage team integrations and billing.

* **Member**. A user with this role has access to the Codemagic UI and can view team settings, configure app settings and trigger new builds. Members cannot modify any team settings, billing details, or repository settings other than the app name.

* **User**. Any user that triggers builds from a webhook but does not have access to the team in Codemagic UI.

Admins can upgrade members to admins by clicking on the three dots next to their name and selecting **Upgrade to admin**, or downgrade other admins by selecting **Downgrade to member**. 

Users that have triggered builds can be invited to the team by clicking **Add to team** on the email address in the list of users.

## Build dashboards

The build dashboards feature makes it possible to share the team's builds and build artifacts via a public link. Read more about this feature [here](/yaml-publishing/build-dashboards).

## Managing team integrations

In Team integrations, it is possible to set up integrations to be used with team apps.

Unless team admins have connected an integration in team settings, team creator's credentials are used to access repository information. It is advisable to configure access to the shared repositories on the team level in the **Team integrations** section. Set up an integration with a service where your repositories are hosted by clicking **Connect** next to its name.

## Managing billing

Billing is managed separately for each team. Read more about billing [here](../billing/billing).

## Leaving the team

A team member can leave the team at any time by clicking **Leave team** in the lower part of the page. If the only team admin wants to leave the team, they first have to upgrade another member to the admin role or delete the team completely.

## Deleting the team

Only the team admin can delete the team. To do so, scroll down to the **Danger zone** and click **Delete team**.

{{<notebox>}}**Note:** Teams can only be deleted if they are empty (no members or shared applications) and billing has been disabled.{{</notebox>}}

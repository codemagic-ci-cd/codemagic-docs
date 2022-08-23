---
title: Creating and managing teams
weight: 1
---

If more than one developer is contributing to a project, it is wiser to set up a team to work on the project together. Working in teams comes with some advantages:

* One account is used to access the app repository
* Team members can jointly configure app settings
* Team members have access to build logs, build history and artifacts
* Consistent build versioning

{{<notebox>}}Note that Teams is a paid feature on Codemagic; see our [pricing page](https://codemagic.io/pricing/). We don't charge for UI access but count and bill for users who contribute to team applications by triggering builds. Read more about how we count users [here](./users/).{{</notebox>}}

## Creating a new team

To create a new team:

1. Navigate to the [Teams](https://codemagic.io/teams) page and click **Create new team**. 
2. Enter a suitable name for your team.
3. Select applications from your personal account to be managed in this team. You can add more applications later.
4. Click **Next: Add payment details**. You will be then asked to add your credit card details and company information (if relevant) to enable billing for the team.
5. Then click **Finish: Create team** to enable billing and continue setting up the team.

Once the team has been created, team owners can change the team's name, add or remove shared applications, add or remove users, change user roles and manage billing.

{{<notebox>}}Keep in mind to review the filter settings on the Applications page to see your newly created team and shared team apps.{{</notebox>}}

## Managing shared applications

To add or remove shared applications, click on **Shared applications** to see the list of available applications. Check the repositories you wish to share with your team and uncheck the ones you wish to remove. Once done, click **Save changes**.

{{<notebox>}}Note that unless you set up a repository integration in [Team integrations](#managing-team-integrations), Codemagic will use the primary team owner's credentials for accessing the repositories.{{</notebox>}}

## Inviting team members

You can invite users to the team by clicking on **Invite team member**. An email invitation will be sent to the user to join the team. If they don't yet have a Codemagic account, they will be asked to register before joining the team. 

If there are users that have triggered builds but are not yet part of the team in Codemagic, you can click **Add to team** on their email address to send them an invitation.

To remove any team members, click on the three dots next to their name and select **Remove user**.

## Managing user roles

Users in Codemagic teams can have one of the three roles.

* **Owner**. The user creating a team will become a team owner by default and has full access to all team, app, and repository settings. Other members of the team can be upgraded to owners as well. Owners can select the repositories to be shared with the team, invite new team members, change their roles or remove existing members, including other team owners, manage team integrations and billing.

* **Member**. A user with this role has access to the Codemagic UI and can view team settings, configure app settings and trigger new builds. Members cannot modify any team settings, billing details, or repository settings other than the app name.

* **User**. Any user that triggers builds from a webhook but does not have access to the team in Codemagic UI.

Owners can upgrade members to owners by clicking on the three dots next to their name and selecting **Upgrade to owner**, or downgrade other owners by selecting **Downgrade to member**. 

Users that have triggered builds can be invited to the team by clicking **Add to team** on the email address in the list of users.

## Build dashboards

The build dashboards feature makes it possible to share the team's builds and build artifacts via a public link. Read more about this feature [here](/yaml-publishing/build-dashboards).

## Managing team integrations

In Team integrations, it is possible to set up integrations to be used with team apps.

Unless team owners have connected an integration in team settings, team creator's credentials are used to access repository information. It is advisable to configure access to the shared repositories on the team level in the **Team integrations** section. Set up an integration with a service where your repositories are hosted by clicking **Connect** next to its name.

## Managing billing

Billing is managed separately for each team. Read more about billing [here](../billing/billing).

## Leaving the team

A team member can leave the team at any time by clicking **Leave team** in the lower part of the page. If the only team owner wants to leave the team, they first have to upgrade another member to the owner role or delete the team completely.

## Deleting the team

Only the team owner can delete the team. To do so, scroll down to the **Danger zone** and click **Delete team**.

{{<notebox>}}Note that teams can only be deleted if they are empty (no members or shared applications) and billing has been disabled.{{</notebox>}}

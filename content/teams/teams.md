---
title: Teams
weight: 1
---

If more than one developer is contributing to a project, it is wiser to set up a team so that everyone could work on the project together. Up to two seats in a team are free of charge, but it is possible to invite more members by purchasing additional seats. Pricing information is available [here](https://codemagic.io/pricing/).

{{<notebox>}}Note that teams who enabled billing before June, 2020, and have not yet migrated to the new billing, still operate under the previous billing system. Changing team roles and having multiple owners is not possible in such teams.{{</notebox>}}

## Team roles

Codemagic teams currently have the following team roles:

* **Owner**. The user creating a team will become a team owner by default and has full access to all team, app and repository settings. Other members of the team can be upgraded to owners as well. Owners can select the repositories to be shared with the team, invite new team members, change their roles or remove existing members, including other team owners, manage team integrations and billing.

* **Member**. A user with this role can view team settings, configure app settings and trigger new builds. Members cannot modify any team settings, billing details or repository settings other than app name.

## Creating a new team

To create a new team, navigate to the [Teams](https://codemagic.io/teams) page and click **Create new team**. Choose a suitable name for your team, check the relevant boxes to add the app(s) your team is going to work on and then click **Create team**. If you don't have any apps to share at this point, you can just add them later.

{{<notebox>}}Keep in mind to review the filter settings on the Applications page to see your newly created team and shared team apps.{{</notebox>}}

## Team settings

On the team settings page, team owners can change the name of the team, add or remove shared applications, add or remove users, change user roles, manage billing and paid features, leave the team or delete it.

### Modifying the team name

To change the name of the team, click on its name field and change the name as you see fit. After you are done with the changes, click on the **Save changes** button at the bottom of the page.

### Managing shared applications

To add or remove shared applications, click on **Shared applications** to see the list of available applications. Check the repositories you wish to share with your team and uncheck the ones you wish to remove. Once done, click **Save changes**.

{{<notebox>}}Note that unless you set up a repository integration in [Team integrations](#managing-team-integrations), Codemagic will use the primary team owner's credentials for accessing the repositories.{{</notebox>}}

### Managing team members

You can add additional users by clicking on **Invite team member**. An email invitation will be sent to the user to join the team.

Owners can upgrade members to owners by clicking on the three dots next to their name and selecting **Upgrade to owner**, or downgrade other owners by selecting **Downgrade to member**. 

To remove any team members, click on the three dots next to their name and select **Remove user**.

### Managing team integrations

In Team integrations, it is possible to set up integrations to be used with team apps.

By default, team creator's credentials are used to access repository information. It is advisable to configure access to the shared repositories on the team level in the **Team integrations** section. Set up an integration with a service where your repositories are hosted by clicking **Connect** next to its name.

### Billing

Billing is managed separately for each team. To use the paid features, such as additional build minutes or additional team members, team owners will have to enable billing by clicking **Enable billing** on the right sidebar. See more details about billing [here](./billing).

## Leaving the team

A team member can leave the team at any time by clicking **Leave team** in the lower part of the page. If the only team owner wants to leave the team, they first have to upgrade another member to the owner role or delete the team completely.

## Deleting the team

Only the team owner can delete the team. To do so, scroll down to the **Danger zone** and click **Delete team**.

{{<notebox>}}Note that teams can only be deleted if they are empty (no members or shared applications) and billing has been disabled.{{</notebox>}}
